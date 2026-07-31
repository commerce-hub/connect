# Payment Selection and Add Sheet

## Goal

Restore saved-source radio selection and the original `Use selected method`
confirmation behavior while consolidating card and bank creation behind one
secondary `Add payment method` action.

## Saved-source selection

Verified saved sources render radio controls. Changing a radio updates only the
draft selected source and clears any attachment error. The primary footer
button keeps its existing configurable label, whose default is
`Use selected method`, and remains disabled until a verified source is selected.

Activating the primary button calls
`POST /interaction/source/{sourceId}/attach`. A successful response updates the
interaction, renders the selected-source review, and emits `onSelect`. A failed
request returns to the list with the existing inline attachment error.
`Mark as default` remains a separate overflow action and does not emit
`onSelect`.

## Footer

When selection and adding are both enabled, the footer contains two actions in
one row:

- primary: `Use selected method` (or configured `continueButton` copy);
- secondary: `Add payment method`, with the existing plus icon.

The actions stack on narrow screens. If only one capability is enabled, its
action uses the available footer width.

## Add payment method sheet

When both card and bank account creation are allowed, `Add payment method`
opens a modal bottom sheet over the payment-method screen. The sheet contains:

- title `Add payment method`;
- a 44-by-44 close button using the supplied Font Awesome xmark SVG;
- a `Credit or debit card` option with the supplied credit-card SVG and the
  subtitle `Add your card details`;
- a `Bank account` option with the supplied building-columns SVG and the
  subtitle `Connect or enter an account`.

There is no introductory helper sentence. Options are full-width cards with a
minimum height of 72 pixels, 12 pixels between cards, 40-pixel tinted icon
tiles, and trailing chevrons. The entire option card is clickable.

The sheet uses dialog semantics, traps focus, closes from its close button,
backdrop, or Escape, and returns focus to `Add payment method`. Choosing an
option closes the sheet and starts the existing card or bank flow. If only one
creation type is allowed, the secondary footer action opens that flow directly
without showing the sheet.

The supplied SVG path data is embedded in the SDK with its Font Awesome Free
7.3.1 license comments; runtime `file://` references are not used.

## Testing

Browser tests cover radio draft selection, primary-button disabled and loading
states, attach/onSelect success, attachment failure, two-action footer layout,
sheet structure and icon semantics, all dismissal paths, focus return/trap,
allowed-tender filtering, and direct navigation when only one type is allowed.
