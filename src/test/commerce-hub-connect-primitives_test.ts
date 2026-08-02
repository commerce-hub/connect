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
import {renderOtpScreen} from '../internal/screens/otp-screen.js';
import {
  renderNoSavedPaymentMethodsScreen,
  renderPaymentMethodsScreen,
  renderPaymentMethodsSkeletonScreen,
} from '../internal/screens/payment-methods-screen.js';
import {
  resolvePaymentMethodIconDataUri,
  resolvePaymentMethodIconName,
} from '../internal/payment-method-icons.js';
import {primitiveStyles} from '../internal/styles.js';
import type {PaymentMethod} from '../internal/types.js';

class PrimitiveHarness extends HTMLElement {
  readonly shadow = this.attachShadow({mode: 'open'});

  render(template: TemplateResult | typeof nothing) {
    import('lit').then(({render}) => render(template, this.shadow));
  }
}

customElements.define('primitive-harness', PrimitiveHarness);

const TEST_INTERACTION_FEATURES: NonNullable<InteractionResponse['features']> =
  ['ADD_ACCOUNT', 'SELECT', 'TRANSFER'];

const createStyleInteractionResponse = (): InteractionResponse => ({
  status: 'PAYMENT_SOURCE_REQUESTED',
  features: [...TEST_INTERACTION_FEATURES],
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
  ],
});

const renderHarness = async (template: TemplateResult) => {
  const el = (await fixture(
    testingHtml`<primitive-harness></primitive-harness>`
  )) as PrimitiveHarness;
  el.render(template);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  return el.shadow;
};

