import { CommerceHubConnectWidgetController } from '../core/controller';
export declare class CommerceHubConnectWidgetRenderer {
    private readonly hostElement;
    private readonly controller;
    private readonly unsubscribe;
    constructor(hostElement: HTMLElement, controller: CommerceHubConnectWidgetController);
    destroy(): void;
    private readonly handleClick;
    private readonly handleSubmit;
    private render;
}
