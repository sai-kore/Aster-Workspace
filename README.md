# Aster Workspace

Aster Workspace is a Notion-inspired writing and organization application for capturing ideas, building nested pages, and editing rich documents. The app uses the Next.js App Router for its web interface and Vercel serverless API functions for its Express REST API. MongoDB stores users and pages.

## Project overview

This repository is designed for a **single Vercel deployment**. The frontend and API ship together; you do not need a separate backend hosting service. The API is implemented with a Next.js App Router catch-all Route Handler in `app/api/[[...path]]/route.js`. It uses the existing Mongoose models and helper utilities, so requests and database access run in Vercel serverless functions without a separate Express server.

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
- **API:** Next.js App Router Route Handler (Vercel Node.js function)
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

6. Open [http://localhost:3000](http://localhost:3000). The API is available on the same origin under `/api`, including `/api/health`. The API uses MongoDB Atlas and requires `MONGO_URI` and `JWT_SECRET` to be set before requests can succeed.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string. Use MongoDB Atlas for Vercel. |
| `JWT_SECRET` | Yes | Long random secret used to sign authentication tokens. |
| `JWT_EXPIRES_IN` | No | JWT lifetime, e.g. `7d` (default is `7d`). |
| `NODE_ENV` | Managed | Vercel sets `production` for production deployments. |

Do not commit `.env.local` or real credentials. Do not use a `NEXT_PUBLIC_` prefix for database credentials or JWT secrets; those values must remain server-only. The client uses `/api` by default, so `NEXT_PUBLIC_API_URL` is normally unnecessary.

## Deploy the entire application to Vercel

1. Push this repository to GitHub.
2. In Vercel, select **Add New → Project** and import the repository.
3. Set the **Root Directory** to the repository root (the directory containing this `package.json` and `next.config.mjs`).
4. Use the Next.js framework preset. The default build command (`npm run build`) and output settings should be detected automatically.
5. In **Project → Settings → Environment Variables**, add:
   - `MONGO_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: a long, unique random secret
   - optionally `JWT_EXPIRES_IN`
6. In MongoDB Atlas, allow network access from Vercel. For a quick initial setup, Atlas may permit `0.0.0.0/0`, but restrict access where your deployment/networking setup allows it and always use strong database credentials.
7. Deploy. Test registration, login, page creation/editing, search, trash/restore, and logout on the deployed URL.

### How the API runs on Vercel

`app/api/[[...path]]/route.js` implements the application API as Next.js App Router Route Handlers, including authentication and page CRUD operations. The legacy Express server files are retained for reference and local compatibility, but they are not used by the Vercel deployment. The handler connects to MongoDB on demand and reuses the Mongoose connection across warm invocations. No separate Express server process is required for the deployed app.

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
