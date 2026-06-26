import type {
  TransferDraft,
  TransferDraftErrors,
  TransferSource,
} from '../types.js';

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
  sources: readonly TransferSource[]
): TransferDraftErrors => {
  const errors: TransferDraftErrors = {};
  const sourceIds = new Set(sources.map((source) => source.id));
  const amount = Number(draft.amount);

  if (!draft.fromSourceId) {
    errors.fromSourceId = 'Select a source account.';
  } else if (!sourceIds.has(draft.fromSourceId)) {
    errors.fromSourceId = 'Select a verified bank or native account.';
  }

  if (!draft.toSourceId) {
    errors.toSourceId = 'Select a destination account.';
  } else if (!sourceIds.has(draft.toSourceId)) {
    errors.toSourceId = 'Select a verified bank or native account.';
  } else if (draft.toSourceId === draft.fromSourceId) {
    errors.toSourceId = 'Select a different destination account.';
  }

  if (!draft.amount) {
    errors.amount = 'Enter an amount.';
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Enter an amount greater than zero.';
  }

  return errors;
};

export const isTransferDraftReady = (
  draft: TransferDraft,
  sources: readonly TransferSource[]
): boolean =>
  Object.keys(validateTransferDraft(normalizeTransferDraft(draft), sources))
    .length === 0;

export const formatTransferAmountForReview = (draft: TransferDraft): string =>
  `${Number(draft.amount).toFixed(2)} ${TRANSFER_CURRENCY}`;
