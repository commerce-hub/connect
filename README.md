# Commerce Hub Connect wallet SDK workspace

This workspace now includes three local example surfaces for the Commerce Hub Connect integration:

- **Web SDK example** — plain browser host in `projects/commerce-hub-connect-web-sdk/example/index.html`
- **Angular binding example** — standalone Angular host app in `src/app/**`
- **React binding example** — Vite host app in `projects/commerce-hub-connect-react-app/src/example-app.tsx`

## Run the examples

### Web SDK example

```bash
npm run build:web-sdk-widget
npm run start:web-sdk-example
```

### Angular binding example

```bash
npm run start:angular-binding-example
```

This builds the current `CommerceHubConnectSDK.js` bundle and serves the Angular host on port `4500` with local proxy routing for `/commerce-hub-proxy/<environment>`.

### React binding example

```bash
npm run start:react-binding-example
```

This starts the Vite host on port `4173` with local proxy routing for `/commerce-hub-proxy/<environment>`.

## Verification commands

```bash
npm run build:angular-binding-example
npm run test:angular-binding-example
npm run build:angular-binding
npm run test:angular-binding
npm run typecheck:react-binding
npm run build:react-binding
npm run test:react-binding
npm run test:web-sdk-smoke
npm run verify:framework-bindings
```
