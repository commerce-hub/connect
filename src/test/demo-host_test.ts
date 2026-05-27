import {assert} from '@open-wc/testing';

const expectedScenarioNames = [
  'otpPending',
  'otpFailed',
  'savedPaymentMethods',
  'noSavedPaymentMethods',
  'attachedCard',
  'attachedBankAccount',
  'cardVerified',
  'cardUnderReview',
  'cardRequireInfo',
  'cardDeclined',
  'cardNotVerified',
  'bankVerified',
  'bankUnderReview',
  'bankRequireInfo',
  'bankDeclined',
  'bankNotVerified',
];

const waitFor = async (
  predicate: () => boolean,
  failureMessage: string
): Promise<void> => {
  const deadline = Date.now() + 5000;

  while (Date.now() < deadline) {
    if (predicate()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  assert.fail(failureMessage);
};

suite('demo host page', () => {
  test('provides an Alibaba checkout demo with an Alibaba Rewards Account SDK payment method', async () => {
    const response = await fetch('/dev/alibaba.html');
    const html = await response.text();

    assert.isTrue(response.ok, 'expected Alibaba demo page to be served');
    assert.include(html, '<title>Alibaba Rewards Demo</title>');
    assert.include(html, 'Alibaba.com');
    assert.include(
      html,
      'https://s.alicdn.com/@logo/logo_en_light_horizontal_default_full.png'
    );
    assert.include(html, 'alt="Alibaba.com"');
    assert.include(html, 'Trade Assurance Checkout');
    assert.include(html, 'Trade Assurance');
    assert.include(html, 'Credit/Debit Card');
    assert.include(html, 'PayPal');
    assert.include(
      html,
      'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg'
    );
    assert.include(html, 'class="method-logo paypal-logo"');
    assert.include(html, 'Apple Pay');
    assert.include(
      html,
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg'
    );
    assert.include(html, 'class="method-logo apple-logo"');
    assert.include(html, 'Alibaba Rewards Account');
    assert.include(
      html,
      'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/alibaba-icon.png'
    );
    assert.include(html, 'class="method-logo rewards-logo"');
    assert.include(html, 'id="alibaba-buyer-email"');
    assert.include(html, 'gregory.jablonski@fiserv.com');
    assert.include(html, 'id="alibaba-rewards-sdk-host"');
    assert.include(html, 'margin: 0 auto');
    assert.include(html, 'id="payment-method-alibaba-rewards"');
    assert.include(html, 'id="alibaba-pay-now-button"');
    assert.include(html, 'disabled');
    assert.include(html, '@keyframes payPulse');
    assert.include(html, "data-ready='true'");
    assert.include(html, 'id="alibaba-checkout-view"');
    assert.include(html, 'id="alibaba-success-view"');
    assert.include(html, 'success-checkmark');
    assert.include(html, 'Order summary');
    assert.include(html, 'Payment info');
    assert.include(html, 'id="alibaba-success-total"');
    assert.include(html, "'/merchant/interaction/create'");
    assert.include(html, 'email: buyerEmail.textContent.trim()');
    assert.include(html, "await import('./../commerce-hub-connect.js')");
    assert.include(html, "document.createElement('commerce-hub-connect')");
    assert.include(html, "widget.addEventListener('onSuccess'");
    assert.include(html, 'widget.interactionResponse = interactionResponse');
  });

  test('starts the Alibaba Rewards Account flow from its selected radio option', async () => {
    const iframe = document.createElement('iframe');
    const iframeLoaded = new Promise<void>((resolve) => {
      iframe.addEventListener('load', () => resolve(), {once: true});
    });
    iframe.src = '/dev/alibaba.html?apiBaseUrl=http://commercehub.test';
    document.body.append(iframe);
    await iframeLoaded;

    const pageWindow = iframe.contentWindow;
    const pageDocument = iframe.contentDocument;
    assert.isOk(pageWindow, 'expected Alibaba iframe window');
    assert.isOk(pageDocument, 'expected Alibaba iframe document');

    const createRequest = {
      body: undefined as Record<string, unknown> | undefined,
    };
    pageWindow.fetch = (async (_input, init) => {
      createRequest.body = JSON.parse(String(init?.body));

      return new Response(
        JSON.stringify({
          interactionId: 'alibaba-rewards-demo-interaction',
          status: 'PAYMENT_SOURCE_REQUESTED',
          allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
          paymentSources: [],
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }) as typeof fetch;

    const rewardsInput = pageDocument.querySelector<HTMLInputElement>(
      '#payment-method-alibaba-rewards'
    );
    const payNowButton = pageDocument.querySelector<HTMLButtonElement>(
      '#alibaba-pay-now-button'
    );

    assert.isNull(
      pageDocument.querySelector('input[name="paymentMethod"]:checked'),
      'expected no payment method to be selected by default'
    );
    assert.isTrue(
      payNowButton?.disabled,
      'expected Pay Now to be disabled before SDK success'
    );
    assert.equal(payNowButton?.dataset.ready, 'false');
    assert.equal(
      createRequest.body,
      undefined,
      'expected no default selection to create an interaction'
    );
    assert.equal(
      pageDocument
        .querySelector('[data-method-panel="card"]')
        ?.getAttribute('data-active'),
      'false'
    );
    assert.equal(
      pageDocument
        .querySelector('#alibaba-rewards-sdk-panel')
        ?.getAttribute('data-active'),
      'false'
    );

    rewardsInput?.click();

    await waitFor(
      () =>
        pageDocument.querySelector('#alibaba-rewards-connect-widget') !== null,
      'expected Alibaba Rewards Account to mount the CommerceHub Connect SDK'
    );

    const createRequestBody = createRequest.body;
    assert.isDefined(createRequestBody);
    assert.propertyVal(
      createRequestBody,
      'email',
      'gregory.jablonski@fiserv.com'
    );
    assert.deepEqual(createRequestBody?.allowedTenderTypes, [
      'CARD',
      'BANK_ACCOUNT',
      'NATIVE_ACCOUNT',
    ]);
    assert.deepEqual(createRequestBody?.merchantData, {
      clientId: 'marriot',
      merchantId: '101475000000009',
      terminalId: '99',
    });
    assert.propertyVal(createRequestBody, 'mode', 'FULL');
    assert.equal(
      pageDocument
        .querySelector('#alibaba-rewards-sdk-panel')
        ?.getAttribute('data-active'),
      'true'
    );

    const rewardsWidget = pageDocument.querySelector(
      '#alibaba-rewards-connect-widget'
    );
    rewardsWidget?.dispatchEvent(
      new CustomEvent('onSuccess', {
        detail: {
          displayName: 'Alibaba Rewards Account',
          accountName: 'Alibaba Rewards Plus',
          last4: '8842',
        },
      })
    );

    assert.isFalse(
      payNowButton?.disabled,
      'expected Pay Now to be enabled after SDK success'
    );
    assert.equal(payNowButton?.dataset.ready, 'true');

    payNowButton?.click();

    assert.isTrue(
      pageDocument.querySelector<HTMLElement>('#alibaba-checkout-view')?.hidden,
      'expected checkout view to be hidden after Pay Now'
    );
    assert.isFalse(
      pageDocument.querySelector<HTMLElement>('#alibaba-success-view')?.hidden,
      'expected success view to be visible after Pay Now'
    );
    assert.include(
      pageDocument.querySelector('#alibaba-success-payment-info')
        ?.textContent ?? '',
      'Alibaba Rewards Plus'
    );
    assert.include(
      pageDocument.querySelector('#alibaba-success-payment-info')
        ?.textContent ?? '',
      '8842'
    );
    assert.include(
      pageDocument.querySelector('#alibaba-success-order-summary')
        ?.textContent ?? '',
      'Order No. 140578887511258745'
    );
    assert.include(
      pageDocument.querySelector('#alibaba-success-total')?.textContent ?? '',
      'USD 324.77'
    );
    assert.isNotNull(pageDocument.querySelector('.success-checkmark'));

    iframe.remove();
  });

  test('provides a Clover Pay checkout demo that initializes the SDK with the displayed recipient email address', async () => {
    const response = await fetch('/dev/clover-pay.html');
    const html = await response.text();

    assert.isTrue(response.ok, 'expected Clover Pay demo page to be served');
    assert.include(html, '<title>Clover Pay Demo</title>');
    assert.include(html, 'The Coral Gallery');
    assert.include(html, 'class="clover-logo"');
    assert.include(html, 'Gregory Jablonski');
    assert.include(html, 'gregory.jablonski@fiserv.com');
    assert.include(html, 'id="checkout-recipient-email"');
    assert.include(html, '$0.01');
    assert.include(html, 'Select payment method');
    assert.notInclude(html, 'Credit or debit card');
    assert.notInclude(html, 'Pay By Bank');
    assert.notInclude(html, 'Paze');
    assert.include(html, 'Google Pay');
    assert.include(html, 'Samsung Pay');
    assert.include(html, 'Clover Pay');
    assert.include(html, 'class="clover-pay-logo"');
    assert.include(html, 'viewBox="0 0 40 40"');
    assert.include(html, 'M18.026 10.433c0-4.974-4.037-9.013-9.015-9.013');
    assert.include(html, 'id="payment-method-clover-pay"');
    assert.include(html, 'id="clover-pay-sdk-host"');
    assert.include(html, 'name="paymentMethod"');
    assert.include(html, 'id="checkout-pay-button"');
    assert.include(html, 'disabled');
    assert.include(html, 'initializePaymentSelection');
    assert.include(html, 'setHostedWalletPayButton');
    assert.include(html, 'Buy with <span class="google-pay-mark">G</span> Pay');
    assert.include(
      html,
      'Pay with <span class="samsung-pay-mark">SAMSUNG</span> Pay &gt;'
    );
    assert.include(html, '@media (min-width: 600px)');
    assert.include(html, 'max-width: 790px');
    assert.include(html, 'padding: 40px 16px');
    assert.notInclude(html, '@media (min-width: 840px)');
    assert.notInclude(html, 'grid-template-columns: minmax(300px');
    assert.include(html, "'/merchant/interaction/create'");
    assert.include(html, 'email: recipientEmail.textContent.trim()');
    assert.include(html, "await import('./../commerce-hub-connect.js')");
    assert.include(html, "document.createElement('commerce-hub-connect')");
    assert.include(html, 'widget.interactionResponse = interactionResponse');
    assert.notInclude(html, 'id="interaction-email"');
    assert.notInclude(html, 'Anoop Agarwal');
    assert.notInclude(html, 'anoop.agarwal@Fiserv.com');
  });

  test('starts Clover Pay from the selected radio option and uses the recipient email in the create request body', async () => {
    const iframe = document.createElement('iframe');
    const iframeLoaded = new Promise<void>((resolve) => {
      iframe.addEventListener('load', () => resolve(), {once: true});
    });
    iframe.src = '/dev/clover-pay.html?apiBaseUrl=http://commercehub.test';
    document.body.append(iframe);
    await iframeLoaded;

    const pageWindow = iframe.contentWindow;
    const pageDocument = iframe.contentDocument;
    assert.isOk(pageWindow, 'expected Clover Pay iframe window');
    assert.isOk(pageDocument, 'expected Clover Pay iframe document');

    const createRequest = {
      body: undefined as Record<string, unknown> | undefined,
    };
    pageWindow.fetch = (async (_input, init) => {
      createRequest.body = JSON.parse(String(init?.body));

      return new Response(
        JSON.stringify({
          interactionId: 'clover-pay-demo-interaction',
          status: 'PAYMENT_SOURCE_REQUESTED',
          allowedTenderTypes: ['CARD', 'BANK_ACCOUNT', 'DYNAMIC_SESSION_CARD'],
          paymentSources: [],
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }) as typeof fetch;

    const googlePayInput = pageDocument.querySelector<HTMLInputElement>(
      '#payment-method-google-pay'
    );
    const samsungPayInput = pageDocument.querySelector<HTMLInputElement>(
      '#payment-method-samsung-pay'
    );
    const cloverPayInput = pageDocument.querySelector<HTMLInputElement>(
      '#payment-method-clover-pay'
    );
    const payButton = pageDocument.querySelector<HTMLButtonElement>(
      '#checkout-pay-button'
    );

    assert.isNull(
      pageDocument.querySelector('input[name="paymentMethod"]:checked'),
      'expected no payment method to be selected by default'
    );
    assert.isTrue(
      payButton?.disabled,
      'expected the pay button to be disabled by default'
    );
    assert.equal(payButton?.dataset.wallet, 'clover-pay');
    assert.equal(
      pageDocument
        .querySelector('#clover-pay-sdk-panel')
        ?.getAttribute('data-active'),
      'false'
    );

    googlePayInput?.click();
    assert.equal(
      createRequest.body,
      undefined,
      'expected non-Clover payment methods not to create an interaction'
    );
    assert.equal(payButton?.dataset.wallet, 'google-pay');
    assert.isFalse(payButton?.disabled);
    assert.equal(payButton?.getAttribute('aria-label'), 'Buy with Google Pay');
    assert.include(payButton?.innerHTML ?? '', 'google-pay-mark');
    assert.include(payButton?.innerText ?? '', 'Buy with');
    assert.include(payButton?.innerText ?? '', 'Pay');

    samsungPayInput?.click();
    assert.equal(
      createRequest.body,
      undefined,
      'expected Samsung Pay not to create an interaction'
    );
    assert.equal(payButton?.dataset.wallet, 'samsung-pay');
    assert.isFalse(payButton?.disabled);
    assert.equal(payButton?.getAttribute('aria-label'), 'Pay with Samsung Pay');
    assert.include(payButton?.innerHTML ?? '', 'samsung-pay-mark');
    assert.include(payButton?.innerText ?? '', 'SAMSUNG');

    cloverPayInput?.click();

    await waitFor(
      () => pageDocument.querySelector('#clover-pay-connect-widget') !== null,
      'expected Clover Pay to mount the CommerceHub Connect SDK'
    );

    const createRequestBody = createRequest.body;
    assert.isDefined(createRequestBody);
    assert.propertyVal(
      createRequestBody,
      'email',
      'gregory.jablonski@fiserv.com'
    );
    assert.deepEqual(createRequestBody?.allowedTenderTypes, [
      'CARD',
      'BANK_ACCOUNT',
    ]);
    assert.deepEqual(createRequestBody?.merchantData, {
      clientId: 'marriot',
      merchantId: '101475000000009',
      terminalId: '10000001',
    });
    assert.propertyVal(createRequestBody, 'mode', 'FULL');
    assert.equal(
      pageDocument
        .querySelector('#clover-pay-sdk-panel')
        ?.getAttribute('data-active'),
      'true'
    );

    iframe.remove();
  });

  test('provides a Clover merchant dashboard demo with the bank information section as the main content', async () => {
    const response = await fetch('/dev/clover-merchant.html');
    const html = await response.text();

    assert.isTrue(
      response.ok,
      'expected Clover merchant demo page to be served'
    );
    assert.include(html, '<title>Clover Merchant Demo</title>');
    assert.include(html, 'class="clover-logo"');
    assert.include(html, 'Business name here');
    assert.include(html, 'id="merchant-dashboard-email"');
    assert.include(html, 'gregory.jablonski@fiserv.com');
    assert.include(html, 'id="bank-accounts-page"');
    assert.include(html, 'Bank information');
    assert.include(html, 'Funding account');
    assert.include(html, 'Reporting disabled');
    assert.include(html, 'Enable reporting');
    assert.include(html, 'JP Morgan Chase – 3651');
    assert.include(html, 'class="bank-verified-badge"');
    assert.include(html, 'Verified');
    assert.include(html, 'Operating account');
    assert.include(html, '122100024');
    assert.include(html, 'Checking');
    assert.include(html, '••••3651');
    assert.include(html, 'id="bank-details-dialog"');
    assert.include(html, 'id="change-bank-account-button"');
    assert.include(html, 'Change bank account');
    assert.include(html, 'id="clover-merchant-sdk-host"');
    assert.include(html, '--sdk-dialog-widget-width: 25.25rem');
    assert.include(html, 'calc(var(--sdk-dialog-widget-width) + 88px)');
    assert.include(html, 'calc(100vw - 32px)');
    assert.include(html, 'justify-items: center');
    assert.include(html, 'width: min(var(--sdk-dialog-widget-width), 100%)');
    assert.include(html, "'/merchant/interaction/create'");
    assert.include(
      html,
      "const MERCHANT_EMAIL = 'gregory.jablonski@fiserv.com'"
    );
    assert.include(html, 'email: MERCHANT_EMAIL');
    assert.include(html, "entityData: {firstName: 'Neer'}");
    assert.include(html, 'advancedVerification: true');
    assert.include(html, "mode: 'PRE_AUTHENTICATED'");
    assert.include(html, "await import('./../commerce-hub-connect.js')");
    assert.include(html, "document.createElement('commerce-hub-connect')");
    assert.include(html, "widget.addEventListener('onSuccess'");
    assert.include(html, 'widget.interactionResponse = interactionResponse');
    assert.notInclude(html, 'Developer Info');
    assert.notInclude(html, 'Chris Doe (Individual Developer)');
    assert.notInclude(html, 'id="open-bank-details-button"');
    assert.notInclude(html, 'id="developer-info-page"');
  });

  test('opens the Clover merchant SDK dialog from Change bank account and updates the bank information section from SDK success', async () => {
    const iframe = document.createElement('iframe');
    const iframeLoaded = new Promise<void>((resolve) => {
      iframe.addEventListener('load', () => resolve(), {once: true});
    });
    iframe.src = '/dev/clover-merchant.html?apiBaseUrl=http://commercehub.test';
    document.body.append(iframe);
    await iframeLoaded;

    const pageWindow = iframe.contentWindow;
    const pageDocument = iframe.contentDocument;
    assert.isOk(pageWindow, 'expected Clover merchant iframe window');
    assert.isOk(pageDocument, 'expected Clover merchant iframe document');

    const createRequest = {
      body: undefined as Record<string, unknown> | undefined,
    };
    pageWindow.fetch = (async (_input, init) => {
      createRequest.body = JSON.parse(String(init?.body));

      return new Response(
        JSON.stringify({
          interactionId: 'clover-merchant-bank-demo-interaction',
          status: 'PAYMENT_SOURCE_REQUESTED',
          allowedTenderTypes: ['BANK_ACCOUNT'],
          paymentSources: [],
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }) as typeof fetch;

    const bankAccountsPage = pageDocument.querySelector<HTMLElement>(
      '#bank-accounts-page'
    );
    const bankDetailsDialog = pageDocument.querySelector<HTMLDialogElement>(
      '#bank-details-dialog'
    );

    assert.isFalse(
      bankAccountsPage?.hidden ?? false,
      'expected bank information section to be visible by default'
    );
    assert.isFalse(
      bankDetailsDialog?.open ?? true,
      'expected bank details dialog to be closed by default'
    );
    assert.equal(
      createRequest.body,
      undefined,
      'expected no interaction to be created on page load'
    );

    assert.include(
      pageDocument.querySelector('#bank-list-bank-account')?.textContent ?? '',
      '••••3651'
    );
    assert.include(
      pageDocument.querySelector('#bank-information-card')?.textContent ?? '',
      'Operating account'
    );
    assert.include(
      pageDocument.querySelector('#bank-information-card')?.textContent ?? '',
      '122100024'
    );
    assert.include(
      pageDocument.querySelector('#bank-information-card')?.textContent ?? '',
      'Checking'
    );

    pageDocument
      .querySelector<HTMLButtonElement>('#change-bank-account-button')
      ?.click();

    assert.isTrue(
      bankDetailsDialog?.open,
      'expected Change Bank Account to open the SDK dialog'
    );

    await waitFor(
      () =>
        pageDocument.querySelector('#clover-merchant-connect-widget') !== null,
      'expected Change bank account to mount the CommerceHub Connect SDK'
    );

    const createRequestBody = createRequest.body;
    assert.isDefined(createRequestBody);
    assert.propertyVal(
      createRequestBody,
      'email',
      'gregory.jablonski@fiserv.com'
    );
    assert.deepEqual(createRequestBody?.allowedTenderTypes, ['BANK_ACCOUNT']);
    assert.deepEqual(createRequestBody?.merchantData, {
      clientId: 'marriot',
      merchantId: '101475000000009',
      terminalId: '10000001',
    });
    assert.deepEqual(createRequestBody?.entityData, {firstName: 'Neer'});
    assert.propertyVal(createRequestBody, 'advancedVerification', true);
    assert.propertyVal(createRequestBody, 'mode', 'PRE_AUTHENTICATED');

    const widget = pageDocument.querySelector(
      '#clover-merchant-connect-widget'
    );
    widget?.dispatchEvent(
      new CustomEvent('onSuccess', {
        detail: {
          tenderType: 'BankAccount',
          id: 'bank-sdk-1',
          name: 'Neer SDK Settlement Account',
          bankAccount: {
            bankName: 'Wells Fargo',
            routingNumber: '091000019',
            accountNumber: '000123456789',
            accountType: 'Savings',
          },
        },
      })
    );

    assert.include(
      pageDocument.querySelector('#bank-list-bank-account')?.textContent ?? '',
      '••••6789'
    );
    assert.include(
      pageDocument.querySelector('#bank-list-account-name')?.textContent ?? '',
      'Neer SDK Settlement Account'
    );
    assert.include(
      pageDocument.querySelector('#bank-list-routing-code')?.textContent ?? '',
      '091000019'
    );
    assert.include(
      pageDocument.querySelector('#bank-list-account-type')?.textContent ?? '',
      'Savings'
    );
    assert.include(
      pageDocument.querySelector('#bank-list-bank-name')?.textContent ?? '',
      'Wells Fargo – 6789'
    );
    assert.isFalse(
      bankDetailsDialog?.open ?? true,
      'expected bank details dialog to close after SDK success'
    );

    iframe.remove();
  });

  test('creates the merchant interaction from the structured request builder only when the request form is submitted', async () => {
    const response = await fetch('/dev/index.html');
    const html = await response.text();

    const createInteractionIndex = html.indexOf(
      "'/merchant/interaction/create'"
    );
    const payloadPanelIndex = html.indexOf('class="payload-panel"');
    const widgetPanelIndex = html.indexOf('class="demo-widget-panel"');
    const outputPanelIndex = html.indexOf('class="demo-output-panel"');
    const designConfigIndex = html.indexOf('id="design-config-card"');
    const widgetHostIndex = html.indexOf('id="connect-widget-host"');
    const createInteractionActionsIndex = html.indexOf(
      'id="create-interaction-actions"'
    );
    const scenarioControlsIndex = html.indexOf('id="scenario-controls"');

    assert.isAtLeast(
      createInteractionIndex,
      0,
      'expected demo host to call /merchant/interaction/create'
    );
    assert.include(html, '<form id="interaction-create-form">');
    assert.include(html, 'id="interaction-email"');
    assert.include(html, 'id="interaction-merchant-id"');
    assert.include(html, 'id="interaction-terminal-id"');
    assert.include(html, 'id="interaction-client-id"');
    assert.include(html, 'id="commerce-hub-api-base-url-mode"');
    assert.include(html, 'id="commerce-hub-api-custom-base-url"');
    assert.include(html, 'id="interaction-first-name"');
    assert.include(html, 'id="interaction-last-name"');
    assert.include(html, 'id="interaction-advanced-verification"');
    assert.include(html, 'id="interaction-mode"');
    assert.include(html, 'id="interaction-allow-native-account"');
    assert.include(html, 'name="allowedTenderTypes"');
    assert.include(html, '<pre id="interaction-request-preview"');
    assert.isAtLeast(
      payloadPanelIndex,
      0,
      'expected payload panel markup to be present'
    );
    assert.isAtLeast(
      widgetPanelIndex,
      0,
      'expected widget panel markup to be present'
    );
    assert.isAtLeast(
      outputPanelIndex,
      0,
      'expected demo output panel markup to be present'
    );
    assert.isAtLeast(
      widgetHostIndex,
      0,
      'expected widget host markup to be present'
    );
    assert.isAtLeast(
      scenarioControlsIndex,
      0,
      'expected scenario controls markup to be present'
    );
    assert.isBelow(
      payloadPanelIndex,
      widgetPanelIndex,
      'expected the create interaction request to appear before the widget column'
    );
    assert.isBelow(
      widgetPanelIndex,
      designConfigIndex,
      'expected design config to appear in the widget column'
    );
    assert.isBelow(
      widgetPanelIndex,
      outputPanelIndex,
      'expected SDK controls and output cards to appear after the config column'
    );
    assert.include(html, 'id="design-config-card" open');
    assert.include(html, 'id="design-config-form"');
    assert.include(html, 'id="design-config-base-font-size"');
    assert.include(html, 'id="design-config-base-font-weight"');
    assert.include(html, 'id="design-config-shell-padding"');
    assert.include(html, 'id="design-config-primary-color"');
    assert.include(html, 'id="design-config-otp-title"');
    assert.include(html, 'id="design-config-payment-methods-title"');
    assert.include(html, 'id="design-config-no-saved-title"');
    assert.include(html, '<pre id="design-config-preview"');
    assert.isAtLeast(
      designConfigIndex,
      0,
      'expected design config card markup to be present'
    );
    assert.isAtLeast(
      createInteractionActionsIndex,
      0,
      'expected create interaction action row markup to be present'
    );
    assert.isBelow(
      outputPanelIndex,
      createInteractionActionsIndex,
      'expected the create interaction action row in the output column'
    );
    assert.isBelow(
      createInteractionActionsIndex,
      widgetHostIndex,
      'expected the SDK widget host below the create interaction action row'
    );
    assert.isBelow(
      widgetHostIndex,
      scenarioControlsIndex,
      'expected the SDK widget host above the scenario controls'
    );
    assert.include(html, 'id="create-interaction-actions"');
    assert.include(html, 'type="submit"');
    assert.include(html, 'form="interaction-create-form"');
    assert.include(html, "createForm.addEventListener('submit'");
    assert.include(html, 'requestForm.addEventListener(');
    assert.include(html, 'designConfigForm.addEventListener(');
    const scenarioButtonNames = [
      ...html.matchAll(/data-scenario="([^"]+)"/g),
    ].map((match) => match[1]);
    const scenarioObjectMatch = html.match(
      /const scenarios = \{([\s\S]*?)\n\s{6}\};/
    );
    const scenarioObjectNames = [
      ...(scenarioObjectMatch?.[1] ?? '').matchAll(/^\s{8}([a-zA-Z0-9]+): /gm),
    ].map((match) => match[1]);

    assert.sameOrderedMembers(scenarioButtonNames, expectedScenarioNames);
    assert.sameOrderedMembers(scenarioObjectNames, expectedScenarioNames);
    assert.include(
      html,
      'const interactionRequest = buildInteractionRequest(requestFormState)'
    );
    assert.include(
      html,
      'const designConfig = buildDesignConfig(readDesignConfigFormState())'
    );
    assert.include(html, 'createInitialInteractionResponse(');
    assert.include(html, 'body: JSON.stringify(interactionRequest)');
    assert.include(html, 'widget.designConfig = designConfig');
    assert.include(html, 'widget.baseURL = resolveWidgetBaseURL()');
    assert.include(html, "createApiUrl('/merchant/interaction/create')");
    assert.include(html, 'resolveCreateInteractionBaseURL()');
    assert.include(html, "baseURLMode: 'CUSTOM'");
    assert.include(html, 'customBaseURL: initialApiBaseUrl');
    assert.notInclude(html, '<textarea id="interaction-request"');
    assert.notInclude(html, 'JSON.parse(requestInput.value)');
    assert.notInclude(
      html,
      '<commerce-hub-connect id="connect-widget">',
      'expected demo host to create the widget after receiving the API response'
    );
    assert.notInclude(
      html,
      'void initializeDemo();',
      'expected demo host not to call create on page load'
    );
  });

  test('preserves the DEV preset path prefix for merchant interaction create requests', async () => {
    const iframe = document.createElement('iframe');
    const iframeLoaded = new Promise<void>((resolve) => {
      iframe.addEventListener('load', () => resolve(), {once: true});
    });
    iframe.src = '/dev/index.html';
    document.body.append(iframe);
    await iframeLoaded;

    const pageWindow = iframe.contentWindow;
    const pageDocument = iframe.contentDocument;
    assert.isOk(pageWindow, 'expected demo iframe window');
    assert.isOk(pageDocument, 'expected demo iframe document');

    const createRequest = {
      url: undefined as string | undefined,
    };
    pageWindow.fetch = (async (input) => {
      createRequest.url = input instanceof Request ? input.url : String(input);

      return new Response(
        JSON.stringify({
          interactionId: 'dev-create-interaction',
          status: 'PAYMENT_SOURCE_REQUESTED',
          allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
          paymentSources: [],
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }) as typeof fetch;

    const baseURLMode = pageDocument.querySelector<HTMLSelectElement>(
      '#commerce-hub-api-base-url-mode'
    );
    const createForm = pageDocument.querySelector<HTMLFormElement>(
      '#interaction-create-form'
    );

    assert.isOk(baseURLMode, 'expected base URL mode control');
    assert.isOk(createForm, 'expected create interaction form');

    baseURLMode.value = 'DEV';
    baseURLMode.dispatchEvent(new Event('change', {bubbles: true}));
    createForm.requestSubmit();

    await waitFor(
      () => Boolean(createRequest.url),
      'expected form submit to call merchant interaction create'
    );

    assert.equal(
      createRequest.url,
      'https://connect-dev.fiservapis.com/chc/merchant/interaction/create'
    );

    iframe.remove();
  });

  test('uses service-aligned default values for the structured create interaction request', async () => {
    const response = await fetch('/dev/index.html');
    const html = await response.text();

    assert.include(html, "email: 'gregory.jablonski@fiserv.com'");
    assert.include(html, "clientId: 'marriot'");
    assert.include(html, "merchantId: '101475000000009'");
    assert.include(html, "terminalId: '10000001'");
    assert.include(html, 'advancedVerification: true');
    assert.include(html, "mode: 'PRE_AUTHENTICATED'");
    assert.include(html, 'allowCard: true');
    assert.include(html, 'allowBankAccount: true');
    assert.include(html, 'allowDynamicSessionCard: false');
    assert.include(html, 'allowNativeAccount: false');
    assert.include(html, 'mode: requestFormState.mode');
  });

  test('uses editable default values for the design config passed to the SDK', async () => {
    const response = await fetch('/dev/index.html');
    const html = await response.text();

    assert.include(html, "baseFontSize: '16px'");
    assert.include(html, "baseFontWeight: '300'");
    assert.include(html, "shellPadding: '1.75rem 1.5rem 1.5rem'");
    assert.include(html, "primaryColor: '#084acc'");
    assert.include(html, "textColor: '#101828'");
    assert.include(html, "copyColor: '#9f9f9f'");
    assert.include(html, "borderColor: '#cbd5e1'");
    assert.include(html, "widgetBackground: '#ffffff'");
    assert.include(html, "paymentMethodBackground: '#f8fafc'");
    assert.include(html, "otpTitle: 'Confirm your email'");
    assert.include(html, "otpVerifyButton: 'Verify'");
    assert.include(html, "paymentMethodsTitle: 'Choose payment method'");
    assert.include(html, "paymentMethodsContinueButton: 'Use selected method'");
    assert.include(html, "noSavedTitle: 'Add payment method'");
    assert.include(html, "noSavedEmptyTitle: ''");
  });
});
