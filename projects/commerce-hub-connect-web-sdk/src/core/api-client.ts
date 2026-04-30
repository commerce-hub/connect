import type {
  Address,
  CustomerMaskType,
  InteractionResponse,
  OtpValidateRequest,
  PayByBankSessionResponse,
  PaymentSource,
  Profile,
  StringHolder,
} from '../contracts/api-models';

export class CommerceHubConnectApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'CommerceHubConnectApiError';
  }
}

export class CommerceHubConnectApiClient {
  private interactionId: string | null;

  constructor(private readonly baseUrl: string, interactionId?: string | null) {
    this.interactionId = this.normalizeInteractionId(interactionId);
  }

  setInteractionId(interactionId: string | null | undefined): void {
    this.interactionId = this.normalizeInteractionId(interactionId);
  }

  async getInteractionStatus(): Promise<InteractionResponse> {
    return this.request<InteractionResponse>('/interaction', { method: 'GET' });
  }

  async sendInteractionOtp(request: StringHolder): Promise<InteractionResponse> {
    return this.request<InteractionResponse>('/interaction/otp/send', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async sendInteractionOtpToEmail(request: StringHolder): Promise<InteractionResponse> {
    return this.request<InteractionResponse>('/interaction/otp/send/email', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async validateInteractionOtp(request: OtpValidateRequest): Promise<InteractionResponse> {
    return this.request<InteractionResponse>('/interaction/otp/validate', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async attachPaymentMethod(paymentSourceId: string): Promise<InteractionResponse> {
    return this.request<InteractionResponse>(
      `/interaction/payment-source/${encodeURIComponent(paymentSourceId)}/attach`,
      {
        method: 'POST',
        body: '{}',
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  async addSource(source: PaymentSource): Promise<string | { id?: string; sourceId?: string; paymentSourceId?: string } | unknown> {
    return this.request('/customer/source', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(source),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain' },
    });
  }

  async getCustomerProfile(): Promise<Profile> {
    return this.request<Profile>('/customer', {
      method: 'GET',
      credentials: 'include',
    });
  }

  async addBillingAddress(address: Address): Promise<void> {
    await this.request<void>('/customer/billing-address', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(address),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async mask(type: CustomerMaskType, request: StringHolder): Promise<StringHolder> {
    return this.request<StringHolder>(`/customer/mask/${encodeURIComponent(type)}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async createPayByBankSession(): Promise<PayByBankSessionResponse> {
    return this.request<PayByBankSessionResponse>('/pbb/session', {
      method: 'GET',
      credentials: 'include',
    });
  }

  async finalizePayByBankSession(aldSessionId: string, pToken: string): Promise<void> {
    await this.request<void>(
      `/pbb/session/${encodeURIComponent(aldSessionId)}/${encodeURIComponent(pToken)}`,
      {
        method: 'PUT',
        credentials: 'include',
      },
    );
  }

  private async request<T>(path: string, init: RequestInit, responseMode?: 'json' | 'text'): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: this.buildHeaders(path, init.headers),
    });

    const contentType = response.headers.get('content-type') ?? '';
    const shouldParseJson = responseMode === 'json' || (!responseMode && contentType.includes('application/json'));

    const body = response.status === 204
      ? undefined
      : shouldParseJson
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      const message =
        typeof body === 'string'
          ? body || response.statusText
          : body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
            ? body.message
            : response.statusText || 'Request failed.';
      throw new CommerceHubConnectApiError(message, response.status, body);
    }

    return body as T;
  }

  private buildHeaders(path: string, initHeaders?: HeadersInit): Headers {
    const headers = new Headers(initHeaders);
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    if (this.interactionId && this.isInteractionPath(path)) {
      headers.set('x-interaction-id', this.interactionId);
    }

    return headers;
  }

  private isInteractionPath(path: string): boolean {
    return path === '/interaction' || path.startsWith('/interaction/');
  }

  private normalizeInteractionId(interactionId?: string | null): string | null {
    const normalized = interactionId?.trim();
    return normalized ? normalized : null;
  }
}
