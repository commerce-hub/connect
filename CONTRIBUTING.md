# Contributing

## Development

Install dependencies and run the standard checks before opening a pull request:

```bash
npm i
npm run build
npm run lint
npm test
```

Use `BROWSERS=chromium npm run test:dev -- --files test/<file>.js` for focused
browser-test iteration, then run the full test suite before submitting.

## Generated Files

Generated OpenAPI types live in `src/generated/openapi.ts`. Regenerate them
with:

```bash
npm run generate:client
```

Do not hand-edit generated OpenAPI output. The public `InteractionResponse`
type intentionally augments the generated response with optional gateway
`oauth` data in `src/commerce-hub-connect.ts`; preserve that local augmentation
after regenerating from `swagger.json`.

## Security

Do not commit secrets, merchant tokens, private registry configuration, real
customer data, or production request payloads. Use synthetic fixtures in tests
and environment variables for local credentials.
