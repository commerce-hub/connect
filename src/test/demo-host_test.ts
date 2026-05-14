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
  });
});
