import assert from 'node:assert/strict';

import {chromium} from 'playwright';

const DEV_PAGE_URL =
  process.env.E2E_BASE_URL ?? 'http://localhost:8000/dev/index.html';
const WIDGET_API_BASE_URL = 'http://localhost:8080';
const COMMERCE_HUB_API_BASE_URL =
  process.env.COMMERCE_HUB_API_BASE_URL ?? WIDGET_API_BASE_URL;
const BANK_SEARCH = process.env.E2E_BANK_SEARCH ?? 'non mfa';
const BANK_USERNAME = process.env.E2E_BANK_USERNAME;
const BANK_PASSWORD = process.env.E2E_BANK_PASSWORD;
const TEST_TIMEOUT_MS = Number(process.env.E2E_TIMEOUT_MS ?? 180000);
const HEADLESS = process.env.E2E_HEADLESS === 'true';
const SLOW_MO = Number(process.env.E2E_SLOW_MO_MS ?? 0);
const FINAL_OUTCOMES = ['Bank account verified', 'Verification pending review'];

if (!BANK_USERNAME || !BANK_PASSWORD) {
  throw new Error(
    'E2E_BANK_USERNAME and E2E_BANK_PASSWORD are required to run the bank account flow.'
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withApiBaseUrl = (url) => {
  const nextUrl = new URL(url);

  nextUrl.searchParams.set('apiBaseUrl', WIDGET_API_BASE_URL);

  return nextUrl.toString();
};

const normalizeBaseUrl = (url) => url.replace(/\/+$/, '');

const installApiRewrite = async (page, requests) => {
  const targetBaseUrl = normalizeBaseUrl(COMMERCE_HUB_API_BASE_URL);

  page.on('request', (request) => {
    const url = new URL(request.url());

    if (url.origin !== WIDGET_API_BASE_URL) {
      return;
    }

    requests.push({
      method: request.method(),
      path: url.pathname,
      headers: request.headers(),
    });
  });

  if (targetBaseUrl === WIDGET_API_BASE_URL) {
    return;
  }

  await page.route(`${WIDGET_API_BASE_URL}/**`, async (route) => {
    const requestUrl = new URL(route.request().url());
    const rewrittenUrl = `${targetBaseUrl}${requestUrl.pathname}${requestUrl.search}`;

    await route.continue({url: rewrittenUrl});
  });
};

const elementMatches = async (element, matcherName) =>
  element.evaluate((candidate, name) => {
    const matchers = {
      firstTextInput: window.__chcE2eMatchers.isFirstTextInput,
      searchInput: window.__chcE2eMatchers.isSearchInput,
      submitButton: window.__chcE2eMatchers.isSubmitButton,
      usernameInput: window.__chcE2eMatchers.isUsernameInput,
      visible: window.__chcE2eMatchers.visibleElement,
    };

    return matchers[name](candidate);
  }, matcherName);

const installDomMatchers = async (page) => {
  await page.addInitScript(() => {
    window.__chcE2eMatchers = {
      candidateText: (element) =>
        [
          element.textContent,
          element.getAttribute('aria-label'),
          element.getAttribute('placeholder'),
          element.getAttribute('name'),
          element.id,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      isFirstTextInput: (input) => {
        const type = input.getAttribute('type')?.toLowerCase() ?? 'text';

        return ['', 'email', 'search', 'text'].includes(type);
      },
      isSearchInput: (input) => {
        const type = input.getAttribute('type')?.toLowerCase() ?? 'text';
        const text = window.__chcE2eMatchers.candidateText(input);

        if (!['', 'search', 'text'].includes(type)) {
          return false;
        }

        return /search|bank|institution|financial/.test(text);
      },
      isSubmitButton: (element) => {
        if (
          element.disabled ||
          element.getAttribute('aria-disabled') === 'true'
        ) {
          return false;
        }

        const text = window.__chcE2eMatchers.candidateText(element);

        if (/back|cancel|close|visibility/.test(text)) {
          return false;
        }

        return /continue|log in|login|next|sign in|signin|submit/.test(text);
      },
      isUsernameInput: (input) => {
        const type = input.getAttribute('type')?.toLowerCase() ?? 'text';
        const text = window.__chcE2eMatchers.candidateText(input);

        if (!['', 'email', 'text'].includes(type)) {
          return false;
        }

        return (
          /user|login|id|name/.test(text) &&
          !/search|bank|institution/.test(text)
        );
      },
      visibleElement: (element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return (
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          rect.width > 0 &&
          rect.height > 0
        );
      },
    };
  });
};

const findVisibleElement = async ({
  page,
  description,
  selectors,
  includeMainFrame = true,
  matcherName = 'visible',
  timeoutMs = TEST_TIMEOUT_MS,
}) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      if (!includeMainFrame && frame === page.mainFrame()) {
        continue;
      }

      for (const selector of selectors) {
        const elements = await frame.$$(selector);

        for (const element of elements) {
          if (await elementMatches(element, 'visible')) {
            if (
              matcherName === 'visible' ||
              (await elementMatches(element, matcherName))
            ) {
              return {element, frame};
            }
          }
        }
      }
    }

    await sleep(300);
  }

  throw new Error(`Timed out waiting for ${description}.`);
};

