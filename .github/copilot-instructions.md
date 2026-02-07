# AI Coding Agent Instructions for salat-cli

## Project Overview

**salat-cli** is a React/TypeScript CLI for displaying Moroccan prayer times in the terminal. It combines:

- **Ink** (React for CLI) + **Commander.js** (CLI framework) for rich terminal UI
- **Server-side DOM parsing** (domino library) to extract prayer times from web responses
- **LocalStorage caching** to minimize API calls
- **Live countdown timers** that update every second

Think of it as a "React component tree rendered to terminal" architecture, not a traditional Node.js CLI.

---

## Architecture Essentials

### Command Structure (Commander.js)

Three commands exist, defined in [src/commands/](src/commands/):

- **`times [city]`** (default): Show prayer times with live countdown. Options: `-1|--once` (run once, no timer)
- **`guide`**: Display rich visual guide
- **`cities`**: List 190+ supported Moroccan cities

Entry point: [src/app.ts](src/app.ts) registers commands with Commander.

### Data Flow Pattern

```
Command → React Component (Ink) → useSalat Hook → Services
  ↓
  └→ API call (cached in localStorage) → DOM parsing → TimesApp renders to terminal
```

**Key files:**

- [src/hooks/useSalat.ts](src/hooks/useSalat.ts): Orchestrates data fetching, caching, error handling
- [src/services/utils/api.ts](src/services/utils/api.ts): Raw fetch (single endpoint, city ID param)
- [src/services/utils/parser.ts](src/services/utils/parser.ts): Parses HTML response using domino
- [src/services/utils/city.ts](src/services/utils/city.ts): City lookup/validation against [src/data/cities.json](src/data/cities.json)

### React Components (Ink)

Components in [src/components/](src/components/) follow standard React patterns but render to terminal:

- Props match Commander options (e.g., `cityNameArg`, `once`)
- Use Ink's `<Box>`, `<Text>` for layout/styling
- Use React hooks (useSalat) for state management
- Rendered via `render(React.createElement(...))` in commands

---

## Development & Testing

### Local Development

```bash
npm run dev        # Run CLI with ts-node (no build needed)
npm run build      # Compile TypeScript to dist/
npm run start      # Run from compiled dist/
npm test           # Run Vitest (all .test.ts/.test.tsx)
npm run test:coverage
```

### Test Organization

- **Unit tests**: Colocated with source files (`.test.ts`), e.g., [src/services/utils/api.test.ts](src/services/utils/api.test.ts)
- **E2E test**: [tests/cli.e2e.test.ts](tests/cli.e2e.test.ts) (tests full CLI execution)
- **Config**: [vitest.config.ts](vitest.config.ts) uses `node` environment; alias `#` → `src/`

### Key Development Notes

- **Path alias `#`**: Configured in tsconfig.json and vitest.config.ts. Use `#commands/times`, `#services/utils`, not relative imports.
- **LocalStorage disabled in dev**: [src/hooks/useSalat.ts](src/hooks/useSalat.ts#L48) checks `NODE_ENV === "development"` to disable caching (fresh API calls every run).
- **Shebang in dist/**: Build step adds `chmod +x dist/app.js` for binary execution.

---

## Code Patterns & Conventions

### Error Handling

Components return error states naturally: `if (error) return <Text color="red">Error: {error}</Text>`
Hooks throw errors in try/catch that propagate to component state.

### Caching Strategy

- Key: `${cityName.toLowerCase()}_${YYYY-MM-DD}` (fresh cache daily)
- Storage: [node-localstorage](https://www.npmjs.com/package/node-localstorage) (file-based, in `storage/` dir)
- Disable in dev to always fetch fresh data

### Time Utilities

[src/services/utils/time.ts](src/services/utils/time.ts) exports helpers:

- `getNextPrayer()`: Calculates which prayer is next
- `tConv24()`: Converts time format
- Uses date-fns for date manipulation

### Import Organization

```typescript
// External packages first
import { format } from "date-fns";
import { Box, Text } from "ink";

// Then # aliases
import { useSalat } from "#hooks/useSalat";
import { API_URL } from "#services/constants";
```

---

## Integration Points

### External API

- **Endpoint**: Moroccan prayer times service (URL in [src/services/constants.ts](src/services/constants.ts))
- **Method**: GET with `ville=cityId` param
- **Response**: HTML table parsed by domino
- **No auth required**

### Dependencies to Understand

- **Ink**: Terminal React renderer; docs at https://github.com/vadimdemedes/ink
- **Commander**: Parses CLI args; options become JS objects
- **domino**: Server-side DOM; use for selectors like `document.querySelector()`

---

## Common Tasks

**Add a new command**: Create file in [src/commands/](src/commands/), export `Command` instance, register in [src/app.ts](src/app.ts)

**Fix parsing logic**: Inspect actual HTML response in [src/services/utils/parser.ts](src/services/utils/parser.ts); domino supports DOM API selectors.

**Add/update tests**: Follow colocated pattern (`.test.ts` next to source); run `npm test` to execute.

**Update prayer times source**: Only endpoint URL in [src/services/constants.ts](src/services/constants.ts) needs change; parsing adapts if HTML structure shifts.

---

## TypeScript Configuration

- **Target**: ES2022, NodeNext modules
- **Strict mode**: Enabled
- **JSX**: react-jsx (auto-imports React)
- **Paths**: `#/*` points to `src/*`
