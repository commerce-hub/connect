import {fixture, assert, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import {
  COMMERCE_HUB_BASE_URLS,
  type InteractionResponse,
  type NativeAccountTransaction,
  type PaymentSource,
  type CommerceHubBaseURLInput,
} from '../commerce-hub-connect.js';
import type {CommerceHubConnect} from '../commerce-hub-connect.js';
import {
  CARD_SOURCE_ACTION_BRAND_IMAGE,
  MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
  PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE,
} from '../internal/source-action-brand-images.js';

interface CapturedRequest {
  url: string;
  method: string;
  headers: Headers;
  bodyText: string;
  credentials: RequestCredentials;
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

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

const flushElement = async (el: CommerceHubConnect) => {
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
};

const TEST_COMMERCE_HUB_BASE_URL = 'http://commercehub.test';
const TEST_INTERACTION_FEATURES: NonNullable<InteractionResponse['features']> =
  ['ADD_ACCOUNT', 'SELECT', 'TRANSFER'];
const TEST_SOURCE_CREATE_OAUTH = {
  access_token: 'test-access-token',
  client_id: 'test-client-id',
  token_type: 'Bearer',
};
const TEST_SOURCE_ENCRYPTION_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArU+d9IoFjmkyHb0ypWNd
DQSRdeyWL4dJ8aT0MT83y6dSmmldfzbsgFeooyVyqkwSd6yZ10jZahqHgp8Km0Wq
aku7TPa3tWWHJAw5q2Hva+Mn1KSiV6ggirbfGXj4XGTFo8925f0qBoLmxAGKYG9M
UGgofqBGUyLWFgWm/J1lKs7EuLSIuhfgizpz7TkZLApgA61zrn9kyUWKIgSxzp4L
sr2Y+rXmBesjkvfoKyle71SHNo9KPetlC7zIIG/0xEChXO3IRLTBCXPk4+Qhb9qp
Y/1kTfpksfCbuBai1lhbCPI4a0wzPitMJNTNtZkwwJlTNHVkggVMLCZ8Us/dX+rT
YwIDAQAB
-----END PUBLIC KEY-----`;
const TEST_SOURCE_ENCRYPTION_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtT530igWOaTId
vTKlY10NBJF17JYvh0nxpPQxPzfLp1KaaV1/NuyAV6ijJXKqTBJ3rJnXSNlqGoeC
nwqbRapqS7tM9re1ZYckDDmrYe9r4yfUpKJXqCCKtt8ZePhcZMWjz3bl/SoGgubE
AYpgb0xQaCh+oEZTItYWBab8nWUqzsS4tIi6F+CLOnPtORksCmADrXOuf2TJRYoi
BLHOnguyvZj6teYF6yOS9+grKV7vVIc2j0o962ULvMggb/TEQKFc7chEtMEJc+Tj
5CFv2qlj/WRN+mSx8Ju4FqLWWFsI8jhrTDM+K0wk1M21mTDAmVM0dWSCBUwsJnxS
z91f6tNjAgMBAAECggEAIkQLEWXWmmUPHRUitdNy+tdr4RphSU1g38+C3lfG8tOG
v/PUIgpccTWjqHoHdUcsIZA1LH0BS3qqTzeds7xu6KxHgHyJLuq/cO+f2VQ4L6cO
YXsZg+ZAZNyqOJGT3USpVO14bxmCXR41fQxm7REkUAN/+iU7MkXBeUIt1WVTMsay
bpZdcZPYfMPiGhEDD0sF7MyvEN6MrUvSwQzhHsACjoFfJ7JGm8eI+iIDHOKUCe4p
gSFgo77ULuzcYnP9uSQNU2jydqIfQaUv0MiC2isZrNhHCr+cHr9qqFKAXQI51JLW
o3y7XdQjCbMnyCsT+ruo0ew7zHAhWcyXGixS8kWAuQKBgQDe4AVkwMq5zkYps21Z
a9FirQGSnY8ztZdDqE3WkhiRHfmVzdy6YBAk5mtbc0ovbLev+BsmM8laIFxXvBtp
XKG2YRaXpnGAj2Gv0vYguqrR+qvcCXQ1MEjbAAys8eZOmzRDcKPfaHYPlqfi5PJZ
tDhYWbJQS4PqTGk0iuB0iq6HiwKBgQDHEcaU2yMCMg5SgUEcxSuKbRLVw6CSC/m+
4uhBUVe0tynx6ARDnyy+aVEG9MnW+riC+Zpsn74iKI2WWT084N0IxJ1apkCvhmuZ
ICLUfP/Lt2YP29bYf/moKo5++bPA176Lo4g8O+aDTFTvaXld2nhcc7WAaH3jt7ua
XpfGgiYeiQKBgG/DJvE/PGmwZr7CmzMcPgOdfgxntkfX5+Klo2LWIDulLGNSuD09
rtrSMUPKrIjbm8FCSVr+3Rm04JmeWqCbMvyh8xJZBNHTFMl2oLYI5WAms8fDdeK2
M9KeU7zmEPeaHLs04PhHCe0HP2koJd+V4Cttz100gRIc/yS5/5RxdtPBAoGAWC3R
jwJ6wXA20+kZVIsqPEkQfMwJBmhzmlCcnMJRXWV9GQCzUtjhUv8Hu1MXTTkGHk4+
Tzt7V1orTZv9+keI4WdmZE8cfCPI6a1IgGNWU4DLnt68jm4xwoIHWMt3CkcGyogH
wtatxx86yEoqTp6Fjj5a+aRPj11Fpp2cEXx5MjECgYEAqb1g4nliSInIDitXTARk
jSPeQy3bUPQorUuDHVOHDAZgsFmh+nDlJcbltZuoCOb4qlzTftm2TQ88lgKE7bRQ
VcY1vevnFZnWkRCSBEslF7bopfcNuEZ4RlSZz2iGXmJJkE3blfnnqehOI+frQFfs
cjoCPxDIWQfSUQZ07JDG21s=
-----END PRIVATE KEY-----`;
const TEST_INSTRUMENT_SCHEMAS = [
  {
    bavSupportedCode: 'CAD-Canadian-B',
    productId: 'POLOCALBANK',
    productDescription: 'Bank Account',
    countryCode: 'CA',
    currencyCode: 'CAD',
    currencyName: 'Canadian Dollar',
    type: 'object',
    properties: {
      accountHolderName: {
        type: 'string',
        title: 'Full name of the account holder',
        minLength: 3,
        'x-errorMessages': {
          required: 'Full name of the account holder is required',
          minLength: 'Must be at least 3 characters',
        },
      },
      accountNumber: {
        type: 'string',
        title: 'Account number',
        minLength: 7,
        maxLength: 12,
        pattern: '$re$\\d{7,12}$re$',
        'x-errorMessages': {
          required: 'Account number is required',
          minLength: 'Must be at least 7 characters',
          maxLength: 'Cannot exceed 12 characters',
          pattern: 'Enter a valid account number',
        },
      },
      'address.city': {
        type: 'string',
        title: 'City',
        minLength: 1,
        pattern: '$re$^.{1,255}$re$',
        'x-errorMessages': {
          required: 'City is required',
          pattern: 'Enter a valid city',
        },
      },
      institutionNumber: {
        type: 'string',
        title: 'Institution number',
        pattern: '$re$\\d{3}$re$',
        'x-errorMessages': {
          required: 'Institution number is required',
          pattern: 'Enter a valid institution number',
        },
      },
      transitNumber: {
        type: 'string',
        title: 'Transit number',
        pattern: '$re$\\d{5}$re$',
        'x-errorMessages': {
          required: 'Transit number is required',
          pattern: 'Enter a valid transit number',
        },
      },
    },
    required: [
      'accountHolderName',
      'accountNumber',
      'address.city',
      'institutionNumber',
      'transitNumber',
    ],
  },
  {
    bavSupportedCode: 'CAD-Interac-B',
    productId: 'POINTERAC',
    countryCode: 'CA',
    currencyCode: 'CAD',
    currencyName: 'Canadian Dollar',
    type: 'object',
    properties: {
      accountHolderName: {
        type: 'string',
        title: 'Full name of the account holder',
        'x-errorMessages': {
          required: 'Full name of the account holder is required',
        },
      },
      'address.city': {
        type: 'string',
        title: 'City',
        'x-errorMessages': {
          required: 'City is required',
        },
      },
      interacAccount: {
        type: 'string',
        title: 'Interac registered email',
        pattern: '$re$^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$re$',
        'x-errorMessages': {
          required: 'Interac registered email is required',
          pattern: 'Enter a valid interac registered email',
        },
      },
    },
    required: ['accountHolderName', 'address.city', 'interacAccount'],
  },
] as const;

const TEST_CASCADING_INSTRUMENT_SCHEMAS = [
  TEST_INSTRUMENT_SCHEMAS[0],
  {...TEST_INSTRUMENT_SCHEMAS[0], bavSupportedCode: 'CAD-Canadian-P'},
  TEST_INSTRUMENT_SCHEMAS[1],
  {...TEST_INSTRUMENT_SCHEMAS[1], bavSupportedCode: 'CAD-Interac-P'},
] as const;

const bankAccountCountryConfigResponse = (
  instrumentSchemas: unknown = TEST_CASCADING_INSTRUMENT_SCHEMAS
): Response =>
  new Response(
    JSON.stringify({
      configurationType: 'COUNTRY_TENDER',
      instrumentSchemas,
    }),
    {status: 200, headers: {'Content-Type': 'application/json'}}
  );

const renderConnect = async (
  interactionResponse: InteractionResponse,
  designConfig?: unknown,
  baseURL: CommerceHubBaseURLInput = TEST_COMMERCE_HUB_BASE_URL,
  options: {
    initialInteractionResponse?: InteractionResponse | false;
    defaultCountry?: boolean;
    defaultFeatures?: boolean;
    defaultSourceMetadata?: boolean;
  } = {}
) => {
  const shouldStubInitialInteraction =
    options.initialInteractionResponse !== false;
  const interactionResponseForTest = interactionResponseWithTestFeatures(
    interactionResponse,
    options.defaultFeatures,
    options.defaultSourceMetadata,
    options.defaultCountry
  );

  if (shouldStubInitialInteraction) {
    const fetchForTest = window.fetch;
    let servedInitialInteraction = false;
    const initialInteractionResponse =
      options.initialInteractionResponse === false
        ? false
        : interactionResponseWithTestFeatures(
            options.initialInteractionResponse ?? interactionResponse,
            options.defaultFeatures,
            options.defaultSourceMetadata,
            options.defaultCountry
          );

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input);

      if (
        !servedInitialInteraction &&
        request.method === 'GET' &&
        new URL(request.url).pathname.endsWith('/interaction')
      ) {
        servedInitialInteraction = true;

        return new Response(JSON.stringify(initialInteractionResponse), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return fetchForTest(input, init);
    };
  }

  const el = (await fixture(
    testingHtml`<commerce-hub-connect
      .interactionResponse=${interactionResponseForTest}
      .designConfig=${designConfig}
      .baseURL=${baseURL}
    ></commerce-hub-connect>`
  )) as CommerceHubConnect;

  await flushElement(el);

  if (
    shouldStubInitialInteraction &&
    interactionResponseForTest.interactionId
  ) {
    await waitFor(
      () => !el.shadowRoot!.querySelector('.payment-method-skeletons'),
      'initial interaction refresh did not settle'
    );
  }

  return el;
};

const interactionResponseWithTestFeatures = (
  interactionResponse: InteractionResponse,
  defaultFeatures = true,
  defaultSourceMetadata = true,
  defaultCountry = true
): InteractionResponse => {
  const nextInteractionResponse =
    defaultFeatures || interactionResponse.features
      ? {
          ...interactionResponse,
          country: defaultCountry
            ? interactionResponse.country ?? 'USA'
            : interactionResponse.country,
          features: interactionResponse.features ?? [
            ...TEST_INTERACTION_FEATURES,
          ],
          keyId: interactionResponse.keyId ?? 'key-1',
        }
      : interactionResponse;

  if (!defaultSourceMetadata) {
    return nextInteractionResponse;
  }

  return {
    ...nextInteractionResponse,
    keyId: nextInteractionResponse.keyId ?? 'key-1',
    publicKey:
      nextInteractionResponse.publicKey ?? TEST_SOURCE_ENCRYPTION_PUBLIC_KEY,
    oauth: {
      ...TEST_SOURCE_CREATE_OAUTH,
      ...nextInteractionResponse.oauth,
    },
  };
};

const setOtpValue = async (el: CommerceHubConnect, value: string) => {
  const inputs = [
    ...el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input'),
  ];

  inputs.forEach((input, index) => {
    input.value = value[index] ?? '';
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
  });

  await flushElement(el);
};

const setOtpDigit = async (
  el: CommerceHubConnect,
  index: number,
  value: string
) => {
  const input =
    el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input')[index]!;

  input.value = value;
  input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
  await flushElement(el);
};

const keyOtpInput = async (
  el: CommerceHubConnect,
  index: number,
  key: string
) => {
  const input =
    el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input')[index]!;

  input.focus();
  input.dispatchEvent(
    new KeyboardEvent('keydown', {key, bubbles: true, composed: true})
  );
  await flushElement(el);
};

const pasteOtpValue = async (
  el: CommerceHubConnect,
  index: number,
  value: string
) => {
  const input =
    el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input')[index]!;
  const event = new Event('paste', {
    bubbles: true,
    cancelable: true,
    composed: true,
  }) as Event & {
    clipboardData: {
      getData: (type: string) => string;
    };
  };

  input.focus();
  Object.defineProperty(event, 'clipboardData', {
    value: {
      getData: (type: string) => (type === 'text' ? value : ''),
    },
  });
  input.dispatchEvent(event);
  await flushElement(el);
};

const setRequiredInfoSsnSegments = async (
  el: CommerceHubConnect,
  values: [string, string, string]
) => {
  const inputs = [
    ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
      '.required-info-ssn-input'
    ),
  ];

  inputs.forEach((input, index) => {
    input.value = values[index] ?? '';
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, composed: true})
    );
  });

  await flushElement(el);
};

const pasteRequiredInfoSsnValue = async (
  el: CommerceHubConnect,
  value: string
) => {
  const input = el.shadowRoot!.querySelector<HTMLInputElement>(
    '.required-info-ssn-input'
  )!;
  const event = new Event('paste', {
    bubbles: true,
    cancelable: true,
    composed: true,
  }) as Event & {
    clipboardData: {
      getData: (type: string) => string;
    };
  };

  input.focus();
  Object.defineProperty(event, 'clipboardData', {
    value: {
      getData: (type: string) => (type === 'text' ? value : ''),
    },
  });
  input.dispatchEvent(event);
  await flushElement(el);
};

const clickAction = async (el: CommerceHubConnect, action: string) => {
  let button = el.shadowRoot!.querySelector<HTMLButtonElement>(
    `button[data-action="${action}"]`
  );

  if (!button && (action === 'add-card' || action === 'add-bank-account')) {
    el.shadowRoot!.querySelector<HTMLButtonElement>(
      'button[data-action="open-add-payment-source"]'
    )!.click();
    await flushElement(el);
    button = el.shadowRoot!.querySelector<HTMLButtonElement>(
      `button[data-action="${action}"]`
    );

    if (!button) {
      return;
    }
  }

  if (!button) {
    throw new Error(`${action} action was not rendered`);
  }

  button.click();
  await flushElement(el);
};

const pressEscape = async (el: CommerceHubConnect) => {
  el.shadowRoot!.querySelector<HTMLElement>('.widget-frame')!.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      composed: true,
    })
  );
  await flushElement(el);
};

const openPaymentSourceMenu = async (
  el: CommerceHubConnect,
  paymentMethodId: string
) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="toggle-payment-source-menu"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
};

const markPaymentSourceAsDefault = async (
  el: CommerceHubConnect,
  paymentMethodId: string
) => {
  await openPaymentSourceMenu(el, paymentMethodId);
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="mark-payment-source-default"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
};

const requestPaymentSourceDeletion = async (
  el: CommerceHubConnect,
  paymentMethodId: string
) => {
  await openPaymentSourceMenu(el, paymentMethodId);
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="delete-payment-source"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
};

const selectRequiredInfoFile = async (
  el: CommerceHubConnect,
  fileName: string
) => {
  const input = el.shadowRoot!.querySelector<HTMLInputElement>(
    '.required-info-file-input'
  )!;
  const file = new File(['synthetic document'], fileName, {
    type: 'application/pdf',
  });

  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [file],
  });
  input.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  await flushElement(el);
};

const setRequiredInfoValue = async (
  el: CommerceHubConnect,
  label: string,
  value: string
) => {
  const input = [
    ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
      '.required-info-text-input'
    ),
  ].find((candidate) => {
    const inputLabel = el
      .shadowRoot!.querySelector(`label[for="${candidate.id}"]`)
      ?.textContent?.trim();

    return inputLabel === label;
  })!;

  input.value = value;
  input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
  await flushElement(el);
};

const setFieldValue = async (
  el: CommerceHubConnect,
  id: string,
  value: string
) => {
  const input = el.shadowRoot!.querySelector<HTMLInputElement>(`#${id}`)!;

  input.value = value;
  input.dispatchEvent(new InputEvent('input', {bubbles: true}));
  await flushElement(el);
};

const setSelectValue = async (
  el: CommerceHubConnect,
  id: string,
  value: string
) => {
  const select = el.shadowRoot!.querySelector<HTMLSelectElement>(`#${id}`)!;

  select.value = value;
  select.dispatchEvent(new Event('change', {bubbles: true}));
  await flushElement(el);
};

const blurField = async (el: CommerceHubConnect, id: string) => {
  const input = el.shadowRoot!.querySelector<HTMLInputElement>(`#${id}`)!;

  input.dispatchEvent(new FocusEvent('blur', {bubbles: true, composed: true}));
  await flushElement(el);
};

const waitForRequest = async (
  requests: CapturedRequest[],
  path: string,
  method = 'POST'
) => {
  await waitFor(
    () =>
      requests.some(
        (request) =>
          request.method === method && new URL(request.url).pathname === path
      ),
    `${method} ${path} was not requested`
  );
};

const waitForActionEnabled = async (el: CommerceHubConnect, action: string) => {
  await waitFor(
    () =>
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        `button[data-action="${action}"]`
      )?.disabled === false,
    `${action} was not enabled`
  );
};

const selectCanadianBusinessBankSchema = async (el: CommerceHubConnect) => {
  await waitFor(
    () =>
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
      'Select bank account type',
    'Canadian bank schema chooser did not render'
  );
  const currencySelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
    '#instrument-schema-currency'
  )!;
  currencySelect.value = 'CAD';
  currencySelect.dispatchEvent(new Event('change', {bubbles: true}));
  await flushElement(el);

  const accountTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
    '#instrument-schema-account-type'
  )!;
  accountTypeSelect.value = 'BUSINESS';
  accountTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));
  await flushElement(el);

  const paymentTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
    '#instrument-schema-payment-type'
  )!;
  paymentTypeSelect.value = 'Canadian';
  paymentTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));
  await flushElement(el);
  await clickAction(el, 'select-instrument-schema');
  await waitFor(
    () => Boolean(el.shadowRoot!.querySelector('input[name="accountNumber"]')),
    'manual bank form did not render'
  );
};

const assertSourceCreateHeaders = (request: CapturedRequest) => {
  assert.equal(request.headers.get('x-interaction-id'), 'interaction-payment');
  assert.equal(
    request.headers.get('Authorization'),
    'Bearer test-access-token'
  );
  assert.equal(request.headers.get('Api-Key'), 'test-client-id');
  assert.equal(request.headers.get('Auth-Token-Type'), 'Bearer');
  assert.equal(request.headers.get('x-key-id'), 'key-1');
};

const assertPartyCountryTenderConfigRequest = (
  request: CapturedRequest,
  country: string
) => {
  assert.equal(request.method, 'POST');
  assert.equal(
    request.url,
    `${TEST_COMMERCE_HUB_BASE_URL}/party/configuration-inquiry`
  );
  assert.equal(request.headers.get('x-interaction-id'), 'interaction-payment');
  assert.equal(
    request.headers.get('Authorization'),
    'Bearer test-access-token'
  );
  assert.equal(request.headers.get('Accept'), 'application/json');
  assert.include(request.headers.get('Content-Type') ?? '', 'application/json');
  assert.match(
    request.headers.get('Client-Id') ?? '',
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u
  );
  assert.match(
    request.headers.get('User-Id') ?? '',
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u
  );
  assert.equal(request.credentials, 'include');
  assert.deepEqual(JSON.parse(request.bodyText), {
    configurationType: 'COUNTRY_TENDER',
    country,
  });
};

const assertNoMaskRequests = (requests: CapturedRequest[]) => {
  assert.deepEqual(
    requests
      .filter((request) =>
        new URL(request.url).pathname.startsWith('/interaction/source/mask/')
      )
      .map((request) => `${request.method} ${new URL(request.url).pathname}`),
    []
  );
};

