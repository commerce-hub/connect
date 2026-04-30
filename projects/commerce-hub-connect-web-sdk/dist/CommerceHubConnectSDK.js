globalThis.__commerceHubConnectWebSdkInlineCss = ":host,\n.commerce-hub-connect-web-sdk-mount {\n  color: var(--ch-sdk-text, #101828);\n  font-family: var(--ch-sdk-font-family, \"Open Sans\", \"Segoe UI\", sans-serif);\n}\n\n.ch-sdk-shell {\n  --ch-sdk-primary-soft: color-mix(in srgb, var(--ch-sdk-primary, #0a5dff) 12%, white);\n  --ch-sdk-primary-strong: color-mix(in srgb, var(--ch-sdk-primary, #0a5dff) 86%, black);\n  --ch-sdk-secondary-soft: color-mix(in srgb, var(--ch-sdk-secondary, #627d98) 18%, white);\n  --ch-sdk-border: rgba(148, 163, 184, 0.42);\n  --ch-sdk-input-border: rgba(148, 163, 184, 0.55);\n  --ch-sdk-muted: color-mix(in srgb, var(--ch-sdk-text, #101828) 58%, white);\n  --ch-sdk-surface: #f3f5f8;\n  --ch-sdk-panel: rgba(255, 255, 255, 0.72);\n  --ch-sdk-panel-strong: #ffffff;\n  --ch-sdk-shadow: 0 28px 60px rgba(15, 23, 42, 0.10);\n  --ch-sdk-danger: #b42318;\n  --ch-sdk-danger-soft: rgba(180, 35, 24, 0.08);\n  --ch-sdk-success: #047857;\n  --ch-sdk-success-soft: rgba(4, 120, 87, 0.10);\n  width: 100%;\n}\n\n.ch-sdk-header {\n  display: flex;\n  justify-content: center;\n  margin-bottom: 10px;\n}\n\n.ch-sdk-logo {\n  max-height: 34px;\n  max-width: 168px;\n  object-fit: contain;\n}\n\n.ch-sdk-card {\n  display: grid;\n  gap: 16px;\n  width: 100%;\n  max-width: 430px;\n  margin: 0 auto;\n  padding: 14px;\n  border: 1px solid rgba(255, 255, 255, 0.65);\n  border-radius: 28px;\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(244, 246, 250, 0.98)),\n    var(--ch-sdk-surface);\n  box-shadow: var(--ch-sdk-shadow);\n}\n\n.ch-sdk-card-body {\n  display: grid;\n  gap: 18px;\n  padding: 6px;\n}\n\n.ch-sdk-footer-brand {\n  text-align: center;\n  font-size: 0.94rem;\n  font-weight: 600;\n  color: color-mix(in srgb, var(--ch-sdk-text) 18%, white);\n}\n\n.ch-sdk-title-block {\n  display: grid;\n  gap: 8px;\n}\n\n.ch-sdk-title-block--centered {\n  text-align: center;\n}\n\n.ch-sdk-title-block h2 {\n  margin: 0;\n  font-size: 2rem;\n  line-height: 1.04;\n  letter-spacing: -0.04em;\n  font-weight: 800;\n}\n\n.ch-sdk-title-block p {\n  margin: 0;\n  color: var(--ch-sdk-muted);\n  line-height: 1.55;\n  font-size: 0.97rem;\n}\n\n.ch-sdk-form,\n.ch-sdk-stack {\n  display: grid;\n  gap: 16px;\n}\n\n.ch-sdk-grid {\n  display: grid;\n  gap: 14px;\n}\n\n.ch-sdk-grid--two {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n\n.ch-sdk-form-intro {\n  display: grid;\n  gap: 4px;\n  padding: 2px 2px 0;\n}\n\n.ch-sdk-form-intro strong {\n  font-size: 0.98rem;\n}\n\n.ch-sdk-form-intro p {\n  margin: 0;\n  color: var(--ch-sdk-muted);\n  font-size: 0.92rem;\n  line-height: 1.5;\n}\n\n.ch-sdk-field {\n  display: grid;\n  gap: 7px;\n}\n\n.ch-sdk-field span {\n  font-size: 0.86rem;\n  font-weight: 600;\n  color: color-mix(in srgb, var(--ch-sdk-text) 72%, white);\n}\n\n.ch-sdk-field input,\n.ch-sdk-field select {\n  width: 100%;\n  min-height: 50px;\n  padding: 0 16px;\n  border: 1px solid var(--ch-sdk-input-border);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.9);\n  color: var(--ch-sdk-text);\n  font: inherit;\n  box-sizing: border-box;\n  transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;\n}\n\n.ch-sdk-field input::placeholder {\n  color: color-mix(in srgb, var(--ch-sdk-text) 40%, white);\n}\n\n.ch-sdk-field input:focus,\n.ch-sdk-field select:focus,\n.ch-sdk-otp-digit:focus,\n.ch-sdk-source-option:focus-visible,\n.ch-sdk-button:focus-visible,\n.ch-sdk-link-button:focus-visible,\n.ch-sdk-pill-button:focus-visible {\n  outline: 0;\n  border-color: var(--ch-sdk-primary);\n  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ch-sdk-primary) 16%, white);\n}\n\n.ch-sdk-field-help,\n.ch-sdk-field-error,\n.ch-sdk-helper-copy {\n  font-size: 0.82rem;\n}\n\n.ch-sdk-field-help,\n.ch-sdk-helper-copy {\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-field-error {\n  color: var(--ch-sdk-danger);\n}\n\n.ch-sdk-button,\n.ch-sdk-link-button,\n.ch-sdk-source-option,\n.ch-sdk-pill-button {\n  font: inherit;\n}\n\n.ch-sdk-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  min-height: 48px;\n  width: 100%;\n  padding: 0 20px;\n  border: 0;\n  border-radius: 999px;\n  background: linear-gradient(180deg, var(--ch-sdk-primary), var(--ch-sdk-primary-strong));\n  color: #fff;\n  font-weight: 700;\n  cursor: pointer;\n  transition: transform 120ms ease, filter 120ms ease, opacity 120ms ease;\n}\n\n.ch-sdk-button:hover:not(:disabled) {\n  filter: brightness(1.02);\n  transform: translateY(-1px);\n}\n\n.ch-sdk-button:disabled,\n.ch-sdk-link-button:disabled,\n.ch-sdk-pill-button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.ch-sdk-button-label {\n  display: inline-flex;\n  align-items: center;\n}\n\n.ch-sdk-button-icon {\n  font-size: 1rem;\n  line-height: 1;\n}\n\n.ch-sdk-button--secondary {\n  background: rgba(255, 255, 255, 0.88);\n  color: var(--ch-sdk-text);\n  border: 1px solid var(--ch-sdk-border);\n}\n\n.ch-sdk-button-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n\n.ch-sdk-button-row .ch-sdk-button--secondary {\n  width: auto;\n  min-width: 140px;\n}\n\n.ch-sdk-inline-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n}\n\n.ch-sdk-inline-actions--centered {\n  justify-content: center;\n}\n\n.ch-sdk-inline-separator {\n  color: color-mix(in srgb, var(--ch-sdk-text) 28%, white);\n}\n\n.ch-sdk-link-button {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: var(--ch-sdk-primary);\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.ch-sdk-helper-copy {\n  margin: 0;\n  text-align: center;\n}\n\n.ch-sdk-pill-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n\n.ch-sdk-pill-button {\n  min-height: 40px;\n  padding: 0 16px;\n  border: 1px solid color-mix(in srgb, var(--ch-sdk-primary) 18%, white);\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--ch-sdk-primary) 10%, white);\n  color: var(--ch-sdk-primary);\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.ch-sdk-alert {\n  padding: 14px 16px;\n  border-radius: 18px;\n  font-size: 0.92rem;\n  line-height: 1.45;\n}\n\n.ch-sdk-alert--error {\n  background: var(--ch-sdk-danger-soft);\n  color: var(--ch-sdk-danger);\n}\n\n.ch-sdk-alert--success {\n  background: var(--ch-sdk-success-soft);\n  color: var(--ch-sdk-success);\n}\n\n.ch-sdk-alert--success-prominent {\n  text-align: center;\n  font-weight: 700;\n}\n\n.ch-sdk-source-list {\n  display: grid;\n  gap: 12px;\n}\n\n.ch-sdk-source-option,\n.ch-sdk-success-summary {\n  display: grid;\n  grid-template-columns: auto auto minmax(0, 1fr);\n  align-items: center;\n  gap: 14px;\n  width: 100%;\n  padding: 15px 16px;\n  border: 1px solid rgba(203, 213, 225, 0.9);\n  border-radius: 20px;\n  background: rgba(255, 255, 255, 0.84);\n  color: inherit;\n  box-sizing: border-box;\n}\n\n.ch-sdk-source-option {\n  cursor: pointer;\n  text-align: left;\n}\n\n.ch-sdk-source-option.is-selected {\n  border-color: color-mix(in srgb, var(--ch-sdk-primary) 48%, white);\n  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ch-sdk-primary) 10%, white);\n}\n\n.ch-sdk-source-radio {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  border: 1px solid var(--ch-sdk-input-border);\n  border-radius: 999px;\n  background: #fff;\n}\n\n.ch-sdk-source-radio span {\n  width: 10px;\n  height: 10px;\n  border-radius: 999px;\n  background: var(--ch-sdk-primary);\n}\n\n.ch-sdk-source-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 54px;\n  min-height: 42px;\n  padding: 0 10px;\n  border-radius: 14px;\n  background: color-mix(in srgb, var(--ch-sdk-primary) 14%, white);\n  color: var(--ch-sdk-primary);\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n\n.ch-sdk-source-copy {\n  display: grid;\n  min-width: 0;\n  gap: 4px;\n}\n\n.ch-sdk-source-copy strong,\n.ch-sdk-source-copy small {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ch-sdk-source-copy small {\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-empty-state {\n  padding: 16px;\n  border: 1px dashed rgba(148, 163, 184, 0.7);\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.66);\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-bank-panel {\n  display: grid;\n  gap: 14px;\n  padding: 18px;\n  border-radius: 22px;\n  border: 1px solid rgba(203, 213, 225, 0.9);\n  background: rgba(255, 255, 255, 0.78);\n}\n\n.ch-sdk-bank-copy {\n  display: grid;\n  gap: 6px;\n}\n\n.ch-sdk-bank-copy p {\n  margin: 0;\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-bank-mount {\n  min-height: 180px;\n  border-radius: 18px;\n  border: 1px dashed color-mix(in srgb, var(--ch-sdk-primary) 28%, white);\n  background: #fff;\n}\n\n.ch-sdk-otp-group {\n  display: grid;\n  grid-template-columns: repeat(6, minmax(0, 1fr));\n  gap: 8px;\n}\n\n.ch-sdk-otp-digit {\n  min-width: 0;\n  height: 56px;\n  border: 1px solid var(--ch-sdk-input-border);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.82);\n  color: var(--ch-sdk-text);\n  text-align: center;\n  font: inherit;\n  font-size: 1.5rem;\n  font-weight: 700;\n  box-sizing: border-box;\n}\n\n@media (max-width: 640px) {\n  .ch-sdk-card {\n    padding: 12px;\n    border-radius: 24px;\n  }\n\n  .ch-sdk-card-body {\n    padding: 4px;\n  }\n\n  .ch-sdk-title-block h2 {\n    font-size: 1.7rem;\n  }\n\n  .ch-sdk-grid--two {\n    grid-template-columns: 1fr;\n  }\n\n  .ch-sdk-source-option,\n  .ch-sdk-success-summary {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n\n  .ch-sdk-source-radio {\n    display: none;\n  }\n\n  .ch-sdk-button-row {\n    flex-direction: column;\n  }\n\n  .ch-sdk-button-row .ch-sdk-button--secondary {\n    width: 100%;\n  }\n\n  .ch-sdk-otp-group {\n    gap: 6px;\n  }\n\n  .ch-sdk-otp-digit {\n    height: 52px;\n    font-size: 1.35rem;\n  }\n}\n";
"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // projects/commerce-hub-connect-web-sdk/src/contracts/environment.ts
  var COMMERCE_HUB_CONNECT_ENVIRONMENTS = ["dev", "qa", "cat", "prod"];
  var COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT = {
    dev: "https://dev.openfx-nonprod.aws.fisv.cloud",
    qa: "https://dev.openfx-nonprod.aws.fisv.cloud",
    cat: "https://dev.openfx-nonprod.aws.fisv.cloud",
    prod: "https://dev.openfx-nonprod.aws.fisv.cloud"
  };
  var LOCAL_RUNTIME_HOSTNAMES = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "[::1]"]);
  var LOCAL_PROXY_BASE_PATH = "/commerce-hub-proxy";
  function isCommerceHubConnectEnvironment(value) {
    return typeof value === "string" && COMMERCE_HUB_CONNECT_ENVIRONMENTS.includes(value);
  }
  function normalizeCommerceHubConnectEnvironment(value) {
    return value ?? "prod";
  }
  function normalizeCommerceHubConnectRuntimeOrigin(runtimeOrigin) {
    const trimmedOrigin = runtimeOrigin?.trim();
    if (!trimmedOrigin) {
      return void 0;
    }
    try {
      const parsedOrigin = new URL(trimmedOrigin);
      if (parsedOrigin.protocol !== "http:" && parsedOrigin.protocol !== "https:") {
        return void 0;
      }
      return parsedOrigin.origin;
    } catch {
      return void 0;
    }
  }
  function resolveCommerceHubConnectApiBaseUrl(environment, runtimeOrigin) {
    const normalizedEnvironment = normalizeCommerceHubConnectEnvironment(environment);
    const normalizedRuntimeOrigin = normalizeCommerceHubConnectRuntimeOrigin(runtimeOrigin);
    if (normalizedRuntimeOrigin) {
      const parsedRuntimeOrigin = new URL(normalizedRuntimeOrigin);
      if (LOCAL_RUNTIME_HOSTNAMES.has(parsedRuntimeOrigin.hostname)) {
        return `${parsedRuntimeOrigin.origin}${LOCAL_PROXY_BASE_PATH}/${normalizedEnvironment}`;
      }
    }
    return COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT[normalizedEnvironment];
  }

  // projects/commerce-hub-connect-web-sdk/src/core/api-client.ts
  var CommerceHubConnectApiError = class extends Error {
    constructor(message, status, body) {
      super(message);
      __publicField(this, "status", status);
      __publicField(this, "body", body);
      this.name = "CommerceHubConnectApiError";
    }
  };
  var CommerceHubConnectApiClient = class {
    constructor(baseUrl, interactionId) {
      __publicField(this, "baseUrl", baseUrl);
      __publicField(this, "interactionId");
      this.interactionId = this.normalizeInteractionId(interactionId);
    }
    setInteractionId(interactionId) {
      this.interactionId = this.normalizeInteractionId(interactionId);
    }
    async getInteractionStatus() {
      return this.request("/interaction", { method: "GET" });
    }
    async sendInteractionOtp(request) {
      return this.request("/interaction/otp/send", {
        method: "POST",
        body: JSON.stringify(request),
        headers: { "Content-Type": "application/json" }
      });
    }
    async sendInteractionOtpToEmail(request) {
      return this.request("/interaction/otp/send/email", {
        method: "POST",
        body: JSON.stringify(request),
        headers: { "Content-Type": "application/json" }
      });
    }
    async validateInteractionOtp(request) {
      return this.request("/interaction/otp/validate", {
        method: "POST",
        body: JSON.stringify(request),
        headers: { "Content-Type": "application/json" }
      });
    }
    async attachPaymentMethod(paymentSourceId) {
      return this.request(
        `/interaction/payment-source/${encodeURIComponent(paymentSourceId)}/attach`,
        {
          method: "POST",
          body: "{}",
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    async addSource(source) {
      return this.request("/customer/source", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(source),
        headers: { "Content-Type": "application/json", Accept: "application/json, text/plain" }
      });
    }
    async getCustomerProfile() {
      return this.request("/customer", {
        method: "GET",
        credentials: "include"
      });
    }
    async addBillingAddress(address) {
      await this.request("/customer/billing-address", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(address),
        headers: { "Content-Type": "application/json" }
      });
    }
    async mask(type, request) {
      return this.request(`/customer/mask/${encodeURIComponent(type)}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(request),
        headers: { "Content-Type": "application/json" }
      });
    }
    async createPayByBankSession() {
      return this.request("/pbb/session", {
        method: "GET",
        credentials: "include"
      });
    }
    async finalizePayByBankSession(aldSessionId, pToken) {
      await this.request(
        `/pbb/session/${encodeURIComponent(aldSessionId)}/${encodeURIComponent(pToken)}`,
        {
          method: "PUT",
          credentials: "include"
        }
      );
    }
    async request(path, init, responseMode) {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: this.buildHeaders(path, init.headers)
      });
      const contentType = response.headers.get("content-type") ?? "";
      const shouldParseJson = responseMode === "json" || !responseMode && contentType.includes("application/json");
      const body = response.status === 204 ? void 0 : shouldParseJson ? await response.json() : await response.text();
      if (!response.ok) {
        const message = typeof body === "string" ? body || response.statusText : body && typeof body === "object" && "message" in body && typeof body.message === "string" ? body.message : response.statusText || "Request failed.";
        throw new CommerceHubConnectApiError(message, response.status, body);
      }
      return body;
    }
    buildHeaders(path, initHeaders) {
      const headers = new Headers(initHeaders);
      if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
      }
      if (this.interactionId && this.requiresInteractionHeader(path)) {
        headers.set("x-interaction-id", this.interactionId);
      }
      return headers;
    }
    requiresInteractionHeader(path) {
      return this.isPathSegment(path, "/interaction") || this.isPathSegment(path, "/customer");
    }
    isPathSegment(path, prefix) {
      return path === prefix || path.startsWith(`${prefix}/`);
    }
    normalizeInteractionId(interactionId) {
      const normalized = interactionId?.trim();
      return normalized ? normalized : null;
    }
  };

  // projects/commerce-hub-connect-web-sdk/src/core/card.ts
  function normalizeCardNumber(value) {
    return value.replace(/\D/g, "");
  }
  function normalizeCvv(value) {
    return value.replace(/\D/g, "");
  }
  function detectCardNetwork(cardNumber) {
    const digits = normalizeCardNumber(cardNumber);
    if (/^4/.test(digits)) {
      return "Visa";
    }
    if (/^(5[1-5]|2[2-7])/.test(digits)) {
      return "Mastercard";
    }
    if (/^3[47]/.test(digits)) {
      return "AmericanExpress";
    }
    if (/^(6011|65|64[4-9])/.test(digits)) {
      return "Discover";
    }
    return void 0;
  }
  function isValidCardNumber(cardNumber) {
    const digits = normalizeCardNumber(cardNumber);
    if (digits.length < 12 || digits.length > 19) {
      return false;
    }
    let sum = 0;
    let doubleNext = false;
    for (let index = digits.length - 1; index >= 0; index -= 1) {
      let digit = Number.parseInt(digits[index] ?? "", 10);
      if (Number.isNaN(digit)) {
        return false;
      }
      if (doubleNext) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      doubleNext = !doubleNext;
    }
    return sum % 10 === 0;
  }
  function parseExpiration(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 4) {
      return {};
    }
    const month = digits.slice(0, 2);
    const year = digits.slice(2, 4);
    const monthNumber = Number.parseInt(month, 10);
    if (monthNumber < 1 || monthNumber > 12) {
      return {};
    }
    return {
      month,
      year
    };
  }
  function isValidCvv(value) {
    return /^\d{3,4}$/.test(normalizeCvv(value));
  }
  function maskCardNumberForDisplay(cardNumber) {
    const digits = normalizeCardNumber(cardNumber);
    const visibleDigits = 4;
    const maskedDigits = "*".repeat(Math.max(0, digits.length - visibleDigits)) + digits.slice(-visibleDigits);
    return maskedDigits.replace(/(.{4})/g, "$1 ").trim();
  }
  function maskCvvForDisplay(cvv) {
    return "*".repeat(normalizeCvv(cvv).length);
  }

  // projects/commerce-hub-connect-web-sdk/src/core/payment-sdk.ts
  var DEFAULT_BANK_LINK_OPTIONS = {
    apiKey: "YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A",
    configId: "cce84049-0940-4926-9a54-9eaca0c09830",
    environment: "qa",
    locale: "en-US",
    paymentSdkUrl: "https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js",
    useSandbox: false
  };
  function resolvePayByBankOptions(environment, options) {
    const definedOverrides = Object.fromEntries(
      Object.entries(options ?? {}).filter(([, value]) => value !== void 0)
    );
    return {
      ...DEFAULT_BANK_LINK_OPTIONS,
      environment,
      ...definedOverrides
    };
  }
  async function loadPaymentSdkScript(scriptUrl, doc = document) {
    if (window.PaymentSDK?.init) {
      return;
    }
    const existing = doc.querySelector(`script[src="${scriptUrl}"]`);
    if (existing) {
      await waitForPaymentSdk(window, existing);
      return;
    }
    await new Promise((resolve, reject) => {
      const script = doc.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Unable to load Pay by Bank script: ${scriptUrl}`));
      doc.head.appendChild(script);
    });
    if (!window.PaymentSDK?.init) {
      throw new Error(`Pay by Bank script loaded but window.PaymentSDK.init is unavailable: ${scriptUrl}`);
    }
  }
  function destroyPaymentSdk() {
    try {
      window.PaymentSDK?.destroy?.();
    } catch {
    }
  }
  async function waitForPaymentSdk(targetWindow, script) {
    if (targetWindow.PaymentSDK?.init) {
      return;
    }
    await new Promise((resolve, reject) => {
      const cleanup = () => {
        script.removeEventListener("load", handleLoad);
        script.removeEventListener("error", handleError);
      };
      const handleLoad = () => {
        cleanup();
        resolve();
      };
      const handleError = () => {
        cleanup();
        reject(new Error(`Unable to load Pay by Bank script: ${script.src}`));
      };
      script.addEventListener("load", handleLoad, { once: true });
      script.addEventListener("error", handleError, { once: true });
    });
    if (!targetWindow.PaymentSDK?.init) {
      throw new Error(`Pay by Bank script loaded but window.PaymentSDK.init is unavailable: ${script.src}`);
    }
  }

  // projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.ts
  function resolveSdkRuntimeOrigin(doc = document) {
    const currentScript = doc.currentScript;
    const scriptOrigin = normalizeCommerceHubConnectRuntimeOrigin(currentScript?.src);
    if (scriptOrigin) {
      return scriptOrigin;
    }
    return normalizeCommerceHubConnectRuntimeOrigin(doc.location?.origin);
  }
  function resolveMountTarget(target, doc = document) {
    if (typeof target !== "string") {
      return target;
    }
    const resolvedTarget = doc.querySelector(target);
    if (!resolvedTarget) {
      throw new Error(`Unable to find a mount target for selector: ${target}`);
    }
    return resolvedTarget;
  }
  function validateMountRequest(options, environment) {
    if (!options || typeof options !== "object") {
      throw new Error("Mount options are required.");
    }
    if (!options.configuration || typeof options.configuration !== "object") {
      throw new Error("A CommerceHubSdkConfiguration object is required.");
    }
    if (!options.interaction || typeof options.interaction !== "object") {
      throw new Error("An InteractionResponse object is required.");
    }
    if (!options.interaction.interactionId?.trim()) {
      throw new Error("interaction.interactionId is required.");
    }
    if (typeof options.configuration.onSuccess !== "function") {
      throw new Error("configuration.onSuccess must be a function.");
    }
    if (typeof options.configuration.onError !== "function") {
      throw new Error("configuration.onError must be a function.");
    }
    if (environment !== void 0 && !isCommerceHubConnectEnvironment(environment)) {
      throw new Error("environment must be one of dev, qa, cat, or prod.");
    }
  }
  function escapeHtml(value) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  function createStableId(prefix) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // projects/commerce-hub-connect-web-sdk/src/core/controller.ts
  var DEFAULT_ALLOWED_TENDERS = ["CARD", "BANK_ACCOUNT"];
  var DEFAULT_WHITE_LABEL = {
    primaryColor: "#0a5dff",
    secondaryColor: "#627d98",
    textColor: "#101828",
    fontFamily: '"Open Sans", "Segoe UI", sans-serif'
  };
  var NEW_BILLING_ADDRESS_VALUE = "__new__";
  var CommerceHubConnectWidgetController = class {
    constructor(interaction, configuration, whiteLabel, environment, apiBaseUrl) {
      __publicField(this, "listeners", /* @__PURE__ */ new Set());
      __publicField(this, "api");
      __publicField(this, "destroyed", false);
      __publicField(this, "autoSubmittedInteractionId", null);
      __publicField(this, "state");
      this.api = new CommerceHubConnectApiClient(apiBaseUrl, interaction.interactionId);
      this.state = this.createSnapshot(interaction, configuration, whiteLabel, environment, apiBaseUrl);
      void this.initialize();
    }
    subscribe(listener) {
      this.listeners.add(listener);
      return () => {
        this.listeners.delete(listener);
      };
    }
    getSnapshot() {
      return this.state;
    }
    async update(interaction, configuration, whiteLabel, environment, apiBaseUrl) {
      this.api = new CommerceHubConnectApiClient(apiBaseUrl, interaction.interactionId);
      this.state = this.createSnapshot(interaction, configuration, whiteLabel, environment, apiBaseUrl, this.state);
      this.notify();
      await this.initialize();
    }
    destroy() {
      this.destroyed = true;
      destroyPaymentSdk();
      this.listeners.clear();
    }
    async submitEmail(email, mode = "default") {
      const normalizedEmail = email.trim();
      if (!isValidEmail(normalizedEmail)) {
        this.updateState({
          email: normalizedEmail,
          error: {
            message: "Enter a valid email address.",
            stage: "otp_send"
          }
        });
        return;
      }
      this.updateState({
        email: normalizedEmail,
        requestedOtpMode: mode,
        submitting: true,
        error: null,
        completedResult: null
      });
      try {
        const interaction = mode === "email" ? await this.api.sendInteractionOtpToEmail({ value: normalizedEmail }) : await this.api.sendInteractionOtp({ value: normalizedEmail });
        this.commitInteraction(interaction);
      } catch (error) {
        this.failWith("otp_send", error);
      } finally {
        this.updateState({ submitting: false });
      }
    }
    async validateOtp(otp) {
      const normalizedOtp = otp.replace(/\D/g, "");
      if (!/^\d{6}$/.test(normalizedOtp)) {
        this.updateState({
          otpCode: normalizedOtp,
          error: {
            message: "Enter the 6-digit code.",
            stage: "otp_validate"
          }
        });
        return;
      }
      this.updateState({ otpCode: normalizedOtp, submitting: true, error: null });
      try {
        const interaction = await this.api.validateInteractionOtp({
          email: this.state.email,
          otp: normalizedOtp,
          channel: this.otpChannel()
        });
        this.commitInteraction(interaction);
        await this.loadBillingAddresses({ reportError: true });
      } catch (error) {
        this.failWith("otp_validate", error);
      } finally {
        this.updateState({ submitting: false });
      }
    }
    backToEmailEntry() {
      this.updateState({
        otpCode: "",
        error: null
      });
      this.commitInteraction({
        ...this.state.interaction,
        status: "EMAIL_REQUESTED"
      });
    }
    async resendCode() {
      if (!this.state.email) {
        return;
      }
      await this.submitEmail(this.state.email, this.state.requestedOtpMode);
    }
    async onOtpAlternateAction() {
      if (this.otpChannel() === "PHONE") {
        await this.submitEmail(this.state.email, "email");
        return;
      }
      this.backToEmailEntry();
    }
    selectExistingSource(sourceId) {
      this.updateState({ selectedSourceId: sourceId });
    }
    showAddCardMethod() {
      this.updateState({
        paymentEntryMode: "add",
        selectedTenderType: "CARD",
        completedResult: null,
        error: null,
        pendingPayByBankLaunch: false,
        cardDraftMessage: null,
        cardDraftErrors: {}
      });
    }
    showAddBankAccountMethod() {
      this.updateState({
        paymentEntryMode: "add",
        selectedTenderType: "BANK_ACCOUNT",
        completedResult: null,
        error: null,
        pendingPayByBankLaunch: true
      });
    }
    backToPaymentList() {
      this.updateState({
        paymentEntryMode: "list",
        pendingPayByBankLaunch: false,
        completedResult: null,
        error: null
      });
      destroyPaymentSdk();
    }
    async attachSelectedSource() {
      const selectedSource = this.state.selectedSource;
      if (!selectedSource?.id) {
        return;
      }
      this.updateState({ submitting: true, error: null });
      try {
        const interaction = await this.api.attachPaymentMethod(selectedSource.id);
        this.commitInteraction(interaction);
        const result = {
          interaction,
          paymentSourceId: selectedSource.id,
          paymentSource: selectedSource,
          tenderType: selectedSource.tenderType
        };
        this.state.configuration.onSuccess(result);
        this.updateState({
          completedResult: result,
          paymentEntryMode: "list"
        });
      } catch (error) {
        this.failWith("payment_source", error);
      } finally {
        this.updateState({ submitting: false });
      }
    }
    async submitCard(draft) {
      const normalizedDraft = normalizeCardDraft(draft);
      const errors = validateCardDraft(normalizedDraft);
      if (Object.keys(errors).length > 0) {
        this.updateState({
          cardDraft: normalizedDraft,
          cardDraftErrors: errors,
          cardDraftMessage: null
        });
        return;
      }
      this.updateState({
        cardDraft: normalizedDraft,
        cardDraftErrors: {},
        cardDraftMessage: null,
        submitting: true,
        error: null
      });
      try {
        const maskedCardNumber = await this.secureValue("card", normalizedDraft.cardNumber);
        const maskedCvv = await this.secureValue("cvv", normalizedDraft.cvc);
        const { month, year } = parseExpiration(normalizedDraft.expiration);
        if (!month || !year) {
          this.updateState({
            cardDraftErrors: {
              expiration: "Enter a valid expiration date."
            },
            submitting: false
          });
          return;
        }
        const billingAddressId = await this.resolveBillingAddressId(normalizedDraft);
        if (!billingAddressId) {
          this.updateState({
            cardDraftMessage: "Unable to associate a billing address.",
            submitting: false
          });
          return;
        }
        const cardSource = {
          id: createStableId("source"),
          tenderType: "CARD",
          name: normalizedDraft.name,
          billingAddressId,
          card: {
            nameOnCard: normalizedDraft.fullName,
            cardNumber: maskedCardNumber,
            cvv: maskedCvv,
            expirationMonth: month,
            expirationYear: year,
            network: detectCardNetwork(normalizedDraft.cardNumber),
            cardNumberEncrypted: maskedCardNumber !== normalizeCardNumber(normalizedDraft.cardNumber) ? maskedCardNumber : void 0,
            cvvEncrypted: maskedCvv !== normalizeCvv(normalizedDraft.cvc) ? maskedCvv : void 0
          }
        };
        const response = await this.api.addSource(cardSource);
        const paymentSourceId = extractPaymentSourceId(response) ?? cardSource.id;
        if (!paymentSourceId) {
          throw new Error("Payment source creation completed without returning a source id.");
        }
        const interaction = await this.api.attachPaymentMethod(paymentSourceId);
        const createdSource = {
          ...cardSource,
          id: paymentSourceId
        };
        this.commitInteraction(withUpsertedSource(interaction, createdSource));
        const result = {
          interaction: this.state.interaction,
          paymentSourceId,
          paymentSource: createdSource,
          tenderType: createdSource.tenderType
        };
        this.state.configuration.onSuccess(result);
        this.updateState({
          completedResult: result,
          paymentEntryMode: "list",
          cardDraft: defaultCardDraft()
        });
        await this.loadBillingAddresses();
      } catch (error) {
        this.failWith("payment_source", error);
      } finally {
        this.updateState({ submitting: false });
      }
    }
    async launchPayByBank(containerId) {
      if (this.destroyed || this.state.bankLinkLoading) {
        return;
      }
      this.updateState({ bankLinkLoading: true, pendingPayByBankLaunch: false, error: null });
      try {
        const existingBankSourceIds = await this.getExistingBankSourceIds();
        const session = await this.api.createPayByBankSession();
        const { aggregatorSessionId, accessToken, pToken, publicKey } = resolvePayByBankSession(session);
        const payByBank = resolvePayByBankOptions(this.state.environment, this.state.configuration.payByBank);
        await loadPaymentSdkScript(payByBank.paymentSdkUrl);
        const paymentSdk = window.PaymentSDK;
        if (!paymentSdk?.init) {
          throw new Error("PaymentSDK.js loaded but PaymentSDK.init is not available on window.");
        }
        await new Promise((resolve, reject) => {
          let settled = false;
          destroyPaymentSdk();
          paymentSdk.init({
            apiKey: payByBank.apiKey,
            accessToken,
            configId: payByBank.configId,
            environment: payByBank.environment,
            locale: payByBank.locale,
            publicKey,
            pToken,
            containerId,
            ...aggregatorSessionId ? { aggregatorSessionId } : {},
            onEvent: async (event) => {
              if (settled || !isTerminalPaymentSdkEvent(event)) {
                return;
              }
              destroyPaymentSdk();
              if (event.type !== "success") {
                settled = true;
                reject(new Error(describePaymentSdkTerminalEvent(event)));
                return;
              }
              try {
                await this.api.finalizePayByBankSession(aggregatorSessionId, pToken);
                const profile = await this.api.getCustomerProfile();
                const bankSource = resolveAttachedBankSource(profile, existingBankSourceIds);
                const paymentSourceId = bankSource.id?.trim();
                if (!paymentSourceId) {
                  throw new Error("Pay by Bank completed but no bank payment source was returned by /customer.");
                }
                const interaction = await this.api.attachPaymentMethod(paymentSourceId);
                const nextInteraction = withUpsertedSource(interaction, bankSource);
                this.commitInteraction(nextInteraction);
                const result = {
                  interaction: nextInteraction,
                  paymentSourceId,
                  paymentSource: bankSource,
                  tenderType: bankSource.tenderType,
                  bankLinkResponse: event
                };
                this.state.configuration.onSuccess(result);
                this.updateState({
                  completedResult: result,
                  paymentEntryMode: "list"
                });
                settled = true;
                resolve();
              } catch (error) {
                settled = true;
                reject(error);
              }
            }
          });
        });
      } catch (error) {
        this.failWith("pay_by_bank", error);
      } finally {
        this.updateState({ bankLinkLoading: false });
      }
    }
    createSnapshot(interaction, configuration, whiteLabel, environment, apiBaseUrl, previous) {
      const selectedTenderType = resolveSelectedTenderType(interaction, previous?.selectedTenderType);
      const paymentEntryMode = previous?.paymentEntryMode === "add" ? "add" : "list";
      const email = configuration.email?.trim() || interaction.email?.trim() || previous?.email || "";
      const completedResult = previous?.interaction.interactionId === interaction.interactionId ? previous.completedResult : null;
      return {
        interaction,
        configuration,
        environment,
        apiBaseUrl,
        displayStep: deriveDisplayStep(interaction, paymentEntryMode, completedResult),
        currentStep: deriveCurrentStep(interaction),
        loading: false,
        submitting: false,
        bankLinkLoading: false,
        error: null,
        email,
        otpCode: previous?.interaction.interactionId === interaction.interactionId ? previous.otpCode : "",
        paymentEntryMode,
        supportedTenderTypes: resolveSupportedTenderTypes(interaction),
        selectedTenderType,
        availableSources: resolveAvailableSources(interaction),
        selectedSource: resolveSelectedSource(interaction, previous?.selectedSourceId),
        selectedSourceId: previous?.interaction.interactionId === interaction.interactionId ? previous?.selectedSourceId ?? interaction.selectedSource?.id ?? null : interaction.selectedSource?.id ?? null,
        completedResult,
        billingAddresses: previous?.interaction.interactionId === interaction.interactionId ? previous.billingAddresses : [],
        cardDraft: previous?.interaction.interactionId === interaction.interactionId ? previous.cardDraft : defaultCardDraft(),
        cardDraftErrors: {},
        cardDraftMessage: null,
        requestedOtpMode: previous?.requestedOtpMode ?? "default",
        whiteLabel: {
          ...DEFAULT_WHITE_LABEL,
          ...configuration.whiteLabel,
          ...whiteLabel
        },
        payByBankMountId: `commerce-hub-banklink-${interaction.interactionId}`.replace(/[^a-zA-Z0-9-_]/g, "-"),
        pendingPayByBankLaunch: false
      };
    }
    async initialize() {
      if (this.canManagePaymentInCurrentSession()) {
        await this.loadBillingAddresses({ reportError: true });
      }
      if (this.state.email && this.state.currentStep === "email" && this.autoSubmittedInteractionId !== this.state.interaction.interactionId) {
        this.autoSubmittedInteractionId = this.state.interaction.interactionId;
        queueMicrotask(() => {
          void this.submitEmail(this.state.email, "default");
        });
      }
    }
    canManagePaymentInCurrentSession() {
      return this.state.currentStep === "payment" || this.state.currentStep === "success";
    }
    async loadBillingAddresses(options) {
      try {
        const profile = await this.api.getCustomerProfile();
        this.updateState({
          billingAddresses: profile.billingAddress ?? [],
          ...options?.reportError ? { error: null } : {}
        });
      } catch (error) {
        if (options?.reportError) {
          this.failWith("session", error);
        }
      }
    }
    otpChannel() {
      if (this.state.requestedOtpMode === "email") {
        return "EMAIL";
      }
      return this.state.interaction.phone?.phoneNumber ? "PHONE" : "EMAIL";
    }
    async resolveBillingAddressId(draft) {
      if (draft.billingAddressValue && draft.billingAddressValue !== NEW_BILLING_ADDRESS_VALUE) {
        return draft.billingAddressValue;
      }
      const address = {
        id: createStableId("billing-address"),
        recipientNameOrAddress: draft.fullName,
        street: draft.addressLine1,
        houseNumberOrName: draft.addressLine2,
        city: draft.city,
        stateOrProvince: draft.state,
        postalCode: draft.zip,
        country: draft.country
      };
      await this.api.addBillingAddress(address);
      return address.id;
    }
    async secureValue(type, value) {
      try {
        const masked = await this.api.mask(type, { value });
        return masked.value;
      } catch {
        return type === "card" ? normalizeCardNumber(value) : normalizeCvv(value);
      }
    }
    async getExistingBankSourceIds() {
      try {
        const profile = await this.api.getCustomerProfile();
        return new Set(
          (profile.sources ?? []).filter((source) => source.tenderType === "BANK_ACCOUNT").map((source) => source.id?.trim()).filter((sourceId) => Boolean(sourceId))
        );
      } catch {
        return /* @__PURE__ */ new Set();
      }
    }
    commitInteraction(interaction) {
      this.api.setInteractionId(interaction.interactionId ?? null);
      const nextAvailableSources = resolveAvailableSources(interaction);
      const nextSelectedSource = resolveSelectedSource(interaction, this.state.selectedSourceId);
      const nextCurrentStep = deriveCurrentStep(interaction);
      const nextDisplayStep = deriveDisplayStep(
        interaction,
        nextCurrentStep === "payment" ? this.state.paymentEntryMode : "list",
        this.state.completedResult
      );
      this.updateState({
        interaction,
        availableSources: nextAvailableSources,
        selectedSource: nextSelectedSource,
        currentStep: nextCurrentStep,
        displayStep: nextDisplayStep,
        supportedTenderTypes: resolveSupportedTenderTypes(interaction),
        selectedTenderType: resolveSelectedTenderType(interaction, this.state.selectedTenderType)
      });
    }
    failWith(stage, error) {
      const sdkError = toSdkError(stage, error);
      this.updateState({ error: sdkError });
      this.state.configuration.onError(sdkError);
    }
    updateState(partial) {
      this.state = {
        ...this.state,
        ...partial
      };
      this.state.currentStep = deriveCurrentStep(this.state.interaction);
      this.state.displayStep = deriveDisplayStep(
        this.state.interaction,
        this.state.paymentEntryMode,
        this.state.completedResult
      );
      this.state.availableSources = resolveAvailableSources(this.state.interaction);
      this.state.selectedSource = resolveSelectedSource(this.state.interaction, this.state.selectedSourceId);
      this.notify();
    }
    notify() {
      if (this.destroyed) {
        return;
      }
      for (const listener of this.listeners) {
        listener();
      }
    }
  };
  function deriveCurrentStep(interaction) {
    switch (interaction.status) {
      case "OTP_VALIDATION_PENDING":
      case "OTP_VALIDATION_FAILED":
        return "otp";
      case "PAYMENT_SOURCE_REQUESTED":
      case "PAYMENT_SOURCE_ATTACHED":
        return "payment";
      case "COMPLETED":
        return "success";
      case "EMAIL_REQUESTED":
      case "ABANDONED":
      default:
        return "email";
    }
  }
  function deriveDisplayStep(interaction, paymentEntryMode, completedResult) {
    if (completedResult) {
      return "success";
    }
    const currentStep = deriveCurrentStep(interaction);
    if (paymentEntryMode === "add" && currentStep === "payment") {
      return "payment";
    }
    return currentStep;
  }
  function resolveSupportedTenderTypes(interaction) {
    const interactionAllowed = interaction.allowedTenderTypes ?? [...DEFAULT_ALLOWED_TENDERS];
    const filtered = interactionAllowed.filter(
      (tender) => tender === "CARD" || tender === "BANK_ACCOUNT"
    );
    return filtered.length > 0 ? filtered : [...DEFAULT_ALLOWED_TENDERS];
  }
  function resolveSelectedTenderType(interaction, previous) {
    const supported = resolveSupportedTenderTypes(interaction);
    const selected = interaction.selectedSource?.tenderType ?? previous;
    return supported.includes(selected ?? "CARD") ? selected ?? supported[0] : supported[0];
  }
  function resolveAvailableSources(interaction) {
    const allowed = new Set(resolveSupportedTenderTypes(interaction));
    return (interaction.paymentSources ?? []).filter((source) => allowed.has(source.tenderType));
  }
  function resolveSelectedSource(interaction, selectedSourceId) {
    const availableSources = resolveAvailableSources(interaction);
    const interactionSelectedId = interaction.selectedSource?.id ?? null;
    const effectiveId = selectedSourceId ?? interactionSelectedId;
    return availableSources.find((source) => source.id === effectiveId) ?? interaction.selectedSource ?? null;
  }
  function normalizeCardDraft(draft) {
    return {
      name: draft.name.trim(),
      fullName: draft.fullName.trim(),
      cardNumber: draft.cardNumber.trim(),
      expiration: draft.expiration.trim(),
      cvc: draft.cvc.trim(),
      billingAddressValue: draft.billingAddressValue?.trim() || NEW_BILLING_ADDRESS_VALUE,
      country: draft.country.trim() || "United States",
      addressLine1: draft.addressLine1.trim(),
      addressLine2: draft.addressLine2.trim(),
      city: draft.city.trim(),
      state: draft.state.trim(),
      zip: draft.zip.trim()
    };
  }
  function defaultCardDraft() {
    return {
      name: "",
      fullName: "",
      cardNumber: "",
      expiration: "",
      cvc: "",
      billingAddressValue: NEW_BILLING_ADDRESS_VALUE,
      country: "United States",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: ""
    };
  }
  function validateCardDraft(draft) {
    const errors = {};
    if (!draft.name) {
      errors.name = "Card name is required.";
    }
    if (!draft.fullName) {
      errors.fullName = "Name on card is required.";
    }
    if (!isValidCardNumber(draft.cardNumber)) {
      errors.cardNumber = "Enter a valid card number.";
    }
    if (!parseExpiration(draft.expiration).month) {
      errors.expiration = "Enter a valid expiration date.";
    }
    if (!isValidCvv(draft.cvc)) {
      errors.cvc = "Enter a valid CVC.";
    }
    if (draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE) {
      if (!draft.addressLine1) {
        errors.addressLine1 = "Address line 1 is required.";
      }
      if (!draft.city) {
        errors.city = "City is required.";
      }
      if (!draft.state) {
        errors.state = "State is required.";
      }
      if (!draft.zip) {
        errors.zip = "ZIP code is required.";
      }
    }
    return errors;
  }
  function extractPaymentSourceId(response) {
    if (!response) {
      return void 0;
    }
    if (typeof response === "string") {
      return response.trim() || void 0;
    }
    if (typeof response === "object") {
      const record = response;
      const sourceId = (typeof record["id"] === "string" ? record["id"] : void 0) ?? (typeof record["sourceId"] === "string" ? record["sourceId"] : void 0) ?? (typeof record["paymentSourceId"] === "string" ? record["paymentSourceId"] : void 0);
      return sourceId?.trim() || void 0;
    }
    return void 0;
  }
  function resolvePayByBankSession(session) {
    const aggregatorSessionId = session.aggregatorSessionId?.trim();
    const accessToken = session.tokenID?.trim() || session.accessToken?.trim();
    const pToken = session.pToken?.trim();
    const publicKey = session.publicKey?.trim();
    if (!aggregatorSessionId || !accessToken || !pToken || !publicKey) {
      throw new Error("The /pbb/session response is missing one or more required values.");
    }
    return {
      aggregatorSessionId,
      accessToken,
      pToken,
      publicKey
    };
  }
  function isTerminalPaymentSdkEvent(event) {
    return event.type === "success" || event.type === "cancel" || event.type === "failure" || event.type === "error";
  }
  function describePaymentSdkTerminalEvent(event) {
    if (typeof event.payload === "string" && event.payload.trim()) {
      return event.payload;
    }
    if (event.type === "cancel") {
      return "Pay by Bank was cancelled.";
    }
    if (event.type === "failure" || event.type === "error") {
      return "Pay by Bank failed.";
    }
    return "Pay by Bank did not complete successfully.";
  }
  function resolveAttachedBankSource(profile, existingBankSourceIds) {
    const bankSources = (profile.sources ?? []).filter(
      (source) => source.tenderType === "BANK_ACCOUNT"
    );
    return bankSources.find((source) => {
      const sourceId = source.id?.trim();
      return sourceId ? !existingBankSourceIds.has(sourceId) : false;
    }) ?? bankSources.at(0) ?? (() => {
      throw new Error("Pay by Bank completed but no bank payment source was returned by /customer.");
    })();
  }
  function withUpsertedSource(interaction, source) {
    const paymentSources = interaction.paymentSources ?? [];
    const nextPaymentSources = paymentSources.some((existingSource) => existingSource.id === source.id) ? paymentSources.map((existingSource) => existingSource.id === source.id ? source : existingSource) : [source, ...paymentSources];
    return {
      ...interaction,
      paymentSources: nextPaymentSources,
      selectedSource: source
    };
  }
  function toSdkError(stage, error) {
    if (error instanceof CommerceHubConnectApiError) {
      return {
        stage,
        status: error.status,
        message: error.message,
        cause: error.body
      };
    }
    if (error instanceof Error) {
      return {
        stage,
        message: error.message,
        cause: error
      };
    }
    return {
      stage,
      message: typeof error === "string" ? error : "An unexpected error occurred.",
      cause: error
    };
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function formatOtpDestination(snapshot) {
    if (snapshot.interaction.phone?.phoneNumber && snapshot.requestedOtpMode !== "email") {
      return snapshot.interaction.phone.phoneNumber;
    }
    return maskEmail(snapshot.email || snapshot.interaction.email || "");
  }
  function maskEmail(email) {
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) {
      return email;
    }
    const visibleLocal = localPart.slice(0, 2);
    return `${visibleLocal}${"*".repeat(Math.max(0, localPart.length - visibleLocal.length))}@${domain}`;
  }
  function formatSourcePrimaryLabel(source) {
    if (source.tenderType === "CARD") {
      return source.name?.trim() || source.card.nameOnCard?.trim() || `${source.card.network ?? "Card"} card`;
    }
    return source.bankAccount.bankName?.trim() || source.name?.trim() || "Bank account";
  }
  function formatSourceSecondaryLabel(source) {
    if (source.tenderType === "CARD") {
      return `\u2022\u2022\u2022\u2022 ${source.card.cardNumber.slice(-4) || "----"}`;
    }
    return `\u2022\u2022\u2022\u2022 ${source.bankAccount.accountNumber.slice(-4) || "----"}`;
  }
  function formatSourceBadgeLabel(source) {
    if (source.tenderType === "CARD") {
      switch (source.card.network) {
        case "AmericanExpress":
          return "AMEX";
        case "Mastercard":
          return "MC";
        case "Discover":
          return "DISC";
        case "Visa":
          return "VISA";
        default:
          return "CARD";
      }
    }
    const bankName = source.bankAccount.bankName?.trim();
    if (!bankName) {
      return "BANK";
    }
    return bankName.split(/\s+/).map((part) => part[0] ?? "").join("").slice(0, 4).toUpperCase() || "BANK";
  }
  function formatBillingAddressLabel(address) {
    return [
      address.recipientNameOrAddress,
      address.street,
      address.houseNumberOrName,
      address.city,
      address.stateOrProvince,
      address.postalCode
    ].filter(Boolean).join(", ");
  }
  function getNewBillingAddressValue() {
    return NEW_BILLING_ADDRESS_VALUE;
  }
  function getDefaultCardDraft() {
    return defaultCardDraft();
  }
  function getMaskedCardPreview(cardNumber) {
    return maskCardNumberForDisplay(cardNumber);
  }
  function getMaskedCvvPreview(cvv) {
    return maskCvvForDisplay(cvv);
  }

  // projects/commerce-hub-connect-web-sdk/src/ui/widget-renderer.ts
  var CommerceHubConnectWidgetRenderer = class {
    constructor(hostElement, controller) {
      __publicField(this, "hostElement", hostElement);
      __publicField(this, "controller", controller);
      __publicField(this, "unsubscribe");
      __publicField(this, "handleClick", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }
        const actionElement = target.closest("[data-action]");
        if (!actionElement) {
          return;
        }
        const action = actionElement.dataset["action"];
        switch (action) {
          case "resend-otp":
            event.preventDefault();
            void this.controller.resendCode();
            break;
          case "otp-alternate":
            event.preventDefault();
            void this.controller.onOtpAlternateAction();
            break;
          case "back-email":
            event.preventDefault();
            this.controller.backToEmailEntry();
            break;
          case "add-card":
            event.preventDefault();
            this.controller.showAddCardMethod();
            break;
          case "add-bank":
            event.preventDefault();
            this.controller.showAddBankAccountMethod();
            break;
          case "back-payment-list":
            event.preventDefault();
            this.controller.backToPaymentList();
            break;
          case "select-source":
            event.preventDefault();
            if (actionElement.dataset["sourceId"]) {
              this.controller.selectExistingSource(actionElement.dataset["sourceId"]);
            }
            break;
          case "attach-selected-source":
            event.preventDefault();
            void this.controller.attachSelectedSource();
            break;
          default:
            break;
        }
      });
      __publicField(this, "handleSubmit", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLFormElement)) {
          return;
        }
        event.preventDefault();
        switch (target.dataset["form"]) {
          case "email": {
            const formData = new FormData(target);
            void this.controller.submitEmail(String(formData.get("email") ?? ""));
            break;
          }
          case "otp": {
            const formData = new FormData(target);
            void this.controller.validateOtp(String(formData.get("otp") ?? ""));
            break;
          }
          case "card": {
            const formData = new FormData(target);
            void this.controller.submitCard({
              ...getDefaultCardDraft(),
              name: String(formData.get("name") ?? ""),
              fullName: String(formData.get("fullName") ?? ""),
              cardNumber: String(formData.get("cardNumber") ?? ""),
              expiration: String(formData.get("expiration") ?? ""),
              cvc: String(formData.get("cvc") ?? ""),
              billingAddressValue: String(
                formData.get("billingAddressValue") ?? getNewBillingAddressValue()
              ),
              country: String(formData.get("country") ?? "United States"),
              addressLine1: String(formData.get("addressLine1") ?? ""),
              addressLine2: String(formData.get("addressLine2") ?? ""),
              city: String(formData.get("city") ?? ""),
              state: String(formData.get("state") ?? ""),
              zip: String(formData.get("zip") ?? "")
            });
            break;
          }
          default:
            break;
        }
      });
      __publicField(this, "handleInput", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.dataset["otpDigitIndex"] === void 0) {
          return;
        }
        syncOtpDigits(target);
      });
      __publicField(this, "handleKeydown", (event) => {
        const keyboardEvent = event;
        const target = keyboardEvent.target;
        if (!(target instanceof HTMLInputElement) || target.dataset["otpDigitIndex"] === void 0) {
          return;
        }
        const inputs = getOtpDigitInputs(target);
        const index = Number(target.dataset["otpDigitIndex"] ?? -1);
        if (index < 0) {
          return;
        }
        if (keyboardEvent.key === "Backspace" && !target.value && index > 0) {
          keyboardEvent.preventDefault();
          const previous = inputs[index - 1];
          previous.value = "";
          syncOtpFormValue(previous.form, inputs);
          focusOtpInput(previous);
          return;
        }
        if (keyboardEvent.key === "ArrowLeft" && index > 0) {
          keyboardEvent.preventDefault();
          focusOtpInput(inputs[index - 1]);
          return;
        }
        if (keyboardEvent.key === "ArrowRight" && index < inputs.length - 1) {
          keyboardEvent.preventDefault();
          focusOtpInput(inputs[index + 1]);
        }
      });
      __publicField(this, "handlePaste", (event) => {
        const clipboardEvent = event;
        const target = clipboardEvent.target;
        if (!(target instanceof HTMLInputElement) || target.dataset["otpDigitIndex"] === void 0) {
          return;
        }
        const digits = normalizeOtpDigits(clipboardEvent.clipboardData?.getData("text") ?? "");
        if (!digits) {
          return;
        }
        clipboardEvent.preventDefault();
        const inputs = getOtpDigitInputs(target);
        const startIndex = Number(target.dataset["otpDigitIndex"] ?? 0);
        let cursor = startIndex;
        for (const digit of digits) {
          if (cursor >= inputs.length) {
            break;
          }
          inputs[cursor].value = digit;
          cursor += 1;
        }
        syncOtpFormValue(target.form, inputs);
        focusOtpInput(inputs[Math.min(cursor, inputs.length - 1)]);
      });
      this.unsubscribe = this.controller.subscribe(() => this.render());
      this.hostElement.addEventListener("click", this.handleClick);
      this.hostElement.addEventListener("submit", this.handleSubmit);
      this.hostElement.addEventListener("input", this.handleInput);
      this.hostElement.addEventListener("keydown", this.handleKeydown);
      this.hostElement.addEventListener("paste", this.handlePaste);
      this.render();
    }
    destroy() {
      this.unsubscribe();
      this.hostElement.removeEventListener("click", this.handleClick);
      this.hostElement.removeEventListener("submit", this.handleSubmit);
      this.hostElement.removeEventListener("input", this.handleInput);
      this.hostElement.removeEventListener("keydown", this.handleKeydown);
      this.hostElement.removeEventListener("paste", this.handlePaste);
      this.hostElement.replaceChildren();
    }
    render() {
      const snapshot = this.controller.getSnapshot();
      applyTheme(this.hostElement, snapshot.whiteLabel);
      this.hostElement.innerHTML = `
      <section class="ch-sdk-shell">
        ${snapshot.whiteLabel.logoUrl ? `<header class="ch-sdk-header"><img src="${escapeHtml(snapshot.whiteLabel.logoUrl)}" alt="Merchant logo" class="ch-sdk-logo" /></header>` : ""}
        <div class="ch-sdk-card">
          <div class="ch-sdk-card-body">
            ${renderStatus(snapshot)}
            ${snapshot.error ? renderError(snapshot.error.message) : ""}
            ${renderStep(snapshot)}
          </div>
          <footer class="ch-sdk-footer-brand" aria-label="Commerce Hub Connect">Commerce Hub Connect</footer>
        </div>
      </section>
    `;
      if (snapshot.pendingPayByBankLaunch && snapshot.displayStep === "payment" && snapshot.paymentEntryMode === "add" && snapshot.selectedTenderType === "BANK_ACCOUNT") {
        queueMicrotask(() => {
          void this.controller.launchPayByBank(snapshot.payByBankMountId);
        });
      }
    }
  };
  function renderStatus(snapshot) {
    const title = (() => {
      switch (snapshot.displayStep) {
        case "otp":
          return "Enter the code";
        case "payment":
          return snapshot.paymentEntryMode === "add" ? snapshot.selectedTenderType === "CARD" ? "Add a credit card" : "Link bank account" : snapshot.configuration.paymentSelectionTitle?.trim() || "Pay with";
        case "success":
          return "Payment method saved";
        case "email":
        default:
          return "Sign in";
      }
    })();
    const subtitle = (() => {
      switch (snapshot.displayStep) {
        case "otp":
          return `We send a one-time code to ${escapeHtml(formatOtpDestination(snapshot))}.`;
        case "payment":
          return snapshot.paymentEntryMode === "add" ? snapshot.selectedTenderType === "CARD" ? "Securely save a new card using the same streamlined experience." : "Follow the bank-linking flow below to continue." : "Choose a saved payment method or add a new one.";
        case "success": {
          const source = snapshot.completedResult?.paymentSource ?? snapshot.selectedSource;
          return source ? `${escapeHtml(formatSourcePrimaryLabel(source))} is ready to use.` : "Payment source linked successfully.";
        }
        case "email":
        default:
          return "Enter your email address to access your payment dashboard.";
      }
    })();
    return `
    <div class="ch-sdk-title-block${snapshot.displayStep === "email" || snapshot.displayStep === "otp" || snapshot.displayStep === "success" ? " ch-sdk-title-block--centered" : ""}">
      <h2>${escapeHtml(title)}</h2>
      <p>${subtitle}</p>
    </div>
  `;
  }
  function renderError(message) {
    return `<div class="ch-sdk-alert ch-sdk-alert--error">${escapeHtml(message)}</div>`;
  }
  function renderStep(snapshot) {
    switch (snapshot.displayStep) {
      case "otp":
        return renderOtpStep(snapshot);
      case "payment":
        return snapshot.paymentEntryMode === "add" ? snapshot.selectedTenderType === "CARD" ? renderCardStep(snapshot) : renderBankStep(snapshot) : renderPaymentListStep(snapshot);
      case "success":
        return renderSuccessStep(snapshot);
      case "email":
      default:
        return renderEmailStep(snapshot);
    }
  }
  function renderEmailStep(snapshot) {
    return `
    <form class="ch-sdk-form" data-form="email">
      <label class="ch-sdk-field">
        <span>Email address</span>
        <input name="email" type="email" value="${escapeHtml(snapshot.email)}" autocomplete="email" ${snapshot.interaction.allowEmailChange === false && snapshot.email ? "disabled" : ""} required />
      </label>
      <button class="ch-sdk-button" type="submit" ${snapshot.submitting ? "disabled" : ""}>${renderButtonLabel(snapshot.submitting ? "Sending..." : "Continue", "arrow")}</button>
    </form>
  `;
  }
  function renderOtpStep(snapshot) {
    const otpDigits = getOtpDisplayDigits(snapshot.otpCode);
    return `
    <form class="ch-sdk-form" data-form="otp">
      <input name="otp" type="hidden" value="${escapeHtml(snapshot.otpCode)}" />
      <div class="ch-sdk-otp-group" role="group" aria-label="One-time code">
        ${otpDigits.map(
      (digit, index) => `
              <input
                class="ch-sdk-otp-digit"
                data-otp-digit-index="${index}"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                autocomplete="${index === 0 ? "one-time-code" : "off"}"
                maxlength="1"
                value="${escapeHtml(digit)}"
                aria-label="Digit ${index + 1}"
                ${snapshot.submitting ? "disabled" : ""}
              />
            `
    ).join("")}
      </div>
      <button class="ch-sdk-button" type="submit" ${snapshot.submitting ? "disabled" : ""}>${renderButtonLabel(snapshot.submitting ? "Verifying..." : "Verify", "check")}</button>
      <p class="ch-sdk-helper-copy">Didn\u2019t receive the code?</p>
      <div class="ch-sdk-inline-actions ch-sdk-inline-actions--centered">
        <button class="ch-sdk-link-button" data-action="otp-alternate" type="button" ${snapshot.submitting ? "disabled" : ""}>${snapshot.interaction.phone?.phoneNumber && snapshot.requestedOtpMode !== "email" ? "Send code to email instead" : "Use another email"}</button>
        <span class="ch-sdk-inline-separator" aria-hidden="true">\u2022</span>
        <button class="ch-sdk-link-button" data-action="resend-otp" type="button" ${snapshot.submitting ? "disabled" : ""}>Resend code</button>
      </div>
    </form>
  `;
  }
  function renderPaymentListStep(snapshot) {
    const sourcesMarkup = snapshot.availableSources.length > 0 ? snapshot.availableSources.map((source) => renderSourceOption(source, snapshot.selectedSource?.id ?? null)).join("") : '<div class="ch-sdk-empty-state">No saved payment methods are available yet.</div>';
    return `
    <div class="ch-sdk-stack">
      <div class="ch-sdk-source-list">${sourcesMarkup}</div>
      <div class="ch-sdk-pill-actions">
        ${snapshot.supportedTenderTypes.includes("CARD") ? '<button class="ch-sdk-pill-button" data-action="add-card" type="button">Add a credit or debit card</button>' : ""}
        ${snapshot.supportedTenderTypes.includes("BANK_ACCOUNT") ? '<button class="ch-sdk-pill-button" data-action="add-bank" type="button">Add bank account</button>' : ""}
      </div>
      <button class="ch-sdk-button" data-action="attach-selected-source" type="button" ${snapshot.submitting || !snapshot.selectedSource ? "disabled" : ""}>
        ${renderButtonLabel(
      snapshot.submitting ? "Saving..." : snapshot.configuration.paymentSelectionConfirmLabel?.trim() || "Confirm",
      "arrow"
    )}
      </button>
    </div>
  `;
  }
  function renderSourceOption(source, selectedSourceId) {
    const isSelected = source.id === selectedSourceId;
    return `
    <button class="ch-sdk-source-option${isSelected ? " is-selected" : ""}" data-action="select-source" data-source-id="${escapeHtml(source.id ?? "")}" type="button">
      <span class="ch-sdk-source-radio" aria-hidden="true">${isSelected ? "<span></span>" : ""}</span>
      <span class="ch-sdk-source-badge">${escapeHtml(formatSourceBadgeLabel(source))}</span>
      <span class="ch-sdk-source-copy">
        <strong>${escapeHtml(formatSourcePrimaryLabel(source))}</strong>
        <small>${escapeHtml(formatSourceSecondaryLabel(source))}</small>
      </span>
    </button>
  `;
  }
  function renderCardStep(snapshot) {
    const draft = snapshot.cardDraft;
    const useNewBillingAddress = (draft.billingAddressValue || getNewBillingAddressValue()) === getNewBillingAddressValue();
    const billingAddressOptions = renderBillingAddressOptions(
      snapshot.billingAddresses,
      draft.billingAddressValue || getNewBillingAddressValue()
    );
    const cardPreview = draft.cardNumber ? `<small class="ch-sdk-field-help">Preview: ${escapeHtml(getMaskedCardPreview(draft.cardNumber))}</small>` : "";
    const cvvPreview = draft.cvc ? `<small class="ch-sdk-field-help">Preview: ${escapeHtml(getMaskedCvvPreview(draft.cvc))}</small>` : "";
    return `
    <form class="ch-sdk-form" data-form="card">
      ${snapshot.cardDraftMessage ? `<div class="ch-sdk-alert ch-sdk-alert--error">${escapeHtml(snapshot.cardDraftMessage)}</div>` : ""}
      <div class="ch-sdk-form-intro">
        <strong>Card details</strong>
        <p>Enter the payment details you want to save to this profile.</p>
      </div>
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField("Card name", "name", draft.name, snapshot.cardDraftErrors.name)}
        ${renderInputField("Name on card", "fullName", draft.fullName, snapshot.cardDraftErrors.fullName)}
      </div>
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField("Card number", "cardNumber", draft.cardNumber, snapshot.cardDraftErrors.cardNumber, "text", "cc-number")}
        ${renderInputField("Expiration", "expiration", draft.expiration, snapshot.cardDraftErrors.expiration, "text", "cc-exp", "MM/YY")}
      </div>
      ${cardPreview}
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField("CVC", "cvc", draft.cvc, snapshot.cardDraftErrors.cvc, "password", "cc-csc")}
        <label class="ch-sdk-field">
          <span>Billing address</span>
          <select name="billingAddressValue">${billingAddressOptions}</select>
        </label>
      </div>
      ${cvvPreview}
      ${useNewBillingAddress ? renderNewBillingAddressFields(draft, snapshot.cardDraftErrors) : ""}
      <div class="ch-sdk-button-row">
        <button class="ch-sdk-button" type="submit" ${snapshot.submitting ? "disabled" : ""}>${renderButtonLabel(snapshot.submitting ? "Saving..." : "Save payment method", "arrow")}</button>
        <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button" ${snapshot.submitting ? "disabled" : ""}>Back</button>
      </div>
    </form>
  `;
  }
  function renderNewBillingAddressFields(draft, errors) {
    return `
    <div class="ch-sdk-grid ch-sdk-grid--two">
      ${renderInputField("Country", "country", draft.country, errors.country)}
      ${renderInputField("Address line 1", "addressLine1", draft.addressLine1, errors.addressLine1)}
      ${renderInputField("Address line 2", "addressLine2", draft.addressLine2, errors.addressLine2)}
      ${renderInputField("City", "city", draft.city, errors.city)}
      ${renderInputField("State", "state", draft.state, errors.state)}
      ${renderInputField("ZIP code", "zip", draft.zip, errors.zip)}
    </div>
  `;
  }
  function renderInputField(label, name, value, error, type = "text", autocomplete, placeholder) {
    return `
    <label class="ch-sdk-field">
      <span>${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${autocomplete ? `autocomplete="${escapeHtml(autocomplete)}"` : ""} ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ""} />
      ${error ? `<small class="ch-sdk-field-error">${escapeHtml(error)}</small>` : ""}
    </label>
  `;
  }
  function renderBankStep(snapshot) {
    return `
    <div class="ch-sdk-stack">
      <div class="ch-sdk-bank-panel">
        <div class="ch-sdk-bank-copy">
          <strong>${snapshot.bankLinkLoading ? "Connecting to your bank\u2026" : "Bank account linking"}</strong>
          <p>The linked banking experience will render inline below.</p>
        </div>
        <div id="${escapeHtml(snapshot.payByBankMountId)}" class="ch-sdk-bank-mount"></div>
      </div>
      <div class="ch-sdk-button-row">
        <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button" ${snapshot.bankLinkLoading ? "disabled" : ""}>Back</button>
      </div>
    </div>
  `;
  }
  function renderSuccessStep(snapshot) {
    const source = snapshot.completedResult?.paymentSource ?? snapshot.selectedSource;
    return `
    <div class="ch-sdk-stack">
      <div class="ch-sdk-alert ch-sdk-alert--success ch-sdk-alert--success-prominent">
        ${escapeHtml(
      source ? `${formatSourcePrimaryLabel(source)} is ready to use.` : "Payment source linked successfully."
    )}
      </div>
      ${source ? renderSuccessSummary(source) : ""}
      <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button">Manage payment methods</button>
    </div>
  `;
  }
  function renderSuccessSummary(source) {
    return `
    <div class="ch-sdk-success-summary">
      <div>
        <span class="ch-sdk-source-badge">${escapeHtml(formatSourceBadgeLabel(source))}</span>
      </div>
      <div class="ch-sdk-source-copy">
        <strong>${escapeHtml(formatSourcePrimaryLabel(source))}</strong>
        <small>${escapeHtml(formatSourceSecondaryLabel(source))}</small>
      </div>
    </div>
  `;
  }
  function renderBillingAddressOptions(addresses, selectedValue) {
    const options = [
      ...addresses.filter((address) => address.id?.trim()).map(
        (address) => `<option value="${escapeHtml(address.id?.trim() ?? "")}" ${address.id?.trim() === selectedValue ? "selected" : ""}>${escapeHtml(formatBillingAddressLabel(address))}</option>`
      ),
      `<option value="${getNewBillingAddressValue()}" ${selectedValue === getNewBillingAddressValue() ? "selected" : ""}>Add new billing address</option>`
    ];
    return options.join("");
  }
  function applyTheme(hostElement, whiteLabel) {
    hostElement.style.setProperty("--ch-sdk-primary", whiteLabel.primaryColor);
    hostElement.style.setProperty("--ch-sdk-secondary", whiteLabel.secondaryColor);
    hostElement.style.setProperty("--ch-sdk-text", whiteLabel.textColor);
    hostElement.style.setProperty("--ch-sdk-font-family", whiteLabel.fontFamily);
  }
  function renderButtonLabel(label, icon) {
    const iconMarkup = icon === "arrow" ? '<span class="ch-sdk-button-icon" aria-hidden="true">\u2192</span>' : '<span class="ch-sdk-button-icon" aria-hidden="true">\u2713</span>';
    return `<span class="ch-sdk-button-label">${escapeHtml(label)}</span>${iconMarkup}`;
  }
  function getOtpDisplayDigits(code) {
    const digits = normalizeOtpDigits(code).split("");
    return Array.from({ length: 6 }, (_, index) => digits[index] ?? "");
  }
  function normalizeOtpDigits(value) {
    return value.replace(/\D/g, "").slice(0, 6);
  }
  function getOtpDigitInputs(input) {
    return Array.from(input.form?.querySelectorAll("[data-otp-digit-index]") ?? []);
  }
  function syncOtpFormValue(form, inputs) {
    const hiddenInput = form?.querySelector('input[name="otp"]');
    if (!hiddenInput) {
      return;
    }
    hiddenInput.value = inputs.map((otpInput) => normalizeOtpDigits(otpInput.value)).join("");
  }
  function focusOtpInput(input) {
    if (!input) {
      return;
    }
    input.focus();
    input.select();
  }
  function syncOtpDigits(target) {
    const inputs = getOtpDigitInputs(target);
    const index = Number(target.dataset["otpDigitIndex"] ?? -1);
    if (index < 0) {
      return;
    }
    const digits = normalizeOtpDigits(target.value);
    if (digits.length <= 1) {
      target.value = digits;
      syncOtpFormValue(target.form, inputs);
      if (digits) {
        focusOtpInput(inputs[index + 1]);
      }
      return;
    }
    let cursor = index;
    for (const digit of digits) {
      if (cursor >= inputs.length) {
        break;
      }
      inputs[cursor].value = digit;
      cursor += 1;
    }
    syncOtpFormValue(target.form, inputs);
    focusOtpInput(inputs[Math.min(cursor, inputs.length - 1)]);
  }

  // projects/commerce-hub-connect-web-sdk/src/styles-inline.ts
  var commerceHubConnectWebSdkInlineCss = ':host,\n.commerce-hub-connect-web-sdk-mount {\n  color: var(--ch-sdk-text, #101828);\n  font-family: var(--ch-sdk-font-family, "Open Sans", "Segoe UI", sans-serif);\n}\n\n.ch-sdk-shell {\n  --ch-sdk-primary-soft: color-mix(in srgb, var(--ch-sdk-primary, #0a5dff) 12%, white);\n  --ch-sdk-primary-strong: color-mix(in srgb, var(--ch-sdk-primary, #0a5dff) 86%, black);\n  --ch-sdk-secondary-soft: color-mix(in srgb, var(--ch-sdk-secondary, #627d98) 18%, white);\n  --ch-sdk-border: rgba(148, 163, 184, 0.42);\n  --ch-sdk-input-border: rgba(148, 163, 184, 0.55);\n  --ch-sdk-muted: color-mix(in srgb, var(--ch-sdk-text, #101828) 58%, white);\n  --ch-sdk-surface: #f3f5f8;\n  --ch-sdk-panel: rgba(255, 255, 255, 0.72);\n  --ch-sdk-panel-strong: #ffffff;\n  --ch-sdk-shadow: 0 28px 60px rgba(15, 23, 42, 0.10);\n  --ch-sdk-danger: #b42318;\n  --ch-sdk-danger-soft: rgba(180, 35, 24, 0.08);\n  --ch-sdk-success: #047857;\n  --ch-sdk-success-soft: rgba(4, 120, 87, 0.10);\n  width: 100%;\n}\n\n.ch-sdk-header {\n  display: flex;\n  justify-content: center;\n  margin-bottom: 10px;\n}\n\n.ch-sdk-logo {\n  max-height: 34px;\n  max-width: 168px;\n  object-fit: contain;\n}\n\n.ch-sdk-card {\n  display: grid;\n  gap: 16px;\n  width: 100%;\n  max-width: 430px;\n  margin: 0 auto;\n  padding: 14px;\n  border: 1px solid rgba(255, 255, 255, 0.65);\n  border-radius: 28px;\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(244, 246, 250, 0.98)),\n    var(--ch-sdk-surface);\n  box-shadow: var(--ch-sdk-shadow);\n}\n\n.ch-sdk-card-body {\n  display: grid;\n  gap: 18px;\n  padding: 6px;\n}\n\n.ch-sdk-footer-brand {\n  text-align: center;\n  font-size: 0.94rem;\n  font-weight: 600;\n  color: color-mix(in srgb, var(--ch-sdk-text) 18%, white);\n}\n\n.ch-sdk-title-block {\n  display: grid;\n  gap: 8px;\n}\n\n.ch-sdk-title-block--centered {\n  text-align: center;\n}\n\n.ch-sdk-title-block h2 {\n  margin: 0;\n  font-size: 2rem;\n  line-height: 1.04;\n  letter-spacing: -0.04em;\n  font-weight: 800;\n}\n\n.ch-sdk-title-block p {\n  margin: 0;\n  color: var(--ch-sdk-muted);\n  line-height: 1.55;\n  font-size: 0.97rem;\n}\n\n.ch-sdk-form,\n.ch-sdk-stack {\n  display: grid;\n  gap: 16px;\n}\n\n.ch-sdk-grid {\n  display: grid;\n  gap: 14px;\n}\n\n.ch-sdk-grid--two {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n\n.ch-sdk-form-intro {\n  display: grid;\n  gap: 4px;\n  padding: 2px 2px 0;\n}\n\n.ch-sdk-form-intro strong {\n  font-size: 0.98rem;\n}\n\n.ch-sdk-form-intro p {\n  margin: 0;\n  color: var(--ch-sdk-muted);\n  font-size: 0.92rem;\n  line-height: 1.5;\n}\n\n.ch-sdk-field {\n  display: grid;\n  gap: 7px;\n}\n\n.ch-sdk-field span {\n  font-size: 0.86rem;\n  font-weight: 600;\n  color: color-mix(in srgb, var(--ch-sdk-text) 72%, white);\n}\n\n.ch-sdk-field input,\n.ch-sdk-field select {\n  width: 100%;\n  min-height: 50px;\n  padding: 0 16px;\n  border: 1px solid var(--ch-sdk-input-border);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.9);\n  color: var(--ch-sdk-text);\n  font: inherit;\n  box-sizing: border-box;\n  transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;\n}\n\n.ch-sdk-field input::placeholder {\n  color: color-mix(in srgb, var(--ch-sdk-text) 40%, white);\n}\n\n.ch-sdk-field input:focus,\n.ch-sdk-field select:focus,\n.ch-sdk-otp-digit:focus,\n.ch-sdk-source-option:focus-visible,\n.ch-sdk-button:focus-visible,\n.ch-sdk-link-button:focus-visible,\n.ch-sdk-pill-button:focus-visible {\n  outline: 0;\n  border-color: var(--ch-sdk-primary);\n  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ch-sdk-primary) 16%, white);\n}\n\n.ch-sdk-field-help,\n.ch-sdk-field-error,\n.ch-sdk-helper-copy {\n  font-size: 0.82rem;\n}\n\n.ch-sdk-field-help,\n.ch-sdk-helper-copy {\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-field-error {\n  color: var(--ch-sdk-danger);\n}\n\n.ch-sdk-button,\n.ch-sdk-link-button,\n.ch-sdk-source-option,\n.ch-sdk-pill-button {\n  font: inherit;\n}\n\n.ch-sdk-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  min-height: 48px;\n  width: 100%;\n  padding: 0 20px;\n  border: 0;\n  border-radius: 999px;\n  background: linear-gradient(180deg, var(--ch-sdk-primary), var(--ch-sdk-primary-strong));\n  color: #fff;\n  font-weight: 700;\n  cursor: pointer;\n  transition: transform 120ms ease, filter 120ms ease, opacity 120ms ease;\n}\n\n.ch-sdk-button:hover:not(:disabled) {\n  filter: brightness(1.02);\n  transform: translateY(-1px);\n}\n\n.ch-sdk-button:disabled,\n.ch-sdk-link-button:disabled,\n.ch-sdk-pill-button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.ch-sdk-button-label {\n  display: inline-flex;\n  align-items: center;\n}\n\n.ch-sdk-button-icon {\n  font-size: 1rem;\n  line-height: 1;\n}\n\n.ch-sdk-button--secondary {\n  background: rgba(255, 255, 255, 0.88);\n  color: var(--ch-sdk-text);\n  border: 1px solid var(--ch-sdk-border);\n}\n\n.ch-sdk-button-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n\n.ch-sdk-button-row .ch-sdk-button--secondary {\n  width: auto;\n  min-width: 140px;\n}\n\n.ch-sdk-inline-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n}\n\n.ch-sdk-inline-actions--centered {\n  justify-content: center;\n}\n\n.ch-sdk-inline-separator {\n  color: color-mix(in srgb, var(--ch-sdk-text) 28%, white);\n}\n\n.ch-sdk-link-button {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: var(--ch-sdk-primary);\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.ch-sdk-helper-copy {\n  margin: 0;\n  text-align: center;\n}\n\n.ch-sdk-pill-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n\n.ch-sdk-pill-button {\n  min-height: 40px;\n  padding: 0 16px;\n  border: 1px solid color-mix(in srgb, var(--ch-sdk-primary) 18%, white);\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--ch-sdk-primary) 10%, white);\n  color: var(--ch-sdk-primary);\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.ch-sdk-alert {\n  padding: 14px 16px;\n  border-radius: 18px;\n  font-size: 0.92rem;\n  line-height: 1.45;\n}\n\n.ch-sdk-alert--error {\n  background: var(--ch-sdk-danger-soft);\n  color: var(--ch-sdk-danger);\n}\n\n.ch-sdk-alert--success {\n  background: var(--ch-sdk-success-soft);\n  color: var(--ch-sdk-success);\n}\n\n.ch-sdk-alert--success-prominent {\n  text-align: center;\n  font-weight: 700;\n}\n\n.ch-sdk-source-list {\n  display: grid;\n  gap: 12px;\n}\n\n.ch-sdk-source-option,\n.ch-sdk-success-summary {\n  display: grid;\n  grid-template-columns: auto auto minmax(0, 1fr);\n  align-items: center;\n  gap: 14px;\n  width: 100%;\n  padding: 15px 16px;\n  border: 1px solid rgba(203, 213, 225, 0.9);\n  border-radius: 20px;\n  background: rgba(255, 255, 255, 0.84);\n  color: inherit;\n  box-sizing: border-box;\n}\n\n.ch-sdk-source-option {\n  cursor: pointer;\n  text-align: left;\n}\n\n.ch-sdk-source-option.is-selected {\n  border-color: color-mix(in srgb, var(--ch-sdk-primary) 48%, white);\n  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ch-sdk-primary) 10%, white);\n}\n\n.ch-sdk-source-radio {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  border: 1px solid var(--ch-sdk-input-border);\n  border-radius: 999px;\n  background: #fff;\n}\n\n.ch-sdk-source-radio span {\n  width: 10px;\n  height: 10px;\n  border-radius: 999px;\n  background: var(--ch-sdk-primary);\n}\n\n.ch-sdk-source-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 54px;\n  min-height: 42px;\n  padding: 0 10px;\n  border-radius: 14px;\n  background: color-mix(in srgb, var(--ch-sdk-primary) 14%, white);\n  color: var(--ch-sdk-primary);\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n\n.ch-sdk-source-copy {\n  display: grid;\n  min-width: 0;\n  gap: 4px;\n}\n\n.ch-sdk-source-copy strong,\n.ch-sdk-source-copy small {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ch-sdk-source-copy small {\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-empty-state {\n  padding: 16px;\n  border: 1px dashed rgba(148, 163, 184, 0.7);\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.66);\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-bank-panel {\n  display: grid;\n  gap: 14px;\n  padding: 18px;\n  border-radius: 22px;\n  border: 1px solid rgba(203, 213, 225, 0.9);\n  background: rgba(255, 255, 255, 0.78);\n}\n\n.ch-sdk-bank-copy {\n  display: grid;\n  gap: 6px;\n}\n\n.ch-sdk-bank-copy p {\n  margin: 0;\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-bank-mount {\n  min-height: 180px;\n  border-radius: 18px;\n  border: 1px dashed color-mix(in srgb, var(--ch-sdk-primary) 28%, white);\n  background: #fff;\n}\n\n.ch-sdk-otp-group {\n  display: grid;\n  grid-template-columns: repeat(6, minmax(0, 1fr));\n  gap: 8px;\n}\n\n.ch-sdk-otp-digit {\n  min-width: 0;\n  height: 56px;\n  border: 1px solid var(--ch-sdk-input-border);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.82);\n  color: var(--ch-sdk-text);\n  text-align: center;\n  font: inherit;\n  font-size: 1.5rem;\n  font-weight: 700;\n  box-sizing: border-box;\n}\n\n@media (max-width: 640px) {\n  .ch-sdk-card {\n    padding: 12px;\n    border-radius: 24px;\n  }\n\n  .ch-sdk-card-body {\n    padding: 4px;\n  }\n\n  .ch-sdk-title-block h2 {\n    font-size: 1.7rem;\n  }\n\n  .ch-sdk-grid--two {\n    grid-template-columns: 1fr;\n  }\n\n  .ch-sdk-source-option,\n  .ch-sdk-success-summary {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n\n  .ch-sdk-source-radio {\n    display: none;\n  }\n\n  .ch-sdk-button-row {\n    flex-direction: column;\n  }\n\n  .ch-sdk-button-row .ch-sdk-button--secondary {\n    width: 100%;\n  }\n\n  .ch-sdk-otp-group {\n    gap: 6px;\n  }\n\n  .ch-sdk-otp-digit {\n    height: 52px;\n    font-size: 1.35rem;\n  }\n}\n';

  // projects/commerce-hub-connect-web-sdk/src/web-sdk.ts
  var SDK_VERSION = "0.0.1";
  var SDK_TAG_NAME = "commerce-hub-connect-widget";
  var mountedWidgets = /* @__PURE__ */ new WeakMap();
  var stylesheetPromise = null;
  var MountedWidget = class {
    constructor(containerElement, hostElement, runtimeOrigin, options, environment) {
      __publicField(this, "containerElement", containerElement);
      __publicField(this, "hostElement", hostElement);
      __publicField(this, "runtimeOrigin", runtimeOrigin);
      __publicField(this, "environment", environment);
      __publicField(this, "controller");
      __publicField(this, "renderer");
      const apiBaseUrl = resolveMountedWidgetApiBaseUrl(environment, this.runtimeOrigin);
      this.controller = new CommerceHubConnectWidgetController(
        options.interaction,
        options.configuration,
        options.whiteLabel,
        environment,
        apiBaseUrl
      );
      this.renderer = new CommerceHubConnectWidgetRenderer(hostElement, this.controller);
    }
    async update(options, environment) {
      validateMountRequest(options, environment);
      const nextEnvironment = normalizeCommerceHubConnectEnvironment(environment);
      const nextApiBaseUrl = resolveMountedWidgetApiBaseUrl(nextEnvironment, this.runtimeOrigin);
      if (nextApiBaseUrl !== resolveMountedWidgetApiBaseUrl(this.environment, this.runtimeOrigin)) {
        throw new Error(
          "Changing environment after mount is not supported when it resolves to a different API URL."
        );
      }
      this.environment = nextEnvironment;
      await this.controller.update(
        options.interaction,
        options.configuration,
        options.whiteLabel,
        nextEnvironment,
        nextApiBaseUrl
      );
    }
    destroy() {
      if (mountedWidgets.get(this.containerElement) === this) {
        mountedWidgets.delete(this.containerElement);
      }
      this.renderer.destroy();
      this.controller.destroy();
      this.hostElement.remove();
    }
  };
  var CommerceHubConnectWidgetElement = class extends HTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "mountRoot", document.createElement("div"));
      __publicField(this, "instance", null);
      __publicField(this, "interactionValue", null);
      __publicField(this, "configurationValue", null);
      __publicField(this, "whiteLabelValue");
      __publicField(this, "environmentValue");
    }
    connectedCallback() {
      if (!this.mountRoot.isConnected) {
        this.mountRoot.className = "commerce-hub-connect-web-sdk-mount";
        this.replaceChildren(this.mountRoot);
      }
      void this.renderWidget();
    }
    disconnectedCallback() {
      this.instance?.destroy();
      this.instance = null;
    }
    get configuration() {
      return this.configurationValue;
    }
    set configuration(value) {
      this.configurationValue = value;
      void this.renderWidget();
    }
    get interaction() {
      return this.interactionValue;
    }
    set interaction(value) {
      this.interactionValue = value;
      void this.renderWidget();
    }
    get whiteLabel() {
      return this.whiteLabelValue;
    }
    set whiteLabel(value) {
      this.whiteLabelValue = value;
      void this.renderWidget();
    }
    get environment() {
      return this.environmentValue;
    }
    set environment(value) {
      this.environmentValue = value ? normalizeCommerceHubConnectEnvironment(value) : void 0;
      void this.renderWidget();
    }
    async renderWidget() {
      if (!this.isConnected || !this.configurationValue || !this.interactionValue) {
        return;
      }
      const options = {
        interaction: this.interactionValue,
        configuration: this.configurationValue,
        whiteLabel: this.whiteLabelValue,
        replaceContents: true
      };
      if (!this.instance) {
        this.instance = await mount(this.mountRoot, options, this.environmentValue);
        return;
      }
      await this.instance.update(options, this.environmentValue);
    }
  };
  async function registerCommerceHubConnectWebSdk() {
    ensureCustomElementRegistered();
    const namespace = {
      version: SDK_VERSION,
      tagName: SDK_TAG_NAME,
      resolveApiBaseUrl,
      mount,
      createElement: (options, environment) => {
        const element = document.createElement(SDK_TAG_NAME);
        if (options?.interaction) {
          element.interaction = options.interaction;
        }
        if (options?.configuration) {
          element.configuration = options.configuration;
        }
        if (options?.whiteLabel) {
          element.whiteLabel = options.whiteLabel;
        }
        element.environment = environment ?? options?.environment;
        return element;
      }
    };
    window.CommerceHubConnectWebSdk = namespace;
    return namespace;
  }
  function resolveApiBaseUrl(environment, doc = document) {
    const runtimeOrigin = resolveSdkRuntimeOrigin(doc);
    const normalizedEnvironment = normalizeCommerceHubConnectEnvironment(environment);
    return resolveCommerceHubConnectApiBaseUrl(normalizedEnvironment, runtimeOrigin);
  }
  function resolveMountedWidgetApiBaseUrl(environment, runtimeOrigin) {
    return resolveCommerceHubConnectApiBaseUrl(environment, runtimeOrigin);
  }
  async function mount(target, options, environment) {
    validateMountRequest(options, environment);
    await ensureStylesheet();
    const containerElement = resolveMountTarget(target);
    const existing = mountedWidgets.get(containerElement);
    if (existing) {
      existing.destroy();
    }
    if (options.replaceContents !== false) {
      containerElement.replaceChildren();
    }
    const hostElement = document.createElement("div");
    hostElement.className = "commerce-hub-connect-web-sdk-mount";
    containerElement.appendChild(hostElement);
    const normalizedEnvironment = normalizeCommerceHubConnectEnvironment(environment);
    const runtimeOrigin = resolveSdkRuntimeOrigin(document);
    try {
      const instance = new MountedWidget(
        containerElement,
        hostElement,
        runtimeOrigin,
        options,
        normalizedEnvironment
      );
      mountedWidgets.set(containerElement, instance);
      return instance;
    } catch (error) {
      hostElement.remove();
      throw error;
    }
  }
  function ensureCustomElementRegistered() {
    if (!customElements.get(SDK_TAG_NAME)) {
      customElements.define(SDK_TAG_NAME, CommerceHubConnectWidgetElement);
    }
  }
  async function ensureStylesheet() {
    if (stylesheetPromise) {
      return stylesheetPromise;
    }
    const existing = document.head.querySelector(
      '[data-commerce-hub-connect-web-sdk-style="true"]'
    );
    if (existing) {
      stylesheetPromise = Promise.resolve();
      return stylesheetPromise;
    }
    const inlineCss = (globalThis.__commerceHubConnectWebSdkInlineCss ?? commerceHubConnectWebSdkInlineCss).trim();
    if (!inlineCss) {
      stylesheetPromise = Promise.resolve();
      return stylesheetPromise;
    }
    const styleElement = document.createElement("style");
    styleElement.dataset["commerceHubConnectWebSdkStyle"] = "true";
    styleElement.textContent = inlineCss;
    document.head.appendChild(styleElement);
    stylesheetPromise = Promise.resolve();
    return stylesheetPromise;
  }

  // projects/commerce-hub-connect-web-sdk/src/main.ts
  void registerCommerceHubConnectWebSdk();
})();
