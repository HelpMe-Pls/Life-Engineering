#!/usr/bin/env python3
"""position.py — where Khoi stands on the route, read off the files. Never writes.

Usage:
  python3 position.py                 # the human-readable position block
  python3 position.py --json          # the same as JSON (for the skill)
  python3 position.py --calendar      # the §C calendar table for "This is it.md"
  python3 position.py --today 2026-12-13

Reads (relative to the vault root, found from this file's resolved path or --vault):
  Notes/Weekly Tasks.md   → the scoreboard, the demand-log tally, the demand log
  Notes/Venture Tasks.md  → the open boxes under "## NOW" and "## This week"

The dates below are the LAW ("This is it.md" §3 / §4). Gates never move; if a
ruling ever changes one, change it HERE and in §C in the same edit.
Stdlib only. Week = Mon→Sun, read on the Sunday row. "day N" counts the start
day as day 1 (Oct 9 = day 1, Dec 7 = day 60).
"""
import argparse
import json
import os
import re
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

PHASES = [
    # id, name, first day, last day (inclusive)
    ("P1", "Stranger dollar", "2026-10-09", "2027-01-06"),
    ("P2", "Productize", "2027-01-07", "2027-04-08"),
    ("P3", "Shift weight", "2027-04-09", "2027-07-10"),
    ("P4", "Owned test", "2027-07-10", "2027-10-10"),
]
GATES = [
    # firewall row(s), gate date, the test in one line
    ("F-03", "2026-11-15", "EP probation: >=1 paid enrollment from a stranger, else EP back in the graveyard and Stream storage cancelled"),
    ("F-04", "2026-12-07", ">=1 reply from <=35 proposals, else the ONE profile rewrite"),
    ("F-05", "2027-01-06", "a stranger's money in ACB, else Upwork <=2 proposals/wk and an Oct-2027 quit is off the table"),
    ("F-08", "2027-04-08", "the $3k check (expected to miss; not a signal) + >=1 paying stranger on Paddle, else the 6-week fix window opens"),
    ("F-09", "2027-05-20", "0 paying strangers after the fix window -> switch product ONCE"),
    ("F-10/11/12", "2027-07-10", "MRR vs the floor (30-40M VND): <$500 renew; $500->floor keep building; >=floor start the owned test"),
    ("F-13/14", "2027-10-10", "quit ONLY if MRR >= floor AND <=4 h in all 13 rows (Jul 18 -> Oct 10), else renew and keep the asset running"),
]
FOLLOW_UP_AFTER_DAYS = 4  # "day 5" with the send day as day 1
DEFAULT_VAULT = "/Users/somebodhi/Documents/Personal/Life-Engineering"


def d(s):
    return datetime.strptime(s, "%Y-%m-%d").date()


def fmt(x):
    return x.strftime("%a %Y-%m-%d")


def sundays(start, end):
    cur = start
    out = []
    while cur <= end:
        if cur.weekday() == 6:
            out.append(cur)
        cur += timedelta(days=1)
    return out


def coming_sunday(today):
    return today + timedelta(days=(6 - today.weekday()) % 7)


def phase_of(today):
    for pid, name, s, e in PHASES:
        if d(s) <= today <= d(e):
            # Jul 10 2027 belongs to both P3 and P4 on paper; the gate day starts the test.
            if pid == "P3" and today == d(e):
                continue
            return pid, name, d(s), d(e)
    return None


def split_row(line):
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    return cells


def find_table(lines, first_cell, second_cell):
    """Return the rows (as cell lists) of the first table whose header starts with the two cells."""
    rows, inside = [], False
    for line in lines:
        if not line.lstrip().startswith("|"):
            if inside:
                break
            continue
        cells = split_row(line)
        if not inside:
            if len(cells) >= 2 and cells[0] == first_cell and cells[1] == second_cell:
                inside = True
            continue
        if cells and set(cells[0]) <= set("-: "):
            continue  # the separator row
        rows.append(cells)
    return rows