const decryptSourceValue = async (encryptedValue: string): Promise<string> => {
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(TEST_SOURCE_ENCRYPTION_PRIVATE_KEY),
    {name: 'RSA-OAEP', hash: 'SHA-512'},
    false,
    ['decrypt']
  );
  const decryptedValue = await crypto.subtle.decrypt(
    {name: 'RSA-OAEP'},
    privateKey,
    base64ToArrayBuffer(encryptedValue)
  );

  return new TextDecoder().decode(decryptedValue);
};

const pemToArrayBuffer = (pem: string): ArrayBuffer => {
  const base64Value = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s/g, '');

  return base64ToArrayBuffer(base64Value);
};

const base64ToArrayBuffer = (base64Value: string): ArrayBuffer => {
  const binaryValue = atob(base64Value);
  const bytes = new Uint8Array(binaryValue.length);

  for (let index = 0; index < binaryValue.length; index += 1) {
    bytes[index] = binaryValue.charCodeAt(index);
  }

  return bytes.buffer;
};

const deferredResponse = () => {
  let resolve!: (response: Response) => void;
  const promise = new Promise<Response>((innerResolve) => {
    resolve = innerResolve;
  });

  return {promise, resolve};
};

const captureMinimumOverlayTimer = () => {
  const originalSetTimeout = window.setTimeout;
  let capturedDelay: number | undefined;
  let capturedHandler: (() => void) | undefined;

  window.setTimeout = ((handler: TimerHandler, timeout?: number) => {
    capturedDelay = Number(timeout);
    capturedHandler = () => {
      if (typeof handler === 'function') {
        handler();
      }
    };

    return 1;
  }) as typeof window.setTimeout;

  return {
    get delay() {
      return capturedDelay;
    },
    release() {
      capturedHandler?.();
    },
    restore() {
      window.setTimeout = originalSetTimeout;
    },
  };
};

const fillNewCardForm = async (el: CommerceHubConnect) => {
  await setFieldValue(el, 'card-label', 'Ada corporate card');
  await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
  await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
  await setFieldValue(el, 'expiration-date', '04/30');
  await setFieldValue(el, 'card-cvv', '123');
  await setSelectValue(el, 'billing-country', 'US');
  await setFieldValue(el, 'billing-address-line-1', '1 Main St');
  await setFieldValue(el, 'billing-address-line-2', 'Suite 100');
  await setFieldValue(el, 'billing-city', 'New York');
  await setSelectValue(el, 'billing-state', 'NY');
  await setFieldValue(el, 'billing-zip', '10001');
};

const savedBillingAddressResponse = () => ({
  interactionId: 'interaction-payment',
  status: 'PAYMENT_SOURCE_REQUESTED',
  billerAddress: [
    {
      id: 'billing-1',
      recipientNameOrAddress: 'Ada Lovelace',
      street: '1 Main St',
      city: 'New York',
      stateOrProvince: 'NY',
      postalCode: '10001',
      country: 'US',
    },
  ],
});

const recordOutputEvents = (el: Element) => {
  const successEvents: CustomEvent<PaymentSource>[] = [];
  const addPaymentMethodEvents: CustomEvent<PaymentSource>[] = [];
  const verifyPaymentMethodEvents: CustomEvent<PaymentSource>[] = [];
  const deletePaymentMethodEvents: CustomEvent<string>[] = [];
  const listPaymentMethodsEvents: CustomEvent<PaymentSource[]>[] = [];
  const transferEvents: CustomEvent<NativeAccountTransaction>[] = [];
  const errorEvents: CustomEvent<unknown>[] = [];
  const eventEvents: CustomEvent<{
    type?: string;
    name?: string;
    screen?: string;
    previousScreen?: string;
    isBackAction?: boolean;
  }>[] = [];
  const eventOrder: string[] = [];

  el.addEventListener('onSelect', (event) => {
    eventOrder.push('onSelect');
    successEvents.push(event as CustomEvent<PaymentSource>);
  });
  el.addEventListener('onAddPaymentMethod', (event) => {
    eventOrder.push('onAddPaymentMethod');
    addPaymentMethodEvents.push(event as CustomEvent<PaymentSource>);
  });
  el.addEventListener('onVerifyPaymentMethod', (event) => {
    eventOrder.push('onVerifyPaymentMethod');
    verifyPaymentMethodEvents.push(event as CustomEvent<PaymentSource>);
  });
  el.addEventListener('onDeletePaymentMethod', (event) => {
    eventOrder.push('onDeletePaymentMethod');
    deletePaymentMethodEvents.push(event as CustomEvent<string>);
  });
  el.addEventListener('onListPaymentMethods', (event) => {
    eventOrder.push('onListPaymentMethods');
    listPaymentMethodsEvents.push(event as CustomEvent<PaymentSource[]>);
  });
  el.addEventListener('onTransfer', (event) => {
    eventOrder.push('onTransfer');
    transferEvents.push(event as CustomEvent<NativeAccountTransaction>);
  });
  el.addEventListener('onError', (event) => {
    eventOrder.push('onError');
    errorEvents.push(event as CustomEvent<unknown>);
  });
  el.addEventListener('onEvent', (event) => {
    eventOrder.push('onEvent');
    eventEvents.push(
      event as CustomEvent<{
        type?: string;
        name?: string;
        screen?: string;
        previousScreen?: string;
        isBackAction?: boolean;
      }>
    );
  });

  return {
    successEvents,
    addPaymentMethodEvents,
    verifyPaymentMethodEvents,
    deletePaymentMethodEvents,
    listPaymentMethodsEvents,
    transferEvents,
    errorEvents,
    eventEvents,
    eventOrder,
  };
};

type VerificationStatus = NonNullable<
  PaymentSource['verificationInfo']
>['status'];

interface TestPaymentSdkEvent {
  type?: string;
  [key: string]: unknown;
}

interface TestPaymentSdkInitConfiguration {
  apiKey: string;
  accessToken: string;
  configId: string;
  containerId: string;
  appearance?: {
    branding?: {
      backgroundColor?: string;
      primaryColor?: string;
      primaryTextColor?: string;
      secondaryTextColor?: string;
      buttonColor?: string;
      buttonTextColor?: string;
      dangerColor?: string;
      successColor?: string;
      borderColor?: string;
      placeholderColor?: string;
      fontFamily?: string;
      borderRadius?: string;
    };
  };
  environment?: string;
  locale?: string;
  aggregatorSessionId?: string;
  publicKey?: string;
  pToken?: string;
  embed?: boolean;
  width?: string | number;
  height?: string | number;
  onEvent: (event: TestPaymentSdkEvent) => void | Promise<void>;
}

const paymentSdkWindow = window as Window & {
  PaymentSDK?: {
    init: (configuration: TestPaymentSdkInitConfiguration) => void;
    destroy?: () => void;
  };
};

