(function (globalScope) {
  'use strict';

  function createClient(options) {
    var baseUrl = (options && options.baseUrl ? options.baseUrl : '/api').replace(/\/$/, '');

    async function request(path, init, responseMode) {
      var response = await fetch(baseUrl + path, Object.assign({ headers: { Accept: 'application/json' } }, init || {}));
      var contentType = response.headers.get('content-type') || '';
      var body = response.status === 204
        ? undefined
        : responseMode === 'text'
          ? await response.text()
          : contentType.includes('application/json')
            ? await response.json()
            : await response.text();

      if (!response.ok) {
        var message = typeof body === 'string' && body ? body : body && body.message ? body.message : response.statusText;
        var error = new Error(message || 'Request failed.');
        error.status = response.status;
        error.body = body;
        throw error;
      }

      return body;
    }

    return {
      createInteraction: function (payload) {
        return request('/merchant/interaction/create', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      getInteractionStatus: function () {
        return request('/interaction', { method: 'GET' });
      },
      sendInteractionOtp: function (payload) {
        return request('/interaction/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      sendInteractionOtpToEmail: function (payload) {
        return request('/interaction/otp/send/email', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      validateInteractionOtp: function (payload) {
        return request('/interaction/otp/validate', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      attachPaymentSource: function (paymentSourceId) {
        return request('/interaction/payment-source/' + encodeURIComponent(paymentSourceId) + '/attach', { method: 'POST', headers: { Accept: 'application/json' }, body: '{}' });
      },
      addSource: function (payload) {
        return request('/customer/source', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain' }, body: JSON.stringify(payload) }, 'text');
      },
      updateSource: function (payload) {
        return request('/customer/source', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      deleteSource: function (sourceId) {
        return request('/customer/source/' + encodeURIComponent(sourceId), { method: 'DELETE', credentials: 'include' });
      },
      getCustomerProfile: function () {
        return request('/customer', { method: 'GET', credentials: 'include' });
      },
      mask: function (type, payload) {
        return request('/customer/mask/' + encodeURIComponent(type), { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      createPayByBankSession: function () {
        return request('/pbb/session', { method: 'GET', credentials: 'include' });
      },
      finalizePayByBankSession: function (aldSessionId, pToken) {
        return request('/pbb/session/' + encodeURIComponent(aldSessionId) + '/' + encodeURIComponent(pToken), { method: 'PUT', credentials: 'include' });
      }
    };
  }

  var api = {
    version: '0.0.1',
    createClient: createClient,
  };

  globalScope.CommerceHubConnectWebSdk = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
