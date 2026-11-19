"""Edge8 Tickets helper.

Lets the sprint trackers in the Tickets folder save their Assignee picks and status
changes from any browser, Firefox included. A tracker page opened from disk sends the
change here and this program writes it into the tracker file. It only ever rewrites a
card's data-assignees attribute, its status chip (with the matching class on the card)
and its Last updated field (and, since v4, the text of a <textarea class="answer"
data-card="N">, for the Q&A pages in AFK\\End), only in .html files directly inside the
Tickets folder or the AFK\\End folder, and
only for pages opened from disk (Origin: null). A save that changes a card stamps that
card's Last updated field with the time; a tracker from before the field is left as it is.

Lives only while a tracker is open. Opening a tracker starts it through the
edge8-tickets: link (registered under HKCU\\Software\\Classes), and every open tracker
holds a WebSocket to /presence. Once no tracker has been open in any browser for GRACE
seconds it exits; a copy that no tracker reaches within STARTUP seconds exits too.
Listens on http://127.0.0.1:47613. A second copy exits at once, so starting it twice is
harmless.

Usage: pythonw tickets-helper.pyw [--dir FOLDER] [--port PORT] [--grace S] [--startup S]
"""

import argparse
import base64
import hashlib
import html
import json
import os
import re
import socket
import struct
import threading
import time
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit
from urllib.request import url2pathname

DEFAULT_DIR = os.path.join(os.path.expanduser("~"), "Documents", "Edge8", "Tickets")
# Q&A pages whose answer boxes save through this helper too.
EXTRA_DIRS = (os.path.join(os.path.expanduser("~"), "Documents", "Edge8", "AFK", "End"),)
DEFAULT_PORT = 47613
GRACE = 5  # a reloading tracker reconnects well within this
STARTUP = 20  # the tracker that started it connects within seconds, even in Firefox
VERSION = 4
WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

STATUS = {"todo": "TO DO", "doing": "DOING", "waiting": "WAITING", "done": "DONE"}
TINT = ("waiting", "done")  # statuses the card's own class repeats, for its left edge
WEEKDAYS = ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
MONTHS = ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

TAG = re.compile(r"<span\b[^>]*>")
ARTICLE = re.compile(r"<article\b[^>]*>")
CLASS = re.compile(r'\sclass="([^"]*)"')
IS_ASSIGNEE = re.compile(r'\sclass="assignee"')
CARD = re.compile(r'\sdata-card="([^"]*)"')
VALUE = re.compile(r'\sdata-assignees="([^"]*)"')
IS_UPDATED = re.compile(r'\sclass="field updated"')
STAMP = re.compile(r'\sdata-updated="([^"]*)"')
TITLE = re.compile(r"<title\b[^>]*>(.*?)</title\s*>", re.S | re.I)
SPACE = re.compile(r"[\t\n\f\r ]+")  # the whitespace document.title collapses
CARD_ID = re.compile(r"[\w-]{1,20}")
ORIGINS = (None, "null", "file://")  # pages opened from disk (Chrome sends file:// on WebSockets)
LOCK = threading.Lock()
ANSWER = re.compile(r"<textarea\b[^>]*>")
IS_ANSWER = re.compile(r'\sclass="answer"')
ANSWER_MAX = 20000


class Refused(Exception):
    def __init__(self, status, message, code=None):
        super().__init__(message)
        self.status = status
        self.message = message
        self.code = code


def escape(value):
    return value.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")


def classes_of(tag):
    m = CLASS.search(tag)
    return m.group(1).split() if m else []


def with_classes(tag, names):
    m = CLASS.search(tag)
    return tag[: m.start()] + ' class="' + " ".join(names) + '"' + tag[m.end() :]


def cards_in(text):
    """Every card's assignees in the file, as {card number: "Name, Name"}."""
    out = {}
    for m in TAG.finditer(text):
        tag = m.group(0)
        card = CARD.search(tag)
        if IS_ASSIGNEE.search(tag) and card and card.group(1) not in out:
            value = VALUE.search(tag)
            out[card.group(1)] = html.unescape(value.group(1)) if value else ""
    return out


