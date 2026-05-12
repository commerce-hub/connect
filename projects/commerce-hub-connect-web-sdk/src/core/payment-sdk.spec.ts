import { destroyPaymentSdk, loadPaymentSdkScript, resolvePayByBankOptions } from './payment-sdk';

describe('payment sdk helpers', () => {
  const scriptUrl = 'https://example.test/PaymentSDK.js';

  afterEach(() => {
    delete window.PaymentSDK;
    document.head.querySelectorAll(`script[src="${scriptUrl}"]`).forEach((element) => element.remove());
  });

  it('reuses a host-provided PaymentSDK without injecting another script', async () => {
    window.PaymentSDK = {
      init: jasmine.createSpy('init'),
      destroy: jasmine.createSpy('destroy'),
    };

    await loadPaymentSdkScript(scriptUrl);

    expect(document.head.querySelector(`script[src="${scriptUrl}"]`)).toBeNull();
  });

  it('waits for a pre-existing script tag to expose PaymentSDK', async () => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    document.head.appendChild(script);

    const promise = loadPaymentSdkScript(scriptUrl);
    queueMicrotask(() => {
      window.PaymentSDK = {
        init: () => undefined,
      };
      script.dispatchEvent(new Event('load'));
    });

    await expectAsync(promise).toBeResolved();
  });

  it('merges pay by bank overrides without reintroducing framework dependencies', () => {
    expect(
      resolvePayByBankOptions('cat', {
        locale: 'fr-CA',
        paymentSdkUrl: scriptUrl,
      }),
    ).toEqual(
      jasmine.objectContaining({
        environment: 'cat',
        locale: 'fr-CA',
        paymentSdkUrl: scriptUrl,
      }),
    );
  });

  it('tears down the hosted PaymentSDK safely', () => {
    const destroy = jasmine.createSpy('destroy');
    window.PaymentSDK = {
      init: () => undefined,
      destroy,
    };

    destroyPaymentSdk();

    expect(destroy).toHaveBeenCalled();
  });
});
