const form = document.querySelector("#launcher-form");
const eventsRoot = document.querySelector("#sdk-events");

let sdk;

const appendEvent = (label, payload) => {
  const eventNode = document.createElement("div");
  eventNode.className = "browser-checkout__event";
  eventNode.innerHTML = `<strong>${label}</strong><pre>${JSON.stringify(payload, null, 2)}</pre>`;
  eventsRoot.prepend(eventNode);
};

const createLaunchRequest = (data) => ({
  interaction: {
    sessionReferenceId: data.get("sessionReferenceId"),
    merchantTransactionId: data.get("merchantTransactionId") || undefined,
    merchantOrderId: data.get("merchantOrderId") || undefined,
    merchantInvoiceNumber: data.get("merchantInvoiceNumber") || undefined,
    authType: "FINAL_SALE",
    expiryMinutes: 30,
    email: data.get("email"),
    allowedTenderTypes: ["CARD", "BANK_ACCOUNT", "DYNAMIC_SESSION_CARD"],
  },
  payment: {
    amount: Number(data.get("amount")),
    currency: "USD",
    callToAction: "Pay with CommerceHub Connect",
  },
});

const createBranding = (data) => ({
  merchantName: data.get("merchantName"),
  productName: data.get("productName"),
  primaryColor: data.get("primaryColor"),
});

const launchSdk = () => {
  const data = new FormData(form);

  if (sdk) {
    sdk.destroy();
  }

  eventsRoot.innerHTML = "";

  sdk = new window.CommerceHubConnectSdk({
    containerId: "checkout-root",
    apiBaseUrl: data.get("apiBaseUrl"),
    launchRequest: createLaunchRequest(data),
    branding: createBranding(data),
    onEvent: ({ type, detail }) => appendEvent(type, detail),
  });

  sdk.mount();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  launchSdk();
});

launchSdk();
