# T00. Create the GitHub repository and synchronize the local workspace

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

None.

Plan coverage: repository setup in sections 1, 9, 11 and 13; early prerequisite work for Slice 0 and later publication.

Recommended first task. Establish the local baseline before code changes; GitHub access is not a functional prerequisite for local development. If remote setup is blocked, record the completed local part and continue eligible code tickets. T14 requires this whole ticket to be done.

## Outcome

The existing local folder is a Git repository connected to public `stefan-karger/rollmino`, with an initial committed/pushed baseline, correct description and a tracking `main` branch. This publishes source, not the Pages website.

## Scope and files

Use the existing `genius-square` workspace. Its directory name may stay unchanged; do not replace it with a new clone. Review `.gitignore`, `.gitattributes`, the files to be committed, Git configuration and repository metadata. Record evidence here and update the tracker. No app implementation or Pages activation in this ticket.

Repository settings:

- Owner/name: `stefan-karger/rollmino`.
- Visibility: public.
- Default branch: `main`.
- Description: `A free, phone-first timed block puzzle with five difficulty levels and local personal records.` This copy can be revised without changing the implementation.
- Homepage URL: add the working Pages URL in T14, after deployment.

## Implementation steps

1. Inspect the actual Git root, existing history/remotes and working tree. Confirm this workspace is the intended root. If it already belongs to another repository, preserve its history and resolve the target mapping; never overwrite an unrelated `origin` or force-push over remote work.
2. Establish the local baseline. If there is no repository, initialize this folder with branch `main`. Review `.gitignore` and intended tracked files before staging. Include the handoff/plan/tickets and source; exclude dependencies, build/test artifacts and local credentials. Use the existing appropriate commit identity and commit the reviewed baseline. Preserve original archive files and their checksum snapshot.
3. Check GitHub access for the confirmed owner through the available CLI/API. Missing access is a concrete remote-setup blocker; do not expose tokens in evidence. Check whether the target repo already exists before creating it.
4. For a new target, create an empty public repo with the description above. Do not generate another README, gitignore or license remotely: the local handoff already has its files, and no license choice was requested. For an existing intended target, inspect visibility, branch and history before reuse.
5. Connect `origin` to this target using the configured HTTPS or SSH authentication. Push local `main` with upstream tracking. If the remote has commits, fetch/inspect them and integrate relevant work without discarding either history. An unrelated target/history requires resolving that conflict before claiming sync, not a forced overwrite.
6. Set/verify the remote default branch and description after `main` exists. Fetch again and confirm local HEAD, `origin/main` and the actual remote main tip match. Confirm the working tree is clean apart from explicitly recorded ticket bookkeeping changes.
7. Record repo URL, description, visibility, initial commit, remote URL and sync evidence. Subsequent synchronization uses normal fetch/pull/push on the tracked branch; do not use a mirror/fork-sync command to replace this workspace.

### Commands for the fresh, empty-target case

Run these only when executing the ticket and after the state/file review above. Adapt the reuse case to existing history/remotes instead of replaying initialization commands.

```bash
git init -b main
git add -- .
git diff --cached --stat
git diff --cached --check
git commit -m "chore: initialize Rollmino handoff"
gh repo create stefan-karger/rollmino --public --description "A free, phone-first timed block puzzle with five difficulty levels and local personal records."
git remote add origin https://github.com/stefan-karger/rollmino.git
git push -u origin main
gh repo edit stefan-karger/rollmino --default-branch main --description "A free, phone-first timed block puzzle with five difficulty levels and local personal records."
```

GitHub CLI is one implementation route; an available authenticated API may create/edit the same repository. [Repository creation](https://cli.github.com/manual/gh_repo_create), [metadata editing](https://cli.github.com/manual/gh_repo_edit), [Git initialization](https://git-scm.com/docs/git-init)

## Verification

```bash
git rev-parse --show-toplevel
git remote -v
git branch -vv
git fetch origin
git rev-parse HEAD
git rev-parse origin/main
git ls-remote origin refs/heads/main
git status --short
gh repo view stefan-karger/rollmino --json nameWithOwner,description,isPrivate,defaultBranchRef,url
```

The root must be the current workspace, owner/name must match, `isPrivate` must be false, default branch must be main, and the three commit references must agree. Check upstream tracking and the reviewed files on GitHub. Distinguish a missing repo from failed authentication/network access. A created repo without a successful push is not completed sync. [Repository inspection](https://cli.github.com/manual/gh_repo_view), [push/upstream behavior](https://git-scm.com/docs/git-push)

## Done when

- [x] The existing workspace has a reviewed committed Git baseline without losing existing work.
- [x] The intended GitHub repository exists, is public and has the specified description/default branch.
- [x] `origin` identifies that target and local main tracks `origin/main`.
- [x] Initial source is pushed; local/tracking/remote main commit references match and remaining worktree changes are explained.
- [x] Repo metadata, commit and synchronization checks are recorded; no credentials are included.
- [x] Pages publication remains assigned to T14 and no app-release claim is made from repository creation.

## Completion evidence

Implemented on 2026-10-12; initial synchronization verified at 14:29 UTC.

- Repository: [stefan-karger/rollmino](https://github.com/stefan-karger/rollmino), verified public through `isPrivate: false`.
- Description: `A free, phone-first timed block puzzle with five difficulty levels and local personal records.`
- Default branch: `main`; origin is `https://github.com/stefan-karger/rollmino.git`; local main tracks `origin/main`.
- Initial baseline: [9188f0b](https://github.com/stefan-karger/rollmino/commit/9188f0b6ef4d26b336cfa5f1eafe9bde2e626527), `chore: initialize Rollmino handoff`, with 49 reviewed files.
- `git rev-parse HEAD`, `git rev-parse origin/main` and `git ls-remote origin refs/heads/main` all returned `9188f0b6ef4d26b336cfa5f1eafe9bde2e626527` after fetch; `git status --short` was empty.
- Git 2.54.0.windows.1 and GitHub CLI 2.91.0 used the existing GitHub credential helper for the intended owner. No new browser/CLI login or repository credential file was needed; credentials were not recorded.
- `npm test` passed all 13 existing reference tests. No rule fixes or browser app work were included.
- An independent byte/hash check verified all 15 original reference/archive code and provenance files against `SHA256SUMS.txt`, in both the workspace and committed Git objects. Dependencies/build/test artifacts are absent from tracked files.
- Added `.gitattributes` to keep text at LF under the existing Windows Git configuration and preserve archive bytes. Removed extra EOF blank lines in ticket Markdown. The two preserved research documents retain intentional Markdown hard-break spaces; whitespace checks on other staged files passed.
- README and the tracker now record the setup. Their completion bookkeeping is committed and synchronized separately from the original baseline.

The repository homepage remains empty and Pages activation/deployment remains T14. This is a source handoff, not a playable-site release.
