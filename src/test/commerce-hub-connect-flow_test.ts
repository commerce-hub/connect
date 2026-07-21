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

const bankAccountCountryConfigResponse = (
  instrumentSchemas: unknown = TEST_INSTRUMENT_SCHEMAS
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
    defaultFeatures?: boolean;
    defaultSourceMetadata?: boolean;
  } = {}
) => {
  const shouldStubInitialInteraction =
    options.initialInteractionResponse !== false;
  const interactionResponseForTest = interactionResponseWithTestFeatures(
    interactionResponse,
    options.defaultFeatures,
    options.defaultSourceMetadata
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
            options.defaultSourceMetadata
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
  defaultSourceMetadata = true
): InteractionResponse => {
  const nextInteractionResponse =
    defaultFeatures || interactionResponse.features
      ? {
          ...interactionResponse,
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

  input.dispatchEvent(new FocusEvent('blur', {bubbles: true}));
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

  return {
    successEvents,
    addPaymentMethodEvents,
    verifyPaymentMethodEvents,
    deletePaymentMethodEvents,
    listPaymentMethodsEvents,
    transferEvents,
    errorEvents,
    eventOrder,
  };
};

type VerificationStatus = NonNullable<
  PaymentSource['verificationInfo']
>['status'];

interface TestPaymentSdkEvent {
  type?: string;
  payload?: unknown;
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
          sourceId: verificationSourceId ?? 'bank-new',
          ...finalizedVerificationInfo,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (pathname === '/interaction/verify/step1' && verificationStatus) {
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
      const attachedSourceId = decodeURIComponent(attachMatch[1]);

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

    if (pathname === '/interaction') {
      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              id: 'bank-new',
              tenderType: 'BankAccount',
              name: 'Operating account',
              verificationInfo: finalizedVerificationInfo,
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

    return new Response(JSON.stringify({message: 'Unexpected request'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  };

  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    paymentSources: [],
  });
  const events = recordOutputEvents(el);

  await clickAction(el, 'add-bank-account');
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

  test('renders payment methods with radios, status badges, toolbar actions, and the tender launcher', async () => {
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
      'Choose a payment method'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    const selectedRadio = rows[0].querySelector<HTMLInputElement>(
      '.payment-method-radio'
    )!;

    assert.exists(selectedRadio);
    assert.isTrue(selectedRadio.checked);
    assert.notExists(rows[1].querySelector('.payment-method-radio'));
    assert.notExists(rows[2].querySelector('.payment-method-radio'));
    assert.equal(rows[0].tagName, 'LABEL');
    assert.equal(rows[0].dataset.action, undefined);
    assert.equal(rows[1].dataset.action, undefined);
    assert.equal(rows[2].dataset.action, undefined);
    assert.equal(
      rows[0].classList.contains('payment-method-row-selected'),
      true
    );
    assert.equal(
      rows[1].classList.contains('payment-method-row-selected'),
      false
    );
    assert.equal(
      rows[0].querySelector('.payment-method-title')?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      rows[0].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Visa ending 4242'
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
      'Bank account ending 3210'
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
      'Mastercard ending 4444'
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
    assert.notEqual(
      getComputedStyle(rows[0]).backgroundColor,
      getComputedStyle(rows[1]).backgroundColor
    );
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
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.widget-toolbar [data-action]'
        ),
      ].map((button) => [button.dataset.action, button.textContent?.trim()]),
      [
        ['toggle-payment-source-edit-mode', 'Edit'],
        ['open-add-payment-source', 'Add'],
      ]
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="attach-payment-source"]')
        ?.textContent?.trim(),
      'Use selected method'
    );
    assert.notExists(el.shadowRoot!.querySelector('.source-action-link'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-transfer"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );

    await clickAction(el, 'open-add-payment-source');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add a payment method'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.tender-tabs')?.getAttribute('role'),
      'tablist'
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tender-tab'),
      ].map((tab) => [
        tab.dataset.action,
        tab.getAttribute('role'),
        tab.textContent?.trim(),
      ]),
      [
        ['add-card', 'tab', 'Card'],
        ['add-bank-account', 'tab', 'Bank'],
      ]
    );
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
      'Choose a payment method'
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
      'Choose a payment method'
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
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="attach-payment-source"]')
        ?.textContent?.trim(),
      'Pay securely'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="open-add-payment-source"]')
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

  test('renders no saved payment methods without a Continue CTA', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.notExists(el.shadowRoot!.querySelector('.empty-state'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="open-add-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.source-action-link'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
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
      'Choose a payment method'
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
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Add payment method',
      'empty payment-source state did not render after refresh'
    );
  });

  test('renders no-saved-methods copy from partial designConfig overrides', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
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
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="open-add-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.source-action-link'));

    await clickAction(el, 'open-add-payment-source');

    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.tender-tab')].map((item) =>
        item.textContent?.trim()
      ),
      ['Card', 'Bank']
    );
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
    const backLink = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-header-action [data-action="back-to-payment-methods"]'
    );
    assert.equal(backLink?.textContent?.trim(), 'Back');
    assert.equal(backLink?.classList.contains('text-link-button'), true);
    assert.notExists(
      backLink?.closest('.card-form-back-header, .bank-provider-back-header')
    );
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
        'Choose a payment method',
      'card save did not complete'
    );
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
    );
  });

  test('Connect another way requires an instrument schema before rendering its form', async () => {
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
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Connect your bank'
    );
    assert.exists(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider'));
    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const manualAction = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="add-ach-manually"]'
    )!;
    assert.equal(manualAction.textContent?.trim(), 'Connect another way');
    assert.exists(manualAction.closest('.widget-action-footer'));
    assert.notExists(manualAction.closest('.widget-content'));
    assert.isAtLeast(
      manualAction.getBoundingClientRect().top,
      shell.getBoundingClientRect().top
    );
    assert.isAtMost(
      manualAction.getBoundingClientRect().bottom,
      shell.getBoundingClientRect().bottom
    );

    await clickAction(el, 'add-ach-manually');
    await waitForRequest(requests, '/party/configuration-inquiry');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Select an instrument schema',
      'instrument schema chooser did not load'
    );

    const configRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/party/configuration-inquiry'
    )!;
    assertPartyCountryTenderConfigRequest(configRequest, 'GBR');

    const radios = [
      ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
        'input[name="instrument-schema"]'
      ),
    ];
    assert.deepEqual(
      radios.map((radio) => radio.value),
      ['CAD-Canadian-B', 'CAD-Interac-B']
    );
    assert.deepEqual(
      radios.map((radio) => radio.dataset.instrumentSchemaCode),
      ['CAD-Canadian-B', 'CAD-Interac-B']
    );
    assert.isTrue(radios.every((radio) => !radio.checked));
    assert.include(el.shadowRoot!.textContent, 'CAD-Canadian-B');
    assert.include(el.shadowRoot!.textContent, 'CAD-Interac-B');

    const continueButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="select-instrument-schema"]'
    )!;
    assert.isTrue(continueButton.disabled);
    assert.notExists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );

    radios[0].click();
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
    assert.include(el.shadowRoot!.textContent, 'City is required');

    const accountNumber = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="accountNumber"]'
    )!;
    accountNumber.value = 'abc';
    accountNumber.dispatchEvent(new InputEvent('input', {bubbles: true}));
    await flushElement(el);
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
    accountHolderName.value = 'Draft account holder';
    accountHolderName.dispatchEvent(new InputEvent('input', {bubbles: true}));
    await flushElement(el);

    await clickAction(el, 'back-to-instrument-schema-selection');

    const retainedRadios = [
      ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
        'input[name="instrument-schema"]'
      ),
    ];
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Select an instrument schema'
    );
    assert.isTrue(retainedRadios[0].checked);
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
    const interacRadio = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[value="CAD-Interac-B"]'
    )!;
    interacRadio.click();
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

    await initConfig!.onEvent({type: 'failure'});
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter bank details'
    );
    assert.exists(el.shadowRoot!.querySelector('input[name="interacAccount"]'));

    const requestedPaths = requests.map(
      (request) => new URL(request.url).pathname
    );
    assert.notInclude(requestedPaths, '/form.json');
    assert.notInclude(requestedPaths, '/interaction/source/ach');
    assert.notInclude(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'PUT /interaction/source/pbb/session/agg-session-1/p-token-1'
    );
  });

  test('saves a valid manual Canadian bank account and sanitizes the emitted source', async () => {
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

      if (pathname === '/interaction/source/ach') {
        return new Response(
          JSON.stringify({
            sourceId: 'bank-created-1',
            status: 'UNDER_REVIEW',
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
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await clickAction(el, 'add-ach-manually');
    await waitFor(
      () =>
        Boolean(el.shadowRoot!.querySelector('input[name="accountNumber"]')),
      'manual bank form did not render'
    );

    const saveButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      'button[data-action="save-bank-account"]'
    )!;
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
    await setBankField('institutionNumber', '002');
    await setBankField('transitNumber', '12345');
    await waitForActionEnabled(el, 'save-bank-account');
    await clickAction(el, 'save-bank-account');
    await waitForRequest(requests, '/interaction/source/ach');
    await waitFor(
      () => addPaymentMethodEvents.length === 1,
      'manual bank source event was not emitted'
    );

    const addressRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/interaction/billing-address'
    )!;
    const sourceRequest = requests.find(
      (request) => new URL(request.url).pathname === '/interaction/source/ach'
    )!;
    const addressBody = JSON.parse(addressRequest.bodyText);
    const sourceBody = JSON.parse(sourceRequest.bodyText);
    const encryptedAccountNumber = sourceBody.bankAccount.accountNumber;
    const encryptedAccountNumberReEntered =
      sourceBody.bankAccount.accountNumberReEntered;
    const encryptedRoutingNumber = sourceBody.bankAccount.routingNumber;

    assert.match(addressBody.id, /^[0-9a-f-]{36}$/u);
    assert.deepEqual(addressBody, {
      id: addressBody.id,
      recipientNameOrAddress: 'Bob Bobson',
      street: '',
      city: 'Toronto',
      postalCode: '',
      country: '',
    });
    assert.match(sourceBody.id, /^[0-9a-f-]{36}$/u);
    assert.deepEqual(sourceBody, {
      id: sourceBody.id,
      name: 'Bob Bobson',
      billingAddressId: 'billing-bank-1',
      productCode: 'POLOCALBANK',
      tenderType: 'BANK_ACCOUNT',
      accountHolderType: 'BUSINESS',
      bankAccount: {
        routingNumber: encryptedRoutingNumber,
        routingNumberEncrypted: encryptedRoutingNumber,
        accountNumber: encryptedAccountNumber,
        accountNumberEncrypted: encryptedAccountNumber,
        accountNumberReEntered: encryptedAccountNumberReEntered,
        asset: {type: 'CURRENCY', id: 'CAD'},
        accountType: 'CHECKING',
        institutionNumber: '12345',
        transitNumber: '002',
        accountIdentificationNumberType: 'CANADIAN',
      },
    });
    assert.equal(await decryptSourceValue(encryptedAccountNumber), '0000026');
    assert.equal(await decryptSourceValue(encryptedRoutingNumber), '1223');
    assert.equal(
      await decryptSourceValue(encryptedAccountNumberReEntered),
      '0000026'
    );
    assert.notEqual(encryptedAccountNumber, encryptedAccountNumberReEntered);
    assert.notInclude(sourceRequest.bodyText, '0000026');
    assertSourceCreateHeaders(sourceRequest);
    const emittedBankSource = addPaymentMethodEvents[0].detail as Extract<
      PaymentSource,
      {tenderType: 'BankAccount'}
    >;

    assert.equal(emittedBankSource.id, 'bank-created-1');
    assert.equal(emittedBankSource.bankAccount?.accountNumber, '0026');
    assert.notInclude(JSON.stringify(emittedBankSource), '0000026');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
  });

  test('blocks manual bank account save when source encryption fails', async () => {
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
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await clickAction(el, 'add-ach-manually');
    await waitFor(
      () =>
        Boolean(el.shadowRoot!.querySelector('input[name="accountNumber"]')),
      'manual bank form did not render'
    );

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
  });

  test('missing and empty instrument schemas use the bundled legacy ACH form', async () => {
    const requests: CapturedRequest[] = [];
    let configAttempt = 0;
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
        configAttempt += 1;

        if (configAttempt === 1) {
          return new Response(
            JSON.stringify({configurationType: 'COUNTRY_TENDER'}),
            {status: 200, headers: {'Content-Type': 'application/json'}}
          );
        }

        return bankAccountCountryConfigResponse([]);
      }

      if (pathname === '/interaction/source/ach') {
        return new Response(
          JSON.stringify({sourceId: 'bank-legacy-1', status: 'UNDER_REVIEW'}),
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
      country: 'US',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });
    const {addPaymentMethodEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await clickAction(el, 'add-ach-manually');
    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('#ach-routing-number')),
      'missing schemas did not open the legacy form'
    );

    assert.exists(el.shadowRoot!.querySelector('#ach-account-nickname'));
    assert.notExists(
      el.shadowRoot!.querySelector('input[name="instrument-schema"]')
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/form.json'
    );

    await clickAction(el, 'back-to-bank-provider');
    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider')),
      'bank provider did not reopen'
    );
    await clickAction(el, 'add-ach-manually');
    await waitFor(
      () => configAttempt === 2,
      'empty schema configuration was not requested'
    );
    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('#ach-routing-number')),
      'empty schemas did not open the legacy form'
    );

    await setFieldValue(el, 'ach-account-nickname', 'Household checking');
    await setFieldValue(el, 'ach-routing-number', '1223');
    await setFieldValue(el, 'ach-account-number', '123456789012');
    await setFieldValue(el, 'ach-account-number-confirm', '123456789012');
    await blurField(el, 'ach-routing-number');
    await blurField(el, 'ach-account-number');
    await blurField(el, 'ach-account-number-confirm');
    await waitForActionEnabled(el, 'save-bank-account');

    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#ach-account-number')
        ?.value,
      '••••••••9012'
    );

    await clickAction(el, 'save-bank-account');
    await waitForRequest(requests, '/interaction/source/ach');
    await waitFor(
      () => addPaymentMethodEvents.length === 1,
      'legacy bank source event was not emitted'
    );

    const sourceRequest = requests.find(
      (request) => new URL(request.url).pathname === '/interaction/source/ach'
    )!;
    const sourceBody = JSON.parse(sourceRequest.bodyText);

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/billing-address'
    );
    assert.equal(
      await decryptSourceValue(sourceBody.bankAccount.routingNumber),
      '1223'
    );
    assert.equal(
      await decryptSourceValue(sourceBody.bankAccount.accountNumber),
      '123456789012'
    );
    assert.equal(sourceBody.name, 'Household checking');
    assert.equal(sourceBody.productCode, 'POACH');
    assert.equal(sourceBody.tenderType, 'BANK_ACCOUNT');
    assert.deepEqual(sourceBody.bankAccount.asset, {
      type: 'CURRENCY',
      id: 'USD',
    });
    assertSourceCreateHeaders(sourceRequest);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
  });

  test('manual schema selection blocks and retries failed and malformed responses', async () => {
    const requests: CapturedRequest[] = [];
    let configAttempt = 0;
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
      country: 'US',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);
    await clickAction(el, 'add-ach-manually');

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
        el.shadowRoot!.querySelector('[data-action="back-to-bank-provider"]')
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
        'Select an instrument schema',
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

  test('a singleton instrument schema opens its form and Back returns to the bank provider', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;
    let initCount = 0;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
        initCount += 1;
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
      country: 'USA',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);
    await clickAction(el, 'add-ach-manually');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Enter bank details',
      'singleton schema form did not load'
    );

    const configRequest = requests.find(
      (request) =>
        new URL(request.url).pathname === '/party/configuration-inquiry'
    )!;
    assertPartyCountryTenderConfigRequest(configRequest, 'USA');
    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('input[name="instrument-schema"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="select-instrument-schema"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="save-ach-manual"]')
    );

    await clickAction(el, 'back-to-bank-provider');
    await waitFor(
      () => initCount === 2,
      'PaymentSDK.init was not called again'
    );
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Connect your bank'
    );
    assert.exists(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider'));
    assert.equal(initConfig?.containerId, 'commerce-hub-pbb-provider');
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/form.json'
    );
  });

  test('manual instrument schema inquiry ignores a stale response after the interaction changes', async () => {
    const requests: CapturedRequest[] = [];
    const pendingConfig = deferredResponse();
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
      country: 'US',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);
    await clickAction(el, 'add-ach-manually');
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
      'Add payment method'
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
      ['POST /interaction/billing-address', 'POST /interaction/source/card']
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

  test('card save shows an under-review outcome when the created card is under review', async () => {
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
        'Verification pending review',
      'card under-review outcome was not shown'
    );

    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="done-payment-source-verification"]'
        )
        ?.textContent?.trim(),
      'Back'
    );
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
    await clickAction(el, 'add-bank-account');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Add payment method',
      'bank provider failure did not return to payment methods'
    );
    await clickAction(el, 'add-card');
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/customer'
    );
  });

  test('creates a verified card, returns it selected, then attaches it only after explicit confirmation', async () => {
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
    const {successEvents, addPaymentMethodEvents, errorEvents, eventOrder} =
      recordOutputEvents(el);

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);

    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await waitForActionEnabled(el, 'save-card');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.interactionResponse?.selectedSource?.id === 'card-created-1' &&
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
          'Choose a payment method',
      'verified card did not return to the payment method list'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/billing-address', 'POST /interaction/source/card']
    );
    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder, ['onAddPaymentMethod']);
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
    );

    await clickAction(el, 'attach-payment-source');
    await waitFor(
      () =>
        successEvents.length === 1 &&
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
          'Payment method saved',
      'created card was not attached after explicit confirmation'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'POST /interaction/billing-address',
        'POST /interaction/source/card',
        'POST /interaction/source/card-created-1/attach',
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
    const attachRequest = requests.find(
      (request) =>
        new URL(request.url).pathname ===
        '/interaction/source/card-created-1/attach'
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
    assert.equal(attachRequest.bodyText, '');
    assert.equal(
      attachRequest.headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(attachRequest.credentials, 'include');
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-created-1');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.lengthOf(addPaymentMethodEvents, 1);
    assert.equal(addPaymentMethodEvents[0].detail.id, 'card-created-1');
    assert.equal(addPaymentMethodEvents[0].detail.name, 'Ada corporate card');
    assert.lengthOf(successEvents, 1);
    assert.deepEqual(successEvents[0].detail, {
      id: 'card-created-1',
      tenderType: 'Card',
      name: 'Attached card from source response',
      verificationInfo: {status: 'VERIFIED'},
      card: {
        network: 'Mastercard',
        cardNumber: '5555555555554444',
      },
    });
    assert.deepEqual(eventOrder, ['onAddPaymentMethod', 'onSelect']);
    assert.lengthOf(errorEvents, 0);
    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-row'
      ),
    ];

    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="change-payment-source"]')
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.lengthOf(rows, 0);
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-title'
        )
        ?.textContent?.trim(),
      'Attached card from source response'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      'Mastercard ending 4444'
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
          'Choose a payment method',
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
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
    );

    await clickAction(el, 'attach-payment-source');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment method saved',
      'existing-address card was not attached after explicit confirmation'
    );

    assert.include(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1/attach'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="change-payment-source"]')
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
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
      'Choose a payment method'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Card from validate response'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.payment-method-meta')?.textContent?.trim(),
      'Visa ending 4242'
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
      'Choose a payment method'
    );
    assert.equal(el.interactionResponse?.features, undefined);
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.widget-toolbar [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['toggle-payment-source-edit-mode']
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

    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.widget-toolbar [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['toggle-payment-source-edit-mode', 'open-add-payment-source']
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
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
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

    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.widget-toolbar [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['toggle-payment-source-edit-mode']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
          '.payment-method-radio'
        ),
      ].map((radio) => radio.value),
      ['bank-1', 'bank-2']
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="open-transfer"]')
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
      'Choose a payment method'
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.widget-toolbar [data-action]'
        ),
      ].map((button) => button.dataset.action),
      ['toggle-payment-source-edit-mode', 'open-add-payment-source']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
          '.payment-method-radio'
        ),
      ].map((radio) => radio.value),
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
      [
        'toggle-payment-source-edit-mode',
        'open-add-payment-source',
        'open-transfer',
      ]
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

    await clickAction(el, 'add-bank-account');
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

  test('confirming a selected method refreshes payment info, emits onSelect, and shows the selected payment review', async () => {
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

      if (pathname === '/interaction/source/card-1/attach') {
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

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [selectedSource],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    el.shadowRoot!.querySelector<HTMLInputElement>(
      '.payment-method-radio'
    )!.click();
    await flushElement(el);

    assert.lengthOf(requests, 0);
    assert.lengthOf(successEvents, 0);
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));

    await clickAction(el, 'attach-payment-source');
    await waitFor(() => successEvents.length === 1, 'attach did not complete');
    await flushElement(el);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/source/card-1/attach']
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[0].credentials, 'include');
    assert.lengthOf(successEvents, 1);
    assert.deepEqual(successEvents[0].detail, refreshedSource);
    assert.lengthOf(errorEvents, 0);
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-1');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment method saved'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="change-payment-source"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-title'
        )
        ?.textContent?.trim(),
      'Corporate Visa'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      'Visa ending 1111'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
  });

  test('confirmed source deletion emits deleted payment source id', async () => {
    window.fetch = async () => new Response('', {status: 200});

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

    await clickAction(el, 'toggle-payment-source-edit-mode');
    await clickAction(el, 'delete-payment-source');
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

  test('saved payment verification emits before a later explicitly confirmed onSelect event', async () => {
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
      'Choose a payment method'
    );
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
    );

    await clickAction(el, 'attach-payment-source');
    await waitFor(
      () => successEvents.length === 1,
      'verified source was not attached after explicit confirmation'
    );

    assert.lengthOf(successEvents, 1);
    assert.deepEqual(successEvents[0].detail, verifiedSource);
    assert.deepEqual(eventOrder, ['onVerifyPaymentMethod', 'onSelect']);
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

    await clickAction(el, 'add-bank-account');

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
      ).minHeight,
      '500px'
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
      },
      {
        colors: {
          widgetBackground: '#fafafa',
          primary: '#123456',
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

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Connect your bank'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-shell-wide'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.provider-frame-header'));
    assert.exists(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider'));
    const backLink = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-header-action [data-action="back-to-payment-methods"]'
    );
    assert.equal(backLink?.textContent?.trim(), 'Back');
    assert.equal(backLink?.classList.contains('text-link-button'), true);
    assert.notExists(
      backLink?.closest('.card-form-back-header, .bank-provider-back-header')
    );
    assert.equal(initConfig?.apiKey, 'override-api-key');
    assert.equal(initConfig?.configId, 'override-config-id');
    assert.equal(initConfig?.accessToken, 'access-token-1');
    assert.equal(initConfig?.aggregatorSessionId, 'agg-session-1');
    assert.equal(initConfig?.pToken, 'p-token-1');
    assert.equal(initConfig?.publicKey, 'public-key-1');
    assert.equal(initConfig?.environment, 'sandbox');
    assert.equal(initConfig?.locale, 'en-CA');
    assert.equal(initConfig?.containerId, 'commerce-hub-pbb-provider');
    assert.deepEqual(initConfig?.appearance, {
      branding: {
        backgroundColor: '#fafafa',
        primaryColor: '#123456',
        primaryTextColor: '#1f2937',
        secondaryTextColor: '#4b5563',
        buttonColor: '#123456',
        dangerColor: '#dc2626',
        successColor: '#059669',
        borderColor: '#d1d5db',
        placeholderColor: '#9ca3af',
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

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');

    assert.equal(
      initConfig?.apiKey,
      'YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A'
    );
    assert.equal(initConfig?.configId, 'cce84049-0940-4926-9a54-9eaca0c09830');
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

    await clickAction(el, 'add-bank-account');
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
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: {
            tenderType: 'BankAccount',
            id: 'bank-new',
            name: 'Operating account',
          },
          paymentSources: [],
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

    await clickAction(el, 'add-bank-account');
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
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Choose a payment method'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
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
      'Bank account ending ----'
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
    assert.deepEqual(eventOrder, ['onAddPaymentMethod']);
    assert.lengthOf(errorEvents, 0);

    await clickAction(el, 'attach-payment-source');
    await waitFor(
      () => successEvents.length === 1,
      'bank source was not attached after explicit confirmation'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'POST /interaction/source/bank-new/attach',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment method saved'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.equal(successEvents[0].detail.id, 'bank-new');
    assert.deepEqual(eventOrder, ['onAddPaymentMethod', 'onSelect']);
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
        'Choose a payment method',
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
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="back-to-payment-methods"]'
        )
        ?.textContent?.trim(),
      'Back'
    );
    assert.notExists(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="back-to-payment-methods"]'
        )
        ?.closest('.card-form-back-header, .bank-provider-back-header')
    );
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

  test('Connect your bank required-info Verify enables when only optional information is provided', async () => {
    const {el} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'BANK_STATEMENT', mandatory: true},
        {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
      ],
    });
    const verifyButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.primitive-footer button[data-action="submit-required-info"]'
    )!;
    const optionalUploadRow = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-required-info-requirement="optional"] .upload-row'
    )!;

    assert.equal(verifyButton.disabled, true);

    optionalUploadRow.click();
    await flushElement(el);
    await selectRequiredInfoFile(el, 'driver-license.pdf');

    assert.equal(verifyButton.disabled, false);
  });

  test('Connect your bank required-info Verify shows an account verification overlay while pending', async () => {
    const pendingUpload = deferredResponse();
    const {el} = await completePayByBankFlow({
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
        'Choose a payment method',
      'verified source did not return to the payment method list'
    );
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
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
        'Choose a payment method'
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
        'Choose a payment method',
      'verified bank source did not return to the payment method list'
    );

    assert.deepEqual(
      requests
        .slice(2)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/doc/upload/bank-new/BANK_STATEMENT',
        'POST /interaction/verify/step2',
      ]
    );
    assert.include(requests[2].headers.get('content-type') ?? '', 'multipart');
    assert.equal(
      requests[2].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.include(requests[2].bodyText, 'name="file"');
    assert.include(requests[2].bodyText, 'filename="may-bank-statement.pdf"');
    assert.equal(requests[3].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'VERIFIED'
    );
    assert.lengthOf(verifyPaymentMethodEvents, 1);
    assert.equal(verifyPaymentMethodEvents[0].detail.id, 'bank-verified');
    assert.lengthOf(successEvents, 0);
    assert.deepEqual(eventOrder.slice(-1), ['onVerifyPaymentMethod']);
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
    );

    await clickAction(el, 'attach-payment-source');
    await waitForRequest(requests, '/interaction/source/bank-verified/attach');
    await waitFor(
      () => successEvents.length === 1,
      'verified bank source was not attached after explicit confirmation'
    );

    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-verified');
    assert.lengthOf(successEvents, 1);
    assert.equal(successEvents[0].detail.id, 'bank-verified');
    assert.deepEqual(eventOrder.slice(-2), [
      'onVerifyPaymentMethod',
      'onSelect',
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
        .slice(2)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/doc/upload/bank-new/BANK_STATEMENT',
        'POST /interaction/verify/step2',
        'POST /interaction/doc/upload/bank-new/DRIVER_LICENSE_PHOTO',
        'POST /interaction/verify/step2',
      ]
    );
    assert.include(requests[2].bodyText, 'filename="may-bank-statement.pdf"');
    assert.equal(requests[3].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.include(requests[4].bodyText, 'filename="driver-license.pdf"');
    assert.equal(requests[5].bodyText, JSON.stringify({value: 'bank-new'}));
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
        .slice(2)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/verify/uploadField',
        'POST /interaction/verify/uploadField',
        'POST /interaction/verify/step2',
      ]
    );
    assert.equal(
      requests[2].bodyText,
      JSON.stringify({
        docType: 'DRIVER_LICENSE_NUMBER',
        value: 'bank-new',
        docValue: 'D1234567',
      })
    );
    assert.equal(
      requests[3].bodyText,
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
        .slice(2)
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
        'Choose a payment method',
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
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Choose a payment method'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
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
    assert.deepEqual(eventOrder, ['onAddPaymentMethod']);

    await clickAction(el, 'attach-payment-source');
    await waitFor(
      () => successEvents.length === 1,
      'verified source was not attached after explicit confirmation'
    );

    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-verified');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.deepEqual(eventOrder, ['onAddPaymentMethod', 'onSelect']);
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

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
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

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
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

      await clickAction(el, 'add-bank-account');
      await waitFor(
        () => Boolean(initConfig),
        'PaymentSDK.init was not called'
      );
      await initConfig!.onEvent({type: terminalType});
      await flushElement(el);

      assert.equal(
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
        'Choose a payment method',
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

    await clickAction(scriptFailureEl, 'add-bank-account');
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
      'Add payment method'
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

    await clickAction(incompleteSessionEl, 'add-bank-account');
    await flushElement(incompleteSessionEl);

    assert.equal(
      incompleteSessionEl
        .shadowRoot!.querySelector('.widget-title')
        ?.textContent?.trim(),
      'Add payment method'
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

    await clickAction(el, 'add-bank-account');
    await waitFor(() => initCount === 1, 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'failure'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );

    await clickAction(el, 'add-bank-account');
    await waitFor(
      () => initCount === 2,
      'PaymentSDK.init was not called again'
    );

    assert.isAtLeast(destroyCount, 2);

    await initConfig!.onEvent({type: 'cancel'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
  });
});
