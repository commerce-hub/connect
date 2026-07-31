import {assert, fixture, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import type {
  CommerceHubConnect,
  InteractionResponse,
} from '../commerce-hub-connect.js';

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const settle = async (element: CommerceHubConnect) => {
  await element.updateComplete;
  await nextFrame();
  await element.updateComplete;
};

const waitFor = async (
  predicate: () => boolean,
  message = 'condition was not met'
) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await nextFrame();

    if (predicate()) {
      return;
    }
  }

  throw new Error(message);
};

const renderConnect = async (interactionResponse: InteractionResponse) => {
  const element = (await fixture(
    testingHtml`<commerce-hub-connect
      .interactionResponse=${interactionResponse}
      .baseURL=${'http://commercehub.test'}
    ></commerce-hub-connect>`
  )) as CommerceHubConnect;

  await settle(element);
  return element;
};

const relativeLuminance = (color: string): number => {
  const channels =
    color
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number) ?? [];
  const linear = channels.map((channel) => {
    const normalized = channel / 255;

    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};

const contrastRatio = (foreground: string, background: string): number => {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background)
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background)
  );

  return (lighter + 0.05) / (darker + 0.05);
};

suite('commerce-hub-connect accessibility', () => {
  const originalFetch = window.fetch;

  teardown(() => {
    window.fetch = originalFetch;
  });

  test('OTP is a native form and submits through Enter-compatible semantics', async () => {
    const requests: Request[] = [];

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);

      if (request.method === 'GET') {
        return new Response(
          JSON.stringify({
            interactionId: 'otp-interaction',
            status: 'OTP_VALIDATION_PENDING',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      requests.push(request);

      return new Response(
        JSON.stringify({
          interactionId: 'otp-interaction',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
          features: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const element = await renderConnect({
      interactionId: 'otp-interaction',
      status: 'OTP_VALIDATION_PENDING',
    });
    const inputs = [
      ...element.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input'),
    ];

    inputs.forEach((input, index) => {
      input.value = String(index + 1);
      input.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true})
      );
    });
    await settle(element);

    const form =
      element.shadowRoot!.querySelector<HTMLFormElement>('.otp-flow')!;
    const submit = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );

    assert.exists(form);
    assert.exists(submit);
    assert.isFalse(submit!.disabled);
    form.requestSubmit();
    await settle(element);

    assert.equal(requests.length, 1);
    assert.equal(
      new URL(requests[0].url).pathname,
      '/interaction/otp/validate'
    );
    assert.equal(requests[0].method, 'POST');
  });

  test('sheet Add card focuses its form and Escape restores the methods list', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const element = await renderConnect({
      interactionId: 'focus-interaction',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      paymentSources: [
        {
          id: 'card-1',
          tenderType: 'Card',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {network: 'Visa', cardNumber: '1111'},
        },
      ],
    });
    await waitFor(
      () =>
        Boolean(
          element.shadowRoot!.querySelector(
            '[data-action="open-add-payment-source"]'
          )
        ),
      'Add payment method action did not render'
    );
    const add = element.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="open-add-payment-source"]'
    )!;

    add.click();
    await settle(element);
    element
      .shadowRoot!.querySelector<HTMLButtonElement>(
        '.add-payment-sheet [data-action="add-card"]'
      )!
      .click();
    await settle(element);

    const cardLabel =
      element.shadowRoot!.querySelector<HTMLInputElement>('#card-label')!;
    assert.strictEqual(element.shadowRoot!.activeElement, cardLabel);

    cardLabel.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      })
    );
    await settle(element);

    const restoredMethodAction =
      element.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="open-add-payment-source"]'
      );
    assert.exists(restoredMethodAction);
    assert.strictEqual(element.shadowRoot!.activeElement, restoredMethodAction);
  });

  test('Add payment method sheet traps focus and Escape restores the trigger', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const element = await renderConnect({
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      paymentSources: [],
    });

    element
      .shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="open-add-payment-source"]'
      )!
      .click();
    await settle(element);

    const addButton = element.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="open-add-payment-source"]'
    )!;
    const closeButton = element.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="close-add-payment-source"]'
    )!;
    const bankOption = element.shadowRoot!.querySelector<HTMLButtonElement>(
      '.add-payment-sheet [data-action="add-bank-account"]'
    )!;

    assert.strictEqual(element.shadowRoot!.activeElement, closeButton);

    bankOption.focus();
    bankOption.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        composed: true,
      })
    );
    await settle(element);
    assert.strictEqual(element.shadowRoot!.activeElement, closeButton);

    closeButton.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        composed: true,
      })
    );
    await settle(element);
    assert.strictEqual(element.shadowRoot!.activeElement, bankOption);

    bankOption.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      })
    );
    await settle(element);

    assert.notExists(element.shadowRoot!.querySelector('.add-payment-sheet'));
    assert.strictEqual(element.shadowRoot!.activeElement, addButton);
  });

  test('Add payment method sheet closes from its close button and backdrop', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const element = await renderConnect({
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      paymentSources: [],
    });
    const openSheet = async () => {
      element
        .shadowRoot!.querySelector<HTMLButtonElement>(
          '[data-action="open-add-payment-source"]'
        )!
        .click();
      await settle(element);
    };

    await openSheet();
    element
      .shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="close-add-payment-source"]'
      )!
      .click();
    await settle(element);
    assert.notExists(element.shadowRoot!.querySelector('.add-payment-sheet'));

    await openSheet();
    element
      .shadowRoot!.querySelector<HTMLElement>('.add-payment-sheet-backdrop')!
      .click();
    await settle(element);
    assert.notExists(element.shadowRoot!.querySelector('.add-payment-sheet'));
  });

  test('Add is hidden when no supported add tender is allowed', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const nativeOnlyResponse: InteractionResponse = {
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
      allowedTenderTypes: ['NATIVE_ACCOUNT'],
      paymentSources: [],
    };
    const emptyElement = await renderConnect(nativeOnlyResponse);

    assert.notExists(
      emptyElement.shadowRoot!.querySelector(
        '[data-action="open-add-payment-source"]'
      )
    );

    const populatedElement = await renderConnect({
      ...nativeOnlyResponse,
      paymentSources: [
        {
          tenderType: 'NativeAccount',
          id: 'native-account-1',
          name: 'Digital wallet',
          verificationInfo: {status: 'VERIFIED'},
          account: {
            positionId: 'wallet-position-7890',
            nickName: 'Commerce wallet',
            productType: 'Wallet',
            token: 'native-token-1',
          },
        },
      ],
    });

    assert.notExists(
      populatedElement.shadowRoot!.querySelector(
        '[data-action="open-add-payment-source"]'
      )
    );
  });

  test('primary data-entry screens expose submit buttons inside native forms', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const element = await renderConnect({
      interactionId: 'form-interaction',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD'],
      paymentSources: [],
    });

    element
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-action="add-card"]')!
      .click();
    await settle(element);

    const form = element.shadowRoot!.querySelector<HTMLFormElement>(
      'form[data-submit-action="save-card"]'
    );
    assert.exists(form);
    assert.exists(form!.querySelector('button[type="submit"]'));
  });

  test('status text and control borders meet WCAG contrast thresholds', async () => {
    const element = await renderConnect({
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          id: 'bank-review',
          tenderType: 'BankAccount',
          name: 'Review account',
          verificationInfo: {status: 'UNDER_REVIEW'},
          bankAccount: {accountNumber: '6789'},
        },
      ],
    });
    const badge = element.shadowRoot!.querySelector<HTMLElement>(
      '.verification-status-badge'
    )!;
    const badgeStyle = getComputedStyle(badge);
    const control = document.createElement('input');

    control.className = 'field-input';
    element.shadowRoot!.querySelector('.widget-content')!.append(control);
    const controlStyle = getComputedStyle(control);
    const shellBackground = getComputedStyle(
      element.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!
    ).backgroundColor;

    assert.isAtLeast(
      contrastRatio(badgeStyle.color, badgeStyle.backgroundColor),
      4.5
    );
    assert.isAtLeast(
      contrastRatio(controlStyle.borderTopColor, shellBackground),
      3
    );
  });
});
