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
  test('provides a Clover Pay checkout demo that initializes the SDK without an email address', async () => {
    const response = await fetch('/dev/clover-pay.html');
    const html = await response.text();

    assert.isTrue(response.ok, 'expected Clover Pay demo page to be served');
    assert.include(html, '<title>Clover Pay Demo</title>');
    assert.include(html, 'The Coral Gallery');
    assert.include(html, 'Gregory Jablonski');
    assert.include(html, 'gregory.jablonski@fiserv.com');
    assert.include(html, '$0.01');
    assert.include(html, 'Select payment method');
    assert.notInclude(html, 'Credit or debit card');
    assert.notInclude(html, 'Pay By Bank');
    assert.notInclude(html, 'Paze');
    assert.include(html, 'Google Pay');
    assert.include(html, 'Samsung Pay');
    assert.include(html, 'Clover Pay');
    assert.include(html, 'id="payment-method-clover-pay"');
    assert.include(html, 'id="clover-pay-sdk-host"');
    assert.include(html, 'name="paymentMethod"');
    assert.include(html, "'/merchant/interaction/create'");
    assert.include(html, "await import('./../commerce-hub-connect.js')");
    assert.include(html, "document.createElement('commerce-hub-connect')");
    assert.include(html, 'widget.interactionResponse = interactionResponse');
    assert.notInclude(html, 'id="interaction-email"');
    assert.notInclude(html, "email: 'gregory.jablonski@fiserv.com'");
    assert.notInclude(html, 'Anoop Agarwal');
    assert.notInclude(html, 'anoop.agarwal@Fiserv.com');
  });

  test('starts Clover Pay from the selected radio option and omits email from the create request body', async () => {
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
    const cloverPayInput = pageDocument.querySelector<HTMLInputElement>(
      '#payment-method-clover-pay'
    );

    googlePayInput?.click();
    assert.equal(
      createRequest.body,
      undefined,
      'expected non-Clover payment methods not to create an interaction'
    );

    cloverPayInput?.click();

    await waitFor(
      () => pageDocument.querySelector('#clover-pay-connect-widget') !== null,
      'expected Clover Pay to mount the CommerceHub Connect SDK'
    );

    const createRequestBody = createRequest.body;
    assert.isDefined(createRequestBody);
    assert.notProperty(createRequestBody, 'email');
    assert.deepEqual(createRequestBody?.allowedTenderTypes, [
      'CARD',
      'BANK_ACCOUNT',
      'DYNAMIC_SESSION_CARD',
    ]);
    assert.deepEqual(createRequestBody?.merchantData, {
      clientId: 'marriot',
      merchantId: '101475000000009',
      terminalId: '10000001',
    });
    assert.equal(
      pageDocument
        .querySelector('#clover-pay-sdk-panel')
        ?.getAttribute('data-active'),
      'true'
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
    assert.include(html, 'id="interaction-first-name"');
    assert.include(html, 'id="interaction-last-name"');
    assert.include(html, 'id="interaction-advanced-verification"');
    assert.include(html, 'id="interaction-pre-authenticated"');
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

  test('uses service-aligned default values for the structured create interaction request', async () => {
    const response = await fetch('/dev/index.html');
    const html = await response.text();

    assert.include(html, "email: 'gregory.jablonski@fiserv.com'");
    assert.include(html, "clientId: 'marriot'");
    assert.include(html, "merchantId: '101475000000009'");
    assert.include(html, "terminalId: '10000001'");
    assert.include(html, 'advancedVerification: true');
    assert.include(html, 'preAuthenticated: true');
    assert.include(html, 'allowCard: true');
    assert.include(html, 'allowBankAccount: true');
    assert.include(html, 'allowDynamicSessionCard: false');
    assert.include(html, 'preAuthenticated: requestFormState.preAuthenticated');
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
