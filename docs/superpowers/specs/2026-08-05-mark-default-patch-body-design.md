# Mark-default PATCH body design

## Goal

Make the wallet SDK's mark-as-default request satisfy the MPP API contract.

## Request contract

`PATCH /interaction/source/{sourceId}` will continue using the selected source ID in the URL and the current interaction and authorization headers. It will additionally send `Content-Type: application/json` with this body:

```json
{"isDefault": true}
```

No shared request behavior or other source operations will change.

## Testing

The existing mark-as-default request test will assert that the PATCH request has JSON content type and parses to `{isDefault: true}`. The test must fail before the implementation change and pass afterward. The focused test file and SDK build will be run for verification.

