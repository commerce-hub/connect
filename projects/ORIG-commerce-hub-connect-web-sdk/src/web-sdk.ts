import {
  ApplicationConfig,
  ApplicationRef,
  ComponentRef,
  Injector,
  createComponent,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { createApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {
  COMMERCE_HUB_CONNECT_API_BASE_URL,
  CommerceHubConnectCaptureComponent,
  CommerceHubSdkConfiguration,
  CommerceHubWhiteLabelOptions,
  provideCommerceHubSdkTheme,
} from 'commerce-hub-connect-sdk';

const SDK_VERSION = '0.0.1';
const SDK_TAG_NAME = 'commerce-hub-connect-widget';
const SDK_SCRIPT_URL = resolveSdkScriptUrl();

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
  private readonly mountRoot = document.createElement('div');
  private instance: CommerceHubConnectWebSdkInstance | null = null;
  private configurationValue: CommerceHubSdkConfiguration | null = null;
  private whiteLabelValue?: CommerceHubWhiteLabelOptions;
  private apiBaseUrlValue?: string;

  static get observedAttributes(): string[] {
    return ['api-base-url'];
  }

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

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'api-base-url') {
      this.apiBaseUrlValue = newValue?.trim() || undefined;
      void this.renderWidget();
    }
  }

  get configuration(): CommerceHubSdkConfiguration | null {
    return this.configurationValue;
  }

  set configuration(value: CommerceHubSdkConfiguration | null) {
    this.configurationValue = value;
    void this.renderWidget();
  }

  get whiteLabel(): CommerceHubWhiteLabelOptions | undefined {
    return this.whiteLabelValue;
  }

  set whiteLabel(value: CommerceHubWhiteLabelOptions | undefined) {
    this.whiteLabelValue = value;
    void this.renderWidget();
  }

  get apiBaseUrl(): string | undefined {
    return this.apiBaseUrlValue;
  }

  set apiBaseUrl(value: string | undefined) {
    const normalized = value?.trim() || undefined;
    this.apiBaseUrlValue = normalized;
    if (normalized && this.getAttribute('api-base-url') !== normalized) {
      this.setAttribute('api-base-url', normalized);
      return;
    }
    if (!normalized && this.hasAttribute('api-base-url')) {
      this.removeAttribute('api-base-url');
      return;
    }
    void this.renderWidget();
  }

  private async renderWidget(): Promise<void> {
    if (!this.isConnected || !this.configurationValue) {
      return;
    }

    const options: CommerceHubConnectWebSdkMountOptions = {
      configuration: this.configurationValue,
      whiteLabel: this.whiteLabelValue,
      apiBaseUrl: this.apiBaseUrlValue,
      replaceContents: true,
    };

    if (!this.instance) {
      this.instance = await mount(this.mountRoot, options);
      return;
    }

    try {
      this.instance.update(options);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Changing apiBaseUrl after mount is not supported')
      ) {
        this.instance.destroy();
        this.instance = await mount(this.mountRoot, options);
        return;
      }

      throw error;
    }
  }
}

