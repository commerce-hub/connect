import type {
  CommerceHubSdkConfiguration,
  CommerceHubWhiteLabelOptions,
} from 'commerce-hub-connect-sdk';

export interface CommerceHubConnectWebSdkMountOptions {
  configuration: CommerceHubSdkConfiguration;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  apiBaseUrl?: string;
  replaceContents?: boolean;
}

export interface CommerceHubConnectWebSdkInstance {
  readonly containerElement: Element;
  readonly hostElement: HTMLElement;
  update(options: CommerceHubConnectWebSdkMountOptions): void;
  destroy(): void;
}

export interface CommerceHubConnectWebSdkElementOptions
  extends Omit<CommerceHubConnectWebSdkMountOptions, 'replaceContents'> {}

export interface CommerceHubConnectWebSdkNamespace {
  readonly version: string;
  readonly tagName: string;
  mount(
    target: string | Element,
    options: CommerceHubConnectWebSdkMountOptions,
  ): Promise<CommerceHubConnectWebSdkInstance>;
  createElement(options?: CommerceHubConnectWebSdkElementOptions): CommerceHubConnectWidgetElement;
}

export class CommerceHubConnectWidgetElement extends HTMLElement {
  configuration: CommerceHubSdkConfiguration | null;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  apiBaseUrl?: string;
}

declare global {
  interface Window {
    CommerceHubConnectWebSdk: CommerceHubConnectWebSdkNamespace;
  }

  interface HTMLElementTagNameMap {
    'commerce-hub-connect-widget': CommerceHubConnectWidgetElement;
  }
}

export {};
