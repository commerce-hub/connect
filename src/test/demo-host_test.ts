import {assert} from '@open-wc/testing';

suite('demo host page', () => {
  test('creates the initial merchant interaction before initializing the widget response', async () => {
    const response = await fetch('/dev/index.html');
    const html = await response.text();

    const createInteractionIndex = html.indexOf(
      "'/merchant/interaction/create'"
    );
    const initInteractionIndex = html.indexOf(
      'widget.interactionResponse = interactionResponse'
    );
    const apiResponseIndex = html.indexOf(
      'await createInitialInteractionResponse()'
    );
    const widgetInitIndex = html.indexOf('initializeWidget(interactionResponse)');

    assert.isAtLeast(
      createInteractionIndex,
      0,
      'expected demo host to call /merchant/interaction/create'
    );
    assert.isAtLeast(
      initInteractionIndex,
      0,
      'expected demo host to initialize the widget response'
    );
    assert.isBelow(
      createInteractionIndex,
      initInteractionIndex,
      'expected create interaction call before widget response initialization'
    );
    assert.notInclude(
      html,
      '<commerce-hub-connect id="connect-widget">',
      'expected demo host to create the widget after receiving the API response'
    );
    assert.isAtLeast(
      apiResponseIndex,
      0,
      'expected demo host to await the initial interaction response'
    );
    assert.isAtLeast(
      widgetInitIndex,
      0,
      'expected demo host to initialize the widget with the API response'
    );
    assert.isBelow(
      apiResponseIndex,
      widgetInitIndex,
      'expected API response before widget initialization'
    );
  });
});
