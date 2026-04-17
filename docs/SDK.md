Act as a Senior Angular Architect specializing in financial technology (FinTech). Create a reusable Angular SDK (as a library project) designed to capture credit card and bank account information to initialize a virtual wallet.

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.
## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
    - `NgOptimizedImage` does not work for inline base64 images.
## Accessibility Requirements
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.
### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

**Technical Requirements:**
- **Framework:** Angular 20 (Standalone Components), PrimeNG 20, Tailwind CSS.
- **State Management:** Use Angular Signals for reactive UI updates [1] and RxJS for asynchronous data handling.
- **Forms:** Reactive Forms with `Validators` for sensitive data validation (PCI compliance focused).
- **Security:**
    - Provide a placeholder component/service designed to integrate with a PCI-compliant vault (e.g., Stripe, Plaid) to secure card details [12].
    - Implement basic input masking (e.g., CCN, CVV).
- **Structure:**
    - Create a `WalletSdkModule` or standalone library.
    - Implement a form component `capture-payment.component.ts`.
    - Create a data service `wallet-sdk.service.ts` to handle submission.
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
1. `WalletCaptureComponent` (HTML, CSS, TypeScript).
2. `WalletSdkService` (TypeScript).
3. A simple usage example in an `app.component.ts`.

Ensure the code is robust, well-typed, and modular.
