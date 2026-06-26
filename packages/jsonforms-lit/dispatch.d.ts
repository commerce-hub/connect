import { type JsonFormsCellRendererRegistryEntry, type JsonFormsRendererRegistryEntry, type JsonFormsUISchemaRegistryEntry, type JsonSchema, type UISchemaElement } from '@jsonforms/core';
import { LitElement, type PropertyValues } from 'lit';
import type { LitJsonFormsStore } from './store.js';
export declare class JsonFormsDispatch extends LitElement {
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
    private selectedRenderer?;
    private unsubscribe?;
    createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    render(): import("lit-html").TemplateResult;
    private updateRenderer;
    private syncSubscription;
}
//# sourceMappingURL=dispatch.d.ts.map