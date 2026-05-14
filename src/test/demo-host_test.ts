import {assert} from '@open-wc/testing';

suite('demo host page', () => {
  test('creates the merchant interaction from the structured request builder only when the request form is submitted', async () => {
    const response = await fetch('/dev/index.html');
    const html = await response.text();

    const createInteractionIndex = html.indexOf(
      "'/merchant/interaction/create'"
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
    assert.include(html, 'name="allowedTenderTypes"');
    assert.include(html, '<pre id="interaction-request-preview"');
    assert.include(html, 'type="submit"');
    assert.include(html, "createForm.addEventListener('submit'");
    assert.include(html, 'requestForm.addEventListener(');
    assert.include(
      html,
      'const interactionRequest = buildInteractionRequest(requestFormState)'
    );
    assert.include(html, 'createInitialInteractionResponse(');
    assert.include(html, 'body: JSON.stringify(interactionRequest)');
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

    assert.include(html, "email: 'wallet@example.com'");
    assert.include(html, "clientId: 'laika'");
    assert.include(html, "merchantId: '100014000315473'");
    assert.include(html, "terminalId: '10000001'");
    assert.include(html, 'advancedVerification: false');
    assert.include(html, 'allowCard: true');
    assert.include(html, 'allowBankAccount: true');
    assert.include(html, 'allowDynamicSessionCard: false');
  });
});