def read_lines(path):
    try:
        return path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        return []


def open_boxes(lines, heading_prefix):
    """Open '- [ ]' lines under the first heading that starts with heading_prefix (until the next heading of the same or higher level)."""
    out, inside, level = [], False, 0
    for line in lines:
        m = re.match(r"^(#+)\s+(.*)$", line)
        if m:
            if inside and len(m.group(1)) <= level:
                break
            if not inside and m.group(2).startswith(heading_prefix):
                inside, level = True, len(m.group(1))
            continue
        if inside:
            s = line.strip()
            if re.match(r"^(?:\d+\.\s+)?- \[ \]|^\d+\.\s+\[ \]", s):
                out.append(re.sub(r"^(?:\d+\.\s+)?- \[ \]\s*|^\d+\.\s+\[ \]\s*", "", s))
    return out


def analyse(vault, today):
    weekly = read_lines(vault / "Notes" / "Weekly Tasks.md")
    moves = read_lines(vault / "Notes" / "Venture Tasks.md")

    ph = phase_of(today)
    pos = {"today": fmt(today)}
    if ph:
        pid, name, s, e = ph
        rows = sundays(s, e)
        cs = coming_sunday(today)
        week_no = rows.index(cs) + 1 if cs in rows else None
        pos.update({
            "phase": f"{pid} {name}",
            "phase_span": f"{fmt(s)} -> {fmt(e)}",
            "sunday_rows_in_phase": len(rows),
            "this_row": fmt(cs),
            "week_no": week_no,
            "week_span": f"{fmt(cs - timedelta(days=6))} -> {fmt(cs)}",
            "days_to_phase_end": (e - today).days,
        })
    else:
        pos["phase"] = "outside the route (before Oct 9 2026 or after Oct 10 2027)"

    cs = coming_sunday(today)
    gates = []
    for row, gd, test in GATES:
        g = d(gd)
        read_on = coming_sunday(g)
        if g >= today or read_on >= today:
            gates.append({
                "row": row, "date": fmt(g), "days": (g - today).days,
                "read_at_the_sunday_read_of": fmt(read_on),
                "read_this_sunday": read_on == cs, "test": test,
            })
    pos["gates_ahead"] = gates

    # scoreboard
    sb = find_table(weekly, "Sunday", "hrs")
    last_two = sb[-2:]
    pos["scoreboard_last_two"] = [" | ".join(r) for r in last_two]
    govs = [r[2].upper() for r in last_two if len(r) > 2]
    pos["governor"] = {
        "last_two_gov": govs,
        "tripped": len(govs) == 2 and all(g.startswith("YES") for g in govs),
        "unfilled_cells_in_last_row": [],
    }
    if sb:
        hdr = ["Sunday", "hrs", "Gov?", "Upwork p/r/h/Σ$", "Asset s/MRR/u", "Post", "Signal"]
        for i, c in enumerate(sb[-1]):
            if "_" in c and i < len(hdr):
                pos["governor"]["unfilled_cells_in_last_row"].append(hdr[i])

    # tally
    tally = find_table(weekly, "Sunday", "rows Σ")
    pos["tally_last"] = " | ".join(tally[-1]) if tally else "(no tally row)"

    # demand log
    log = [r for r in find_table(weekly, "date", "post URL") if r and r[0]]
    tags = {}
    bids = replies = hires = connects = 0
    due = []
    for r in log:
        r = r + [""] * (11 - len(r))
        tag = r[3] or "(untagged)"
        tags[tag] = tags.get(tag, 0) + 1
        bid, rep, hire = (r[6].upper().startswith("Y"), r[7].upper().startswith("Y"), r[8].upper().startswith("Y"))
        bids += bid
        replies += rep
        hires += hire
        if bid and r[5].strip().isdigit():
            connects += int(r[5].strip())
        try:
            sent = d(r[0])
        except ValueError:
            continue
        if bid and not rep and "f/u" not in r[10].lower() and (today - sent).days >= FOLLOW_UP_AFTER_DAYS:
            due.append(f"{r[0]} {r[2][:50]} (bid day {(today - sent).days + 1})")
    pos["demand_log"] = {"rows": len(log), "bids": bids, "replies": replies, "hires": hires, "connects_on_bids": connects, "per_tag": tags, "follow_ups_due": due}

    # moves
    pos["next_moves_open"] = open_boxes(moves, "NOW")[:5]
    this_week = open_boxes(moves, "This week")
    pos["this_week_open"] = len(this_week)
    pos["this_week_first_three"] = [b[:110] for b in this_week[:3]]

    # blanks from a cut run: `_` cells in rows dated before today, and `_` lines in ## NOW
    blanks = []
    hdr_pages = {1: "hrs → Page 2", 2: "Gov? → Page 2", 3: "Upwork p/r/h/Σ$ → Pages 2–3", 4: "Asset s/MRR/u → Page 3", 5: "Post → Page 2", 6: "Signal → Page 5"}
    for r in sb:
        try:
            rd = d(r[0])
        except (ValueError, IndexError):
            continue
        if rd >= today:
            continue
        for i, c in enumerate(r):
            if "_" in c and i in hdr_pages:
                blanks.append(f"row {r[0]}: {hdr_pages[i]}")
    in_now = False
    for line in moves:
        if line.startswith("## NOW"):
            in_now = True
            continue
        if in_now and line.startswith("## "):
            break
        if in_now:
            for key, page in (("**Signal:**", "Page 5"), ("**Blocked on:**", "Page 6")):
                if line.startswith(key) and line[len(key):].strip().startswith("_"):
                    blanks.append(f"## NOW: {key.strip('*:')} → {page}")
    # the marker a cut run leaves in the notes: `- **Cut run <date>:** skipped pages <list> → _` (filled runs replace the `_`)
    for line in weekly:
        m = re.match(r"^- \*\*Cut run (\d{4}-\d{2}-\d{2}):\*\* skipped pages ([0-9, ]+?) → _\s*$", line.strip())
        if m:
            blanks.append(f"cut run {m.group(1)}: pages {m.group(2).strip()} not yet filled → run them")
    pos["blanks_from_a_cut_run"] = blanks
    return pos


