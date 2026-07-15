import {
  Actions,
  type AddCellRendererAction,
  type AddRendererAction,
  type AnyAction,
  type CoreActions,
  type JsonFormsCellRendererRegistryEntry,
  type JsonFormsCore,
  type JsonFormsI18nState,
  type JsonFormsRendererRegistryEntry,
  type JsonFormsState,
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  type RemoveCellRendererAction,
  type RemoveRendererAction,
  type SetConfigAction,
  type UISchemaActions,
  type UISchemaElement,
  type ValidationMode,
  generateDefaultUISchema,
  jsonFormsReducerConfig,
} from '@jsonforms/core';
import type Ajv from 'ajv';
import type {ErrorObject} from 'ajv';

export type LitJsonFormsRendererRegistryEntry = Omit<
  JsonFormsRendererRegistryEntry,
  'renderer'
> & {
  renderer: string;
};

export type JsonFormsMiddleware = (
  state: JsonFormsCore | undefined,
  action: CoreActions,
  defaultReducer: (
    state: JsonFormsCore | undefined,
    action: CoreActions
  ) => JsonFormsCore
) => JsonFormsCore;

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

const coreActionTypes = new Set<string>([
  'jsonforms/INIT',
  'jsonforms/UPDATE_CORE',
  'jsonforms/SET_AJV',
  'jsonforms/UPDATE',
  'jsonforms/UPDATE_ERRORS',
  'jsonforms/SET_SCHEMA',
  'jsonforms/SET_UISCHEMA',
  'jsonforms/SET_VALIDATION_MODE',
]);

const createDefaultI18nState = (): JsonFormsI18nState =>
  jsonFormsReducerConfig.i18n(undefined, {
    type: '@@jsonforms-lit/INIT',
  } as AnyAction);

export class LitJsonFormsStore {
  private state: JsonFormsState = {
    jsonforms: {
      renderers: [],
      cells: [],
      uischemas: [],
      config: {},
      i18n: createDefaultI18nState(),
      readonly: false,
    },
  };

  private readonly subscribers = new Set<Subscriber>();

  private middleware: JsonFormsMiddleware = (state, action, defaultReducer) =>
    defaultReducer(state, action);

  private explicitUiSchema = false;

  private validationMode: ValidationMode = 'ValidateAndShow';

  private ajv?: Ajv;

  private additionalErrors: ErrorObject[] = [];

  constructor(options: LitJsonFormsStoreOptions = {}) {
    this.middleware = options.middleware ?? this.middleware;
    this.explicitUiSchema = options.uischema !== undefined;
    this.validationMode = options.validationMode ?? this.validationMode;
    this.ajv = options.ajv;
    this.additionalErrors = options.additionalErrors ?? [];
    this.state = {
      jsonforms: {
        renderers: options.renderers ?? [],
        cells: options.cells ?? [],
        uischemas: options.uischemas ?? [],
        readonly: options.readonly ?? false,
        config: options.config ?? {},
        i18n: {
          ...createDefaultI18nState(),
          ...options.i18n,
        },
      },
    };

    const schema = options.schema ?? {};
    const uischema =
      options.uischema ?? generateDefaultUISchema(schema, 'VerticalLayout');
    this.reduceCore(
      Actions.init(options.data ?? {}, schema, uischema, this.coreOptions())
    );
  }

  subscribe(subscriber: Subscriber): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  getState(): JsonFormsState {
    return this.state;
  }