declare global {
  var __commerceHubConnectWebSdkInlineCss: string | undefined;
  var __commerceHubConnectWebSdkStylesheetUrl: string | undefined;

  interface Window {
    CommerceHubConnectWebSdk?: CommerceHubConnectWebSdkNamespace;
  }

  interface HTMLElementTagNameMap {
    'commerce-hub-connect-widget': CommerceHubConnectWidgetElement;
  }
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
    private readonly apiBaseUrl: string,
  ) {}

  update(options: CommerceHubConnectWebSdkMountOptions): void {
    assertMountOptions(options);

    if (normalizeApiBaseUrl(options.apiBaseUrl) !== this.apiBaseUrl) {
      throw new Error('Changing apiBaseUrl after mount is not supported. Destroy and mount again.');
    }

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

export async function registerCommerceHubConnectWebSdk(): Promise<CommerceHubConnectWebSdkNamespace> {
  ensureCustomElementRegistered();

  const namespace: CommerceHubConnectWebSdkNamespace = {
    version: SDK_VERSION,
    tagName: SDK_TAG_NAME,
    mount,
    createElement: (options?: CommerceHubConnectWebSdkElementOptions) => {
      const element = document.createElement(SDK_TAG_NAME) as CommerceHubConnectWidgetElement;
      if (options?.apiBaseUrl) {
        element.apiBaseUrl = options.apiBaseUrl;
      }
      if (options?.whiteLabel) {
        element.whiteLabel = options.whiteLabel;
      }
      if (options?.configuration) {
        element.configuration = options.configuration;
      }
      return element;
    },
  };

  window.CommerceHubConnectWebSdk = namespace;
  return namespace;
}

export async function mount(
  target: string | Element,
  options: CommerceHubConnectWebSdkMountOptions,
): Promise<CommerceHubConnectWebSdkInstance> {
  assertMountOptions(options);
  await ensureStylesheet();

  const applicationRef = await getApplicationRef();
  const containerElement = resolveTarget(target);
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

  const componentRef = createComponent(CommerceHubConnectCaptureComponent, {
    environmentInjector: applicationRef.injector,
    elementInjector: Injector.create({
      providers: [
        {
          provide: COMMERCE_HUB_CONNECT_API_BASE_URL,
          useValue: normalizeApiBaseUrl(options.apiBaseUrl),
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
      normalizeApiBaseUrl(options.apiBaseUrl),
    );
    instance.update(options);
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
  if (inlineCss) {
    const style = document.createElement('style');
    style.dataset['commerceHubConnectWebSdkStyle'] = 'true';
    style.textContent = inlineCss;
    document.head.appendChild(style);
    stylesheetPromise = Promise.resolve();
    return stylesheetPromise;
  }

  const stylesheetUrl = resolveStylesheetUrl();

  stylesheetPromise = new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheetUrl;
    link.dataset['commerceHubConnectWebSdkStyle'] = 'true';
    link.onload = () => resolve();
    link.onerror = () =>
      reject(new Error(`Unable to load CommerceHub web SDK stylesheet: ${stylesheetUrl}`));
    document.head.appendChild(link);
  });

  return stylesheetPromise;
}

function resolveSdkScriptUrl(): string | null {
  const moduleUrl = import.meta.url;
  if (moduleUrl) {
    return moduleUrl;
  }

  const currentScript = document.currentScript;
  if (currentScript instanceof HTMLScriptElement && currentScript.src) {
    return currentScript.src;
  }

  return null;
}

function resolveStylesheetUrl(): string {
  const configuredUrl = globalThis.__commerceHubConnectWebSdkStylesheetUrl?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  if (SDK_SCRIPT_URL) {
    return new URL('./styles.css', SDK_SCRIPT_URL).href;
  }

  return './styles.css';
}

function resolveTarget(target: string | Element): Element {
  if (typeof target === 'string') {
    const resolved = document.querySelector(target);
    if (!resolved) {
      throw new Error(`Unable to find a mount target for selector: ${target}`);
    }

    return resolved;
  }

  return target;
}

function normalizeApiBaseUrl(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed || '/api';
}

function assertMountOptions(options: CommerceHubConnectWebSdkMountOptions): void {
  if (!options || typeof options !== 'object') {
    throw new Error('Mount options are required.');
  }

  if (!options.configuration || typeof options.configuration !== 'object') {
    throw new Error('A CommerceHubSdkConfiguration object is required.');
  }

  if (!options.configuration.sessionReferenceId?.trim()) {
    throw new Error('configuration.sessionReferenceId is required.');
  }

  if (typeof options.configuration.onSuccess !== 'function') {
    throw new Error('configuration.onSuccess must be a function.');
  }

  if (typeof options.configuration.onError !== 'function') {
    throw new Error('configuration.onError must be a function.');
  }

  if (options.configuration.authType !== 'FINAL_SALE' && options.configuration.authType !== 'AUTH_ONLY') {
    throw new Error('configuration.authType must be FINAL_SALE or AUTH_ONLY.');
  }
}
