import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  Injectable,
  computed,
  effect,
  inject,
  input,
  output,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  signal,
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {
  COMMERCE_HUB_CONNECT_API_BASE_URL,
  CommerceHubConnectCaptureComponent,
  CommerceHubSdkConfiguration,
  CommerceHubSdkError,
  CommerceHubSuccessResult,
  CommerceHubWhiteLabelOptions,
  provideCommerceHubSdkTheme,
} from 'commerce-hub-connect-sdk';

const SDK_VERSION = '0.0.1';
const SDK_TAG_NAME = 'commerce-hub-connect-widget';
const SDK_SCRIPT_URL = resolveSdkScriptUrl();

export type CommerceHubConnectWebSdkConfiguration = Omit<
  CommerceHubSdkConfiguration,
  'onSuccess' | 'onError'
> & {
  onSuccess?: (result: CommerceHubSuccessResult) => void;
  onError?: (error: CommerceHubSdkError) => void;
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

export interface CommerceHubConnectWidgetElement extends HTMLElement {
  configuration: CommerceHubConnectWebSdkConfiguration | null;
  configurationJson?: string;
  whiteLabel?: CommerceHubWhiteLabelOptions | null;
  whiteLabelJson?: string;
  apiBaseUrl?: string;
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

@Injectable()
class CommerceHubConnectWebSdkRuntimeConfig {
  private readonly apiBaseUrlState = signal('/api');

  readonly apiBaseUrl = this.apiBaseUrlState.asReadonly();

  setApiBaseUrl(value: string | undefined): void {
    this.apiBaseUrlState.set(normalizeApiBaseUrl(value));
  }
}

@Component({
  selector: 'ch-web-sdk-element',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommerceHubConnectCaptureComponent],
  providers: [
    CommerceHubConnectWebSdkRuntimeConfig,
    {
      provide: COMMERCE_HUB_CONNECT_API_BASE_URL,
      useFactory: () => inject(CommerceHubConnectWebSdkRuntimeConfig).apiBaseUrl,
    },
  ],
  host: {
    class: 'commerce-hub-connect-web-sdk-element',
  },
  template: `
    @if (resolvedConfiguration(); as configuration) {
      <commerce-hub-connect-capture
        [configuration]="configuration"
        [whiteLabel]="resolvedWhiteLabel() ?? undefined"
      />
    } @else {
      <section class="commerce-hub-connect-web-sdk-placeholder">
        <h2>CommerceHub Connect</h2>
        <p>Set the widget configuration before using this custom element.</p>
      </section>
    }
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .commerce-hub-connect-web-sdk-placeholder {
      display: grid;
      gap: 0.5rem;
      min-height: 12rem;
      align-content: center;
      justify-items: start;
      border: 1px dashed rgba(16, 24, 40, 0.18);
      border-radius: 1rem;
      padding: 1.25rem;
      color: #475467;
      background: rgba(255, 255, 255, 0.72);
    }

    .commerce-hub-connect-web-sdk-placeholder h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #101828;
    }

    .commerce-hub-connect-web-sdk-placeholder p {
      margin: 0;
      line-height: 1.5;
    }
  `,
})
class CommerceHubConnectWebSdkElementComponent {
  readonly configuration = input<CommerceHubConnectWebSdkConfiguration | null>(null);
  readonly configurationJson = input<string>();
  readonly whiteLabel = input<CommerceHubWhiteLabelOptions | null>(null);
  readonly whiteLabelJson = input<string>();
  readonly apiBaseUrl = input('/api');

  readonly commerceHubSuccess = output<CommerceHubSuccessResult>({
    alias: 'commerce-hub-success',
  });
  readonly commerceHubError = output<CommerceHubSdkError>({
    alias: 'commerce-hub-error',
  });

  private readonly runtimeConfig = inject(CommerceHubConnectWebSdkRuntimeConfig);

  protected readonly resolvedWhiteLabel = computed(() => {
    return (
      this.whiteLabel() ??
      parseJsonInput<CommerceHubWhiteLabelOptions>(this.whiteLabelJson()) ??
      null
    );
  });

  protected readonly resolvedConfiguration = computed<CommerceHubSdkConfiguration | null>(() => {
    const source =
      this.configuration() ??
      parseJsonInput<CommerceHubConnectWebSdkConfiguration>(this.configurationJson());

    if (!source?.sessionReferenceId?.trim()) {
      return null;
    }

    if (source.authType !== 'FINAL_SALE' && source.authType !== 'AUTH_ONLY') {
      return null;
    }

    const onSuccess = source.onSuccess;
    const onError = source.onError;

    return {
      ...source,
      onSuccess: (result) => {
        onSuccess?.(result);
        this.commerceHubSuccess.emit(result);
      },
      onError: (error) => {
        onError?.(error);
        this.commerceHubError.emit(error);
      },
    };
  });

  constructor() {
    effect(() => {
      this.runtimeConfig.setApiBaseUrl(this.apiBaseUrl());
    });
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

let applicationRefPromise: Promise<ApplicationRef> | null = null;
let customElementDefinitionPromise: Promise<void> | null = null;
let stylesheetPromise: Promise<void> | null = null;

export async function registerCommerceHubConnectWebSdk(): Promise<CommerceHubConnectWebSdkNamespace> {
  const namespace: CommerceHubConnectWebSdkNamespace = {
    version: SDK_VERSION,
    tagName: SDK_TAG_NAME,
    define: defineCustomElement,
    createElement,
    mount,
  };

  window.CommerceHubConnectWebSdk = namespace;
  await defineCustomElement();
  return namespace;
}

async function defineCustomElement(): Promise<void> {
  if (customElements.get(SDK_TAG_NAME)) {
    return;
  }

  if (!customElementDefinitionPromise) {
    customElementDefinitionPromise = (async () => {
      await ensureStylesheet();

      if (customElements.get(SDK_TAG_NAME)) {
        return;
      }

      const applicationRef = await getApplicationRef();
      const element = createCustomElement(CommerceHubConnectWebSdkElementComponent, {
        injector: applicationRef.injector,
      });
      customElements.define(SDK_TAG_NAME, element);
    })();
  }

  await customElementDefinitionPromise;
}

export async function createElement(
  options?: CommerceHubConnectWebSdkElementOptions,
): Promise<CommerceHubConnectWidgetElement> {
  await defineCustomElement();

  const element = document.createElement(SDK_TAG_NAME) as CommerceHubConnectWidgetElement;
  applyOptions(element, options);
  return element;
}

export async function mount(
  target: string | Element,
  options?: CommerceHubConnectWebSdkMountOptions,
): Promise<CommerceHubConnectWidgetElement> {
  const containerElement = resolveTarget(target);
  const element = await createElement(options);

  if (options?.replaceContents !== false) {
    containerElement.replaceChildren();
  }

  containerElement.appendChild(element);
  return element;
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

function applyOptions(
  element: CommerceHubConnectWidgetElement,
  options: CommerceHubConnectWebSdkElementOptions | undefined,
): void {
  if (!options) {
    return;
  }

  if (typeof options.apiBaseUrl === 'string') {
    element.apiBaseUrl = options.apiBaseUrl;
  }
  if (typeof options.configurationJson === 'string') {
    element.configurationJson = options.configurationJson;
  }
  if (typeof options.whiteLabelJson === 'string') {
    element.whiteLabelJson = options.whiteLabelJson;
  }
  if (options.configuration !== undefined) {
    element.configuration = options.configuration;
  }
  if (options.whiteLabel !== undefined) {
    element.whiteLabel = options.whiteLabel;
  }
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

function parseJsonInput<T>(value: string | undefined): T | null {
  if (!value?.trim()) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
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
