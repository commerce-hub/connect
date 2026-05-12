import { type CommerceHubConnectEnvironment, type CommerceHubConnectWebSdkMountOptions, type CommerceHubSdkError } from 'commerce-hub-connect-web-sdk';
export interface CommerceHubConnectReactBindingProps extends CommerceHubConnectWebSdkMountOptions {
    environment?: CommerceHubConnectEnvironment;
    className?: string;
    onMountError?: (error: CommerceHubSdkError) => void;
}
export declare function CommerceHubConnectReactBinding({ interaction, configuration, whiteLabel, replaceContents, environment, className, onMountError, }: CommerceHubConnectReactBindingProps): import("react/jsx-runtime").JSX.Element;
