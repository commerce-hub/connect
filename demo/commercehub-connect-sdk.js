/* Generated from sdk/browser-sdk/commercehub-connect-sdk.js. Do not edit demo copy directly. */
(function (global) {
  const DEFAULT_BRANDING = {
    merchantName: 'CommerceHub Connect',
    productName: 'Hosted Checkout SDK',
    eyebrow: 'White-label hosted checkout',
    heroTitle: 'Secure wallet checkout with your brand in front.',
    heroCopy:
      'Use the CommerceHub Connect wallet interaction flow while controlling the brand voice, colors, and presentation.',
    supportLabel: 'Need support?',
    supportCopy: 'Route support and recovery through your own merchant support surfaces.',
    primaryColor: '#0a5dff',
    primaryColorStrong: '#084ccf',
    primaryContrastColor: '#ffffff',
    inkColor: '#000000',
    mutedInkColor: '#64748b',
    surfaceColor: '#ffffff',
    surfaceAltColor: '#eef3f8',
    borderColor: '#e5e5e5',
    radius: '1.75rem',
    fontFamily: '"Open Sans", sans-serif',
  };

  const SOURCE_LABELS = {
    CARD: 'Cards',
    BANK_ACCOUNT: 'Bank accounts',
    DYNAMIC_SESSION_CARD: 'Dynamic session cards',
  };

  const IFRAME_STYLE_TEXT = `
    :root {
      color-scheme: light;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      min-height: 100%;
    }

    body {
      font-family: var(--ch-brand-font, "Open Sans", sans-serif);
      color: var(--ch-brand-ink);
      background: #f7f8f9;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    button,
    input {
      font: inherit;
    }

    .browser-checkout {
      --checkout-page-surface: #f7f8f9;
      --checkout-border-strong: color-mix(in srgb, var(--ch-brand-border) 78%, white);
      --checkout-shadow-card: 0 12px 32px rgba(15, 23, 42, 0.08);
      --checkout-shadow-soft: 0 4px 16px rgba(15, 23, 42, 0.06);
      --checkout-focus-ring: color-mix(in srgb, var(--ch-brand-primary) 20%, white);
      min-height: 100%;
      color: var(--ch-brand-ink);
      background: var(--checkout-page-surface);
    }

    .browser-checkout__main {
      margin: 0 auto;
      display: flex;
      min-height: 100%;
      width: 100%;
      max-width: 1200px;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
    }

    .browser-checkout__card {
      width: 100%;
      overflow: hidden;
      border: 1px solid var(--ch-brand-border);
      border-radius: var(--ch-brand-radius);
      background: var(--ch-brand-surface);
      box-shadow: var(--checkout-shadow-card);
    }

    .browser-checkout__panel {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      padding: 2rem 1.5rem;
    }

    .browser-checkout__brand-row,
    .browser-checkout__promo-top,
    .browser-checkout__actions,
    .browser-checkout__review,
    .browser-checkout__footer {
      display: flex;
      gap: 1rem;
    }

    .browser-checkout__brand-row {
      align-items: flex-start;
      justify-content: space-between;
    }

    .browser-checkout__brand-lockup {
      border-left: 4px solid var(--ch-brand-primary);
      padding-left: 0.9rem;
    }

    .browser-checkout__brand-eyebrow,
    .browser-checkout__step-eyebrow,
    .browser-checkout__preview-eyebrow,
    .browser-checkout__summary-label,
    .browser-checkout__promo-caption {
      margin: 0;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .browser-checkout__brand-eyebrow,
    .browser-checkout__promo-caption {
      color: var(--ch-brand-muted);
    }

    .browser-checkout__step-eyebrow,
    .browser-checkout__preview-eyebrow,
    .browser-checkout__summary-label {
      color: var(--ch-brand-primary-strong);
    }

    .browser-checkout__brand-mark {
      margin-top: 0.45rem;
      display: flex;
      flex-direction: column;
      color: var(--ch-brand-ink);
      font-size: clamp(1.6rem, 4vw, 2.8rem);
      font-weight: 400;
      line-height: 0.96;
      letter-spacing: -0.04em;
    }

    .browser-checkout__content,
    .browser-checkout__step,
    .browser-checkout__loading {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .browser-checkout__step h3,
    .browser-checkout__loading h3 {
      margin: 0;
      color: var(--ch-brand-ink);
      font-size: clamp(1.4rem, 2.3vw, 1.9rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1.08;
    }

    .browser-checkout__step-copy,
    .browser-checkout__loading p,
    .browser-checkout__footer p,
    .browser-checkout__source-copy span,
    .browser-checkout__review span,
    .browser-checkout__promo-body,
    .browser-checkout__preview-copy,
    .browser-checkout__mini-value {
      margin: 0;
      color: var(--ch-brand-muted);
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .browser-checkout__divider {
      height: 1px;
      width: 100%;
      background: var(--ch-brand-border);
    }

    .browser-checkout__form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .browser-checkout__field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--ch-brand-ink);
    }

    .browser-checkout__field input {
      width: 100%;
      min-height: 3rem;
      border: 1px solid var(--ch-brand-border);
      border-radius: 1rem;
      background: #fff;
      padding: 0.95rem 1rem;
      color: var(--ch-brand-ink);
    }

    .browser-checkout__field input:focus,
    .browser-checkout__otp-input:focus {
      outline: none;
      border-color: var(--ch-brand-primary);
      box-shadow: 0 0 0 4px var(--checkout-focus-ring);
    }

    .browser-checkout__otp-input {
      width: 100%;
      height: 3.25rem;
      border: 1px solid var(--ch-brand-border);
      border-radius: 1rem;
      text-align: center;
      font-size: 1.15rem;
      letter-spacing: 0.45rem;
      font-weight: 700;
      color: var(--ch-brand-ink);
    }

    .browser-checkout__actions {
      flex-wrap: wrap;
    }

    .browser-checkout__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 3rem;
      padding: 0.8rem 1.2rem;
      border: 1px solid var(--ch-brand-primary);
      border-radius: 1rem;
      background: var(--ch-brand-primary);
      color: var(--ch-brand-contrast);
      cursor: pointer;
      font-weight: 700;
      transition:
        background 160ms ease,
        border-color 160ms ease,
        transform 160ms ease;
    }

    .browser-checkout__button:hover {
      background: var(--ch-brand-primary-strong);
      border-color: var(--ch-brand-primary-strong);
    }

    .browser-checkout__button--secondary {
      background: transparent;
      color: var(--ch-brand-primary-strong);
      border-color: color-mix(in srgb, var(--ch-brand-primary) 18%, white);
    }

    .browser-checkout__close {
      width: 2.5rem;
      height: 2.5rem;
      border: 0;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.05);
      color: var(--ch-brand-muted);
      cursor: pointer;
      font-size: 1.1rem;
    }

    .browser-checkout__close:hover {
      background: rgba(15, 23, 42, 0.09);
    }

    .browser-checkout__sources {
      display: grid;
      gap: 0.9rem;
    }

    .browser-checkout__source,
    .browser-checkout__review,
    .browser-checkout__message,
    .browser-checkout__mini-card {
      border: 1px solid var(--ch-brand-border);
      border-radius: 1.15rem;
    }

    .browser-checkout__source {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      width: 100%;
      padding: 1rem;
      background: #ffffff;
      color: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        transform 160ms ease,
        box-shadow 160ms ease,
        border-color 160ms ease;
    }

    .browser-checkout__source:hover,
    .browser-checkout__source.is-selected {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--ch-brand-primary) 28%, white);
      box-shadow: var(--checkout-shadow-soft);
    }

    .browser-checkout__source-icon,
    .browser-checkout__promo-icon,
    .browser-checkout__success-icon {
      display: grid;
      place-items: center;
    }

    .browser-checkout__source-icon,
    .browser-checkout__promo-icon {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 1rem;
      background: color-mix(in srgb, var(--ch-brand-primary) 10%, white);
      color: var(--ch-brand-primary-strong);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .browser-checkout__source-copy {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .browser-checkout__source-copy strong,
    .browser-checkout__review strong,
    .browser-checkout__promo-inline strong,
    .browser-checkout__mini-card strong {
      font-size: 1rem;
      color: var(--ch-brand-ink);
    }

    .browser-checkout__chevron {
      color: var(--ch-brand-muted);
      font-size: 1.1rem;
    }

    .browser-checkout__review,
    .browser-checkout__mini-card {
      justify-content: space-between;
      gap: 0.75rem;
      padding: 1rem;
      background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.82) 100%);
    }

    .browser-checkout__review-block {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .browser-checkout__message {
      padding: 0.95rem 1rem;
      font-size: 0.92rem;
    }

    .browser-checkout__message--error {
      background: rgba(180, 35, 24, 0.08);
      color: #b42318;
    }

    .browser-checkout__loading {
      align-items: center;
      padding: 1.2rem 0.25rem;
      text-align: center;
    }

    .browser-checkout__spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid rgba(10, 93, 255, 0.14);
      border-top-color: var(--ch-brand-primary);
      border-radius: 999px;
      animation: spin 0.9s linear infinite;
    }

    .browser-checkout__step--success {
      align-items: center;
      text-align: center;
    }

    .browser-checkout__success-icon {
      width: 4rem;
      height: 4rem;
      border-radius: 999px;
      background: rgba(15, 122, 83, 0.12);
      color: #0f7a53;
      font-size: 1.5rem;
    }

    .browser-checkout__empty {
      padding: 1rem;
      border: 1px dashed var(--ch-brand-border);
      border-radius: 1rem;
      color: var(--ch-brand-muted);
    }

    .browser-checkout__footer {
      margin-top: auto;
      padding-top: 1.5rem;
      align-items: center;
      justify-content: space-between;
    }

    .browser-checkout__footer strong {
      display: block;
      margin-bottom: 0.2rem;
    }

    .browser-checkout__pill,
    .browser-checkout__promo-badge,
    .browser-checkout__promo-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .browser-checkout__pill {
      padding: 0.6rem 0.95rem;
      background: color-mix(in srgb, var(--ch-brand-primary) 12%, white);
      color: var(--ch-brand-primary-strong);
    }

    .browser-checkout__preview {
      position: relative;
      display: none;
      overflow: hidden;
      border-left: 1px solid var(--ch-brand-border);
      background: var(--ch-brand-surface-alt);
    }

    .browser-checkout__preview-panel {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 105% 5%, color-mix(in srgb, var(--ch-brand-primary) 24%, transparent) 0%, transparent 35%),
        radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--ch-brand-primary) 10%, white) 0%, transparent 30%),
        linear-gradient(160deg, #f8fbfe 0%, #eef4f9 52%, #f7f8f9 100%);
    }

    .browser-checkout__preview-panel::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(color-mix(in srgb, var(--ch-brand-primary) 8%, white) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.8;
    }

    .browser-checkout__preview-content {
      position: relative;
      z-index: 1;
      display: flex;
      height: 100%;
      flex-direction: column;
    }

    .browser-checkout__preview-title {
      margin: 1rem 0 0;
      font-size: clamp(2.1rem, 3.1vw, 2.7rem);
      font-weight: 600;
      line-height: 1.08;
      letter-spacing: -0.04em;
    }

    .browser-checkout__promo-cards {
      position: relative;
      min-height: 440px;
      flex: 1;
      margin-top: 2rem;
    }

    .browser-checkout__promo-card {
      position: absolute;
      border: 1px solid color-mix(in srgb, var(--checkout-border-strong) 80%, white);
      border-radius: 1.4rem;
      background: rgba(255, 255, 255, 0.88);
      padding: 1.1rem 1.25rem;
      box-shadow: var(--checkout-shadow-card);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .browser-checkout__promo-card--summary {
      top: 0;
      right: 0;
      width: 260px;
      animation: checkout-float-a 7s ease-in-out infinite;
    }

    .browser-checkout__promo-card--wallet {
      top: 8.5rem;
      left: 0;
      width: 258px;
      z-index: 2;
      animation: checkout-float-b 8s ease-in-out infinite;
    }

    .browser-checkout__promo-card--checkout {
      right: 0.75rem;
      bottom: 1rem;
      width: 272px;
      animation: checkout-float-c 9s ease-in-out infinite;
    }

    .browser-checkout__promo-top {
      align-items: center;
    }

    .browser-checkout__promo-title {
      color: var(--ch-brand-ink);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .browser-checkout__promo-value {
      margin: 0.35rem 0 0;
      font-size: 1.9rem;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: var(--ch-brand-ink);
    }

    .browser-checkout__status-dot {
      margin-left: auto;
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
    }

    .browser-checkout__sparkline {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 28px;
      margin-top: 1rem;
    }

    .browser-checkout__sparkline-bar {
      flex: 1;
      border-radius: 3px 3px 0 0;
      background: color-mix(in srgb, var(--ch-brand-primary) 28%, white);
    }

    .browser-checkout__sparkline-bar.is-highlight {
      background: var(--ch-brand-primary);
    }

    .browser-checkout__sparkline-bar.h-35 { height: 35%; }
    .browser-checkout__sparkline-bar.h-45 { height: 45%; }
    .browser-checkout__sparkline-bar.h-55 { height: 55%; }
    .browser-checkout__sparkline-bar.h-60 { height: 60%; }
    .browser-checkout__sparkline-bar.h-65 { height: 65%; }
    .browser-checkout__sparkline-bar.h-70 { height: 70%; }
    .browser-checkout__sparkline-bar.h-80 { height: 80%; }
    .browser-checkout__sparkline-bar.h-100 { height: 100%; }

    .browser-checkout__promo-inline {
      margin-top: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .browser-checkout__promo-inline--stacked {
      align-items: flex-start;
      flex-direction: column;
    }

    .browser-checkout__mini-card {
      margin-top: 1rem;
      display: flex;
      align-items: center;
    }

    .browser-checkout__mini-value {
      margin: 0;
      font-size: 0.82rem;
      text-align: right;
    }

    .browser-checkout__promo-badge {
      margin-left: auto;
      padding: 0.2rem 0.55rem;
      border: 1px solid color-mix(in srgb, var(--ch-brand-primary) 18%, white);
      background: color-mix(in srgb, var(--ch-brand-primary) 10%, white);
      color: var(--ch-brand-primary-strong);
    }

    .browser-checkout__promo-pill {
      margin-left: auto;
      max-width: 10rem;
      padding: 0.25rem 0.6rem;
      text-align: center;
    }

    .browser-checkout__status--info {
      background: color-mix(in srgb, var(--ch-brand-primary) 12%, white);
      color: var(--ch-brand-primary-strong);
    }

    .browser-checkout__status--success {
      background: rgba(15, 122, 83, 0.12);
      color: #0f7a53;
    }

    .browser-checkout__status--warn {
      background: rgba(180, 35, 24, 0.12);
      color: #b42318;
    }

    .browser-checkout__progress {
      display: flex;
      justify-content: space-between;
      gap: 0.8rem;
      margin-top: 1.15rem;
    }

    .browser-checkout__progress-step {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.45rem;
      color: var(--ch-brand-muted);
      text-align: center;
    }

    .browser-checkout__progress-step span {
      display: grid;
      width: 2rem;
      height: 2rem;
      place-items: center;
      border: 1px solid var(--ch-brand-border);
      border-radius: 999px;
      background: #ffffff;
      font-weight: 700;
    }

    .browser-checkout__progress-step.is-active span {
      background: var(--ch-brand-primary);
      border-color: var(--ch-brand-primary);
      color: var(--ch-brand-contrast);
    }

    .browser-checkout__progress-step label {
      font-size: 0.78rem;
      font-weight: 600;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes checkout-float-a {
      0%, 100% { transform: translateY(0) rotate(-1deg); }
      50% { transform: translateY(-10px) rotate(0.8deg); }
    }

    @keyframes checkout-float-b {
      0%, 100% { transform: translateY(0) rotate(0.8deg); }
      50% { transform: translateY(-8px) rotate(-0.4deg); }
    }

    @keyframes checkout-float-c {
      0%, 100% { transform: translateY(0) rotate(-0.4deg); }
      50% { transform: translateY(-12px) rotate(1deg); }
    }

    @media (min-width: 640px) {
      .browser-checkout__panel {
        padding: 2.5rem 2rem;
      }
    }

    @media (min-width: 1024px) {
      .browser-checkout__card {
        display: grid;
        grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
      }

      .browser-checkout__panel {
        padding: 2.75rem;
      }

      .browser-checkout__preview {
        display: block;
        padding: 2.5rem;
      }
    }

    @media (max-width: 767px) {
      .browser-checkout__review,
      .browser-checkout__footer,
      .browser-checkout__mini-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;

  function HostedCheckoutFrameApp(options) {
    this.document = options.document;
    this.window = options.window;
    this.root = options.root;
    this.notifyHeight = options.notifyHeight;
    this.apiBaseUrl = options.apiBaseUrl.replace(/\/+$/, '');
    this.proxyTargetOrigin = options.proxyTargetOrigin
      ? options.proxyTargetOrigin.replace(/\/+$/, '')
      : '';
    this.launchRequest = options.launchRequest;
    this.branding = Object.assign({}, DEFAULT_BRANDING, options.branding || {});
    this.onEvent = typeof options.onEvent === 'function' ? options.onEvent : function () {};
    this.state = {
      interaction: null,
      selectedSourceId: null,
      loadingAction: 'init',
      errorMessage: '',
    };
  }

  HostedCheckoutFrameApp.prototype.mount = function mount() {
    this.render();
    this.initialize();
  };

  HostedCheckoutFrameApp.prototype.initialize = async function initialize() {
    try {
      this.setState({ loadingAction: 'init', errorMessage: '' });
      const interaction = await this.request('/session/interaction/create', {
        method: 'POST',
        body: this.launchRequest.interaction,
      });
      this.applyInteraction(interaction);
      this.emit('checkoutReady', { interactionId: interaction.interactionId });
    } catch (error) {
      this.handleError(error, 'Unable to start hosted checkout.');
    }
  };

  HostedCheckoutFrameApp.prototype.sendOtp = async function sendOtp() {
    const email = this.getInputValue('[data-email-input]').trim();
    if (!email) {
      this.setState({ errorMessage: 'Enter an email address.' });
      return;
    }

    const interaction = this.state.interaction;
    if (!interaction || !interaction.interactionId) {
      return;
    }

    try {
      this.setState({ loadingAction: 'send-otp', errorMessage: '' });
      const updated = await this.request('/interaction/' + interaction.interactionId + '/otp/send', {
        method: 'POST',
        body: { value: email },
      });
      this.applyInteraction(updated);
    } catch (error) {
      this.handleError(error, 'Unable to send a one-time code.');
    }
  };

  HostedCheckoutFrameApp.prototype.verifyOtp = async function verifyOtp() {
    const interaction = this.state.interaction;
    if (!interaction || !interaction.interactionId) {
      return;
    }

    const otpInput = this.root.querySelector('[data-otp-input]');
    const otp = otpInput ? otpInput.value.trim() : '';

    if (otp.length !== 6) {
      this.setState({ errorMessage: 'Enter the six-digit code.' });
      return;
    }

    try {
      this.setState({ loadingAction: 'verify-otp', errorMessage: '' });
      const updated = await this.request('/interaction/' + interaction.interactionId + '/otp/validate', {
        method: 'POST',
        rawBody: JSON.stringify(otp),
      });
      this.applyInteraction(updated);
      if (updated.status === 'OTP_VALIDATION_FAILED') {
        this.setState({ errorMessage: 'The verification code did not match. Try again.' });
      }
    } catch (error) {
      this.handleError(error, 'Unable to verify the one-time code.');
    }
  };

  HostedCheckoutFrameApp.prototype.attachSource = async function attachSource(sourceId) {
    const interaction = this.state.interaction;
    if (!interaction || !interaction.interactionId || !sourceId) {
      return;
    }

    try {
      this.setState({ loadingAction: 'attach-source', errorMessage: '', selectedSourceId: sourceId });
      const updated = await this.request(
        '/interaction/' + interaction.interactionId + '/payment-source/' + sourceId + '/attach',
        { method: 'POST', body: {} },
      );
      this.applyInteraction(updated);
    } catch (error) {
      this.handleError(error, 'Unable to attach the selected payment method.');
    }
  };

  HostedCheckoutFrameApp.prototype.refreshStatus = async function refreshStatus() {
    const interaction = this.state.interaction;
    if (!interaction || !interaction.interactionId) {
      return;
    }

    try {
      this.setState({ loadingAction: 'refresh', errorMessage: '' });
      const updated = await this.request('/interaction/' + interaction.interactionId, { method: 'GET' });
      this.applyInteraction(updated);
    } catch (error) {
      this.handleError(error, 'Checkout status could not be refreshed.');
    }
  };

  HostedCheckoutFrameApp.prototype.completePayment = async function completePayment() {
    const interaction = this.state.interaction;
    if (!interaction || !interaction.interactionId) {
      return;
    }

    try {
      this.setState({ loadingAction: 'pay', errorMessage: '' });
      await this.request('/session/interaction/pay', {
        method: 'POST',
        body: {
          interactionId: interaction.interactionId,
          amount: this.launchRequest.payment.amount,
          currency: this.launchRequest.payment.currency,
        },
      });
      const updated = await this.request('/interaction/' + interaction.interactionId, { method: 'GET' });
      this.applyInteraction(updated);
      if (updated.status === 'COMPLETED') {
        this.emit('completed', {
          interaction: updated,
          payment: this.launchRequest.payment,
        });
      }
    } catch (error) {
      this.handleError(error, 'Payment could not be completed.');
    }
  };

  HostedCheckoutFrameApp.prototype.useAnotherEmail = function useAnotherEmail() {
    this.setState({
      errorMessage: '',
      selectedSourceId: null,
      interaction: Object.assign({}, this.state.interaction, {
        status: 'EMAIL_REQUESTED',
        paymentSources: [],
      }),
    });
  };

  HostedCheckoutFrameApp.prototype.destroy = function destroy() {
    this.root.innerHTML = '';
  };

  HostedCheckoutFrameApp.prototype.render = function render() {
    const interaction = this.state.interaction;
    const step = this.getCurrentStep();
    const status = interaction && interaction.status ? interaction.status : 'EMAIL_REQUESTED';
    const selectedSource = this.getSelectedSource();
    const availableSources = interaction && interaction.paymentSources ? interaction.paymentSources : [];
    const statusTone = this.getStatusTone(status);
    const total = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.launchRequest.payment.currency,
    }).format(this.launchRequest.payment.amount);

    this.root.innerHTML =
      '<section class="browser-checkout" style="' +
      this.renderCssVars() +
      '">' +
      '<main class="browser-checkout__main">' +
      '<div class="browser-checkout__card">' +
      '<section class="browser-checkout__panel">' +
      '<div class="browser-checkout__brand-row">' +
      '<div class="browser-checkout__brand-lockup">' +
      '<p class="browser-checkout__brand-eyebrow">' + this.escapeHtml(this.branding.eyebrow) + '</p>' +
      '<div class="browser-checkout__brand-mark">' +
      '<span>' + this.escapeHtml(this.branding.merchantName) + '</span>' +
      '<span>' + this.escapeHtml(this.branding.productName) + '</span>' +
      '</div>' +
      '</div>' +
      '<button type="button" class="browser-checkout__close" data-action="close" aria-label="Close checkout">&times;</button>' +
      '</div>' +
      '<div class="browser-checkout__content">' +
      (this.state.errorMessage ? this.renderMessage(this.state.errorMessage, 'error') : '') +
      this.renderStep(step, interaction, selectedSource, availableSources, total) +
      '</div>' +
      '<footer class="browser-checkout__footer">' +
      '<div><strong>' + this.escapeHtml(this.branding.supportLabel) + '</strong><p>' +
      this.escapeHtml(this.branding.supportCopy) + '</p></div>' +
      '<span class="browser-checkout__pill">Secure hosted checkout</span>' +
      '</footer>' +
      '</section>' +
      '<aside class="browser-checkout__preview">' +
      '<div class="browser-checkout__preview-panel"></div>' +
      '<div class="browser-checkout__preview-content">' +
      '<div>' +
      '<p class="browser-checkout__preview-eyebrow">Unified payments view</p>' +
      '<h2 class="browser-checkout__preview-title">' + this.escapeHtml(this.branding.heroTitle) + '</h2>' +
      '<p class="browser-checkout__preview-copy">' + this.escapeHtml(this.branding.heroCopy) + '</p>' +
      '</div>' +
      '<div class="browser-checkout__promo-cards">' +
      '<article class="browser-checkout__promo-card browser-checkout__promo-card--summary">' +
      '<div class="browser-checkout__promo-top"><div class="browser-checkout__promo-icon">&#8599;</div><span class="browser-checkout__promo-title">Hosted flow</span><span class="browser-checkout__status-dot"></span></div>' +
      '<p class="browser-checkout__summary-label">Checkout total</p>' +
      '<p class="browser-checkout__promo-value">' + this.escapeHtml(total) + '</p>' +
      '<div class="browser-checkout__sparkline" aria-hidden="true">' + this.renderSparkline() + '</div>' +
      '<div class="browser-checkout__promo-inline"><span class="browser-checkout__promo-caption">Merchant order</span><strong>' +
      this.escapeHtml(this.launchRequest.interaction.merchantOrderId || 'Generated by merchant') +
      '</strong></div>' +
      '</article>' +
      '<article class="browser-checkout__promo-card browser-checkout__promo-card--wallet">' +
      '<div class="browser-checkout__promo-top"><div class="browser-checkout__promo-icon">$</div><span class="browser-checkout__promo-title">Wallet sources</span><span class="browser-checkout__promo-badge">Featured</span></div>' +
      '<p class="browser-checkout__summary-label">Tender types</p>' +
      '<p class="browser-checkout__promo-body">' + this.escapeHtml(this.allowedTenderTypesLabel()) + '</p>' +
      '<div class="browser-checkout__mini-card"><div><span class="browser-checkout__promo-caption">Selected source</span><strong>' +
      this.escapeHtml(selectedSource ? this.sourceName(selectedSource) : 'Choose during checkout') +
      '</strong></div><span class="browser-checkout__mini-value">' +
      this.escapeHtml(selectedSource ? this.sourceValue(selectedSource) : 'Pending') +
      '</span></div>' +
      '</article>' +
      '<article class="browser-checkout__promo-card browser-checkout__promo-card--checkout">' +
      '<div class="browser-checkout__promo-top"><div class="browser-checkout__promo-icon">&#10003;</div><span class="browser-checkout__promo-title">Checkout status</span><span class="browser-checkout__promo-pill browser-checkout__status--' +
      statusTone + '">' + this.escapeHtml(this.labelStatus(status)) + '</span></div>' +
      '<div class="browser-checkout__progress">' +
      this.renderProgressStep('1', 'Sign in', this.getStepIndex(status) >= 1) +
      this.renderProgressStep('2', 'Wallet', this.getStepIndex(status) >= 2) +
      this.renderProgressStep('3', 'Review', this.getStepIndex(status) >= 3) +
      '</div>' +
      '<div class="browser-checkout__promo-inline browser-checkout__promo-inline--stacked"><span class="browser-checkout__promo-caption">Interaction</span><strong>' +
      this.escapeHtml(interaction && interaction.interactionId ? interaction.interactionId : 'Creating secure interaction') +
      '</strong></div>' +
      '</article>' +
      '</div>' +
      '</div>' +
      '</aside>' +
      '</div>' +
      '</main>' +
      '</section>';

    this.bindEvents();
    this.notifyHeight();
  };

  HostedCheckoutFrameApp.prototype.renderCssVars = function renderCssVars() {
    return [
      '--ch-brand-primary: ' + this.branding.primaryColor,
      '--ch-brand-primary-strong: ' + this.branding.primaryColorStrong,
      '--ch-brand-contrast: ' + this.branding.primaryContrastColor,
      '--ch-brand-ink: ' + this.branding.inkColor,
      '--ch-brand-muted: ' + this.branding.mutedInkColor,
      '--ch-brand-surface: ' + this.branding.surfaceColor,
      '--ch-brand-surface-alt: ' + this.branding.surfaceAltColor,
      '--ch-brand-border: ' + this.branding.borderColor,
      '--ch-brand-radius: ' + this.branding.radius,
      '--ch-brand-font: ' + this.branding.fontFamily,
    ].join('; ');
  };

  HostedCheckoutFrameApp.prototype.renderStep = function renderStep(step, interaction, selectedSource, availableSources, total) {
    if (this.state.loadingAction === 'init' && !interaction) {
      return (
        '<section class="browser-checkout__loading">' +
        '<div class="browser-checkout__spinner"></div>' +
        '<div><h3>Preparing secure checkout</h3><p>Creating the hosted checkout interaction.</p></div>' +
        '</section>'
      );
    }

    if (step === 'email') {
      return (
        '<section class="browser-checkout__step">' +
        '<p class="browser-checkout__step-eyebrow">Sign in</p>' +
        '<h3>Enter your email address to access your payment wallet.</h3>' +
        '<p class="browser-checkout__step-copy">Use the same welcome entry point as the wallet experience while keeping the checkout surface merchant-branded.</p>' +
        '<div class="browser-checkout__divider"></div>' +
        '<form class="browser-checkout__form" data-form="email">' +
        '<label class="browser-checkout__field"><span>Email address</span>' +
        '<input type="email" data-email-input value="' + this.escapeAttribute(interaction && interaction.email ? interaction.email : this.launchRequest.interaction.email || '') + '" placeholder="you@example.com" /></label>' +
        '<button type="submit" class="browser-checkout__button">' +
        (this.state.loadingAction === 'send-otp' ? 'Sending code...' : 'Continue') +
        '</button></form></section>'
      );
    }

    if (step === 'otp') {
      return (
        '<section class="browser-checkout__step">' +
        '<p class="browser-checkout__step-eyebrow">Email verification</p>' +
        '<h3>We sent a one-time code to ' + this.escapeHtml(this.maskEmail(interaction && interaction.email ? interaction.email : '')) + '.</h3>' +
        '<p class="browser-checkout__step-copy">Verify the customer before showing saved payment methods from the hosted wallet interaction.</p>' +
        '<div class="browser-checkout__divider"></div>' +
        '<form class="browser-checkout__form" data-form="otp">' +
        this.renderOtpInput() +
        '<button type="submit" class="browser-checkout__button">' +
        (this.state.loadingAction === 'verify-otp' ? 'Verifying...' : 'Verify code') +
        '</button></form>' +
        '<div class="browser-checkout__actions">' +
        '<button type="button" class="browser-checkout__button browser-checkout__button--secondary" data-action="change-email">Use another email</button>' +
        '<button type="button" class="browser-checkout__button browser-checkout__button--secondary" data-action="resend-otp">Resend code</button>' +
        '</div></section>'
      );
    }

    if (step === 'source') {
      return (
        '<section class="browser-checkout__step">' +
        '<p class="browser-checkout__step-eyebrow">Saved payment methods</p>' +
        '<h3>Select a wallet source to complete checkout.</h3>' +
        '<p class="browser-checkout__step-copy">Sources are presented in your visual language while the SDK continues to call the hosted checkout APIs.</p>' +
        '<div class="browser-checkout__divider"></div>' +
        (availableSources.length
          ? '<div class="browser-checkout__sources">' + availableSources.map(this.renderSource.bind(this)).join('') + '</div>'
          : '<div class="browser-checkout__empty">No saved wallet sources were returned for this customer.</div>') +
        '</section>'
      );
    }

    if (step === 'review') {
      return (
        '<section class="browser-checkout__step">' +
        '<p class="browser-checkout__step-eyebrow">Review and pay</p>' +
        '<h3>Secure checkout is ready.</h3>' +
        '<p class="browser-checkout__step-copy">Review the attached source, confirm the amount, and submit the hosted payment.</p>' +
        '<div class="browser-checkout__divider"></div>' +
        (selectedSource
          ? '<div class="browser-checkout__review"><div class="browser-checkout__review-block"><p class="browser-checkout__summary-label">Payment source</p><strong>' +
            this.escapeHtml(this.sourceName(selectedSource)) + '</strong><span>' +
            this.escapeHtml(this.sourceValue(selectedSource)) +
            '</span></div><div class="browser-checkout__review-block"><p class="browser-checkout__summary-label">Amount</p><strong>' +
            this.escapeHtml(total) + '</strong></div></div>'
          : '') +
        '<div class="browser-checkout__actions">' +
        '<button type="button" class="browser-checkout__button browser-checkout__button--secondary" data-action="refresh">Refresh status</button>' +
        '<button type="button" class="browser-checkout__button" data-action="pay">' +
        (this.state.loadingAction === 'pay' ? 'Submitting payment...' : this.escapeHtml(this.launchRequest.payment.callToAction)) +
        '</button></div></section>'
      );
    }

    return (
      '<section class="browser-checkout__step browser-checkout__step--success">' +
      '<div class="browser-checkout__success-icon">&#10003;</div>' +
      '<p class="browser-checkout__step-eyebrow">Payment complete</p>' +
      '<h3>Hosted checkout finished successfully.</h3>' +
      '<p class="browser-checkout__step-copy">The SDK completed the session-controller payment flow and returned a finalized interaction.</p>' +
      '<div class="browser-checkout__review"><div class="browser-checkout__review-block"><p class="browser-checkout__summary-label">Interaction ID</p><strong>' +
      this.escapeHtml(interaction && interaction.interactionId ? interaction.interactionId : '') +
      '</strong></div><div class="browser-checkout__review-block"><p class="browser-checkout__summary-label">Status</p><strong>' +
      this.escapeHtml(this.labelStatus(interaction && interaction.status ? interaction.status : 'COMPLETED')) +
      '</strong></div></div></section>'
    );
  };

  HostedCheckoutFrameApp.prototype.renderOtpInput = function renderOtpInput() {
    return '<input class="browser-checkout__otp-input" data-otp-input inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000" />';
  };

  HostedCheckoutFrameApp.prototype.renderSource = function renderSource(source) {
    const selected =
      this.state.selectedSourceId === source.id ||
      (this.state.interaction &&
        this.state.interaction.selectedSource &&
        this.state.interaction.selectedSource.id === source.id);

    return (
      '<button type="button" class="browser-checkout__source ' + (selected ? 'is-selected' : '') +
      '" data-action="select-source" data-source-id="' + this.escapeAttribute(source.id || '') + '">' +
      '<span class="browser-checkout__source-icon">' + this.escapeHtml(this.sourceIcon(source)) + '</span>' +
      '<span class="browser-checkout__source-copy"><strong>' + this.escapeHtml(this.sourceName(source)) + '</strong><span>' +
      this.escapeHtml(this.sourceValue(source)) + '</span></span>' +
      '<span class="browser-checkout__chevron">&#8250;</span></button>'
    );
  };

  HostedCheckoutFrameApp.prototype.renderProgressStep = function renderProgressStep(index, label, active) {
    return (
      '<div class="browser-checkout__progress-step ' + (active ? 'is-active' : '') + '">' +
      '<span>' + index + '</span><label>' + label + '</label></div>'
    );
  };

  HostedCheckoutFrameApp.prototype.renderSparkline = function renderSparkline() {
    return ['h-35', 'h-55', 'h-45', 'h-70', 'h-60', 'h-80', 'is-highlight h-100', 'h-65']
      .map(function (name) {
        return '<span class="browser-checkout__sparkline-bar ' + name + '"></span>';
      })
      .join('');
  };

  HostedCheckoutFrameApp.prototype.renderMessage = function renderMessage(message, tone) {
    return '<div class="browser-checkout__message browser-checkout__message--' + tone + '">' +
      this.escapeHtml(message) + '</div>';
  };

  HostedCheckoutFrameApp.prototype.bindEvents = function bindEvents() {
    const self = this;

    const emailForm = this.root.querySelector('[data-form="email"]');
    if (emailForm) {
      emailForm.addEventListener('submit', function (event) {
        event.preventDefault();
        self.sendOtp();
      });
    }

    const otpForm = this.root.querySelector('[data-form="otp"]');
    if (otpForm) {
      otpForm.addEventListener('submit', function (event) {
        event.preventDefault();
        self.verifyOtp();
      });
    }

    this.root.querySelector('[data-action="close"]')?.addEventListener('click', function () {
      self.emit('closed', {});
      self.destroy();
    });

    this.root.querySelector('[data-action="change-email"]')?.addEventListener('click', function () {
      self.useAnotherEmail();
    });

    this.root.querySelector('[data-action="resend-otp"]')?.addEventListener('click', function () {
      self.sendOtp();
    });

    this.root.querySelector('[data-action="refresh"]')?.addEventListener('click', function () {
      self.refreshStatus();
    });

    this.root.querySelector('[data-action="pay"]')?.addEventListener('click', function () {
      self.completePayment();
    });

    this.root.querySelectorAll('[data-action="select-source"]').forEach(function (element) {
      element.addEventListener('click', function () {
        self.attachSource(element.getAttribute('data-source-id'));
      });
    });

    const otpInput = this.root.querySelector('[data-otp-input]');
    if (otpInput) {
      otpInput.addEventListener('input', function () {
        otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 6);
      });
    }
  };

  HostedCheckoutFrameApp.prototype.request = async function request(path, options) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.proxyTargetOrigin) {
      headers['x-demo-target-origin'] = this.proxyTargetOrigin;
    }

    const requestInit = {
      method: options.method,
      headers: headers,
    };

    if (options.rawBody) {
      requestInit.body = options.rawBody;
    } else if (options.body !== undefined && options.method !== 'GET') {
      requestInit.body = JSON.stringify(options.body);
    }

    const response = await this.window.fetch(this.apiBaseUrl + path, requestInit);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Request failed with ' + response.status);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    return response.json();
  };

  HostedCheckoutFrameApp.prototype.applyInteraction = function applyInteraction(interaction) {
    this.setState({
      interaction: interaction,
      selectedSourceId:
        interaction.selectedSource && interaction.selectedSource.id
          ? interaction.selectedSource.id
          : interaction.paymentSources && interaction.paymentSources.length === 1
            ? interaction.paymentSources[0].id
            : null,
      loadingAction: '',
      errorMessage: '',
    });
    this.emit('statusChanged', { status: interaction.status, interaction: interaction });
  };

  HostedCheckoutFrameApp.prototype.setState = function setState(partial) {
    this.state = Object.assign({}, this.state, partial);
    this.render();
  };

  HostedCheckoutFrameApp.prototype.handleError = function handleError(error, fallbackMessage) {
    const message = error instanceof Error && error.message ? error.message : fallbackMessage;
    this.setState({ errorMessage: message, loadingAction: '' });
    this.emit('failed', { message: message });
  };

  HostedCheckoutFrameApp.prototype.emit = function emit(type, detail) {
    this.onEvent({ type: type, detail: detail });
  };

  HostedCheckoutFrameApp.prototype.getCurrentStep = function getCurrentStep() {
    const status = this.state.interaction && this.state.interaction.status;
    if (!status || status === 'EMAIL_REQUESTED') return 'email';
    if (status === 'OTP_VALIDATION_PENDING' || status === 'OTP_VALIDATION_FAILED') return 'otp';
    if (status === 'PAYMENT_SOURCE_REQUESTED') return 'source';
    if (status === 'PAYMENT_SOURCE_ATTACHED') return 'review';
    return 'completed';
  };

  HostedCheckoutFrameApp.prototype.getStepIndex = function getStepIndex(status) {
    if (status === 'PAYMENT_SOURCE_REQUESTED') return 2;
    if (status === 'PAYMENT_SOURCE_ATTACHED' || status === 'COMPLETED') return 3;
    return 1;
  };

  HostedCheckoutFrameApp.prototype.getStatusTone = function getStatusTone(status) {
    if (status === 'COMPLETED') return 'success';
    if (status === 'OTP_VALIDATION_FAILED') return 'warn';
    return 'info';
  };

  HostedCheckoutFrameApp.prototype.getSelectedSource = function getSelectedSource() {
    const interaction = this.state.interaction;
    if (!interaction) return null;
    return (
      (interaction.paymentSources || []).find(function (source) {
        return source.id === this.state.selectedSourceId;
      }, this) || interaction.selectedSource || null
    );
  };

  HostedCheckoutFrameApp.prototype.getInputValue = function getInputValue(selector) {
    const element = this.root.querySelector(selector);
    return element ? element.value : '';
  };

  HostedCheckoutFrameApp.prototype.labelStatus = function labelStatus(status) {
    return String(status || '').replaceAll('_', ' ');
  };

  HostedCheckoutFrameApp.prototype.allowedTenderTypesLabel = function allowedTenderTypesLabel() {
    return (this.launchRequest.interaction.allowedTenderTypes || [])
      .map(function (type) {
        return SOURCE_LABELS[type] || type;
      })
      .join(' • ') || 'Wallet sources';
  };

  HostedCheckoutFrameApp.prototype.sourceName = function sourceName(source) {
    if (source.tenderType === 'BANK_ACCOUNT') return source.bankAccount && source.bankAccount.bankName || source.name || 'Bank account';
    if (source.tenderType === 'DYNAMIC_SESSION_CARD') return source.name || 'Dynamic session card';
    return source.card && source.card.network || source.name || 'Card';
  };

  HostedCheckoutFrameApp.prototype.sourceValue = function sourceValue(source) {
    if (source.tenderType === 'BANK_ACCOUNT') {
      return source.bankAccount && source.bankAccount.accountNumber
        ? '•••• ' + source.bankAccount.accountNumber.slice(-4)
        : 'Saved bank account';
    }
    if (source.tenderType === 'DYNAMIC_SESSION_CARD') return 'Single-use wallet source';
    return source.card && source.card.cardNumber ? '•••• ' + source.card.cardNumber.slice(-4) : 'Saved payment card';
  };

  HostedCheckoutFrameApp.prototype.sourceIcon = function sourceIcon(source) {
    if (source.tenderType === 'BANK_ACCOUNT') return '$';
    if (source.tenderType === 'DYNAMIC_SESSION_CARD') return '#';
    return 'C';
  };

  HostedCheckoutFrameApp.prototype.maskEmail = function maskEmail(email) {
    const parts = String(email).split('@');
    const name = parts[0];
    const domain = parts[1];
    if (!name || !domain) return email;
    const visible = name.length <= 2 ? name.slice(0, 1) : name.slice(0, 2);
    return visible + '*'.repeat(Math.max(1, name.length - visible.length)) + '@' + domain;
  };

  HostedCheckoutFrameApp.prototype.escapeHtml = function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  };

  HostedCheckoutFrameApp.prototype.escapeAttribute = HostedCheckoutFrameApp.prototype.escapeHtml;

  function CommerceHubConnectSdk(options) {
    this.containerId = options.containerId || '';
    this.apiBaseUrl = options.apiBaseUrl || '/api';
    this.proxyTargetOrigin = options.proxyTargetOrigin || '';
    this.launchRequest = options.launchRequest;
    this.branding = options.branding || {};
    this.onEvent = typeof options.onEvent === 'function' ? options.onEvent : function () {};
    this.iframe = null;
    this.frameApp = null;
    this.container = null;
  }

  CommerceHubConnectSdk.prototype.mount = function mount() {
    const selector = this.containerId ? '#' + this.escapeSelector(this.containerId) : '';
    const container = selector ? global.document.querySelector(selector) : null;
    if (!container) {
      throw new Error('Hosted checkout container div was not found for id "' + this.containerId + '".');
    }

    this.destroy();
    this.container = container;
    const iframe = global.document.createElement('iframe');
    iframe.setAttribute('title', 'CommerceHub Connect Hosted Checkout');
    iframe.setAttribute('scrolling', 'no');
    iframe.style.width = '100%';
    iframe.style.border = '0';
    iframe.style.display = 'block';
    iframe.style.background = 'transparent';
    iframe.style.minHeight = '760px';
    container.innerHTML = '';
    container.appendChild(iframe);
    this.iframe = iframe;

    const self = this;
    iframe.addEventListener('load', function handleLoad() {
      iframe.removeEventListener('load', handleLoad);
      self.initializeFrame();
    });
    iframe.src = 'about:blank';
  };

  CommerceHubConnectSdk.prototype.initializeFrame = function initializeFrame() {
    if (!this.iframe || !this.iframe.contentDocument || !this.iframe.contentWindow) {
      throw new Error('Unable to initialize hosted checkout iframe.');
    }

    const documentRef = this.iframe.contentDocument;
    documentRef.open();
    documentRef.write('<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>CommerceHub Connect Hosted Checkout</title><style>' + IFRAME_STYLE_TEXT + '</style></head><body><div id="ch-sdk-root"></div></body></html>');
    documentRef.close();

    const root = documentRef.getElementById('ch-sdk-root');
    const self = this;
    this.frameApp = new HostedCheckoutFrameApp({
      document: documentRef,
      window: this.iframe.contentWindow,
      root: root,
      apiBaseUrl: this.apiBaseUrl,
      proxyTargetOrigin: this.proxyTargetOrigin,
      launchRequest: this.launchRequest,
      branding: this.branding,
      onEvent: function (event) {
        self.onEvent(event);
      },
      notifyHeight: function () {
        self.syncHeight();
      },
    });
    this.frameApp.mount();
    this.syncHeight();
  };

  CommerceHubConnectSdk.prototype.syncHeight = function syncHeight() {
    if (!this.iframe || !this.iframe.contentDocument) {
      return;
    }

    global.requestAnimationFrame(() => {
      if (!this.iframe || !this.iframe.contentDocument) {
        return;
      }
      const doc = this.iframe.contentDocument;
      const height = Math.max(
        doc.documentElement ? doc.documentElement.scrollHeight : 0,
        doc.body ? doc.body.scrollHeight : 0,
        760,
      );
      this.iframe.style.height = height + 'px';
    });
  };

  CommerceHubConnectSdk.prototype.destroy = function destroy() {
    if (this.frameApp) {
      this.frameApp.destroy();
      this.frameApp = null;
    }
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    this.iframe = null;
  };

  CommerceHubConnectSdk.prototype.escapeSelector = function escapeSelector(value) {
    if (global.CSS && typeof global.CSS.escape === 'function') {
      return global.CSS.escape(value);
    }

    return String(value).replace(/([^a-zA-Z0-9_-])/g, '\\$1');
  };

  global.CommerceHubConnectSdk = CommerceHubConnectSdk;
  global.CommerceHubConnect = {
    HostedCheckoutSdk: CommerceHubConnectSdk,
  };
})(window);
