import { JsonFormsControl, JsonFormsLabel, JsonFormsLayout } from './base-renderers.js';
import type { LitJsonFormsRendererRegistryEntry } from './store.js';
export declare class JsonFormsVerticalLayoutRenderer extends JsonFormsLayout {
    protected render(): import("lit-html").TemplateResult<1>;
    protected renderLayout(className: string): import("lit-html").TemplateResult<1>;
}
export declare class JsonFormsHorizontalLayoutRenderer extends JsonFormsVerticalLayoutRenderer {
    protected render(): import("lit-html").TemplateResult<1>;
}
export declare class JsonFormsGroupLayoutRenderer extends JsonFormsVerticalLayoutRenderer {
    protected render(): import("lit-html").TemplateResult<1>;
}
export declare class JsonFormsLabelRenderer extends JsonFormsLabel {
    protected render(): import("lit-html").TemplateResult<1>;
}
export declare class JsonFormsTextControlRenderer extends JsonFormsControl {
    protected render(): import("lit-html").TemplateResult<1>;
    protected renderLabel(label: string, required?: boolean): import("lit-html").TemplateResult<1>;
    protected renderDescription(description?: string): import("lit-html").TemplateResult<1>;
    protected renderErrors(errors: string | string[] | undefined): import("lit-html").TemplateResult<1>;
}
export declare class JsonFormsNumberControlRenderer extends JsonFormsTextControlRenderer {
    protected render(): import("lit-html").TemplateResult<1>;
}
export declare class JsonFormsBooleanControlRenderer extends JsonFormsTextControlRenderer {
    protected render(): import("lit-html").TemplateResult<1>;
}
export declare class JsonFormsEnumControlRenderer extends JsonFormsTextControlRenderer {
    protected render(): import("lit-html").TemplateResult<1>;
}
export declare class JsonFormsUnknownRenderer extends JsonFormsLabel {
    protected render(): import("lit-html").TemplateResult<1>;
}
export declare const litRenderers: LitJsonFormsRendererRegistryEntry[];
//# sourceMappingURL=renderers.d.ts.map