def patch(text, card, value):
    """Swap one card's data-assignees value; None if the card is not in the file."""
    attr = 'data-assignees="' + escape(value) + '"'
    for m in TAG.finditer(text):
        tag = m.group(0)
        found = CARD.search(tag)
        if not IS_ASSIGNEE.search(tag) or not found or found.group(1) != card:
            continue
        if VALUE.search(tag):
            new = re.sub(r'data-assignees="[^"]*"', lambda _: attr, tag, count=1)
        else:
            new = tag[:-1] + " " + attr + ">"
        return text[: m.start()] + new + text[m.end() :]
    return None


def status_chips(text):
    """(match, card, status) for each <span class="status KEY" data-card="N">LABEL</span>."""
    for m in TAG.finditer(text):
        names = classes_of(m.group(0))
        card = CARD.search(m.group(0))
        if names[:1] == ["status"] and card:
            yield m, card.group(1), next((c for c in names[1:] if c in STATUS), "")


def statuses_in(text):
    """Every card's status in the file, as {card number: "doing"}."""
    out = {}
    for _, card, key in status_chips(text):
        out.setdefault(card, key)
    return out


def patch_status(text, card, key):
    """Set one card's status chip, and the tint on its card; None if the chip is not in the file."""
    for m, found, _ in status_chips(text):
        if found != card:
            continue
        end = text.find("</span>", m.end())
        if end < 0 or "<" in text[m.end() : end]:
            return None  # a chip holds its label only
        names = [c for c in classes_of(m.group(0)) if c not in STATUS]
        names.insert(1, key)
        out = text[: m.start()] + with_classes(m.group(0), names) + STATUS[key] + text[end:]
        art = None
        for a in ARTICLE.finditer(out, 0, m.start()):
            art = a
        if art and CLASS.search(art.group(0)) and "</article>" not in out[art.end() : m.start()]:
            names = [c for c in classes_of(art.group(0)) if c not in STATUS]
            if key in TINT:
                names.append(key)
            out = out[: art.start()] + with_classes(art.group(0), names) + out[art.end() :]
        return out
    return None


def shown(when):
    """A time as a card shows it, in the writer's own clock: Sun 11 Oct, 21:40."""
    return "%s %d %s, %02d:%02d" % (WEEKDAYS[when.weekday()], when.day, MONTHS[when.month - 1], when.hour, when.minute)


def updated_in(text):
    """Every card's Last updated time in the file, as {card number: "2026-10-11T21:40:05+07:00"}."""
    out = {}
    for m in TAG.finditer(text):
        tag = m.group(0)
        card = CARD.search(tag)
        if IS_UPDATED.search(tag) and card and card.group(1) not in out:
            value = STAMP.search(tag)
            out[card.group(1)] = html.unescape(value.group(1)) if value else ""
    return out


def patch_updated(text, card, when):
    """Stamp one card's <span class="field updated" data-card="N" data-updated="…">Last
    updated <b>…</b></span> with when; the text as it was if the card has no such field."""
    for m in TAG.finditer(text):
        tag = m.group(0)
        found = CARD.search(tag)
        if not IS_UPDATED.search(tag) or not found or found.group(1) != card:
            continue
        end = text.find("</span>", m.end())
        if end < 0:
            return text
        attr = 'data-updated="' + when.isoformat(timespec="seconds") + '"'
        if STAMP.search(tag):
            new = re.sub(r'data-updated="[^"]*"', lambda _: attr, tag, count=1)
        else:
            new = tag[:-1] + " " + attr + ">"
        return text[: m.start()] + new + "Last updated <b>" + shown(when) + "</b>" + text[end:]
    return text


def answers_in(text):
    """Every answer box's text in the file, as {card id: "text"}."""
    out = {}
    for m in ANSWER.finditer(text):
        card = CARD.search(m.group(0))
        if IS_ANSWER.search(m.group(0)) and card and card.group(1) not in out:
            end = text.find("</textarea>", m.end())
            if end >= 0:
                out[card.group(1)] = html.unescape(text[m.end() : end])
    return out


