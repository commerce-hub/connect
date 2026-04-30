import type { CommerceHubConnectEnvironment } from './contracts/environment';
import {
  normalizeCommerceHubConnectEnvironment,
  resolveCommerceHubConnectApiBaseUrl,
} from './contracts/environment';
import type {
  CommerceHubSdkConfiguration,
  CommerceHubWhiteLabelOptions,
} from './contracts/sdk-models';
import type { InteractionResponse } from './contracts/api-models';
import { CommerceHubConnectWidgetController } from './core/controller';
import { CommerceHubConnectWidgetRenderer } from './ui/widget-renderer';
import type {
  CommerceHubConnectWebSdkElementOptions,
  CommerceHubConnectWebSdkMountOptions,
} from './web-sdk-types';
import { resolveMountTarget, resolveSdkRuntimeOrigin, validateMountRequest } from './web-sdk-utils';

const SDK_VERSION = '0.0.1';
const SDK_TAG_NAME = 'commerce-hub-connect-widget';

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
  update(
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): Promise<void>;
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

const mountedWidgets = new WeakMap<Element, MountedWidget>();
let stylesheetPromise: Promise<void> | null = null;

export class MountedWidget implements CommerceHubConnectWebSdkInstance {
  private readonly controller: CommerceHubConnectWidgetController;
  private readonly renderer: CommerceHubConnectWidgetRenderer;

  constructor(
    readonly containerElement: Element,
    readonly hostElement: HTMLElement,
    private readonly runtimeOrigin: string | undefined,
    options: CommerceHubConnectWebSdkMountOptions,
    private environment: CommerceHubConnectEnvironment,
  ) {
    const apiBaseUrl = resolveMountedWidgetApiBaseUrl(environment, this.runtimeOrigin);
    this.controller = new CommerceHubConnectWidgetController(
      options.interaction,
      options.configuration,
      options.whiteLabel,
      environment,
      apiBaseUrl,
    );
    this.renderer = new CommerceHubConnectWidgetRenderer(hostElement, this.controller);
  }

  async update(
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): Promise<void> {
    validateMountRequest(options, environment);

    const nextEnvironment = normalizeCommerceHubConnectEnvironment(environment);
    const nextApiBaseUrl = resolveMountedWidgetApiBaseUrl(nextEnvironment, this.runtimeOrigin);

    if (nextApiBaseUrl !== resolveMountedWidgetApiBaseUrl(this.environment, this.runtimeOrigin)) {
      throw new Error(
        'Changing environment after mount is not supported when it resolves to a different API URL.',
      );
    }

    this.environment = nextEnvironment;
    await this.controller.update(
      options.interaction,
      options.configuration,
      options.whiteLabel,
      nextEnvironment,
      nextApiBaseUrl,
    );
  }

  destroy(): void {
    if (mountedWidgets.get(this.containerElement) === this) {
      mountedWidgets.delete(this.containerElement);
    }

    this.renderer.destroy();
    this.controller.destroy();
    this.hostElement.remove();
  }
}

export class CommerceHubConnectWidgetElement extends HTMLElement {
  private readonly mountRoot = document.createElement('div');
  private instance: CommerceHubConnectWebSdkInstance | null = null;
  private interactionValue: InteractionResponse | null = null;
  private configurationValue: CommerceHubSdkConfiguration | null = null;
  private whiteLabelValue?: CommerceHubWhiteLabelOptions;
  private environmentValue?: CommerceHubConnectEnvironment;

  connectedCallback(): void {
    if (!this.mountRoot.isConnected) {
      this.mountRoot.className = 'commerce-hub-connect-web-sdk-mount';
      this.replaceChildren(this.mountRoot);
    }

    void this.renderWidget();
  }

  disconnectedCallback(): void {
    this.instance?.destroy();
    this.instance = null;
  }

  get configuration(): CommerceHubSdkConfiguration | null {
    return this.configurationValue;
  }

  set configuration(value: CommerceHubSdkConfiguration | null) {
    this.configurationValue = value;
    void this.renderWidget();
  }

  get interaction(): InteractionResponse | null {
    return this.interactionValue;
  }

  set interaction(value: InteractionResponse | null) {
    this.interactionValue = value;
    void this.renderWidget();
  }

  get whiteLabel(): CommerceHubWhiteLabelOptions | undefined {
    return this.whiteLabelValue;
  }

  set whiteLabel(value: CommerceHubWhiteLabelOptions | undefined) {
    this.whiteLabelValue = value;
    void this.renderWidget();
  }

  get environment(): CommerceHubConnectEnvironment | undefined {
    return this.environmentValue;
  }

  set environment(value: CommerceHubConnectEnvironment | undefined) {
    this.environmentValue = value ? normalizeCommerceHubConnectEnvironment(value) : undefined;
    void this.renderWidget();
  }

