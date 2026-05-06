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
    return this.isPathSegment(path, "/interaction") || this.isPathSegment(path, "/customer") || this.isPathSegment(path, "/pbb/session");
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
  primaryColor: "#084acc",
  secondaryColor: "#667085",
  textColor: "#101828",
  fontFamily: '"Open Sans", sans-serif',
  emailEntry: {},
  otpVerification: {},
  savedSource: {},
  addCard: {}
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
    this.state = this.createSnapshot(
      interaction,
      configuration,
      whiteLabel,
      environment,
      apiBaseUrl
    );
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
    this.state = this.createSnapshot(
      interaction,
      configuration,
      whiteLabel,
      environment,
      apiBaseUrl,
      this.state
    );
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
      completedPaymentSource: null
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
  syncCardDraftField(field, value, options) {
    this.state.cardDraft = {
      ...this.state.cardDraft,
      [field]: value
    };
    if (isSensitiveCardField(field)) {
      const nextNormalizedValue = normalizeSensitiveCardFieldValue(field, value);
      this.state.cardEncryption = {
        ...this.state.cardEncryption,
        [field]: resolveDirtyCardEncryptionState(
          this.state.cardEncryption[field],
          nextNormalizedValue
        )
      };
    }
    if (options?.notify) {
      this.notify();
    }
  }
  async encryptCardField(field, value) {
    this.syncCardDraftField(field, value);
    const normalizedValue = normalizeSensitiveCardFieldValue(field, value);
    const validationError = validateSensitiveCardField(field, value);
    if (!normalizedValue) {
      this.updateState({
        cardDraftErrors: omitCardDraftError(this.state.cardDraftErrors, field),
        cardEncryption: {
          ...this.state.cardEncryption,
          [field]: createCardEncryptionFieldState()
        }
      });
      return;
    }
    if (validationError) {
      this.updateState({
        cardDraftErrors: {
          ...omitCardDraftError(this.state.cardDraftErrors, field),
          [field]: validationError
        },
        cardEncryption: {
          ...this.state.cardEncryption,
          [field]: resolveDirtyCardEncryptionState(
            this.state.cardEncryption[field],
            normalizedValue
          )
        }
      });
      return;
    }
    const currentFieldState = this.state.cardEncryption[field];
    if (currentFieldState.status === "encrypting" && currentFieldState.normalizedValue === normalizedValue) {
      return;
    }
    if (currentFieldState.status === "encrypted" && currentFieldState.normalizedValue === normalizedValue) {
      return;
    }
    this.updateState({
      cardDraftErrors: omitCardDraftError(this.state.cardDraftErrors, field),
      cardDraftMessage: null,
      cardEncryption: {
        ...this.state.cardEncryption,
        [field]: {
          status: "encrypting",
          normalizedValue,
          encryptedValue: null
        }
      }
    });
    try {
      const encryptedValue = await this.maskSensitiveCardValue(field, value);
      if (normalizeSensitiveCardFieldValue(field, this.state.cardDraft[field]) !== normalizedValue) {
        return;
      }
      this.updateState({
        cardDraftErrors: omitCardDraftError(this.state.cardDraftErrors, field),
        cardDraftMessage: null,
        cardEncryption: {
          ...this.state.cardEncryption,
          [field]: {
            status: "encrypted",
            normalizedValue,
            encryptedValue
          }
        }
      });
    } catch (error) {
      if (normalizeSensitiveCardFieldValue(field, this.state.cardDraft[field]) !== normalizedValue) {
        return;
      }
      this.updateState({
        cardDraftErrors: {
          ...omitCardDraftError(this.state.cardDraftErrors, field),
          [field]: buildCardEncryptionErrorMessage(field)
        },
        cardDraftMessage: null,
        cardEncryption: {
          ...this.state.cardEncryption,
          [field]: {
            status: "failed",
            normalizedValue,
            encryptedValue: null
          }
        }
      });
      void error;
    }
  }
  showAddCardMethod() {
    this.updateState({
      paymentEntryMode: "add",
      selectedTenderType: "CARD",
      completedPaymentSource: null,
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
      completedPaymentSource: null,
      error: null,
      pendingPayByBankLaunch: true
    });
  }
  backToPaymentList() {
    this.updateState({
      paymentEntryMode: "list",
      pendingPayByBankLaunch: false,
      completedPaymentSource: null,
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
      const attachedInteraction = await this.api.attachPaymentMethod(selectedSource.id);
      this.commitInteraction(withUpsertedSource(attachedInteraction, selectedSource));
      this.state.configuration.onSuccess(attachedInteraction);
      this.updateState({
        completedPaymentSource: null,
        paymentEntryMode: "list",
        selectedSourceId: selectedSource.id
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
    const encryptionReadinessErrors = validateCardEncryptionReadiness(
      normalizedDraft,
      this.state.cardEncryption
    );
    for (const field of ["cardNumber", "cvc"]) {
      if (!errors[field] && encryptionReadinessErrors[field]) {
        errors[field] = encryptionReadinessErrors[field];
      }
    }
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
      const maskedCardNumber = resolveEncryptedCardFieldValue(
        "cardNumber",
        normalizedDraft.cardNumber,
        this.state.cardEncryption
      );
      const maskedCvv = resolveEncryptedCardFieldValue(
        "cvc",
        normalizedDraft.cvc,
        this.state.cardEncryption
      );
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
      const attachedInteraction = await this.api.attachPaymentMethod(paymentSourceId);
      const createdSource = {
        ...cardSource,
        id: paymentSourceId
      };
      this.commitInteraction(withUpsertedSource(attachedInteraction, createdSource));
      this.state.configuration.onSuccess(attachedInteraction);
      this.updateState({
        completedPaymentSource: null,
        paymentEntryMode: "list",
        selectedSourceId: paymentSourceId,
        cardDraft: defaultCardDraft(),
        cardEncryption: defaultCardEncryptionState()
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
      const payByBank = resolvePayByBankOptions(
        this.state.environment,
        this.state.configuration.payByBank
      );
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
                throw new Error(
                  "Pay by Bank completed but no bank payment source was returned by /customer."
                );
              }
              const attachedInteraction = await this.api.attachPaymentMethod(paymentSourceId);
              const nextInteraction = withUpsertedSource(attachedInteraction, bankSource);
              this.commitInteraction(nextInteraction);
              this.state.configuration.onSuccess(attachedInteraction);
              this.updateState({
                completedPaymentSource: null,
                paymentEntryMode: "list",
                selectedSourceId: paymentSourceId
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
    const completedPaymentSource = previous?.interaction.interactionId === interaction.interactionId ? previous.completedPaymentSource : null;
    return {
      interaction,
      configuration,
      environment,
      apiBaseUrl,
      displayStep: deriveDisplayStep(interaction, paymentEntryMode, completedPaymentSource),
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
      completedPaymentSource,
      billingAddresses: previous?.interaction.interactionId === interaction.interactionId ? previous.billingAddresses : [],
      cardDraft: previous?.interaction.interactionId === interaction.interactionId ? previous.cardDraft : defaultCardDraft(),
      cardEncryption: previous?.interaction.interactionId === interaction.interactionId ? previous.cardEncryption : defaultCardEncryptionState(),
      cardDraftErrors: {},
      cardDraftMessage: null,
      requestedOtpMode: previous?.requestedOtpMode ?? "default",
      whiteLabel: resolveWhiteLabel(configuration.whiteLabel, whiteLabel),
      payByBankMountId: `commerce-hub-banklink-${interaction.interactionId}`.replace(
        /[^a-zA-Z0-9-_]/g,
        "-"
      ),
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
  async maskSensitiveCardValue(field, value) {
    const type = field === "cardNumber" ? "card" : "cvv";
    const masked = await this.api.mask(type, { value });
    return masked.value;
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
      this.state.completedPaymentSource
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
      this.state.completedPaymentSource
    );
    this.state.availableSources = resolveAvailableSources(this.state.interaction);
    this.state.selectedSource = resolveSelectedSource(
      this.state.interaction,
      this.state.selectedSourceId
    );
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
function resolveWhiteLabel(configurationWhiteLabel, instanceWhiteLabel) {
  return {
    ...DEFAULT_WHITE_LABEL,
    ...configurationWhiteLabel,
    ...instanceWhiteLabel,
    emailEntry: {
      ...DEFAULT_WHITE_LABEL.emailEntry,
      ...configurationWhiteLabel?.emailEntry,
      ...instanceWhiteLabel?.emailEntry
    },
    otpVerification: {
      ...DEFAULT_WHITE_LABEL.otpVerification,
      ...configurationWhiteLabel?.otpVerification,
      ...instanceWhiteLabel?.otpVerification
    },
    savedSource: {
      ...DEFAULT_WHITE_LABEL.savedSource,
      ...configurationWhiteLabel?.savedSource,
      ...instanceWhiteLabel?.savedSource
    },
    addCard: {
      ...DEFAULT_WHITE_LABEL.addCard,
      ...configurationWhiteLabel?.addCard,
      ...instanceWhiteLabel?.addCard
    }
  };
}
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
function deriveDisplayStep(interaction, paymentEntryMode, completedPaymentSource) {
  if (completedPaymentSource) {
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
function defaultCardEncryptionState() {
  return {
    cardNumber: createCardEncryptionFieldState(),
    cvc: createCardEncryptionFieldState()
  };
}
function createCardEncryptionFieldState() {
  return {
    status: "idle",
    normalizedValue: "",
    encryptedValue: null
  };
}
function isSensitiveCardField(field) {
  return field === "cardNumber" || field === "cvc";
}
function normalizeSensitiveCardFieldValue(field, value) {
  return field === "cardNumber" ? normalizeCardNumber(value) : normalizeCvv(value);
}
function validateSensitiveCardField(field, value) {
  if (field === "cardNumber") {
    return isValidCardNumber(value) ? void 0 : "Enter a valid card number.";
  }
  return isValidCvv(value) ? void 0 : "Enter a valid CVC.";
}
function buildCardEncryptionErrorMessage(field) {
  return field === "cardNumber" ? "Unable to encrypt the card number. Try again." : "Unable to encrypt the CVC. Try again.";
}
function resolveDirtyCardEncryptionState(previous, normalizedValue) {
  if (!normalizedValue) {
    return createCardEncryptionFieldState();
  }
  if (previous.normalizedValue === normalizedValue && (previous.status === "encrypting" || previous.status === "encrypted")) {
    return previous;
  }
  return {
    status: "dirty",
    normalizedValue,
    encryptedValue: null
  };
}
function omitCardDraftError(errors, field) {
  const nextErrors = {
    ...errors
  };
  delete nextErrors[field];
  return nextErrors;
}
function validateCardEncryptionReadiness(draft, cardEncryption) {
  const errors = {};
  for (const field of ["cardNumber", "cvc"]) {
    const normalizedValue = normalizeSensitiveCardFieldValue(field, draft[field]);
    const encryptedField = cardEncryption[field];
    if (!normalizedValue) {
      continue;
    }
    const isEncrypted = encryptedField.status === "encrypted" && encryptedField.normalizedValue === normalizedValue && Boolean(encryptedField.encryptedValue);
    if (!isEncrypted) {
      errors[field] = encryptedField.status === "failed" ? buildCardEncryptionErrorMessage(field) : field === "cardNumber" ? "Encrypt the card number before saving." : "Encrypt the CVC before saving.";
    }
  }
  return errors;
}
function resolveEncryptedCardFieldValue(field, value, cardEncryption) {
  const normalizedValue = normalizeSensitiveCardFieldValue(field, value);
  const encryptedField = cardEncryption[field];
  if (encryptedField.status !== "encrypted" || encryptedField.normalizedValue !== normalizedValue || !encryptedField.encryptedValue) {
    throw new Error(
      field === "cardNumber" ? "Card number encryption must complete before saving." : "CVC encryption must complete before saving."
    );
  }
  return encryptedField.encryptedValue;
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
    throw new Error(
      "Pay by Bank completed but no bank payment source was returned by /customer."
    );
  })();
}
function withUpsertedSource(interaction, source) {
  const paymentSources = interaction.paymentSources ?? [];
  const nextPaymentSources = paymentSources.some(
    (existingSource) => existingSource.id === source.id
  ) ? paymentSources.map(
    (existingSource) => existingSource.id === source.id ? source : existingSource
  ) : [source, ...paymentSources];
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
function canSubmitCard(snapshot) {
  return snapshot.cardEncryption.cardNumber.status === "encrypted" && snapshot.cardEncryption.cvc.status === "encrypted" && !snapshot.submitting;
}

// projects/commerce-hub-connect-web-sdk/src/ui/widget-renderer.ts
var CARD_DRAFT_FIELD_NAMES = /* @__PURE__ */ new Set([
  "name",
  "fullName",
  "cardNumber",
  "expiration",
  "cvc",
  "billingAddressValue",
  "country",
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "zip"
]);
var CommerceHubConnectWidgetRenderer = class {
  constructor(hostElement, controller) {
    __publicField(this, "hostElement", hostElement);
    __publicField(this, "controller", controller);
    __publicField(this, "unsubscribe");
    __publicField(this, "lastRenderedStepKey", null);
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
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      if (target.dataset["otpDigitIndex"] !== void 0) {
        syncOtpDigits(target);
        return;
      }
      if (isCardDraftFormControl(target)) {
        this.controller.syncCardDraftField(target.name, target.value);
        if (isSensitiveCardInput(target)) {
          updateCardSubmitAvailability(target.form, this.controller);
        }
      }
    });
    __publicField(this, "handleChange", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
        return;
      }
      if (!isCardDraftFormControl(target)) {
        return;
      }
      this.controller.syncCardDraftField(target.name, target.value, {
        notify: target instanceof HTMLSelectElement
      });
      if (target instanceof HTMLInputElement && isSensitiveCardInput(target)) {
        updateCardSubmitAvailability(target.form, this.controller);
      }
    });
    __publicField(this, "handleBlur", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !isSensitiveCardInput(target)) {
        return;
      }
      void this.controller.encryptCardField(target.name, target.value);
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
    this.hostElement.addEventListener("change", this.handleChange);
    this.hostElement.addEventListener("blur", this.handleBlur, true);
    this.hostElement.addEventListener("keydown", this.handleKeydown);
    this.hostElement.addEventListener("paste", this.handlePaste);
    this.render();
  }
  destroy() {
    this.unsubscribe();
    this.hostElement.removeEventListener("click", this.handleClick);
    this.hostElement.removeEventListener("submit", this.handleSubmit);
    this.hostElement.removeEventListener("input", this.handleInput);
    this.hostElement.removeEventListener("change", this.handleChange);
    this.hostElement.removeEventListener("blur", this.handleBlur, true);
    this.hostElement.removeEventListener("keydown", this.handleKeydown);
    this.hostElement.removeEventListener("paste", this.handlePaste);
    this.hostElement.replaceChildren();
  }
  render() {
    const snapshot = this.controller.getSnapshot();
    applyTheme(this.hostElement, snapshot.whiteLabel);
    const stepKey = getStepRenderKey(snapshot);
    const renderState = captureRenderState(this.hostElement, this.lastRenderedStepKey, stepKey);
    const isStepEntering = this.lastRenderedStepKey !== null && this.lastRenderedStepKey !== stepKey;
    this.lastRenderedStepKey = stepKey;
    const cardClass = snapshot.displayStep === "payment" && snapshot.paymentEntryMode === "add" && snapshot.selectedTenderType === "CARD" ? " ch-sdk-card--wide" : "";
    const cardBodyClass = [
      "ch-sdk-card-body",
      isStepEntering ? "is-step-entering" : "",
      snapshot.displayStep === "payment" && snapshot.paymentEntryMode === "list" ? "ch-sdk-card-body--payment-list" : ""
    ].filter(Boolean).join(" ");
    this.hostElement.innerHTML = `
      <section class="ch-sdk-shell">
        ${snapshot.whiteLabel.logoUrl ? `<header class="ch-sdk-header"><img src="${escapeHtml(snapshot.whiteLabel.logoUrl)}" alt="Merchant logo" class="ch-sdk-logo" /></header>` : ""}
        <div class="ch-sdk-card${cardClass}">
          <div class="${cardBodyClass}" data-step="${escapeHtml(stepKey)}">
            ${renderStatus(snapshot)}
            ${snapshot.error ? renderError(snapshot.error.message) : ""}
            ${renderStep(snapshot)}
          </div>
        </div>
      </section>
    `;
    restoreRenderState(this.hostElement, renderState);
    if (snapshot.pendingPayByBankLaunch && snapshot.displayStep === "payment" && snapshot.paymentEntryMode === "add" && snapshot.selectedTenderType === "BANK_ACCOUNT") {
      queueMicrotask(() => {
        void this.controller.launchPayByBank(snapshot.payByBankMountId);
      });
    }
  }
};
function captureRenderState(hostElement, previousStepKey, nextStepKey) {
  if (previousStepKey !== nextStepKey) {
    return {};
  }
  const sourceScroll = hostElement.querySelector(".ch-sdk-source-scroll");
  return sourceScroll ? { sourceScrollTop: sourceScroll.scrollTop } : {};
}
function restoreRenderState(hostElement, renderState) {
  if (renderState.sourceScrollTop === void 0) {
    return;
  }
  const sourceScroll = hostElement.querySelector(".ch-sdk-source-scroll");
  if (sourceScroll) {
    sourceScroll.scrollTop = renderState.sourceScrollTop;
  }
}
function getStepRenderKey(snapshot) {
  return [snapshot.displayStep, snapshot.paymentEntryMode, snapshot.selectedTenderType].join(":");
}
function renderStatus(snapshot) {
  if (snapshot.displayStep === "payment" && snapshot.paymentEntryMode === "add" && snapshot.selectedTenderType === "BANK_ACCOUNT") {
    return "";
  }
  const title = (() => {
    switch (snapshot.displayStep) {
      case "otp":
        return snapshot.whiteLabel.otpVerification.title?.trim() || "Enter code";
      case "payment":
        return snapshot.paymentEntryMode === "add" ? snapshot.selectedTenderType === "CARD" ? snapshot.whiteLabel.addCard.title?.trim() || "Add card" : "Connect bank" : snapshot.whiteLabel.savedSource.title?.trim() || snapshot.configuration.paymentSelectionTitle?.trim() || "Payment method";
      case "success":
        return "Payment method saved";
      case "email":
      default:
        return snapshot.whiteLabel.emailEntry.title?.trim() || "Sign in";
    }
  })();
  const subtitle = (() => {
    switch (snapshot.displayStep) {
      case "otp":
        return snapshot.whiteLabel.otpVerification.subtitle?.trim() || `We sent a six-digit code to ${formatOtpDestination(snapshot)}.`;
      case "payment":
        return snapshot.paymentEntryMode === "add" ? snapshot.selectedTenderType === "CARD" ? snapshot.whiteLabel.addCard.subtitle?.trim() || "Save a new credit or debit card to this wallet." : "Continue in the secure bank-link frame." : snapshot.whiteLabel.savedSource.subtitle?.trim() || "Choose a saved payment method or add a new one.";
      case "success": {
        const source = snapshot.completedPaymentSource ?? snapshot.selectedSource;
        return source ? `${formatSourcePrimaryLabel(source)} is ready to use.` : "Payment source linked successfully.";
      }
      case "email":
      default:
        return snapshot.whiteLabel.emailEntry.subtitle?.trim() || "Enter the email address linked to this customer wallet.";
    }
  })();
  return `
    <div class="ch-sdk-title-block">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
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
      <button class="ch-sdk-button${snapshot.submitting ? " is-loading" : ""}" type="submit" ${snapshot.submitting ? 'disabled aria-busy="true"' : ""}>${renderButtonLabel(snapshot.submitting ? "Sending..." : snapshot.whiteLabel.emailEntry.primaryButtonText?.trim() || "Continue", "arrow", snapshot.submitting)}</button>
    </form>
  `;
}
function renderOtpStep(snapshot) {
  const otpDigits = getOtpDisplayDigits(snapshot.otpCode);
  const hasOtpError = snapshot.error?.stage === "otp_validate";
  return `
    <form class="ch-sdk-form" data-form="otp">
      <input name="otp" type="hidden" value="${escapeHtml(snapshot.otpCode)}" />
      <div class="ch-sdk-otp-group${hasOtpError ? " is-error" : ""}" role="group" aria-label="One-time code">
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
                ${hasOtpError ? 'aria-invalid="true"' : ""}
                ${snapshot.submitting ? "disabled" : ""}
              />
            `
  ).join("")}
      </div>
      <button class="ch-sdk-button${snapshot.submitting ? " is-loading" : ""}" type="submit" ${snapshot.submitting ? 'disabled aria-busy="true"' : ""}>${renderButtonLabel(snapshot.submitting ? "Verifying..." : snapshot.whiteLabel.otpVerification.primaryButtonText?.trim() || "Verify", "check", snapshot.submitting)}</button>
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
  const sourceActionsMarkup = [
    snapshot.supportedTenderTypes.includes("CARD") ? renderSourceAction("add-card", "Add card", renderAddCardIcon()) : "",
    snapshot.supportedTenderTypes.includes("BANK_ACCOUNT") ? renderSourceAction("add-bank", "Add bank account", renderAddBankIcon()) : ""
  ].filter(Boolean).join("");
  const sourceActionsListMarkup = sourceActionsMarkup ? `<div class="ch-sdk-source-actions-list">${sourceActionsMarkup}</div>` : "";
  return `
    <div class="ch-sdk-stack ch-sdk-stack--payment-list">
      <div class="ch-sdk-source-scroll" role="region" aria-label="Saved payment methods" tabindex="0">
        <div class="ch-sdk-source-list">${sourcesMarkup}</div>
      </div>
      ${sourceActionsListMarkup}
      <button class="ch-sdk-button${snapshot.submitting ? " is-loading" : ""}" data-action="attach-selected-source" type="button" ${snapshot.submitting || !snapshot.selectedSource ? "disabled" : ""} ${snapshot.submitting ? 'aria-busy="true"' : ""}>
        ${renderButtonLabel(
    snapshot.submitting ? "Saving..." : snapshot.whiteLabel.savedSource.primaryButtonText?.trim() || snapshot.configuration.paymentSelectionConfirmLabel?.trim() || "Confirm",
    "arrow",
    snapshot.submitting
  )}
      </button>
    </div>
  `;
}
function renderSourceOption(source, selectedSourceId) {
  const isSelected = source.id === selectedSourceId;
  return `
    <button class="ch-sdk-source-option${isSelected ? " is-selected" : ""}" data-action="select-source" data-source-id="${escapeHtml(source.id ?? "")}" type="button" aria-pressed="${isSelected ? "true" : "false"}">
      <span class="ch-sdk-source-radio" aria-hidden="true">${isSelected ? '<span class="ch-sdk-source-check"></span>' : ""}</span>
      <span class="ch-sdk-source-badge">${escapeHtml(formatSourceBadgeLabel(source))}</span>
      <span class="ch-sdk-source-copy">
        <strong>${escapeHtml(formatSourcePrimaryLabel(source))}</strong>
        <small>${escapeHtml(formatSourceSecondaryLabel(source))}</small>
      </span>
    </button>
  `;
}
function renderSourceAction(action, label, icon) {
  return `
    <button class="ch-sdk-source-action" data-action="${action}" type="button">
      ${icon}
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}
function renderAddCardIcon() {
  return `
    <svg class="ch-sdk-source-action-icon" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <rect x="1.7" y="3.5" width="10.6" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4" />
      <path d="M3 5.7h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <path d="M5.4 8.6h3.2M7 7v3.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
    </svg>
  `;
}
function renderAddBankIcon() {
  return `
    <svg class="ch-sdk-source-action-icon" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M2.2 5.4h9.6L7 2.2 2.2 5.4Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M3 11.4h8M3.6 6.5v3.8M7 6.5v3.8M10.4 6.5v3.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <path d="M10 1.6v3M8.5 3.1h3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
    </svg>
  `;
}
function renderCardStep(snapshot) {
  const draft = snapshot.cardDraft;
  const useNewBillingAddress = (draft.billingAddressValue || getNewBillingAddressValue()) === getNewBillingAddressValue();
  const billingAddressOptions = renderBillingAddressOptions(
    snapshot.billingAddresses,
    draft.billingAddressValue || getNewBillingAddressValue()
  );
  const billingAddressControl = snapshot.billingAddresses.length > 0 ? `<label class="ch-sdk-field">
          <span>Billing address</span>
          <select name="billingAddressValue">${billingAddressOptions}</select>
        </label>` : `<input name="billingAddressValue" type="hidden" value="${getNewBillingAddressValue()}" />`;
  const cardPreview = draft.cardNumber ? `<small class="ch-sdk-field-help">Preview: ${escapeHtml(getMaskedCardPreview(draft.cardNumber))}</small>` : "";
  const cvvPreview = draft.cvc ? `<small class="ch-sdk-field-help">Preview: ${escapeHtml(getMaskedCvvPreview(draft.cvc))}</small>` : "";
  return `
    <form class="ch-sdk-form" data-form="card">
      ${snapshot.cardDraftMessage ? `<div class="ch-sdk-alert ch-sdk-alert--error">${escapeHtml(snapshot.cardDraftMessage)}</div>` : ""}
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField("Card label", "name", draft.name, snapshot.cardDraftErrors.name)}
        ${renderInputField("Name on card", "fullName", draft.fullName, snapshot.cardDraftErrors.fullName)}
      </div>
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField("Card number", "cardNumber", draft.cardNumber, snapshot.cardDraftErrors.cardNumber, "text", "cc-number")}
        ${renderInputField("Expiration", "expiration", draft.expiration, snapshot.cardDraftErrors.expiration, "text", "cc-exp", "MM/YY")}
      </div>
      ${cardPreview}
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField("CVC", "cvc", draft.cvc, snapshot.cardDraftErrors.cvc, "password", "cc-csc")}
        ${useNewBillingAddress ? renderInputField("Country", "country", draft.country, snapshot.cardDraftErrors.country) : billingAddressControl}
      </div>
      ${cvvPreview}
      ${useNewBillingAddress ? billingAddressControl : ""}
      ${useNewBillingAddress ? renderNewBillingAddressFields(draft, snapshot.cardDraftErrors) : ""}
      <div class="ch-sdk-button-row">
        <button class="ch-sdk-button${snapshot.submitting ? " is-loading" : ""}" type="submit" ${canSubmitCard(snapshot) ? "" : "disabled"} ${snapshot.submitting ? 'aria-busy="true"' : ""}>${renderButtonLabel(snapshot.submitting ? "Saving..." : snapshot.whiteLabel.addCard.primaryButtonText?.trim() || "Save payment method", "arrow", snapshot.submitting)}</button>
        <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button" ${snapshot.submitting ? "disabled" : ""}>Back</button>
      </div>
    </form>
  `;
}
function renderNewBillingAddressFields(draft, errors) {
  return `
    ${renderInputField("Address line 1", "addressLine1", draft.addressLine1, errors.addressLine1)}
    <input name="addressLine2" type="hidden" value="${escapeHtml(draft.addressLine2)}" />
    <div class="ch-sdk-grid ch-sdk-grid--two">
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
      <input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${autocomplete ? `autocomplete="${escapeHtml(autocomplete)}"` : ""} ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ""} ${error ? 'aria-invalid="true"' : ""} />
      ${error ? `<small class="ch-sdk-field-error">${escapeHtml(error)}</small>` : ""}
    </label>
  `;
}
function renderBankStep(snapshot) {
  const isBankLoading = snapshot.pendingPayByBankLaunch || snapshot.bankLinkLoading;
  return `
    <div class="ch-sdk-stack">
      <div id="${escapeHtml(snapshot.payByBankMountId)}" class="ch-sdk-bank-mount${isBankLoading ? " is-loading" : ""}" ${isBankLoading ? 'aria-busy="true"' : ""}></div>
      <div class="ch-sdk-button-row">
        <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button" ${snapshot.bankLinkLoading ? "disabled" : ""}>Back</button>
      </div>
    </div>
  `;
}
function renderSuccessStep(snapshot) {
  const source = snapshot.completedPaymentSource ?? snapshot.selectedSource;
  return `
    <div class="ch-sdk-stack">
      <div class="ch-sdk-alert ch-sdk-alert--success ch-sdk-alert--success-prominent">
        <span class="ch-sdk-success-icon" aria-hidden="true"><span></span></span>
        <span>${escapeHtml(
    source ? `${formatSourcePrimaryLabel(source)} is ready to use.` : "Payment source linked successfully."
  )}</span>
      </div>
      ${source ? renderSuccessSummary(source) : ""}
      <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button">Manage payment methods</button>
    </div>
  `;
}
function renderSuccessSummary(source) {
  return `
    <div class="ch-sdk-success-summary">
      <span class="ch-sdk-source-radio ch-sdk-source-radio--success" aria-hidden="true"><span class="ch-sdk-source-check"></span></span>
      <span class="ch-sdk-source-badge">${escapeHtml(formatSourceBadgeLabel(source))}</span>
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
function isSensitiveCardInput(target) {
  return target.form?.dataset["form"] === "card" && (target.name === "cardNumber" || target.name === "cvc");
}
function isCardDraftFieldName(name) {
  return CARD_DRAFT_FIELD_NAMES.has(name);
}
function isCardDraftFormControl(target) {
  return target.form?.dataset["form"] === "card" && isCardDraftFieldName(target.name);
}
function updateCardSubmitAvailability(form, controller) {
  const submitButton = form?.querySelector('button[type="submit"]');
  if (!submitButton) {
    return;
  }
  submitButton.disabled = !canSubmitCard(controller.getSnapshot());
}
function renderButtonLabel(label, _icon, loading = false) {
  return `<span class="ch-sdk-button-label">${loading ? '<span class="ch-sdk-spinner" aria-hidden="true"></span>' : ""}<span>${escapeHtml(label)}</span></span>`;
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
var commerceHubConnectWebSdkInlineCss = ":host,\n.commerce-hub-connect-web-sdk-mount {\n  color: var(--ch-sdk-text, #101828);\n  font-family: var(--ch-sdk-font-family, 'Open Sans', sans-serif);\n}\n\n.ch-sdk-shell {\n  --ch-sdk-action: var(--ch-sdk-primary, #084acc);\n  --ch-sdk-copy: #344054;\n  --ch-sdk-muted: #667085;\n  --ch-sdk-surface: #f3f5f8;\n  --ch-sdk-border: #cbd5e1;\n  --ch-sdk-border-strong: var(--ch-sdk-text, #101828);\n  --ch-sdk-badge-border: #e4e7ec;\n  --ch-sdk-danger: #b42318;\n  --ch-sdk-danger-soft: rgba(180, 35, 24, 0.08);\n  --ch-sdk-success: #047857;\n  --ch-sdk-success-soft: #ecfdf3;\n  --ch-sdk-success-border: #a6f4c5;\n  width: 100%;\n}\n\n.ch-sdk-header {\n  display: flex;\n  justify-content: center;\n  margin-bottom: 10px;\n}\n\n.ch-sdk-logo {\n  max-height: 34px;\n  max-width: 168px;\n  object-fit: contain;\n}\n\n.ch-sdk-card {\n  box-sizing: border-box;\n  display: grid;\n  width: 100%;\n  max-width: 386px;\n  margin: 0 auto;\n  padding: 20px;\n  border: 0;\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: none;\n}\n\n.ch-sdk-card--wide {\n  max-width: 430px;\n}\n\n.ch-sdk-card-body {\n  display: grid;\n  gap: 18px;\n}\n\n.ch-sdk-card-body--payment-list {\n  gap: 12px;\n}\n\n.ch-sdk-card-body.is-step-entering {\n  animation: ch-sdk-step-enter 160ms ease-out;\n}\n\n.ch-sdk-title-block {\n  display: grid;\n  gap: 4px;\n}\n\n.ch-sdk-title-block h2 {\n  margin: 0;\n  color: var(--ch-sdk-text, #101828);\n  font-size: 22px;\n  font-weight: 700;\n  line-height: 28px;\n  letter-spacing: 0;\n}\n\n.ch-sdk-title-block p {\n  margin: 0;\n  color: var(--ch-sdk-muted);\n  font-size: 14px;\n  line-height: 20px;\n}\n\n.ch-sdk-form,\n.ch-sdk-stack {\n  display: grid;\n  gap: 18px;\n}\n\n.ch-sdk-stack--payment-list {\n  gap: 8px;\n}\n\n.ch-sdk-grid {\n  display: grid;\n  gap: 14px;\n}\n\n.ch-sdk-grid--two {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n\n.ch-sdk-field {\n  display: grid;\n  gap: 7px;\n}\n\n.ch-sdk-field span {\n  color: var(--ch-sdk-copy);\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 16px;\n}\n\n.ch-sdk-field input,\n.ch-sdk-field select {\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 42px;\n  padding: 0 12px;\n  border: 1px solid var(--ch-sdk-border);\n  border-radius: 8px;\n  background: #fff;\n  color: var(--ch-sdk-text, #101828);\n  font: inherit;\n  font-size: 14px;\n  line-height: 18px;\n  transition:\n    border-color 120ms ease,\n    box-shadow 120ms ease;\n}\n\n.ch-sdk-field input[aria-invalid='true'],\n.ch-sdk-field select[aria-invalid='true'] {\n  border-color: var(--ch-sdk-danger);\n}\n\n.ch-sdk-field input::placeholder {\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-field input:focus,\n.ch-sdk-field select:focus,\n.ch-sdk-otp-digit:focus,\n.ch-sdk-source-option:focus-visible,\n.ch-sdk-source-action:focus-visible,\n.ch-sdk-button:focus-visible,\n.ch-sdk-link-button:focus-visible {\n  outline: 0;\n  border-color: var(--ch-sdk-primary, #084acc);\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ch-sdk-primary, #084acc) 16%, white);\n}\n\n.ch-sdk-field-help,\n.ch-sdk-field-error,\n.ch-sdk-helper-copy {\n  font-size: 12px;\n  line-height: 16px;\n}\n\n.ch-sdk-field-help,\n.ch-sdk-helper-copy {\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-field-error {\n  color: var(--ch-sdk-danger);\n  animation: ch-sdk-alert-enter 140ms ease-out;\n}\n\n.ch-sdk-button,\n.ch-sdk-link-button,\n.ch-sdk-source-option,\n.ch-sdk-source-action {\n  font: inherit;\n}\n\n.ch-sdk-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 44px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 18px;\n  cursor: pointer;\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease,\n    color 120ms ease,\n    opacity 120ms ease;\n}\n\n.ch-sdk-button {\n  width: 100%;\n  padding: 0 18px;\n  border: 1px solid var(--ch-sdk-action);\n  background: var(--ch-sdk-action);\n  color: #fff;\n}\n\n.ch-sdk-button:hover:not(:disabled) {\n  background: color-mix(in srgb, var(--ch-sdk-action) 92%, white);\n}\n\n.ch-sdk-button:disabled,\n.ch-sdk-link-button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.ch-sdk-button-label {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n\n.ch-sdk-button-icon {\n  display: none;\n}\n\n.ch-sdk-spinner {\n  box-sizing: border-box;\n  display: inline-block;\n  width: 14px;\n  height: 14px;\n  border: 2px solid currentColor;\n  border-right-color: transparent;\n  border-radius: 999px;\n  animation: ch-sdk-spin 700ms linear infinite;\n}\n\n.ch-sdk-button--secondary {\n  border: 1px solid var(--ch-sdk-border);\n  background: #fff;\n  color: var(--ch-sdk-text, #101828);\n}\n\n.ch-sdk-button--secondary:hover:not(:disabled) {\n  background: #f9fafb;\n  border-color: var(--ch-sdk-border-strong);\n}\n\n.ch-sdk-button-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n\n.ch-sdk-button-row .ch-sdk-button {\n  width: auto;\n  min-width: 100px;\n}\n\n.ch-sdk-button-row .ch-sdk-button:not(.ch-sdk-button--secondary) {\n  min-width: 230px;\n}\n\n.ch-sdk-inline-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  font-size: 13px;\n  line-height: 18px;\n}\n\n.ch-sdk-inline-separator {\n  color: var(--ch-sdk-muted);\n}\n\n.ch-sdk-link-button {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: var(--ch-sdk-primary, #084acc);\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 18px;\n  cursor: pointer;\n}\n\n.ch-sdk-helper-copy {\n  margin: 0;\n  text-align: center;\n}\n\n.ch-sdk-alert {\n  padding: 12px;\n  border-radius: 8px;\n  font-size: 14px;\n  line-height: 20px;\n  animation: ch-sdk-alert-enter 140ms ease-out;\n}\n\n.ch-sdk-alert--error {\n  background: var(--ch-sdk-danger-soft);\n  color: var(--ch-sdk-danger);\n}\n\n.ch-sdk-alert--success {\n  border: 1px solid var(--ch-sdk-success-border);\n  background: var(--ch-sdk-success-soft);\n  color: var(--ch-sdk-success);\n}\n\n.ch-sdk-alert--success-prominent {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-weight: 600;\n}\n\n.ch-sdk-success-icon {\n  box-sizing: border-box;\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  border: 1px solid var(--ch-sdk-success-border);\n  border-radius: 999px;\n  background: #fff;\n  color: var(--ch-sdk-success);\n}\n\n.ch-sdk-success-icon span {\n  display: block;\n  width: 7px;\n  height: 11px;\n  border: solid currentColor;\n  border-width: 0 2px 2px 0;\n  transform: rotate(45deg);\n  transform-origin: center;\n  animation: ch-sdk-check-enter 150ms ease-out both;\n}\n\n.ch-sdk-source-check {\n  display: block;\n  width: 8px;\n  height: 8px;\n  border-radius: 999px;\n  background: currentColor;\n  animation: ch-sdk-dot-enter 150ms ease-out both;\n}\n\n.ch-sdk-source-list {\n  display: grid;\n  gap: 8px;\n}\n\n.ch-sdk-source-scroll {\n  box-sizing: border-box;\n  max-height: 201px;\n  overflow-y: auto;\n  padding-right: 10px;\n  scrollbar-color: var(--ch-sdk-border) #eef2f7;\n  scrollbar-width: thin;\n}\n\n.ch-sdk-source-scroll::-webkit-scrollbar {\n  width: 4px;\n}\n\n.ch-sdk-source-scroll::-webkit-scrollbar-track {\n  border-radius: 2px;\n  background: #eef2f7;\n}\n\n.ch-sdk-source-scroll::-webkit-scrollbar-thumb {\n  border-radius: 2px;\n  background: var(--ch-sdk-border);\n}\n\n.ch-sdk-source-scroll:focus-visible {\n  outline: 0;\n  border-radius: 8px;\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ch-sdk-primary, #084acc) 16%, white);\n}\n\n.ch-sdk-source-actions-list {\n  display: grid;\n  gap: 8px;\n}\n\n.ch-sdk-source-option,\n.ch-sdk-success-summary {\n  box-sizing: border-box;\n  display: grid;\n  grid-template-columns: auto auto minmax(0, 1fr);\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 59px;\n  padding: 12px;\n  border: 1px solid var(--ch-sdk-border);\n  border-radius: 8px;\n  background: #fff;\n  color: inherit;\n}\n\n.ch-sdk-source-option,\n.ch-sdk-source-action {\n  cursor: pointer;\n  text-align: left;\n  transition:\n    border-color 120ms ease,\n    background-color 120ms ease,\n    box-shadow 120ms ease;\n}\n\n.ch-sdk-source-option:hover:not(:disabled),\n.ch-sdk-source-action:hover:not(:disabled) {\n  background: #f9fafb;\n}\n\n.ch-sdk-source-action {\n  box-sizing: border-box;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 36px;\n  padding: 9px 12px;\n  border: 0;\n  border-radius: 8px;\n  background: #fff;\n  color: var(--ch-sdk-primary, #084acc);\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 18px;\n}\n\n.ch-sdk-source-action-icon {\n  display: block;\n  width: 14px;\n  height: 14px;\n  color: currentColor;\n}\n\n.ch-sdk-source-option.is-selected {\n  border-color: var(--ch-sdk-border-strong);\n  box-shadow: inset 0 0 0 1px var(--ch-sdk-border-strong);\n}\n\n.ch-sdk-source-radio {\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n  height: 18px;\n  border: 1px solid var(--ch-sdk-border);\n  border-radius: 999px;\n  background: #fff;\n}\n\n.ch-sdk-source-option.is-selected .ch-sdk-source-radio {\n  border-color: var(--ch-sdk-border-strong);\n  background: #fff;\n  color: var(--ch-sdk-action);\n}\n\n.ch-sdk-source-radio--success {\n  border-color: var(--ch-sdk-success);\n  background: var(--ch-sdk-success);\n  color: #fff;\n}\n\n.ch-sdk-source-badge {\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 54px;\n  height: 32px;\n  padding: 0 10px;\n  border: 1px solid var(--ch-sdk-badge-border);\n  border-radius: 6px;\n  background: var(--ch-sdk-surface);\n  color: var(--ch-sdk-primary, #084acc);\n  font-size: 11px;\n  font-weight: 700;\n  line-height: 14px;\n  text-transform: uppercase;\n}\n\n.ch-sdk-source-copy {\n  display: grid;\n  min-width: 0;\n  gap: 1px;\n}\n\n.ch-sdk-source-copy strong,\n.ch-sdk-source-copy small {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ch-sdk-source-copy strong {\n  color: var(--ch-sdk-text, #101828);\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 18px;\n}\n\n.ch-sdk-source-copy small {\n  color: var(--ch-sdk-muted);\n  font-size: 12px;\n  line-height: 16px;\n}\n\n.ch-sdk-empty-state {\n  padding: 12px;\n  border: 1px dashed var(--ch-sdk-border);\n  border-radius: 8px;\n  background: #fff;\n  color: var(--ch-sdk-muted);\n  font-size: 14px;\n  line-height: 20px;\n}\n\n.ch-sdk-bank-mount {\n  display: flex;\n  min-height: 360px;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid var(--ch-sdk-border);\n  border-radius: 8px;\n  background: #fff;\n  color: var(--ch-sdk-muted);\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 18px;\n}\n\n.ch-sdk-bank-mount.is-loading {\n  background: linear-gradient(90deg, #fff, #f9fafb, #fff);\n  background-size: 220% 100%;\n  animation: ch-sdk-bank-loading 900ms ease-in-out infinite;\n}\n\n.ch-sdk-bank-mount:empty::before {\n  content: 'Secure bank-link iframe';\n}\n\n.ch-sdk-bank-mount.is-loading:empty::before {\n  content: 'Preparing secure bank-link frame';\n}\n\n.ch-sdk-bank-status {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  color: var(--ch-sdk-muted);\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 18px;\n}\n\n.ch-sdk-otp-group {\n  display: grid;\n  grid-template-columns: repeat(6, minmax(0, 1fr));\n  gap: 8px;\n}\n\n.ch-sdk-otp-digit {\n  box-sizing: border-box;\n  min-width: 0;\n  height: 48px;\n  border: 1px solid var(--ch-sdk-border);\n  border-radius: 8px;\n  background: #fff;\n  color: var(--ch-sdk-text, #101828);\n  text-align: center;\n  font: inherit;\n  font-size: 18px;\n  font-weight: 700;\n  line-height: 22px;\n  transition:\n    border-color 120ms ease,\n    box-shadow 120ms ease,\n    background-color 120ms ease;\n}\n\n.ch-sdk-otp-digit[aria-invalid='true'] {\n  border-color: var(--ch-sdk-danger);\n  background: #fffafa;\n}\n\n.ch-sdk-otp-group.is-error {\n  animation: ch-sdk-otp-error 180ms ease-out;\n}\n\n@keyframes ch-sdk-step-enter {\n  from {\n    opacity: 0;\n    transform: translateY(4px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes ch-sdk-alert-enter {\n  from {\n    opacity: 0;\n    transform: translateY(-2px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes ch-sdk-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes ch-sdk-check-enter {\n  from {\n    opacity: 0;\n    transform: rotate(45deg) scale(0.7);\n  }\n\n  to {\n    opacity: 1;\n    transform: rotate(45deg) scale(1);\n  }\n}\n\n@keyframes ch-sdk-dot-enter {\n  from {\n    opacity: 0;\n    transform: scale(0.7);\n  }\n\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n\n@keyframes ch-sdk-bank-loading {\n  from {\n    background-position: 100% 50%;\n  }\n\n  to {\n    background-position: 0 50%;\n  }\n}\n\n@keyframes ch-sdk-otp-error {\n  0%,\n  100% {\n    transform: translateX(0);\n  }\n\n  35% {\n    transform: translateX(-3px);\n  }\n\n  70% {\n    transform: translateX(3px);\n  }\n}\n\n@media (max-width: 640px) {\n  .ch-sdk-card,\n  .ch-sdk-card--wide {\n    max-width: 100%;\n    padding: 18px;\n  }\n\n  .ch-sdk-grid--two {\n    grid-template-columns: 1fr;\n  }\n\n  .ch-sdk-button-row {\n    flex-direction: column;\n  }\n\n  .ch-sdk-button-row .ch-sdk-button,\n  .ch-sdk-button-row .ch-sdk-button:not(.ch-sdk-button--secondary) {\n    width: 100%;\n    min-width: 0;\n  }\n\n  .ch-sdk-source-option,\n  .ch-sdk-success-summary {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n\n  .ch-sdk-source-action {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n\n  .ch-sdk-source-radio {\n    display: none;\n  }\n\n  .ch-sdk-otp-group {\n    gap: 6px;\n  }\n\n  .ch-sdk-otp-digit {\n    height: 46px;\n    font-size: 16px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .ch-sdk-card-body.is-step-entering,\n  .ch-sdk-field-error,\n  .ch-sdk-alert,\n  .ch-sdk-spinner,\n  .ch-sdk-success-icon span,\n  .ch-sdk-source-check,\n  .ch-sdk-bank-mount.is-loading,\n  .ch-sdk-otp-group.is-error {\n    animation: none;\n  }\n}\n";

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
export {
  COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT,
  COMMERCE_HUB_CONNECT_ENVIRONMENTS,
  CommerceHubConnectWidgetElement,
  MountedWidget,
  isCommerceHubConnectEnvironment,
  mount,
  normalizeCommerceHubConnectEnvironment,
  normalizeCommerceHubConnectRuntimeOrigin,
  registerCommerceHubConnectWebSdk,
  resolveApiBaseUrl,
  resolveCommerceHubConnectApiBaseUrl
};
