import { useEffect, useRef } from 'react';
import {
  mount,
  type CommerceHubConnectEnvironment,
  type CommerceHubConnectWebSdkInstance,
  type CommerceHubConnectWebSdkMountOptions,
  type CommerceHubSdkError,
} from 'commerce-hub-connect-web-sdk';

export interface CommerceHubConnectReactBindingProps
  extends CommerceHubConnectWebSdkMountOptions {
  environment?: CommerceHubConnectEnvironment;
  className?: string;
  onMountError?: (error: CommerceHubSdkError) => void;
}

export function CommerceHubConnectReactBinding({
  interaction,
  configuration,
  whiteLabel,
  replaceContents = true,
  environment,
  className,
  onMountError,
}: CommerceHubConnectReactBindingProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<CommerceHubConnectWebSdkInstance | null>(null);
  const queueRef = useRef(Promise.resolve());
  const mountedRef = useRef(false);
  const latestPropsRef = useRef<CommerceHubConnectReactBindingProps>({
    interaction,
    configuration,
    whiteLabel,
    replaceContents,
    environment,
    className,
    onMountError,
  });

  latestPropsRef.current = {
    interaction,
    configuration,
    whiteLabel,
    replaceContents,
    environment,
    className,
    onMountError,
  };

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      queueRef.current = queueRef.current.finally(async () => {
        instanceRef.current?.destroy();
        instanceRef.current = null;
      });
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      return;
    }

    queueRef.current = queueRef.current
      .then(async () => {
        const target = containerRef.current;
        if (!target) {
          return;
        }

        const currentProps = latestPropsRef.current;
        const mountOptions: CommerceHubConnectWebSdkMountOptions = {
          interaction: currentProps.interaction,
          configuration: currentProps.configuration,
          whiteLabel: currentProps.whiteLabel,
          replaceContents: currentProps.replaceContents,
        };

        if (!instanceRef.current) {
          instanceRef.current = await mount(target, mountOptions, currentProps.environment);
          return;
        }

        await instanceRef.current.update(mountOptions, currentProps.environment);
      })
      .catch((mountError: unknown) => {
        const sdkError = normalizeSdkError(mountError);
        latestPropsRef.current.configuration.onError(sdkError);
        latestPropsRef.current.onMountError?.(sdkError);
      });
  }, [interaction, configuration, whiteLabel, replaceContents, environment, onMountError]);

  return (
    <div
      ref={containerRef}
      className={className}
      data-commerce-hub-connect-react-binding="true"
    />
  );
}

function normalizeSdkError(mountError: unknown): CommerceHubSdkError {
  if (isSdkError(mountError)) {
    return mountError;
  }

  return {
    message:
      mountError instanceof Error
        ? mountError.message
        : 'Unable to mount Commerce Hub Connect React binding.',
    stage: 'mount',
    cause: mountError,
  };
}

function isSdkError(value: unknown): value is CommerceHubSdkError {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'stage' in value &&
      typeof (value as { stage?: unknown }).stage === 'string' &&
      'message' in value &&
      typeof (value as { message?: unknown }).message === 'string',
  );
}
