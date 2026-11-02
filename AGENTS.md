# Project Agent Guidance

## Scope of AI Resources

- Keep project-specific skills, custom agents, and durable memories scoped to this workspace. Store skills in `.github/skills/`, custom agent definitions in `.github/agents/`, and use repository-scoped memory only.
- Do not create or modify user-profile or global skills, agents, or memories for this project.
- Load a project skill or agent only when it applies to the task; avoid duplicating guidance already covered by this file or the README.

## Project Conventions

- This is a standalone Angular application with routing, Angular service-worker support, Tailwind CSS, and NgRx Signal Store.
- Use `npm start` for development; the dev server runs on port `45080`. Keep `angular.json` and `.vscode/launch.json` aligned when changing that port. The test debugger uses a separate port.
- Tailwind is imported from `src/styles.css`. The root view is in `src/app/app.ts`; the counter store example is in `src/app/counter.store.ts`.
- The service worker is enabled for production builds, not development.
- See [README.md](README.md) for setup and standard commands.

## Verification

- Run `npm run build` after application changes.
- Run `npm test -- --watch=false` for a non-interactive test run.