def patch_answer(text, card, value):
    """Swap one answer box's text; None if the box is not in the file."""
    for m in ANSWER.finditer(text):
        found = CARD.search(m.group(0))
        if not IS_ANSWER.search(m.group(0)) or not found or found.group(1) != card:
            continue
        end = text.find("</textarea>", m.end())
        if end < 0:
            return None
        return text[: m.end()] + html.escape(value, quote=False) + text[end:]
    return None


def tidy(title):
    """A title as the page's document.title gives it: whitespace runs collapsed, ends trimmed."""
    return SPACE.sub(" ", title).strip(" ")


def title_of(text):
    m = TITLE.search(text)
    return tidy(html.unescape(m.group(1))) if m else ""


def tracker_path(folder, url_path):
    """The tracker file a page's location.pathname points to, if this helper serves it."""
    if not isinstance(url_path, str) or not url_path.startswith("/"):
        raise Refused(400, "the page sent no file path.")
    path = os.path.realpath(url2pathname(url_path))
    folders = folder if isinstance(folder, tuple) else (folder,)
    inside = os.path.normcase(os.path.dirname(path)) in [os.path.normcase(f) for f in folders]
    if not inside or not path.lower().endswith(".html"):
        raise Refused(403, "the Tickets helper only saves pages in " + " or ".join(folders) + ".", "outside")
    if not os.path.isfile(path):
        raise Refused(404, os.path.basename(path) + " is not on disk any more.")
    return path


def read(path):
    with open(path, "rb") as f:
        data = f.read()
    bom = data.startswith(b"\xef\xbb\xbf")
    try:
        return (data[3:] if bom else data).decode("utf-8"), bom
    except UnicodeDecodeError:
        raise Refused(409, os.path.basename(path) + " is not UTF-8 text.")


def write(path, text, bom):
    data = (b"\xef\xbb\xbf" if bom else b"") + text.encode("utf-8")
    temp = os.path.join(os.path.dirname(path), "." + os.path.basename(path) + ".saving")
    with open(temp, "wb") as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    try:
        os.replace(temp, path)
    except PermissionError:
        # Another program holds the file without letting it be replaced: write in place.
        with open(path, "wb") as f:
            f.write(data)
        os.remove(temp)


def check_title(path, text, title):
    if title_of(text) != tidy(title or ""):
        raise Refused(409, os.path.basename(path) + " on disk is a different page now. Reload it.")


def save(folder, body, names, states, answers=None):
    """Write a page's changes into its tracker; the file's text afterwards."""
    path = tracker_path(folder, body.get("path"))
    answers = answers or {}
    if not isinstance(names, dict) or not isinstance(states, dict) or not isinstance(answers, dict):
        raise Refused(400, "the change names no card.")
    if not (names or states or answers):
        raise Refused(400, "the change names no card.")
    for card, value in answers.items():
        if not CARD_ID.fullmatch(card) or not isinstance(value, str) or len(value) > ANSWER_MAX:
            raise Refused(400, "answer " + str(card)[:20] + " is invalid or too long.")
    for card, value in names.items():
        if not CARD_ID.fullmatch(card) or not isinstance(value, str) or len(value) > 500:
            raise Refused(400, "card " + str(card)[:20] + " has an invalid value.")
        if any(ord(ch) < 32 for ch in value):
            raise Refused(400, "card " + card + " has an invalid value.")
    for card, key in states.items():
        if not CARD_ID.fullmatch(card) or not isinstance(key, str) or key not in STATUS:
            raise Refused(400, "card " + str(card)[:20] + " has an invalid status.")
    with LOCK:
        text, bom = read(path)
        check_title(path, text, body.get("title"))
        out = text
        changed = []  # the cards this save really changes, to stamp
        for card, value in names.items():
            new = patch(out, card, value)
            if new is None:
                raise Refused(409, "card " + card + " is no longer in the file. Reload the page.")
            if new != out and card not in changed:
                changed.append(card)
            out = new
        for card, key in states.items():
            new = patch_status(out, card, key)
            if new is None:
                raise Refused(409, "card " + card + "'s status is no longer in the file. Reload the page.")
            if new != out and card not in changed:
                changed.append(card)
            out = new
        for card, value in answers.items():
            new = patch_answer(out, card, value)
            if new is None:
                raise Refused(409, "answer " + card + " is no longer in the file. Reload the page.")
            if new != out and card not in changed:
                changed.append(card)
            out = new
        now = datetime.now().astimezone()
        for card in changed:
            out = patch_updated(out, card, now)
        if out != text:
            write(path, out, bom)
    return out


