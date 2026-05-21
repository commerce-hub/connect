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

suite('demo host page', () => {
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
    assert.include(html, 'widget.baseURL = commerceHubApiBaseUrl');
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
