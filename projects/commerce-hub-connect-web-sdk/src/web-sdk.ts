import { provideHttpClient } from '@angular/common/http';
import {
  type ApplicationConfig,
  type ApplicationRef,
  type ComponentRef,
  Injector,
  createComponent,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {
  COMMERCE_HUB_CONNECT_API_BASE_URL,
  type CommerceHubConnectEnvironment,
  CommerceHubConnectCaptureComponent,
  type CommerceHubSdkConfiguration,
  type InteractionResponse,
  type CommerceHubWhiteLabelOptions,
  normalizeCommerceHubConnectEnvironment,
  provideCommerceHubSdkTheme,
  resolveCommerceHubConnectApiBaseUrl,
} from 'commerce-hub-connect-sdk';

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
  ): void;
  destroy(): void;
}

export interface CommerceHubConnectWebSdkNamespace {
  readonly version: string;
  readonly tagName: string;
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

const applicationConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideCommerceHubSdkTheme(),
  ],
};

const mountedWidgets = new WeakMap<Element, MountedWidget>();

let applicationRefPromise: Promise<ApplicationRef> | null = null;
let stylesheetPromise: Promise<void> | null = null;

class MountedWidget implements CommerceHubConnectWebSdkInstance {
  constructor(
    private readonly applicationRef: ApplicationRef,
    private readonly componentRef: ComponentRef<CommerceHubConnectCaptureComponent>,
    readonly containerElement: Element,
    readonly hostElement: HTMLElement,
    private readonly runtimeOrigin: string | undefined,
    private readonly apiBaseUrl: string,
  ) {}

  update(
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): void {
    validateMountRequest(options, environment);

    const nextEnvironment = normalizeCommerceHubConnectEnvironment(environment);
    const nextApiBaseUrl = resolveCommerceHubConnectApiBaseUrl(nextEnvironment, this.runtimeOrigin);

    if (nextApiBaseUrl !== this.apiBaseUrl) {
      throw new Error(
        'Changing environment after mount is not supported when it resolves to a different API URL.',
      );
    }

    this.componentRef.setInput('interaction', options.interaction);
    this.componentRef.setInput('configuration', options.configuration);
    this.componentRef.setInput('whiteLabel', options.whiteLabel);
    this.componentRef.changeDetectorRef.detectChanges();
  }

  destroy(): void {
    if (mountedWidgets.get(this.containerElement) === this) {
      mountedWidgets.delete(this.containerElement);
    }

    this.applicationRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
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

    this.instance.update(options, this.environmentValue);
  }
}

export async function registerCommerceHubConnectWebSdk(): Promise<CommerceHubConnectWebSdkNamespace> {
  ensureCustomElementRegistered();

  const namespace: CommerceHubConnectWebSdkNamespace = {
    version: SDK_VERSION,
    tagName: SDK_TAG_NAME,
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

export async function mount(
  target: string | Element,
  options: CommerceHubConnectWebSdkMountOptions,
  environment?: CommerceHubConnectEnvironment,
): Promise<CommerceHubConnectWebSdkInstance> {
  validateMountRequest(options, environment);
  await ensureStylesheet();

  const applicationRef = await getApplicationRef();
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

  const runtimeOrigin = resolveSdkRuntimeOrigin(document);
  const normalizedEnvironment = normalizeCommerceHubConnectEnvironment(environment);
  const apiBaseUrl = resolveCommerceHubConnectApiBaseUrl(normalizedEnvironment, runtimeOrigin);

  const componentRef = createComponent(CommerceHubConnectCaptureComponent, {
    environmentInjector: applicationRef.injector,
    elementInjector: Injector.create({
      providers: [
        {
          provide: COMMERCE_HUB_CONNECT_API_BASE_URL,
          useValue: () => apiBaseUrl,
        },
      ],
      parent: applicationRef.injector,
    }),
    hostElement,
  });

  applicationRef.attachView(componentRef.hostView);

  try {
    const instance = new MountedWidget(
      applicationRef,
      componentRef,
      containerElement,
      hostElement,
      runtimeOrigin,
      apiBaseUrl,
    );

    instance.update(options, normalizedEnvironment);
    mountedWidgets.set(containerElement, instance);
    return instance;
  } catch (error) {
    applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
    hostElement.remove();
    throw error;
  }
}

function ensureCustomElementRegistered(): void {
  if (!customElements.get(SDK_TAG_NAME)) {
    customElements.define(SDK_TAG_NAME, CommerceHubConnectWidgetElement);
  }
}

async function getApplicationRef(): Promise<ApplicationRef> {
  if (!applicationRefPromise) {
    applicationRefPromise = createApplication(applicationConfig);
  }

  return applicationRefPromise;
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
