import { Actions, generateDefaultUISchema, jsonFormsReducerConfig, } from '@jsonforms/core';
const coreActionTypes = new Set([
    'jsonforms/INIT',
    'jsonforms/UPDATE_CORE',
    'jsonforms/SET_AJV',
    'jsonforms/UPDATE',
    'jsonforms/UPDATE_ERRORS',
    'jsonforms/SET_SCHEMA',
    'jsonforms/SET_UISCHEMA',
    'jsonforms/SET_VALIDATION_MODE',
]);
const createDefaultI18nState = () => jsonFormsReducerConfig.i18n(undefined, { type: '@@jsonforms-lit/INIT' });
export class LitJsonFormsStore {
    constructor(options = {}) {
        this.state = {
            jsonforms: {
                renderers: [],
                cells: [],
                uischemas: [],
                config: {},
                i18n: createDefaultI18nState(),
                readonly: false,
            },
        };
        this.subscribers = new Set();
        this.middleware = (state, action, defaultReducer) => defaultReducer(state, action);
        this.explicitUiSchema = false;
        this.validationMode = 'ValidateAndShow';
        this.additionalErrors = [];
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
        const uischema = options.uischema ?? generateDefaultUISchema(schema, 'VerticalLayout');
        this.reduceCore(Actions.init(options.data ?? {}, schema, uischema, this.coreOptions()));
    }
    subscribe(subscriber) {
        this.subscribers.add(subscriber);
        return () => {
            this.subscribers.delete(subscriber);
        };
    }
    getState() {
        return this.state;
    }
    dispatch(action) {
        const previous = this.state.jsonforms;
        let next = previous;
        if (coreActionTypes.has(action.type)) {
            next = {
                ...next,
                core: this.middleware(next.core, action, jsonFormsReducerConfig.core),
            };
        }
        switch (action.type) {
            case 'jsonforms/ADD_RENDERER':
            case 'jsonforms/REMOVE_RENDERER':
                next = {
                    ...next,
                    renderers: jsonFormsReducerConfig.renderers(next.renderers, action),
                };
                break;
            case 'jsonforms/ADD_CELL':
            case 'jsonforms/REMOVE_CELL':
                next = {
                    ...next,
                    cells: jsonFormsReducerConfig.cells(next.cells, action),
                };
                break;
            case 'jsonforms/SET_CONFIG':
                next = {
                    ...next,
                    config: jsonFormsReducerConfig.config(next.config, action),
                };
                break;
            case 'jsonforms/ADD_UI_SCHEMA':
            case 'jsonforms/REMOVE_UI_SCHEMA':
                next = {
                    ...next,
                    uischemas: jsonFormsReducerConfig.uischemas(next.uischemas, action),
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
            this.state = { jsonforms: next };
            this.notify();
        }
    }
    setData(data) {
        this.updateCoreState({ data });
    }
    setSchema(schema) {
        this.updateCoreState({ schema });
    }
    setUiSchema(uischema) {
        this.explicitUiSchema = uischema !== undefined;
        this.updateCoreState({ uischema });
    }
    setRenderers(renderers = []) {
        this.assignState({ renderers });
    }
    setCells(cells = []) {
        this.assignState({ cells });
    }
    setUiSchemas(uischemas = []) {
        this.assignState({ uischemas });
    }
    setReadonly(readonly) {
        this.assignState({ readonly });
    }
    setConfig(config) {
        this.assignState({ config });
    }
    setI18n(i18n = {}) {
        this.assignState({
            i18n: {
                ...createDefaultI18nState(),
                ...i18n,
            },
        });
    }
    setValidationMode(validationMode) {
        this.validationMode = validationMode;
        this.dispatch(Actions.setValidationMode(validationMode));
    }
    setAjv(ajv) {
        this.ajv = ajv;
        if (ajv !== undefined) {
            this.dispatch(Actions.setAjv(ajv));
        }
        else {
            this.updateCoreState({});
        }
    }
    setAdditionalErrors(additionalErrors = []) {
        this.additionalErrors = additionalErrors;
        this.updateCoreState({});
    }
    updateCoreState(next) {
        const core = this.state.jsonforms.core;
        const schema = next.schema ?? core?.schema ?? {};
        const shouldGenerateUiSchema = !this.explicitUiSchema || next.uischema === undefined;
        const uischema = shouldGenerateUiSchema
            ? generateDefaultUISchema(schema, 'VerticalLayout')
            : next.uischema ?? core?.uischema;
        this.reduceCore(Actions.updateCore(next.data ?? core?.data ?? {}, schema, uischema, this.coreOptions()));
    }
    reduceCore(action) {
        const previous = this.state.jsonforms;
        const core = this.middleware(previous.core, action, jsonFormsReducerConfig.core);
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
    coreOptions() {
        return {
            ajv: this.ajv,
            validationMode: this.validationMode,
            additionalErrors: this.additionalErrors,
        };
    }
    assignState(update) {
        this.state = {
            jsonforms: {
                ...this.state.jsonforms,
                ...update,
            },
        };
        this.notify();
    }
    notify() {
        for (const subscriber of this.subscribers) {
            subscriber();
        }
    }
}
//# sourceMappingURL=store.js.map