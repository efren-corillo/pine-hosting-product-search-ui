Act as a senior DevOps engineer and React architect.

Set up the project boilerplate and workspace agent skills for a Vite + React + TypeScript product search assessment. Do NOT write domain search hooks, filtering, or UI components—I will implement all application code and unit tests myself.

Deliverables:

1. Project Boilerplate:
   - Initialize a Vite React TypeScript project with Vitest and @testing-library/react configured.
   - Configure package.json scripts:
     - "dev": "vite"
     - "build": "tsc && vite build"
     - "preview": "vite preview"
     - "test": "vitest run"
     - "test:watch": "vitest"
     - "typecheck": "tsc --noEmit"
   - Configure tsconfig.json (strict: true, ESNext module/target, React JSX).
   - Set up vitest.config.ts with jsdom environment and @testing-library setup.
   - Create skeleton directories with placeholder files or empty index files:
     - src/api/mockApi.ts (place the provided fake API here untouched)
     - src/hooks/
     - src/components/
     - src/utils/
     - tests/

2. Workspace Agent Skills Setup:
   Create a `.agent/skills/` directory containing two reusable skill specifications:

   A. `.agent/skills/git-flow-manager/SKILL.md`:
      - Purpose: Automate feature branch workflows, test checks, and semantic commit generation.
      - Steps:
        1. Pre-commit check: Run `npm run typecheck` and `npm test`. If either fails, halt immediately and output error details.
        2. Inspect changes via `git status` and `git diff`.
        3. Stage changes (`git add .`) and compose a Conventional Commit message based on the diff.
        4. Execute commit.
        5. Support finishing feature branches by merging to `develop` via `--no-ff`.

   B. `.agent/skills/tdd-verification-guard/SKILL.md`:
      - Purpose: Test regression and React accessibility/async state guard.
      - Steps:
        1. Run `npx vitest run`.
        2. Inspect output for race-condition hazards, missing error assertions, or unhandled promise rejections.
        3. Print a concise Markdown pass/fail summary report.

3. Git Initialization:
   - Initialize git repo (if not already initialized).
   - Commit boilerplate on `master`, create `develop` branch, and checkout `develop`.

Stop once the scaffolding and skills are created. Wait for my manual code implementation.