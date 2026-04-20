# Quick BankLink SDK Integration

This is the minimum setup for `BankLinkWidget.json`.

## Direct Values

- `apiKey`: `YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A`
- `secret`: `VvVF4nxfhdoGYrthUKDSBJweJesaZXKwcLoi2MzHvGeOjIA0CAVs5XOcH8jTGhtG`
- `configId`: `864b884d-b03d-4af7-8bda-f0e9c343df11`
- `paymentSdkUrl`: `https://connect-qa.fiservapis.com/pbb/sdk/web/v1/js/PaymentSDK.js`

## What Is Actually Mandatory

For the BankLink launch path, the frontend only needs:

- `apiKey` (when creating `CPSDK(...)`)
- `accessToken`
- `configId`
- `encryptionKey`
- `aggregatorKey`
- A mount element id

You do **not** need to pass `fdCustomerId`, `firstName`, `lastName`, address fields, or similar optional values for the minimal integration.

## Minimal Steps

1. On your backend, create a session token using:
    - `apiKey = YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A`
    - `secret = VvVF4nxfhdoGYrthUKDSBJweJesaZXKwcLoi2MzHvGeOjIA0CAVs5XOcH8jTGhtG`
2. From that session-token response, take:
    - `security.tokenID` as `accessToken`
    - `security.publicKey` as `encryptionKey`
3. Get the `aggregatorKey` for the BankLink session from your backend/aggregator setup.
4. Add a container in your page.
5. Load `https://connect-qa.fiservapis.com/pbb/sdk/web/v1/js/PaymentSDK.js`.
6. Start BankLink with only the required configuration.

## Minimal Frontend Snippet

```html
<div id="app-container"></div>
<script src="https://connect-qa.fiservapis.com/pbb/sdk/web/v1/js/PaymentSDK.js"></script>
<script>
  function returnCallBack(response) {
    console.log(response);
  }

  const sdkConfiguration = {
    accessToken: "<TOKEN_ID_FROM_SESSION_API>",
    configId: "864b884d-b03d-4af7-8bda-f0e9c343df11",
    encryptionKey: "<PUBLIC_KEY_FROM_SESSION_API>",
    aggregatorKey: "<AGGREGATOR_KEY>",
  };

  const cp = CPSDK("YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A", false);
  const bankLink = cp.BankLink(sdkConfiguration, {}, returnCallBack);
  bankLink.start("app-container");
</script>