  dispatch(action: AnyAction): void {
    const previous = this.state.jsonforms;
    let next = previous;

    if (coreActionTypes.has(action.type)) {
      next = {
        ...next,
        core: this.middleware(
          next.core,
          action as CoreActions,
          jsonFormsReducerConfig.core
        ),
      };
    }

    switch (action.type) {
      case 'jsonforms/ADD_RENDERER':
      case 'jsonforms/REMOVE_RENDERER':
        next = {
          ...next,
          renderers: jsonFormsReducerConfig.renderers(
            next.renderers,
            action as AddRendererAction | RemoveRendererAction
          ) as LitJsonFormsRendererRegistryEntry[],
        };
        break;
      case 'jsonforms/ADD_CELL':
      case 'jsonforms/REMOVE_CELL':
        next = {
          ...next,
          cells: jsonFormsReducerConfig.cells(
            next.cells,
            action as AddCellRendererAction | RemoveCellRendererAction
          ),
        };
        break;
      case 'jsonforms/SET_CONFIG':
        next = {
          ...next,
          config: jsonFormsReducerConfig.config(
            next.config,
            action as SetConfigAction
          ),
        };
        break;
      case 'jsonforms/ADD_UI_SCHEMA':
      case 'jsonforms/REMOVE_UI_SCHEMA':
        next = {
          ...next,
          uischemas: jsonFormsReducerConfig.uischemas(
            next.uischemas,
            action as UISchemaActions
          ),
        };
        break;
      case 'jsonforms/SET_LOCALE':
      case 'jsonforms/SET_TRANSLATOR':
      case 'jsonforms/UPDATE_I18N':
        next = {
          ...next,
          i18n: jsonFormsReducerConfig.i18n(next.i18n, action),
        };
        break;
      default:
        break;
    }

    if (next !== previous) {
      this.state = {jsonforms: next};
      this.notify();
    }
  }

  setData(data: unknown): void {
    this.updateCoreState({data});
  }

  setSchema(schema: JsonSchema): void {
    this.updateCoreState({schema});
  }

  setUiSchema(uischema?: UISchemaElement): void {
    this.explicitUiSchema = uischema !== undefined;
    this.updateCoreState({uischema});
  }

  setRenderers(renderers: LitJsonFormsRendererRegistryEntry[] = []): void {
    this.assignState({renderers});
  }

  setCells(cells: JsonFormsCellRendererRegistryEntry[] = []): void {
    this.assignState({cells});
  }

  setUiSchemas(uischemas: JsonFormsUISchemaRegistryEntry[] = []): void {
    this.assignState({uischemas});
  }

  setReadonly(readonly: boolean): void {
    this.assignState({readonly});
  }

  setConfig(config: unknown): void {
    this.assignState({config});
  }

  setI18n(i18n: JsonFormsI18nState = {}): void {
    this.assignState({
      i18n: {
        ...createDefaultI18nState(),
        ...i18n,
      },
    });
  }

  setValidationMode(validationMode: ValidationMode): void {
    this.validationMode = validationMode;
    this.dispatch(Actions.setValidationMode(validationMode));
  }

  setAjv(ajv?: Ajv): void {
    this.ajv = ajv;
    if (ajv !== undefined) {
      this.dispatch(Actions.setAjv(ajv));
    } else {
      this.updateCoreState({});
    }
  }

  setAdditionalErrors(additionalErrors: ErrorObject[] = []): void {
    this.additionalErrors = additionalErrors;
    this.updateCoreState({});
  }

  updateCoreState(next: {
    data?: unknown;
    schema?: JsonSchema;
    uischema?: UISchemaElement;
  }): void {
    const core = this.state.jsonforms.core;
    const schema = next.schema ?? core?.schema ?? {};
    const shouldGenerateUiSchema =
      !this.explicitUiSchema && next.uischema === undefined;
    const uischema = shouldGenerateUiSchema
      ? generateDefaultUISchema(schema, 'VerticalLayout')
      : next.uischema ?? core?.uischema;
    this.reduceCore(
      Actions.updateCore(
        next.data ?? core?.data ?? {},
        schema,
        uischema,
        this.coreOptions()
      )
    );
  }

  private reduceCore(action: CoreActions): void {
    const previous = this.state.jsonforms;
    const core = this.middleware(
      previous.core,
      action,
      jsonFormsReducerConfig.core
    );
    if (core !== previous.core) {
      this.state = {
        jsonforms: {
          ...previous,
          core,
        },
      };
      this.notify();
    }
  }

  private coreOptions() {
    return {
      ajv: this.ajv,
      validationMode: this.validationMode,
      additionalErrors: this.additionalErrors,
    };
  }

  private assignState(update: Partial<JsonFormsState['jsonforms']>): void {
    this.state = {
      jsonforms: {
        ...this.state.jsonforms,
        ...update,
      },
    };
    this.notify();
  }

  private notify(): void {
    for (const subscriber of this.subscribers) {
      subscriber();
    }
  }
}
