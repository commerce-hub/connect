import { type AnyAction, type CoreActions, type JsonFormsCellRendererRegistryEntry, type JsonFormsCore, type JsonFormsI18nState, type JsonFormsRendererRegistryEntry, type JsonFormsState, type JsonFormsUISchemaRegistryEntry, type JsonSchema, type UISchemaElement, type ValidationMode } from '@jsonforms/core';
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
export type LitJsonFormsRendererRegistryEntry = Omit<JsonFormsRendererRegistryEntry, 'renderer'> & {
    renderer: string;
};
export type JsonFormsMiddleware = (state: JsonFormsCore | undefined, action: CoreActions, defaultReducer: (state: JsonFormsCore | undefined, action: CoreActions) => JsonFormsCore) => JsonFormsCore;
export interface LitJsonFormsStoreOptions {
    data?: unknown;
    schema?: JsonSchema;
    uischema?: UISchemaElement;
    renderers?: LitJsonFormsRendererRegistryEntry[];
    cells?: JsonFormsCellRendererRegistryEntry[];
    uischemas?: JsonFormsUISchemaRegistryEntry[];
    readonly?: boolean;
    validationMode?: ValidationMode;
    ajv?: Ajv;
    config?: unknown;
    i18n?: JsonFormsI18nState;
    additionalErrors?: ErrorObject[];
    middleware?: JsonFormsMiddleware;
}
type Subscriber = () => void;
export declare class LitJsonFormsStore {
    private state;
    private readonly subscribers;
    private middleware;
    private explicitUiSchema;
    private validationMode;
    private ajv?;
    private additionalErrors;
    constructor(options?: LitJsonFormsStoreOptions);
    subscribe(subscriber: Subscriber): () => void;
    getState(): JsonFormsState;
    dispatch(action: AnyAction): void;
    setData(data: unknown): void;
    setSchema(schema: JsonSchema): void;
    setUiSchema(uischema?: UISchemaElement): void;
    setRenderers(renderers?: LitJsonFormsRendererRegistryEntry[]): void;
    setCells(cells?: JsonFormsCellRendererRegistryEntry[]): void;
    setUiSchemas(uischemas?: JsonFormsUISchemaRegistryEntry[]): void;
    setReadonly(readonly: boolean): void;
    setConfig(config: unknown): void;
    setI18n(i18n?: JsonFormsI18nState): void;
    setValidationMode(validationMode: ValidationMode): void;
    setAjv(ajv?: Ajv): void;
    setAdditionalErrors(additionalErrors?: ErrorObject[]): void;
    updateCoreState(next: {
        data?: unknown;
        schema?: JsonSchema;
        uischema?: UISchemaElement;
    }): void;
    private reduceCore;
    private coreOptions;
    private assignState;
    private notify;
}
export {};
//# sourceMappingURL=store.d.ts.map