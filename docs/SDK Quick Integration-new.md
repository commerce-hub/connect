# PbB SDK Quick Integration

This is the minimum integration guide for the merchant using the SDK in QA.

---

## Fixed Merchant Values

| Key | Value |
|-----|-------|
| **SDK URL** | `https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js` |
| **locale** | `en-US` |
| **environment** | `qa` |

> ⚠️ **Use the `secret` only on the backend. Do not expose it in browser code.**
> **Do not use the `configId` in browser code.**
> Use follow return structure from `/pbb/session/` API to pass params to th SDK {"aggregatorSessionId": "4830706551466b346966714d506a614e33796f306b673d3d","tokenID": "Vo6teKMmvAQ5RNrbeBM8VUnrWszo","publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzZIskdZQp2cb0p2Wk5uFe6awdkXzARvKQeRzapJIGGKptqjKTP9E4x6p3BXZf5/fPgznfMG8XQgRGX19gM+NVtZ4PLzAVDMJVtjuA2UQU+oyqHo8cE2/wybKFpIeSfxgxchumVkFDi+WxjqJcK+qISQCi1tnNE/NPOHtQUie1vsJtxVzES/wCDXl8oxWhG9u/xn2yyAI1IE7JLXQtRta0Yb3KpLKiRgmQIGWr5d/YJrP7w2WOtY+okkt9Dr1LRGoo3aKgRIxPvlNu9OfNeZwP9yv6kOWAZeJ1xCs/cqjyOVON1MRs59pZ5VC9jcwOi1hjs+9QVYtMyF6UvFzwRDBoQIDAQAB", "pToken": "pbb-a6bdfe3e-0092-4ce3-84af-679872760d76"}

---

## What The Frontend Needs

The SDK host page only needs:

- A container element
- `apiKey`
- `accessToken`
- `configId`
- `locale`
- `containerId`
- `onEvent`

> `publicKey` is not included in this guide.

---

## Backend Step

Your backend should call `createsessiontoken` using:

- **apiKey:** `YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A`
- **secret:** `VvVF4nxfhdoGYrthUKDSBJweJesaZXKwcLoi2MzHvGeOjIA0CAVs5XOcH8jTGhtG`

Return a minimal payload to the browser like:

```json
{
  "accessToken": "<TOKEN_ID_FROM_CREATESESSIONTOKEN>",
  "aggregatorSessionId": "<OPTIONAL_AGGREGATOR_SESSION_ID>"
}
```

**Mapping:**

| Response Field | Browser Field |
|----------------|---------------|
| `security.tokenID` | `accessToken` |
| `aggregator.aggregatorSessionId` | `aggregatorSessionId` |

---

## Minimal Host Page Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SDK</title>
  <style>
    #banklink-container {
      width: 100%;
      min-height: 720px;
    }
  </style>
</head>
<body>
  <div id="banklink-container"></div>
  <script src="https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js"></script>
  <script>
    async function launchSdk() {
      const session = "<Session details from server>";
      window.PaymentSDK.init({
        apiKey: "YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A",
        accessToken: session.accessToken,
        configId: "cce84049-0940-4926-9a54-9eaca0c09830",
        aggregatorSessionId: session.aggregatorSessionId,
        environment: "qa",
        locale: "en-US",
        containerId: "banklink-container",
        onEvent: handleSdkEvent
      });
    }

    function handleSdkEvent(event) {
      console.log("SDK event:", event);
      if (["success", "failure", "cancel", "error"].includes(event.type)) {
        window.PaymentSDK.destroy();
      }
    }

    launchSdk().catch((error) => {
      console.error("SDK init failed", error);
    });
  </script>
</body>
</html>
```

---

## Terminal Events

The merchant receives only terminal outcomes in `onEvent`:

- `success`
- `failure`
- `cancel`
- `error`

### Typical `success` Payload

```json
{
  "type": "success",
  "payload": {
    "transactionStatus": "SUCCESS",
    "transactionStatusCode": 0,
    "transactionStatusDescription": "Success",
    "responseVerbiage": "User data captured"
  }
}
```

---

## Notes

- Keep the SDK URL and environment aligned. This document is **QA-only**.
- Call `window.PaymentSDK.destroy()` before re-initializing.
- Make sure the mount container has visible height.

