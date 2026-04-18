# HardCode — Frontend

React 19 + Vite 8 frontend for the **HardCode** AI-powered hardware project design platform.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | 12 | Animations & transitions |
| Zustand | 5 | State management |
| React Router | 7 | Client-side routing |
| Axios | 1.x | HTTP client |
| React Hot Toast | 2.x | Notifications |

## Getting Started

```bash
npm install
npm run dev
```

App runs at **http://localhost:5173**. Backend must be running at `http://localhost:5000`.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| `HeroPage` | `/` | Landing page with 3D tilt feature cards |
| `AuthPage` | `/auth` | Login & signup |
| `HomePage` | `/home` | Project dashboard (create, rename, delete) |
| `ProjectMainPage` | `/project/:id` | Ideation + Components chat tabs |
| `DesignPage` | `/project/:id/design` | Design chat + Wokwi Proof Lab |

## Components

| Component | Description |
|-----------|-------------|
| `ProjectChat` | Ideation phase chat with AI suggestion chips |
| `ComponentsChat` | Components phase chat with AI suggestion chips |
| `DesignChat` | Design phase chat with AI suggestion chips |
| `WokwiProofLab` | Live Wokwi simulation panel (lint, run, scenario, serial, MCP) |

## State Management (Zustand)

| Store | File | Description |
|-------|------|-------------|
| Auth | `useAuthStore.js` | Current user, login/logout actions |
| Theme | `useThemeStore.js` | Dark/light theme persistence |

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```