const findVisibleTextElement = async ({
  page,
  description,
  pattern,
  selectors,
  includeMainFrame = true,
  timeoutMs = TEST_TIMEOUT_MS,
}) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      if (!includeMainFrame && frame === page.mainFrame()) {
        continue;
      }

      for (const selector of selectors) {
        const elements = await frame.$$(selector);

        for (const element of elements) {
          const matches = await element.evaluate((candidate, source) => {
            const regex = new RegExp(source, 'i');

            return (
              window.__chcE2eMatchers.visibleElement(candidate) &&
              regex.test(window.__chcE2eMatchers.candidateText(candidate))
            );
          }, pattern.source);

          if (matches) {
            return {element, frame};
          }
        }
      }
    }

    await sleep(300);
  }

  throw new Error(`Timed out waiting for ${description}.`);
};

const fillElement = async (target, value) => {
  await target.element.fill(value);
};

const clickElement = async (target) => {
  await target.element.click();
};

const checkElement = async (target) => {
  const isCheckable = await target.element.evaluate(
    (element) =>
      element instanceof HTMLInputElement &&
      ['checkbox', 'radio'].includes(element.type)
  );

  if (isCheckable) {
    await target.element.check();
    return;
  }

  await clickElement(target);
};

const clickProviderTextButton = async ({
  page,
  description,
  pattern,
  timeoutMs = 10000,
}) => {
  const button = await findVisibleTextElement({
    page,
    description,
    pattern,
    selectors: ['button', '[role="button"]', 'input[type="submit"]'],
    includeMainFrame: false,
    timeoutMs,
  });

  await clickElement(button);
};

const clickWidgetAction = async (page, action) => {
  await page.evaluate((actionName) => {
    const widget = document.querySelector('commerce-hub-connect');
    const button = widget?.shadowRoot?.querySelector(
      `[data-action="${actionName}"]`
    );

    if (!(button instanceof HTMLButtonElement)) {
      throw new Error(`Widget action not found: ${actionName}`);
    }

    button.click();
  }, action);
};

const waitForWidgetText = async (
  page,
  predicate,
  timeoutMs = TEST_TIMEOUT_MS
) =>
  page.waitForFunction(
    (source) => {
      const widget = document.querySelector('commerce-hub-connect');
      const text = widget?.shadowRoot?.textContent ?? '';
      const regex = new RegExp(source, 'i');

      return regex.test(text);
    },
    predicate.source,
    {timeout: timeoutMs}
  );

const widgetText = async (page) =>
  page.evaluate(() => {
    const widget = document.querySelector('commerce-hub-connect');

    return widget?.shadowRoot?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  });

