# Preparing a machine for /sprint-summary-tickets

Read this file when a machine check in step 1 fails, or when Khoi sets the skill up on another machine. Check before you change: run each done-check first and skip what already passes. Say what you install, and its size, before you install it.

## 1. The skill

The three sprint skills come in one package, the folder `sprint-skills`. In the Life-Engineering vault it is `AI/sprint-skills`: pull first with `git -C "<vault>" pull`. Then run `node "<the package folder>/install.mjs"`. The command is the same on Windows, on a Mac and on Linux, and a second run changes nothing. Done when its line for /sprint-summary-tickets says PASS or DONE. Claude Code loads a new skill at its next start.

## 2. Tools

| Tool | Windows (winget install) | Mac (brew install) | Done when |
| --- | --- | --- | --- |
| Git, with Git Bash | Git.Git | git | `git --version` |
| GitHub CLI | GitHub.cli | gh | `gh --version` |
| Node 24 | Schniz.fnm, then `fnm install 24` | fnm, then `fnm install 24` | `node --version` |
| Python 3.12 or newer | Python.Python.3.13 | python@3.13 | `python --version` |
| ffmpeg and ffprobe | Gyan.FFmpeg | ffmpeg | `ffmpeg -version` |

A tool installed in this session is not on the session's PATH yet: call it by its full path, or have Khoi restart Claude Code. The GitHub sign-in is Khoi's step: `gh auth login`, as the account Kh0iLe. Done when `env -u GH_TOKEN gh repo view EO-Vietnam/global-hubspot --json name` answers.

## 3. The transcriber

```bash
VENV="$HOME/.venvs/transcribe"; PY="$VENV/Scripts/python.exe"      # elsewhere: PY="$VENV/bin/python"
python -m venv "$VENV"                                              # skip when it exists
"$PY" -m pip install --upgrade pip
"$PY" -m pip install faster-whisper                                 # brings ctranslate2, av and numpy
"$PY" -m pip install nvidia-cublas-cu12 "nvidia-cudnn-cu12==9.*"    # only when nvidia-smi runs: 1.3 GB
"$PY" -c "import faster_whisper, av, numpy; print(faster_whisper.__version__)"
```

The engine runs on the CPU or on an NVIDIA GPU, and transcribe.py picks by itself. An AMD or Intel GPU is not used. The first run downloads the speech model, 1.6 GB.

## 4. The clone

```bash
REPO="$HOME/Documents/Repos/Edge8/global-hubspot"
env -u GH_TOKEN gh repo clone EO-Vietnam/global-hubspot "$REPO"     # skip when the clone exists
git -C "$REPO" fetch origin
git -C "$REPO" switch dev
git -C "$REPO" config core.hooksPath .githooks                      # the local gate: without it a push is ungated
npm install --prefix "$REPO/website"                                # Prettier, Playwright and jsdom come with it
node "$REPO/website/node_modules/playwright/cli.js" install chromium   # about 150 MB
```

The website's own setup (Docker, a local Supabase, an .env file) is not needed for this skill. Done when website/node_modules holds prettier, playwright and jsdom.

## 5. Khoi's pages

Tickets, Sprint review and Scopes under ~/Documents/Edge8 are in no repository and not in the vault. Khoi copies these three folders from the work PC, to the same place under this machine's home folder. The run needs at least the newest sprint page, the newest review page and the scope pages that review page names. Leave the folder's other files on the work PC: they hold keys and recovery codes. Done when Tickets holds a `Sprint Tickets [YNN Sprint NN].html` and Sprint review holds a `sprint-NN-review.html`.

The sprint page's pickers save through a helper. On Windows the installer of step 1 puts it in place and says so in its own line. On a Mac or Linux the page reads the same and the pickers do not save.

## 6. Smoke test

One minute of a recording that holds speech; a silent minute gives no cues, so move the slice later when the .vtt is empty.

```bash
PYTHONIOENCODING=utf-8 PYTHONUTF8=1 "$PY" -u "$HOME/.claude/skills/sprint-summary-tickets/transcribe.py" "<a recording>" --start 10:00 --end 11:00 -o "<scratch>/smoke.vtt" --force
node "$HOME/.claude/skills/sprint-summary-tickets/render-check.js" "$REPO/website/node_modules/playwright" "<the newest summary in $REPO/docs/meetings>"
node "$HOME/.claude/skills/sprint-summary-tickets/page-check.js" "$REPO/website/node_modules/jsdom" "<the newest sprint page>" "<the page before it>"
```

On Windows write every path as C:/Users/... : Git Bash leaves a /c/ path with square brackets unconverted. Done when the first line of the transcriber names the device, the .vtt holds cues, and the two checks print their lines.

## 7. Launch

Start Claude Code in the folder that holds the recordings and type /sprint-summary-tickets. To save permission prompts, add the folders the run touches. The work PC:

```
claude --add-dir C:\tmp C:\Users\leekh\Documents\Edge8\Tickets "C:\Users\leekh\Documents\Edge8\Sprint review" C:\Users\leekh\Documents\Edge8\Scopes C:\Users\leekh\Documents\Repos\Edge8\global-hubspot C:\Users\leekh\Documents\Repos\Personal\Life-Engineering\AI\sprint-skills\skills\sprint-summary-tickets C:\Users\leekh\.claude\skills\sprint-summary-tickets
```
