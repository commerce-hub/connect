---
name: refresh-commercehub-swagger
description: Use when refreshing the CommerceHub Connect Wallet SDK OpenAPI specs from sibling local Spring Boot services, including swagger.json from OnlineApplication or merchant-swagger.json from PaymentsApplication.
---

# Refresh CommerceHub Swagger

## Overview

Refresh the SDK's checked-in OpenAPI specs from live local sibling services. Treat the running service's `/v3/api-docs` response as the source of truth, then validate and summarize the saved contract delta.

## Targets

| SDK file | Service repo | Launch config | Expected app | Usual URL |
| --- | --- | --- | --- | --- |
| `swagger.json` | `/Users/neer.patel/Documents/repos/commercehub-connect-online-service` | `.vscode/launch.json` `OnlineApplication` | `com.fiserv.commercehub.connect.online.OnlineApplication` | `http://localhost:8080/v3/api-docs` |
| `merchant-swagger.json` | `/Users/neer.patel/Documents/repos/chub-connect-wallet-service` | `.vscode/launch.json` `Payments Application` | `com.fiserv.commercehub.connect.payments.PaymentsApplication` | `http://localhost:8082/v3/api-docs` |

Always read the service repo's `.vscode/launch.json` before launching. Do not assume the port if the launch config or active process says otherwise.

## Workflow

1. Inspect state before changing files:

```bash
git -C /Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk status --short --branch
git -C <service-repo> status --short --branch
sed -n '1,240p' <service-repo>/.vscode/launch.json
```

Preserve existing local edits. If the service repo has unrelated local changes, do not reset or discard them.

2. Identify launch details from `launch.json`:

- Use `mainClass` as the Spring Boot main class.
- Use `vmArgs` for active profiles and required `--add-opens` options.
- Use `args` for explicit server port when present.
- If no port is configured, probe the default Spring Boot port `8080` after launch.

3. Check whether the app is already running:

```bash
lsof -nP -iTCP:<port> -sTCP:LISTEN
ps -p <pid> -o pid=,command=
```

If the process command contains the expected main class and port, use it. If the port is occupied by a different process, stop and report the conflict.

4. Start the app only if needed.

For Online:

```bash
cd /Users/neer.patel/Documents/repos/commercehub-connect-online-service
./mvnw spring-boot:run \
  -Dspring-boot.run.main-class=com.fiserv.commercehub.connect.online.OnlineApplication \
  -Dspring-boot.run.jvmArguments='-Dspring.profiles.active=local,Online --add-opens=java.base/java.lang=ALL-UNNAMED'
```

For Payments:

```bash
cd /Users/neer.patel/Documents/repos/chub-connect-wallet-service
./mvnw spring-boot:run \
  -Dspring-boot.run.main-class=com.fiserv.commercehub.connect.payments.PaymentsApplication \
  -Dspring-boot.run.arguments='--server.Port=8082' \
  -Dspring-boot.run.jvmArguments='-Dspring.profiles.active=local,Payments --add-opens=java.base/java.lang=ALL-UNNAMED'
```

Wait for the Spring Boot startup line before fetching Swagger. Avoid echoing local YAML secrets or request authorization headers from logs.

5. Fetch the Swagger JSON into the SDK repo:

```bash
curl --fail --silent --show-error --max-time 20 \
  http://localhost:<port>/v3/api-docs \
  -o /Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk/<target-file>
```

`curl` is acceptable here because the endpoint is localhost.

6. Validate and summarize:

```bash
jq -e '.openapi and .paths and (.paths | length)' /Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk/<target-file>
jq -r '"openapi=" + .openapi, "paths=" + ((.paths | length) | tostring), "title=" + (.info.title // "")' /Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk/<target-file>
git -C /Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk diff --stat -- <target-file>
git -C /Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk status --short --branch
```

For minified one-line JSON diffs, use structured comparisons with `jq` instead of pasting the raw full diff. Useful checks:

```bash
git -C /Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk show HEAD:<target-file> | jq '.paths | length'
jq '.paths | length' /Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk/<target-file>
```

7. Cleanup:

- If the app was already running, leave it running.
- If this workflow started the app, stop that process after fetching and verify the port is released with `lsof`.

## Guardrails

- Do not commit generated specs unless the user asks.
- Do not regenerate TypeScript clients or docs unless the user asks for a full sync.
- Do not hand-edit `swagger.json` or `merchant-swagger.json`; refresh them from `/v3/api-docs`.
- Keep unrelated SDK files and untracked directories untouched.
- If fetching fails, report the app state, port, endpoint, and last relevant startup error.
