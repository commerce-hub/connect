import {assert} from '@open-wc/testing';

suite('demo host page', () => {
  test('creates the merchant interaction only when the request form is submitted', async () => {
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
    assert.include(html, '<textarea id="interaction-request"');
    assert.include(html, 'type="submit"');
    assert.include(html, "createForm.addEventListener('submit'");
    assert.include(html, 'JSON.parse(requestInput.value)');
    assert.include(
      html,
      'const interactionRequest = JSON.parse(requestInput.value)'
    );
    assert.include(html, 'createInitialInteractionResponse(');
    assert.include(html, 'body: JSON.stringify(interactionRequest)');
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

  test('uses the Angular binding example payload for the create interaction request', async () => {
    const response = await fetch('/dev/index.html');
    const html = await response.text();

    assert.include(
      html,
      "sessionReferenceId: 'angular-binding-example-1778790276183'"
    );
    assert.include(html, "authType: 'FINAL_SALE'");
    assert.include(html, "email: 'neer.patel@fiserv.com'");
    assert.include(html, "allowedTenderTypes: ['CARD', 'BANK_ACCOUNT']");
    assert.include(html, "clientId: 'marriot'");
    assert.include(html, "merchantId: '101475000000009'");
    assert.include(html, "terminalId: '10000001'");
    assert.include(html, 'wallet: true');
    assert.include(html, 'allowEmailChange: true');
  });
});
