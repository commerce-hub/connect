This directory contains HTML files containing your element for development. By running `npm run build:watch` and `npm run serve` you can edit and see changes without bundling.

When `/dev/index.html` is served through `npm run serve`, named CommerceHub
environments such as `DEV` route API traffic through the local web dev server at
`/__commercehub/<environment>` to avoid browser CORS failures from localhost.

Use the `Local merchant proxy` environment when the merchant interaction service
is running locally at `http://localhost:8082`. In this mode, the demo host sends
create and complete requests through `/__commercehub/LOCAL_MERCHANT` while the
widget runtime still uses the runtime custom base URL, which defaults to
`http://localhost:8081`.

The `DEV` example host create-interaction request is signed by the local proxy
with CommerceHub HMAC headers. Provide local credentials from your shell before
starting the dev server:

```bash
COMMERCE_HUB_DEV_API_KEY="OA8U37GoO1M8VAj2fRBDAiC4KeiJ3aGXBrI752kBAbKuw2PN" \
COMMERCE_HUB_DEV_API_SECRET="l2C7nX8hrl4g8DNS08dUQDbrQTVDBXp9rkCSKv50ivvphrNnG3JfnVSJO0G0riw4" \
COMMERCE_HUB_DEV_USER_EMAIL="neer.patel@fiserv.com" \
npm run serve
```

`COMMERCE_HUB_DEV_API_KEY` and `COMMERCE_HUB_DEV_API_SECRET` are required for
signed DEV create and complete requests. `COMMERCE_HUB_DEV_USER_EMAIL` is
optional and defaults to `user@example.com`.
