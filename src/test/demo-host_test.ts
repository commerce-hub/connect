import {assert} from '@open-wc/testing';

suite('demo host page', () => {
  test('creates the merchant interaction from the structured request builder only when the request form is submitted', async () => {
    const response = await fetch('/dev/index.html');
    const html = await response.text();

    const createInteractionIndex = html.indexOf(
      "'/merchant/interaction/create'"
    );
    const payloadPanelIndex = html.indexOf('<section class="payload-panel"');
    const widgetPanelIndex = html.indexOf(
      '<section class="demo-widget-panel">'
    );
    const designConfigIndex = html.indexOf('id="design-config-card"');
    const createInteractionActionsIndex = html.indexOf(
      'id="create-interaction-actions"'
    );

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
    assert.isBelow(
      payloadPanelIndex,
      widgetPanelIndex,
      'expected create interaction and design config to appear in the first column'
    );
    assert.include(html, '<details class="payload-card" id="design-config-card">');
    assert.notInclude(
      html,
      '<details class="payload-card" id="design-config-card" open'
    );
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
      designConfigIndex,
      createInteractionActionsIndex,
      'expected the create interaction action row after the design config section'
    );
    assert.include(html, 'id="create-interaction-actions"');
    assert.include(html, 'type="submit"');
    assert.include(html, 'form="interaction-create-form"');
    assert.include(html, "createForm.addEventListener('submit'");
    assert.include(html, 'requestForm.addEventListener(');
    assert.include(html, 'designConfigForm.addEventListener(');
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
    assert.include(html, 'advancedVerification: false');
    assert.include(html, 'preAuthenticated: true');
    assert.include(html, 'allowCard: true');
    assert.include(html, 'allowBankAccount: true');
    assert.include(html, 'allowDynamicSessionCard: false');
    assert.include(
      html,
      'preAuthenticated: requestFormState.preAuthenticated'
    );
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
    assert.include(html, "otpTitle: 'Confirm your email'");
    assert.include(html, "otpVerifyButton: 'Verify'");
    assert.include(html, "paymentMethodsTitle: 'Choose payment method'");
    assert.include(html, "paymentMethodsContinueButton: 'Use selected method'");
    assert.include(html, "noSavedTitle: 'Add payment method'");
    assert.include(html, "noSavedEmptyTitle: ''");
  });
});
