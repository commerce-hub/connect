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

export class StaleInteractionRefreshError extends Error {
  constructor(interactionId: string) {
    super(`Interaction refresh for ${interactionId} became stale.`);
    this.name = 'StaleInteractionRefreshError';
  }
}

export class InteractionRefreshController implements ReactiveController {
  private snapshotInteractionId?: string;
  private refreshInteractionId?: string;
  private refreshPromise?: Promise<InteractionResponse>;
  private refreshErrorMessage?: string;
  private generation = 0;

  constructor(private readonly host: ReactiveControllerHost) {
    host.addController(this);
  }

  hostConnected() {}

  get errorMessage(): string | undefined {
    return this.refreshErrorMessage;
  }

  reset({requestUpdate = true}: {requestUpdate?: boolean} = {}) {
    this.generation += 1;
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

    const generation = this.generation;
    const refreshPromise = options
      .requestInteraction(interactionId)
      .then((interactionResponse) => {
        if (
          generation !== this.generation ||
          options.getCurrentInteractionResponse()?.interactionId !==
            interactionId
        ) {
          throw new StaleInteractionRefreshError(interactionId);
        }

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
        if (
          generation !== this.generation ||
          options.getCurrentInteractionResponse()?.interactionId !==
            interactionId
        ) {
          throw new StaleInteractionRefreshError(interactionId);
        }

        if (
          !(cause instanceof StaleInteractionRefreshError) &&
          this.snapshotInteractionId !== interactionId
        ) {
          this.refreshErrorMessage =
            "We couldn't load payment methods. Try again.";
          this.host.requestUpdate();
        }

        throw cause;
      })
      .finally(() => {
        if (
          generation === this.generation &&
          this.refreshPromise === refreshPromise
        ) {
          this.refreshPromise = undefined;
          this.refreshInteractionId = undefined;
          this.host.requestUpdate();
        }
      });

    this.refreshPromise = refreshPromise;

    return refreshPromise;
  }

  async fetchFresh(
    interactionId: string,
    options: InteractionRefreshOptions
  ): Promise<InteractionResponse> {
    const generation = this.generation;

    this.assertCurrentRefresh(generation, interactionId, options);

    const inFlightRefresh =
      this.refreshInteractionId === interactionId
        ? this.refreshPromise
        : undefined;

    if (inFlightRefresh) {
      try {
        await inFlightRefresh;
      } catch (cause) {
        void cause;
      }
    }

    this.assertCurrentRefresh(generation, interactionId, options);

    return this.fetch(interactionId, options);
  }

  private assertCurrentRefresh(
    generation: number,
    interactionId: string,
    options: InteractionRefreshOptions
  ) {
    if (
      generation !== this.generation ||
      options.getCurrentInteractionResponse()?.interactionId !== interactionId
    ) {
      throw new StaleInteractionRefreshError(interactionId);
    }
  }
}