class Life:
    """Counts the trackers holding a WebSocket open and the calls in progress, and says
    when the helper should exit."""

    def __init__(self, grace, startup):
        self.lock = threading.Lock()
        self.grace = grace
        self.startup = startup
        self.pages = 0
        self.calls = 0
        self.seen = False  # a tracker has connected since the helper started
        self.since = time.monotonic()  # when the last tracker closed
        self.closing = False

    def page(self, step):
        with self.lock:
            if step > 0:
                if self.closing:
                    return False
                self.seen = True
            self.pages += step
            if not self.pages:
                self.since = time.monotonic()
            return True

    def call(self, step):
        with self.lock:
            self.calls += step

    def over(self):
        with self.lock:
            if self.pages or self.calls:
                return False
            if time.monotonic() - self.since < (self.grace if self.seen else self.startup):
                return False
            self.closing = True
            return True

    def drain(self, timeout):
        end = time.monotonic() + timeout
        while time.monotonic() < end:
            with self.lock:
                if not self.calls:
                    return
            time.sleep(0.05)


class Handler(BaseHTTPRequestHandler):
    server_version = "Edge8TicketsHelper/%d" % VERSION

    def log_message(self, format, *args):
        pass  # pythonw has no console to log to

    def allowed(self):
        port = self.server.server_address[1]
        host = (self.headers.get("Host") or "").lower()
        if host not in ("127.0.0.1:%d" % port, "localhost:%d" % port):
            return False  # blocks DNS rebinding
        return self.headers.get("Origin") in ORIGINS

    def reply(self, status, body):
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        if self.headers.get("Origin") == "null":
            self.send_header("Access-Control-Allow-Origin", "null")
            self.send_header("Vary", "Origin")
        self.end_headers()
        self.wfile.write(data)

    def refuse(self):
        self.reply(403, {"error": "only tracker pages opened from disk may use the Tickets helper."})

    def do_OPTIONS(self):
        if not self.allowed():
            return self.refuse()
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "null")
        self.send_header("Access-Control-Allow-Methods", "GET, POST")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        if self.headers.get("Access-Control-Request-Private-Network") == "true":
            self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Vary", "Origin")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        if not self.allowed():
            return self.refuse()
        url = urlsplit(self.path)
        if url.path == "/presence":
            return self.presence(parse_qs(url.query))
        self.server.life.call(1)
        try:
            self.get(url.path, parse_qs(url.query))
        except Refused as e:
            self.reply(e.status, {"error": e.message, "code": e.code})
        finally:
            self.server.life.call(-1)

    def get(self, route, query):
        if route == "/ping":
            body = {"helper": "edge8-tickets", "version": VERSION, "pages": self.server.life.pages}
            if "path" in query:
                try:
                    tracker_path(self.server.folder, query["path"][0])
                    body["serves"] = True
                except Refused:
                    body["serves"] = False
            return self.reply(200, body)
        if route in ("/cards", "/assignees"):
            path = tracker_path(self.server.folder, query.get("path", [""])[0])
            with LOCK:
                text = read(path)[0]
            check_title(path, text, query.get("title", [""])[0])
            if route == "/assignees":  # pages from before statuses were editable
                return self.reply(200, {"cards": cards_in(text)})
            return self.reply(200, {"assignees": cards_in(text), "status": statuses_in(text), "updated": updated_in(text), "answers": answers_in(text)})
        self.reply(404, {"error": "unknown address."})

    def do_POST(self):
        if not self.allowed():
            return self.refuse()
        route = urlsplit(self.path).path
        if route not in ("/cards", "/assignees"):
            return self.reply(404, {"error": "unknown address."})
        self.server.life.call(1)
        try:
            length = int(self.headers.get("Content-Length") or 0)
            if length > 65536:
                raise Refused(413, "the change is too large.")
            try:
                body = json.loads(self.rfile.read(length).decode("utf-8"))
            except ValueError:
                raise Refused(400, "the change is not valid JSON.")
            if not isinstance(body, dict):
                raise Refused(400, "the change is not valid JSON.")
            if route == "/assignees":
                out = save(self.server.folder, body, body.get("cards") or {}, {})
                return self.reply(200, {"cards": cards_in(out)})
            out = save(self.server.folder, body, body.get("assignees") or {}, body.get("status") or {}, body.get("answers") or {})
            self.reply(200, {"assignees": cards_in(out), "status": statuses_in(out), "updated": updated_in(out), "answers": answers_in(out)})
        except Refused as e:
            self.reply(e.status, {"error": e.message, "code": e.code})
        except OSError as e:
            self.reply(500, {"error": "could not write the file (" + (e.strerror or str(e)) + ")."})
        finally:
            self.server.life.call(-1)

    def presence(self, query):
        """An open tracker's WebSocket: the helper stays while at least one is open."""
        key = (self.headers.get("Sec-WebSocket-Key") or "").strip()
        if (self.headers.get("Upgrade") or "").lower() != "websocket" or not key:
            return self.reply(426, {"error": "open this address as a WebSocket."})
        try:
            tracker_path(self.server.folder, query.get("path", [""])[0])
        except Refused as e:
            return self.reply(e.status, {"error": e.message, "code": e.code})
        if not self.server.life.page(1):
            return self.reply(503, {"error": "the Tickets helper is closing."})
        try:
            accept = base64.b64encode(hashlib.sha1((key + WS_GUID).encode("ascii")).digest()).decode("ascii")
            self.wfile.write(
                (
                    "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
                    "Sec-WebSocket-Accept: " + accept + "\r\n\r\n"
                ).encode("ascii")
            )
            self.hold()
        except (OSError, ValueError, struct.error):
            pass  # the page went away without a closing frame
        finally:
            self.close_connection = True
            self.server.life.page(-1)

    def hold(self):
        """Read the page's frames until it closes the WebSocket, answering pings."""
        read = self.rfile.read
        while True:
            head = read(2)
            if len(head) < 2:
                return
            op, size = head[0] & 0x0F, head[1] & 0x7F
            if size == 126:
                size = struct.unpack(">H", read(2))[0]
            elif size == 127:
                size = struct.unpack(">Q", read(8))[0]
            if size > 65536:
                return
            mask = read(4) if head[1] & 0x80 else b""
            data = read(size)
            if len(data) < size or len(mask) not in (0, 4):
                return
            if mask:
                data = bytes(b ^ mask[i & 3] for i, b in enumerate(data))
            if op == 0x8:  # close: answer it, then hang up
                self.frame(0x8, data[:2])
                return
            if op == 0x9:  # ping
                self.frame(0xA, data[:125])

    def frame(self, op, data=b""):
        self.wfile.write(bytes([0x80 | op, len(data)]) + data)


