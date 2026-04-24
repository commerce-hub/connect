import type {
  CommerceHubConnectEnvironment,
  CommerceHubSdkConfiguration,
  CommerceHubWhiteLabelOptions,
} from 'commerce-hub-connect-sdk';

export interface CommerceHubConnectWebSdkMountOptions {
  configuration: CommerceHubSdkConfiguration;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  replaceContents?: boolean;
}

export interface CommerceHubConnectWebSdkElementOptions
  extends Omit<CommerceHubConnectWebSdkMountOptions, 'replaceContents'> {
  environment?: CommerceHubConnectEnvironment;
}
