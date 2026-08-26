<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project context maintenance

- Read `context.md` before making assignment changes.
- After every implementation, bug fix, design change, dependency/configuration change, test/validation change, commit, merge, rebase, or branch switch, update `context.md` in the same work session.
- Keep `context.md` factual and preserve prior functionality notes. Record new files, public interfaces, behavior, known limitations, API findings, and validation results.
- Before updating the Git section, inspect `git status --short --branch`, `git branch -avv`, and `git log --oneline --decorate --graph`. Record branch, HEAD, commit relationship to `main`, merge status, and untracked files.
- Do not claim a branch or commit is merged into `main` unless Git history or the branch pointers confirm it. Clearly separate committed, uncommitted, and unmerged work.
- Treat generated artifacts such as `.next`, `node_modules`, and IDE metadata such as `.idea` as non-feature state unless explicitly requested.
- If a future session makes changes but cannot update `context.md`, report that limitation clearly before handing off.
