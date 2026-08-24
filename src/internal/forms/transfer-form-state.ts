import type {
  TransferDraft,
  TransferDraftErrors,
  TransferSource,
} from '../types.js';
import {
  createTranslator,
  type Translator,
} from '../localization/localization.js';

export const TRANSFER_CURRENCY = 'USD';

export const createTransferDraft = (): TransferDraft => ({
  fromSourceId: '',
  toSourceId: '',
  amount: '',
});

export const normalizeTransferDraft = (
  draft: TransferDraft
): TransferDraft => ({
  fromSourceId: draft.fromSourceId.trim(),
  toSourceId: draft.toSourceId.trim(),
  amount: draft.amount.trim(),
});

export const validateTransferDraft = (
  draft: TransferDraft,
  sources: readonly TransferSource[],
  translator: Translator = createTranslator()
): TransferDraftErrors => {
  const errors: TransferDraftErrors = {};
  const sourceIds = new Set(sources.map((source) => source.id));
  const amount = Number(draft.amount);

  if (!draft.fromSourceId) {
    errors.fromSourceId = translator.message('transfer.error.sourceRequired');
  } else if (!sourceIds.has(draft.fromSourceId)) {
    errors.fromSourceId = translator.message('transfer.error.sourceInvalid');
  }

  if (!draft.toSourceId) {
    errors.toSourceId = translator.message(
      'transfer.error.destinationRequired'
    );
  } else if (!sourceIds.has(draft.toSourceId)) {
    errors.toSourceId = translator.message('transfer.error.destinationInvalid');
  } else if (draft.toSourceId === draft.fromSourceId) {
    errors.toSourceId = translator.message('transfer.error.destinationSame');
  }

  if (!draft.amount) {
    errors.amount = translator.message('transfer.error.amountRequired');
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = translator.message('transfer.error.amountPositive');
  }

  return errors;
};

export const isTransferDraftReady = (
  draft: TransferDraft,
  sources: readonly TransferSource[]
): boolean =>
  Object.keys(validateTransferDraft(normalizeTransferDraft(draft), sources))
    .length === 0;

export const hasRequiredTransferDraftValues = (draft: TransferDraft): boolean =>
  [draft.fromSourceId, draft.toSourceId, draft.amount].every((value) =>
    Boolean(value.trim())
  );

export const formatTransferAmountForReview = (
  draft: TransferDraft,
  translator: Translator = createTranslator()
): string =>
  `${translator.number(Number(draft.amount), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${TRANSFER_CURRENCY}`;
