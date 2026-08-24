import {html, type TemplateResult} from 'lit';

import {
  renderAlert,
  renderButton,
  renderOtpGroup,
  renderOtpResend,
} from '../primitives.js';
import type {OtpScreenModel} from '../types.js';
import {
  createTranslator,
  type Translator,
} from '../localization/localization.js';

export const defaultOtpSubtitle = (
  destination?: string,
  translator: Translator = createTranslator()
): string =>
  translator.message('otp.sentTo', {
    destination: destination ?? translator.message('otp.contactMethod'),
  });

export const findOtpInput = (event: Event): HTMLInputElement | undefined =>
  event
    .composedPath()
    .find(
      (item): item is HTMLInputElement =>
        item instanceof HTMLInputElement && item.classList.contains('otp-input')
    );

export const renderOtpScreen = ({
  status,
  value,
  length,
  failedMessage,
  copy,
  submitting = false,
  resending = false,
}: OtpScreenModel): TemplateResult => {
  const isFailed = status === 'OTP_VALIDATION_FAILED';

  return html`
    <form class="otp-flow" data-submit-action="verify-otp">
      ${isFailed
        ? renderAlert({
            variant: 'danger',
            message: failedMessage ?? copy.failedMessage,
          })
        : ''}
      ${renderOtpGroup({
        label: copy.verificationCodeLabel ?? 'Verification code',
        value,
        length,
        disabled: submitting,
        error: isFailed,
        digitLabel: copy.digitLabel,
      })}
      <div class="primitive-footer">
        ${renderButton({
          label: submitting
            ? copy.verifyingButton
            : isFailed
            ? copy.tryAgainButton
            : copy.verifyButton,
          icon: !submitting && !isFailed ? 'check' : undefined,
          variant: 'primary',
          action: 'verify-otp',
          type: 'submit',
          loading: submitting,
          disabled: submitting || value.length < length,
        })}
      </div>
      <div class="otp-support">
        <p class="otp-support-copy otp-resend-prefix">${copy.resendPrefix}</p>
        <div class="otp-support-actions">
          ${renderOtpResend({
            label: resending ? copy.resendPendingButton : copy.resendButton,
            action: 'resend-otp',
            loading: resending,
            disabled: submitting || resending,
          })}
        </div>
      </div>
    </form>
  `;
};
