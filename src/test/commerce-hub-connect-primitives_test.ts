import {fixture, assert, html as testingHtml} from '@open-wc/testing';
import {html, nothing, TemplateResult} from 'lit';

import {
  CommerceHubConnect,
  type InteractionResponse,
  type PaymentSource,
} from '../commerce-hub-connect.js';
import {
  renderAlert,
  renderButton,
  renderDetailList,
  renderFormGrid,
  renderLoadingRow,
  renderOtpGroup,
  renderOutcomeShell,
  renderPaymentMethodSkeletonRows,
  renderPaymentMethodRow,
  renderPoweredByFooter,
  renderProviderFrame,
  renderSelectedPaymentMethod,
  renderSelectField,
  renderSourceAction,
  renderStatusPill,
  renderTextField,
  renderTextLinkButton,
  renderUploadRow,
  renderVerificationDetails,
  renderWidgetShell,
} from '../internal/primitives.js';
import {primitiveStyles} from '../internal/styles.js';
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

  test('does not use explicit line-height declarations in shared styles', () => {
    assert.notInclude(primitiveStyles.cssText, 'line-height');
  });

  test('does not use font shorthands in shared styles so base font-weight inheritance remains intact', () => {
    assert.notInclude(primitiveStyles.cssText, 'font: inherit');
  });

  test('uses rem units in shared styles instead of px sizing tokens', () => {
    assert.notInclude(primitiveStyles.cssText, 'px');
  });

  test('declares a hover affordance for clickable source action links', () => {
    assert.include(primitiveStyles.cssText, '.source-action-link:hover');
  });

  test('renders the widget shell with SDK v3 compact token defaults and footer treatment', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;
    const title = el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!;
    const paymentMeta = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-meta'
    )!;
    const poweredByFooter =
      el.shadowRoot!.querySelector<HTMLElement>('.powered-by-footer')!;
    const poweredByBrand =
      el.shadowRoot!.querySelector<HTMLElement>('.powered-by-brand')!;

    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const content =
      el.shadowRoot!.querySelector<HTMLElement>('.widget-content')!;

    assert.equal(
      getComputedStyle(el)
        .getPropertyValue('--chc-primary')
        .trim()
        .toUpperCase(),
      '#1D4ED8'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-text').trim().toUpperCase(),
      '#111827'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-copy').trim().toUpperCase(),
      '#4B5565'
    );
    assert.equal(getComputedStyle(el).fontFamily.includes('Inter'), true);
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-font-weight').trim(),
      '400'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-label'),
      'Commerce Hub Connect'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.equal(getComputedStyle(shell).maxWidth, '324px');
    assert.equal(getComputedStyle(shell).borderRadius, '22px');
    assert.equal(getComputedStyle(content).maxWidth, '286px');
    assert.closeTo(parseFloat(getComputedStyle(title).fontSize), 18, 0.01);
    assert.equal(getComputedStyle(title).fontWeight, '600');
    assert.equal(getComputedStyle(paymentMeta).fontWeight, '400');
    assert.equal(
      getComputedStyle(
        el.shadowRoot!.querySelector<HTMLElement>(
          '.widget-header-action .text-link-button'
        )!
      ).borderTopStyle,
      'none'
    );
    assert.equal(getComputedStyle(poweredByFooter).justifyContent, 'center');
    assert.equal(getComputedStyle(poweredByFooter).fontSize, '12px');
    assert.equal(poweredByBrand.textContent?.trim(), 'Commerce Hub Connect');
    assert.equal(getComputedStyle(poweredByBrand).color, 'rgb(29, 78, 216)');
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
          shellPadding: '2rem 1.25rem 1rem',
        }}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    const title = el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!;
    const paymentMeta = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-meta'
    )!;
    const button = el.shadowRoot!.querySelector<HTMLElement>(
      '.source-action-link'
    )!;
    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const poweredByFooter =
      el.shadowRoot!.querySelector<HTMLElement>('.powered-by-footer')!;

    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-primary').trim(),
      '#0f766e'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-font-weight').trim(),
      '350'
    );
    assert.closeTo(parseFloat(getComputedStyle(title).fontSize), 18, 0.01);
    assert.equal(getComputedStyle(title).fontWeight, '600');
    assert.equal(getComputedStyle(button).fontSize, '20px');
    assert.equal(getComputedStyle(paymentMeta).fontWeight, '350');
    assert.equal(getComputedStyle(paymentMeta).fontSize, '20px');
    assert.equal(getComputedStyle(poweredByFooter).fontSize, '15px');
    assert.equal(getComputedStyle(button).minHeight, '40px');
    assert.equal(getComputedStyle(button).paddingTop, '10px');
    assert.equal(getComputedStyle(button).paddingBottom, '10px');
    assert.equal(getComputedStyle(button).fontWeight, '350');
    assert.equal(getComputedStyle(shell).backgroundColor, 'rgb(244, 247, 251)');
    assert.equal(getComputedStyle(shell).paddingTop, '32px');
    assert.equal(getComputedStyle(shell).paddingRight, '20px');
    assert.equal(getComputedStyle(shell).paddingBottom, '16px');
    assert.equal(getComputedStyle(shell).paddingLeft, '20px');
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
      'Visa •••• 4242'
    );
    assert.notExists(rows[0].querySelector('.payment-method-radio'));
    assert.exists(rows[0].querySelector('[data-payment-method-icon="visa"]'));
    assert.equal(
      getComputedStyle(
        rows[0].querySelector<HTMLElement>('.payment-method-icon-chip')!
      ).borderTopStyle,
      'none'
    );
    assert.exists(rows[0].querySelector('.payment-method-title-row'));
    assert.exists(rows[0].querySelector('.payment-method-meta-row'));
    assert.notExists(rows[0].querySelector('.payment-method-status'));
    assert.notExists(rows[0].querySelector('.verification-status-icon'));
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      rows[1].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Commerce National Bank •••• 3210'
    );
    assert.exists(rows[1].querySelector('.payment-method-title-row'));
    assert.exists(rows[1].querySelector('.payment-method-meta-row'));
    assert.notExists(rows[1].querySelector('.payment-method-status'));
    assert.notExists(rows[1].querySelector('.verification-status-badge'));
    assert.exists(rows[1].querySelector('.payment-method-status-icon-warning'));
    assert.exists(rows[1].querySelector('.payment-method-chevron'));
    assert.equal(
      rows[1]
        .querySelector('.payment-method-status-icon')
        ?.getAttribute('aria-label'),
      'Under review'
    );
    assert.exists(rows[1].querySelector('[data-payment-method-icon="bank"]'));
    assert.notExists(rows[1].querySelector('.payment-method-radio'));
    assert.equal(rows[1].dataset.action, 'verify-payment-source');
  });

  test('uses the bank name as the payment-method title when a bank source name is missing', async () => {
    const interactionResponse: InteractionResponse = {
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
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

    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Commerce National Bank'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 3210'
    );
  });

  test('uses the bank name as the payment-method title when a bank source name is blank', async () => {
    const interactionResponse: InteractionResponse = {
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: '   ',
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

    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Commerce National Bank'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 3210'
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
    const events: CustomEvent<PaymentSource>[] = [];

    el.addEventListener('onSuccess', (event) => {
      events.push(event as CustomEvent<PaymentSource>);
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
      root.querySelector('button.button-primary')?.textContent?.trim(),
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
        ...root.querySelectorAll<HTMLOptionElement>('#billing-address option'),
      ].map((option) => option.textContent?.trim()),
      ['1 Main St, New York, NY 10001', 'Add new billing address']
    );
    assert.lengthOf(root.querySelectorAll('.otp-input'), 6);
    assert.equal(
      root.querySelector('[role="alert"]')?.textContent?.trim(),
      'This bank account is verified.'
    );
    assert.exists(root.querySelector('[role="alert"] .alert-icon'));
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

  test('renders loading buttons with a spinner, busy state, and stable accessible label', async () => {
    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderButton({
        label: 'Verifying code',
        action: 'verify-otp',
        loading: true,
      })}
    `);

    const button = root.querySelector<HTMLButtonElement>('.button')!;
    const spinner = button.querySelector<HTMLElement>('.button-spinner')!;

    assert.equal(button.disabled, true);
    assert.equal(button.getAttribute('aria-busy'), 'true');
    assert.equal(
      button.querySelector('.button-label')?.textContent?.trim(),
      'Verifying code'
    );
    assert.exists(spinner);
    assert.equal(spinner.getAttribute('aria-hidden'), 'true');
    assert.equal(getComputedStyle(spinner).animationTimingFunction, 'linear');
  });

  test('renders widget loading overlays with status semantics without removing content', async () => {
    const root = await renderHarness(html`
      ${renderWidgetShell({
        title: 'Add card',
        busy: true,
        overlay: html`
          <div class="widget-loading-status" role="status" aria-live="polite">
            <span
              class="loading-spinner loading-spinner-small"
              aria-hidden="true"
            ></span>
            <span class="widget-loading-copy">
              <span class="widget-loading-title">Saving payment method</span>
              <span class="widget-loading-helper"
                >Keep this window open while we save your card.</span
              >
            </span>
          </div>
        `,
        content: html`<button class="retained-control">Retained</button>`,
      })}
    `);

    const shell = root.querySelector<HTMLElement>('.widget-shell')!;

    assert.equal(shell.getAttribute('aria-busy'), 'true');
    assert.exists(root.querySelector('.retained-control'));
    assert.equal(
      root.querySelector('.widget-loading-title')?.textContent?.trim(),
      'Saving payment method'
    );
    assert.equal(
      root.querySelector('.widget-loading-status')?.getAttribute('role'),
      'status'
    );
  });

  test('renders provider loading overlays while preserving the provider container', async () => {
    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderProviderFrame({
        containerId: 'provider-container',
        loading: true,
        loadingLabel: 'Connecting to your bank',
      })}
    `);

    const frame = root.querySelector<HTMLElement>('.provider-frame')!;
    const container = root.querySelector<HTMLElement>('#provider-container')!;
    const overlay = root.querySelector<HTMLElement>(
      '.provider-loading-overlay'
    )!;

    assert.equal(frame.getAttribute('aria-busy'), 'true');
    assert.exists(container);
    assert.equal(getComputedStyle(container).minHeight, '500px');
    assert.equal(overlay.getAttribute('role'), 'status');
    assert.equal(
      overlay.textContent?.replace(/\s+/g, ' ').trim(),
      'Connecting to your bank'
    );
  });

  test('renders payment method skeleton rows with status text for interaction refresh', async () => {
    const root = await renderHarness(html`
      ${renderPaymentMethodSkeletonRows({
        count: 3,
        label: 'Loading payment methods',
      })}
    `);

    const status = root.querySelector<HTMLElement>(
      '.payment-method-skeletons'
    )!;

    assert.equal(status.getAttribute('role'), 'status');
    assert.equal(status.getAttribute('aria-live'), 'polite');
    assert.include(status.textContent ?? '', 'Loading payment methods');
    assert.lengthOf(root.querySelectorAll('.payment-method-skeleton-row'), 3);
    assert.lengthOf(root.querySelectorAll('.payment-method-skeleton-icon'), 3);
  });

  test('declares SDK v3 motion tokens and reduced-motion spinner overrides', () => {
    assert.include(primitiveStyles.cssText, '--chc-motion-fast: 120ms');
    assert.include(primitiveStyles.cssText, '--chc-motion-base: 180ms');
    assert.include(primitiveStyles.cssText, '--chc-motion-slow: 240ms');
    assert.include(primitiveStyles.cssText, '--chc-motion-provider: 300ms');
    assert.include(
      primitiveStyles.cssText,
      '--chc-ease-standard: cubic-bezier(0.2, 0, 0, 1)'
    );
    assert.include(
      primitiveStyles.cssText,
      '--chc-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1)'
    );
    assert.include(primitiveStyles.cssText, '@keyframes chc-spinner-rotate');
    assert.include(primitiveStyles.cssText, 'animation: none');
    assert.include(primitiveStyles.cssText, 'transform: none');
  });

  test('renders OTP inputs with inherited typography and compact SDK v3 sizing', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .interactionResponse=${{
          interactionId: 'interaction-otp',
          status: 'OTP_VALIDATION_PENDING',
          email: 'gregory.jablonski@fiserv.com',
        }}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    const otpInput =
      el.shadowRoot!.querySelector<HTMLInputElement>('.otp-input')!;
    const otpInputStyles = getComputedStyle(otpInput);

    assert.equal(otpInputStyles.fontWeight, '400');
    assert.equal(otpInputStyles.fontSize, '16px');
    assert.equal(otpInputStyles.minHeight, '40px');
    assert.equal(otpInputStyles.borderRadius, '10px');
  });

  test('renders SDK v3 payment method, source action, and detail primitives with disabled state semantics', async () => {
    const method: PaymentMethod = {
      id: 'bank-1',
      label: 'James Anderson',
      type: 'bank',
      brand: 'Checking',
      last4: '1234',
      status: 'verified',
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
    assert.notExists(row?.querySelector('.payment-method-radio'));
    assert.notExists(
      row?.querySelector('[data-action="verify-payment-source"]')
    );
    assert.equal(
      root.querySelector('.payment-method-title')?.textContent?.trim(),
      'James Anderson'
    );
    assert.equal(
      root.querySelector('.payment-method-meta')?.textContent?.trim(),
      'Checking •••• 1234'
    );
    assert.exists(root.querySelector('.payment-method-title-row'));
    assert.exists(root.querySelector('.payment-method-meta-row'));
    assert.notExists(root.querySelector('.payment-method-status'));
    assert.notExists(root.querySelector('.verification-status-icon'));
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
    assert.exists(
      root.querySelector('[data-action="add-card"] .source-action-link-chevron')
    );
    assert.notExists(
      root.querySelector(
        '[data-action="add-card"] .source-action-link-subtitle'
      )
    );
    assert.deepEqual(
      [...root.querySelectorAll('.detail-label')].map((item) =>
        item.textContent?.trim()
      ),
      ['Account holder name', 'Last 4 digits']
    );
    assert.exists(root.querySelector('.detail-list-compact'));
  });

  test('renders non-verified payment methods with a trailing warning icon and chevron', async () => {
    const method: PaymentMethod = {
      id: 'bank-1',
      label: 'Operating account',
      type: 'bank',
      brand: 'Commerce National Bank',
      last4: '3210',
      status: 'not-verified',
    };

    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderPaymentMethodRow(method)}
    `);

    const row = root.querySelector<HTMLButtonElement>('.payment-method-row')!;
    const chevron = row.querySelector<HTMLElement>('.payment-method-chevron')!;
    const copy = row.querySelector<HTMLElement>('.payment-method-copy')!;
    const metaRow = row.querySelector<HTMLElement>('.payment-method-meta-row')!;
    const statusIcon = row.querySelector<HTMLElement>(
      '.payment-method-status-icon-warning'
    )!;

    assert.equal(
      row.querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      row.querySelector('.payment-method-meta')?.textContent?.trim(),
      'Commerce National Bank •••• 3210'
    );
    assert.equal(row.tagName, 'BUTTON');
    assert.equal(row.dataset.action, 'verify-payment-source');
    assert.equal(row.dataset.paymentMethodId, 'bank-1');
    assert.notExists(row.querySelector('.payment-method-radio'));
    assert.notExists(row.querySelector('.payment-method-status'));
    assert.notExists(row.querySelector('.verification-status-badge'));
    assert.exists(row.querySelector('.payment-method-title-row'));
    assert.exists(metaRow);
    assert.exists(statusIcon);
    assert.equal(statusIcon.getAttribute('aria-label'), 'Not verified yet');
    assert.equal(getComputedStyle(copy).rowGap, '4px');
    assert.equal(
      getComputedStyle(row.querySelector<HTMLElement>('.payment-method-title')!)
        .display,
      'block'
    );
    assert.equal(
      getComputedStyle(row.querySelector<HTMLElement>('.payment-method-meta')!)
        .display,
      'block'
    );
    assert.equal(getComputedStyle(metaRow).justifyContent, 'flex-start');
    assert.exists(chevron);
    assert.equal(row.disabled, false);
  });

  test('renders declined payment methods with a trailing danger icon and chevron', async () => {
    const method: PaymentMethod = {
      id: 'card-2',
      label: 'Travel card',
      type: 'card',
      brand: 'Amex',
      last4: '1005',
      status: 'declined',
    };

    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderPaymentMethodRow(method)}
    `);

    const row = root.querySelector<HTMLButtonElement>('.payment-method-row')!;
    const statusIcon = row.querySelector<HTMLElement>(
      '.payment-method-status-icon-danger'
    )!;

    assert.notExists(row.querySelector('.payment-method-status'));
    assert.notExists(row.querySelector('.verification-status-badge'));
    assert.exists(statusIcon);
    assert.equal(statusIcon.getAttribute('aria-label'), 'Declined');
    assert.exists(row.querySelector('.payment-method-chevron'));
  });

  test('renders edit-mode delete controls with a 44px touch target', async () => {
    const method: PaymentMethod = {
      id: 'card-1',
      label: 'Corporate Visa',
      type: 'card',
      brand: 'Visa',
      last4: '1111',
      status: 'verified',
    };

    const root = await renderHarness(
      html`
        <style>
          ${primitiveStyles.cssText}
        </style>
        ${renderPaymentMethodRow(method, {variant: 'edit'})}
      `
    );

    const deleteButton = root.querySelector<HTMLButtonElement>(
      '[data-action="delete-payment-source"]'
    )!;
    const deleteIcon = deleteButton.querySelector<HTMLElement>(
      '.payment-method-delete-icon'
    )!;
    const deleteButtonStyles = getComputedStyle(deleteButton);
    const deleteIconStyles = getComputedStyle(deleteIcon);

    assert.equal(deleteButtonStyles.width, '44px');
    assert.equal(deleteButtonStyles.height, '44px');
    assert.equal(deleteIconStyles.width, '20px');
    assert.equal(deleteIconStyles.height, '20px');
    assert.notExists(root.querySelector('.payment-method-status'));
    assert.notExists(root.querySelector('.verification-status-icon'));
  });

  test('keeps edit-mode rows focused on delete actions without inline verification badges', async () => {
    const method: PaymentMethod = {
      id: 'bank-1',
      label: 'Operating account',
      type: 'bank',
      brand: 'Commerce National Bank',
      last4: '3210',
      status: 'under-review',
    };

    const root = await renderHarness(
      html`
        <style>
          ${primitiveStyles.cssText}
        </style>
        ${renderPaymentMethodRow(method, {variant: 'edit'})}
      `
    );

    assert.equal(
      root.querySelector('.payment-method-meta')?.textContent?.trim(),
      'Commerce National Bank •••• 3210'
    );
    assert.exists(root.querySelector('.payment-method-title-row'));
    assert.exists(root.querySelector('.payment-method-meta-row'));
    assert.exists(root.querySelector('[data-action="delete-payment-source"]'));
    assert.notExists(root.querySelector('.payment-method-status'));
    assert.notExists(root.querySelector('.verification-status-badge'));
    assert.notExists(root.querySelector('.payment-method-status-icon'));
    assert.notExists(root.querySelector('.payment-method-chevron'));
  });

  test('renders a selected payment method summary without radio or chevron controls', async () => {
    const method: PaymentMethod = {
      id: 'card-1',
      label: 'Corporate Visa',
      type: 'card',
      brand: 'Visa',
      last4: '1111',
      status: 'verified',
    };

    const root = await renderHarness(
      html`${renderSelectedPaymentMethod(method)}`
    );

    const selectedMethod = root.querySelector<HTMLElement>(
      '.selected-payment-method'
    )!;

    assert.equal(
      selectedMethod
        .querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Corporate Visa'
    );
    assert.equal(
      selectedMethod.querySelector('.payment-method-meta')?.textContent?.trim(),
      'Visa •••• 1111'
    );
    assert.exists(selectedMethod.querySelector('.payment-method-title-row'));
    assert.exists(selectedMethod.querySelector('.payment-method-meta-row'));
    assert.notExists(selectedMethod.querySelector('.payment-method-status'));
    assert.notExists(selectedMethod.querySelector('.verification-status-icon'));
    assert.notExists(selectedMethod.querySelector('.payment-method-radio'));
    assert.notExists(
      selectedMethod.querySelector('[data-action="verify-payment-source"]')
    );
  });

  test('renders card-form fields with labels outside the control chrome', async () => {
    const root = await renderHarness(html`
      ${renderTextField({
        id: 'card-label',
        label: 'Card Name',
        variant: 'card-form',
      })}
      ${renderSelectField({
        id: 'billing-country',
        label: 'Country or region',
        options: [{value: 'US', label: 'United States'}],
        variant: 'card-form',
      })}
    `);

    const textField = root.querySelector('#card-label')?.closest('.field');
    const textLabel = textField?.querySelector('.field-label-card-form');
    const textControl = textField?.querySelector('.field-control-card-form');
    const selectField = root
      .querySelector('#billing-country')
      ?.closest('.field');
    const selectLabel = selectField?.querySelector('.field-label-card-form');
    const selectControl = selectField?.querySelector(
      '.field-control-card-form'
    );

    assert.exists(textControl);
    assert.equal(textControl?.contains(textLabel ?? null), false);
    assert.exists(textControl?.querySelector('input#card-label'));
    assert.exists(selectControl);
    assert.equal(selectControl?.contains(selectLabel ?? null), false);
    assert.exists(selectControl?.querySelector('select#billing-country'));
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
