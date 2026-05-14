import {fixture, assert, html as testingHtml} from '@open-wc/testing';
import {html, nothing, TemplateResult} from 'lit';

import {
  CommerceHubConnect,
  type InteractionResponse,
} from '../commerce-hub-connect.js';
import {
  renderAlert,
  renderButton,
  renderDetailList,
  renderFormGrid,
  renderLoadingRow,
  renderOtpGroup,
  renderOutcomeShell,
  renderPaymentMethodRow,
  renderPoweredByFooter,
  renderProviderFrame,
  renderSourceAction,
  renderStatusPill,
  renderTextField,
  renderTextLinkButton,
  renderUploadRow,
  renderVerificationDetails,
  renderWidgetShell,
} from '../internal/primitives.js';
import type {PaymentMethod} from '../internal/types.js';

class PrimitiveHarness extends HTMLElement {
  readonly shadow = this.attachShadow({mode: 'open'});

  render(template: TemplateResult | typeof nothing) {
    import('lit').then(({render}) => render(template, this.shadow));
  }
}

customElements.define('primitive-harness', PrimitiveHarness);

const renderHarness = async (template: TemplateResult) => {
  const el = (await fixture(
    testingHtml`<primitive-harness></primitive-harness>`
  )) as PrimitiveHarness;
  el.render(template);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  return el.shadow;
};

