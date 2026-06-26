import { type ControlProps, type JsonFormsCellRendererRegistryEntry, type JsonFormsRendererRegistryEntry, type JsonFormsState, type JsonFormsUISchemaRegistryEntry, type JsonSchema, type LayoutProps, type OwnPropsOfRenderer, type UISchemaElement, mapStateToLabelProps } from '@jsonforms/core';
import { LitElement, type PropertyValues } from 'lit';
import type { LitJsonFormsStore } from './store.js';
export declare class JsonFormsBaseRenderer extends LitElement {
    store?: LitJsonFormsStore;
    uischema?: UISchemaElement;
    schema?: JsonSchema;
    path: string;
    enabled: boolean;
    readonly: boolean;
    visible: boolean;
    renderers?: JsonFormsRendererRegistryEntry[];
    cells?: JsonFormsCellRendererRegistryEntry[];
    uischemas?: JsonFormsUISchemaRegistryEntry[];
    id: string;
    protected rendererProps?: unknown;
    private unsubscribe?;
    createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    protected mapStateToProps(state: JsonFormsState): unknown;
    protected updateMappedProps(): void;
    protected ownProps(): OwnPropsOfRenderer;
    private syncSubscription;
}
export declare class JsonFormsControl extends JsonFormsBaseRenderer {
    protected controlProps?: ControlProps;
    private generatedId?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    protected mapStateToProps(state: JsonFormsState): ControlProps;
    protected updateMappedProps(): void;
    private controlOwnProps;
    private ensureId;
}
export declare class JsonFormsArrayControl extends JsonFormsControl {
}
export declare class JsonFormsLayout extends JsonFormsBaseRenderer {
    protected layoutProps?: LayoutProps;
    protected mapStateToProps(state: JsonFormsState): LayoutProps;
    protected updateMappedProps(): void;
}
export declare class JsonFormsLabel extends JsonFormsBaseRenderer {
    protected labelProps?: ReturnType<typeof mapStateToLabelProps>;
    protected mapStateToProps(state: JsonFormsState): ReturnType<typeof mapStateToLabelProps>;
    protected updateMappedProps(): void;
}
//# sourceMappingURL=base-renderers.d.ts.map