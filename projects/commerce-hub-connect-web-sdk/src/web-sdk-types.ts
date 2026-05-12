import type { CommerceHubConnectEnvironment } from './contracts/environment';
import type {
  CommerceHubSdkConfiguration,
  CommerceHubWhiteLabelOptions,
} from './contracts/sdk-models';
import type { InteractionResponse } from './contracts/api-models';

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
