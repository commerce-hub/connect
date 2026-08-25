import type {ReactiveController, ReactiveControllerHost} from 'lit';

import type {
  InteractionResponse,
  NativeAccountBalanceMap,
  NativePaymentSource,
  PaymentSource,
} from '../types.js';

type NativeBalanceFetcher = (
  interactionId: string
) => Promise<NativeAccountBalanceMap>;

export class NativeBalanceController implements ReactiveController {
  private fetchKey?: string;
  private queuedFetchKey?: string;
  private balanceMap: NativeAccountBalanceMap = {};
  private loadingIds: readonly string[] = [];

  constructor(private readonly host: ReactiveControllerHost) {
    host.addController(this);
  }

  hostConnected() {}

  get balances(): NativeAccountBalanceMap {
    return this.balanceMap;
  }

  get loadingSourceIds(): readonly string[] {
    return this.loadingIds;
  }

  reset({requestUpdate = true}: {requestUpdate?: boolean} = {}) {
    this.fetchKey = undefined;
    this.queuedFetchKey = undefined;
    this.balanceMap = {};
    this.loadingIds = [];

    if (requestUpdate) {
      this.host.requestUpdate();
    }
  }

  queueRefresh(
    getInteractionResponse: () => InteractionResponse | undefined,
    fetchBalances: NativeBalanceFetcher
  ) {
    const interactionResponse = getInteractionResponse();
    const interactionId = interactionResponse?.interactionId;
    const nativeSources =
      nativePaymentSourcesFromInteractionResponse(interactionResponse);

    if (!interactionId || nativeSources.length === 0) {
      const shouldClearBalanceState =
        this.fetchKey !== undefined ||
        this.queuedFetchKey !== undefined ||
        Object.keys(this.balanceMap).length > 0 ||
        this.loadingIds.length > 0;

      this.queuedFetchKey = undefined;

      if (!shouldClearBalanceState) {
        return;
      }

      queueMicrotask(() => {
        const currentNativeSources =
          nativePaymentSourcesFromInteractionResponse(getInteractionResponse());

        if (currentNativeSources.length === 0) {
          this.fetchKey = undefined;
          this.balanceMap = {};
          this.loadingIds = [];
          this.host.requestUpdate();
        }
      });
      return;
    }

    const nextFetchKey = nativeBalanceFetchKey(interactionId, nativeSources);

    if (
      this.fetchKey === nextFetchKey ||
      this.queuedFetchKey === nextFetchKey
    ) {
      return;
    }

    this.queuedFetchKey = nextFetchKey;

    queueMicrotask(() => {
      if (this.queuedFetchKey !== nextFetchKey) {
        return;
      }

      this.queuedFetchKey = undefined;

      const currentInteractionResponse = getInteractionResponse();
      const currentInteractionId = currentInteractionResponse?.interactionId;
      const currentNativeSources = nativePaymentSourcesFromInteractionResponse(
        currentInteractionResponse
      );

      if (
        !currentInteractionId ||
        currentNativeSources.length === 0 ||
        nativeBalanceFetchKey(currentInteractionId, currentNativeSources) !==
          nextFetchKey
      ) {
        return;
      }

      void this.refresh(getInteractionResponse, fetchBalances);
    });
  }

  async refresh(
    getInteractionResponse: () => InteractionResponse | undefined,
    fetchBalances: NativeBalanceFetcher
  ) {
    const interactionResponse = getInteractionResponse();
    const interactionId = interactionResponse?.interactionId;
    const nativeSources =
      nativePaymentSourcesFromInteractionResponse(interactionResponse);

    if (!interactionId || nativeSources.length === 0) {
      this.reset();
      return;
    }

    const nextFetchKey = nativeBalanceFetchKey(interactionId, nativeSources);

    if (this.fetchKey === nextFetchKey) {
      return;
    }

    this.fetchKey = nextFetchKey;
    this.balanceMap = {};
    this.loadingIds = nativeSources.map(paymentSourceId);
    this.host.requestUpdate();

    try {
      const balances = await fetchBalances(interactionId);

      if (this.fetchKey !== nextFetchKey) {
        return;
      }

      this.balanceMap = balances;
      this.host.requestUpdate();
    } catch (cause) {
      void cause;

      if (this.fetchKey === nextFetchKey) {
        this.balanceMap = {};
        this.host.requestUpdate();
      }
    } finally {
      if (this.fetchKey === nextFetchKey) {
        this.loadingIds = [];
        this.host.requestUpdate();
      }
    }
  }
}

const nativePaymentSourcesFromInteractionResponse = (
  interactionResponse?: InteractionResponse
): NativePaymentSource[] =>
  (interactionResponse?.paymentSources ?? []).filter(isNativePaymentSource);

const nativeBalanceFetchKey = (
  interactionId: string,
  sources: NativePaymentSource[]
): string =>
  `${interactionId}:${sources
    .map((source) => nativeAccountBalanceMatchKeys(source).join(','))
    .join('|')}`;

const nativeAccountBalanceMatchKeys = (source: NativePaymentSource): string[] =>
  [source.id, source.account?.positionId, source.account?.token]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

const paymentSourceId = (source: PaymentSource): string =>
  source.id?.trim() || source.name?.trim() || source.tenderType;

const isNativePaymentSource = (
  source: PaymentSource
): source is NativePaymentSource =>
  source.productCode?.trim().toUpperCase() === 'EMFIWALLET' ||
  source.tenderType === 'NativeAccount' ||
  (source.tenderType as string) === 'NATIVE_ACCOUNT';