const decodeSvgDataUri = (dataUri: string): string =>
  decodeURIComponent(dataUri.replace('data:image/svg+xml;utf8,', ''));

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

  test('visually distinguishes disabled config-driven bank fields', () => {
    assert.include(
      primitiveStyles.cssText,
      '.bank-account-jsonforms .jsonforms-control input:disabled'
    );
    assert.include(primitiveStyles.cssText, 'background: color-mix(');
    assert.include(primitiveStyles.cssText, 'var(--chc-soft-surface) 85%');
    assert.include(primitiveStyles.cssText, 'var(--chc-border-strong)');
    assert.include(primitiveStyles.cssText, 'color: var(--chc-muted)');
    assert.include(primitiveStyles.cssText, 'cursor: not-allowed');
    assert.include(primitiveStyles.cssText, 'opacity: 1');
  });

  test('uses the POC typography hierarchy for headings, controls, and rows', () => {
    const hardCodedFontWeights =
      primitiveStyles.cssText.match(
        /(^|[^-])font-weight\s*:\s*(?:[0-9]+|bold|normal|bolder|lighter)/g
      ) ?? [];

    assert.notInclude(primitiveStyles.cssText, 'font: inherit');
    assert.isAtLeast(hardCodedFontWeights.length, 6);
    assert.isTrue(
      hardCodedFontWeights.every((declaration) =>
        ['font-weight: 400', 'font-weight: 600'].includes(declaration.trim())
      )
    );
    assert.include(
      primitiveStyles.cssText,
      '.widget-toolbar .text-link-button'
    );
    assert.include(primitiveStyles.cssText, '.add-payment-sheet-option');
  });

  test('uses rem units in shared styles instead of px sizing tokens', () => {
    assert.notInclude(primitiveStyles.cssText, 'px');
  });

  test('renders documented public styling parts for stable surfaces', async () => {
    const root = await renderHarness(
      renderWidgetShell({
        title: 'Pay with',
        showClose: false,
        content: html`
          ${renderAlert({variant: 'warning', message: 'Review payment method'})}
          ${renderPaymentMethodRow({
            id: 'card-1',
            label: 'Corporate card',
            status: 'verified',
            type: 'card',
            brand: 'Visa',
            last4: '4242',
          })}
          ${renderProviderFrame({
            containerId: 'provider-container',
            title: 'Connect your bank',
            loadingLabel: 'Loading provider',
          })}
        `,
        footer: renderButton({
          label: 'Continue',
          variant: 'primary',
          action: 'continue',
        }),
      })
    );

    const expectedParts = [
      'shell',
      'header',
      'title',
      'content',
      'footer',
      'alert',
      'payment-method-row',
      'provider-frame',
      'primary-action',
    ];

    for (const part of expectedParts) {
      assert.exists(root.querySelector(`[part~="${part}"]`), part);
    }
  });

  test('declares a hover affordance for clickable source action links', () => {
    assert.include(primitiveStyles.cssText, '.source-action-link:hover');
  });

  test('renders payment method logos in POC-style icon tiles', async () => {
    const interactionResponse: InteractionResponse = {
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: [...TEST_INTERACTION_FEATURES],
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
      ],
    };
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .interactionResponse=${interactionResponse}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    const chip = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-icon-chip'
    )!;
    const image = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-icon-image'
    )!;
    const chipStyle = getComputedStyle(chip);
    const imageStyle = getComputedStyle(image);

    assert.equal(chipStyle.paddingTop, '0px');
    assert.equal(chipStyle.borderTopStyle, 'solid');
    assert.equal(chipStyle.backgroundColor, 'rgb(248, 250, 253)');
    assert.equal(chipStyle.width, '38px');
    assert.equal(chipStyle.height, '38px');
    assert.equal(imageStyle.width, '22px');
    assert.equal(imageStyle.height, '22px');
  });

  test('renders the framed shell with row actions and an explicit add footer', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .interactionResponse=${createStyleInteractionResponse()}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;
    const title = el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!;
    const paymentTitle = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-title'
    )!;
    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const content =
      el.shadowRoot!.querySelector<HTMLElement>('.widget-content')!;
    const addFooter = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-add-footer'
    )!;

    assert.equal(
      getComputedStyle(el)
        .getPropertyValue('--chc-primary')
        .trim()
        .toUpperCase(),
      '#533AFD'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-text').trim().toUpperCase(),
      '#061B31'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-copy').trim().toUpperCase(),
      '#50617A'
    );
    assert.equal(
      getComputedStyle(el).fontFamily.includes('SF Pro Display'),
      true
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-font-weight').trim(),
      '400'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-label'),
      'Commerce Hub Connect'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.equal(getComputedStyle(shell).width, '386px');
    assert.equal(getComputedStyle(shell).height, '564px');
    assert.equal(getComputedStyle(shell).borderTopStyle, 'solid');
    assert.equal(getComputedStyle(shell).borderRadius, '8px');
    assert.notEqual(getComputedStyle(shell).boxShadow, 'none');
    assert.equal(getComputedStyle(content).maxWidth, 'none');
    assert.equal(getComputedStyle(content).overflowY, 'hidden');
    assert.closeTo(parseFloat(getComputedStyle(title).fontSize), 22, 0.01);
    assert.equal(getComputedStyle(title).fontWeight, '600');
    assert.equal(getComputedStyle(paymentTitle).fontWeight, '600');
    assert.notExists(el.shadowRoot!.querySelector('.widget-header-action'));
    assert.deepEqual(
      [...addFooter.querySelectorAll('button')].map((button) => [
        button.dataset.action,
        button.textContent?.trim(),
      ]),
      [
        ['attach-payment-source', 'Use selected method'],
        ['open-add-payment-source', 'Add payment method'],
      ]
    );
    assert.exists(el.shadowRoot!.querySelector('.widget-action-footer'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '[data-action="toggle-payment-source-menu"]'
      ),
      1
    );
    assert.notExists(el.shadowRoot!.querySelector('.powered-by-footer'));
  });

  test('applies the prototype shell shadow without adding button shadows', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .interactionResponse=${createStyleInteractionResponse()}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const buttonShadowSelectors =
      primitiveStyles.cssText.match(
        /[^{}]*button[^{}]*\{[^{}]*box-shadow\s*:/g
      ) ?? [];

    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderButton({
        label: 'Continue',
        variant: 'primary',
        action: 'continue',
      })}
      ${renderButton({label: 'Back', variant: 'secondary', action: 'back'})}
    `);
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const primaryButton = root.querySelector<HTMLElement>(
      'button.button-primary'
    )!;
    const secondaryButton = root.querySelector<HTMLElement>(
      'button.button-secondary'
    )!;

    assert.notEqual(getComputedStyle(shell).boxShadow, 'none');
    assert.equal(getComputedStyle(primaryButton).boxShadow, 'none');
    assert.equal(getComputedStyle(secondaryButton).boxShadow, 'none');
    assert.deepEqual(buttonShadowSelectors, []);
  });

  test('left-aligns widget subtitle text within the framed header', async () => {
    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderWidgetShell({
        title: 'Enter verification code',
        subtitle: 'We sent a one-time code to your email.',
        showClose: false,
        content: html`<span>Code form</span>`,
      })}
    `);
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const subtitle = root.querySelector<HTMLElement>('.widget-subtitle')!;

    assert.equal(getComputedStyle(subtitle).textAlign, 'left');
  });

  test('applies partial designConfig tokens while retaining framed control sizing', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .interactionResponse=${createStyleInteractionResponse()}
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
    const paymentTitle = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-title'
    )!;
    const addButton = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-add-footer .button'
    )!;
    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const overflowButton = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-overflow-button'
    )!;

    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-primary').trim(),
      '#0f766e'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-font-weight').trim(),
      '350'
    );
    assert.closeTo(parseFloat(getComputedStyle(title).fontSize), 22, 0.01);
    assert.equal(getComputedStyle(title).fontWeight, '600');
    assert.equal(getComputedStyle(paymentTitle).fontWeight, '600');
    assert.equal(getComputedStyle(paymentTitle).fontSize, '14px');
    assert.equal(getComputedStyle(addButton).fontSize, '13px');
    assert.equal(getComputedStyle(addButton).minHeight, '40px');
    assert.equal(getComputedStyle(addButton).paddingTop, '0px');
    assert.equal(getComputedStyle(addButton).paddingBottom, '0px');
    assert.equal(getComputedStyle(addButton).fontWeight, '600');
    assert.equal(getComputedStyle(overflowButton).width, '44px');
    assert.equal(getComputedStyle(overflowButton).height, '44px');
    assert.equal(getComputedStyle(shell).backgroundColor, 'rgb(244, 247, 251)');
    assert.equal(getComputedStyle(shell).paddingTop, '32px');
    assert.equal(getComputedStyle(shell).paddingRight, '20px');
    assert.equal(getComputedStyle(shell).paddingBottom, '16px');
    assert.equal(getComputedStyle(shell).paddingLeft, '20px');
    assert.notExists(el.shadowRoot!.querySelector('.powered-by-footer'));
  });

  test('renders payment sources from an interaction response input', async () => {
    const interactionResponse: InteractionResponse = {
      features: [...TEST_INTERACTION_FEATURES],
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
        {
          tenderType: 'NativeAccount',
          id: 'native-account-1',
          verificationInfo: {status: 'VERIFIED'},
          account: {
            positionId: 'commerce-native-7890',
            nickName: 'Commerce wallet',
            productType: 'Wallet',
            token: 'native-token-1',
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
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ];

    assert.deepEqual(
      rows.map((row) => row.dataset.paymentMethodId),
      ['card-1', 'bank-1', 'native-account-1']
    );
    assert.equal(
      rows[0].querySelector('.payment-method-title')?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      rows[0].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Visa ending 4242'
    );
    assert.exists(rows[0].querySelector('.payment-method-radio'));
    assert.notExists(rows[0].querySelector('.payment-method-default-label'));
    assert.exists(
      rows[0].querySelector('[data-action="toggle-payment-source-menu"]')
    );
    assert.exists(rows[0].querySelector('[data-payment-method-icon="visa"]'));
    assert.equal(
      getComputedStyle(
        rows[0].querySelector<HTMLElement>('.payment-method-icon-chip')!
      ).borderTopStyle,
      'solid'
    );
    assert.exists(rows[0].querySelector('.payment-method-title-row'));
    assert.exists(rows[0].querySelector('.payment-method-meta-row'));
    assert.notExists(rows[0].querySelector('.payment-method-status'));
    assert.notExists(rows[0].querySelector('.verification-status-icon'));
    assert.equal(
      rows[0].querySelector('.verification-status-badge')?.textContent?.trim(),
      'Verified & Provisioned'
    );
    assert.notExists(rows[0].querySelector('.payment-method-chevron'));
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      rows[1].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Bank account ending 3210'
    );
    assert.exists(rows[1].querySelector('.payment-method-title-row'));
    assert.exists(rows[1].querySelector('.payment-method-meta-row'));
    assert.notExists(rows[1].querySelector('.payment-method-status'));
    assert.equal(
      rows[1].querySelector('.verification-status-badge')?.textContent?.trim(),
      'Needs review'
    );
    assert.notExists(rows[1].querySelector('.payment-method-status-icon'));
    assert.notExists(rows[1].querySelector('.payment-method-chevron'));
    assert.exists(rows[1].querySelector('[data-payment-method-icon="bank"]'));
    assert.notExists(rows[1].querySelector('.payment-method-radio'));
    assert.equal(rows[1].dataset.action, undefined);
    assert.equal(
      rows[2].querySelector('.payment-method-title')?.textContent?.trim(),
      'Commerce wallet'
    );
    assert.equal(
      rows[2].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Wallet ending 7890'
    );
    assert.exists(rows[2].querySelector('[data-payment-method-icon="native"]'));
    assert.exists(rows[2].querySelector('.payment-method-radio'));
    assert.exists(
      rows[2].querySelector('[data-action="toggle-payment-source-menu"]')
    );
  });

  test('maps card brands to credit-card-payment-icons logo assets', () => {
    const cases: Array<[string, string]> = [
      ['Visa', 'visa'],
      ['Mastercard', 'mastercard'],
      ['MasterCard', 'mastercard'],
      ['MC', 'mastercard'],
      ['AmericanExpress', 'amex'],
      ['American Express', 'amex'],
      ['AMEX', 'amex'],
      ['Discover', 'discover'],
      ['DinersClub', 'diners'],
      ['Diners Club', 'diners'],
      ['JCB', 'jcb'],
      ['UnionPay', 'unionpay'],
      ['Union Pay', 'unionpay'],
      ['Maestro', 'maestro'],
      ['Elo', 'elo'],
      ['Hiper', 'hiper'],
      ['Hipercard', 'hipercard'],
      ['Mir', 'mir'],
      ['PayPal', 'paypal'],
      ['Alipay', 'alipay'],
    ];

    for (const [brand, iconName] of cases) {
      const method = {type: 'card', brand} as const;

      assert.equal(resolvePaymentMethodIconName(method), iconName);
      assert.include(
        decodeSvgDataUri(resolvePaymentMethodIconDataUri(method)),
        '<svg'
      );
      assert.notEqual(resolvePaymentMethodIconName(method), 'generic');
    }

    const unknownCard = {type: 'card', brand: 'Unknown Network'} as const;
    assert.equal(resolvePaymentMethodIconName(unknownCard), 'generic');
    assert.include(
      decodeSvgDataUri(resolvePaymentMethodIconDataUri(unknownCard)),
      'viewBox="0 0 780 500"'
    );

    const nativeAccount = {type: 'native', brand: 'Native account'} as const;
    assert.equal(resolvePaymentMethodIconName(nativeAccount), 'native');
    assert.include(
      decodeSvgDataUri(resolvePaymentMethodIconDataUri(nativeAccount)),
      'viewBox="0 0 24 24"'
    );
  });

  test('uses the bank name as the payment-method title when a bank source name is missing', async () => {
    const interactionResponse: InteractionResponse = {
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: [...TEST_INTERACTION_FEATURES],
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
      'Bank account ending 3210'
    );
  });

  test('uses the bank name as the payment-method title when a bank source name is blank', async () => {
    const interactionResponse: InteractionResponse = {
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: [...TEST_INTERACTION_FEATURES],
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
      'Bank account ending 3210'
    );
  });

  test('does not emit onSelect when interaction response changes', async () => {
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

    el.addEventListener('onSelect', (event) => {
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
        value: 'shopper@example.com',
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
      ${renderStatusPill({status: 'unverified'})}
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
      'shopper@example.com'
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
    assert.notExists(root.querySelector('[role="alert"] .alert-icon'));
    assert.equal(
      root.querySelector('.upload-row-label')?.textContent?.trim(),
      'Bank statement'
    );
    assert.equal(
      root.querySelector('.upload-row-action')?.textContent?.trim(),
      'Upload file'
    );
    assert.equal(
      root.querySelector('.upload-row-file-name')?.textContent?.trim(),
      'No file chosen'
    );
    assert.equal(
      root.querySelector('.loading-row-title')?.textContent?.trim(),
      'Verifying code'
    );
    assert.equal(
      root.querySelector('.status-pill')?.textContent?.trim(),
      'Unverified'
    );
    assert.notExists(root.querySelector('.powered-by-footer'));
  });

  test('renders alert variants without icons', async () => {
    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderAlert({
        variant: 'success',
        message: 'Verified.',
      })}
      ${renderAlert({
        variant: 'warning',
        message: 'Under review.',
      })}
      ${renderAlert({
        variant: 'danger',
        message: 'Declined.',
      })}
    `);
    assert.lengthOf(root.querySelectorAll('.alert'), 3);
    assert.notExists(root.querySelector('.alert-icon'));
    assert.deepEqual(
      [...root.querySelectorAll('.alert-message')].map((node) =>
        node.textContent?.trim()
      ),
      ['Verified.', 'Under review.', 'Declined.']
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
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderWidgetShell({
        title: 'Add card',
        busy: true,
        overlay: html`
          <div class="widget-loading-status" role="status" aria-live="polite">
            <span class="widget-loading-animation" aria-hidden="true">
              <span class="widget-loading-animation-dot"></span>
              <span class="widget-loading-animation-dot"></span>
              <span class="widget-loading-animation-dot"></span>
            </span>
            <span class="widget-loading-copy">
              <span class="widget-loading-title">Saving payment method</span>
              <span class="widget-loading-helper"
                >Securely saving your card, please wait.</span
              >
            </span>
          </div>
        `,
        content: html`<button class="retained-control">Retained</button>`,
      })}
    `);

    const shell = root.querySelector<HTMLElement>('.widget-shell')!;
    const overlay = root.querySelector<HTMLElement>('.widget-loading-overlay')!;

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
    assert.exists(root.querySelector('.widget-loading-animation'));
    assert.equal(
      getComputedStyle(overlay).backgroundColor,
      'rgb(255, 255, 255)'
    );
    assert.equal(getComputedStyle(overlay).opacity, '1');
    assert.notExists(
      root.querySelector('.widget-loading-overlay .loading-spinner')
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
      getComputedStyle(overlay).backgroundColor,
      'rgb(255, 255, 255)'
    );
    assert.equal(getComputedStyle(overlay).opacity, '1');
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

  test('renders the internal OTP form with failed, submit, and resend states', async () => {
    const root = await renderHarness(html`
      ${renderOtpScreen({
        status: 'OTP_VALIDATION_FAILED',
        value: '12345',
        length: 6,
        failedMessage: 'That code expired.',
        copy: {
          title: 'Enter verification code',
          failedMessage: 'The code does not match. Try again.',
          resendPrefix: "Didn't receive the code?",
          resendButton: 'Resend code',
          resendPendingButton: 'Sending code...',
          verifyButton: 'Verify',
          verifyingButton: 'Verifying...',
          tryAgainButton: 'Try again',
        },
        resending: true,
      })}
    `);

    assert.equal(
      root.querySelector('[role="alert"]')?.textContent?.trim(),
      'That code expired.'
    );
    assert.lengthOf(root.querySelectorAll('.otp-input'), 6);
    const form = root.querySelector<HTMLFormElement>(
      'form[data-submit-action="verify-otp"]'
    )!;
    const submitButton = form.querySelector<HTMLButtonElement>(
      'button[type="submit"][data-action="verify-otp"]'
    )!;
    assert.exists(form);
    assert.exists(submitButton);
    assert.equal(submitButton.disabled, true);
    assert.equal(
      root.querySelector('[data-action="resend-otp"]')?.textContent?.trim(),
      'Sending code...'
    );
  });

  test('renders internal payment-method screen modules for loading, list, delete-ready, and empty states', async () => {
    const method: PaymentMethod = {
      id: 'card-1',
      label: 'Corporate Visa',
      accountLabel: '•••• 1111',
      type: 'card',
      brand: 'Visa',
      last4: '1111',
      status: 'verified',
    };
    const copy = {
      title: 'Pay with',
      subtitle: '',
      addBankAccountTitle: 'Add bank account',
      addBankAccountSubtitle: 'Connect a bank',
      addCardTitle: 'Add credit or debit card',
      addCardSubtitle: 'Use a card',
      continueButton: 'Confirm',
      continuingButton: 'Confirming...',
    };
    const root = await renderHarness(html`
      <div data-screen="loading">${renderPaymentMethodsSkeletonScreen()}</div>
      <div data-screen="list">
        ${renderPaymentMethodsScreen({
          status: 'PAYMENT_SOURCE_REQUESTED',
          methods: [method],
          allowedTenderOptions: {
            card: true,
            bankAccount: true,
            nativeAccount: false,
          },
          canAddPaymentSources: true,
          canSelectPaymentSources: true,
          actionPending: false,
          selectedPaymentSourceId: 'card-1',
          openPaymentSourceMenuId: 'card-1',
          copy,
          showTransferAction: true,
        })}
      </div>
      <div data-screen="delete-ready">
        ${renderPaymentMethodsScreen({
          status: 'PAYMENT_SOURCE_REQUESTED',
          methods: [method],
          allowedTenderOptions: {
            card: true,
            bankAccount: true,
            nativeAccount: false,
          },
          canAddPaymentSources: true,
          canSelectPaymentSources: true,
          actionPending: false,
          deleteConfirmationPaymentSourceId: 'card-1',
          copy,
        })}
      </div>
      <div data-screen="empty">
        ${renderNoSavedPaymentMethodsScreen({
          allowedTenderOptions: {
            card: true,
            bankAccount: true,
            nativeAccount: false,
          },
          canAddPaymentSources: true,
          copy: {
            title: 'Add payment method',
            subtitle: '',
            emptyTitle: 'No saved methods',
            emptyMessage: 'Add a payment method to keep going.',
            addBankAccountTitle: 'Connect bank',
            addBankAccountSubtitle: 'Use your account',
            addCardTitle: 'Add card',
            addCardSubtitle: 'Use card details',
          },
        })}
      </div>
    `);

    const listScreen = root.querySelector<HTMLElement>('[data-screen="list"]')!;
    const deleteReadyScreen = root.querySelector<HTMLElement>(
      '[data-screen="delete-ready"]'
    )!;
    const emptyScreen = root.querySelector<HTMLElement>(
      '[data-screen="empty"]'
    )!;

    assert.exists(
      root.querySelector('[data-screen="loading"] .payment-method-skeletons')
    );
    assert.exists(listScreen.querySelector('[role="menu"]'));
    assert.exists(listScreen.querySelector('.payment-method-radio:checked'));
    assert.notExists(listScreen.querySelector('.payment-action-links'));
    const emptySourceActions = [
      ...emptyScreen.querySelectorAll<HTMLButtonElement>(
        '.payment-action-links .source-action'
      ),
    ];
    assert.deepEqual(
      emptySourceActions.map((button) => ({
        action: button.dataset.action,
        title: button
          .querySelector('.source-action-title')
          ?.textContent?.trim(),
        subtitle: button
          .querySelector('.source-action-subtitle')
          ?.textContent?.trim(),
      })),
      [
        {
          action: 'add-card',
          title: 'Add card',
          subtitle: 'Use card details',
        },
        {
          action: 'add-bank-account',
          title: 'Connect bank',
          subtitle: 'Use your account',
        },
      ]
    );
    assert.exists(
      emptySourceActions[0].querySelector(
        '[data-source-action-icon="card"][aria-hidden="true"]'
      )
    );
    assert.exists(
      emptySourceActions[1].querySelector(
        '[data-source-action-icon="bank"][aria-hidden="true"]'
      )
    );
    emptySourceActions.forEach((button) => {
      const svg = button.querySelector('svg')!;

      assert.equal(svg.getAttribute('viewBox'), '0 0 640 640');
      assert.equal(svg.getAttribute('focusable'), 'false');
    });
    assert.notExists(emptyScreen.querySelector('.source-action-link-chevron'));
    assert.notExists(
      deleteReadyScreen.querySelector('.payment-method-delete-confirmation')
    );
    assert.exists(
      deleteReadyScreen.querySelector(
        '[data-action="delete-payment-source"] .payment-method-delete-action-icon'
      )
    );
    assert.equal(
      emptyScreen.querySelector('.empty-state-message')?.textContent?.trim(),
      'Add a payment method to keep going.'
    );
  });

  test('opens payment-method screen menu styling only for actionable non-default rows', async () => {
    const methods: PaymentMethod[] = [
      {
        id: 'card-default',
        label: 'Default card',
        brand: 'Visa',
        last4: '1111',
        status: 'verified',
        isDefault: true,
      },
      {
        id: 'card-other',
        label: 'Other card',
        brand: 'Mastercard',
        last4: '2222',
        status: 'verified',
      },
    ];
    const copy = {
      title: 'Pay with',
      subtitle: '',
      addBankAccountTitle: 'Add bank account',
      addBankAccountSubtitle: 'Connect a bank',
      addCardTitle: 'Add credit or debit card',
      addCardSubtitle: 'Use a card',
      continueButton: 'Confirm',
      continuingButton: 'Confirming...',
    };
    const screenModel = {
      status: 'PAYMENT_SOURCE_REQUESTED' as const,
      methods,
      allowedTenderOptions: {
        card: true,
        bankAccount: true,
        nativeAccount: false,
      },
      canAddPaymentSources: true,
      canSelectPaymentSources: true,
      actionPending: false,
      copy,
    };
    const root = await renderHarness(html`
      <div data-screen="stale-default">
        ${renderPaymentMethodsScreen({
          ...screenModel,
          openPaymentSourceMenuId: 'card-default',
        })}
      </div>
      <div data-screen="open-non-default">
        ${renderPaymentMethodsScreen({
          ...screenModel,
          openPaymentSourceMenuId: 'card-other',
        })}
      </div>
    `);
    const staleDefaultStack = root.querySelector<HTMLElement>(
      '[data-screen="stale-default"] .primitive-stack'
    )!;
    const openNonDefaultStack = root.querySelector<HTMLElement>(
      '[data-screen="open-non-default"] .primitive-stack'
    )!;

    assert.isFalse(
      staleDefaultStack.classList.contains('primitive-stack-menu-open')
    );
    assert.notExists(staleDefaultStack.querySelector('[role="menu"]'));
    assert.isTrue(
      openNonDefaultStack.classList.contains('primitive-stack-menu-open')
    );
    assert.exists(openNonDefaultStack.querySelector('[role="menu"]'));
  });

  test('declares framed-shell motion, narrow-layout, and reduced-motion overrides', () => {
    assert.include(primitiveStyles.cssText, '--chc-motion-fast: 150ms');
    assert.include(primitiveStyles.cssText, '--chc-motion-base: 220ms');
    assert.include(primitiveStyles.cssText, '--chc-motion-slow: 260ms');
    assert.include(primitiveStyles.cssText, '--chc-motion-sheet: 300ms');
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
    assert.include(primitiveStyles.cssText, '@keyframes chc-loading-dot');
    assert.include(primitiveStyles.cssText, '@keyframes chc-shell-enter');
    assert.include(primitiveStyles.cssText, '@keyframes chc-sheet-enter');
    assert.include(
      primitiveStyles.cssText,
      'animation: chc-sheet-enter var(--chc-motion-sheet)'
    );
    assert.include(primitiveStyles.cssText, 'transform: translateY(100%)');
    assert.include(primitiveStyles.cssText, '@media (max-width: 26.25rem)');
    assert.include(primitiveStyles.cssText, 'width: calc(100vw - 1rem)');
    assert.include(
      primitiveStyles.cssText,
      '@media (prefers-reduced-motion: reduce)'
    );
    assert.include(primitiveStyles.cssText, 'animation: none');
    assert.include(primitiveStyles.cssText, 'transform: none');
  });

  test('renders OTP inputs with inherited typography and compact SDK v3 sizing', async () => {
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .interactionResponse=${{
          interactionId: 'interaction-otp',
          status: 'OTP_VALIDATION_PENDING',
          email: 'shopper@example.com',
        }}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;

    await el.updateComplete;

    const otpInput =
      el.shadowRoot!.querySelector<HTMLInputElement>('.otp-input')!;
    const otpInputStyles = getComputedStyle(otpInput);

    assert.equal(otpInputStyles.fontWeight, '400');
    assert.equal(otpInputStyles.fontSize, '16px');
    assert.equal(otpInputStyles.minHeight, '44px');
    assert.equal(otpInputStyles.borderRadius, '10px');
  });

  test('renders payment method, source action, and detail primitives with disabled state semantics', async () => {
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

    const row = root.querySelector<HTMLElement>(
      '[data-payment-method-id="bank-1"]'
    )!;
    const overflowButton = row.querySelector<HTMLButtonElement>(
      '[data-action="toggle-payment-source-menu"]'
    )!;
    assert.equal(row.tagName, 'DIV');
    assert.notExists(row.querySelector('.payment-method-radio'));
    assert.isTrue(overflowButton.disabled);
    assert.equal(
      overflowButton.getAttribute('aria-label'),
      'More actions for James Anderson'
    );
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

  test('renders non-verified payment methods as clickable action-required rows', async () => {
    const method: PaymentMethod = {
      id: 'bank-1',
      label: 'Operating account',
      accountLabel: '•••• 3210',
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

    const row = root.querySelector<HTMLElement>('.payment-method-row')!;
    const copy = row.querySelector<HTMLElement>('.payment-method-copy')!;
    const metaRow = row.querySelector<HTMLElement>('.payment-method-meta-row')!;
    const statusBadge = row.querySelector<HTMLElement>(
      '.verification-status-badge'
    )!;

    assert.equal(
      row.querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      row.querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 3210'
    );
    const verifyButton = row.querySelector<HTMLButtonElement>(
      '[data-action="verify-payment-source"]'
    )!;
    assert.equal(row.tagName, 'DIV');
    assert.equal(verifyButton.tagName, 'BUTTON');
    assert.equal(row.dataset.paymentMethodId, 'bank-1');
    assert.notExists(row.querySelector('.payment-method-radio'));
    assert.notExists(row.querySelector('.payment-method-status'));
    assert.exists(statusBadge);
    assert.exists(row.querySelector('.payment-method-title-row'));
    assert.exists(metaRow);
    assert.equal(statusBadge.textContent?.trim(), 'Action required');
    assert.equal(
      statusBadge.getAttribute('data-verification-status'),
      'not-verified'
    );
    assert.notExists(row.querySelector('.payment-method-status-icon'));
    assert.equal(getComputedStyle(copy).rowGap, '2px');
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
    assert.equal(getComputedStyle(metaRow).justifyContent, 'space-between');
    assert.exists(row.querySelector('.payment-method-chevron'));
  });

  test('renders require-info payment methods as clickable rows with a status badge', async () => {
    const method: PaymentMethod = {
      id: 'bank-1',
      label: 'Operating account',
      type: 'bank',
      brand: 'Commerce National Bank',
      last4: '3210',
      status: 'require-info',
    };

    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderPaymentMethodRow(method)}
    `);

    const row = root.querySelector<HTMLElement>('.payment-method-row')!;
    const verifyButton = row.querySelector<HTMLButtonElement>(
      '[data-action="verify-payment-source"]'
    )!;
    const statusBadge = row.querySelector<HTMLElement>(
      '.verification-status-badge'
    )!;

    assert.equal(row.tagName, 'DIV');
    assert.equal(verifyButton.tagName, 'BUTTON');
    assert.equal(row.dataset.paymentMethodId, 'bank-1');
    assert.equal(statusBadge.textContent?.trim(), 'Needs info');
    assert.equal(
      statusBadge.getAttribute('data-verification-status'),
      'require-info'
    );
    assert.notExists(row.querySelector('.payment-method-status-icon'));
    assert.exists(row.querySelector('.payment-method-chevron'));
    assert.equal(verifyButton.disabled, false);
  });

  test('uses explicit verified recipient presentation without a selection radio', async () => {
    const root = await renderHarness(
      renderPaymentMethodRow(
        {
          id: 'bank-recipient-pending',
          label: 'Pending recipient bank',
          brand: 'Bank account',
          last4: '3333',
          status: 'verified',
          verificationLabel: 'Verified',
          selectionEligible: false,
        },
        {selectable: true}
      )
    );

    assert.equal(
      root.querySelector('.verification-status-badge')?.textContent?.trim(),
      'Verified'
    );
    assert.notExists(root.querySelector('.payment-method-radio'));
  });

  test('keeps default labels while limiting overflow actions to non-default methods', async () => {
    const root = await renderHarness(html`
      ${renderPaymentMethodRow(
        {
          id: 'card-default',
          label: 'Default card',
          brand: 'Visa',
          last4: '1111',
          status: 'verified',
          isDefault: true,
        },
        {menuOpen: true, showMarkAsDefault: true}
      )}
      ${renderPaymentMethodRow(
        {
          id: 'card-other',
          label: 'Other card',
          brand: 'Mastercard',
          last4: '2222',
          status: 'verified',
        },
        {menuOpen: true, showMarkAsDefault: true}
      )}
      ${renderPaymentMethodRow(
        {
          id: 'card-default-confirming',
          label: 'Confirming default card',
          brand: 'Visa',
          last4: '3333',
          status: 'verified',
          isDefault: true,
        },
        {confirmingDelete: true, showMarkAsDefault: true}
      )}
    `);
    const defaultRow = root.querySelector<HTMLElement>(
      '[data-payment-method-id="card-default"]'
    )!;
    const otherRow = root.querySelector<HTMLElement>(
      '[data-payment-method-id="card-other"]'
    )!;
    const confirmingDefaultRow = root.querySelector<HTMLElement>(
      '[data-payment-method-id="card-default-confirming"]'
    )!;

    assert.equal(
      defaultRow.querySelector('.payment-method-default-label')?.textContent,
      'Default'
    );
    assert.notExists(
      defaultRow.querySelector('[data-action="toggle-payment-source-menu"]')
    );
    assert.notExists(
      defaultRow.querySelector('[data-action="delete-payment-source"]')
    );
    assert.notExists(defaultRow.querySelector('[role="menu"]'));
    assert.isFalse(
      defaultRow.classList.contains('payment-method-row-menu-open')
    );
    assert.exists(
      otherRow.querySelector('[data-action="toggle-payment-source-menu"]')
    );
    assert.equal(
      otherRow
        .querySelector('[data-action="mark-payment-source-default"]')
        ?.textContent?.trim(),
      'Mark as default'
    );
    assert.equal(
      otherRow
        .querySelector('[data-action="delete-payment-source"]')
        ?.textContent?.trim(),
      'Remove'
    );
    assert.exists(
      confirmingDefaultRow.querySelector('.payment-method-default-label')
    );
    assert.notExists(
      confirmingDefaultRow.querySelector(
        '[data-action="delete-payment-source"]'
      )
    );
  });

  test('keeps status badges beside titles regardless of trailing controls', async () => {
    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      <div style="width: 360px;">
        ${renderPaymentMethodRow({
          id: 'bank-1',
          label: 'Operating account',
          accountLabel: '•••• 3210',
          type: 'bank',
          brand: 'Commerce National Bank',
          last4: '3210',
          status: 'require-info',
        })}
        ${renderPaymentMethodRow({
          id: 'card-1',
          label: 'Travel card',
          accountLabel: '•••• 1005',
          type: 'card',
          brand: 'Amex',
          last4: '1005',
          status: 'declined',
        })}
      </div>
    `);

    const rows = [...root.querySelectorAll<HTMLElement>('.payment-method-row')];
    const clickableBadge = rows[0].querySelector<HTMLElement>(
      '.verification-status-badge'
    )!;
    const staticBadge = rows[1].querySelector<HTMLElement>(
      '.verification-status-badge'
    )!;

    assert.exists(rows[0].querySelector('.payment-method-chevron'));
    assert.notExists(rows[1].querySelector('.payment-method-chevron'));
    assert.equal(
      clickableBadge.parentElement?.classList.contains(
        'payment-method-title-row'
      ),
      true
    );
    assert.equal(
      staticBadge.parentElement?.classList.contains('payment-method-title-row'),
      true
    );
    assert.equal(
      getComputedStyle(
        rows[1].querySelector<HTMLElement>('.payment-method-trailing')!
      ).width,
      '16px'
    );
  });

  test('renders declined payment methods with an inert status badge', async () => {
    const method: PaymentMethod = {
      id: 'card-2',
      label: 'Travel card',
      accountLabel: '•••• 1005',
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

    const row = root.querySelector<HTMLElement>('.payment-method-row')!;
    const statusBadge = row.querySelector<HTMLElement>(
      '.verification-status-badge'
    )!;

    assert.equal(row.tagName, 'DIV');
    assert.equal(row.dataset.action, undefined);
    assert.equal(
      row.querySelector('.payment-method-title')?.textContent?.trim(),
      'Travel card'
    );
    assert.equal(
      row.querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 1005'
    );
    assert.notExists(row.querySelector('.payment-method-status'));
    assert.equal(statusBadge.textContent?.trim(), "Can't use");
    assert.equal(
      statusBadge.getAttribute('data-verification-status'),
      'declined'
    );
    assert.notExists(row.querySelector('.payment-method-status-icon'));
    assert.notExists(row.querySelector('.payment-method-chevron'));
  });

  test('renders payment details with one red delete action', async () => {
    const method: PaymentMethod = {
      id: 'card-1',
      label: 'Corporate Visa',
      accountLabel: '•••• 1111',
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
        ${renderPaymentMethodRow(method, {
          confirmingDelete: true,
        })}
      `
    );

    const deleteButton = root.querySelector<HTMLButtonElement>(
      '[data-action="delete-payment-source"]'
    )!;

    assert.notExists(root.querySelector('.payment-method-delete-confirmation'));
    assert.notExists(
      root.querySelector('[data-action="cancel-delete-payment-source"]')
    );
    assert.equal(
      root.querySelector('.payment-method-title')?.textContent?.trim(),
      'Corporate Visa'
    );
    assert.equal(
      root.querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 1111'
    );
    const deleteIcon = deleteButton.querySelector<SVGElement>(
      '.payment-method-delete-action-icon'
    )!;

    assert.equal(deleteButton.textContent?.trim(), '');
    assert.equal(
      deleteButton.getAttribute('aria-label'),
      'Delete Corporate Visa'
    );
    assert.equal(deleteIcon.getAttribute('viewBox'), '0 0 640 640');
    assert.equal(deleteIcon.getAttribute('aria-hidden'), 'true');
    assert.equal(
      deleteIcon.querySelector('path')?.getAttribute('d'),
      'M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z'
    );
    assert.equal(getComputedStyle(deleteButton).minHeight, '40px');
    assert.equal(getComputedStyle(deleteButton).width, '40px');
    assert.equal(getComputedStyle(deleteButton).color, 'rgb(255, 255, 255)');
  });

  test('renders a selected payment method summary without radio or chevron controls', async () => {
    const method: PaymentMethod = {
      id: 'card-1',
      label: 'Corporate Visa',
      accountLabel: '•••• 1111',
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
      '•••• 1111'
    );
    assert.exists(selectedMethod.querySelector('.payment-method-title-row'));
    assert.exists(selectedMethod.querySelector('.payment-method-meta-row'));
    assert.notExists(selectedMethod.querySelector('.payment-method-status'));
    assert.equal(
      selectedMethod
        .querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      'Ready'
    );
    assert.notExists(selectedMethod.querySelector('.payment-method-chevron'));
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

  test('renders Connect your bank provider, outcome, detail, and text-link primitives', async () => {
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

  test('renders an accessible icon-only back control before the heading', async () => {
    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
      ${renderWidgetShell({
        title: 'Add card',
        backAction: 'back-to-payment-methods',
        backDisabled: true,
        showClose: false,
        content: html`<span>Card form</span>`,
      })}
    `);

    const headingRow = root.querySelector<HTMLElement>('.widget-heading-row')!;
    const backButton = headingRow.querySelector<HTMLButtonElement>(
      '.widget-back-button'
    )!;
    const heading = headingRow.querySelector<HTMLElement>('.widget-heading')!;
    const icon = backButton.querySelector<SVGElement>('.widget-back-icon')!;
    const iconPath = icon.querySelector('path')!;
    const content = root.querySelector<HTMLElement>('.widget-content')!;
    const backButtonStyles = getComputedStyle(backButton);

    assert.equal(backButton.getAttribute('aria-label'), 'Back');
    assert.equal(
      backButton.getAttribute('data-action'),
      'back-to-payment-methods'
    );
    assert.equal(backButton.textContent?.trim(), '');
    assert.isTrue(backButton.disabled);
    assert.equal(icon.getAttribute('aria-hidden'), 'true');
    assert.equal(icon.getAttribute('viewBox'), '0 0 640 640');
    assert.equal(
      iconPath.getAttribute('d'),
      'M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z'
    );
    assert.equal(getComputedStyle(icon).fill, backButtonStyles.color);
    assert.equal(getComputedStyle(icon).stroke, 'none');
    assert.strictEqual(backButton.nextElementSibling, heading);
    assert.equal(getComputedStyle(backButton).width, '44px');
    assert.equal(getComputedStyle(backButton).height, '44px');
    assert.equal(backButtonStyles.marginTop, '-8px');
    assert.equal(backButtonStyles.marginRight, '0px');
    assert.equal(backButtonStyles.marginBottom, '-8px');
    assert.equal(backButtonStyles.marginLeft, '0px');
    assert.closeTo(
      backButton.getBoundingClientRect().left,
      content.getBoundingClientRect().left,
      0.01
    );
  });

  test('renders shell, action-footer, and responsive form-grid composition primitives', async () => {
    const root = await renderHarness(html`
      <style>
        ${primitiveStyles.cssText}
      </style>
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
        footer: renderButton({label: 'Save card', action: 'save-card'}),
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
    const footer = root.querySelector<HTMLElement>('.widget-action-footer')!;
    assert.equal(footer.getAttribute('part'), 'footer');
    assert.equal(footer.textContent?.trim(), 'Save card');
    assert.equal(getComputedStyle(footer).borderTopStyle, 'solid');
    assert.notExists(root.querySelector('.powered-by-footer'));
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
