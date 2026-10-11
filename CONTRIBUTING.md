# Contributing to Aster Workspace

Thank you for considering a contribution! This guide describes the workflow for proposing fixes and improvements.

## Before you start

- Check existing issues and pull requests to avoid duplicate work.
- For a substantial change, open an issue first to discuss the approach.
- Never commit credentials, `.env.local`, database dumps, or real user data.

## 1. Fork the repository

1. Open the repository on GitHub.
2. Select **Fork** and create a fork under your account.
3. Clone your fork locally:

   ```bash
   git clone https://github.com/<your-username>/<repository>.git
   cd <repository>
   ```

4. Add the upstream repository so you can sync future changes:

   ```bash
   git remote add upstream https://github.com/<upstream-owner>/<repository>.git
   git remote -v
   ```

## 2. Set up the project

1. Install Node.js 20.9 or newer (Node.js 22 LTS is recommended).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` from the template and configure a development database:

   ```bash
   cp .env.example .env.local
   ```

   Set `MONGO_URI` and `JWT_SECRET`. Do not use production credentials in local development.

4. Start the app and verify it opens at `http://localhost:3000`:

   ```bash
   npm run dev
   ```

5. Before submitting, run the checks:

   ```bash
   npm run lint
   npm run build
   ```

## 3. Create a branch

Sync your local main branch and create a focused branch for the change:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git checkout -b <type>/<short-description>
```

Use these branch prefixes:

- `feat/` — a new feature
- `fix/` — a bug fix
- `docs/` — documentation only
- `refactor/` — internal restructuring without intended behavior changes
- `test/` — tests or test infrastructure
- `chore/` — maintenance and tooling

Example: `fix/page-trash-restore`.

## 4. Make and verify your changes

- Keep each pull request focused on one logical change.
- Follow the existing JavaScript and React conventions.
- Preserve API response shapes and authentication behavior unless the change explicitly updates them.
- Validate user input on the server; never rely on client-side validation for security.
- Keep secrets server-side. Do not expose `MONGO_URI` or `JWT_SECRET` through `NEXT_PUBLIC_*` variables.
- When changing API behavior, test success and failure paths, including unauthenticated requests where relevant.
- For UI changes, check desktop and mobile layouts and loading/empty/error states.
- Run `npm run lint` and `npm run build` before opening the pull request, and report any check you could not run.

## 5. Commit your work

Use a concise imperative commit message. Conventional Commit prefixes are encouraged:

```bash
git add <changed-files>
git commit -m "fix: restore trashed pages"
```

Examples: `feat: add page duplication`, `docs: clarify Vercel setup`, `refactor: reuse database connection`.

## 6. Push and open a Pull Request

1. Push the branch to your fork:

   ```bash
   git push -u origin <type>/<short-description>
   ```

2. On GitHub, select **Compare & pull request**.
3. Set the upstream repository's `main` branch as the base and your feature branch as the compare branch.
4. Include in the pull request description:
   - What changed and why
   - Related issue (use `Closes #123` when appropriate)
   - Screenshots or a short recording for visible UI changes
   - Commands/checks run and their results
   - Any migration, environment variable, or deployment considerations
5. Respond to review feedback with additional commits on the same branch. Do not force-push unless a maintainer asks.

## Pull request checklist

- [ ] The change addresses a specific issue or clearly explains its motivation.
- [ ] No secrets, generated build output, or unrelated changes are included.
- [ ] Existing functionality and API response contracts are preserved where possible.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes, or any blocker is documented.
- [ ] Documentation and environment examples are updated if needed.
- [ ] UI changes include screenshots when helpful.

## Reporting security issues

Please do not publish secrets or exploit details in a public issue. Contact the repository maintainers privately to report a security concern.

Thanks for helping improve Aster Workspace!