suite('commerce-hub-connect primitives', () => {
  test('defines the public widget element without exposing primitive custom elements', () => {
    const el = document.createElement('commerce-hub-connect');

    assert.instanceOf(el, CommerceHubConnect);
    assert.isUndefined(customElements.get('chc-button'));
    assert.isUndefined(customElements.get('chc-text-field'));
  });

  test('renders the widget shell with SDK v2 token defaults and shell affordances', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    assert.equal(
      getComputedStyle(el)
        .getPropertyValue('--chc-primary')
        .trim()
        .toUpperCase(),
      '#003DE6'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-text').trim().toUpperCase(),
      '#06103A'
    );
    assert.equal(getComputedStyle(el).fontFamily.includes('Open Sans'), true);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-label'),
      'CommerceHub Connect'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-close')?.getAttribute('aria-label'),
      'Close CommerceHub Connect'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.powered-by-brand')?.textContent?.trim(),
      'CommerceHub Connect'
    );
  });

  test('applies partial designConfig color and typography without resizing controls', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .designConfig=${{
          colors: {
            primary: '#0f766e',
          },
          baseFontSize: '20px',
        }}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    const title = el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!;
    const button = el.shadowRoot!.querySelector<HTMLElement>('.button')!;

    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-primary').trim(),
      '#0f766e'
    );
    assert.equal(getComputedStyle(title).fontSize, '42.5px');
    assert.equal(getComputedStyle(button).minHeight, '72px');
  });

  test('renders payment sources from an interaction response input', async () => {
    const interactionResponse: InteractionResponse = {
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {
          network: 'Visa',
          cardNumber: '4111111111114242',
        },
      },
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111114242',
          },
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {status: 'UNDER_REVIEW'},
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
      ],
    };

    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .interactionResponse=${interactionResponse}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-row'
      ),
    ];

    assert.deepEqual(
      rows.map((row) => row.dataset.paymentMethodId),
      ['card-1', 'bank-1']
    );
    assert.equal(
      rows[0].querySelector('.payment-method-holder')?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      rows[0].querySelector('.payment-method-title')?.textContent?.trim(),
      'Visa •••• 4242'
    );
    assert.equal(rows[0].getAttribute('aria-checked'), 'true');
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Commerce National Bank •••• 3210'
    );
    assert.equal(
      rows[1].querySelector('.payment-method-status')?.textContent?.trim(),
      'Further info required'
    );
  });

  test('does not emit onSuccess when interaction response changes', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect></commerce-hub-connect>`
    )) as CommerceHubConnect;
    const interactionResponse: InteractionResponse = {
      interactionId: 'interaction-1',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
      },
    };
    const events: CustomEvent<InteractionResponse>[] = [];

    el.addEventListener('onSuccess', (event) => {
      events.push(event as CustomEvent<InteractionResponse>);
    });

    el.interactionResponse = interactionResponse;
    await el.updateComplete;

    assert.lengthOf(events, 0);
  });

  test('renders accessible buttons, text fields, otp inputs, alerts, and status pills', async () => {
    const root = await renderHarness(html`
      ${renderButton({
        label: 'Continue',
        variant: 'primary',
        action: 'continue',
      })}
      ${renderButton({label: 'Back', variant: 'secondary', action: 'back'})}
      ${renderTextField({
        id: 'email',
        label: 'Email address',
        value: 'wallet@example.com',
        type: 'email',
      })}
      ${renderOtpGroup({label: 'Verification code', value: '123456'})}
      ${renderAlert({
        variant: 'success',
        message: 'This bank account is verified.',
      })}
      ${renderUploadRow({
        label: 'Bank statement',
        requirements: 'PDF, PNG or JPG - Last 90 days',
        actionLabel: 'Upload file',
      })}
      ${renderLoadingRow({
        title: 'Verifying code',
        helper: 'Validating the 6-digit OTP',
      })}
      ${renderStatusPill({status: 'unverified'})} ${renderPoweredByFooter()}
    `);

    assert.equal(
      root.querySelector('button[data-action="continue"]')?.textContent?.trim(),
      'Continue'
    );
    assert.equal(
      root
        .querySelector('button[data-action="back"]')
        ?.classList.contains('button-secondary'),
      true
    );
    assert.equal(root.querySelector('label')?.getAttribute('for'), 'email');
    assert.equal(
      root.querySelector<HTMLInputElement>('input#email')?.value,
      'wallet@example.com'
    );
    assert.lengthOf(root.querySelectorAll('.otp-input'), 6);
    assert.equal(
      root.querySelector('[role="alert"]')?.textContent?.trim(),
      'This bank account is verified.'
    );
    assert.equal(
      root.querySelector('.upload-row-label')?.textContent?.trim(),
      'Bank statement'
    );
    assert.equal(
      root.querySelector('.loading-row-title')?.textContent?.trim(),
      'Verifying code'
    );
    assert.equal(
      root.querySelector('.status-pill')?.textContent?.trim(),
      'Unverified'
    );
    assert.equal(
      root.querySelector('.powered-by-brand')?.textContent?.trim(),
      'CommerceHub Connect'
    );
  });

  test('renders v2 payment method, source action, and detail primitives with disabled state semantics', async () => {
    const method: PaymentMethod = {
      id: 'bank-1',
      label: 'James Anderson',
      type: 'bank',
      brand: 'Checking',
      last4: '1234',
      status: 'pending',
      selected: false,
      disabled: true,
    };

    const root = await renderHarness(html`
      ${renderPaymentMethodRow(method)}
      ${renderSourceAction({
        label: 'Add new bank account',
        subtitle: 'Connect a different account',
        action: 'add-bank-account',
        icon: 'bank',
      })}
      ${renderDetailList([
        {label: 'Account holder name', value: 'Alex Morgan'},
        {label: 'Last 4 digits', value: '2288'},
      ])}
    `);

    const row = root.querySelector<HTMLButtonElement>(
      '[data-payment-method-id="bank-1"]'
    );
    assert.equal(row?.disabled, true);
    assert.equal(row?.getAttribute('aria-disabled'), 'true');
    assert.equal(
      root.querySelector('.payment-method-eyebrow')?.textContent?.trim(),
      'Saved bank account'
    );
    assert.equal(
      root.querySelector('.payment-method-title')?.textContent?.trim(),
      'Checking •••• 1234'
    );
    assert.equal(
      root
        .querySelector('[data-action="add-bank-account"]')
        ?.querySelector('.source-action-title')
        ?.textContent?.trim(),
      'Add new bank account'
    );
    assert.equal(
      root.querySelector('.source-action-subtitle')?.textContent?.trim(),
      'Connect a different account'
    );
    assert.deepEqual(
      [...root.querySelectorAll('.detail-label')].map((item) =>
        item.textContent?.trim()
      ),
      ['Account holder name', 'Last 4 digits']
    );
  });

  test('renders Pay by Bank provider, outcome, detail, and text-link primitives', async () => {
    const root = await renderHarness(html`
      ${renderProviderFrame({
        containerId: 'provider-container',
        title: 'Secure provider connection',
        loadingLabel: 'Connecting to your bank...',
      })}
      ${renderOutcomeShell({
        variant: 'success',
        title: 'Bank account verified',
        message: 'Your account is ready to use.',
        content: renderVerificationDetails([
          {label: 'Bank', value: 'Commerce National Bank'},
          {label: 'Last 4 digits', value: '3210'},
        ]),
        actions: html`
          ${renderButton({label: 'Continue', action: 'continue-bank-outcome'})}
          ${renderTextLinkButton({
            label: 'Use a different account',
            action: 'use-different-bank-account',
          })}
        `,
      })}
    `);

    assert.equal(
      root.querySelector('.provider-frame-title')?.textContent?.trim(),
      'Secure provider connection'
    );
    assert.exists(root.querySelector('#provider-container'));
    assert.equal(
      root.querySelector('.provider-frame-status')?.getAttribute('role'),
      'status'
    );
    assert.equal(
      root
        .querySelector('.outcome-shell')
        ?.classList.contains('outcome-success'),
      true
    );
    assert.equal(
      root.querySelector('.outcome-title')?.textContent?.trim(),
      'Bank account verified'
    );
    assert.deepEqual(
      [...root.querySelectorAll('.verification-detail-label')].map((item) =>
        item.textContent?.trim()
      ),
      ['Bank', 'Last 4 digits']
    );
    assert.equal(
      root
        .querySelector('[data-action="use-different-bank-account"]')
        ?.textContent?.trim(),
      'Use a different account'
    );
  });

  test('renders shell and responsive form grid composition primitives', async () => {
    const root = await renderHarness(html`
      ${renderWidgetShell({
        title: 'Add card',
        subtitle: 'Save a new credit or debit card to this wallet.',
        width: 'wide',
        closeAction: 'close-card',
        content: renderFormGrid([
          renderTextField({id: 'card-label', label: 'Card label'}),
          renderTextField({id: 'name-on-card', label: 'Name on card'}),
          renderTextField({
            id: 'address-line-1',
            label: 'Address line 1',
            span: 'full',
          }),
        ]),
      })}
    `);

    assert.equal(
      root.querySelector('.widget-title')?.textContent?.trim(),
      'Add card'
    );
    assert.equal(
      root
        .querySelector('.widget-shell')
        ?.classList.contains('widget-shell-wide'),
      true
    );
    assert.equal(
      root.querySelector('.widget-close')?.getAttribute('data-action'),
      'close-card'
    );
    assert.equal(
      root
        .querySelector('.powered-by-footer')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim(),
      'Powered by CommerceHub Connect'
    );
    assert.lengthOf(root.querySelectorAll('.field'), 3);
    assert.equal(
      root
        .querySelector('#address-line-1')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
  });
});