const widgetInteractionId = async (page) =>
  page.evaluate(() => {
    const widget = document.querySelector('commerce-hub-connect');

    return widget?.interactionResponse?.interactionId;
  });

const submitCreateInteraction = async (page) => {
  await page.click('#create-interaction-button');
  await page.waitForFunction(
    () => Boolean(document.querySelector('commerce-hub-connect')),
    undefined,
    {timeout: TEST_TIMEOUT_MS}
  );
};

const selectBankProvider = async (page) => {
  const getStartedButton = await findVisibleTextElement({
    page,
    description: 'Pay by Bank Get Started button',
    pattern: /get started|start/,
    selectors: ['button', '[role="button"]', 'a'],
    includeMainFrame: false,
    timeoutMs: 15000,
  }).catch(() => undefined);

  if (getStartedButton) {
    await clickElement(getStartedButton);
  }

  const searchInput =
    (await findVisibleElement({
      page,
      description: 'Pay by Bank institution search input',
      selectors: ['input'],
      includeMainFrame: false,
      matcherName: 'searchInput',
      timeoutMs: 60000,
    }).catch(() => undefined)) ??
    (await findVisibleElement({
      page,
      description: 'first Pay by Bank text input',
      selectors: ['input'],
      includeMainFrame: false,
      matcherName: 'firstTextInput',
      timeoutMs: 15000,
    }));

  await fillElement(searchInput, BANK_SEARCH);

  const bankResult =
    (await findVisibleTextElement({
      page,
      description: `bank result matching "${BANK_SEARCH}"`,
      pattern: /non\s*mfa/,
      selectors: [
        'button',
        'a',
        '[role="button"]',
        '[role="option"]',
        '[role="listitem"]',
        'li',
        '[tabindex="0"]',
      ],
      includeMainFrame: false,
      timeoutMs: 60000,
    }).catch(() => undefined)) ??
    (await findVisibleElement({
      page,
      description: 'first visible bank result',
      selectors: [
        '[role="option"]',
        '[role="listitem"]',
        'button',
        'a',
        'li',
        '[data-testid*="institution"]',
        '[class*="institution"]',
      ],
      includeMainFrame: false,
      timeoutMs: 30000,
    }));

  await clickElement(bankResult);

  await clickProviderTextButton({
    page,
    description: 'bank-provider consent next button',
    pattern: /next|continue/,
    timeoutMs: 15000,
  }).catch(() => undefined);
};

const completeBankLogin = async (page) => {
  const usernameInput =
    (await findVisibleElement({
      page,
      description: 'bank username input',
      selectors: ['input'],
      includeMainFrame: false,
      matcherName: 'usernameInput',
      timeoutMs: 60000,
    }).catch(() => undefined)) ??
    (await findVisibleElement({
      page,
      description: 'first bank login text input',
      selectors: ['input'],
      includeMainFrame: false,
      matcherName: 'firstTextInput',
      timeoutMs: 30000,
    }));
  const passwordInput = await findVisibleElement({
    page,
    description: 'bank password input',
    selectors: ['input[type="password"]'],
    includeMainFrame: false,
    timeoutMs: 60000,
  });

  await fillElement(usernameInput, BANK_USERNAME);
  await fillElement(passwordInput, BANK_PASSWORD);

  const submitButton = await findVisibleElement({
    page,
    description: 'bank login submit button',
    selectors: ['button', '[role="button"]', 'input[type="submit"]'],
    includeMainFrame: false,
    matcherName: 'submitButton',
    timeoutMs: 30000,
  });

  await clickElement(submitButton);
};

const maybeSelectFirstAccount = async (page) => {
  const accountControl = await findVisibleElement({
    page,
    description: 'account selection radio or checkbox',
    selectors: ['input[type="radio"]', 'input[type="checkbox"]'],
    includeMainFrame: false,
    timeoutMs: 30000,
  }).catch(() => undefined);

  if (accountControl) {
    await checkElement(accountControl);
  }

  const continueButton = await findVisibleElement({
    page,
    description: 'account selection continue button',
    selectors: ['button', '[role="button"]', 'input[type="submit"]'],
    includeMainFrame: false,
    matcherName: 'submitButton',
    timeoutMs: 30000,
  }).catch(() => undefined);

  if (continueButton) {
    await clickElement(continueButton);
  }
};

