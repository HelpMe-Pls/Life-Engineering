---
name: plugin-install-project-scope-reorders-settings
description: "enabledPlugins in .claude/settings.json does not install the plugin; `claude plugin install --scope project` installs it but rewrites the tracked settings file"
metadata:
  node_type: memory
  type: project
  originSessionId: f2e03660-29eb-4999-bb5a-d7c3cf1876ac
  modified: 2026-09-27T12:26:38.052Z
---

Since #1011 (2026-09-27) `.claude/settings.json` enables `mattpocock-skills@claude-plugins-official`, but enabling it installs nothing. Each clone shows the error "enabled in project settings but isn't installed here" in `/plugin` → Errors until someone runs `claude plugin install mattpocock-skills@claude-plugins-official --scope project`.

That install **rewrites the tracked `.claude/settings.json`**. On 2026-09-27 it moved the `$comment` key from first to last (44-line diff); sorted by key, the JSON was identical. The installed-plugin record lives outside the repo, so `git checkout -- .claude/settings.json` afterwards is safe and the plugin still shows `✔ enabled`. Never commit that churn.

**Why:** the remote is the single source of truth (operator, 2026-09-27), and a reorder-only diff looks like a real settings change in review.

**How to apply:** after any `claude plugin install/enable --scope project` here, run `git status` and restore `.claude/settings.json` if the only difference is key order. Related: [[skills-churn-is-local-windows-artifact]].
