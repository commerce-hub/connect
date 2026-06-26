var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NOT_APPLICABLE, mapStateToJsonFormsRendererProps, } from '@jsonforms/core';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
let JsonFormsDispatch = class JsonFormsDispatch extends LitElement {
    constructor() {
        super(...arguments);
        this.path = '';
        this.enabled = true;
        this.readonly = false;
        this.visible = true;
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        this.syncSubscription();
        this.updateRenderer();
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
        super.disconnectedCallback();
    }
    updated(changedProperties) {
        if (changedProperties.has('store')) {
            this.syncSubscription();
        }
        if (changedProperties.size > 0) {
            this.updateRenderer();
        }
    }
    render() {
        if (this.store === undefined) {
            return html ``;
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
            return html ``;
        }
        const tagName = this.selectedRenderer ?? 'jsonforms-lit-unknown-renderer';
        const tag = unsafeStatic(tagName);
        return staticHtml `
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
    updateRenderer() {
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
        let bestRenderer;
        const renderers = props.renderers ?? [];
        for (const entry of renderers) {
            const rank = entry.tester(props.uischema, props.schema ?? {}, {
                rootSchema: props.rootSchema,
                config: props.config,
            });
            if (rank > bestRank) {
                bestRank = rank;
                bestRenderer = entry.renderer;
            }
        }
        this.selectedRenderer =
            bestRank === NOT_APPLICABLE ? undefined : bestRenderer;
    }
    syncSubscription() {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
        if (this.store !== undefined && this.isConnected) {
            this.unsubscribe = this.store.subscribe(() => {
                this.updateRenderer();
                this.requestUpdate();
            });
        }
    }
};
__decorate([
    property({ attribute: false })
], JsonFormsDispatch.prototype, "store", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsDispatch.prototype, "uischema", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsDispatch.prototype, "schema", void 0);
__decorate([
    property({ type: String })
], JsonFormsDispatch.prototype, "path", void 0);
__decorate([
    property({ type: Boolean })
], JsonFormsDispatch.prototype, "enabled", void 0);
__decorate([
    property({ type: Boolean })
], JsonFormsDispatch.prototype, "readonly", void 0);
__decorate([
    property({ type: Boolean })
], JsonFormsDispatch.prototype, "visible", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsDispatch.prototype, "renderers", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsDispatch.prototype, "cells", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsDispatch.prototype, "uischemas", void 0);
__decorate([
    state()
], JsonFormsDispatch.prototype, "selectedRenderer", void 0);
JsonFormsDispatch = __decorate([
    customElement('jsonforms-lit-dispatch')
], JsonFormsDispatch);
export { JsonFormsDispatch };
//# sourceMappingURL=dispatch.js.map