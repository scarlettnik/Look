# Look Frontend

Frontend for the Look Telegram Web App built with React, Vite, TypeScript and MobX.

## Commands

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run check`

## Development

The app reads Telegram Web App `initData` from the real Telegram environment.
For browser-only local development you can optionally provide a dev token:

```bash
VITE_DEV_TELEGRAM_INIT_DATA='user=%7B...%7D&hash=...' npm run dev
```

Without this variable the app still starts locally, but authenticated API requests will not be initialized.

## Structure

- `src/app/providers` — application providers and hooks
- `src/app/stores` — typed MobX stores and root store
- `src/components` — page-level and reusable UI components
- `src/features` — feature-specific flows
- `src/lib` — API client, Telegram helpers and shared utilities
- `src/shared` — shared UI primitives
- `src/types` — domain models

## Quality Gates

CI and local validation use the same pipeline:

```bash
npm run check
```
