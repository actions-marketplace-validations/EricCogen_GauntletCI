---
name: context-mode
description: >-
  Context window protection via context-mode MCP (sandbox execute, FTS5 search,
  session memory). Use when analyzing large outputs, corpus data, logs, or when
  the user says ctx stats, ctx doctor, or context-mode.
---

# context-mode (Cursor + GauntletCI)

This project wires **context-mode** as an MCP server plus Cursor hooks and `.cursor/rules/context-mode.mdc`.

## Verify setup

1. Cursor Settings → MCP → **context-mode** connected
2. In agent chat: `ctx doctor` (runs `ctx_doctor` MCP tool)

## Core tools (MCP)

| Tool | Use |
|------|-----|
| `ctx_batch_execute` | Run multiple shell commands; auto-index; search in one step |
| `ctx_execute` | Sandbox JS for analysis — only stdout enters context |
| `ctx_execute_file` | Same, with a file path in the sandbox |
| `ctx_search` | FTS5/BM25 over indexed session + corpus |
| `ctx_fetch_and_index` | Fetch URL, index content (not raw HTML in chat) |
| `ctx_index` | Store arbitrary text for later search |
| `ctx_stats` / `ctx_doctor` / `ctx_upgrade` / `ctx_purge` | Ops |

## GauntletCI-specific

- API keys: load from `~/.tokens` into subprocess env only (see `.cursor/rules/gauntletci.mdc` and user `auth-tokens.mdc`); never index token files
- Prefer `ctx_execute` for corpus metrics, fixture counts, and large grep/read patterns
- Use native Edit/Write for file changes — never `ctx_execute` to write files
- Routing rules are always on via `context-mode.mdc`

Install/update globally: `npm install -g context-mode`

Docs: https://github.com/mksglu/context-mode
