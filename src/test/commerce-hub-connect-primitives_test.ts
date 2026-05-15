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
  renderSelectField,
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
    const title = el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!;
    const paymentMeta =
      el.shadowRoot!.querySelector<HTMLElement>('.payment-method-meta')!;
    const poweredByFooter =
      el.shadowRoot!.querySelector<HTMLElement>('.powered-by-footer')!;
    const poweredByBrand =
      el.shadowRoot!.querySelector<HTMLElement>('.powered-by-brand')!;

    assert.equal(
      getComputedStyle(el)
        .getPropertyValue('--chc-primary')
        .trim()
        .toUpperCase(),
      '#003DE6'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-text').trim().toUpperCase(),
      '#101828'
    );
    assert.equal(getComputedStyle(el).fontFamily.includes('Open Sans'), true);
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-font-weight').trim(),
      '300'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-label'),
      'Commerce Hub Connect'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.equal(getComputedStyle(title).fontSize, '18.4px');
    assert.equal(getComputedStyle(title).fontWeight, '700');
    assert.equal(getComputedStyle(paymentMeta).fontWeight, '300');
    assert.equal(getComputedStyle(poweredByFooter).justifyContent, 'center');
    assert.equal(
      poweredByBrand.textContent?.trim(),
      'Commerce Hub Connect'
    );
    assert.equal(getComputedStyle(poweredByBrand).color, 'rgb(16, 24, 40)');
  });

  test('applies partial designConfig color and typography without resizing controls', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .designConfig=${{
          colors: {
            primary: '#0f766e',
            surface: '#f4f7fb',
          },
          baseFontSize: '20px',
          baseFontWeight: '350',
        }}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    const title = el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!;
    const paymentMeta =
      el.shadowRoot!.querySelector<HTMLElement>('.payment-method-meta')!;
    const button = el.shadowRoot!.querySelector<HTMLElement>('.button')!;
    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;

    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-primary').trim(),
      '#0f766e'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-font-weight').trim(),
      '350'
    );
    assert.equal(getComputedStyle(title).fontSize, '18.4px');
    assert.equal(getComputedStyle(title).fontWeight, '700');
    assert.equal(getComputedStyle(paymentMeta).fontWeight, '350');
    assert.equal(getComputedStyle(button).paddingTop, '7px');
    assert.equal(getComputedStyle(button).paddingBottom, '7px');
    assert.equal(getComputedStyle(button).fontWeight, '500');
    assert.equal(
      getComputedStyle(shell).backgroundColor,
      'rgb(244, 247, 251)'
    );
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
      rows[0].querySelector('.payment-method-title')?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      rows[0].querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 4242'
    );
    assert.equal(rows[0].getAttribute('aria-checked'), 'true');
    assert.exists(rows[0].querySelector('[data-payment-method-icon="visa"]'));
    assert.notExists(rows[0].querySelector('.payment-method-status'));
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      rows[1].querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 3210'
    );
    assert.equal(
      rows[1].querySelector('.payment-method-status')?.textContent?.trim(),
      'Further info required'
    );
    assert.exists(rows[1].querySelector('[data-payment-method-icon="bank"]'));
    assert.notExists(rows[1].querySelector('.payment-method-chevron'));
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
        value: 'gregory.jablonski@fiserv.com',
        type: 'email',
      })}
      ${renderSelectField({
        id: 'billing-address',
        label: 'Billing address',
        value: 'billing-1',
        options: [
          {value: 'billing-1', label: '1 Main St, New York, NY 10001'},
          {value: '__new__', label: 'Add new billing address'},
        ],
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
      'gregory.jablonski@fiserv.com'
    );
    assert.equal(
      root.querySelector<HTMLSelectElement>('select#billing-address')?.value,
      'billing-1'
    );
    assert.deepEqual(
      [
        ...root.querySelectorAll<HTMLOptionElement>(
          '#billing-address option'
        ),
      ].map((option) => option.textContent?.trim()),
      ['1 Main St, New York, NY 10001', 'Add new billing address']
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
      'Commerce Hub Connect'
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
      ${renderSourceAction({
        label: 'Add card',
        action: 'add-card',
        icon: 'card',
        variant: 'link',
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
      root.querySelector('.payment-method-title')?.textContent?.trim(),
      'James Anderson'
    );
    assert.equal(
      root.querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 1234'
    );
    assert.equal(
      root.querySelector('.payment-method-status')?.textContent?.trim(),
      'Further info required'
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
    assert.exists(
      root.querySelector('[data-action="add-card"] .source-action-icon')
    );
    assert.notExists(
      root.querySelector('[data-action="add-card"] .source-action-link-icon')
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
        showClose: true,
        closeAction: 'close-card',
        content: renderFormGrid([
          renderTextField({id: 'card-label', label: 'Card label'}),
          renderTextField({id: 'name-on-card', label: 'Name on card'}),
          renderTextField({
            id: 'address-line-1',
            label: 'Address line 1',
            span: 'full',
          }),
          renderSelectField({
            id: 'saved-addresses',
            label: 'Billing address',
            options: [{value: '__new__', label: 'Add new billing address'}],
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
      'Powered by Commerce Hub Connect'
    );
    assert.lengthOf(root.querySelectorAll('.field'), 4);
    assert.equal(
      root
        .querySelector('#address-line-1')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
    assert.equal(
      root
        .querySelector('#saved-addresses')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
  });
});
