import {
  type JsonFormsCellRendererRegistryEntry,
  type JsonFormsI18nState,
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  type UISchemaElement,
  type ValidationMode,
} from '@jsonforms/core';
import {LitElement, css, html, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import type Ajv from 'ajv';
import type {ErrorObject} from 'ajv';
import {
  LitJsonFormsStore,
  type JsonFormsMiddleware,
  type LitJsonFormsRendererRegistryEntry,
} from './store.js';
import {litRenderers} from './renderers.js';
import {JsonFormsDispatch} from './dispatch.js';

void JsonFormsDispatch;

@customElement('jsonforms-lit')
export class JsonFormsLit extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: #1f2933;
      font-family:
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      font-size: 14px;
      line-height: 1.4;
    }

    .jsonforms-layout {
      display: flex;
      gap: 12px;
    }

    .jsonforms-layout-vertical,
    .jsonforms-group {
      flex-direction: column;
    }

    .jsonforms-layout-horizontal {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .jsonforms-group {
      border: 1px solid #d8dee4;
      border-radius: 6px;
      padding: 12px;
    }

    .jsonforms-group-label {
      font-weight: 600;
    }

    .jsonforms-control {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 180px;
    }

    label {
      font-weight: 600;
    }

    input,
    select {
      box-sizing: border-box;
      min-height: 36px;
      border: 1px solid #c9d1d9;
      border-radius: 6px;
      padding: 6px 8px;
      font: inherit;
    }

    input[type='checkbox'] {
      min-height: auto;
    }

    input:disabled,
    select:disabled {
      background: #f6f8fa;
      color: #57606a;
    }

    .jsonforms-control-checkbox label {
      display: inline-flex;
      gap: 8px;
      align-items: center;
    }

    .jsonforms-description {
      color: #57606a;
      font-size: 12px;
    }

    .jsonforms-error,
    .jsonforms-unknown-renderer {
      color: #b42318;
      font-size: 12px;
    }
  `;

  @property({attribute: false})
  data?: unknown;

  @property({attribute: false})
  schema?: JsonSchema;

  @property({attribute: false})
  uischema?: UISchemaElement;

  @property({attribute: false})
  renderers: LitJsonFormsRendererRegistryEntry[] = litRenderers;

  @property({attribute: false})
  cells?: JsonFormsCellRendererRegistryEntry[];

  @property({attribute: false})
  uischemas?: JsonFormsUISchemaRegistryEntry[];

  @property({type: Boolean})
  readonly = false;

  @property({type: String})
  validationMode: ValidationMode = 'ValidateAndShow';

  @property({attribute: false})
  ajv?: Ajv;

  @property({attribute: false})
  config?: unknown;

  @property({attribute: false})
  i18n?: JsonFormsI18nState;

  @property({attribute: false})
  additionalErrors?: ErrorObject[];

  @property({attribute: false})
  middleware?: JsonFormsMiddleware;

  @state()
  private store = new LitJsonFormsStore({renderers: litRenderers});

  private unsubscribe?: () => void;

  private lastData?: unknown;

  private lastErrors?: ErrorObject[];

  override connectedCallback(): void {
    super.connectedCallback();
    this.unsubscribe = this.store.subscribe(() => this.onStoreChange());
    this.captureCoreRefs();
  }

  override disconnectedCallback(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    super.disconnectedCallback();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('middleware')) {
      this.recreateStore();
      return;
    }

    if (changedProperties.has('schema')) {
      this.store.setSchema(this.schema ?? {});
    }
    if (changedProperties.has('uischema')) {
      this.store.setUiSchema(this.uischema);
    }
    if (changedProperties.has('data')) {
      this.store.setData(this.data ?? {});
    }
    if (changedProperties.has('renderers')) {
      this.store.setRenderers(this.renderers ?? []);
    }
    if (changedProperties.has('cells')) {
      this.store.setCells(this.cells ?? []);
    }
    if (changedProperties.has('uischemas')) {
      this.store.setUiSchemas(this.uischemas ?? []);
    }
    if (changedProperties.has('readonly')) {
      this.store.setReadonly(this.readonly);
    }
    if (changedProperties.has('validationMode')) {
      this.store.setValidationMode(this.validationMode);
    }
    if (changedProperties.has('ajv')) {
      this.store.setAjv(this.ajv);
    }
    if (changedProperties.has('config')) {
      this.store.setConfig(this.config ?? {});
    }
    if (changedProperties.has('i18n')) {
      this.store.setI18n(this.i18n ?? {});
    }
    if (changedProperties.has('additionalErrors')) {
      this.store.setAdditionalErrors(this.additionalErrors ?? []);
    }
  }

  override render() {
    const core = this.store.getState().jsonforms.core;
    return html`
      <jsonforms-lit-dispatch
        .store=${this.store}
        .schema=${core?.schema}
        .uischema=${core?.uischema}
        .path=${''}
        .enabled=${true}
        .readonly=${this.readonly}
        .renderers=${this.renderers}
        .cells=${this.cells}
        .uischemas=${this.uischemas}
      ></jsonforms-lit-dispatch>
    `;
  }

  private recreateStore(): void {
    this.unsubscribe?.();
    this.store = new LitJsonFormsStore({
      data: this.data ?? {},
      schema: this.schema ?? {},
      uischema: this.uischema,
      renderers: this.renderers ?? [],
      cells: this.cells ?? [],
      uischemas: this.uischemas ?? [],
      readonly: this.readonly,
      validationMode: this.validationMode,
      ajv: this.ajv,
      config: this.config ?? {},
      i18n: this.i18n ?? {},
      additionalErrors: this.additionalErrors ?? [],
      middleware: this.middleware,
    });
    this.unsubscribe = this.store.subscribe(() => this.onStoreChange());
    this.captureCoreRefs();
  }

  private onStoreChange(): void {
    const core = this.store.getState().jsonforms.core;
    if (core === undefined) {
      return;
    }
    if (core.data !== this.lastData) {
      this.lastData = core.data;
      this.dispatchEvent(
        new CustomEvent('data-change', {
          detail: {data: core.data, errors: core.errors ?? []},
        })
      );
    }
    if (core.errors !== this.lastErrors) {
      this.lastErrors = core.errors;
      this.dispatchEvent(
        new CustomEvent('errors-change', {
          detail: {errors: core.errors ?? []},
        })
      );
    }
    this.requestUpdate();
  }

  private captureCoreRefs(): void {
    const core = this.store.getState().jsonforms.core;
    this.lastData = core?.data;
    this.lastErrors = core?.errors;
  }
}
