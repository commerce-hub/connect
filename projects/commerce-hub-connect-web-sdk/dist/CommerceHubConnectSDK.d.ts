import type {
  CommerceHubConnectEnvironment,
  CommerceHubSdkConfiguration,
  InteractionResponse,
  CommerceHubWhiteLabelOptions,
} from 'commerce-hub-connect-sdk';

export interface CommerceHubConnectWebSdkMountOptions {
  interaction: InteractionResponse;
  configuration: CommerceHubSdkConfiguration;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  replaceContents?: boolean;
}

export interface CommerceHubConnectWebSdkElementOptions
  extends Omit<CommerceHubConnectWebSdkMountOptions, 'replaceContents'> {
  environment?: CommerceHubConnectEnvironment;
}

export interface CommerceHubConnectWebSdkInstance {
  readonly containerElement: Element;
  readonly hostElement: HTMLElement;
  update(
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): void;
  destroy(): void;
}

export interface CommerceHubConnectWebSdkNamespace {
  readonly version: string;
  readonly tagName: string;
  resolveApiBaseUrl(environment?: CommerceHubConnectEnvironment): string;
  mount(
    target: string | Element,
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): Promise<CommerceHubConnectWebSdkInstance>;
  createElement(
    options?: CommerceHubConnectWebSdkElementOptions,
    environment?: CommerceHubConnectEnvironment,
  ): CommerceHubConnectWidgetElement;
}

export class CommerceHubConnectWidgetElement extends HTMLElement {
  interaction: InteractionResponse | null;
  configuration: CommerceHubSdkConfiguration | null;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  environment?: CommerceHubConnectEnvironment;
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
