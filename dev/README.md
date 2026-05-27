This directory contains HTML files containing your element for development. By running `npm run build:watch` and `npm run serve` you can edit and see changes without bundling.

When `/dev/index.html` is served through `npm run serve`, named CommerceHub
environments such as `DEV` route API traffic through the local web dev server at
`/__commercehub/<environment>` to avoid browser CORS failures from localhost.