  private async renderWidget(): Promise<void> {
    if (!this.isConnected || !this.configurationValue || !this.interactionValue) {
      return;
    }

    const options: CommerceHubConnectWebSdkMountOptions = {
      interaction: this.interactionValue,
      configuration: this.configurationValue,
      whiteLabel: this.whiteLabelValue,
      replaceContents: true,
    };

    if (!this.instance) {
      this.instance = await mount(this.mountRoot, options, this.environmentValue);
      return;
    }

    await this.instance.update(options, this.environmentValue);
  }
}

export async function registerCommerceHubConnectWebSdk(): Promise<CommerceHubConnectWebSdkNamespace> {
  ensureCustomElementRegistered();

  const namespace: CommerceHubConnectWebSdkNamespace = {
    version: SDK_VERSION,
    tagName: SDK_TAG_NAME,
    resolveApiBaseUrl,
    mount,
    createElement: (options?: CommerceHubConnectWebSdkElementOptions, environment?) => {
      const element = document.createElement(SDK_TAG_NAME) as CommerceHubConnectWidgetElement;

      if (options?.interaction) {
        element.interaction = options.interaction;
      }

      if (options?.configuration) {
        element.configuration = options.configuration;
      }

      if (options?.whiteLabel) {
        element.whiteLabel = options.whiteLabel;
      }

      element.environment = environment ?? options?.environment;
      return element;
    },
  };

  window.CommerceHubConnectWebSdk = namespace;
  return namespace;
}

export function resolveApiBaseUrl(
  environment?: CommerceHubConnectEnvironment,
  doc: Document = document,
): string {
  const runtimeOrigin = resolveSdkRuntimeOrigin(doc);
  const normalizedEnvironment = normalizeCommerceHubConnectEnvironment(environment);

  return resolveCommerceHubConnectApiBaseUrl(normalizedEnvironment, runtimeOrigin);
}

function resolveMountedWidgetApiBaseUrl(
  environment: CommerceHubConnectEnvironment,
  runtimeOrigin: string | undefined,
): string {
  return resolveCommerceHubConnectApiBaseUrl(environment, runtimeOrigin);
}

export async function mount(
  target: string | Element,
  options: CommerceHubConnectWebSdkMountOptions,
  environment?: CommerceHubConnectEnvironment,
): Promise<CommerceHubConnectWebSdkInstance> {
  validateMountRequest(options, environment);
  await ensureStylesheet();

  const containerElement = resolveMountTarget(target);
  const existing = mountedWidgets.get(containerElement);

  if (existing) {
    existing.destroy();
  }

  if (options.replaceContents !== false) {
    containerElement.replaceChildren();
  }

  const hostElement = document.createElement('div');
  hostElement.className = 'commerce-hub-connect-web-sdk-mount';
  containerElement.appendChild(hostElement);

  const normalizedEnvironment = normalizeCommerceHubConnectEnvironment(environment);
  const runtimeOrigin = resolveSdkRuntimeOrigin(document);

  try {
    const instance = new MountedWidget(
      containerElement,
      hostElement,
      runtimeOrigin,
      options,
      normalizedEnvironment,
    );
    mountedWidgets.set(containerElement, instance);
    return instance;
  } catch (error) {
    hostElement.remove();
    throw error;
  }
}

function ensureCustomElementRegistered(): void {
  if (!customElements.get(SDK_TAG_NAME)) {
    customElements.define(SDK_TAG_NAME, CommerceHubConnectWidgetElement);
  }
}

async function ensureStylesheet(): Promise<void> {
  if (stylesheetPromise) {
    return stylesheetPromise;
  }

  const existing = document.head.querySelector<HTMLElement>(
    '[data-commerce-hub-connect-web-sdk-style="true"]',
  );

  if (existing) {
    stylesheetPromise = Promise.resolve();
    return stylesheetPromise;
  }

  const inlineCss = globalThis.__commerceHubConnectWebSdkInlineCss?.trim();
  if (!inlineCss) {
    stylesheetPromise = Promise.resolve();
    return stylesheetPromise;
  }

  const styleElement = document.createElement('style');
  styleElement.dataset['commerceHubConnectWebSdkStyle'] = 'true';
  styleElement.textContent = inlineCss;
  document.head.appendChild(styleElement);

  stylesheetPromise = Promise.resolve();
  return stylesheetPromise;
}

export type {
  CommerceHubConnectEnvironment,
  InteractionResponse,
  CommerceHubSdkConfiguration,
  CommerceHubWhiteLabelOptions,
};
export * from './contracts/api-models';
export * from './contracts/environment';
export * from './contracts/sdk-models';
export * from './web-sdk-types';
