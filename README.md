# Aster Workspace

Aster Workspace is a Notion-inspired writing and organization application for capturing ideas, building nested pages, and editing rich documents. The app uses Next.js for its web interface and a separate Express service for its REST API. Vercel routes both services through one deployment and domain. MongoDB stores users and pages.

## Project overview

This repository is configured as a **Vercel multi-service project**. The `app` service runs the Next.js frontend from the repository root; the `server` service runs the Express API from `server/`. Vercel routes `/api/*` to Express and all other paths to Next.js. The duplicate Next.js catch-all API handler has been removed so there is a single deployed API implementation.

## Features

- Account registration, login, logout, and cookie-based sessions
- Create and edit rich-text pages with Tiptap
- Nested pages, page navigation, breadcrumbs, and page actions
- Favorites, search, duplication, trash, restore, and permanent deletion
- MongoDB persistence
- Same-origin `/api` endpoints for straightforward Vercel deployment

## Tech stack

- **Web:** Next.js 15, React 19, App Router, JavaScript
- **Editor:** Tiptap
- **UI:** Tailwind CSS, Lucide React, Zustand
- **API:** Express service (`server/src/app.js`)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT in an HTTP-only cookie
- **Hosting:** Vercel (web + API), MongoDB Atlas (database)

## Prerequisites

- Node.js 20.9 or newer (Node.js 22 LTS is recommended)
- npm
- A MongoDB database. MongoDB Atlas is recommended for deployment.
- A Vercel account for deployment

## Local installation and setup

1. Clone the repository and enter the project directory:

   ```bash
   git clone <your-repository-url>
   cd Aster-Workspace
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

4. Set `MONGO_URI` to a reachable MongoDB connection string and set `JWT_SECRET` to a long, random secret. For local MongoDB, a typical URI is `mongodb://127.0.0.1:27017/aster-workspace`.

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000). For local development, run the Next.js frontend and Express API in separate terminals. Start the API with `cd server && npm install && npm run dev`, then start Next.js from the repository root with `npm run dev`. Set `NEXT_PUBLIC_API_URL=http://localhost:5001/api` in `.env.local` for local development; production uses the same-origin `/api` route through Vercel.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string. Use MongoDB Atlas for Vercel. |
| `JWT_SECRET` | Yes | Long random secret used to sign authentication tokens. |
| `JWT_EXPIRES_IN` | No | JWT lifetime, e.g. `7d` (default is `7d`). |
| `NODE_ENV` | Managed | Vercel sets `production` for production deployments. |

Do not commit `.env.local` or real credentials. Do not use a `NEXT_PUBLIC_` prefix for database credentials or JWT secrets; those values must remain server-only. The client uses `/api` by default, so `NEXT_PUBLIC_API_URL` is normally unnecessary.

## Deploy the multi-service application to Vercel

1. Push this repository to GitHub and import it into Vercel as one project.
2. Keep the project root at the repository root (the directory containing this `package.json`, `next.config.mjs`, and `vercel.json`). Do not set the Vercel project root to `server/`.
3. `vercel.json` declares `app` (Next.js, root `.`) and `server` (Express, root `server`, entrypoint `src/app.js`). It routes `/api/*` to `server` and all other paths to `app`.
4. In **Project → Settings → Environment Variables**, add the following for the API service (and for the app service only if any future server-side code needs them):
   - `MONGO_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: a long, unique random secret
   - optionally `JWT_EXPIRES_IN`
5. In MongoDB Atlas, allow network access from Vercel. For a quick initial setup, Atlas may permit `0.0.0.0/0`, but restrict access where your deployment/networking setup allows it and always use strong database credentials.
6. Deploy. Test registration, login, page creation/editing, search, trash/restore, and logout on the deployed URL.

### How services and routing work on Vercel

- `app` is the Next.js frontend service.
- `server` is the Express API service, exposed through the `/api/*` rewrite.
- The browser calls the same-origin `/api` path. No service binding is needed for this browser-to-public-route flow; Vercel routing handles it. Add a binding only if server-side code in one service directly calls another service's internal URL.
- `server/src/app.js` connects to MongoDB through cached Mongoose connection middleware, so it works as a Vercel Express entrypoint and from the local server launcher.

Serverless functions have execution-time and connection limits. This API is request/response based and does not require a persistent server. If you later add WebSockets, in-memory background jobs, or long-running workers, move those workloads to a service designed to run continuously or use a managed queue.

## Useful commands

```bash
npm run dev      # Local development
npm run lint     # ESLint
npm run build    # Production build
npm start        # Run the production build locally
```

## Troubleshooting

- **Database connection error:** Check `MONGO_URI`, Atlas credentials, IP access rules, and database user permissions.
- **JWT configuration error:** Ensure `JWT_SECRET` is set in the environment used by the current deployment.
- **API returns 500 on Vercel:** Inspect the function logs in Vercel and confirm environment variables are configured for the correct environment (Preview/Production).
- **Login does not persist:** Verify the browser accepts cookies, the site is accessed over HTTPS in production, and no proxy/browser extension is stripping cookies.
- **Build fails locally:** Use a supported Node.js version and run `npm install` from the repository root before `npm run build`.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.
