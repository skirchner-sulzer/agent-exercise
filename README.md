# Agent Exercise

An Angular starter with routing, Angular PWA support, Tailwind CSS, and NgRx Signal Store.

## Requirements

- Node.js compatible with the installed Angular CLI
- npm

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:45080`. The Angular development server uses port `45080` by default.

## Build and test

```bash
npm run build
npm test
```

The service worker is enabled for production builds. Tailwind CSS is imported in `src/styles.css`; `src/app/counter.store.ts` shows the NgRx Signal Store pattern used by the starter view.
