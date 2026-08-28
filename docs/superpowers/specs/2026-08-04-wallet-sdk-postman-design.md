# Wallet SDK Postman collection design

## Goal

Provide a shareable Postman collection that documents every HTTP API currently called by the CommerceHub Connect Wallet SDK and the demo application's interaction bootstrap. The collection targets Fiserv DEV directly and is deliberately safe for manual exploration: it never chains requests automatically, and potentially mutating operations run only when a user explicitly sends them.

## Deliverables

The wallet SDK repository will contain:

- `postman/commercehub-wallet-sdk.postman_collection.json`, a Postman Collection v2.1 file;
- `postman/commercehub-dev.postman_environment.json`, a DEV environment containing only non-secret defaults and blank sensitive variables;
- `postman/README.md`, with setup, request ordering, safety guidance, and variable descriptions; and
- a repository-local Node validation script and test command that inspect the artifacts without calling DEV.

The collection is reference-oriented and manually operated. It is not an end-to-end collection runner or a load-test suite.

## Environment and defaults

All API requests use `https://connect-dev.fiservapis.com/chc` through a `baseUrl` environment variable. They do not route through the Angular demo proxy.

The environment pre-fills only the non-sensitive values already used by the demo application:

- `partyId`: `104604000020044`
- `clientId`: `marriottest`
- `merchantId`: `104604000000046`
- `terminalId`: `10000001`
- tender types: `BANK_ACCOUNT`, `CARD`
- interaction mode: `PRE_AUTHENTICATED`
- features: `ADD_ACCOUNT`, `SELECT`

Merchant credentials, OAuth access tokens, OTPs, payment-source data, bank/card details, document paths, and other sensitive or user-specific values remain blank. The files will contain no usable secret or real customer financial data.

## Collection structure

Requests are grouped by purpose and risk:

1. **Bootstrap**
   - `POST /merchant/interaction/create`
2. **Interaction and OTP**
   - `GET /interaction`
   - `POST /interaction/otp/validate`
   - `POST /interaction/otp/send/email`
   - `POST /interaction/billing-address`
3. **Optional — Source creation and management**
   - `POST /interaction/source/card`
   - `POST /interaction/source/ach`
   - `POST /interaction/source/v2/ach?currencyCode={{currencyCode}}`
   - `POST /interaction/source/{{paymentSourceId}}/attach`
   - `DELETE /interaction/source/{{sourceId}}`
4. **Optional — Verification and documents**
   - `POST /interaction/verify/step1`
   - `POST /interaction/verify/uploadField`
   - `POST /interaction/doc/upload/{{sourceId}}/{{docType}}`
   - `POST /interaction/verify/step2`
5. **Optional — Pay by Bank**
   - `POST /party/configuration-inquiry`
   - `GET /interaction/source/pbb/session`
   - `PUT /interaction/source/pbb/session/{{aldSessionId}}/{{pToken}}`
6. **Optional — Native accounts and transfers**
   - `GET /interaction/source/native/balances`
   - `POST /interaction/source/native/transfer`

Folder and request descriptions identify side effects and prerequisites. Delete and transfer requests receive especially prominent warnings. Postman scripts never use `setNextRequest`, and the collection defines no runner-oriented workflow.

## Authentication and data flow

The Create Interaction request reproduces the demo application's merchant authentication. Its pre-request script constructs the signature input as:

```text
apiKey + clientRequestId + timestamp + rawRequestBody
```

It calculates HMAC-SHA256 with the blank-by-default merchant secret, Base64-encodes the digest, and places the value in `Authorization`. The response test stores only transient session values needed by later manually invoked requests: `interactionId`, OAuth fields, `keyId`, and `publicKey`.

Wallet requests send `x-interaction-id: {{interactionId}}`. Requests that require OAuth also send `Authorization: Bearer {{accessToken}}`. Payment-source creation additionally sends:

- `Api-Key: {{oauthClientId}}`
- `Auth-Token-Type: {{oauthTokenType}}`
- `x-key-id: {{keyId}}`

Card and ACH request scripts encrypt configured test fields with the RSA `publicKey` returned by Create Interaction. Encryption happens only when the user manually sends that request. If required inputs or the key are absent, the script fails clearly instead of submitting plaintext or guessed data.

## Safety and error handling

- Nothing is sent merely by importing the collection or selecting an environment.
- No request automatically selects or launches another request.
- Risky operations live in folders prefixed with `Optional` and require blank-by-default inputs.
- Requests use explicit variables rather than embedded secrets, OTPs, tokens, account numbers, or local filenames.
- Pre-request scripts stop with readable errors when required credentials, session values, encryption keys, or inputs are missing.
- Response tests capture values only after a successful response with the expected fields; unsuccessful responses preserve existing variables and expose diagnostic details in Postman.
- The README tells users to obtain approved DEV credentials and synthetic test data, review each body, and send requests individually.

## Source of truth

Endpoint inventory, headers, and payload shapes come from the checked-out wallet SDK source and its Swagger/OpenAPI definition. Models and validation constraints are cross-checked against the latest local `development` branch of `commercehub-connect-mpp-core`. Demo defaults and merchant HMAC behavior come from `chc-demo-app`.

The collection mirrors observed runtime behavior. It does not invent unsupported orchestration, automatically manufacture OTPs, or embed environment-specific credentials.

## Validation

Validation is local-only and makes no HTTP calls. It will verify:

- the collection and environment are valid JSON with the expected Postman schemas;
- every inventoried SDK/bootstrap method and route is represented exactly once;
- all request URLs resolve from the direct DEV `baseUrl` rather than localhost or the demo proxy;
- no script uses `setNextRequest` or equivalent automatic request chaining;
- no credential, token, OTP, private key, card number, account number, or document path is populated;
- the Create Interaction request contains the required HMAC logic;
- card and ACH requests contain the required RSA-encryption safeguards;
- risky requests remain under clearly labeled optional folders; and
- collection scripts and JSON files parse successfully.

The deliverables will be committed separately from existing user-owned source, test, deployment-script, and sample-app changes.
