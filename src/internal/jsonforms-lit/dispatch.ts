import {
  NOT_APPLICABLE,
  type JsonFormsCellRendererRegistryEntry,
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  type UISchemaElement,
  mapStateToJsonFormsRendererProps,
} from '@jsonforms/core';
import {LitElement, html, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {html as staticHtml, unsafeStatic} from 'lit/static-html.js';
import type {
  LitJsonFormsRendererRegistryEntry,
  LitJsonFormsStore,
} from './store.js';

@customElement('jsonforms-lit-dispatch')
export class JsonFormsDispatch extends LitElement {
  @property({attribute: false})
  store?: LitJsonFormsStore;

  @property({attribute: false})
  uischema?: UISchemaElement;

  @property({attribute: false})
  schema?: JsonSchema;

  @property({type: String})
  path = '';

  @property({type: Boolean})
  enabled = true;

  @property({type: Boolean})
  readonly = false;

  @property({type: Boolean})
  visible = true;

  @property({attribute: false})
  renderers?: LitJsonFormsRendererRegistryEntry[];

  @property({attribute: false})
  cells?: JsonFormsCellRendererRegistryEntry[];

  @property({attribute: false})
  uischemas?: JsonFormsUISchemaRegistryEntry[];

  @state()
  private selectedRenderer?: string;

  private unsubscribe?: () => void;

  override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncSubscription();
    this.updateRenderer();
  }

  override disconnectedCallback(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    super.disconnectedCallback();
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('store')) {
      this.syncSubscription();
    }
    if (changedProperties.size > 0) {
      this.updateRenderer();
    }
  }

  override render() {
    if (this.store === undefined) {
      return html``;
    }

    const props = mapStateToJsonFormsRendererProps(this.store.getState(), {
      uischema: this.uischema,
      schema: this.schema,
      path: this.path,
      enabled: this.enabled,
      readonly: this.readonly,
      visible: this.visible,
      renderers: this.renderers,
      cells: this.cells,
      uischemas: this.uischemas,
    });

    if (props.uischema === undefined || props.visible === false) {
      return html``;
    }

    const tagName = this.selectedRenderer ?? 'jsonforms-lit-unknown-renderer';
    const tag = unsafeStatic(tagName);

    return staticHtml`
      <${tag}
        .store=${this.store}
        .uischema=${props.uischema}
        .schema=${props.schema}
        .path=${props.path ?? ''}
        .enabled=${props.enabled ?? true}
        .readonly=${props.readonly ?? this.readonly}
        .visible=${props.visible ?? true}
        .renderers=${props.renderers}
        .cells=${props.cells}
        .uischemas=${this.uischemas}
      ></${tag}>
    `;
  }

  private updateRenderer(): void {
    if (this.store === undefined) {
      this.selectedRenderer = undefined;
      return;
    }

    const props = mapStateToJsonFormsRendererProps(this.store.getState(), {
      uischema: this.uischema,
      schema: this.schema,
      path: this.path,
      enabled: this.enabled,
      readonly: this.readonly,
      visible: this.visible,
      renderers: this.renderers,
      cells: this.cells,
      uischemas: this.uischemas,
    });

    if (props.uischema === undefined) {
      this.selectedRenderer = undefined;
      return;
    }

    let bestRank = NOT_APPLICABLE;
    let bestRenderer: string | undefined;
    const renderers = props.renderers ?? [];
    for (const entry of renderers) {
      const rank = entry.tester(props.uischema, props.schema ?? {}, {
        rootSchema: props.rootSchema,
        config: props.config,
      });
      if (rank > bestRank) {
        bestRank = rank;
        bestRenderer = entry.renderer as string;
      }
    }
    this.selectedRenderer =
      bestRank === NOT_APPLICABLE ? undefined : bestRenderer;
  }

  private syncSubscription(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    if (this.store !== undefined && this.isConnected) {
      this.unsubscribe = this.store.subscribe(() => {
        this.updateRenderer();
        this.requestUpdate();
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jsonforms-lit-dispatch': JsonFormsDispatch;
  }
}
