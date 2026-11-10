---
name: tdd-verification-guard
description: >-
  Test regression and React accessibility/async state guard. Runs the Vitest suite,
  inspects for race-condition hazards, missing error assertions, or unhandled promise
  rejections, and outputs a Markdown pass/fail summary report.
---

# TDD Verification Guard Skill

Guards against test regressions, async race-condition hazards, and accessibility gaps in the React + TypeScript product search application.

## Steps

1. **Execute Test Suite:**
   - Run `npx vitest run`.

2. **Inspect Output & Code Health:**
   - Check test results and console output for:
     - Race-condition hazards or out-of-order async state updates.
     - Missing error state assertions or retry flow coverage.
     - Unhandled promise rejections or React `act(...)` warnings.
     - Keyboard accessibility and ARIA live region regressions.

3. **Report Summary:**
   - Print a concise Markdown pass/fail summary report detailing suite results, test counts, and any detected warnings or hazards.