const completePayByBankFlow = async ({
  finalizedStatus,
  verificationStatus,
  verificationSourceId,
  verificationDocs = [{docType: 'BANK_STATEMENT', mandatory: true}] as const,
  requiredInfoStep2Status,
  requiredInfoStep2SourceId,
  requiredInfoStep2Responses,
  requiredInfoFailurePath,
  requiredInfoUploadResponse,
}: {
  finalizedStatus: VerificationStatus;
  verificationStatus?: VerificationStatus;
  verificationSourceId?: string;
  verificationDocs?: NonNullable<
    NonNullable<PaymentSource['verificationInfo']>['docs']
  >;
  requiredInfoStep2Status?: VerificationStatus;
  requiredInfoStep2SourceId?: string;
  requiredInfoStep2Responses?: Array<{
    status: VerificationStatus;
    sourceId?: string;
    docs?: NonNullable<PaymentSource['verificationInfo']>['docs'];
  }>;
  requiredInfoFailurePath?: string;
  requiredInfoUploadResponse?: Promise<Response>;
}) => {
  const requests: CapturedRequest[] = [];
  let initConfig: TestPaymentSdkInitConfiguration | undefined;
  let requiredInfoStep2ResponseIndex = 0;
  let attachedSourceId: string | undefined;
  const resolvedStatus = verificationStatus ?? finalizedStatus;
  const resolvedVerificationInfo = verificationStatus
    ? {
        status: resolvedStatus,
        docs: verificationDocs,
      }
    : finalizedStatus === 'REQUIRE_INFO'
    ? {
        status: resolvedStatus,
        docs: [
          {docType: 'BANK_STATEMENT', mandatory: true},
          {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
        ] as const,
      }
    : {status: resolvedStatus};
  const finalizedVerificationInfo = verificationStatus
    ? resolvedVerificationInfo
    : finalizedStatus === 'REQUIRE_INFO'
    ? resolvedVerificationInfo
    : {status: finalizedStatus};
  const requiredInfoFinalVerificationInfo = requiredInfoStep2Status
    ? requiredInfoStep2Status === 'REQUIRE_INFO'
      ? {status: requiredInfoStep2Status, docs: verificationDocs}
      : {status: requiredInfoStep2Status}
    : resolvedVerificationInfo;
  let authoritativeSourceId = verificationSourceId ?? 'bank-new';
  let authoritativeVerificationInfo: NonNullable<
    PaymentSource['verificationInfo']
  > = {
    ...finalizedVerificationInfo,
    docs: finalizedVerificationInfo.docs
      ? [...finalizedVerificationInfo.docs]
      : undefined,
  };

  paymentSdkWindow.PaymentSDK = {
    init: (configuration) => {
      initConfig = configuration;
    },
    destroy: () => undefined,
  };

  window.fetch = async (input: RequestInfo | URL) => {
    const request = input instanceof Request ? input : new Request(input);
    requests.push({
      url: request.url,
      method: request.method,
      headers: new Headers(request.headers),
      bodyText: await request.clone().text(),
      credentials: request.credentials,
    });

    const pathname = new URL(request.url).pathname;

    if (pathname === '/interaction/source/pbb/session') {
      return new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (
      pathname === '/interaction/source/pbb/session/agg-session-1/p-token-1'
    ) {
      authoritativeSourceId = verificationSourceId ?? 'bank-new';
      authoritativeVerificationInfo = {
        ...finalizedVerificationInfo,
        docs: finalizedVerificationInfo.docs
          ? [...finalizedVerificationInfo.docs]
          : undefined,
      };

      return new Response(
        JSON.stringify({
          sourceId: verificationSourceId ?? 'bank-new',
          ...finalizedVerificationInfo,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (pathname === '/interaction/verify/step1' && verificationStatus) {
      authoritativeSourceId = verificationSourceId ?? authoritativeSourceId;
      authoritativeVerificationInfo = {
        status: verificationStatus,
        docs: verificationDocs,
      };

      return new Response(
        JSON.stringify({
          sourceId: verificationSourceId,
          status: verificationStatus,
          docs: verificationDocs,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (
      pathname.startsWith('/interaction/doc/upload/') ||
      pathname === '/interaction/verify/uploadField'
    ) {
      if (requiredInfoUploadResponse) {
        return requiredInfoUploadResponse;
      }

      if (pathname === requiredInfoFailurePath) {
        return new Response(
          JSON.stringify({message: 'Document upload failed'}),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      return new Response(undefined, {status: 200});
    }

    if (
      pathname === '/interaction/verify/step2' &&
      (requiredInfoStep2Status || requiredInfoStep2Responses)
    ) {
      const step2Response =
        requiredInfoStep2Responses?.[
          Math.min(
            requiredInfoStep2ResponseIndex,
            requiredInfoStep2Responses.length - 1
          )
        ] ?? requiredInfoFinalVerificationInfo;
      const responseSourceId =
        step2Response.status === 'VERIFIED'
          ? requiredInfoStep2SourceId
          : undefined;
      const step2ResponseSourceId =
        'sourceId' in step2Response ? step2Response.sourceId : undefined;

      requiredInfoStep2ResponseIndex += 1;
      authoritativeSourceId =
        responseSourceId ?? step2ResponseSourceId ?? authoritativeSourceId;
      authoritativeVerificationInfo = {
        ...step2Response,
        docs: step2Response.docs ? [...step2Response.docs] : undefined,
      };

      return new Response(
        JSON.stringify({
          ...step2Response,
          sourceId: responseSourceId ?? step2ResponseSourceId,
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }

    const attachMatch = pathname.match(
      /^\/interaction\/source\/([^/]+)\/attach$/
    );

    if (attachMatch) {
      attachedSourceId = decodeURIComponent(attachMatch[1]);

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: {
            id: attachedSourceId,
            tenderType: 'BankAccount',
            name: 'Operating account',
            verificationInfo: requiredInfoFinalVerificationInfo,
            bankAccount: {
              bankName: 'Commerce National Bank',
              accountNumber: '9876543210',
            },
          },
          paymentSources: [
            {
              id: attachedSourceId,
              tenderType: 'BankAccount',
              name: 'Operating account',
              verificationInfo: requiredInfoFinalVerificationInfo,
              bankAccount: {
                bankName: 'Commerce National Bank',
                accountNumber: '9876543210',
              },
            },
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    const markDefaultMatch =
      request.method === 'PATCH'
        ? pathname.match(/^\/interaction\/source\/([^/]+)$/)
        : null;

    if (markDefaultMatch) {
      attachedSourceId = decodeURIComponent(markDefaultMatch[1]);

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    }

    if (pathname === '/interaction') {
      const refreshedSourceId = attachedSourceId ?? authoritativeSourceId;
      const authoritativeSource = {
        id: refreshedSourceId,
        tenderType: 'BankAccount' as const,
        name: 'Operating account',
        verificationInfo: attachedSourceId
          ? requiredInfoFinalVerificationInfo
          : authoritativeVerificationInfo,
        bankAccount: {
          bankName: 'Commerce National Bank',
          accountNumber: '9876543210',
        },
      };

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: attachedSourceId
            ? 'PAYMENT_SOURCE_ATTACHED'
            : 'PAYMENT_SOURCE_REQUESTED',
          selectedSource: attachedSourceId ? authoritativeSource : undefined,
          paymentSources: [authoritativeSource],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    return new Response(JSON.stringify({message: 'Unexpected request'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  };

  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    country: ' usa ',
    paymentSources: [],
  });
  const events = recordOutputEvents(el);

  await clickAction(el, 'add-pay-by-bank');
  await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
  await initConfig!.onEvent({type: 'success'});
  await flushElement(el);

  return {el, requests, ...events};
};

suite('commerce-hub-connect flow', () => {
  const originalFetch = window.fetch;
  const originalPaymentSdk = paymentSdkWindow.PaymentSDK;
  const originalConsoleError = console.error;

  teardown(() => {
    window.fetch = originalFetch;
    paymentSdkWindow.PaymentSDK = originalPaymentSdk;
    console.error = originalConsoleError;
    document
      .querySelectorAll('script[data-commerce-hub-pay-by-bank-sdk="true"]')
      .forEach((script) => script.remove());
  });

  test('renders a configuration error when interaction response is missing', async () => {
    let fetchCount = 0;
    window.fetch = async () => {
      fetchCount += 1;
      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .baseURL=${TEST_COMMERCE_HUB_BASE_URL}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Configuration required'
    );
    assert.include(
      el.shadowRoot!.querySelector('[part="alert"]')?.textContent?.trim(),
      'CommerceHub Connect requires an interaction response before it can load payment methods.'
    );
    assert.notExists(el.shadowRoot!.querySelector('.source-action'));
    assert.equal(fetchCount, 0);
  });

  test('initial successful interaction refresh emits listed payment sources', async () => {
    const listedSource: PaymentSource = {
      tenderType: 'Card',
      id: 'card-listed-1',
      name: 'Listed card',
      verificationInfo: {status: 'VERIFIED'},
      card: {
        network: 'Visa',
        cardNumber: '4111111111111111',
      },
    };

    window.fetch = async () =>
      new Response(
        JSON.stringify({
          interactionId: 'interaction-list',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [listedSource],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );

    const host = await fixture<HTMLDivElement>(testingHtml`<div></div>`);
    const el = document.createElement(
      'commerce-hub-connect'
    ) as CommerceHubConnect;
    const {listPaymentMethodsEvents, errorEvents} = recordOutputEvents(el);

    el.interactionResponse = {
      interactionId: 'interaction-list',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };
    el.baseURL = TEST_COMMERCE_HUB_BASE_URL;
    host.append(el);
    await waitFor(
      () => listPaymentMethodsEvents.length === 1,
      'initial list event was not emitted'
    );
    await flushElement(el);

    assert.deepEqual(listPaymentMethodsEvents[0].detail, [listedSource]);
    assert.lengthOf(errorEvents, 0);
  });

  test('emits onEvent for screenload and back navigation actions', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-action-events',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-action-events',
          name: 'Action events card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
          },
        },
      ],
    });

    const {eventEvents} = recordOutputEvents(el);

    await flushElement(el);

    const canonicalInitialScreenLoadEvent = eventEvents.find(
      (event) =>
        event.detail.type === 'view' &&
        event.detail.name === 'view_loaded' &&
        event.detail.screen === 'payment-methods-list'
    );
    assert.exists(canonicalInitialScreenLoadEvent);

    await clickAction(el, 'add-card');
    await flushElement(el);

    const cardFormScreenLoadEvent = eventEvents.find(
      (event) =>
        event.detail.type === 'view' &&
        event.detail.name === 'view_loaded' &&
        event.detail.screen === 'card-form'
    );
    assert.exists(cardFormScreenLoadEvent);

    await clickAction(el, 'back-to-payment-methods');
    await flushElement(el);

    const canonicalBackActionEvent = eventEvents.find(
      (event) =>
        event.detail.type === 'action' &&
        event.detail.name === 'back-to-payment-methods'
    );
    assert.exists(canonicalBackActionEvent);
    assert.equal(canonicalBackActionEvent?.detail.isBackAction, true);

    const returnToListEvent = eventEvents.find(
      (event) =>
        event.detail.type === 'view' &&
        event.detail.name === 'view_loaded' &&
        event.detail.screen === 'payment-methods-list' &&
        event.detail.previousScreen === 'card-form'
    );
    assert.exists(returnToListEvent);
  });

  test('renders OTP pending with SDK v3 title, verify CTA before resend, and compact inputs', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter verification code'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'We sent a one-time code to shopper@example.com.'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.equal(
      el.shadowRoot!.querySelector('.otp-support-copy')?.textContent?.trim(),
      "Didn't receive the code?"
    );
    assert.equal(
      getComputedStyle(
        el.shadowRoot!.querySelector<HTMLElement>('.otp-support')!
      ).display,
      'grid'
    );
    assert.lengthOf(el.shadowRoot!.querySelectorAll('.otp-input'), 6);
    assert.equal(
      getComputedStyle(el.shadowRoot!.querySelector<HTMLElement>('.otp-input')!)
        .minHeight,
      '44px'
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          'button[data-action="verify-otp"], button[data-action="resend-otp"]'
        ),
      ].map((node) => node.dataset.action),
      ['verify-otp', 'resend-otp']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="resend-otp"]')
        ?.textContent?.trim(),
      'Resend code'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Verify'
    );
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        'button[data-action="verify-otp"]'
      )!.disabled
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        'button[data-action="verify-otp"] .button-icon-check'
      )
    );
  });

  test('renders OTP copy from partial designConfig overrides', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-otp',
        status: 'OTP_VALIDATION_PENDING',
        email: 'shopper@example.com',
      },
      {
        copy: {
          otp: {
            title: 'Confirm account access',
            subtitle: 'Use the code sent by Commerce Hub.',
            resendPrefix: 'Need another code?',
            resendButton: 'Send a new code',
            verifyButton: 'Confirm code',
          },
        },
      }
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Confirm account access'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'Use the code sent by Commerce Hub.'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.otp-resend-prefix')?.textContent?.trim(),
      'Need another code?'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="resend-otp"]')
        ?.textContent?.trim(),
      'Send a new code'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Confirm code'
    );
  });

  test('renders OTP failed with entered digits, danger alert, red inputs, and Try again CTA', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
    });

    await setOtpValue(el, '987654');
    el.interactionResponse = {
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_FAILED',
      email: 'shopper@example.com',
    };
    await flushElement(el);

    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input')].map(
        (input) => input.value
      ),
      ['9', '8', '7', '6', '5', '4']
    );
    assert.include(
      el.shadowRoot!.querySelector('[role="alert"]')?.textContent?.trim(),
      'code does not match'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.otp-group')
        ?.classList.contains('otp-group-error'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Try again'
    );

    await setOtpDigit(el, 0, '6');

    assert.equal(el.interactionResponse?.status, 'OTP_VALIDATION_PENDING');
    assert.notExists(el.shadowRoot!.querySelector('[role="alert"]'));
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Verify'
    );
  });

  test('OTP input supports arrow navigation, backspace retreat, and paste distribution', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
    });
    const inputs = [
      ...el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input'),
    ];

    await setOtpDigit(el, 0, '1');
    assert.equal(el.shadowRoot!.activeElement, inputs[1]);

    await setOtpDigit(el, 1, '2');
    await setOtpDigit(el, 2, '3');

    await keyOtpInput(el, 1, 'ArrowRight');
    assert.equal(el.shadowRoot!.activeElement, inputs[2]);

    await keyOtpInput(el, 2, 'ArrowLeft');
    assert.equal(el.shadowRoot!.activeElement, inputs[1]);

    await keyOtpInput(el, 2, 'Backspace');
    assert.deepEqual(
      inputs.map((input) => input.value),
      ['1', '2', '', '', '', '']
    );
    assert.equal(el.shadowRoot!.activeElement, inputs[1]);

    await pasteOtpValue(el, 1, '23456');
    assert.deepEqual(
      inputs.map((input) => input.value),
      ['1', '2', '3', '4', '5', '6']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="verify-otp"]')
        ?.getAttribute('disabled'),
      null
    );
  });

  test('renders payment methods with radios, row menus, and consolidated add', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
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
          tenderType: 'Card',
          id: 'card-2',
          name: 'Travel card',
          verificationInfo: {status: 'DECLINED'},
          card: {
            network: 'Mastercard',
            cardNumber: '5555555555554444',
          },
        },
      ],
    });

    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ];

    assert.deepEqual(
      rows.map((row) => row.dataset.paymentMethodId),
      ['card-1', 'bank-1', 'card-2']
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.exists(rows[0].querySelector('.payment-method-radio'));
    assert.notExists(rows[1].querySelector('.payment-method-radio'));
    assert.notExists(rows[2].querySelector('.payment-method-radio'));
    assert.equal(rows[0].tagName, 'DIV');
    assert.equal(rows[0].dataset.action, undefined);
    assert.equal(rows[1].dataset.action, undefined);
    assert.equal(rows[2].dataset.action, undefined);
    assert.notExists(rows[0].querySelector('.payment-method-default-label'));
    assert.equal(
      rows[0].querySelector('.payment-method-title')?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      rows[0].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Visa xx 4242'
    );
    assert.notExists(rows[0].querySelector('.payment-method-status'));
    assert.equal(
      rows[0].querySelector('.verification-status-badge')?.textContent?.trim(),
      'Ready'
    );
    assert.exists(rows[0].querySelector('[data-payment-method-icon="visa"]'));
    assert.notExists(rows[0].querySelector('.payment-method-status-icon'));
    assert.notExists(rows[0].querySelector('.payment-method-chevron'));
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      rows[1].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Bank account xx 3210'
    );
    assert.exists(rows[1].querySelector('[data-payment-method-icon="bank"]'));
    assert.notExists(rows[1].querySelector('.payment-method-status'));
    assert.equal(
      rows[1].querySelector('.verification-status-badge')?.textContent?.trim(),
      'Needs review'
    );
    assert.notExists(rows[1].querySelector('.payment-method-status-icon'));
    assert.notExists(rows[1].querySelector('.payment-method-chevron'));
    assert.equal(
      rows[2].querySelector('.payment-method-title')?.textContent?.trim(),
      'Travel card'
    );
    assert.equal(
      rows[2].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Mastercard xx 4444'
    );
    assert.exists(
      rows[2].querySelector('[data-payment-method-icon="mastercard"]')
    );
    assert.notExists(rows[2].querySelector('.payment-method-status'));
    assert.equal(
      rows[2].querySelector('.verification-status-badge')?.textContent?.trim(),
      "Can't use"
    );
    assert.notExists(rows[2].querySelector('.payment-method-status-icon'));
    assert.notExists(rows[2].querySelector('.payment-method-chevron'));
    assert.equal(
      getComputedStyle(rows[1]).backgroundColor,
      'rgb(255, 255, 255)'
    );
    assert.equal(getComputedStyle(rows[0]).paddingTop, '9px');
    assert.equal(getComputedStyle(rows[0]).columnGap, '10px');
    assert.equal(
      getComputedStyle(
        rows[0].querySelector<HTMLElement>('.payment-method-title')!
      ).fontWeight,
      '600'
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.widget-header-action [data-action="open-add-payment-source"]'
      )
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.payment-method-add-footer [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['attach-payment-source', 'open-add-payment-source']
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="toggle-payment-source-edit-mode"]'
      )
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '[data-action="toggle-payment-source-menu"]'
      ),
      3
    );
    assert.notExists(el.shadowRoot!.querySelector('.source-action-link'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-transfer"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );

    await clickAction(el, 'open-add-payment-source');
    const tenderOptions = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-action-links .source-action'
      ),
    ];
    assert.deepEqual(
      tenderOptions.map((option) => option.dataset.action),
      ['add-card', 'add-pay-by-bank', 'add-ach-manually']
    );
    assert.deepEqual(
      tenderOptions.map((option) =>
        option
          .querySelector('.source-action-title')
          ?.textContent?.trim()
      ),
      ['Credit or debit card', 'Pay by Bank', 'Manual bank details']
    );
    assert.deepEqual(
      tenderOptions.map(
        (option) =>
          option.querySelector<HTMLImageElement>(
            '.source-action-brand-image'
          )?.src
      ),
      [
        CARD_SOURCE_ACTION_BRAND_IMAGE,
        PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE,
        MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
      ]
    );
    await clickAction(el, 'add-card');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add card'
    );
    assert.notExists(el.shadowRoot!.querySelector('.tender-tabs'));
  });

  test('clicking an under-review saved source row does not start verification', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
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
    });

    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-row'
      ),
    ];

    rows[1].click();
    await flushElement(el);

    assert.equal(rows[1].tagName, 'DIV');
    assert.equal(rows[1].dataset.action, undefined);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.lengthOf(requests, 0);
  });

  test('clicking a declined saved source row leaves it inert with a cannot-use badge', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Travel card',
          verificationInfo: {status: 'DECLINED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111114242',
          },
        },
      ],
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.payment-method-row'
    )!.click();
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      "Can't use"
    );
    assert.lengthOf(requests, 0);
  });

  test('renders payment methods copy from partial designConfig overrides', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        selectedSource: {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'card-1',
            name: 'Corporate card',
          },
        ],
      },
      {
        copy: {
          paymentMethods: {
            title: 'Choose payment',
            subtitle: 'Select a saved method for this order.',
            addBankAccountTitle: 'Use bank account',
            addBankAccountSubtitle: 'Connect checking or savings',
            addCardTitle: 'Use card',
            addCardSubtitle: 'Add debit or credit card',
            continueButton: 'Pay securely',
            continuingButton: 'Paying...',
          },
        },
      }
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Choose payment'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
    await openPaymentSourceMenu(el, 'card-1');
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="verify-payment-source"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="delete-payment-source"]')
        ?.textContent?.trim(),
      'Remove'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="open-add-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="attach-payment-source"]')
        ?.textContent?.trim(),
      'Pay securely'
    );
    assert.notExists(el.shadowRoot!.querySelector('.source-action-link'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
  });

  test('applies widget, visible shell border, and payment selection designConfig colors', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'card-1',
            name: 'Corporate card',
            verificationInfo: {status: 'UNDER_REVIEW'},
            card: {
              network: 'Visa',
              cardNumber: '4111111111114242',
            },
          },
        ],
      },
      {
        colors: {
          widgetBackground: '#f8fbff',
          border: '#91a7ff',
          paymentMethodBackground: '#fff7ed',
        },
      }
    );

    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const paymentMethod = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row'
    )!;
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-widget-background').trim(),
      '#f8fbff'
    );
    assert.equal(
      getComputedStyle(el)
        .getPropertyValue('--chc-payment-method-background')
        .trim(),
      '#fff7ed'
    );
    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-border').trim(),
      '#91a7ff'
    );
    assert.equal(getComputedStyle(shell).backgroundColor, 'rgb(248, 251, 255)');
    assert.equal(getComputedStyle(shell).borderTopStyle, 'solid');
    assert.equal(getComputedStyle(shell).borderTopWidth, '1px');
    assert.notEqual(getComputedStyle(shell).borderTopColor, 'transparent');
    assert.equal(getComputedStyle(shell).borderRadius, '8px');
    assert.equal(
      getComputedStyle(paymentMethod).borderTopColor,
      'rgba(0, 0, 0, 0)'
    );
    assert.equal(
      getComputedStyle(paymentMethod).backgroundColor,
      'rgb(255, 247, 237)'
    );
  });

  test('dismisses the add-payment sheet immediately when manual bank details is selected', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'USA',
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

    await clickAction(el, 'open-add-payment-source');
    el.shadowRoot!
      .querySelector<HTMLButtonElement>('[data-action="add-ach-manually"]')!
      .click();
    await el.updateComplete;

    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
  });

  test('renders no saved payment methods without a Continue CTA', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.notExists(el.shadowRoot!.querySelector('.empty-state'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-header-action'));
    const emptyTenderButtons = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-action-links .source-action'
      ),
    ];
    assert.deepEqual(
      emptyTenderButtons.map((button) => ({
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
          title: 'Credit or debit card',
          subtitle: 'Add your card details',
        },
        {
          action: 'add-pay-by-bank',
          title: 'Pay by Bank',
          subtitle: 'Directly connect with your bank account',
        },
        {
          action: 'add-ach-manually',
          title: 'Manual bank details',
          subtitle: 'Add your account details manually',
        },
      ]
    );
    assert.deepEqual(
      emptyTenderButtons.map(
        (button) =>
          button.querySelector<HTMLImageElement>('.source-action-brand-image')
            ?.src
      ),
      [
        CARD_SOURCE_ACTION_BRAND_IMAGE,
        PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE,
        MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
      ]
    );
    for (const button of emptyTenderButtons) {
      assert.equal(
        getComputedStyle(button).backgroundColor,
        'rgb(255, 255, 255)'
      );
    }
    assert.notExists(el.shadowRoot!.querySelector('.source-action-link'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-add-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
  });

  test('filters USA split bank tenders and preserves the non-USA bank tender', async () => {
    const cases: Array<{
      country?: string;
      allowedTenderTypes: NonNullable<
        InteractionResponse['allowedTenderTypes']
      >;
      actions: string[];
      brandImages?: string[];
    }> = [
      {
        country: ' usa ',
        allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
        actions: ['add-card', 'add-pay-by-bank', 'add-ach-manually'],
      },
      {
        country: 'US',
        allowedTenderTypes: ['CARD'],
        actions: ['add-card'],
      },
      {
        country: 'USA',
        allowedTenderTypes: ['BANK_ACCOUNT'],
        actions: ['add-pay-by-bank', 'add-ach-manually'],
      },
      {
        country: 'CA',
        allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
        actions: ['add-card', 'add-bank-account'],
        brandImages: [
          CARD_SOURCE_ACTION_BRAND_IMAGE,
          MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
        ],
      },
      {
        country: undefined,
        allowedTenderTypes: ['BANK_ACCOUNT'],
        actions: ['add-bank-account'],
      },
    ];

    for (const testCase of cases) {
      const el = await renderConnect(
        {
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          country: testCase.country,
          allowedTenderTypes: testCase.allowedTenderTypes,
          paymentSources: [],
        },
        undefined,
        TEST_COMMERCE_HUB_BASE_URL,
        {defaultCountry: testCase.country !== undefined}
      );

      assert.deepEqual(
        [
          ...el.shadowRoot!.querySelectorAll<HTMLElement>(
            '.payment-action-links [data-action]'
          ),
        ].map((button) => button.dataset.action),
        testCase.actions
      );
      if (testCase.brandImages) {
        assert.deepEqual(
          [
            ...el.shadowRoot!.querySelectorAll<HTMLImageElement>(
              '.payment-action-links .source-action-brand-image'
            ),
          ].map((image) => image.src),
          testCase.brandImages
        );
      }
    }
  });

  test('shows payment method skeleton rows while refreshing interaction payment sources', async () => {
    const pendingInteraction = deferredResponse();

    window.fetch = async () => pendingInteraction.promise;

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
      },
      undefined,
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.exists(el.shadowRoot!.querySelector('.payment-method-skeletons'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('.payment-method-skeleton-row'),
      3
    );
    assert.notExists(el.shadowRoot!.querySelector('.empty-state'));
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));

    pendingInteraction.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await waitFor(
      () =>
        !el.shadowRoot!.querySelector('.payment-method-skeletons') &&
        el.shadowRoot!.querySelectorAll('.payment-action-links .source-action')
          .length === 2,
      'empty payment-source state did not render after refresh'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-header-action'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
          '.payment-action-links .source-action'
        ),
      ].map((button) => button.dataset.action),
      ['add-card', 'add-bank-account']
    );
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
  });

  test('renders no-saved-methods copy from partial designConfig overrides', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        country: 'CA',
        paymentSources: [],
      },
      {
        copy: {
          noSavedPaymentMethods: {
            title: 'Add payment',
            subtitle: 'Start with a new payment method.',
            emptyTitle: 'Nothing saved yet',
            emptyMessage: 'Add a payment method to keep going.',
            addBankAccountTitle: 'Connect bank',
            addBankAccountSubtitle: 'Connect checking or savings',
            addCardTitle: 'Add card',
            addCardSubtitle: 'Use card number and CVV',
          },
        },
      }
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'Start with a new payment method.'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.empty-state-title')?.textContent?.trim(),
      'Nothing saved yet'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.empty-state-message')?.textContent?.trim(),
      'Add a payment method to keep going.'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-header-action'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
          '.payment-action-links .source-action'
        ),
      ].map((button) => ({
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
          subtitle: 'Use card number and CVV',
        },
        {
          action: 'add-bank-account',
          title: 'Connect bank',
          subtitle: 'Connect checking or savings',
        },
      ]
    );
    assert.notExists(el.shadowRoot!.querySelector('.source-action-link'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-add-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
  });

  test('opens the add card screen with the SDK v3 compact card-entry layout and header back link', async () => {
    const requests: CapturedRequest[] = [];

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        void configuration.onEvent({type: 'cancel'});
      },
      destroy: () => undefined,
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({billingAddress: []}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
      ],
    });

    await clickAction(el, 'add-card');

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/customer'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add card'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLLabelElement>('.field-label'),
      ].map((label) => label.textContent?.trim()),
      [
        'Card Name',
        'Card number',
        'Expiration',
        'CVC',
        'Full name',
        'Billing address',
        'Country or region',
        'Address',
        'Address line 2',
        'City',
        'State',
        'ZIP code',
      ]
    );
    assert.equal(
      getComputedStyle(
        el.shadowRoot!.querySelector<HTMLElement>('.field-label')!
      ).fontWeight,
      '400'
    );
    assert.exists(el.shadowRoot!.querySelector('#billing-address'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLOptionElement>(
          '#billing-address option'
        ),
      ].map((option) => option.textContent?.trim()),
      ['Add new billing address']
    );
    assert.exists(
      el.shadowRoot!.querySelector<HTMLSelectElement>('#billing-country')
    );
    assert.exists(
      el.shadowRoot!.querySelector<HTMLSelectElement>('#billing-state')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#card-label')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#card-number')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#name-on-card')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#expiration-date')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      false
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#card-cvv')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      false
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-number')?.maxLength,
      23
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#expiration-date')
        ?.maxLength,
      7
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-cvv')?.maxLength,
      4
    );
    const backButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-back-button[data-action="back-to-payment-methods"]'
    );
    assert.equal(backButton?.getAttribute('aria-label'), 'Back');
    assert.equal(backButton?.textContent?.trim(), '');
    assert.exists(backButton?.closest('.widget-heading-row'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="use-bank-account-instead"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="save-card"]')
        ?.textContent?.trim(),
      'Save card'
    );
  });

  test('Escape refreshes payment methods from each internal child flow', async () => {
    const requests: CapturedRequest[] = [];
    const paymentSources: PaymentSource[] = [
      {
        tenderType: 'Card',
        id: 'card-verified',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {network: 'Visa', cardNumber: '4111111111114242'},
      },
      {
        tenderType: 'BankAccount',
        id: 'bank-verified',
        name: 'Operating account',
        verificationInfo: {status: 'VERIFIED'},
        bankAccount: {accountNumber: '1111111111111111'},
      },
      {
        tenderType: 'BankAccount',
        id: 'bank-required-info',
        name: 'Account requiring info',
        verificationInfo: {
          status: 'REQUIRE_INFO',
          docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
        },
        bankAccount: {accountNumber: '2222222222222222'},
      },
      {
        tenderType: 'Card',
        id: 'card-not-verified',
        name: 'Card to verify',
        verificationInfo: {status: 'NOT_VERIFIED'},
        card: {network: 'Mastercard', cardNumber: '5555555555554444'},
      },
    ];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-navigation',
            status: 'PAYMENT_SOURCE_REQUESTED',
            country: 'CA',
            features: ['ADD_ACCOUNT', 'SELECT', 'TRANSFER'],
            paymentSources,
            billerAddress: [],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse();
      }

      if (pathname === '/interaction/verify/step1') {
        return new Response(JSON.stringify({message: 'Verification failed'}), {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-navigation',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      paymentSources,
      billerAddress: [],
    });
    const interactionRefreshCount = () =>
      requests.filter(
        (request) =>
          request.method === 'GET' &&
          new URL(request.url).pathname === '/interaction'
      ).length;
    const expectEscapeRefresh = async (expectedCount: number) => {
      await pressEscape(el);
      await waitFor(
        () =>
          interactionRefreshCount() === expectedCount &&
          el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
            'Payment methods' &&
          (el.shadowRoot!.activeElement as HTMLElement | null)?.dataset
            .action === 'open-add-payment-source',
        `Escape refresh ${expectedCount} did not settle with list focus`
      );
    };

    await clickAction(el, 'add-card');
    await expectEscapeRefresh(1);

    await clickAction(el, 'add-bank-account');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Select bank account type',
      'bank child flow did not render'
    );
    await expectEscapeRefresh(2);

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="verify-payment-source"][data-payment-method-id="bank-required-info"]'
    )!.click();
    await flushElement(el);
    await expectEscapeRefresh(3);

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="verify-payment-source"][data-payment-method-id="card-not-verified"]'
    )!.click();
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Card not verified',
      'verification outcome did not render'
    );
    await expectEscapeRefresh(4);

    await clickAction(el, 'open-transfer');
    await expectEscapeRefresh(5);

    assert.equal(interactionRefreshCount(), 5);
  });

  test('card validation shows touched errors and all errors after Save', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');

    const saveButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="save-card"]'
    )!;

    assert.isTrue(saveButton.disabled);
    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    await setFieldValue(el, 'card-number', '1');
    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    await blurField(el, 'card-number');
    assert.include(
      el
        .shadowRoot!.querySelector('#card-number')
        ?.closest('.field')
        ?.querySelector('.field-error')?.textContent ?? '',
      'Enter a valid card number.'
    );

    await setFieldValue(el, 'card-number', '4111111111111111');
    assert.notExists(
      el
        .shadowRoot!.querySelector('#card-number')
        ?.closest('.field')
        ?.querySelector('.field-error')
    );

    await setFieldValue(el, 'card-label', 'Corporate@Card');
    await setFieldValue(el, 'name-on-card', 'x');
    await setFieldValue(el, 'expiration-date', '1');
    await setFieldValue(el, 'card-cvv', '1');
    await setSelectValue(el, 'billing-country', 'US');
    await setFieldValue(el, 'billing-address-line-1', 'x');
    await setFieldValue(el, 'billing-city', 'x');
    await setSelectValue(el, 'billing-state', 'WI');
    await setFieldValue(el, 'billing-zip', 'x');

    assert.isFalse(saveButton.disabled);
    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    await clickAction(el, 'save-card');

    assert.exists(el.shadowRoot!.querySelector('.field-error'));
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card'
    );
    assert.include(
      el
        .shadowRoot!.querySelector('#card-label')
        ?.closest('.field')
        ?.querySelector('.field-error')?.textContent ?? '',
      'Card name can only contain letters and numbers.'
    );

    const expirationBounds = el
      .shadowRoot!.querySelector('#expiration-date')!
      .closest('.field-control')!
      .getBoundingClientRect();
    const cvcBounds = el
      .shadowRoot!.querySelector('#card-cvv')!
      .closest('.field-control')!
      .getBoundingClientRect();

    assert.closeTo(cvcBounds.top, expirationBounds.top, 0.5);
    assert.closeTo(cvcBounds.height, expirationBounds.height, 0.5);

    await setFieldValue(el, 'billing-zip', '53045');
    assert.notExists(
      el
        .shadowRoot!.querySelector('#billing-zip')
        ?.closest('.field')
        ?.querySelector('.field-error')
    );

    await setFieldValue(el, 'billing-address-line-1', '');
    assert.isTrue(saveButton.disabled);
    assert.include(
      el
        .shadowRoot!.querySelector('#billing-address-line-1')
        ?.closest('.field')
        ?.querySelector('.field-error')?.textContent ?? '',
      'Enter an address.'
    );

    await setFieldValue(el, 'card-number', '');
    await blurField(el, 'card-number');
    assert.include(
      el
        .shadowRoot!.querySelector('#card-number')
        ?.closest('.field')
        ?.querySelector('.field-error')?.textContent ?? '',
      'Enter a valid card number.'
    );
  });

  test('shows a collapsed billing address summary when a saved address is selected', async () => {
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      if (request.url.endsWith('/interaction')) {
        return new Response(JSON.stringify(savedBillingAddressResponse()), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
      ],
    });

    await clickAction(el, 'add-card');
    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector('.billing-address-summary')
          ?.textContent?.includes('1 Main St, New York, NY 10001') ?? false
    );

    assert.notExists(el.shadowRoot!.querySelector('#billing-address'));
    assert.notExists(el.shadowRoot!.querySelector('#billing-country'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.billing-address-summary-label')
        ?.textContent?.trim(),
      'Billing address'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="change-billing-address"]')
        ?.textContent?.trim(),
      'Change'
    );
  });

  test('billing address Change reveals saved address selector', async () => {
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      if (request.url.endsWith('/interaction')) {
        return new Response(JSON.stringify(savedBillingAddressResponse()), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
      ],
    });

    await clickAction(el, 'add-card');
    await waitFor(() =>
      Boolean(el.shadowRoot!.querySelector('.billing-address-summary'))
    );
    await clickAction(el, 'change-billing-address');

    assert.exists(el.shadowRoot!.querySelector('#billing-address'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLOptionElement>(
          '#billing-address option'
        ),
      ].map((option) => option.textContent?.trim()),
      ['1 Main St, New York, NY 10001', 'Add new billing address']
    );
    assert.notExists(el.shadowRoot!.querySelector('.billing-address-summary'));
  });

  test('selecting Add new billing address reveals billing address fields', async () => {
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      if (request.url.endsWith('/interaction')) {
        return new Response(JSON.stringify(savedBillingAddressResponse()), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
      ],
    });

    await clickAction(el, 'add-card');
    await waitFor(() =>
      Boolean(el.shadowRoot!.querySelector('.billing-address-summary'))
    );
    await clickAction(el, 'change-billing-address');
    await setSelectValue(el, 'billing-address', '__new__');

    assert.exists(el.shadowRoot!.querySelector('#billing-address'));
    assert.exists(el.shadowRoot!.querySelector('#billing-country'));
    assert.exists(el.shadowRoot!.querySelector('#billing-address-line-1'));
    assert.exists(el.shadowRoot!.querySelector('#billing-city'));
    assert.exists(el.shadowRoot!.querySelector('#billing-state'));
    assert.exists(el.shadowRoot!.querySelector('#billing-zip'));
  });

  test('card save shows an overlay, preserves typed values, and disables form controls while pending', async () => {
    const pendingBillingAddress = deferredResponse();

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/billing-address')) {
        return pendingBillingAddress.promise;
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'VERIFIED',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });
    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');

    const saveButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      'button[data-action="save-card"]'
    )!;
    const cardLabel =
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-label')!;
    const cardNumber =
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-number')!;

    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-busy'),
      'true'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-loading-title')
        ?.textContent?.trim(),
      'Saving card'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-loading-helper')?.textContent ?? '',
      'Securely saving'
    );
    assert.equal(saveButton.disabled, true);
    assert.exists(saveButton.querySelector('.button-spinner'));
    assert.equal(cardLabel.value, 'Ada corporate card');
    assert.equal(cardNumber.value, '4111 1111 1111 1111');
    assert.equal(cardLabel.disabled, true);
    assert.equal(cardNumber.disabled, true);

    pendingBillingAddress.resolve(
      new Response(JSON.stringify({value: 'billing-from-api-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      })
    );
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment methods',
      'card save did not complete'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="toggle-payment-source-menu"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
  });

  test('singleton schema options cascade to bank details', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([
          TEST_INSTRUMENT_SCHEMAS[0],
          {
            ...TEST_INSTRUMENT_SCHEMAS[0],
            bavSupportedCode: 'CAD-Canadian-P',
          },
        ]);
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-singleton-cascade',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CAN',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitForRequest(requests, '/party/configuration-inquiry');
    await waitFor(
      () =>
        Boolean(
          el.shadowRoot!.querySelector('#instrument-schema-account-type')
        ),
      'implicitly selected currency did not reveal account type'
    );

    const currencySelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-currency'
    )!;
    assert.equal(currencySelect.value, 'CAD');
    assert.isTrue(currencySelect.disabled);

    const accountTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-account-type'
    )!;
    assert.equal(accountTypeSelect.value, '');
    assert.isFalse(accountTypeSelect.disabled);
    assert.notExists(
      el.shadowRoot!.querySelector('#instrument-schema-payment-type')
    );

    accountTypeSelect.value = 'BUSINESS';
    accountTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));

    await waitFor(
      () =>
        el.shadowRoot!.querySelector<HTMLSelectElement>(
          '#instrument-schema-payment-type'
        )?.value === 'Canadian',
      'singleton payment type was not selected'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Select bank account type'
    );
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLSelectElement>(
        '#instrument-schema-payment-type'
      )!.disabled
    );
    assert.isFalse(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="select-instrument-schema"]'
      )!.disabled
    );
    assert.notExists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );

    await clickAction(el, 'select-instrument-schema');

    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Enter bank details',
      'Continue did not open bank details'
    );
    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
  });

  test('fully singleton schema response opens bank details automatically', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([TEST_INSTRUMENT_SCHEMAS[0]]);
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-fully-singleton',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CAN',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitForRequest(requests, '/party/configuration-inquiry');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Enter bank details',
      'fully singleton schema did not open bank details'
    );

    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="select-instrument-schema"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
  });

  test('single selectable schema opens bank details automatically', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([
          TEST_INSTRUMENT_SCHEMAS[0],
          {...TEST_INSTRUMENT_SCHEMAS[0], bavSupportedCode: ' '},
        ]);
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-single-selectable-schema',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CAN',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitForRequest(requests, '/party/configuration-inquiry');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Enter bank details',
      'single selectable schema did not open bank details'
    );

    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="select-instrument-schema"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
  });

  test('singleton parent dropdowns are disabled before an ambiguous payment type', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse(TEST_INSTRUMENT_SCHEMAS);
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-singleton-parents',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CAN',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitForRequest(requests, '/party/configuration-inquiry');
    await waitFor(
      () =>
        Boolean(
          el.shadowRoot!.querySelector('#instrument-schema-payment-type')
        ),
      'singleton parents did not reveal payment type'
    );

    const currencySelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-currency'
    )!;
    const accountTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-account-type'
    )!;
    const paymentTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-payment-type'
    )!;

    assert.equal(currencySelect.value, 'CAD');
    assert.isTrue(currencySelect.disabled);
    assert.equal(accountTypeSelect.value, 'BUSINESS');
    assert.isTrue(accountTypeSelect.disabled);
    assert.equal(paymentTypeSelect.value, '');
    assert.isFalse(paymentTypeSelect.disabled);
  });

  test('non-USA bank entry defaults to manual schema selection', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse();
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'GBR',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-ach-manually"]')
    );

    await clickAction(el, 'add-bank-account');
    await waitForRequest(requests, '/party/configuration-inquiry');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Select bank account type',
      'instrument schema chooser did not load'
    );

    const configRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/party/configuration-inquiry'
    )!;
    assertPartyCountryTenderConfigRequest(configRequest, 'GBR');

    const currencySelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-currency'
    )!;
    assert.exists(currencySelect);
    assert.deepEqual(
      [...currencySelect.options].map((option) => option.textContent?.trim()),
      ['Select currency', 'Canadian Dollar']
    );
    assert.equal(currencySelect.value, 'CAD');
    assert.isTrue(currencySelect.disabled);

    const accountTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-account-type'
    )!;
    assert.deepEqual(
      [...accountTypeSelect.options].map((option) =>
        option.textContent?.trim()
      ),
      ['Select account type', 'Business', 'Personal']
    );
    assert.notExists(
      el.shadowRoot!.querySelector('#instrument-schema-payment-type')
    );

    const continueButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="select-instrument-schema"]'
    )!;
    assert.isTrue(continueButton.disabled);
    assert.notExists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );

    accountTypeSelect.value = 'BUSINESS';
    accountTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);

    const paymentTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-payment-type'
    )!;
    assert.deepEqual(
      [...paymentTypeSelect.options].map((option) =>
        option.textContent?.trim()
      ),
      ['Select payment type', 'Bank Account', 'POINTERAC']
    );
    assert.isTrue(continueButton.disabled);

    paymentTypeSelect.value = 'Canadian';
    paymentTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);

    assert.isFalse(continueButton.disabled);
    assert.notExists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );

    await clickAction(el, 'select-instrument-schema');
    await waitFor(
      () =>
        Boolean(
          el.shadowRoot!.querySelector('input[name="accountHolderName"]')
        ),
      'selected instrument schema form did not render'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter bank details'
    );
    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms'),
      'JSONForms host should render'
    );
    assert.exists(
      el.shadowRoot!.querySelector('input[name="accountHolderName"]'),
      'accountHolderName should render'
    );
    assert.exists(
      el.shadowRoot!.querySelector('input[name="address.city"]'),
      'address.city should render'
    );
    assert.exists(
      el.shadowRoot!.querySelector('input[name="institutionNumber"]'),
      'institutionNumber should render'
    );
    assert.exists(
      el.shadowRoot!.querySelector('input[name="transitNumber"]'),
      'transitNumber should render'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('input[name="interacAccount"]')
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>(
        'input[name="accountNumber"]'
      )?.type,
      'text'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="save-ach-manual"]')
    );
    const saveBankAccountButton =
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="save-bank-account"]'
      )!;

    assert.isTrue(saveBankAccountButton.disabled);
    assert.notInclude(el.shadowRoot!.textContent, 'City is required');
    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    const setSchemaBankField = async (name: string, value: string) => {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    };

    const accountNumber = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="accountNumber"]'
    )!;
    assert.equal(accountNumber.maxLength, 12);

    await setSchemaBankField('accountNumber', 'abc');
    assert.notInclude(
      el.shadowRoot!.textContent,
      'Enter a valid account number'
    );

    accountNumber.dispatchEvent(
      new FocusEvent('blur', {bubbles: true, composed: true})
    );
    await flushElement(el);
    assert.include(el.shadowRoot!.textContent, 'Enter a valid account number');

    await setSchemaBankField('accountNumber', '1234567');
    assert.notInclude(
      el.shadowRoot!.textContent,
      'Enter a valid account number'
    );

    await setSchemaBankField('accountHolderName', 'x');
    await setSchemaBankField('accountNumber', 'abc');
    await setSchemaBankField('address.city', 'x');
    await setSchemaBankField('institutionNumber', 'x');
    await setSchemaBankField('transitNumber', 'x');

    assert.isFalse(saveBankAccountButton.disabled);
    assert.include(el.shadowRoot!.textContent, 'Enter a valid account number');
    assert.notInclude(el.shadowRoot!.textContent, 'City is required');

    await clickAction(el, 'save-bank-account');

    assert.include(el.shadowRoot!.textContent, 'Enter a valid account number');
    assert.equal(accountNumber.getAttribute('aria-invalid'), 'true');
    assert.exists(
      el.shadowRoot!.querySelector(
        `#${accountNumber.getAttribute('aria-describedby')}`
      )
    );

    const accountHolderName = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="accountHolderName"]'
    )!;

    await setSchemaBankField('accountHolderName', 'Draft account holder');
    assert.equal(accountHolderName.getAttribute('aria-invalid'), 'false');
    assert.notInclude(
      el.shadowRoot!.textContent,
      'Must be at least 3 characters'
    );

    await setSchemaBankField('address.city', '');
    assert.isTrue(saveBankAccountButton.disabled);
    assert.include(el.shadowRoot!.textContent, 'City is required');
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/ach'
    );

    await clickAction(el, 'back-to-instrument-schema-selection');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Select bank account type'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLSelectElement>(
        '#instrument-schema-currency'
      )?.value,
      'CAD'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLSelectElement>(
        '#instrument-schema-account-type'
      )?.value,
      'BUSINESS'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLSelectElement>(
        '#instrument-schema-payment-type'
      )?.value,
      'Canadian'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );

    await clickAction(el, 'select-instrument-schema');
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>(
        'input[name="accountHolderName"]'
      )?.value,
      ''
    );

    await clickAction(el, 'back-to-instrument-schema-selection');
    const retainedAccountType = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-account-type'
    )!;
    retainedAccountType.value = 'PERSONAL';
    retainedAccountType.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);
    assert.equal(
      el.shadowRoot!.querySelector<HTMLSelectElement>(
        '#instrument-schema-payment-type'
      )?.value,
      ''
    );
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="select-instrument-schema"]'
      )!.disabled
    );

    retainedAccountType.value = 'BUSINESS';
    retainedAccountType.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);
    const retainedPaymentType = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-payment-type'
    )!;
    retainedPaymentType.value = 'Interac';
    retainedPaymentType.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);
    await clickAction(el, 'select-instrument-schema');

    assert.exists(el.shadowRoot!.querySelector('input[name="interacAccount"]'));
    assert.exists(el.shadowRoot!.querySelector('input[name="address.city"]'));
    assert.notExists(
      el.shadowRoot!.querySelector('input[name="accountNumber"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('input[name="institutionNumber"]')
    );

    const interacAccount = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="interacAccount"]'
    )!;
    interacAccount.value = 'not-an-email';
    interacAccount.dispatchEvent(new InputEvent('input', {bubbles: true}));
    await flushElement(el);
    assert.include(
      el.shadowRoot!.textContent,
      'Enter a valid interac registered email'
    );

    const requestedPaths = requests.map(
      (request) => new URL(request.url).pathname
    );
    assert.notInclude(requestedPaths, '/interaction/source/pbb/session');
    assert.notInclude(requestedPaths, '/form.json');
    assert.notInclude(requestedPaths, '/interaction/source/ach');
    assert.notInclude(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'PUT /interaction/source/pbb/session/agg-session-1/p-token-1'
    );

    await clickAction(el, 'back-to-instrument-schema-selection');
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="back-to-payment-methods"]')
    );
    await clickAction(el, 'back-to-payment-methods');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
  });

  test('legacy bank validation shows touched errors and all errors after Save', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([]);
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Enter bank details',
      'legacy bank form did not render'
    );

    const saveButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="save-bank-account"]'
    )!;
    const setLegacyBankField = async (name: string, value: string) => {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    };

    assert.isTrue(saveButton.disabled);
    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    await setLegacyBankField('accountNickname', 'Account');
    await setLegacyBankField('routingNumber', '1');
    await setLegacyBankField('accountNumber', '2');
    await setLegacyBankField('confirmAccountNumber', '3');

    assert.isFalse(saveButton.disabled);
    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="routingNumber"]'
    )!.dispatchEvent(new FocusEvent('blur', {bubbles: true, composed: true}));
    await flushElement(el);
    assert.include(el.shadowRoot!.textContent, 'Enter a routing number');

    await setLegacyBankField('routingNumber', '021000021');
    assert.notInclude(el.shadowRoot!.textContent, 'Enter a routing number');

    el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="confirmAccountNumber"]'
    )!.dispatchEvent(new FocusEvent('blur', {bubbles: true, composed: true}));
    await flushElement(el);
    assert.include(el.shadowRoot!.textContent, 'Account numbers must match');

    await setLegacyBankField('confirmAccountNumber', '2');
    assert.notInclude(el.shadowRoot!.textContent, 'Account numbers must match');

    await setLegacyBankField('confirmAccountNumber', '3');
    assert.include(el.shadowRoot!.textContent, 'Account numbers must match');

    await clickAction(el, 'save-bank-account');

    assert.include(el.shadowRoot!.textContent, 'Account numbers must match');
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/ach'
    );

    await setLegacyBankField('confirmAccountNumber', '2');
    assert.notInclude(el.shadowRoot!.textContent, 'Account numbers must match');

    await setLegacyBankField('routingNumber', '');
    assert.isTrue(saveButton.disabled);
    assert.include(el.shadowRoot!.textContent, 'Enter a routing number');
  });

  test('legacy bank fallback still creates a source through the original ACH endpoint', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([]);
      }

      if (pathname === '/interaction/source/ach') {
        return new Response(
          JSON.stringify({
            sourceId: 'legacy-bank-1',
            status: 'UNDER_REVIEW',
          }),
          {status: 201, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/interaction') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
              {
                tenderType: 'BankAccount',
                id: 'legacy-bank-1',
                name: 'Household checking',
                verificationInfo: {status: 'UNDER_REVIEW'},
                bankAccount: {
                  accountNumber: '12345678',
                  asset: {type: 'CURRENCY', id: 'USD'},
                },
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });
    const {addPaymentMethodEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-bank-account');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Enter bank details',
      'legacy bank form did not render'
    );

    for (const [name, value] of [
      ['accountNickname', 'Household checking'],
      ['routingNumber', '021000021'],
      ['accountNumber', '12345678'],
      ['confirmAccountNumber', '12345678'],
    ] as const) {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    }

    await waitForActionEnabled(el, 'save-bank-account');
    await clickAction(el, 'save-bank-account');
    await waitForRequest(requests, '/interaction/source/ach');
    await waitFor(
      () => addPaymentMethodEvents.length === 1,
      'legacy bank source event was not emitted'
    );
    await waitForRequest(requests, '/interaction', 'GET');
    const sourceRequest = requests.find(
      (request) => new URL(request.url).pathname === '/interaction/source/ach'
    )!;
    const sourceBody = JSON.parse(sourceRequest.bodyText);

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/v2/ach'
    );
    assert.equal(sourceBody.productCode, 'POACH');
    assert.equal(sourceBody.tenderType, 'BANK_ACCOUNT');
    assert.equal(
      await decryptSourceValue(sourceBody.bankAccount.routingNumber),
      '021000021'
    );
    assert.equal(
      await decryptSourceValue(sourceBody.bankAccount.accountNumber),
      '12345678'
    );
    assert.equal(sourceBody.bankAccount.asset.id, 'USD');
    assertSourceCreateHeaders(sourceRequest);
    assert.deepEqual(
      requests
        .filter((request) =>
          ['/interaction/source/ach', '/interaction'].includes(
            new URL(request.url).pathname
          )
        )
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      ['POST /interaction/source/ach', 'GET /interaction']
    );
    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.equal(addPaymentMethodEvents[0].detail.id, 'legacy-bank-1');
  });

  test('missing bank country opens the manual configuration error', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: '   ',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');

    assert.include(
      el.shadowRoot!.querySelector('[part="alert"]')?.textContent ?? '',
      'missing a country'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="back-to-payment-methods"]')
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/pbb/session'
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/party/configuration-inquiry'
    );
  });

  test('saves a valid manual Canadian bank account and sanitizes the emitted source', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/party/configuration-inquiry') {
        const canadianSchema = TEST_INSTRUMENT_SCHEMAS[0];

        return bankAccountCountryConfigResponse([
          {
            ...canadianSchema,
            properties: {
              ...canadianSchema.properties,
              'address.state': {
                type: 'string',
                title: 'Province',
                minLength: 1,
                'x-errorMessages': {
                  required: 'Province is required',
                },
              },
              'address.country': {
                type: 'string',
                title: 'Country',
                'x-errorMessages': {
                  required: 'Country is required',
                },
              },
            },
            required: [
              ...canadianSchema.required,
              'address.state',
              'address.country',
            ],
          },
        ]);
      }

      if (pathname === '/interaction/source/v2/ach') {
        return new Response(
          JSON.stringify({
            sourceId: 'bank-created-1',
            status: 'UNDER_REVIEW',
          }),
          {status: 201, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/interaction') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
              {
                tenderType: 'BankAccount',
                id: 'bank-created-1',
                name: 'Bob Bobson',
                verificationInfo: {status: 'UNDER_REVIEW'},
                bankAccount: {
                  accountNumber: '0000026',
                  asset: {type: 'CURRENCY', id: 'CAD'},
                  country: 'CA',
                },
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });
    const {addPaymentMethodEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-bank-account');
    await selectCanadianBusinessBankSchema(el);

    const saveButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      'button[data-action="save-bank-account"]'
    )!;
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>(
        'input[name="address.country"]'
      )?.value,
      'CA'
    );
    assert.isTrue(saveButton.disabled);

    const setBankField = async (name: string, value: string) => {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    };

    await setBankField('accountHolderName', 'Bob Bobson');
    await setBankField('accountNumber', '0000026');
    await setBankField('address.city', 'Toronto');
    await setBankField('address.state', 'ON');
    await setBankField('institutionNumber', '002');
    await setBankField('transitNumber', '12345');
    await waitForActionEnabled(el, 'save-bank-account');
    await clickAction(el, 'save-bank-account');
    await waitForRequest(requests, '/interaction/source/v2/ach');
    await waitFor(
      () => addPaymentMethodEvents.length === 1,
      'manual bank source event was not emitted'
    );
    await waitForRequest(requests, '/interaction', 'GET');

    const sourceRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/interaction/source/v2/ach'
    )!;
    const sourceBody = JSON.parse(sourceRequest.bodyText);
    const encryptedAccountNumber = sourceBody.accountNumber;

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/billing-address'
    );
    assert.equal(
      new URL(sourceRequest.url).searchParams.get('currencyCode'),
      'CAD'
    );
    assert.match(sourceBody.id, /^[0-9a-f-]{36}$/u);
    assert.deepEqual(sourceBody, {
      accountHolderName: 'Bob Bobson',
      accountNumber: encryptedAccountNumber,
      accountNumberReEntered: encryptedAccountNumber,
      address: {city: 'Toronto', state: 'ON', country: 'CA'},
      institutionNumber: '002',
      transitNumber: '12345',
      id: sourceBody.id,
      name: 'Bob Bobson',
      tenderType: 'BANK_ACCOUNT',
      bavSupportedCode: 'CAD-Canadian-B',
      productId: 'POLOCALBANK',
      countryCode: 'CA',
      currencyCode: 'CAD',
    });
    assert.equal(await decryptSourceValue(encryptedAccountNumber), '0000026');
    assert.notInclude(sourceRequest.bodyText, '0000026');
    assert.notInclude(sourceRequest.bodyText, '__bankBillingAddress');
    assert.notProperty(sourceBody, 'bankAccount');
    assert.notProperty(sourceBody, 'billingAddressId');
    assert.notProperty(sourceBody, 'productCode');
    assertSourceCreateHeaders(sourceRequest);
    assert.deepEqual(
      requests
        .filter((request) =>
          ['/interaction/source/v2/ach', '/interaction'].includes(
            new URL(request.url).pathname
          )
        )
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      ['POST /interaction/source/v2/ach', 'GET /interaction']
    );
    assert.lengthOf(addPaymentMethodEvents, 1);
    const emittedBankSource = addPaymentMethodEvents[0].detail as Extract<
      PaymentSource,
      {tenderType: 'BankAccount'}
    >;

    assert.equal(emittedBankSource.id, 'bank-created-1');
    assert.equal(emittedBankSource.accountHolderType, 'BUSINESS');
    assert.equal(emittedBankSource.bankAccount?.accountNumber, '0026');
    assert.notInclude(JSON.stringify(emittedBankSource), '0000026');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
  });

  test('schema-driven ACH v2 replaces stale address data and resolves an empty create response', async () => {
    const requests: CapturedRequest[] = [];
    let createdSourceId = '';

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;
      const bodyText = await request.clone().text();

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText,
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([TEST_INSTRUMENT_SCHEMAS[0]]);
      }

      if (pathname === '/interaction/source/v2/ach') {
        createdSourceId = JSON.parse(bodyText).id;
        return new Response(undefined, {
          status: 201,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
              {
                id: createdSourceId,
                tenderType: 'BankAccount',
                name: 'Bob Bobson',
                verificationInfo: {status: 'VERIFIED'},
                recipient: {
                  id: 'recipient-pending-1',
                  status: 'PENDING',
                },
                bankAccount: {
                  accountNumber: '0000026',
                  asset: {type: 'CURRENCY', id: 'CAD'},
                  country: 'CA',
                },
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
      billerAddress: savedBillingAddressResponse().billerAddress,
    });
    const {addPaymentMethodEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-bank-account');
    await selectCanadianBusinessBankSchema(el);
    await clickAction(el, 'change-bank-billing-address');
    await setSelectValue(el, 'bank-billing-address', '__new__');

    for (const [name, value] of [
      ['accountHolderName', 'Bob Bobson'],
      ['accountNumber', '0000026'],
      ['address.city', 'Stale city'],
      ['institutionNumber', '002'],
      ['transitNumber', '12345'],
    ] as const) {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    }

    await setSelectValue(el, 'bank-billing-address', 'billing-1');
    assert.notExists(
      el.shadowRoot!.querySelector('input[name="address.city"]')
    );
    await waitForActionEnabled(el, 'save-bank-account');
    await clickAction(el, 'save-bank-account');
    await waitFor(
      () => addPaymentMethodEvents.length === 1,
      'empty ACH v2 response was not resolved through interaction refresh'
    );

    const sourceRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/interaction/source/v2/ach'
    )!;
    const sourceBody = JSON.parse(sourceRequest.bodyText);

    assert.deepEqual(sourceBody.address, {id: 'billing-1'});
    assert.notInclude(sourceRequest.bodyText, 'Stale city');
    assert.include(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'GET /interaction'
    );
    assert.lengthOf(
      requests.filter(
        (request) =>
          request.method === 'GET' &&
          new URL(request.url).pathname === '/interaction'
      ),
      1
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/billing-address'
    );
    assert.equal(addPaymentMethodEvents[0].detail.id, createdSourceId);
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      'Verified, Pending'
    );
    assert.notExists(el.shadowRoot!.querySelector('.payment-method-radio'));
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="attach-payment-source"]'
      )!.disabled
    );
  });

  test('schema-driven ACH v2 waits out a pre-mutation interaction GET before resolving an empty create response', async () => {
    const requests: CapturedRequest[] = [];
    const staleInteraction = deferredResponse();
    let createdSourceId = '';
    let interactionGetCount = 0;

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;
      const bodyText = await request.clone().text();

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText,
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([TEST_INSTRUMENT_SCHEMAS[0]]);
      }

      if (pathname === '/interaction/source/v2/ach') {
        createdSourceId = JSON.parse(bodyText).id;
        return new Response(undefined, {
          status: 201,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction') {
        interactionGetCount += 1;

        if (interactionGetCount === 1) {
          return staleInteraction.promise;
        }

        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
              {
                id: createdSourceId,
                tenderType: 'BankAccount',
                name: 'Bob Bobson',
                verificationInfo: {status: 'VERIFIED'},
                bankAccount: {
                  accountNumber: '0000026',
                  asset: {type: 'CURRENCY', id: 'CAD'},
                  country: 'CA',
                },
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });
    const {addPaymentMethodEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-bank-account');
    await selectCanadianBusinessBankSchema(el);

    for (const [name, value] of [
      ['accountHolderName', 'Bob Bobson'],
      ['accountNumber', '0000026'],
      ['address.city', 'Toronto'],
      ['institutionNumber', '002'],
      ['transitNumber', '12345'],
    ] as const) {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    }

    await waitForActionEnabled(el, 'save-bank-account');
    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="save-bank-account"]'
    )!.click();
    const preMutationRefresh = (
      el as unknown as {
        fetchInteraction: (
          interactionId: string
        ) => Promise<InteractionResponse>;
      }
    ).fetchInteraction('interaction-payment');

    await waitForRequest(requests, '/interaction/source/v2/ach');
    assert.equal(interactionGetCount, 1);
    staleInteraction.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await preMutationRefresh;
    await waitFor(
      () => addPaymentMethodEvents.length === 1,
      'empty ACH v2 response was not resolved after the fresh interaction GET'
    );

    assert.equal(addPaymentMethodEvents[0].detail.id, createdSourceId);
    assert.deepEqual(
      requests
        .filter((request) =>
          ['/interaction/source/v2/ach', '/interaction'].includes(
            new URL(request.url).pathname
          )
        )
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'GET /interaction',
        'POST /interaction/source/v2/ach',
        'GET /interaction',
      ]
    );
    assert.lengthOf(addPaymentMethodEvents, 1);
  });

  test('schema-driven ACH v2 rejects an uncorrelated source after an empty create response', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([TEST_INSTRUMENT_SCHEMAS[0]]);
      }

      if (pathname === '/interaction/source/v2/ach') {
        return new Response(undefined, {
          status: 201,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
              {
                id: 'unrelated-bank-source',
                tenderType: 'BankAccount',
                name: 'Different account',
                verificationInfo: {status: 'UNDER_REVIEW'},
                bankAccount: {
                  accountNumber: '9999',
                  asset: {type: 'CURRENCY', id: 'CAD'},
                  country: 'CA',
                },
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });
    const {addPaymentMethodEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-bank-account');
    await selectCanadianBusinessBankSchema(el);

    for (const [name, value] of [
      ['accountHolderName', 'Bob Bobson'],
      ['accountNumber', '0000026'],
      ['address.city', 'Toronto'],
      ['institutionNumber', '002'],
      ['transitNumber', '12345'],
    ] as const) {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    }

    await waitForActionEnabled(el, 'save-bank-account');
    await clickAction(el, 'save-bank-account');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.alert-danger')?.textContent?.trim() ===
        'The bank account was created but could not be resolved from the interaction.',
      'uncorrelated ACH v2 source did not produce a submission error'
    );

    assert.lengthOf(addPaymentMethodEvents, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter bank details'
    );
    assert.include(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'GET /interaction'
    );
  });

  test('blocks manual bank account save when source encryption fails', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([TEST_INSTRUMENT_SCHEMAS[0]]);
      }

      if (pathname === '/interaction/billing-address') {
        return new Response(JSON.stringify({value: 'billing-bank-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
      publicKey: 'invalid-public-key',
    });

    await clickAction(el, 'add-bank-account');
    await selectCanadianBusinessBankSchema(el);

    for (const [name, value] of [
      ['accountHolderName', 'Bob Bobson'],
      ['accountNumber', '0000026'],
      ['address.city', 'Toronto'],
      ['institutionNumber', '002'],
      ['transitNumber', '12345'],
    ] as const) {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    }

    await waitForActionEnabled(el, 'save-bank-account');
    await clickAction(el, 'save-bank-account');
    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('.alert-danger')),
      'encryption failure was not rendered'
    );

    assert.exists(el.shadowRoot!.querySelector('input[name="accountNumber"]'));
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/ach'
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/v2/ach'
    );
  });

  test('US manual bank entry loads its USD schema before creating an ACH source', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: TEST_SOURCE_ENCRYPTION_PUBLIC_KEY,
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([
          {
            bavSupportedCode: 'USD-American-P',
            productId: 'POLOCALBANK',
            countryCode: 'US',
            currencyCode: 'USD',
            currencyName: 'US Dollar',
            type: 'object',
            properties: {
              accountNickname: {
                type: 'string',
                title: 'Account nickname',
                minLength: 1,
                'x-errorMessages': {
                  required: 'Account nickname is required',
                },
              },
              bsbCode: {
                type: 'string',
                title: 'Routing number',
                pattern: '$re$\\d{9}$re$',
                'x-errorMessages': {
                  required: 'Routing number is required',
                  pattern: 'Enter a valid routing number',
                },
              },
              accountNumber: {
                type: 'string',
                title: 'Account number',
                minLength: 4,
                'x-errorMessages': {
                  required: 'Account number is required',
                  minLength: 'Account number is too short',
                },
              },
              bankAccountType: {
                type: 'string',
                title: 'Bank account type',
                enum: ['CHECKING', 'SAVINGS'],
                'x-enumLabels': {
                  CHECKING: 'Checking account',
                  SAVINGS: 'Savings account',
                },
                'x-errorMessages': {
                  required: 'Bank account type is required',
                },
              },
              'address.country': {
                type: 'string',
                title: 'Country',
                'x-errorMessages': {
                  required: 'Country is required',
                },
              },
            },
            required: [
              'accountNickname',
              'bsbCode',
              'accountNumber',
              'bankAccountType',
              'address.country',
            ],
            uiSchema: {
              type: 'VerticalLayout',
              elements: [
                {type: 'Control', scope: '#/properties/accountNumber'},
                {type: 'Control', scope: '#/properties/bankAccountType'},
                {type: 'Control', scope: '#/properties/accountNickname'},
                {type: 'Control', scope: '#/properties/bsbCode'},
                {
                  type: 'Control',
                  scope: '#/properties/address/properties/country',
                },
              ],
            },
          },
        ]);
      }

      if (pathname === '/interaction/source/v2/ach') {
        return new Response(
          JSON.stringify({sourceId: 'bank-us-1', status: 'UNDER_REVIEW'}),
          {status: 201, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/interaction') {
        return new Response(JSON.stringify({message: 'Refresh unavailable'}), {
          status: 503,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'USA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });
    const {addPaymentMethodEvents, errorEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-ach-manually');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Select bank account type',
      'US instrument schema chooser did not load'
    );
    assert.isUndefined(initConfig);
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="back-to-payment-methods"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="back-to-bank-provider"]')
    );

    const configRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/party/configuration-inquiry'
    )!;
    assertPartyCountryTenderConfigRequest(configRequest, 'USA');

    const currencySelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-currency'
    )!;
    currencySelect.value = 'USD';
    currencySelect.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);

    const accountTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-account-type'
    )!;
    accountTypeSelect.value = 'PERSONAL';
    accountTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);

    const paymentTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-payment-type'
    )!;
    paymentTypeSelect.value = 'American';
    paymentTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);
    await clickAction(el, 'select-instrument-schema');

    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
    assert.notExists(el.shadowRoot!.querySelector('#ach-routing-number'));
    const renderedFieldNames = [
      ...el.shadowRoot!.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        '.bank-account-jsonforms input[name], .bank-account-jsonforms select[name]'
      ),
    ].map((field) => field.name);
    assert.deepEqual(renderedFieldNames, [
      'accountNumber',
      'bankAccountType',
      'accountNickname',
      'bsbCode',
      '__bankBillingAddress',
      'address.country',
    ]);
    const bankAccountTypeInput =
      el.shadowRoot!.querySelector<HTMLSelectElement>(
        'select[name="bankAccountType"]'
      )!;
    assert.deepEqual(
      [...bankAccountTypeInput.options].map((option) => ({
        value: option.value,
        label: option.textContent?.trim(),
      })),
      [
        {value: '', label: 'Select bank account type'},
        {value: 'CHECKING', label: 'Checking account'},
        {value: 'SAVINGS', label: 'Savings account'},
      ]
    );
    const accountNicknameInput = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="accountNickname"]'
    )!;
    const selectStyles = getComputedStyle(bankAccountTypeInput);
    const inputStyles = getComputedStyle(accountNicknameInput);
    assert.equal(selectStyles.minHeight, inputStyles.minHeight);
    assert.equal(selectStyles.borderRadius, inputStyles.borderRadius);
    assert.equal(selectStyles.backgroundColor, inputStyles.backgroundColor);
    assert.equal(selectStyles.paddingTop, inputStyles.paddingTop);
    assert.equal(
      bankAccountTypeInput.parentElement?.className,
      'jsonforms-select-control'
    );
    assert.equal(selectStyles.appearance, 'none');
    const countryInput = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="address.country"]'
    )!;
    assert.equal(countryInput.value, 'USA');
    assert.isTrue(countryInput.disabled);

    for (const [name, value] of [
      ['accountNickname', 'Household checking'],
      ['bsbCode', '051034492'],
      ['accountNumber', '123456789012'],
    ] as const) {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      )!;

      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await flushElement(el);
    }
    bankAccountTypeInput.value = 'SAVINGS';
    bankAccountTypeInput.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);

    await waitForActionEnabled(el, 'save-bank-account');
    await clickAction(el, 'save-bank-account');
    await waitForRequest(requests, '/interaction/source/v2/ach');
    await waitFor(
      () => addPaymentMethodEvents.length === 1,
      'US bank source event was not emitted'
    );
    await waitForRequest(requests, '/interaction', 'GET');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Bank account pending review',
      'local bank outcome was not preserved after refresh failure'
    );

    const sourceRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/interaction/source/v2/ach'
    )!;
    const sourceBody = JSON.parse(sourceRequest.bodyText);

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/billing-address'
    );
    assert.equal(await decryptSourceValue(sourceBody.bsbCode), '051034492');
    assert.notInclude(sourceRequest.bodyText, '051034492');
    assert.notProperty(sourceBody, 'routingCode');
    assert.equal(
      await decryptSourceValue(sourceBody.accountNumber),
      '123456789012'
    );
    assert.equal(sourceBody.accountNumberReEntered, sourceBody.accountNumber);
    assert.equal(
      new URL(sourceRequest.url).searchParams.get('currencyCode'),
      'USD'
    );
    assert.equal(sourceBody.name, 'Household checking');
    assert.notProperty(sourceBody, 'accountType');
    assert.equal(sourceBody.bankAccountType, 'SAVINGS');
    assert.deepEqual(sourceBody.address, {country: 'USA'});
    assert.equal(sourceBody.bavSupportedCode, 'USD-American-P');
    assert.equal(sourceBody.productId, 'POLOCALBANK');
    assert.equal(sourceBody.tenderType, 'BANK_ACCOUNT');
    assert.equal(sourceBody.countryCode, 'US');
    assert.equal(sourceBody.currencyCode, 'USD');
    const emittedUsBankSource = addPaymentMethodEvents[0].detail as Extract<
      PaymentSource,
      {tenderType: 'BankAccount'}
    >;

    assert.equal(emittedUsBankSource.accountHolderType, 'PERSONAL');
    assert.notProperty(sourceBody, 'bankAccount');
    assert.notProperty(sourceBody, 'billingAddressId');
    assertSourceCreateHeaders(sourceRequest);
    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.lengthOf(errorEvents, 0);
    assert.deepEqual(
      requests
        .filter((request) =>
          ['/interaction/source/v2/ach', '/interaction'].includes(
            new URL(request.url).pathname
          )
        )
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      ['POST /interaction/source/v2/ach', 'GET /interaction']
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/form.json'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
  });

  test('manual schema selection blocks and retries failed and malformed responses', async () => {
    const requests: CapturedRequest[] = [];
    let configAttempt = 0;
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/party/configuration-inquiry') {
        const attempt = configAttempt;
        configAttempt += 1;

        if (attempt === 0) {
          return new Response(
            JSON.stringify({message: 'Country tender config unavailable.'}),
            {status: 500, headers: {'Content-Type': 'application/json'}}
          );
        }

        if (attempt === 1) {
          return bankAccountCountryConfigResponse([
            {
              bavSupportedCode: 'CAD-Broken',
              productId: 'POLOCALBANK',
              countryCode: 'CA',
              currencyCode: 'CAD',
              currencyName: 'Canadian Dollar',
              type: 'object',
              properties: {
                accountNumber: {
                  type: 'string',
                  title: 'Account number',
                },
              },
              required: ['accountNumber'],
            },
            {
              bavSupportedCode: '   ',
              productId: 'POINTERAC',
              countryCode: 'CA',
              currencyCode: 'CAD',
              currencyName: 'Canadian Dollar',
              type: 'object',
              properties: {},
              required: [],
            },
          ]);
        }

        return bankAccountCountryConfigResponse();
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');

    for (let expectedAttempt = 1; expectedAttempt <= 2; expectedAttempt += 1) {
      await waitFor(
        () => configAttempt === expectedAttempt,
        'configuration attempt did not finish'
      );
      await waitFor(
        () => Boolean(el.shadowRoot!.querySelector('[part="alert"]')),
        'invalid configuration did not show a blocking error'
      );
      assert.notExists(
        el.shadowRoot!.querySelector('input[name="instrument-schema"]')
      );
      assert.notExists(
        el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
      );
      assert.exists(
        el.shadowRoot!.querySelector('[data-action="back-to-payment-methods"]')
      );
      assert.exists(
        el.shadowRoot!.querySelector('[data-action="add-ach-manually"]')
      );

      await clickAction(el, 'add-ach-manually');
    }

    await waitFor(
      () => configAttempt === 3,
      'valid configuration retry was not requested'
    );
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Select bank account type',
      'valid configuration retry did not show the chooser'
    );
    assert.lengthOf(
      requests.filter(
        (request) =>
          new URL(request.url).pathname === '/party/configuration-inquiry'
      ),
      3
    );
  });

  test('a singleton non-USA instrument schema opens details automatically', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse([TEST_INSTRUMENT_SCHEMAS[0]]);
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Enter bank details',
      'singleton schema did not open bank details'
    );

    const configRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/party/configuration-inquiry'
    )!;
    assertPartyCountryTenderConfigRequest(configRequest, 'CA');
    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="save-ach-manual"]')
    );

    await clickAction(el, 'back-to-payment-methods');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('#instrument-schema-currency')
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/form.json'
    );
  });

  test('manual instrument schema inquiry ignores a stale response after the interaction changes', async () => {
    const requests: CapturedRequest[] = [];
    const pendingConfig = deferredResponse();
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/party/configuration-inquiry') {
        return pendingConfig.promise;
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      country: 'CA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitForRequest(requests, '/party/configuration-inquiry');

    el.interactionResponse = {
      ...el.interactionResponse,
      interactionId: 'interaction-payment-next',
      paymentSources: [],
      selectedSource: undefined,
    };
    await flushElement(el);

    pendingConfig.resolve(bankAccountCountryConfigResponse());
    await flushElement(el);

    assert.notExists(
      el.shadowRoot!.querySelector('input[name="instrument-schema"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
  });

  test('card save opens required-info when the created card requires verification info', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/mask/card') {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/mask/cvv') {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/billing-address') {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/card') {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'REQUIRE_INFO',
            docs: [
              {docType: 'DRIVER_LICENSE_PHOTO', mandatory: true},
              {docType: 'DRIVER_LICENSE_NUMBER', mandatory: false},
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/interaction') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
              {
                id: 'card-created-1',
                tenderType: 'Card',
                name: 'Ada corporate card',
                verificationInfo: {
                  status: 'REQUIRE_INFO',
                  docs: [
                    {docType: 'DRIVER_LICENSE_PHOTO', mandatory: true},
                    {docType: 'DRIVER_LICENSE_NUMBER', mandatory: false},
                  ],
                },
                card: {
                  network: 'Visa',
                  nameOnCard: 'Ada Lovelace',
                  cardNumber: '4111111111111111',
                  expirationMonth: '04',
                  expirationYear: '2030',
                },
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      {
        colors: {
          primary: '#0f766e',
        },
      }
    );

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Complete account verification',
      'card required-info screen was not shown'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'POST /interaction/billing-address',
        'POST /interaction/source/card',
        'GET /interaction',
      ]
    );
    assertNoMaskRequests(requests);
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.required-info-card-field')].map(
        (node) => [
          node.getAttribute('data-required-info-card-field'),
          node.textContent?.trim(),
        ]
      ),
      [
        ['name', 'Ada Lovelace'],
        ['number', '•••• •••• •••• 1111'],
        ['expiry', '04/30'],
      ]
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.required-info-card-status')
        ?.textContent?.trim(),
      'Needs info'
    );
    const requiredInfoCard = el.shadowRoot!.querySelector<HTMLElement>(
      '.required-info-card'
    )!;
    const requiredInfoLabel = el.shadowRoot!.querySelector<HTMLElement>(
      '.required-info-card-label'
    )!;
    const requiredInfoField = el.shadowRoot!.querySelector<HTMLElement>(
      '.required-info-card-field'
    )!;
    const requiredInfoIconChip = el.shadowRoot!.querySelector<HTMLElement>(
      '.required-info-card-icon-chip'
    )!;
    const requiredInfoIconImage = el.shadowRoot!.querySelector<HTMLElement>(
      '.required-info-card-icon-image'
    )!;
    const requiredInfoDocuments = el.shadowRoot!.querySelector<HTMLElement>(
      '.required-info-documents'
    )!;
    const requiredInfoSectionTitle = el.shadowRoot!.querySelector<HTMLElement>(
      '.required-info-section-title'
    )!;

    const requiredInfoCardStyles = getComputedStyle(requiredInfoCard);

    assert.equal(
      requiredInfoSectionTitle.textContent?.trim(),
      'Information needed to complete verification'
    );
    assert.equal(getComputedStyle(requiredInfoDocuments).marginTop, '8px');
    assert.include(
      ['rgb(241, 247, 246)', 'color(srgb 0.943529 0.967765 0.965882)'],
      requiredInfoCardStyles.backgroundColor
    );
    assert.equal(requiredInfoCardStyles.borderTopStyle, 'solid');
    assert.equal(requiredInfoCardStyles.borderTopColor, 'rgb(229, 237, 245)');
    assert.equal(
      requiredInfoCardStyles.borderLeftColor,
      requiredInfoCardStyles.borderTopColor
    );
    assert.equal(
      requiredInfoCardStyles.borderLeftWidth,
      requiredInfoCardStyles.borderTopWidth
    );
    assert.equal(getComputedStyle(requiredInfoLabel).color, 'rgb(80, 97, 122)');
    assert.equal(getComputedStyle(requiredInfoField).color, 'rgb(6, 27, 49)');
    assert.equal(getComputedStyle(requiredInfoIconChip).borderTopStyle, 'none');
    assert.equal(getComputedStyle(requiredInfoIconChip).boxShadow, 'none');
    assert.equal(getComputedStyle(requiredInfoIconImage).maxWidth, '64px');
    assert.equal(getComputedStyle(requiredInfoIconImage).maxHeight, '48px');
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'REQUIRE_INFO'
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('card encryption uses local public-key encryption without mask requests', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');

    assertNoMaskRequests(requests);
  });

  test('card save keeps its completed under-review result when the authoritative refresh fails', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/mask/card') {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/mask/cvv') {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/billing-address') {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/card') {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'UNDER_REVIEW',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/interaction') {
        return new Response(JSON.stringify({message: 'Refresh unavailable'}), {
          status: 503,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });
    const {addPaymentMethodEvents, errorEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Verification pending review',
      'card under-review outcome was not shown'
    );

    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    const backButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-back-button[data-action="done-payment-source-verification"]'
    );
    assert.equal(backButton?.getAttribute('aria-label'), 'Back');
    assert.equal(backButton?.textContent?.trim(), '');
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.primitive-footer [data-action="done-payment-source-verification"]'
      )
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.lengthOf(errorEvents, 0);

    await clickAction(el, 'done-payment-source-verification');
    await waitFor(
      () =>
        requests.filter(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ).length === 2,
      'verification outcome return did not refresh the interaction'
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'POST /interaction/billing-address',
        'POST /interaction/source/card',
        'GET /interaction',
        'GET /interaction',
      ]
    );
  });

  test('card save shows declined outcome when card creation returns declined verificationStatus', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/mask/card') {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/mask/cvv') {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/billing-address') {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/card') {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'DECLINED',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment method declined',
      'card declined outcome was not shown'
    );

    assert.include(
      el.shadowRoot!.querySelector('.alert-danger')?.textContent?.trim() ?? '',
      'could not be verified'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'DECLINED'
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1/attach'
    );
  });

  test('formats card number and expiration inputs for different card standards', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({billingAddress: []}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await setFieldValue(el, 'card-number', '378282246310005');
    await setFieldValue(el, 'expiration-date', '0430');

    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-number')?.value,
      '3782 822463 10005'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#expiration-date')?.value,
      '04 / 30'
    );

    await setFieldValue(el, 'card-number', '4000000000000000002');

    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-number')?.value,
      '4000 0000 0000 0000 002'
    );
  });

  test('renders the card error screen without a widget close button', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/customer')) {
        return new Response(JSON.stringify({billingAddress: []}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/billing-address')) {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(JSON.stringify({message: 'Save failed'}), {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await setFieldValue(el, 'card-label', 'Ada corporate card');
    await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
    await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
    await setFieldValue(el, 'expiration-date', '04/30');
    await setFieldValue(el, 'card-cvv', '123');
    await setSelectValue(el, 'billing-country', 'US');
    await setFieldValue(el, 'billing-address-line-1', '1 Main St');
    await setFieldValue(el, 'billing-address-line-2', 'Suite 100');
    await setFieldValue(el, 'billing-city', 'New York');
    await setSelectValue(el, 'billing-state', 'NY');
    await setFieldValue(el, 'billing-zip', '10001');
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Credit card not saved',
      'card error screen did not render'
    );

    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="edit-card-details"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="use-different-method"]')
    );

    await clickAction(el, 'use-different-method');
    await clickAction(el, 'add-pay-by-bank');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment methods',
      'bank provider failure did not return to payment methods'
    );
    await clickAction(el, 'add-card');
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/customer'
    );
  });

  test('creates a verified card without a default checkbox or automatic attachment', async () => {
    const requests: CapturedRequest[] = [];
    const preMutationInteraction = deferredResponse();
    let interactionGetCount = 0;
    const staleSource: PaymentSource = {
      id: 'card-stale',
      tenderType: 'Card',
      name: 'Stale card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Visa', cardNumber: '4111111111114242'},
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/customer')) {
        return new Response(JSON.stringify({billingAddress: []}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/billing-address')) {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'VERIFIED',
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      if (request.url.endsWith('/interaction/source/card-created-1/attach')) {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_ATTACHED',
            selectedSource: {
              id: 'card-created-1',
              tenderType: 'Card',
              name: 'Attached card from source response',
              verificationInfo: {status: 'VERIFIED'},
              card: {
                network: 'Mastercard',
                cardNumber: '5555555555554444',
              },
            },
            paymentSources: [
              {
                id: 'card-created-1',
                tenderType: 'Card',
                name: 'Attached card from source response',
                verificationInfo: {status: 'VERIFIED'},
                card: {
                  network: 'Mastercard',
                  cardNumber: '5555555555554444',
                },
              },
            ],
            billerAddress: [],
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      if (request.url.endsWith('/interaction')) {
        interactionGetCount += 1;

        if (interactionGetCount === 1) {
          return preMutationInteraction.promise;
        }

        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
              {
                id: 'card-created-1',
                tenderType: 'Card',
                name: 'Authoritative corporate card',
                verificationInfo: {status: 'VERIFIED'},
                card: {
                  network: 'Mastercard',
                  nameOnCard: 'Ada Lovelace',
                  cardNumber: '5555555555554444',
                  expirationMonth: '04',
                  expirationYear: '2030',
                },
              },
            ],
            billerAddress: [],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [staleSource],
    });
    const {
      successEvents,
      addPaymentMethodEvents,
      listPaymentMethodsEvents,
      errorEvents,
      eventOrder,
    } = recordOutputEvents(el);

    await clickAction(el, 'add-card');
    await waitForRequest(requests, '/interaction', 'GET');
    await fillNewCardForm(el);
    assert.notExists(el.shadowRoot!.querySelector('#card-mark-as-default'));

    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');
    await waitForRequest(requests, '/interaction/source/card');
    await waitFor(
      () => addPaymentMethodEvents.length === 1,
      'card add event was not emitted before refresh'
    );
    assert.equal(interactionGetCount, 1);
    preMutationInteraction.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [staleSource],
          billerAddress: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await waitFor(
      () =>
        el.interactionResponse?.selectedSource?.id === 'card-created-1' &&
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
          'Payment methods',
      'verified card did not return to the payment methods list'
    );

    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(listPaymentMethodsEvents, 2);
    assert.deepEqual(eventOrder, [
      'onAddPaymentMethod',
      'onListPaymentMethods',
      'onListPaymentMethods',
    ]);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction',
        'POST /interaction/billing-address',
        'POST /interaction/source/card',
        'GET /interaction',
      ]
    );
    assertNoMaskRequests(requests);

    const addressRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/interaction/billing-address'
    )!;
    const sourceRequest = requests.find(
      (request) => new URL(request.url).pathname === '/interaction/source/card'
    )!;
    const addressBody = JSON.parse(addressRequest.bodyText);
    assert.match(addressBody.id, /^billing-address-/);
    assert.deepEqual(addressBody, {
      id: addressBody.id,
      recipientNameOrAddress: 'Ada Lovelace',
      country: 'US',
      street: '1 Main St',
      houseNumberOrName: 'Suite 100',
      city: 'New York',
      stateOrProvince: 'NY',
      postalCode: '10001',
    });

    const sourceBody = JSON.parse(sourceRequest.bodyText);
    assert.equal(sourceBody.id, '');
    assert.equal(sourceBody.tenderType, 'CARD');
    assert.equal(sourceBody.name, 'Ada corporate card');
    assert.equal(sourceBody.billingAddressId, 'billing-from-api-1');
    assertSourceCreateHeaders(sourceRequest);
    assert.notEqual(sourceBody.card.cardNumber, '4111111111111111');
    assert.notEqual(sourceBody.card.cvv, '123');
    assert.equal(
      sourceBody.card.cardNumber,
      sourceBody.card.cardNumberEncrypted
    );
    assert.equal(sourceBody.card.cvv, sourceBody.card.cvvEncrypted);
    assert.deepInclude(
      {
        ...sourceBody.card,
        cardNumber: await decryptSourceValue(sourceBody.card.cardNumber),
        cardNumberEncrypted: await decryptSourceValue(
          sourceBody.card.cardNumberEncrypted
        ),
        cvv: await decryptSourceValue(sourceBody.card.cvv),
        cvvEncrypted: await decryptSourceValue(sourceBody.card.cvvEncrypted),
      },
      {
        nameOnCard: 'Ada Lovelace',
        cardNumber: '4111111111111111',
        cardNumberEncrypted: '4111111111111111',
        cvv: '123',
        cvvEncrypted: '123',
        expirationMonth: '04',
        expirationYear: '2030',
        network: 'Visa',
      }
    );
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-created-1');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_REQUESTED');
    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.equal(addPaymentMethodEvents[0].detail.id, 'card-created-1');
    assert.equal(addPaymentMethodEvents[0].detail.name, 'Ada corporate card');
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, [
      'onAddPaymentMethod',
      'onListPaymentMethods',
      'onListPaymentMethods',
    ]);
    assert.lengthOf(errorEvents, 0);
    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-row'
      ),
    ];

    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.lengthOf(rows, 1);
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-row .payment-method-title')
        ?.textContent?.trim(),
      'Authoritative corporate card'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-row .payment-method-meta')
        ?.textContent?.trim(),
      'Mastercard xx 4444'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('.payment-method-default-label')
    );
  });

  test('uses an existing billing address when one is selected', async () => {
    const requests: CapturedRequest[] = [];
    const selectedSource: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate card',
      verificationInfo: {status: 'VERIFIED'},
      card: {
        network: 'Visa',
        cardNumber: '4111111111111111',
      },
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/interaction')) {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            selectedSource,
            paymentSources: [selectedSource],
            billerAddress: [
              {
                id: 'billing-1',
                recipientNameOrAddress: 'Ada Lovelace',
                street: '1 Main St',
                city: 'New York',
                stateOrProvince: 'NY',
                postalCode: '10001',
                country: 'US',
              },
            ],
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'VERIFIED',
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      selectedSource,
      paymentSources: [selectedSource],
    });
    const {successEvents} = recordOutputEvents(el);

    const interactionRequestCount = requests.filter(
      (request) =>
        request.method === 'GET' &&
        new URL(request.url).pathname === '/interaction'
    ).length;

    await clickAction(el, 'add-card');
    await waitForRequest(requests, '/interaction', 'GET');
    assert.equal(
      requests.filter(
        (request) =>
          request.method === 'GET' &&
          new URL(request.url).pathname === '/interaction'
      ).length,
      interactionRequestCount + 1
    );
    await waitFor(() =>
      Boolean(el.shadowRoot!.querySelector('.billing-address-summary'))
    );

    assert.equal(
      el
        .shadowRoot!.querySelector('.billing-address-summary-value')
        ?.textContent?.trim(),
      '1 Main St, New York, NY 10001'
    );
    await clickAction(el, 'change-billing-address');
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLOptionElement>(
          '#billing-address option'
        ),
      ].map((option) => option.textContent?.trim()),
      ['1 Main St, New York, NY 10001', 'Add new billing address']
    );

    await setFieldValue(el, 'card-label', 'Ada corporate card');
    await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
    await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
    await setFieldValue(el, 'expiration-date', '04/30');
    await setFieldValue(el, 'card-cvv', '123');
    await setSelectValue(el, 'billing-address', '__new__');
    assert.exists(el.shadowRoot!.querySelector('#billing-country'));
    await setSelectValue(el, 'billing-address', 'billing-1');
    assert.exists(el.shadowRoot!.querySelector('.billing-address-summary'));
    assert.notExists(el.shadowRoot!.querySelector('#billing-address'));
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.interactionResponse?.selectedSource?.id === 'card-created-1' &&
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
          'Payment methods',
      'existing-address card did not return to the payment method list'
    );

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/billing-address'
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1/attach'
    );

    const sourceRequest = requests.find(
      (request) => new URL(request.url).pathname === '/interaction/source/card'
    )!;
    const sourceBody = JSON.parse(sourceRequest.bodyText);

    assert.equal(sourceBody.billingAddressId, 'billing-1');
    assertSourceCreateHeaders(sourceRequest);
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="toggle-payment-source-menu"][data-payment-method-id="card-created-1"]'
      )
    );

    await markPaymentSourceAsDefault(el, 'card-created-1');
    await waitFor(
      () =>
        el.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED' &&
        Boolean(el.shadowRoot!.querySelector('.payment-method-default-label')),
      'existing-address card was not marked as default'
    );

    assert.include(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.equal(successEvents.length, 0);
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
  });

  test('shows the card under-review outcome when card creation returns an under-review source without attaching it', async () => {
    const requests: CapturedRequest[] = [];
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/customer')) {
        return new Response(JSON.stringify({billingAddress: []}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/billing-address')) {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'UNDER_REVIEW',
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Verification pending review',
      'under-review card did not render the verification outcome'
    );

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1/attach'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="done-payment-source-verification"]'
      )
    );
  });

  test('blocks card save when source encryption metadata is missing', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/customer')) {
        return new Response(JSON.stringify({billingAddress: []}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      undefined,
      TEST_COMMERCE_HUB_BASE_URL,
      {defaultSourceMetadata: false}
    );

    await clickAction(el, 'add-card');
    await setFieldValue(el, 'card-label', 'Ada corporate card');
    await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
    await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
    await setFieldValue(el, 'expiration-date', '04/30');
    await setFieldValue(el, 'card-cvv', '123');
    await setSelectValue(el, 'billing-country', 'US');
    await setFieldValue(el, 'billing-address-line-1', '1 Main St');
    await setFieldValue(el, 'billing-city', 'New York');
    await setSelectValue(el, 'billing-state', 'NY');
    await setFieldValue(el, 'billing-zip', '10001');
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await clickAction(el, 'save-card');

    assert.include(
      el.shadowRoot!.textContent,
      'Unable to encrypt the card number. Try again.'
    );
    assertNoMaskRequests(requests);
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card'
    );
  });

  test('verify code posts OTP, email, channel, interaction headers, and preserves gateway OAuth when omitted by the response', async () => {
    const requests: CapturedRequest[] = [];
    const apiResponse: InteractionResponse = {
      interactionId: 'interaction-otp',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'validated-card',
          name: 'Card from validate response',
          card: {
            network: 'Visa',
            cardNumber: '4111111111114242',
          },
        },
      ],
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify(apiResponse), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
      oauth: {
        access_token: 'gateway-access-token-1',
      },
    });

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    await waitForRequest(requests, '/interaction/otp/validate', 'POST');

    assert.lengthOf(requests, 1);
    assert.equal(
      requests[0].url,
      `${TEST_COMMERCE_HUB_BASE_URL}/interaction/otp/validate`
    );
    assert.equal(requests[0].method, 'POST');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-otp'
    );
    assert.equal(
      requests[0].headers.get('Authorization'),
      'Bearer gateway-access-token-1'
    );
    assert.deepEqual(JSON.parse(requests[0].bodyText), {
      otp: '123456',
      channel: 'EMAIL',
    });
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/otp/validate']
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.id,
      'validated-card'
    );
    assert.equal(
      el.interactionResponse?.oauth?.access_token,
      'gateway-access-token-1'
    );
    assert.deepEqual(el.interactionResponse?.features, [
      'ADD_ACCOUNT',
      'SELECT',
      'TRANSFER',
    ]);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Card from validate response'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.payment-method-meta')?.textContent?.trim(),
      'Visa xx 4242'
    );
  });

  test('treats missing interaction features as no gated capabilities', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-transfer',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [
          {
            tenderType: 'BankAccount',
            id: 'bank-1',
            name: 'Operating account',
            verificationInfo: {status: 'VERIFIED'},
            bankAccount: {
              bankName: 'First Bank',
              accountNumber: '1111111111111111',
            },
          },
          {
            tenderType: 'BankAccount',
            id: 'bank-2',
            name: 'Savings account',
            verificationInfo: {status: 'VERIFIED'},
            bankAccount: {
              bankName: 'Second Bank',
              accountNumber: '2222222222222222',
            },
          },
        ],
      },
      undefined,
      TEST_COMMERCE_HUB_BASE_URL,
      {defaultFeatures: false}
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.equal(el.interactionResponse?.features, undefined);
    assert.notExists(el.shadowRoot!.querySelector('.widget-toolbar'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '[data-action="toggle-payment-source-menu"]'
      ),
      2
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
      ].map((row) => row.dataset.action),
      [undefined, undefined]
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-transfer"]')
    );
  });

  test('renders add actions without saved method selection for ADD_ACCOUNT only', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-transfer',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'First Bank',
            accountNumber: '1111111111111111',
          },
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-2',
          name: 'Savings account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'Second Bank',
            accountNumber: '2222222222222222',
          },
        },
      ],
    });

    assert.notExists(el.shadowRoot!.querySelector('.widget-toolbar'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.payment-method-add-footer [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['open-add-payment-source']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
      ].map((row) => row.dataset.action),
      [undefined, undefined]
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-transfer"]')
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('.payment-method-radio'),
      0
    );
    await openPaymentSourceMenu(el, 'bank-1');
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
  });

  test('renders saved method selection without add actions for SELECT only', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-transfer',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'First Bank',
            accountNumber: '1111111111111111',
          },
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-2',
          name: 'Savings account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'Second Bank',
            accountNumber: '2222222222222222',
          },
        },
      ],
    });

    assert.notExists(el.shadowRoot!.querySelector('.widget-toolbar'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '[data-action="toggle-payment-source-menu"]'
        ),
      ].map((button) => button.dataset.paymentMethodId),
      ['bank-1', 'bank-2']
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-transfer"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('.payment-method-radio'),
      2
    );
  });

  test('respects explicit interaction features when transfer is omitted', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-transfer',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'First Bank',
            accountNumber: '1111111111111111',
          },
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-2',
          name: 'Savings account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'Second Bank',
            accountNumber: '2222222222222222',
          },
        },
      ],
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-toolbar'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.payment-method-add-footer [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['attach-payment-source', 'open-add-payment-source']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '[data-action="toggle-payment-source-menu"]'
        ),
      ].map((button) => button.dataset.paymentMethodId),
      ['bank-1', 'bank-2']
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-transfer"]')
    );
  });

  test('renders transfer action after add bank account when all features are enabled', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-transfer',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT', 'TRANSFER'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'First Bank',
            accountNumber: '1111111111111111',
          },
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-2',
          name: 'Savings account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'Second Bank',
            accountNumber: '2222222222222222',
          },
        },
      ],
    });

    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
          '.widget-toolbar [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['open-transfer']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
          '.payment-method-add-footer [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['attach-payment-source', 'open-add-payment-source']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="open-transfer"]')
        ?.textContent?.trim(),
      'Transfer'
    );

    await clickAction(el, 'open-transfer');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Transfer funds'
    );
    assert.exists(el.shadowRoot!.querySelector('#transfer-from-source'));
    assert.exists(el.shadowRoot!.querySelector('#transfer-to-source'));
  });

  test('confirmed transfer emits native account transaction response', async () => {
    const transaction: NativeAccountTransaction = {
      id: 'transfer-transaction-1',
      amount: 25.75,
      asset: {type: 'CURRENCY', id: 'USD'},
      credit: false,
      timestamp: 1710000000000,
    };

    window.fetch = async () =>
      new Response(JSON.stringify(transaction), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const el = await renderConnect(
      {
        interactionId: 'interaction-transfer',
        status: 'OTP_VALIDATION_SUCCESS',
        features: ['TRANSFER'],
        paymentSources: [
          {
            tenderType: 'BankAccount',
            id: 'bank-1',
            name: 'Operating account',
            verificationInfo: {status: 'VERIFIED'},
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
              positionId: 'wallet-position-7890',
              nickName: 'Commerce wallet',
              productType: 'Wallet',
              token: 'native-token-1',
            },
          },
        ],
      } as InteractionResponse,
      undefined,
      TEST_COMMERCE_HUB_BASE_URL
    );
    const {transferEvents, errorEvents} = recordOutputEvents(el);
    const fromSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#transfer-from-source'
    )!;
    const toSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#transfer-to-source'
    )!;
    const amountInput =
      el.shadowRoot!.querySelector<HTMLInputElement>('#transfer-amount')!;

    fromSelect.value = 'bank-1';
    fromSelect.dispatchEvent(new Event('change', {bubbles: true}));
    toSelect.value = 'native-account-1';
    toSelect.dispatchEvent(new Event('change', {bubbles: true}));
    amountInput.value = '25.75';
    amountInput.dispatchEvent(new Event('input', {bubbles: true}));
    await flushElement(el);

    await clickAction(el, 'transfer');
    await clickAction(el, 'confirm-transfer');
    await waitFor(
      () => transferEvents.length === 1,
      'transfer event was not emitted'
    );

    assert.deepEqual(transferEvents[0].detail, transaction);
    assert.lengthOf(errorEvents, 0);
  });

  test('baseURL QA preset routes SDK-managed OTP validation requests to the CommerceHub preset origin', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-otp',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-otp',
        status: 'OTP_VALIDATION_PENDING',
        email: 'shopper@example.com',
      },
      undefined,
      'QA'
    );

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    await waitForRequest(requests, '/chc/interaction/otp/validate', 'POST');

    assert.equal(
      requests[0].url,
      `${COMMERCE_HUB_BASE_URLS.QA}/interaction/otp/validate`
    );
  });

  test('resend code posts to email OTP endpoint with interaction headers and accepts refreshed gateway OAuth', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-otp',
          status: 'OTP_VALIDATION_PENDING',
          email: 'shopper@example.com',
          oauth: {
            access_token: 'gateway-access-token-2',
          },
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
      oauth: {
        access_token: 'gateway-access-token-1',
      },
    });

    await clickAction(el, 'resend-otp');

    assert.lengthOf(requests, 1);
    assert.equal(
      requests[0].url,
      `${TEST_COMMERCE_HUB_BASE_URL}/interaction/otp/send/email`
    );
    assert.equal(requests[0].method, 'POST');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-otp'
    );
    assert.equal(
      requests[0].headers.get('Authorization'),
      'Bearer gateway-access-token-1'
    );
    assert.equal(requests[0].bodyText, '');
    assert.equal(
      el.interactionResponse?.oauth?.access_token,
      'gateway-access-token-2'
    );
  });

  test('custom baseURL routes direct SDK-managed CommerceHub JSON requests to the custom origin', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
        oauth: {
          access_token: 'gateway-access-token-3',
        },
      },
      undefined,
      'https://custom-commercehub.example.test'
    );

    await clickAction(el, 'add-pay-by-bank');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');

    assert.equal(
      requests[0].url,
      'https://custom-commercehub.example.test/interaction/source/pbb/session'
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(
      requests[0].headers.get('Authorization'),
      'Bearer gateway-access-token-3'
    );
  });

  test('marking a saved method as default refreshes payment info without emitting onSelect', async () => {
    const requests: CapturedRequest[] = [];
    const selectedSource: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate card',
      verificationInfo: {status: 'VERIFIED'},
      card: {
        network: 'Visa',
        cardNumber: '4111111111111111',
      },
    };
    const refreshedSource: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate Visa',
      verificationInfo: {status: 'VERIFIED'},
      card: {
        network: 'Visa',
        cardNumber: '4111111111111111',
      },
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (
        request.method === 'PATCH' &&
        pathname === '/interaction/source/card-1'
      ) {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_ATTACHED',
            selectedSource: refreshedSource,
            paymentSources: [refreshedSource],
            billerAddress: [],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: refreshedSource,
          paymentSources: [refreshedSource],
          billerAddress: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [selectedSource],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    assert.lengthOf(requests, 0);
    assert.lengthOf(successEvents, 0);
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));

    await markPaymentSourceAsDefault(el, 'card-1');
    await waitFor(
      () => el.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED',
      'default attachment did not complete'
    );
    await flushElement(el);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['PATCH /interaction/source/card-1', 'GET /interaction']
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[0].credentials, 'include');
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-1');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-row .payment-method-title')
        ?.textContent?.trim(),
      'Corporate Visa'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-row .payment-method-meta')
        ?.textContent?.trim(),
      'Visa xx 1111'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
  });

  test('confirmed source deletion emits deleted payment source id', async () => {
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      if (
        request.method === 'GET' &&
        new URL(request.url).pathname.endsWith('/interaction')
      ) {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
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
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response('', {status: 200});
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'card-1',
            name: 'Corporate card',
            verificationInfo: {status: 'VERIFIED'},
            card: {
              network: 'Visa',
              cardNumber: '4111111111111111',
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
      },
      undefined,
      TEST_COMMERCE_HUB_BASE_URL
    );
    const {deletePaymentMethodEvents, errorEvents} = recordOutputEvents(el);

    await requestPaymentSourceDeletion(el, 'card-1');
    await clickAction(el, 'delete-payment-source');
    await waitFor(
      () => deletePaymentMethodEvents.length === 1,
      'delete event was not emitted'
    );

    assert.equal(deletePaymentMethodEvents[0].detail, 'card-1');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['bank-1']
    );
    assert.lengthOf(errorEvents, 0);
  });

  test('missing interactionId does not emit onError and keeps the current screen stable', async () => {
    let calls = 0;

    window.fetch = async () => {
      calls += 1;
      return new Response('{}', {status: 200});
    };

    const el = await renderConnect({
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    assert.equal(calls, 0);
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter verification code'
    );
  });

  test('OTP API error transitions to the visible OTP error state', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({message: 'Invalid code'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });

    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');
    await waitFor(
      () => el.interactionResponse?.status === 'OTP_VALIDATION_FAILED',
      'OTP failure state did not render'
    );

    assert.equal(el.interactionResponse?.status, 'OTP_VALIDATION_FAILED');
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.exists(el.shadowRoot!.querySelector('[role="alert"]'));
    assert.equal(
      el
        .shadowRoot!.querySelector('button[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Try again'
    );
  });

  test('OTP verification shows a loading spinner and keeps OTP boxes still while pending', async () => {
    const pendingOtp = deferredResponse();

    window.fetch = async () => pendingOtp.promise;

    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
    });

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    const verifyButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      'button[data-action="verify-otp"]'
    )!;
    const otpInput = el.shadowRoot!.querySelector<HTMLElement>('.otp-input')!;

    assert.equal(verifyButton.disabled, true);
    assert.equal(verifyButton.getAttribute('aria-busy'), 'true');
    assert.exists(verifyButton.querySelector('.button-spinner'));
    assert.equal(verifyButton.textContent?.trim(), 'Verifying...');
    assert.equal(getComputedStyle(otpInput).animationName, 'none');

    pendingOtp.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-otp',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await flushElement(el);
  });

  test('saved payment verification shows an animated overlay for at least two seconds after verify step 1 returns', async () => {
    const timer = captureMinimumOverlayTimer();

    try {
      window.fetch = async (input: RequestInfo | URL) => {
        const request = input instanceof Request ? input : new Request(input);
        const pathname = new URL(request.url).pathname;

        if (pathname === '/interaction/verify/step1') {
          return new Response(
            JSON.stringify({
              status: 'REQUIRE_INFO',
              docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
            }),
            {status: 200, headers: {'Content-Type': 'application/json'}}
          );
        }

        return new Response(JSON.stringify({}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      };

      const el = await renderConnect({
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [
          {
            tenderType: 'BankAccount',
            id: 'bank-1',
            name: 'Operating account',
            verificationInfo: {status: 'NOT_VERIFIED'},
            bankAccount: {
              bankName: 'Commerce National Bank',
              accountNumber: '9876543210',
            },
          },
        ],
      });

      await clickAction(el, 'verify-payment-source');
      await flushElement(el);

      assert.equal(timer.delay, 2000);
      assert.equal(
        el
          .shadowRoot!.querySelector('.widget-loading-title')
          ?.textContent?.trim(),
        'Verifying payment method'
      );
      assert.exists(el.shadowRoot!.querySelector('.widget-loading-animation'));
      assert.notExists(
        el.shadowRoot!.querySelector('.widget-loading-overlay .loading-spinner')
      );
      assert.equal(
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
        'Complete account verification'
      );

      timer.release();
      await flushElement(el);

      assert.notExists(el.shadowRoot!.querySelector('.widget-loading-overlay'));
    } finally {
      timer.restore();
    }
  });

  test('saved payment verification emits before a later default attachment', async () => {
    const verifiedSource: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate card',
      verificationInfo: {status: 'VERIFIED'},
      card: {
        network: 'Visa',
        cardNumber: '4111111111111111',
      },
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      if (pathname === '/interaction/verify/step1') {
        return new Response(
          JSON.stringify({
            sourceId: 'card-1',
            status: 'VERIFIED',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/interaction/source/card-1/attach') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_ATTACHED',
            selectedSource: verifiedSource,
            paymentSources: [verifiedSource],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [
          {
            ...verifiedSource,
            verificationInfo: {status: 'NOT_VERIFIED'},
          },
        ],
      },
      undefined,
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );
    const {verifyPaymentMethodEvents, successEvents, eventOrder} =
      recordOutputEvents(el);

    await clickAction(el, 'verify-payment-source');
    await waitFor(
      () => verifyPaymentMethodEvents.length === 1,
      'verified source event was not emitted'
    );

    assert.lengthOf(verifyPaymentMethodEvents, 1);
    assert.deepEqual(verifyPaymentMethodEvents[0].detail, verifiedSource);
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, ['onVerifyPaymentMethod']);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="toggle-payment-source-menu"][data-payment-method-id="card-1"]'
      )
    );

    await markPaymentSourceAsDefault(el, 'card-1');
    await waitFor(
      () => el.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED',
      'verified source was not marked as default'
    );

    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, ['onVerifyPaymentMethod']);
  });

  test('Connect your bank shows a loading frame until PaymentSDK init is ready', async () => {
    const pendingSession = deferredResponse();
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };

    window.fetch = async () => pendingSession.promise;

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-pay-by-bank');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Connect your bank'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.provider-frame')
        ?.getAttribute('aria-busy'),
      'true'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.provider-loading-overlay')
        ?.textContent?.trim(),
      'Connecting to your bank'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-busy'),
      'true'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-loading-title')
        ?.textContent?.trim(),
      'Connecting to your bank'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-loading-helper')?.textContent ?? '',
      'Securely opening'
    );
    assert.equal(
      getComputedStyle(
        el.querySelector<HTMLElement>('#commerce-hub-pbb-provider')!
      ).height,
      '500px'
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.widget-title-action [data-action="add-ach-manually"]'
      )
    );

    pendingSession.resolve(
      new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);

    assert.notExists(el.shadowRoot!.querySelector('.provider-loading-overlay'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-loading-overlay'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.provider-frame')
        ?.getAttribute('aria-busy'),
      'false'
    );

    await initConfig!.onEvent({type: 'cancel'});
    await flushElement(el);
  });

  test('add bank account initializes PaymentSDK with a compact Connect your bank handoff', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;
    let providerContainer: HTMLElement | null = null;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
        providerContainer = document.getElementById(configuration.containerId);

        if (!providerContainer) {
          throw new Error(
            `PaymentSDK: Container element not found: ${configuration.containerId}`
          );
        }
      },
      destroy: () => undefined,
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (new URL(request.url).pathname === '/party/configuration-inquiry') {
        return bankAccountCountryConfigResponse();
      }

      return new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        country: 'USA',
        paymentSources: [],
      },
      {
        colors: {
          widgetBackground: '#fafafa',
          primary: '#123456',
          buttonTextColor: '#fef3c7',
          text: '#1f2937',
          copy: '#4b5563',
          border: '#d1d5db',
          placeholder: '#9ca3af',
          danger: '#dc2626',
          success: '#059669',
        },
        payByBank: {
          apiKey: 'override-api-key',
          configId: 'override-config-id',
          environment: 'sandbox',
          locale: 'en-CA',
        },
      }
    );

    el.style.setProperty(
      '--chc-font-family',
      '"Merchant Sans", "Helvetica Neue", sans-serif'
    );

    await clickAction(el, 'add-pay-by-bank');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Connect your bank'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-shell-wide'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.provider-frame-header'));
    assert.exists(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider'));
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.widget-title-action [data-action="add-ach-manually"]'
      )
    );
    assert.notInclude(
      el.shadowRoot!.querySelector('.widget-header')?.textContent ?? '',
      'Connect another way'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-action-footer'));
    const backButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-back-button[data-action="back-to-payment-methods"]'
    );
    assert.equal(backButton?.getAttribute('aria-label'), 'Back');
    assert.equal(backButton?.textContent?.trim(), '');
    assert.exists(backButton?.closest('.widget-heading-row'));
    assert.equal(getComputedStyle(backButton!).color, 'rgb(31, 41, 55)');
    assert.equal(initConfig?.apiKey, 'override-api-key');
    assert.equal(initConfig?.configId, 'override-config-id');
    assert.equal(initConfig?.accessToken, 'access-token-1');
    assert.equal(initConfig?.aggregatorSessionId, 'agg-session-1');
    assert.equal(initConfig?.pToken, 'p-token-1');
    assert.equal(initConfig?.publicKey, 'public-key-1');
    assert.equal(initConfig?.environment, 'sandbox');
    assert.equal(initConfig?.locale, 'en-CA');
    assert.equal(initConfig?.containerId, 'commerce-hub-pbb-provider');
    assert.isUndefined(initConfig?.embed);
    assert.deepEqual(initConfig?.appearance, {
      branding: {
        backgroundColor: '#fafafa',
        primaryColor: '#123456',
        primaryTextColor: '#1f2937',
        secondaryTextColor: '#4b5563',
        buttonColor: '#123456',
        buttonTextColor: '#fef3c7',
        dangerColor: '#dc2626',
        successColor: '#059669',
        borderColor: '#d1d5db',
        placeholderColor: '#9ca3af',
        fontFamily: '"Merchant Sans", "Helvetica Neue", sans-serif',
        borderRadius: '8px',
      },
    });
    assert.exists(providerContainer);
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /interaction/source/pbb/session']
    );
    assert.equal(
      requests[0].url,
      `${TEST_COMMERCE_HUB_BASE_URL}/interaction/source/pbb/session`
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[0].credentials, 'include');

  });

  test('add bank account uses built-in Pay by Bank credentials when designConfig omits them', async () => {
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };

    window.fetch = async () =>
      new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-pay-by-bank');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');

    assert.equal(
      initConfig?.apiKey,
      'YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A'
    );
    assert.equal(initConfig?.configId, 'cce84049-0940-4926-9a54-9eaca0c09830');
    assert.deepEqual(initConfig?.appearance, {
      branding: {
        backgroundColor: '#ffffff',
        primaryColor: '#533afd',
        primaryTextColor: '#061b31',
        secondaryTextColor: '#50617a',
        buttonColor: '#533afd',
        buttonTextColor: '#ffffff',
        dangerColor: '#c2410c',
        successColor: '#047857',
        borderColor: '#e5edf5',
        placeholderColor: '#9ca3af',
        fontFamily:
          "sohne-var, 'SF Pro Display', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        borderRadius: '8px',
      },
    });
  });

  test('Pay by Bank startup errors are printed to the console', async () => {
    const errors: unknown[][] = [];

    console.error = (...args: unknown[]) => {
      errors.push(args);
    };

    paymentSdkWindow.PaymentSDK = {
      init: () => undefined,
      destroy: () => undefined,
    };
    window.fetch = async () =>
      new Response(JSON.stringify({aggregatorSessionId: 'agg-session-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-pay-by-bank');
    await flushElement(el);

    assert.lengthOf(errors, 1);
    assert.equal(errors[0][0], 'CommerceHub Connect Pay by Bank failed');
    assert.instanceOf(errors[0][1], Error);
    assert.equal(
      (errors[0][1] as Error).message,
      'The /interaction/source/pbb/session response is missing one or more required values.'
    );
  });

  test('Connect your bank success verifies the finalized bank source and shows an under-review outcome without events', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      const pathname = new URL(request.url).pathname;

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (
        pathname === '/interaction/source/pbb/session/agg-session-1/p-token-1'
      ) {
        return new Response(
          JSON.stringify({
            sourceId: 'bank-new',
            status: 'UNDER_REVIEW',
            docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'OTP_VALIDATION_SUCCESS',
          paymentSources: [
            {
              tenderType: 'BankAccount',
              id: 'bank-new',
              name: 'Operating account',
              verificationInfo: {
                status: 'UNDER_REVIEW',
                docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
              },
              bankAccount: {accountNumber: '9876543210'},
            },
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-pay-by-bank');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      'Needs review'
    );
    assert.equal(el.interactionResponse?.paymentSources?.[0]?.id, 'bank-new');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo,
      {
        status: 'UNDER_REVIEW',
        docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
      }
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
    assert.equal(el.interactionResponse?.status, 'OTP_VALIDATION_SUCCESS');
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });

  test('Connect your bank success preselects a VERIFIED source and waits for explicit attachment', async () => {
    const {
      el,
      requests,
      successEvents,
      addPaymentMethodEvents,
      errorEvents,
      eventOrder,
    } = await completePayByBankFlow({finalizedStatus: 'VERIFIED'});

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="toggle-payment-source-menu"][data-payment-method-id="bank-new"]'
      )
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-row .payment-method-title')
        ?.textContent?.trim(),
      'Saved bank account'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-row .payment-method-meta')
        ?.textContent?.trim(),
      'Bank account xx ----'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'VERIFIED'
    );
    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-new');
    assert.equal(el.interactionResponse?.status, 'OTP_VALIDATION_SUCCESS');
    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.equal(addPaymentMethodEvents[0].detail.id, 'bank-new');
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, [
      'onAddPaymentMethod',
      'onListPaymentMethods',
    ]);
    assert.lengthOf(errorEvents, 0);

    await markPaymentSourceAsDefault(el, 'bank-new');
    await waitFor(
      () => el.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED',
      'bank source was not marked as default'
    );
    await waitFor(
      () =>
        requests.filter(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ).length === 2,
      'bank default refresh did not complete'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
        'PATCH /interaction/source/bank-new',
        'GET /interaction',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, [
      'onAddPaymentMethod',
      'onListPaymentMethods',
      'onListPaymentMethods',
    ]);
  });

  test('Connect your bank success shows finalized UNDER_REVIEW bank sources on the pending-review outcome screen', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'UNDER_REVIEW',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      'Needs review'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.classList.contains('verification-status-badge-warning'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="done-bank-outcome"]'
        )
        ?.textContent?.trim(),
      'Done'
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.primitive-footer [data-action="done-bank-outcome"]'
      )
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);

    await clickAction(el, 'done-bank-outcome');
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ),
      'interaction was not refreshed'
    );
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment methods',
      'payment methods list did not render'
    );
  });

  test('Connect your bank success shows finalized REQUIRE_INFO bank sources on the SDK v3 required-info screen', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'REQUIRE_INFO',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    const backButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-back-button[data-action="back-to-payment-methods"]'
    );
    assert.equal(backButton?.getAttribute('aria-label'), 'Back');
    assert.equal(backButton?.textContent?.trim(), '');
    assert.exists(backButton?.closest('.widget-heading-row'));
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.required-info-card-field')].map(
        (node) => [
          node.getAttribute('data-required-info-card-field'),
          node.textContent?.trim(),
        ]
      ),
      [
        ['name', 'Saved bank account'],
        ['number', '•••• ----'],
      ]
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.required-info-card-status')
        ?.textContent?.trim(),
      'Needs info'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-required-info-card-icon="bank"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.required-document-row'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '.required-info-document.required-document-text-row'
      ),
      2
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.upload-row-requirements')].map(
        (node) => node.textContent?.trim()
      ),
      ['Bank statement', 'Driver license photo']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll('.required-info-requirement-badge'),
      ].map((node) => node.textContent?.trim()),
      ['Required', 'Optional']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.required-info-document'
        ),
      ].map((node) => node.dataset.requiredInfoRequirement),
      ['required', 'optional']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.primitive-footer button[data-action="submit-required-info"]'
        )
        ?.textContent?.trim(),
      'Verify'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '.primitive-footer button[data-action="submit-required-info"]'
      )?.disabled,
      true
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="use-different-bank-account"]')
    );
    assert.exists(el.shadowRoot!.querySelector('.required-info-file-input'));
    assert.isUndefined(el.interactionResponse?.selectedSource);

    await clickAction(el, 'back-to-payment-methods');
    await waitForRequest(requests, '/interaction', 'GET');

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
        'GET /interaction',
      ]
    );
  });

  test('Connect your bank required-info treats bank letter and bank check as upload documents', async () => {
    const {el} = await completePayByBankFlow({
      finalizedStatus: 'REQUIRE_INFO',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'BANK_LETTER', mandatory: true},
        {docType: 'BANK_CHECK', mandatory: false},
      ],
    });

    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.upload-row-requirements')].map(
        (node) => node.textContent?.trim()
      ),
      ['Bank letter', 'Bank check']
    );
    assert.notExists(el.shadowRoot!.querySelector('.required-info-text-input'));
    assert.exists(el.shadowRoot!.querySelector('.required-info-file-input'));
  });

  test('Connect your bank REQUIRE_INFO verification response opens the required-info screen and keeps file selection local only', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );

    const requestCountBeforeFileSelection = requests.length;
    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');

    assert.lengthOf(requests, requestCountBeforeFileSelection);
    assert.equal(
      el
        .shadowRoot!.querySelector('.upload-row-file-name')
        ?.textContent?.trim(),
      'may-bank-statement.pdf'
    );
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo,
      {
        status: 'REQUIRE_INFO',
        docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
      }
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Connect your bank required-info Verify requires every mandatory document', async () => {
    const {el} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'BANK_STATEMENT', mandatory: true},
        {docType: 'BANK_LETTER', mandatory: true},
        {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
      ],
    });
    const verifyButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.primitive-footer button[data-action="submit-required-info"]'
    )!;
    const optionalUploadRow = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-required-info-requirement="optional"] .upload-row'
    )!;
    const requiredUploadRows = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '[data-required-info-requirement="required"] .upload-row'
      ),
    ];

    assert.equal(verifyButton.disabled, true);

    optionalUploadRow.click();
    await flushElement(el);
    await selectRequiredInfoFile(el, 'driver-license.pdf');

    assert.equal(verifyButton.disabled, true);

    requiredUploadRows[0].click();
    await flushElement(el);
    await selectRequiredInfoFile(el, 'bank-statement.pdf');

    assert.equal(verifyButton.disabled, true);

    requiredUploadRows[1].click();
    await flushElement(el);
    await selectRequiredInfoFile(el, 'bank-letter.pdf');

    assert.equal(verifyButton.disabled, false);
  });

  test('Connect your bank required-info Verify shows an account verification overlay while pending', async () => {
    const pendingUpload = deferredResponse();
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      requiredInfoStep2Status: 'VERIFIED',
      requiredInfoUploadResponse: pendingUpload.promise,
    });

    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
    await clickAction(el, 'submit-required-info');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-busy'),
      'true'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-loading-title')
        ?.textContent?.trim(),
      'Verifying account'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-loading-helper')?.textContent ?? '',
      'Reviewing your verification information'
    );

    pendingUpload.resolve(new Response(undefined, {status: 200}));
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment methods',
      'verified source did not return to the payment method list'
    );
    await waitFor(
      () =>
        requests.filter(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ).length === 2,
      'verified required-info completion did not refresh payment methods'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="toggle-payment-source-menu"]')
    );
  });

  test('required-info verification keeps the animated overlay visible for at least two seconds after verify step 2 returns', async () => {
    const timer = captureMinimumOverlayTimer();

    try {
      const {el} = await completePayByBankFlow({
        finalizedStatus: 'NOT_VERIFIED',
        verificationStatus: 'REQUIRE_INFO',
        requiredInfoStep2Status: 'VERIFIED',
      });

      await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
      await clickAction(el, 'submit-required-info');
      await flushElement(el);

      assert.equal(timer.delay, 2000);
      assert.equal(
        el
          .shadowRoot!.querySelector('.widget-loading-title')
          ?.textContent?.trim(),
        'Verifying account'
      );
      assert.exists(el.shadowRoot!.querySelector('.widget-loading-animation'));
      assert.notExists(
        el.shadowRoot!.querySelector('.widget-loading-overlay .loading-spinner')
      );
      assert.equal(
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
        'Payment methods'
      );

      timer.release();
      await flushElement(el);

      assert.notExists(el.shadowRoot!.querySelector('.widget-loading-overlay'));
    } finally {
      timer.restore();
    }
  });

  test('Connect your bank required-info Verify finalizes selection before explicit attachment', async () => {
    const {el, requests, successEvents, verifyPaymentMethodEvents, eventOrder} =
      await completePayByBankFlow({
        finalizedStatus: 'NOT_VERIFIED',
        verificationStatus: 'REQUIRE_INFO',
        verificationDocs: [
          {docType: 'BANK_STATEMENT', mandatory: true},
          {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
        ],
        requiredInfoStep2Status: 'VERIFIED',
        requiredInfoStep2SourceId: 'bank-verified',
      });

    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
    await clickAction(el, 'submit-required-info');
    await waitForRequest(requests, '/interaction/verify/step2');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment methods',
      'verified bank source did not return to the payment method list'
    );
    await waitFor(
      () =>
        requests.filter(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ).length === 2,
      'verified required-info completion did not refresh the interaction'
    );

    assert.deepEqual(
      requests
        .slice(3)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/doc/upload/bank-new/BANK_STATEMENT',
        'POST /interaction/verify/step2',
        'GET /interaction',
      ]
    );
    assert.include(requests[3].headers.get('content-type') ?? '', 'multipart');
    assert.equal(
      requests[3].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.include(requests[3].bodyText, 'name="file"');
    assert.include(requests[3].bodyText, 'filename="may-bank-statement.pdf"');
    assert.equal(requests[4].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'VERIFIED'
    );
    assert.lengthOf(verifyPaymentMethodEvents, 1);
    assert.equal(verifyPaymentMethodEvents[0].detail.id, 'bank-verified');
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, [
      'onAddPaymentMethod',
      'onListPaymentMethods',
      'onVerifyPaymentMethod',
      'onListPaymentMethods',
    ]);
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="toggle-payment-source-menu"][data-payment-method-id="bank-verified"]'
      )
    );

    await markPaymentSourceAsDefault(el, 'bank-verified');
    await waitForRequest(
      requests,
      '/interaction/source/bank-verified',
      'PATCH'
    );
    await waitFor(
      () => el.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED',
      'verified bank source was not marked as default'
    );
    await waitFor(
      () =>
        requests.filter(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ).length === 3,
      'verified bank default refresh did not complete'
    );

    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-verified');
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, [
      'onAddPaymentMethod',
      'onListPaymentMethods',
      'onVerifyPaymentMethod',
      'onListPaymentMethods',
      'onListPaymentMethods',
    ]);
  });

  test('Pay by Bank required-info Verify submits required information before optional information', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'BANK_STATEMENT', mandatory: true},
        {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
      ],
      requiredInfoStep2Responses: [
        {
          status: 'REQUIRE_INFO',
          docs: [
            {docType: 'BANK_STATEMENT', mandatory: true},
            {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
          ],
        },
        {status: 'UNDER_REVIEW'},
      ],
    });
    const optionalUploadRow = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-required-info-requirement="optional"] .upload-row'
    )!;

    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
    optionalUploadRow.click();
    await flushElement(el);
    await selectRequiredInfoFile(el, 'driver-license.pdf');
    await clickAction(el, 'submit-required-info');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Bank account pending review',
      'required-info verification did not finish'
    );

    assert.deepEqual(
      requests
        .slice(3)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/doc/upload/bank-new/BANK_STATEMENT',
        'POST /interaction/verify/step2',
        'POST /interaction/doc/upload/bank-new/DRIVER_LICENSE_PHOTO',
        'POST /interaction/verify/step2',
      ]
    );
    assert.include(requests[3].bodyText, 'filename="may-bank-statement.pdf"');
    assert.equal(requests[4].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.include(requests[5].bodyText, 'filename="driver-license.pdf"');
    assert.equal(requests[6].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
  });

  test('Pay by Bank required-info Verify submits text documents through uploadField and shows under-review outcomes', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'DRIVER_LICENSE_NUMBER', mandatory: true},
        {docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true},
      ],
      requiredInfoStep2Status: 'UNDER_REVIEW',
    });

    assert.equal(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '.primitive-footer button[data-action="submit-required-info"]'
      )?.disabled,
      true
    );

    await setRequiredInfoValue(el, 'Driver license number', 'D1234567');
    await setRequiredInfoSsnSegments(el, ['123', '45', '6789']);
    await clickAction(el, 'submit-required-info');
    await waitForRequest(requests, '/interaction/verify/step2');

    assert.deepEqual(
      requests
        .slice(3)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/verify/uploadField',
        'POST /interaction/verify/uploadField',
        'POST /interaction/verify/step2',
      ]
    );
    assert.equal(
      requests[3].bodyText,
      JSON.stringify({
        docType: 'DRIVER_LICENSE_NUMBER',
        value: 'bank-new',
        docValue: 'D1234567',
      })
    );
    assert.equal(
      requests[4].bodyText,
      JSON.stringify({
        docType: 'SOCIAL_SECURITY_NUMBER',
        value: 'bank-new',
        docValue: '123456789',
      })
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
    assert.isFalse(
      requests.some(
        (request) =>
          new URL(request.url).pathname ===
          '/interaction/source/bank-new/attach'
      )
    );
  });

  test('required-info SSN validation stays hidden until Verify and clears while editing', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [{docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true}],
    });
    const verifyButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.primitive-footer button[data-action="submit-required-info"]'
    )!;
    const requestCountBeforeEntry = requests.length;

    assert.isTrue(verifyButton.disabled);
    assert.notExists(
      el.shadowRoot!.querySelector('.required-info-ssn-document .field-error')
    );

    await setRequiredInfoSsnSegments(el, ['1', '', '']);

    assert.isFalse(verifyButton.disabled);
    assert.notExists(
      el.shadowRoot!.querySelector('.required-info-ssn-document .field-error')
    );

    await clickAction(el, 'submit-required-info');

    assert.include(
      el.shadowRoot!.querySelector('.required-info-ssn-document .field-error')
        ?.textContent ?? '',
      'Enter a 9-digit Social Security number.'
    );
    assert.lengthOf(requests, requestCountBeforeEntry);

    await setRequiredInfoSsnSegments(el, ['123', '45', '6789']);

    assert.notExists(
      el.shadowRoot!.querySelector('.required-info-ssn-document .field-error')
    );

    await setRequiredInfoSsnSegments(el, ['', '', '']);

    assert.isTrue(verifyButton.disabled);
    assert.include(
      el.shadowRoot!.querySelector('.required-info-ssn-document .field-error')
        ?.textContent ?? '',
      'Enter a Social Security number.'
    );
  });

  test('Connect your bank required-info upload failures stay on the form and show an inline error', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      requiredInfoStep2Status: 'VERIFIED',
      requiredInfoFailurePath:
        '/interaction/doc/upload/bank-new/BANK_STATEMENT',
    });

    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
    await clickAction(el, 'submit-required-info');
    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('.alert-danger')),
      'upload error was not shown'
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-danger')?.textContent?.trim() ?? '',
      'Document upload failed'
    );
    assert.deepEqual(
      requests
        .slice(3)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      ['POST /interaction/doc/upload/bank-new/BANK_STATEMENT']
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'REQUIRE_INFO'
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Pay by Bank REQUIRE_INFO text documents render as local-only inputs', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'DRIVER_LICENSE_NUMBER', mandatory: true},
        {docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true},
      ],
    });
    const requestCountBeforeEntry = requests.length;

    await setRequiredInfoValue(el, 'Driver license number', 'D1234567');
    await setRequiredInfoSsnSegments(el, ['123', '45', '6789']);

    assert.lengthOf(requests, requestCountBeforeEntry);
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
          '.required-info-text-input'
        ),
      ].map((input) => ({
        label: el
          .shadowRoot!.querySelector(`label[for="${input.id}"]`)
          ?.textContent?.trim(),
        type: input.type,
        value: input.value,
      })),
      [
        {
          label: 'Driver license number',
          type: 'text',
          value: 'D1234567',
        },
      ]
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.required-info-ssn-document .field-label')
        ?.textContent?.trim(),
      'Social Security number'
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '.required-info-document.required-document-text-row'
      ),
      2
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
          '.required-info-ssn-input'
        ),
      ].map((input) => ({
        type: input.type,
        inputmode: input.getAttribute('inputmode'),
        maxlength: input.getAttribute('maxlength'),
        value: input.value,
      })),
      [
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '3',
          value: '123',
        },
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '2',
          value: '45',
        },
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '4',
          value: '6789',
        },
      ]
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.required-info-ssn-separator')].map(
        (node) => node.textContent?.trim()
      ),
      ['-', '-']
    );

    await pasteRequiredInfoSsnValue(el, '987-65-4321');

    assert.lengthOf(requests, requestCountBeforeEntry);
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
          '.required-info-ssn-input'
        ),
      ].map((input) => input.value),
      ['987', '65', '4321']
    );
    assert.notExists(el.shadowRoot!.querySelector('.required-info-file-input'));
    assert.notExists(el.shadowRoot!.querySelector('.upload-row-requirements'));
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo,
      {
        status: 'REQUIRE_INFO',
        docs: [
          {docType: 'DRIVER_LICENSE_NUMBER', mandatory: true},
          {docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true},
        ],
      }
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Pay by Bank success shows finalized DECLINED bank sources on the declined outcome screen', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'DECLINED',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account verification failed'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-danger')?.textContent?.trim() ?? '',
      'could not be verified'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      "Can't use"
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="done-bank-outcome"]'
        )
        ?.textContent?.trim(),
      'Done'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="use-different-bank-account"]')
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);

    await clickAction(el, 'done-bank-outcome');
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ),
      'interaction was not refreshed'
    );
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment methods',
      'payment methods list did not render'
    );

    assert.exists(el.shadowRoot!.querySelector('.payment-method-row'));
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
        'GET /interaction',
      ]
    );
  });

  test('Pay by Bank VERIFIED verification response preselects sourceId before explicit attach', async () => {
    const {el, requests, successEvents, addPaymentMethodEvents, eventOrder} =
      await completePayByBankFlow({
        finalizedStatus: 'NOT_VERIFIED',
        verificationStatus: 'VERIFIED',
        verificationSourceId: 'bank-verified',
      });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="toggle-payment-source-menu"][data-payment-method-id="bank-verified"]'
      )
    );
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo,
      {
        status: 'VERIFIED',
        docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
      }
    );
    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, [
      'onAddPaymentMethod',
      'onListPaymentMethods',
    ]);

    await markPaymentSourceAsDefault(el, 'bank-verified');
    await waitFor(
      () => el.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED',
      'verified source was not marked as default'
    );
    await waitFor(
      () =>
        requests.filter(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ).length === 2,
      'verified source default refresh did not complete'
    );

    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-verified');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, [
      'onAddPaymentMethod',
      'onListPaymentMethods',
      'onListPaymentMethods',
    ]);
  });

  test('Pay by Bank success with no finalized bank source returns to payment methods', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      const pathname = new URL(request.url).pathname;

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (
        pathname === '/interaction/source/pbb/session/agg-session-1/p-token-1'
      ) {
        return new Response(
          JSON.stringify({
            selectedSource: {
              id: 'card-new',
              tenderType: 'Card',
            },
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-pay-by-bank');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );
    assert.notInclude(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'POST /interaction/verify/step1'
    );
  });

  test('Pay by Bank success with no finalized bank source id returns to payment methods', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      const pathname = new URL(request.url).pathname;

      if (pathname === '/interaction/source/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (
        pathname === '/interaction/source/pbb/session/agg-session-1/p-token-1'
      ) {
        return new Response(
          JSON.stringify({
            selectedSource: {
              tenderType: 'BankAccount',
              bankAccount: {
                bankName: 'No Id Bank',
                accountNumber: '0000111122223333',
              },
            },
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-pay-by-bank');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );
    assert.notInclude(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'POST /interaction/verify/step1'
    );
  });

  test('Pay by Bank terminal events return to refreshed payment methods', async () => {
    for (const terminalType of ['failure', 'cancel', 'error']) {
      const requests: CapturedRequest[] = [];
      let initConfig: TestPaymentSdkInitConfiguration | undefined;

      paymentSdkWindow.PaymentSDK = {
        init: (configuration) => {
          initConfig = configuration;
        },
        destroy: () => undefined,
      };

      window.fetch = async (input: RequestInfo | URL) => {
        const request = input instanceof Request ? input : new Request(input);
        const pathname = new URL(request.url).pathname;

        requests.push({
          url: request.url,
          method: request.method,
          headers: new Headers(request.headers),
          bodyText: await request.clone().text(),
          credentials: request.credentials,
        });

        if (pathname === '/interaction') {
          return new Response(
            JSON.stringify({
              interactionId: `interaction-${terminalType}`,
              status: 'PAYMENT_SOURCE_REQUESTED',
              paymentSources: [
                {
                  tenderType: 'Card',
                  id: 'card-1',
                  name: 'Refreshed card',
                  verificationInfo: {status: 'VERIFIED'},
                  card: {
                    network: 'Visa',
                    cardNumber: '4111111111114242',
                  },
                },
              ],
            }),
            {status: 200, headers: {'Content-Type': 'application/json'}}
          );
        }

        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      };

      const el = await renderConnect({
        interactionId: `interaction-${terminalType}`,
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      });

      await clickAction(el, 'add-pay-by-bank');
      await waitFor(
        () => Boolean(initConfig),
        'PaymentSDK.init was not called'
      );
      await initConfig!.onEvent({type: terminalType});
      await flushElement(el);

      assert.equal(
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
        'Payment methods',
        terminalType
      );
      assert.equal(
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim(),
        'Refreshed card',
        terminalType
      );
      assert.deepEqual(
        requests.map(
          (request) => `${request.method} ${new URL(request.url).pathname}`
        ),
        ['GET /interaction/source/pbb/session', 'GET /interaction'],
        terminalType
      );
      assert.notExists(
        el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
      );
    }
  });

  test('Pay by Bank script load failure and incomplete session return to payment methods', async () => {
    paymentSdkWindow.PaymentSDK = undefined;
    window.fetch = async () =>
      new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );

    const scriptFailureEl = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      {payByBank: {paymentSdkUrl: 'https://example.test/PaymentSDK.js'}}
    );

    await clickAction(scriptFailureEl, 'add-pay-by-bank');
    const paymentSdkScriptSelector =
      'script[data-commerce-hub-pay-by-bank-sdk="true"]';

    await waitFor(
      () => Boolean(document.querySelector(paymentSdkScriptSelector)),
      'PaymentSDK script was not added'
    );
    const script = document.querySelector<HTMLScriptElement>(
      paymentSdkScriptSelector
    );

    assert.exists(script);
    script!.dispatchEvent(new Event('error'));
    await flushElement(scriptFailureEl);

    assert.equal(
      scriptFailureEl
        .shadowRoot!.querySelector('.widget-title')
        ?.textContent?.trim(),
      'Payment methods'
    );

    paymentSdkWindow.PaymentSDK = {
      init: () => undefined,
      destroy: () => undefined,
    };
    window.fetch = async () =>
      new Response(JSON.stringify({aggregatorSessionId: 'agg-session-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const incompleteSessionEl = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(incompleteSessionEl, 'add-pay-by-bank');
    await flushElement(incompleteSessionEl);

    assert.equal(
      incompleteSessionEl
        .shadowRoot!.querySelector('.widget-title')
        ?.textContent?.trim(),
      'Payment methods'
    );
  });

  test('Pay by Bank terminal failure returns to payment methods and allows starting again', async () => {
    let initConfig: TestPaymentSdkInitConfiguration | undefined;
    let initCount = 0;
    let destroyCount = 0;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
        initCount += 1;
      },
      destroy: () => {
        destroyCount += 1;
      },
    };

    window.fetch = async () => {
      return new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-pay-by-bank');
    await waitFor(() => initCount === 1, 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'failure'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );

    await clickAction(el, 'add-pay-by-bank');
    await waitFor(
      () => initCount === 2,
      'PaymentSDK.init was not called again'
    );

    assert.isAtLeast(destroyCount, 2);

    await initConfig!.onEvent({type: 'cancel'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
  });
});