def render(pos):
    L = []
    L.append(f"POSITION — {pos['today']}")
    if "week_no" in pos:
        L.append(f"Phase: {pos['phase']} ({pos['phase_span']}), {pos['sunday_rows_in_phase']} Sunday rows, {pos['days_to_phase_end']} days left")
        L.append(f"This row: week {pos['week_no']} of {pos['sunday_rows_in_phase']} = {pos['this_row']} (covers {pos['week_span']})")
    else:
        L.append(f"Phase: {pos['phase']}")
    L.append("Gates ahead:")
    for g in pos["gates_ahead"][:4]:
        flag = "  <-- READ THIS SUNDAY" if g["read_this_sunday"] else ""
        when = f"in {g['days']:>3} d" if g["days"] >= 0 else f"{-g['days']} d ago"
        L.append(f"  {g['row']:>10}  {g['date']}  {when}  read at the Sunday read of {g['read_at_the_sunday_read_of']}{flag}")
        L.append(f"              {g['test']}")
    L.append("Scoreboard, last two rows:")
    for r in pos["scoreboard_last_two"]:
        L.append(f"  {r}")
    gv = pos["governor"]
    if gv["tripped"]:
        state = "TRIPPED (F-01: next week at HALF load)"
    elif any("_" in g for g in gv["last_two_gov"]):
        state = "not readable yet (a Gov? cell is still `_`)"
    else:
        state = "not tripped"
    L.append(f"Governor: last two Gov? = {gv['last_two_gov'] or '(none)'} -> {state}"
             + (f"; unfilled in the last row: {', '.join(gv['unfilled_cells_in_last_row'])}" if gv['unfilled_cells_in_last_row'] else ""))
    L.append(f"Tally, last row: {pos['tally_last']}")
    dl = pos["demand_log"]
    L.append(f"Demand log: {dl['rows']} rows, {dl['bids']} bids, {dl['replies']} replies, {dl['hires']} hires, {dl['connects_on_bids']} Connects on bids; per tag: {dl['per_tag'] or '{}'}")
    L.append("Follow-ups due (bid, no reply, day >= 5, no f/u yet): " + ("; ".join(dl["follow_ups_due"]) if dl["follow_ups_due"] else "none"))
    bl = pos.get("blanks_from_a_cut_run", [])
    L.append("Blanks from a cut run (`_` in a past Sunday row or in ## NOW): " + ("; ".join(bl) if bl else "none"))
    L.append(f"Next moves open (Venture Tasks ## NOW): {len(pos['next_moves_open'])}")
    for b in pos["next_moves_open"]:
        L.append(f"  - {b[:110]}")
    L.append(f"This week's boxes open: {pos['this_week_open']}")
    return "\n".join(L)


