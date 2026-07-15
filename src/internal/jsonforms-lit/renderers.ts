import {
  and,
  isBooleanControl,
  isEnumControl,
  isIntegerControl,
  isNumberControl,
  isStringControl,
  rankWith,
  uiTypeIs,
  type Layout,
} from '@jsonforms/core';
import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {
  JsonFormsControl,
  JsonFormsLabel,
  JsonFormsLayout,
} from './base-renderers.js';
import {JsonFormsDispatch} from './dispatch.js';
import type {LitJsonFormsRendererRegistryEntry} from './store.js';

void JsonFormsDispatch;

const layoutStyles = {
  vertical: 'jsonforms-layout jsonforms-layout-vertical',
  horizontal: 'jsonforms-layout jsonforms-layout-horizontal',
  group: 'jsonforms-layout jsonforms-group',
};

@customElement('jsonforms-lit-vertical-layout')
export class JsonFormsVerticalLayoutRenderer extends JsonFormsLayout {
  protected override render() {
    return this.renderLayout(layoutStyles.vertical);
  }

  protected renderLayout(className: string) {
    const props = this.layoutProps;
    if (props === undefined || props.visible === false) {
      return html``;
    }
    const layout = props.uischema as Layout;
    return html`
      <div class=${className}>
        ${props.label ? html`<div class="jsonforms-group-label">${props.label}</div>` : ''}
        ${layout.elements?.map(
          (element) => html`
            <jsonforms-lit-dispatch
              .store=${this.store}
              .uischema=${element}
              .schema=${props.schema}
              .path=${props.path ?? ''}
              .enabled=${props.enabled ?? true}
              .readonly=${props.readonly ?? false}
              .renderers=${props.renderers}
              .cells=${props.cells}
            ></jsonforms-lit-dispatch>
          `
        )}
      </div>
    `;
  }
}

@customElement('jsonforms-lit-horizontal-layout')
export class JsonFormsHorizontalLayoutRenderer extends JsonFormsVerticalLayoutRenderer {
  protected override render() {
    return this.renderLayout(layoutStyles.horizontal);
  }
}

@customElement('jsonforms-lit-group-layout')
export class JsonFormsGroupLayoutRenderer extends JsonFormsVerticalLayoutRenderer {
  protected override render() {
    return this.renderLayout(layoutStyles.group);
  }
}

@customElement('jsonforms-lit-label')
export class JsonFormsLabelRenderer extends JsonFormsLabel {
  protected override render() {
    if (this.labelProps === undefined || this.labelProps.visible === false) {
      return html``;
    }
    return html`<span class="jsonforms-label">${this.labelProps.text}</span>`;
  }
}

@customElement('jsonforms-lit-text-control')
export class JsonFormsTextControlRenderer extends JsonFormsControl {
  protected override render() {
    const props = this.controlProps;
    if (props === undefined || props.visible === false) {
      return html``;
    }
    const hasErrors = Array.isArray(props.errors)
      ? props.errors.length > 0
      : Boolean(props.errors);
    const descriptionId = props.description
      ? `${props.id}-description`
      : undefined;
    const errorId = hasErrors ? `${props.id}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ');

    return html`
      <div class="jsonforms-control">
        ${this.renderLabel(props.label, props.required)}
        <input
          id=${props.id}
          name=${props.path}
          type="text"
          .value=${props.data ?? ''}
          ?disabled=${!props.enabled || props.readonly}
          ?required=${props.required}
          aria-invalid=${hasErrors ? 'true' : 'false'}
          aria-describedby=${ifDefined(describedBy || undefined)}
          @input=${(event: Event) =>
            props.handleChange(
              props.path,
              (event.currentTarget as HTMLInputElement).value
            )}
        />
        ${this.renderDescription(props.description, descriptionId)}
        ${this.renderErrors(props.errors, errorId)}
      </div>
    `;
  }

  protected renderLabel(label: string, required?: boolean) {
    return html`<label for=${this.controlProps?.id ?? ''}>
      ${label}${required && !label.endsWith('*') ? '*' : ''}
    </label>`;
  }

  protected renderDescription(description?: string, id?: string) {
    return description
      ? html`<div class="jsonforms-description" id=${ifDefined(id)}>
          ${description}
        </div>`
      : html``;
  }

  protected renderErrors(errors: string | string[] | undefined, id?: string) {
    const text = Array.isArray(errors) ? errors.join('\n') : errors;
    return text
      ? html`<div class="jsonforms-error" id=${ifDefined(id)}>${text}</div>`
      : html``;
  }
}

@customElement('jsonforms-lit-number-control')
export class JsonFormsNumberControlRenderer extends JsonFormsTextControlRenderer {
  protected override render() {
    const props = this.controlProps;
    if (props === undefined || props.visible === false) {
      return html``;
    }
    return html`
      <div class="jsonforms-control">
        ${this.renderLabel(props.label, props.required)}
        <input
          id=${props.id}
          name=${props.path}
          type="number"
          .value=${props.data ?? ''}
          ?disabled=${!props.enabled || props.readonly}
          @input=${(event: Event) => {
            const value = (event.currentTarget as HTMLInputElement).value;
            props.handleChange(props.path, value === '' ? undefined : Number(value));
          }}
        />
        ${this.renderDescription(props.description)}
        ${this.renderErrors(props.errors)}
      </div>
    `;
  }
}

@customElement('jsonforms-lit-boolean-control')
export class JsonFormsBooleanControlRenderer extends JsonFormsTextControlRenderer {
  protected override render() {
    const props = this.controlProps;
    if (props === undefined || props.visible === false) {
      return html``;
    }
    return html`
      <div class="jsonforms-control jsonforms-control-checkbox">
        <label for=${props.id}>
          <input
            id=${props.id}
            name=${props.path}
            type="checkbox"
            .checked=${Boolean(props.data)}
            ?disabled=${!props.enabled || props.readonly}
            @change=${(event: Event) =>
              props.handleChange(
                props.path,
                (event.currentTarget as HTMLInputElement).checked
              )}
          />
          ${props.label}${props.required && !props.label.endsWith('*') ? '*' : ''}
        </label>
        ${this.renderDescription(props.description)}
        ${this.renderErrors(props.errors)}
      </div>
    `;
  }
}

@customElement('jsonforms-lit-enum-control')
export class JsonFormsEnumControlRenderer extends JsonFormsTextControlRenderer {
  protected override render() {
    const props = this.controlProps;
    if (props === undefined || props.visible === false) {
      return html``;
    }
    const options = props.schema.enum ?? [];
    return html`
      <div class="jsonforms-control">
        ${this.renderLabel(props.label, props.required)}
        <select
          id=${props.id}
          name=${props.path}
          .value=${props.data ?? ''}
          ?disabled=${!props.enabled || props.readonly}
          @change=${(event: Event) =>
            props.handleChange(
              props.path,
              (event.currentTarget as HTMLSelectElement).value
            )}
        >
          ${options.map(
            (option) => html`
              <option value=${String(option)} ?selected=${option === props.data}>
                ${String(option)}
              </option>
            `
          )}
        </select>
        ${this.renderDescription(props.description)}
        ${this.renderErrors(props.errors)}
      </div>
    `;
  }
}

@customElement('jsonforms-lit-unknown-renderer')
export class JsonFormsUnknownRenderer extends JsonFormsLabel {
  protected override render() {
    const type = this.uischema?.type ?? 'unknown';
    return html`<div class="jsonforms-unknown-renderer">
      No renderer found for ${type}
    </div>`;
  }
}

export const litRenderers: LitJsonFormsRendererRegistryEntry[] = [
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
