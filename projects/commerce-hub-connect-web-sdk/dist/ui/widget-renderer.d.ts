import { CommerceHubConnectWidgetController } from '../core/controller';
export declare class CommerceHubConnectWidgetRenderer {
    private readonly hostElement;
    private readonly controller;
    private readonly unsubscribe;
    private lastRenderedStepKey;
    constructor(hostElement: HTMLElement, controller: CommerceHubConnectWidgetController);
    destroy(): void;
    private readonly handleClick;
    private readonly handleSubmit;
    private readonly handleInput;
    private readonly handleChange;
    private readonly handleBlur;
    private readonly handleKeydown;
    private readonly handlePaste;
    private render;
}