const providerErrorFrameUrls = (page) =>
  page
    .frames()
    .map((frame) => frame.url())
    .filter((url) => url.startsWith('chrome-error://'));

const waitForFinalWidgetOutcome = async (page) => {
  const deadline = Date.now() + TEST_TIMEOUT_MS;
  const outcomePattern = new RegExp(FINAL_OUTCOMES.join('|'), 'i');
  let lastWidgetText = '';

  while (Date.now() < deadline) {
    const errorFrameUrls = providerErrorFrameUrls(page);

    if (errorFrameUrls.length > 0) {
      throw new Error(
        `Pay by Bank provider navigated to an error frame before returning to the SDK: ${errorFrameUrls.join(
          ', '
        )}`
      );
    }

    const text = await widgetText(page);
    lastWidgetText = text;

    if (outcomePattern.test(text)) {
      return;
    }

    await sleep(500);
  }

  throw new Error(
    `Timed out waiting for final bank account outcome: ${FINAL_OUTCOMES.join(
      ' or '
    )}. Current widget text: ${lastWidgetText}. Provider frames: ${page
      .frames()
      .map((frame) => frame.url())
      .join(', ')}`
  );
};

const assertApiRequestCoverage = ({requests, interactionId}) => {
  assert(
    requests.some(
      (request) =>
        request.method === 'POST' &&
        request.path === '/merchant/interaction/create'
    ),
    'expected the demo page to create a merchant interaction'
  );
  assert(
    requests.some(
      (request) =>
        request.method === 'GET' &&
        request.path === '/interaction/source/pbb/session'
    ),
    'expected the widget to request a Pay by Bank session'
  );
  assert(
    requests.some(
      (request) =>
        request.method === 'PUT' &&
        request.path.startsWith('/interaction/source/pbb/session/')
    ),
    'expected the widget to finalize the Pay by Bank session'
  );

  const payByBankRequests = requests.filter((request) =>
    request.path.startsWith('/interaction/source/pbb/session')
  );

  assert(
    payByBankRequests.every(
      (request) => request.headers['x-interaction-id'] === interactionId
    ),
    'expected Pay by Bank requests to include the created interaction id'
  );
};

const main = async () => {
  const requests = [];
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: SLOW_MO,
  });

  try {
    const page = await browser.newPage({viewport: {width: 1600, height: 900}});

    page.setDefaultTimeout(TEST_TIMEOUT_MS);
    await installDomMatchers(page);
    await installApiRewrite(page, requests);
    await page.goto(withApiBaseUrl(DEV_PAGE_URL), {
      waitUntil: 'domcontentloaded',
      timeout: TEST_TIMEOUT_MS,
    });

    await submitCreateInteraction(page);
    await waitForWidgetText(
      page,
      /Add bank account|Pay with|Choose payment method/
    );

    const interactionId = await widgetInteractionId(page);

    assert.equal(typeof interactionId, 'string');
    assert.notEqual(interactionId.trim(), '');

    await clickWidgetAction(page, 'add-bank-account');
    await waitForWidgetText(page, /Add bank account/);
    await selectBankProvider(page);
    await completeBankLogin(page);
    await maybeSelectFirstAccount(page);

    await waitForFinalWidgetOutcome(page);

    const finalText = await widgetText(page);

    assert.match(
      finalText,
      /Commerce National Bank|Bank account|Verified|Pending review/i
    );
    assertApiRequestCoverage({requests, interactionId});
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown e2e failure';

    throw new Error(
      `${message}\n\nMake sure npm run serve is running on port 8000 and COMMERCE_HUB_API_BASE_URL points at a CommerceHub API environment that supports the Pay by Bank test institution.`
    );
  } finally {
    await browser.close();
  }
};

await main();
