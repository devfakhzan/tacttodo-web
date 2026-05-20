# TactTodo Web

React frontend for the TactTodo GraphQL API. Sign up, log in, and manage a personal todo list.

Live: https://web-tactlink-test.vercel.app/

## Setup

```bash
npm install
cp .env.example .env
```

Point `VITE_GRAPHQL_URL` at your API. Production uses the Lambda URL from the backend repo.

## Run

```bash
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_GRAPHQL_URL` | `http://localhost:4000/graphql` | GraphQL endpoint |

Auth tokens are stored in `localStorage` under `tacttodo_token`.

## Architecture

- **Stack:** Vite, React 19, TypeScript, Tailwind CSS 4
- **Data:** Apollo Client talks to the shared GraphQL API
- **Auth:** Login/signup mutations return a JWT; auth link adds the Bearer header on each request
- **Layout:** Single-page flow. Unauthenticated users see the auth form. Logged-in users see the todo list.
- **Deploy:** Static build on Vercel. Set `VITE_GRAPHQL_URL` in project env vars for production.

Responsive layout uses Tailwind breakpoints (`sm:`) so the form and list work on phone-width screens.

## Time

About 1.5 hours.

## Scripts

- `npm run dev` - development server
- `npm run build` - production build
- `npm run preview` - serve the production build locally
