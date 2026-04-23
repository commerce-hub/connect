import type {
  CommerceHubSdkConfiguration,
  CommerceHubSdkError,
  CommerceHubSuccessResult,
  CommerceHubWhiteLabelOptions,
} from 'commerce-hub-connect-sdk';

export type CommerceHubConnectWebSdkConfiguration = Omit<
  CommerceHubSdkConfiguration,
  'onSuccess' | 'onError'
> & {
  onSuccess?: CommerceHubSdkConfiguration['onSuccess'];
  onError?: CommerceHubSdkConfiguration['onError'];
};

export interface CommerceHubConnectWebSdkElementOptions {
  configuration?: CommerceHubConnectWebSdkConfiguration | null;
  configurationJson?: string;
  whiteLabel?: CommerceHubWhiteLabelOptions | null;
  whiteLabelJson?: string;
  apiBaseUrl?: string;
}

export interface CommerceHubConnectWebSdkMountOptions extends CommerceHubConnectWebSdkElementOptions {
  replaceContents?: boolean;
}

export interface CommerceHubConnectWebSdkNamespace {
  readonly version: string;
  readonly tagName: string;
  define(): Promise<void>;
  createElement(
    options?: CommerceHubConnectWebSdkElementOptions,
  ): Promise<CommerceHubConnectWidgetElement>;
  mount(
    target: string | Element,
    options?: CommerceHubConnectWebSdkMountOptions,
  ): Promise<CommerceHubConnectWidgetElement>;
}

export class CommerceHubConnectWidgetElement extends HTMLElement {
  configuration: CommerceHubConnectWebSdkConfiguration | null;
  configurationJson?: string;
  whiteLabel?: CommerceHubWhiteLabelOptions | null;
  whiteLabelJson?: string;
  apiBaseUrl?: string;
}

export interface CommerceHubConnectSuccessEvent extends CustomEvent<CommerceHubSuccessResult> {}
export interface CommerceHubConnectErrorEvent extends CustomEvent<CommerceHubSdkError> {}

declare global {
  interface Window {
    CommerceHubConnectWebSdk: CommerceHubConnectWebSdkNamespace;
  }

  interface HTMLElementTagNameMap {
    'commerce-hub-connect-widget': CommerceHubConnectWidgetElement;
  }
}

export {};