class Server(ThreadingHTTPServer):
    allow_reuse_address = False  # on Windows reuse would let a second copy share the port
    daemon_threads = True
    block_on_close = False  # open WebSockets must not hold up the exit
    request_queue_size = 64  # several tabs saving at once must not be turned away

    def server_bind(self):
        if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def watch(server):
    while not server.life.over():
        time.sleep(0.2)
    server.shutdown()


def main():
    parser = argparse.ArgumentParser(description="Saves tracker assignees and statuses into the tracker files.")
    parser.add_argument("--dir", default=DEFAULT_DIR, help="the Tickets folder")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--grace", type=float, default=GRACE, help="seconds to stay after the last tracker closes")
    parser.add_argument("--startup", type=float, default=STARTUP, help="seconds to wait for the first tracker")
    args = parser.parse_args()
    try:
        server = Server(("127.0.0.1", args.port), Handler)
    except OSError:
        return  # already running, or the port is taken
    server.folder = (os.path.realpath(args.dir),) + tuple(os.path.realpath(d) for d in EXTRA_DIRS)
    server.life = Life(args.grace, args.startup)
    threading.Thread(target=watch, args=(server,), daemon=True).start()
    server.serve_forever(poll_interval=0.2)
    server.server_close()
    server.life.drain(10)  # let a save that is being written finish


if __name__ == "__main__":
    main()
