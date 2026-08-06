import {
  Actions,
  type ControlElement,
  type ControlProps,
  type JsonFormsCellRendererRegistryEntry,
  type JsonFormsRendererRegistryEntry,
  type JsonFormsState,
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  type LabelElement,
  type LayoutProps,
  type OwnPropsOfControl,
  type OwnPropsOfLabel,
  type OwnPropsOfLayout,
  type OwnPropsOfRenderer,
  type UISchemaElement,
  mapStateToControlProps,
  mapStateToJsonFormsRendererProps,
  mapStateToLabelProps,
  mapStateToLayoutProps,
  Id,
} from '@jsonforms/core';
import {LitElement, type PropertyValues} from 'lit';
import {property, state} from 'lit/decorators.js';
import type {LitJsonFormsStore} from './store.js';

const storeAwareProperties = new Set<PropertyKey>([
  'store',
  'uischema',
  'schema',
  'path',
  'enabled',
  'readonly',
  'visible',
  'renderers',
  'cells',
  'uischemas',
  'id',
]);

export class JsonFormsBaseRenderer extends LitElement {
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
  renderers?: JsonFormsRendererRegistryEntry[];

  @property({attribute: false})
  cells?: JsonFormsCellRendererRegistryEntry[];

  @property({attribute: false})
  uischemas?: JsonFormsUISchemaRegistryEntry[];

  @property({type: String})
  override id = '';

  @state()
  protected rendererProps?: unknown;

  private unsubscribe?: () => void;

  override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncSubscription();
    this.updateMappedProps();
  }

  override disconnectedCallback(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    super.disconnectedCallback();
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    if (
      [...changedProperties.keys()].some((key) => storeAwareProperties.has(key))
    ) {
      this.syncSubscription();
      this.updateMappedProps();
    }
  }

  protected mapStateToProps(state: JsonFormsState): unknown {
    return mapStateToJsonFormsRendererProps(state, this.ownProps());
  }

  protected updateMappedProps(): void {
    if (this.store === undefined) {
      return;
    }
    this.rendererProps = this.mapStateToProps(this.store.getState());
  }

  protected ownProps(): OwnPropsOfRenderer {
    return {
      uischema: this.uischema,
      schema: this.schema,
      path: this.path,
      enabled: this.enabled,
      readonly: this.readonly,
      visible: this.visible,
      renderers: this.renderers,
      cells: this.cells,
      uischemas: this.uischemas,
    };
  }

  private syncSubscription(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    if (this.store !== undefined && this.isConnected) {
      this.unsubscribe = this.store.subscribe(() => this.updateMappedProps());
    }
  }
}

export class JsonFormsControl extends JsonFormsBaseRenderer {
  @state()
  protected controlProps?: ControlProps;

  private generatedId?: string;

  override connectedCallback(): void {
    super.connectedCallback();
    this.ensureId();
  }

  override disconnectedCallback(): void {
    if (this.generatedId !== undefined) {
      Id.removeId(this.generatedId);
      this.generatedId = undefined;
    }
    super.disconnectedCallback();
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    if (
      [...changedProperties.keys()].some((key) => storeAwareProperties.has(key))
    ) {
      this.ensureId();
      this.updateMappedProps();
    }
  }

  protected override mapStateToProps(state: JsonFormsState): ControlProps {
    const props = mapStateToControlProps(state, this.controlOwnProps());
    const touchedValidation = (
      props.config as
        | {
            touchedValidation?: {
              fields?: readonly string[];
              showAll?: boolean;
            };
          }
        | undefined
    )?.touchedValidation;
    const errors =
      touchedValidation === undefined ||
      touchedValidation.showAll ||
      touchedValidation.fields?.includes(props.path)
        ? props.errors
        : '';

    return {
      ...props,
      errors,
      handleChange: (path: string, value: unknown) => {
        this.store?.dispatch(Actions.update(path, () => value));
      },
    };
  }

  protected override updateMappedProps(): void {
    if (this.store === undefined) {
      return;
    }
    this.controlProps = this.mapStateToProps(this.store.getState());
    this.rendererProps = this.controlProps;
  }

  private controlOwnProps(): OwnPropsOfControl {
    return {
      ...this.ownProps(),
      id: this.id,
      uischema: this.uischema as ControlElement,
    };
  }

  private ensureId(): void {
    if (!this.id && this.uischema !== undefined) {
      this.generatedId = Id.createId(this.path || 'jsonforms-control');
      this.id = this.generatedId;
    }
  }
}

export class JsonFormsArrayControl extends JsonFormsControl {}

export class JsonFormsLayout extends JsonFormsBaseRenderer {
  @state()
  protected layoutProps?: LayoutProps;

  protected override mapStateToProps(state: JsonFormsState): LayoutProps {
    return mapStateToLayoutProps(state, {
      ...this.ownProps(),
      uischema: this.uischema,
    } as OwnPropsOfLayout);
  }

  protected override updateMappedProps(): void {
    if (this.store === undefined) {
      return;
    }
    this.layoutProps = this.mapStateToProps(this.store.getState());
    this.rendererProps = this.layoutProps;
  }
}

export class JsonFormsLabel extends JsonFormsBaseRenderer {
  @state()
  protected labelProps?: ReturnType<typeof mapStateToLabelProps>;

  protected override mapStateToProps(
    state: JsonFormsState
  ): ReturnType<typeof mapStateToLabelProps> {
    return mapStateToLabelProps(state, {
      ...this.ownProps(),
      uischema: this.uischema as LabelElement,
    } as OwnPropsOfLabel);
  }

  protected override updateMappedProps(): void {
    if (this.store === undefined) {
      return;
    }
    this.labelProps = this.mapStateToProps(this.store.getState());
    this.rendererProps = this.labelProps;
  }
}
