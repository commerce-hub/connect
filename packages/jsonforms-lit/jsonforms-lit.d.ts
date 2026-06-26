import { type JsonFormsCellRendererRegistryEntry, type JsonFormsI18nState, type JsonFormsUISchemaRegistryEntry, type JsonSchema, type UISchemaElement, type ValidationMode } from '@jsonforms/core';
import { LitElement, type PropertyValues } from 'lit';
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import { type JsonFormsMiddleware, type LitJsonFormsRendererRegistryEntry } from './store.js';
import './dispatch.js';
export declare class JsonFormsLit extends LitElement {
    static styles: import("lit").CSSResult;
    data?: unknown;
    schema?: JsonSchema;
    uischema?: UISchemaElement;
    renderers: LitJsonFormsRendererRegistryEntry[];
    cells?: JsonFormsCellRendererRegistryEntry[];
    uischemas?: JsonFormsUISchemaRegistryEntry[];
    readonly: boolean;
    validationMode: ValidationMode;
    ajv?: Ajv;
    config?: unknown;
    i18n?: JsonFormsI18nState;
    additionalErrors?: ErrorObject[];
    middleware?: JsonFormsMiddleware;
    private store;
    private unsubscribe?;
    private lastData?;
    private lastErrors?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    render(): import("lit-html").TemplateResult<1>;
    private recreateStore;
    private onStoreChange;
    private captureCoreRefs;
}
//# sourceMappingURL=jsonforms-lit.d.ts.map