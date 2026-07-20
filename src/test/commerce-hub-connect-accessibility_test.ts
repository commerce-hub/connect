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

  test('Add launcher receives focus and Escape restores the methods toolbar', async () => {
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
    const add = element.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="open-add-payment-source"]'
    )!;

    add.click();
    await settle(element);

    const firstTab =
      element.shadowRoot!.querySelector<HTMLButtonElement>('.tender-tab')!;
    assert.strictEqual(element.shadowRoot!.activeElement, firstTab);

    firstTab.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      })
    );
    await settle(element);

    const restoredAdd = element.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="open-add-payment-source"]'
    );
    assert.exists(restoredAdd);
    assert.strictEqual(element.shadowRoot!.activeElement, restoredAdd);
  });

  test('Add launcher exposes one selected tab with associated panels and arrow activation', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const element = await renderConnect({
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      paymentSources: [],
    });

    element
      .shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="open-add-payment-source"]'
      )!
      .click();
    await settle(element);

    const tabs = [
      ...element.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tender-tab'),
    ];
    const [cardTab, bankTab] = tabs;

    assert.deepEqual(
      tabs.map((tab) => [tab.getAttribute('aria-selected'), tab.tabIndex]),
      [
        ['true', 0],
        ['false', -1],
      ]
    );

    for (const tab of tabs) {
      const panelId = tab.getAttribute('aria-controls');
      const panel = element.shadowRoot!.getElementById(panelId!);

      assert.isNotNull(panelId);
      assert.equal(panel?.getAttribute('role'), 'tabpanel');
      assert.equal(panel?.getAttribute('aria-labelledby'), tab.id);
    }

    assert.isFalse(
      element.shadowRoot!.getElementById('add-card-tab-panel')!.hidden
    );
    assert.isTrue(
      element.shadowRoot!.getElementById('add-bank-account-tab-panel')!.hidden
    );

    bankTab.focus();
    bankTab.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        composed: true,
      })
    );
    await settle(element);

    assert.exists(
      element.shadowRoot!.querySelector('form[data-submit-action="save-card"]')
    );
    assert.notExists(element.shadowRoot!.querySelector('.tender-tabs'));
    assert.notStrictEqual(cardTab, bankTab);
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
      .shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="open-add-payment-source"]'
      )!
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
