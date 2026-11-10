---
name: git-flow-manager
description: >-
  Automate feature branch workflows, pre-commit typecheck and test gates,
  semantic Conventional Commit generation, and merging feature branches into develop.
---

# Git Flow Manager Skill

Automates feature branch workflows, quality verification checks, and semantic commit generation.

## Steps

1. **Pre-commit Check:**
   - Run `npm run typecheck` and `npm test`.
   - If either command fails, halt immediately and output the full error details without staging or committing changes.

2. **Inspect Changes:**
   - Run `git status` and `git diff` to review all modified and untracked files.

3. **Stage and Compose Commit Message:**
   - Stage changes using `git add .`.
   - Compose a semantic Conventional Commit message (`feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`) accurately reflecting the diff.

4. **Execute Commit:**
   - Run `git commit -m "<type>(<scope>): <description>"`.

5. **Finish Feature Branch (when requested):**
   - Switch to `develop` (`git checkout develop`).
   - Merge the feature branch using `--no-ff` (`git merge --no-ff <feature-branch>`).

