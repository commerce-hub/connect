import type {
  CommerceHubConnectEnvironment,
  CommerceHubSdkConfiguration,
  InteractionResponse,
  CommerceHubWhiteLabelOptions,
} from 'commerce-hub-connect-sdk';

export interface CommerceHubConnectWebSdkMountOptions {
  interaction: InteractionResponse;
  configuration: CommerceHubSdkConfiguration;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  replaceContents?: boolean;
}

export interface CommerceHubConnectWebSdkElementOptions
  extends Omit<CommerceHubConnectWebSdkMountOptions, 'replaceContents'> {
  environment?: CommerceHubConnectEnvironment;
}
