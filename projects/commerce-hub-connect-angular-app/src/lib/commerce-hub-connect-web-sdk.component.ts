import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import type {
  InteractionResponse,
  CommerceHubSdkConfiguration,
  CommerceHubSdkError,
  CommerceHubSuccessResult,
  CommerceHubWhiteLabelOptions,
  CommerceHubConnectEnvironment,
  CommerceHubConnectWebSdkMountOptions,
  CommerceHubConnectWebSdkInstance,
} from './commerce-hub-connect-web-sdk-types';
import { commerceHubConnectWebSdkAdapter } from './commerce-hub-connect-web-sdk-adapter';

@Component({
  selector: 'commerce-hub-connect-web-sdk',
  standalone: true,
  template: '<div #mountHost class="commerce-hub-connect-angular-binding"></div>',
  host: {
    'data-commerce-hub-connect-angular-binding': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommerceHubConnectWebSdkComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) interaction: InteractionResponse | null = null;
  @Input({ required: true }) configuration: CommerceHubSdkConfiguration | null = null;
  @Input() whiteLabel?: CommerceHubWhiteLabelOptions;
  @Input() environment?: CommerceHubConnectEnvironment;
  @Input() replaceContents = true;
  @Input() sdkScriptUrl = './CommerceHubConnectSDK.js';

  @Output() readonly success = new EventEmitter<CommerceHubSuccessResult>();
  @Output() readonly error = new EventEmitter<CommerceHubSdkError>();

  @ViewChild('mountHost', { static: true })
  private readonly mountHost?: ElementRef<HTMLDivElement>;

  private instance: CommerceHubConnectWebSdkInstance | null = null;
  private renderQueue = Promise.resolve();
  private viewReady = false;
  private destroyed = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.scheduleRender();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.viewReady) {
      return;
    }

    this.scheduleRender();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.renderQueue = this.renderQueue.finally(async () => {
      this.instance?.destroy();
      this.instance = null;
    });
  }

  private scheduleRender(): void {
    if (this.destroyed || !this.viewReady) {
      return;
    }

    const options = this.buildMountOptions();
    if (!options) {
      this.renderQueue = this.renderQueue.finally(async () => {
        this.instance?.destroy();
        this.instance = null;
      });
      return;
    }

    this.renderQueue = this.renderQueue
      .then(async () => {
        if (this.destroyed || !this.mountHost) {
          return;
        }

        if (!this.instance) {
          this.instance = await commerceHubConnectWebSdkAdapter.mount(
            this.mountHost.nativeElement,
            options,
            this.environment,
            this.sdkScriptUrl,
          );
          return;
        }

        await this.instance.update(options, this.environment);
      })
      .catch((mountError: unknown) => {
        this.handleMountError(mountError);
      });
  }

  private buildMountOptions(): CommerceHubConnectWebSdkMountOptions | null {
    if (!this.interaction || !this.configuration) {
      return null;
    }

    const configuration = this.configuration;

    return {
      interaction: this.interaction,
      configuration: {
        ...configuration,
        onSuccess: (result) => {
          configuration.onSuccess(result);
          this.success.emit(result);
        },
        onError: (sdkError) => {
          configuration.onError(sdkError);
          this.error.emit(sdkError);
        },
      },
      whiteLabel: this.whiteLabel,
      replaceContents: this.replaceContents,
    };
  }

  private handleMountError(mountError: unknown): void {
    const sdkError = this.normalizeSdkError(mountError);
    this.instance = null;

    if (this.configuration) {
      this.configuration.onError(sdkError);
    }

    this.error.emit(sdkError);
  }

  private normalizeSdkError(mountError: unknown): CommerceHubSdkError {
    if (isSdkError(mountError)) {
      return mountError;
    }

    return {
      message:
        mountError instanceof Error
          ? mountError.message
          : 'Unable to mount Commerce Hub Connect widget.',
      stage: 'mount',
      cause: mountError,
    };
  }
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
