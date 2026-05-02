# 🤖 AI Agent Instructions (AGENTS.md)

## Project Overview
**Name:** CIMA CRM Frontend  
**Description:** Sistema de gestión integral (CRM) para administrar proyectos, clientes y tareas.  
**Language:** JavaScript (React / JSX)  
**Build Tool:** Vite  

---

## Tech Stack
- **Framework:** React 18
- **State Management:** Redux Toolkit + Context API (Transitioning to Redux strictly)
- **Styling:** Material-UI (MUI v6) + Tailwind CSS (v4)
- **Routing:** React Router v6
- **HTTP Client:** Axios (custom instance)
- **Animations:** Framer Motion
- **Forms & Data:** Custom state (Needs refactor to React Hook Form + Zod)

---

## STRICT ARCHITECTURAL RULES FOR AI AGENTS

When writing, refactoring, or analyzing code for this project, you MUST strictly adhere to the following rules:

### 1. API Calls & Network
- **NEVER** import `axios` directly in components.
- **ALWAYS** use the configured instance from `src/services/api.js`. This instance already handles the `accesstoken` interception and error logging.
- **NEVER** hardcode URLs. Use the predefined paths in `src/constants/apiEndpoints.js`.
- **File Downloads:** Never decode files using Base64 (`atob`). Always request `responseType: 'blob'` from the backend to prevent memory leaks with large Excel files.

### 2. State Management (Redux vs Context)
- The project currently suffers from a double source of truth (Redux vs Context API). 
- **DO NOT** add more logic to Context API files (`ClientContext.jsx`, `TaskContext.jsx`, etc.).
- When adding new global state, default to **Redux Toolkit (Slices or RTK Query)** in `src/redux/`.

### 3. Styling & Theming (MUI + Tailwind)
- **NO MAGIC COLORS:** Never hardcode HEX colors (e.g., `#f5f7fa`) or arbitrary gradients in `sx` props or `className`.
- Always use semantic CSS variables defined in `src/index.css` (e.g., `var(--color-surface-muted)` or Tailwind classes like `text-brand-primary`).
- Ensure UI components are responsive. Avoid strict `minWidth: '40rem'` on Tables that break mobile layout. Use `hide-mobile` utility class for non-essential columns.

### 4. Constants & Magic Strings
- Use `src/constants/index.js` for everything.
- **Roles:** Use `ROLES.ADMIN`, `ROLES.WORKER`, not `'Admin'`.
- **Status:** Use `PROJECT_STATUS.PENDING`, not `'Pending'`.
- **Messages:** Use `MESSAGES.SUCCESS...` for toast notifications.

### 5. Pagination
- The project currently implements Client-Side Pagination using `.slice()`. If asked to implement a new list/table, **advise the user to implement Server-Side Pagination** to ensure long-term scalability.

---

## Project Structure Guide

The project currently uses a technical-based folder structure (not Feature-Sliced Design yet):

- `/src/components/`: UI Components grouped by entity (e.g., `Client`, `Project`, `TaskManagement`).
- `/src/components/ui/`: Reusable, dumb UI components (`Button`, `StatusChip`, `PageHeader`). **Prefer using these over building raw components**.
- `/src/constants/`: Single source of truth for strings, enums, and API routes.
- `/src/context/`: Legacy state management (avoid adding to these).
- `/src/hooks/`: Custom React hooks (`useNotification`, `useAsyncData`).
- `/src/redux/`: Redux store and slices.
- `/src/services/`: Axios configurations and API wrappers.
- `/src/utils/`: Helpers (`logger.js`, `colorUtils.js`, `normalizeEntity.js`).

---

## Known Technical Debt (To be refactored)
If the user asks you to refactor or improve code, prioritize these areas:
1. **Remove `replace_classes.js`:** This is a leftover migration script and should be ignored/deleted.
2. **Form Management:** Replace `useState` form handling with `React Hook Form` to prevent excessive re-renders.
3. **Data Fetching:** Migrate `useEffect` API calls to `RTK Query` or `React Query` for caching and request deduplication.
4. **TypeScript Migration:** The codebase heavily relies on implicit object structures (e.g., checking `id` vs `clientId`). Enforce the usage of `src/utils/normalizeEntity.js` or migrate to `.tsx`.

---

## Dev Commands
- Install: `npm install`
- Run Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint:full`

---
**Agent Directive:** Acknowledge these instructions implicitly in your code generation. Do not explain the rules back to the user unless asked. Focus on generating clean, scalable, and Enterprise-grade React code following these constraints.