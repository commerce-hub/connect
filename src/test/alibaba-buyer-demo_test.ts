import {assert} from '@open-wc/testing';

const normalizedText = (text: string): string => text.replace(/\s+/g, ' ');

const waitFor = async (
  predicate: () => boolean,
  failureMessage: string
): Promise<void> => {
  const deadline = Date.now() + 5000;

  while (Date.now() < deadline) {
    if (predicate()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  assert.fail(failureMessage);
};

const loadBuyerDemo = async (query = ''): Promise<HTMLIFrameElement> => {
  const iframe = document.createElement('iframe');
  const iframeLoaded = new Promise<void>((resolve) => {
    iframe.addEventListener('load', () => resolve(), {once: true});
  });
  iframe.src = `/dev/alibaba-buyer.html${query}`;
  document.body.append(iframe);
  await iframeLoaded;

  return iframe;
};

const visiblePageId = (pageDocument: Document): string | null | undefined =>
  pageDocument
    .querySelector<HTMLElement>('.buyer-page:not([hidden])')
    ?.getAttribute('id');

const createBuyerProfileWithPaymentAccounts = async (
  pageDocument: Document
): Promise<void> => {
  pageDocument
    .querySelector<HTMLButtonElement>('#create-account-button')
    ?.click();
  pageDocument
    .querySelector<HTMLButtonElement>('#account-continue-button')
    ?.click();

  const otpInput = pageDocument.querySelector<HTMLInputElement>('.otp-input');
  otpInput!.value = '8';
  otpInput!.dispatchEvent(new Event('input', {bubbles: true}));
  pageDocument
    .querySelector<HTMLButtonElement>('#otp-continue-button')
    ?.click();

  const accountSetupCheckbox = pageDocument.querySelector<HTMLInputElement>(
    '#instant-accounts-checkbox'
  );
  accountSetupCheckbox!.checked = true;
  pageDocument
    .querySelector<HTMLButtonElement>('#setup-confirm-button')
    ?.click();

  await waitFor(
    () =>
      visiblePageId(pageDocument) === 'profile-page' &&
      pageDocument.querySelector<HTMLElement>('#payment-accounts-card')
        ?.hidden === false,
    'expected buyer profile with Payment Accounts to be visible'
  );
};

suite('Alibaba buyer account demo', () => {
  test('serves a multi-page buyer account creation demo', async () => {
    const response = await fetch('/dev/alibaba-buyer.html');
    const html = await response.text();
    const normalizedHtml = normalizedText(html);

    assert.isTrue(response.ok, 'expected Alibaba buyer demo page to be served');
    assert.include(html, '<title>Alibaba Buyer Account Demo</title>');
    assert.include(html, 'id="alibaba-buyer-demo"');
    assert.include(html, 'id="create-account-button"');
    assert.include(html, 'id="account-type-page"');
    assert.include(html, 'Which account would you like to create?');
    assert.include(html, 'id="otp-page"');
    assert.include(html, 'Verify your email');
    assert.include(html, 'id="setup-page"');
    assert.include(html, 'Set up your account');
    assert.include(
      normalizedHtml,
      'Set up instant Refunds and Rewards accounts. Get a promotional $10.00 instantly.'
    );
    assert.include(html, 'Verifying buyer information...');
    assert.include(html, 'Creating your account...');
    assert.include(html, 'Setting up Rewards and Refunds accounts...');
    assert.include(html, 'Depositing $10.00 to your account...');
    assert.include(html, 'id="profile-page"');
    assert.include(html, 'Account information');
    assert.include(html, 'Payment Accounts');
    assert.include(html, 'Topups &amp; Rewards Account');
    assert.include(html, 'Link bank account');
    assert.include(html, 'id="link-bank-account-button"');
    assert.include(html, 'id="bank-link-dialog"');
    assert.include(html, 'id="alibaba-buyer-sdk-host"');
    assert.include(html, 'partyId: BUYER_EMAIL');
    assert.include(html, "features: ['ADD_ACCOUNT', 'SELECT']");
    assert.include(html, "dbaName: 'Alibaba Topups'");
    assert.include(html, "countryCode: 'US'");
    assert.include(html, 'advancedVerification: true');
    assert.include(html, "mode: 'PRE_AUTHENTICATED'");
    assert.include(html, "await import('../commerce-hub-connect.js')");
    assert.include(html, "widget.addEventListener('onSuccess'");
    assert.include(html, 'data-page="home"');
  });

  test('creates a buyer account with any OTP token', async () => {
    const iframe = await loadBuyerDemo();

    const pageDocument = iframe.contentDocument;
    assert.isOk(pageDocument, 'expected Alibaba buyer iframe document');

    const currentVisiblePageId = () => visiblePageId(pageDocument!);

    assert.equal(currentVisiblePageId(), 'home-page');

    pageDocument
      ?.querySelector<HTMLButtonElement>('#create-account-button')
      ?.click();
    assert.equal(currentVisiblePageId(), 'account-type-page');

    pageDocument
      ?.querySelector<HTMLButtonElement>('#account-continue-button')
      ?.click();
    assert.equal(currentVisiblePageId(), 'otp-page');

    const otpInputs = Array.from(
      pageDocument?.querySelectorAll<HTMLInputElement>('.otp-input') ?? []
    );
    assert.lengthOf(otpInputs, 6);

    otpInputs.forEach((input, index) => {
      input.value = String(index + 1);
      input.dispatchEvent(new Event('input', {bubbles: true}));
    });

    pageDocument
      ?.querySelector<HTMLButtonElement>('#otp-continue-button')
      ?.click();
    assert.equal(currentVisiblePageId(), 'setup-page');

    pageDocument
      ?.querySelector<HTMLButtonElement>('#setup-confirm-button')
      ?.click();
    assert.equal(currentVisiblePageId(), 'profile-page');
    assert.include(
      pageDocument?.querySelector('#profile-name')?.textContent ?? '',
      'Example S'
    );

    iframe.remove();
  });

  test('sets up Refunds and Rewards accounts after opt-in', async () => {
    const iframe = await loadBuyerDemo();

    const pageDocument = iframe.contentDocument;
    assert.isOk(pageDocument, 'expected Alibaba buyer iframe document');

    const currentVisiblePageId = () => visiblePageId(pageDocument!);

    pageDocument
      ?.querySelector<HTMLButtonElement>('#create-account-button')
      ?.click();
    pageDocument
      ?.querySelector<HTMLButtonElement>('#account-continue-button')
      ?.click();

    const otpInput =
      pageDocument?.querySelector<HTMLInputElement>('.otp-input');
    otpInput!.value = '8';
    otpInput!.dispatchEvent(new Event('input', {bubbles: true}));
    pageDocument
      ?.querySelector<HTMLButtonElement>('#otp-continue-button')
      ?.click();
    assert.equal(currentVisiblePageId(), 'setup-page');

    const accountSetupCheckbox = pageDocument?.querySelector<HTMLInputElement>(
      '#instant-accounts-checkbox'
    );
    assert.isOk(accountSetupCheckbox, 'expected instant accounts checkbox');
    assert.include(
      normalizedText(accountSetupCheckbox?.closest('label')?.textContent ?? ''),
      'Set up instant Refunds and Rewards accounts. Get a promotional $10.00 instantly.'
    );

    accountSetupCheckbox!.checked = true;
    pageDocument
      ?.querySelector<HTMLButtonElement>('#setup-confirm-button')
      ?.click();

    const progressOverlay = pageDocument?.querySelector<HTMLElement>(
      '#instant-accounts-progress'
    );
    const progressMessage = pageDocument?.querySelector<HTMLElement>(
      '#instant-accounts-progress-message'
    );

    assert.isFalse(
      progressOverlay?.hidden,
      'expected progress overlay to show after opting in'
    );
    assert.equal(
      progressMessage?.textContent?.trim(),
      'Verifying buyer information...'
    );

    await new Promise((resolve) => setTimeout(resolve, 850));
    assert.equal(
      progressMessage?.textContent?.trim(),
      'Creating your account...'
    );

    await new Promise((resolve) => setTimeout(resolve, 850));
    assert.equal(
      progressMessage?.textContent?.trim(),
      'Setting up Rewards and Refunds accounts...'
    );

    await new Promise((resolve) => setTimeout(resolve, 850));
    assert.equal(
      progressMessage?.textContent?.trim(),
      'Depositing $10.00 to your account...'
    );

    await new Promise((resolve) => setTimeout(resolve, 650));
    assert.equal(currentVisiblePageId(), 'profile-page');
    assert.isTrue(progressOverlay?.hidden);
    assert.include(
      pageDocument?.querySelector('#payment-accounts-card')?.textContent ?? '',
      'Rewards balance'
    );
    assert.include(
      pageDocument?.querySelector('#payment-accounts-card')?.textContent ?? '',
      '$10.00'
    );

    iframe.remove();
  });

  test('links a bank account for Topups and Rewards and shows SDK success details with verification status', async () => {
    const iframe = await loadBuyerDemo('?apiBaseUrl=http://commercehub.test');

    const pageWindow = iframe.contentWindow;
    const pageDocument = iframe.contentDocument;
    assert.isOk(pageWindow, 'expected Alibaba buyer iframe window');
    assert.isOk(pageDocument, 'expected Alibaba buyer iframe document');

    const createRequest = {
      body: undefined as Record<string, unknown> | undefined,
      count: 0,
    };
    pageWindow!.fetch = (async (_input, init) => {
      createRequest.body = JSON.parse(String(init?.body));
      createRequest.count += 1;

      return new Response(
        JSON.stringify({
          interactionId: `alibaba-buyer-bank-demo-interaction-${createRequest.count}`,
          status: 'PAYMENT_SOURCE_REQUESTED',
          allowedTenderTypes: ['BANK_ACCOUNT'],
          paymentSources: [],
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }) as typeof fetch;

    await createBuyerProfileWithPaymentAccounts(pageDocument!);

    const bankLinkDialog =
      pageDocument!.querySelector<HTMLDialogElement>('#bank-link-dialog');
    const linkBankAccountButton =
      pageDocument!.querySelector<HTMLButtonElement>(
        '#link-bank-account-button'
      );
    const setupRow = pageDocument!.querySelector<HTMLElement>(
      '#topups-rewards-setup-row'
    );

    assert.isFalse(
      bankLinkDialog?.open ?? true,
      'expected bank link dialog to be closed by default'
    );
    assert.isFalse(
      setupRow?.hidden ?? true,
      'expected account row to show setup action before a bank account is linked'
    );
    assert.include(setupRow?.textContent ?? '', 'Topups & Rewards Account');
    assert.include(setupRow?.textContent ?? '', 'Link bank account');
    assert.notInclude(
      setupRow?.textContent ?? '',
      'Link bank account for Topups & Rewards'
    );
    assert.equal(
      createRequest.body,
      undefined,
      'expected no interaction to be created before the link is clicked'
    );

    linkBankAccountButton?.click();

    assert.isTrue(
      bankLinkDialog?.open,
      'expected bank link dialog to open from Payment Accounts'
    );

    await waitFor(
      () =>
        pageDocument!.querySelector('#alibaba-buyer-connect-widget') !== null,
      'expected bank account link to mount the CommerceHub Connect SDK'
    );

    const createRequestBody = createRequest.body;
    assert.isDefined(createRequestBody);
    assert.propertyVal(createRequestBody, 'partyId', 'shopper@example.com');
    assert.deepEqual(createRequestBody?.allowedTenderTypes, ['BANK_ACCOUNT']);
    assert.deepEqual(createRequestBody?.merchantData, {
      clientId: 'example-client',
      merchantId: '000000000000000',
      terminalId: '00000000',
      dbaName: 'Alibaba Topups',
      countryCode: 'US',
    });
    assert.notProperty(createRequestBody ?? {}, 'entityData');
    assert.deepEqual(createRequestBody?.features, ['ADD_ACCOUNT', 'SELECT']);
    assert.propertyVal(createRequestBody, 'advancedVerification', true);
    assert.propertyVal(createRequestBody, 'mode', 'PRE_AUTHENTICATED');

    const widget = pageDocument!.querySelector('#alibaba-buyer-connect-widget');
    widget?.dispatchEvent(
      new CustomEvent('onSuccess', {
        detail: {
          tenderType: 'BankAccount',
          id: 'bank-alibaba-1',
          name: 'Example Topups & Rewards Account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'Wells Fargo',
            accountNumber: '000123456789',
            accountType: 'Savings',
          },
        },
      })
    );

    assert.isFalse(
      bankLinkDialog?.open ?? true,
      'expected bank link dialog to close after SDK success'
    );
    assert.include(
      pageDocument!.querySelector('#linked-bank-account-row')?.textContent ??
        '',
      'Linked account'
    );
    assert.notInclude(
      pageDocument!.querySelector('#linked-bank-account-row')?.textContent ??
        '',
      'Topups & Rewards bank'
    );
    assert.notInclude(
      pageDocument!.querySelector('#linked-bank-account-row')?.textContent ??
        '',
      'Example Topups & Rewards Account'
    );
    assert.include(
      pageDocument!.querySelector('#linked-bank-account-row')?.textContent ??
        '',
      'Topups & Rewards Account'
    );
    assert.isTrue(
      setupRow?.hidden ?? false,
      'expected setup row to hide once a bank account is linked'
    );

    pageDocument!
      .querySelector<HTMLButtonElement>('#linked-bank-account-button')
      ?.click();

    const accountDetails = pageDocument!.querySelector<HTMLElement>(
      '#payment-account-details'
    );
    assert.isFalse(
      accountDetails?.hidden ?? true,
      'expected linked account details to show after clicking account link'
    );
    assert.include(accountDetails?.textContent ?? '', 'Wells Fargo');
    assert.include(accountDetails?.textContent ?? '', '6789');
    assert.include(accountDetails?.textContent ?? '', 'Savings');
    const verificationBadge = accountDetails?.querySelector<HTMLElement>(
      '#payment-account-verification-status.payment-account-status-badge'
    );
    assert.isOk(
      verificationBadge,
      'expected verification status to render as a badge'
    );
    assert.equal(verificationBadge?.textContent?.trim(), 'VERIFIED');
    assert.equal(
      verificationBadge?.dataset.verificationStatus,
      'VERIFIED',
      'expected verification status badge to expose its status'
    );

    pageDocument!
      .querySelector<HTMLButtonElement>('#change-linked-bank-account-button')
      ?.click();

    assert.isTrue(
      bankLinkDialog?.open,
      'expected Change Account to open the SDK dialog'
    );
    await waitFor(
      () =>
        createRequest.count === 2 &&
        pageDocument!.querySelector('#alibaba-buyer-connect-widget') !== null,
      'expected Change Account to create and mount a fresh CommerceHub interaction'
    );

    const changedWidget = pageDocument!.querySelector(
      '#alibaba-buyer-connect-widget'
    );
    changedWidget?.dispatchEvent(
      new CustomEvent('onSuccess', {
        detail: {
          tenderType: 'BankAccount',
          id: 'bank-alibaba-2',
          name: 'Example Updated Rewards Account',
          verificationInfo: {status: 'UNDER_REVIEW'},
          bankAccount: {
            bankName: 'Chase',
            accountNumber: '000000004321',
            accountType: 'Checking',
          },
        },
      })
    );

    assert.isFalse(
      bankLinkDialog?.open ?? true,
      'expected bank link dialog to close after changed account success'
    );
    pageDocument!
      .querySelector<HTMLButtonElement>('#linked-bank-account-button')
      ?.click();
    assert.include(accountDetails?.textContent ?? '', 'Chase');
    assert.include(accountDetails?.textContent ?? '', '4321');
    assert.include(accountDetails?.textContent ?? '', 'Checking');
    assert.equal(verificationBadge?.dataset.verificationStatus, 'UNDER_REVIEW');

    iframe.remove();
  });
});
