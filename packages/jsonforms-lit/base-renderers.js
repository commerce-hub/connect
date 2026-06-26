var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Actions, mapStateToControlProps, mapStateToJsonFormsRendererProps, mapStateToLabelProps, mapStateToLayoutProps, Id, } from '@jsonforms/core';
import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
const storeAwareProperties = new Set([
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
    constructor() {
        super(...arguments);
        this.path = '';
        this.enabled = true;
        this.readonly = false;
        this.visible = true;
        this.id = '';
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        this.syncSubscription();
        this.updateMappedProps();
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
        super.disconnectedCallback();
    }
    updated(changedProperties) {
        if ([...changedProperties.keys()].some((key) => storeAwareProperties.has(key))) {
            this.syncSubscription();
            this.updateMappedProps();
        }
    }
    mapStateToProps(state) {
        return mapStateToJsonFormsRendererProps(state, this.ownProps());
    }
    updateMappedProps() {
        if (this.store === undefined) {
            return;
        }
        this.rendererProps = this.mapStateToProps(this.store.getState());
    }
    ownProps() {
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
    syncSubscription() {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
        if (this.store !== undefined && this.isConnected) {
            this.unsubscribe = this.store.subscribe(() => this.updateMappedProps());
        }
    }
}
__decorate([
    property({ attribute: false })
], JsonFormsBaseRenderer.prototype, "store", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsBaseRenderer.prototype, "uischema", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsBaseRenderer.prototype, "schema", void 0);
__decorate([
    property({ type: String })
], JsonFormsBaseRenderer.prototype, "path", void 0);
__decorate([
    property({ type: Boolean })
], JsonFormsBaseRenderer.prototype, "enabled", void 0);
__decorate([
    property({ type: Boolean })
], JsonFormsBaseRenderer.prototype, "readonly", void 0);
__decorate([
    property({ type: Boolean })
], JsonFormsBaseRenderer.prototype, "visible", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsBaseRenderer.prototype, "renderers", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsBaseRenderer.prototype, "cells", void 0);
__decorate([
    property({ attribute: false })
], JsonFormsBaseRenderer.prototype, "uischemas", void 0);
__decorate([
    property({ type: String })
], JsonFormsBaseRenderer.prototype, "id", void 0);
__decorate([
    state()
], JsonFormsBaseRenderer.prototype, "rendererProps", void 0);
export class JsonFormsControl extends JsonFormsBaseRenderer {
    connectedCallback() {
        super.connectedCallback();
        this.ensureId();
    }
    disconnectedCallback() {
        if (this.generatedId !== undefined) {
            Id.removeId(this.generatedId);
            this.generatedId = undefined;
        }
        super.disconnectedCallback();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if ([...changedProperties.keys()].some((key) => storeAwareProperties.has(key))) {
            this.ensureId();
            this.updateMappedProps();
        }
    }
    mapStateToProps(state) {
        const props = mapStateToControlProps(state, this.controlOwnProps());
        return {
            ...props,
            handleChange: (path, value) => {
                this.store?.dispatch(Actions.update(path, () => value));
            },
        };
    }
    updateMappedProps() {
        if (this.store === undefined) {
            return;
        }
        this.controlProps = this.mapStateToProps(this.store.getState());
        this.rendererProps = this.controlProps;
    }
    controlOwnProps() {
        return {
            ...this.ownProps(),
            id: this.id,
            uischema: this.uischema,
        };
    }
    ensureId() {
        if (!this.id && this.uischema !== undefined) {
            this.generatedId = Id.createId(this.path || 'jsonforms-control');
            this.id = this.generatedId;
        }
    }
}
__decorate([
    state()
], JsonFormsControl.prototype, "controlProps", void 0);
export class JsonFormsArrayControl extends JsonFormsControl {
}
export class JsonFormsLayout extends JsonFormsBaseRenderer {
    mapStateToProps(state) {
        return mapStateToLayoutProps(state, {
            ...this.ownProps(),
            uischema: this.uischema,
        });
    }
    updateMappedProps() {
        if (this.store === undefined) {
            return;
        }
        this.layoutProps = this.mapStateToProps(this.store.getState());
        this.rendererProps = this.layoutProps;
    }
}
__decorate([
    state()
], JsonFormsLayout.prototype, "layoutProps", void 0);
export class JsonFormsLabel extends JsonFormsBaseRenderer {
    mapStateToProps(state) {
        return mapStateToLabelProps(state, {
            ...this.ownProps(),
            uischema: this.uischema,
        });
    }
    updateMappedProps() {
        if (this.store === undefined) {
            return;
        }
        this.labelProps = this.mapStateToProps(this.store.getState());
        this.rendererProps = this.labelProps;
    }
}
__decorate([
    state()
], JsonFormsLabel.prototype, "labelProps", void 0);
//# sourceMappingURL=base-renderers.js.map