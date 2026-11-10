# Product Search UI (React + TypeScript)

A responsive, keyboard-accessible product search interface built with React, Vite, and TypeScript. It features debounced search inputs, out-of-order response handling, client-side filtering/sorting, and resilient error recovery.

## Project Structure

```text
.
├── .agent/
│   └── skills/
│       ├── git-flow-manager/
│       │   └── SKILL.md        # Automated feature branch, typecheck/test gate & commit skill
│       └── tdd-verification-guard/
│           └── SKILL.md        # Vitest regression, race-condition & a11y verification skill
├── src/
│   ├── api/
│   │   └── mockApi.ts          # Provided fake async product search API (untouched)
│   ├── components/             # UI components (search input, filters, product list, states)
│   ├── hooks/                  # Custom hooks (debouncing, race-condition-resilient search)
│   ├── utils/                  # Utility helpers (integer cents currency formatting)
│   ├── App.tsx                 # Root application component
│   ├── main.tsx                # Application entrypoint
│   └── index.css               # Base styles
├── tests/
│   └── setup.ts                # Vitest + @testing-library/jest-dom setup
├── index.html
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## How to Run the Code and Its Tests

### Requirements
- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

### Running Automated Tests

```bash
# Single test run
npm test

# Interactive watch mode
npm run test:watch
```

### Type Checking & Production Build

```bash
# TypeScript type check
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Assumptions Made

1. **Race Condition Resolution:** Uses an incrementing request counter within `useProductSearch`. When asynchronous API promises resolve out of sequence, any response that does not match the latest request ID is ignored.
2. **Debounce Interval:** Set to 300ms—providing a balance between responsive input and avoiding unnecessary mock invocations while typing.
3. **Local Filtering & Sorting Scope:** Category filtering and price sorting operate entirely in-memory over the latest fetched search results without re-triggering network calls.
4. **Initial Page Load:** An initial search for an empty string `""` runs on mount to populate the catalog overview.
5. **Accessibility Standards:** All interactive elements (`<input>`, `<select>`, `<button>`) include visible keyboard focus indicators and appropriate ARIA attributes (`aria-live="polite"` for dynamic search results).

---

## What I Would Do Next With More Time

1. **AbortController Integration:** If this were a real `fetch` or Axios implementation, wire `AbortController.abort()` to actively cancel in-flight HTTP connections instead of just discarding resolved promises.
2. **Virtualization:** Implement windowed virtualization (e.g., `@tanstack/react-virtual`) to smoothly render large product volumes without DOM bloat.
3. **URL State Synchronization:** Sync search query, category, and sort parameters into URL search params (`?q=...&category=...`) to allow bookmarking and deep linking.
4. **Persistent Cache / SWR:** Add a lightweight query cache to instantly display previously searched terms.

---

## AI Tools Used

- **Antigravity (`agy`):** Configured project scaffolding and workspace agent skills (`.agent/skills/`) to handle TDD verification gates and automated semantic Git-flow commits. All component implementation, custom hooks, and unit tests were authored by hand.
