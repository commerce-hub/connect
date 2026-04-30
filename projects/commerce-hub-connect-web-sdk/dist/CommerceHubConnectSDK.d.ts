import type { CommerceHubConnectEnvironment } from './contracts/environment';
import type { CommerceHubSdkConfiguration, CommerceHubWhiteLabelOptions } from './contracts/sdk-models';
import type { InteractionResponse } from './contracts/api-models';
import type { CommerceHubConnectWebSdkElementOptions, CommerceHubConnectWebSdkMountOptions } from './web-sdk-types';
declare global {
    var __commerceHubConnectWebSdkInlineCss: string | undefined;
    interface Window {
        CommerceHubConnectWebSdk?: CommerceHubConnectWebSdkNamespace;
    }
    interface HTMLElementTagNameMap {
        'commerce-hub-connect-widget': CommerceHubConnectWidgetElement;
    }
}
export interface CommerceHubConnectWebSdkInstance {
    readonly containerElement: Element;
    readonly hostElement: HTMLElement;
    update(options: CommerceHubConnectWebSdkMountOptions, environment?: CommerceHubConnectEnvironment): Promise<void>;
    destroy(): void;
}
export interface CommerceHubConnectWebSdkNamespace {
    readonly version: string;
    readonly tagName: string;
    resolveApiBaseUrl(environment?: CommerceHubConnectEnvironment): string;
    mount(target: string | Element, options: CommerceHubConnectWebSdkMountOptions, environment?: CommerceHubConnectEnvironment): Promise<CommerceHubConnectWebSdkInstance>;
    createElement(options?: CommerceHubConnectWebSdkElementOptions, environment?: CommerceHubConnectEnvironment): CommerceHubConnectWidgetElement;
}
export declare class MountedWidget implements CommerceHubConnectWebSdkInstance {
    readonly containerElement: Element;
    readonly hostElement: HTMLElement;
    private readonly runtimeOrigin;
    private environment;
    private readonly controller;
    private readonly renderer;
    constructor(containerElement: Element, hostElement: HTMLElement, runtimeOrigin: string | undefined, options: CommerceHubConnectWebSdkMountOptions, environment: CommerceHubConnectEnvironment);
    update(options: CommerceHubConnectWebSdkMountOptions, environment?: CommerceHubConnectEnvironment): Promise<void>;
    destroy(): void;
}
export declare class CommerceHubConnectWidgetElement extends HTMLElement {
    private readonly mountRoot;
    private instance;
    private interactionValue;
    private configurationValue;
    private whiteLabelValue?;
    private environmentValue?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get configuration(): CommerceHubSdkConfiguration | null;
    set configuration(value: CommerceHubSdkConfiguration | null);
    get interaction(): InteractionResponse | null;
    set interaction(value: InteractionResponse | null);
    get whiteLabel(): CommerceHubWhiteLabelOptions | undefined;
    set whiteLabel(value: CommerceHubWhiteLabelOptions | undefined);
    get environment(): CommerceHubConnectEnvironment | undefined;
    set environment(value: CommerceHubConnectEnvironment | undefined);
    private renderWidget;
}
export declare function registerCommerceHubConnectWebSdk(): Promise<CommerceHubConnectWebSdkNamespace>;
export declare function resolveApiBaseUrl(environment?: CommerceHubConnectEnvironment, doc?: Document): string;
export declare function mount(target: string | Element, options: CommerceHubConnectWebSdkMountOptions, environment?: CommerceHubConnectEnvironment): Promise<CommerceHubConnectWebSdkInstance>;
export type { CommerceHubConnectEnvironment, InteractionResponse, CommerceHubSdkConfiguration, CommerceHubWhiteLabelOptions, };
export * from './contracts/api-models';
export * from './contracts/environment';
export * from './contracts/sdk-models';
export * from './web-sdk-types';