def calendar(today):
    out = ["| Phase | First day | Last day | Days | Sunday rows | Rows | Gate at the end | Read at the Sunday read of |",
           "| --- | --- | --- | --- | --- | --- | --- | --- |"]
    for pid, name, s, e in PHASES:
        s, e = d(s), d(e)
        rows = sundays(s, e)
        gate = next((g for g in GATES if d(g[1]) == e), None)
        out.append(f"| {pid} {name} | {fmt(s)} | {fmt(e)} | {(e - s).days + 1} | {rows[0].strftime('%b %d')} → {rows[-1].strftime('%b %d %Y')} | {len(rows)} | {gate[0] if gate else '—'} {fmt(e)} | {fmt(coming_sunday(e))} |")
    out.append("")
    out.append(f"| Firewall row | Gate date | Read at the Sunday read of | Days from {fmt(today)} | The test |")
    out.append("| --- | --- | --- | --- | --- |")
    for row, gd, test in GATES:
        g = d(gd)
        out.append(f"| {row} | {fmt(g)} | {fmt(coming_sunday(g))} | {(g - today).days} | {test} |")
    out.append("")
    out.append("The owned test's 13 weeks = the 13 full Mon→Sun weeks of P4: the Sunday rows Jul 18 → Oct 10 2027 (the Jul 11 row covers only Sat Jul 10–Sun Jul 11 and is not one of the 13).")
    return "\n".join(out)


def find_vault(arg):
    """The vault root, in this order: --vault, $LONG_VOL_VAULT, this file's real path
    (<vault>/AI/long-vol-consultant/position.py when installed as a symlink), DEFAULT_VAULT."""
    if arg:
        return Path(arg).expanduser()
    env = os.environ.get("LONG_VOL_VAULT")
    if env:
        return Path(env).expanduser()
    here = Path(__file__).resolve()
    if len(here.parents) > 2 and (here.parents[2] / "Notes").is_dir():
        return here.parents[2]
    return Path(DEFAULT_VAULT)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vault", default=None)
    ap.add_argument("--today", default=None)
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--calendar", action="store_true")
    a = ap.parse_args()
    today = d(a.today) if a.today else date.today()
    if a.calendar:
        print(calendar(today))
        return
    vault = find_vault(a.vault)
    if not (vault / "Notes" / "This is it.md").is_file():
        sys.exit(f"Vault not found at {vault} (no Notes/This is it.md). Pass --vault <path>, set LONG_VOL_VAULT, or install the skill as symlinks into the vault (AI/long-vol-consultant Setup.md).")
    pos = analyse(vault, today)
    pos["vault"] = str(vault)
    print(json.dumps(pos, ensure_ascii=False, indent=1) if a.json else f"Vault: {vault}\n" + render(pos))


if __name__ == "__main__":
    sys.exit(main())
