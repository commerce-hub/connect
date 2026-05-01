# Commerce Hub Connect wallet SDK workspace

This workspace includes two local example surfaces for the Commerce Hub Connect integration:

- **Web SDK example** — plain browser host in `projects/commerce-hub-connect-web-sdk/example/index.html`
- **React binding example** — Vite host app in `projects/commerce-hub-connect-react-app/src/example-app.tsx`

## Run the examples

### Web SDK example

```bash
npm run build:web-sdk-widget
npm run start:web-sdk-example
```

### React binding example

```bash
npm run start:react-binding-example
```

This starts the Vite host on port `4173` with local proxy routing for `/commerce-hub-proxy/<environment>`.

## Angular binding library

```bash
npm run build:angular-binding
npm run test:angular-binding
```

## Verification commands

```bash
npm run build
npm run test
npm run typecheck:react-binding
npm run build:react-binding
npm run test:react-binding
npm run test:web-sdk-smoke
npm run verify:framework-bindings
```
