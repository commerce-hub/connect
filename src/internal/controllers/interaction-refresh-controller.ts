import type {ReactiveController, ReactiveControllerHost} from 'lit';

import type {InteractionResponse, PaymentSource} from '../types.js';

interface InteractionRefreshOptions {
  getCurrentInteractionResponse: () => InteractionResponse | undefined;
  getSelectedPaymentSourceId: () => string | undefined;
  requestInteraction: (interactionId: string) => Promise<InteractionResponse>;
  mergeInteractionResponse: (
    current: InteractionResponse,
    response: InteractionResponse,
    preferredPaymentSourceId?: string
  ) => InteractionResponse;
  setInteractionResponse: (interactionResponse: InteractionResponse) => void;
  emitListPaymentMethods: (paymentSources: PaymentSource[]) => void;
}

export class InteractionRefreshController implements ReactiveController {
  private snapshotInteractionId?: string;
  private refreshInteractionId?: string;
  private refreshPromise?: Promise<InteractionResponse>;
  private refreshErrorMessage?: string;

  constructor(private readonly host: ReactiveControllerHost) {
    host.addController(this);
  }

  hostConnected() {}

  get errorMessage(): string | undefined {
    return this.refreshErrorMessage;
  }

  reset({requestUpdate = true}: {requestUpdate?: boolean} = {}) {
    this.snapshotInteractionId = undefined;
    this.refreshInteractionId = undefined;
    this.refreshPromise = undefined;
    this.refreshErrorMessage = undefined;

    if (requestUpdate) {
      this.host.requestUpdate();
    }
  }

  shouldRefresh(interactionResponse?: InteractionResponse): boolean {
    const interactionId = interactionResponse?.interactionId;

    if (!interactionId) {
      return false;
    }

    if (this.snapshotInteractionId === interactionId) {
      return false;
    }

    return true;
  }

  shouldRenderSkeleton(interactionResponse?: InteractionResponse): boolean {
    const interactionId = interactionResponse?.interactionId;

    if (!interactionId) {
      return false;
    }

    if (this.refreshPromise && this.refreshInteractionId === interactionId) {
      return true;
    }

    return !this.refreshErrorMessage && this.shouldRefresh(interactionResponse);
  }

  shouldRenderError(interactionResponse?: InteractionResponse): boolean {
    const interactionId = interactionResponse?.interactionId;

    return Boolean(
      interactionId &&
        this.refreshErrorMessage &&
        this.snapshotInteractionId !== interactionId
    );
  }

  async refreshFromInteraction(options: InteractionRefreshOptions) {
    const interactionId =
      options.getCurrentInteractionResponse()?.interactionId;

    if (
      !interactionId ||
      !this.shouldRefresh(options.getCurrentInteractionResponse())
    ) {
      return;
    }

    try {
      await this.fetch(interactionId, options);
    } catch (cause) {
      void cause;
    }
  }

  fetch(
    interactionId: string,
    options: InteractionRefreshOptions
  ): Promise<InteractionResponse> {
    if (this.refreshInteractionId === interactionId && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshInteractionId = interactionId;
    this.refreshErrorMessage = undefined;
    this.host.requestUpdate();

    this.refreshPromise = options
      .requestInteraction(interactionId)
      .then((interactionResponse) => {
        const refreshedInteractionResponse = options.mergeInteractionResponse(
          options.getCurrentInteractionResponse() ?? {interactionId},
          interactionResponse,
          options.getSelectedPaymentSourceId()
        );

        this.snapshotInteractionId = interactionId;
        options.setInteractionResponse(refreshedInteractionResponse);
        options.emitListPaymentMethods(
          refreshedInteractionResponse.paymentSources ?? []
        );

        return refreshedInteractionResponse;
      })
      .catch((cause) => {
        if (this.snapshotInteractionId !== interactionId) {
          this.refreshErrorMessage =
            "We couldn't load payment methods. Try again.";
          this.host.requestUpdate();
        }

        throw cause;
      })
      .finally(() => {
        this.refreshPromise = undefined;
        this.refreshInteractionId = undefined;
        this.host.requestUpdate();
      });

    return this.refreshPromise;
  }
}
