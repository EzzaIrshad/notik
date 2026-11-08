# React + TypeScript + Vite

## Overview

This frontend is a React + TypeScript app built with Vite. It expects an API backend and uses an Axios instance that reads the API base URL from a Vite environment variable.

## Prerequisites

- Node.js (recommended >= 18)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
# or
# yarn
```

2. Create a `.env` file at the project root (optional) to define the API base URL and other Vite variables. Vite requires env variables that are exposed to the client to be prefixed with `VITE_`.

Example `.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set, the Axios instance will use a relative base URL and requests will target the current origin.

## Useful scripts

- `npm run dev` — start the dev server (Vite)
- `npm run build` — compile TypeScript and build the production bundle
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## API configuration

The Axios instance is configured in `src/shared/api/axiosInstance.ts` and uses `import.meta.env.VITE_API_URL` as the `baseURL`.

If your backend runs on a different host or port during development, set `VITE_API_URL` accordingly (for example `http://localhost:5000/api`).

For a Vercel deployment, add `VITE_API_URL` in the frontend project's Environment Variables with the deployed backend API URL (including `/api`), then redeploy. Without it, requests such as `/auth/me` go to the frontend's own domain, where the API endpoint may return `404`.

## Notes

- Keep any secrets on the server side — Vite-exposed env vars are bundled into client code.
- If you change environment variables, restart the dev server to pick up changes.

## Further reading

See the project root and `frontend/src` for app structure and feature code.