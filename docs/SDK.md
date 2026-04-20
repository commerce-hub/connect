Act as a Senior Angular Architect specializing in financial technology (FinTech). Create a reusable Angular SDK (as a library project) designed to capture credit card and bank account information to initialize a virtual wallet. The SDK should be embeddable in any web application and must adhere to PCI compliance standards for handling sensitive payment information.

**Technical Requirements:**
- **Framework:** Angular 20 (Standalone Components), PrimeNG 20, Tailwind CSS.
- **State Management:** Use Angular Signals for reactive UI updates [1] and RxJS for asynchronous data handling.
- **Forms:** Reactive Forms with `Validators` for sensitive data validation (PCI compliance focused).
- **Security:**
    - Provide a placeholder component/service designed to integrate with a PCI-compliant vault (e.g. http://localhost:8080/swagger-ui/index.html#/) to secure card details [12].
    - Implement basic input masking (e.g., CCN, CVV).
- **Structure:**
    - Create a `CommerceHubConnectSdkModule` or standalone library.
    - Implement a form component `capture-payment.component.ts`.
    - Create a data service `commerce-hub-connect-sdk.service.ts` to handle submission.
    - The application using SDK will invoke it providing parameters as JSON object.
      - `onSuccess` required callback.
      - `onError` required callback.
      - `sessionReferenceId` required
      - `email` required
      - `region` optional, default to 'US'
      - `language` optional, default to 'en_US'
      - `merchantTransactionId` optional
      - `merchantOrderId` optional
      - `merchantInvoiceNumber` optional
      - `authType`: choices [FINAL_SALE, AUTH_ONLY],
      - `expiryMinutes` optional
      - `allowedTenderTypes` optional [ CARD, BANK_ACCOUNT, DYNAMIC_SESSION_CARD ]. If not provided, default to all.
      - `allowEmailChange` optional
    - Add another JSON optional parameter to control white labeling.
      - `primaryColor`: optional, default to '#0a5dff'
      - `secondaryColor`: optional, default to '#627d98'
      - `textColor`: optional, default to '#000000'
      - `logoUrl`: optional, if not provided, remove the logo.
      - `fontFamily`: optional, default to 'Open Sans, sans-serif'
    - Use PrimeNG angular token system for styling.
    - Use /Users/gregory.jablonski/IdeaProjects/commercehub-connect-wallet-sdk/docs/signin.png and /Users/gregory.jablonski/IdeaProjects/commercehub-connect-wallet-sdk/docs/verify.png as the default white labeling design guidelines.
- **API:**
    - Interaction API definition can be found in http://localhost:8080/swagger-ui/index.html. 
      - Create an internal proxy to avoid the CORS issue.
      - For session creation, call `POST /session/interaction/create` with the provided parameters.
      - For OTP sending, call `POST /interaction/{interactionId}/otp/send` with the email.
      - For OTP validation, call `POST /interaction/{interactionId}/otp/validate` with the OTP code.
      - For payment source attachment, call `POST /interaction/{interactionId}/payment-source/{paymentSourceId}/attach` with the payment source details.
      - For interaction retrieval, call `GET /interaction/{interactionId}` to get the current state of the interaction.
    - Manage wallet API definition can be found in http://localhost:8080/swagger-ui/index.html.
      - For addding payment source, call `POST /customer/source` with the payment source details.
      - For updating a payment source, call `PUT /customer/source/` with the payment source details.
      - For retrieving a payment source, call `GET /customer/source/` with the source ID.

**Provide the following code:**
1. `CommerceHubConnectCaptureComponent` (HTML, CSS, TypeScript).
2. `CommerceHubConnectSdkService` (TypeScript).
3. A simple usage example in an `app.component.ts`.

Ensure the code is robust, well-typed, and modular.
