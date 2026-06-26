var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { and, isBooleanControl, isEnumControl, isIntegerControl, isNumberControl, isStringControl, rankWith, uiTypeIs, } from '@jsonforms/core';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { JsonFormsControl, JsonFormsLabel, JsonFormsLayout, } from './base-renderers.js';
const layoutStyles = {
    vertical: 'jsonforms-layout jsonforms-layout-vertical',
    horizontal: 'jsonforms-layout jsonforms-layout-horizontal',
    group: 'jsonforms-layout jsonforms-group',
};
let JsonFormsVerticalLayoutRenderer = class JsonFormsVerticalLayoutRenderer extends JsonFormsLayout {
    render() {
        return this.renderLayout(layoutStyles.vertical);
    }
    renderLayout(className) {
        const props = this.layoutProps;
        if (props === undefined || props.visible === false) {
            return html ``;
        }
        const layout = props.uischema;
        return html `
      <div class=${className}>
        ${props.label ? html `<div class="jsonforms-group-label">${props.label}</div>` : ''}
        ${layout.elements?.map((element) => html `
            <jsonforms-lit-dispatch
              .store=${this.store}
              .uischema=${element}
              .schema=${props.schema}
              .path=${props.path ?? ''}
              .enabled=${props.enabled}
              .readonly=${props.readonly}
              .renderers=${props.renderers}
              .cells=${props.cells}
            ></jsonforms-lit-dispatch>
          `)}
      </div>
    `;
    }
};
JsonFormsVerticalLayoutRenderer = __decorate([
    customElement('jsonforms-lit-vertical-layout')
], JsonFormsVerticalLayoutRenderer);
export { JsonFormsVerticalLayoutRenderer };
let JsonFormsHorizontalLayoutRenderer = class JsonFormsHorizontalLayoutRenderer extends JsonFormsVerticalLayoutRenderer {
    render() {
        return this.renderLayout(layoutStyles.horizontal);
    }
};
JsonFormsHorizontalLayoutRenderer = __decorate([
    customElement('jsonforms-lit-horizontal-layout')
], JsonFormsHorizontalLayoutRenderer);
export { JsonFormsHorizontalLayoutRenderer };
let JsonFormsGroupLayoutRenderer = class JsonFormsGroupLayoutRenderer extends JsonFormsVerticalLayoutRenderer {
    render() {
        return this.renderLayout(layoutStyles.group);
    }
};
JsonFormsGroupLayoutRenderer = __decorate([
    customElement('jsonforms-lit-group-layout')
], JsonFormsGroupLayoutRenderer);
export { JsonFormsGroupLayoutRenderer };
let JsonFormsLabelRenderer = class JsonFormsLabelRenderer extends JsonFormsLabel {
    render() {
        if (this.labelProps === undefined || this.labelProps.visible === false) {
            return html ``;
        }
        return html `<span class="jsonforms-label">${this.labelProps.text}</span>`;
    }
};
JsonFormsLabelRenderer = __decorate([
    customElement('jsonforms-lit-label')
], JsonFormsLabelRenderer);
export { JsonFormsLabelRenderer };
let JsonFormsTextControlRenderer = class JsonFormsTextControlRenderer extends JsonFormsControl {
    render() {
        const props = this.controlProps;
        if (props === undefined || props.visible === false) {
            return html ``;
        }
        return html `
      <div class="jsonforms-control">
        ${this.renderLabel(props.label, props.required)}
        <input
          id=${props.id}
          name=${props.path}
          type="text"
          .value=${props.data ?? ''}
          ?disabled=${!props.enabled || props.readonly}
          @input=${(event) => props.handleChange(props.path, event.currentTarget.value)}
        />
        ${this.renderDescription(props.description)}
        ${this.renderErrors(props.errors)}
      </div>
    `;
    }
    renderLabel(label, required) {
        return html `<label for=${this.controlProps?.id ?? ''}>
      ${label}${required && !label.endsWith('*') ? '*' : ''}
    </label>`;
    }
    renderDescription(description) {
        return description
            ? html `<div class="jsonforms-description">${description}</div>`
            : html ``;
    }
    renderErrors(errors) {
        const text = Array.isArray(errors) ? errors.join('\n') : errors;
        return text ? html `<div class="jsonforms-error">${text}</div>` : html ``;
    }
};
JsonFormsTextControlRenderer = __decorate([
    customElement('jsonforms-lit-text-control')
], JsonFormsTextControlRenderer);
export { JsonFormsTextControlRenderer };
let JsonFormsNumberControlRenderer = class JsonFormsNumberControlRenderer extends JsonFormsTextControlRenderer {
    render() {
        const props = this.controlProps;
        if (props === undefined || props.visible === false) {
            return html ``;
        }
        return html `
      <div class="jsonforms-control">
        ${this.renderLabel(props.label, props.required)}
        <input
          id=${props.id}
          name=${props.path}
          type="number"
          .value=${props.data ?? ''}
          ?disabled=${!props.enabled || props.readonly}
          @input=${(event) => {
            const value = event.currentTarget.value;
            props.handleChange(props.path, value === '' ? undefined : Number(value));
        }}
        />
        ${this.renderDescription(props.description)}
        ${this.renderErrors(props.errors)}
      </div>
    `;
    }
};
JsonFormsNumberControlRenderer = __decorate([
    customElement('jsonforms-lit-number-control')
], JsonFormsNumberControlRenderer);
export { JsonFormsNumberControlRenderer };
let JsonFormsBooleanControlRenderer = class JsonFormsBooleanControlRenderer extends JsonFormsTextControlRenderer {
    render() {
        const props = this.controlProps;
        if (props === undefined || props.visible === false) {
            return html ``;
        }
        return html `
      <div class="jsonforms-control jsonforms-control-checkbox">
        <label for=${props.id}>
          <input
            id=${props.id}
            name=${props.path}
            type="checkbox"
            .checked=${Boolean(props.data)}
            ?disabled=${!props.enabled || props.readonly}
            @change=${(event) => props.handleChange(props.path, event.currentTarget.checked)}
          />
          ${props.label}${props.required && !props.label.endsWith('*') ? '*' : ''}
        </label>
        ${this.renderDescription(props.description)}
        ${this.renderErrors(props.errors)}
      </div>
    `;
    }
};
JsonFormsBooleanControlRenderer = __decorate([
    customElement('jsonforms-lit-boolean-control')
], JsonFormsBooleanControlRenderer);
export { JsonFormsBooleanControlRenderer };
let JsonFormsEnumControlRenderer = class JsonFormsEnumControlRenderer extends JsonFormsTextControlRenderer {
    render() {
        const props = this.controlProps;
        if (props === undefined || props.visible === false) {
            return html ``;
        }
        const options = props.schema.enum ?? [];
        return html `
      <div class="jsonforms-control">
        ${this.renderLabel(props.label, props.required)}
        <select
          id=${props.id}
          name=${props.path}
          .value=${props.data ?? ''}
          ?disabled=${!props.enabled || props.readonly}
          @change=${(event) => props.handleChange(props.path, event.currentTarget.value)}
        >
          ${options.map((option) => html `
              <option value=${String(option)} ?selected=${option === props.data}>
                ${String(option)}
              </option>
            `)}
        </select>
        ${this.renderDescription(props.description)}
        ${this.renderErrors(props.errors)}
      </div>
    `;
    }
};
JsonFormsEnumControlRenderer = __decorate([
    customElement('jsonforms-lit-enum-control')
], JsonFormsEnumControlRenderer);
export { JsonFormsEnumControlRenderer };
let JsonFormsUnknownRenderer = class JsonFormsUnknownRenderer extends JsonFormsLabel {
    render() {
        const type = this.uischema?.type ?? 'unknown';
        return html `<div class="jsonforms-unknown-renderer">
      No renderer found for ${type}
    </div>`;
    }
};
JsonFormsUnknownRenderer = __decorate([
    customElement('jsonforms-lit-unknown-renderer')
], JsonFormsUnknownRenderer);
export { JsonFormsUnknownRenderer };
export const litRenderers = [
    {
        tester: rankWith(1, uiTypeIs('VerticalLayout')),
        renderer: 'jsonforms-lit-vertical-layout',
    },
    {
        tester: rankWith(1, uiTypeIs('HorizontalLayout')),
        renderer: 'jsonforms-lit-horizontal-layout',
    },
    {
        tester: rankWith(1, uiTypeIs('Group')),
        renderer: 'jsonforms-lit-group-layout',
    },
    {
        tester: rankWith(1, uiTypeIs('Label')),
        renderer: 'jsonforms-lit-label',
    },
    {
        tester: rankWith(4, isEnumControl),
        renderer: 'jsonforms-lit-enum-control',
    },
    {
        tester: rankWith(3, isStringControl),
        renderer: 'jsonforms-lit-text-control',
    },
    {
        tester: rankWith(3, and(isNumberControl, uiTypeIs('Control'))),
        renderer: 'jsonforms-lit-number-control',
    },
    {
        tester: rankWith(3, and(isIntegerControl, uiTypeIs('Control'))),
        renderer: 'jsonforms-lit-number-control',
    },
    {
        tester: rankWith(3, isBooleanControl),
        renderer: 'jsonforms-lit-boolean-control',
    },
];
//# sourceMappingURL=renderers.js.map