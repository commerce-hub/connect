This directory contains HTML files containing your element for development. By running `npm run build:watch` and `npm run serve` you can edit and see changes without bundling.

When `/dev/index.html` is served through `npm run serve`, named CommerceHub
environments such as `DEV` route API traffic through the local web dev server at
`/__commercehub/<environment>` to avoid browser CORS failures from localhost.

The `DEV` example host create-interaction request is signed by the local proxy
with CommerceHub HMAC headers. Provide local credentials from your shell before
starting the dev server:

```bash
COMMERCE_HUB_DEV_API_KEY="your-api-key" \
COMMERCE_HUB_DEV_API_SECRET="your-api-secret" \
COMMERCE_HUB_DEV_USER_EMAIL="user@example.com" \
npm run serve
```

`COMMERCE_HUB_DEV_API_KEY` and `COMMERCE_HUB_DEV_API_SECRET` are required for
signed DEV create and complete requests. `COMMERCE_HUB_DEV_USER_EMAIL` is
optional and defaults to `user@example.com`.
