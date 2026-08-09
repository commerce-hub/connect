# USA Payment Tender Split Design

## Goal

Replace the single USA bank-account launcher with separate **Pay by Bank** and **Manual Bank Link** tenders while preserving the existing non-USA bank flow. Present three explicit USA tenders in both add-payment entry points and use the supplied branded images when no payment methods are saved.

## Availability model

Build one ordered, country-aware add-payment tender model and use it for both the no-saved-payment-methods screen and the add-payment bottom sheet.

When the interaction country normalizes to `US` or `USA`:

1. Include **Credit or debit card** when `CARD` is allowed.
2. Include **Pay by Bank** when `BANK_ACCOUNT` is allowed.
3. Include **Manual Bank Link** when `BANK_ACCOUNT` is allowed.

For every other country, preserve the current model: include **Credit or debit card** when `CARD` is allowed and the existing **Bank account** tender when `BANK_ACCOUNT` is allowed. Missing country is not treated as USA. Existing feature gating remains authoritative: none of these add actions appear unless `ADD_ACCOUNT` is enabled.

The model carries the action, title, subtitle, compact icon kind, and optional no-saved-state brand image. This keeps order, copy, availability, and navigation consistent across both screens.

## Copy and navigation

USA tender copy is fixed SDK copy:

- **Credit or debit card** — retain the existing configured card subtitle, whose default is **Add your card details**.
- **Pay by Bank** — **Directly connect with your bank account**.
- **Manual Bank Link** — **Add your account details manually**.

Existing merchant card-copy overrides continue to apply. Existing bank-account copy overrides continue to apply to the non-USA Bank account tender. No new merchant copy fields are introduced for Pay by Bank or Manual Bank Link.

Add a dedicated Pay by Bank action that resets conflicting child-flow state and launches the existing PBB flow directly. Manual Bank Link uses the existing `add-ach-manually` action and opens the current manual schema/details flow directly. The non-USA Bank account action continues through the existing country-aware bank launcher.

Remove **Connect another way** from the PBB provider header entirely. The PBB screen retains its title, back navigation, loading overlay, provider container, and existing success/failure behavior.

## Images and presentation

Use these supplied image files for no-saved-payment-method tender cards:

- `/Users/unnikrishnan.b/Downloads/card_logo.jpg` for Credit or debit card.
- `/Users/unnikrishnan.b/Downloads/pbb_fiserv_logo.jpeg` for Pay by Bank.
- `/Users/unnikrishnan.b/Downloads/manual_ach_logo.jpeg` for Manual Bank Link.

Create optimized derivatives at a maximum width of 320 pixels using JPEG quality 80, preserving aspect ratio and the white background. Encode the derivatives as data URLs in a focused internal brand-image module. This keeps npm, CDN, and bundled documentation output self-contained and avoids runtime asset-path resolution.

On the no-saved-payment-methods screen, render the corresponding brand image in each tender card. Keep the images decorative because the adjacent visible title identifies the action. Use a white tender-card background for these branded entries, matching the verified white image backgrounds. Preserve the shared border, focus, disabled, and text styles.

The bottom sheet does not use the large brand images. It uses the existing compact card icon for Credit or debit card and the existing compact bank icon for both Pay by Bank and Manual Bank Link.

## Compatibility

Do not change saved payment-method rows, payment-source API payloads, PBB session/finalization behavior, manual ACH forms, card forms, or non-USA bank selection. Existing design tokens continue to control text, borders, and focus states; only the branded no-saved tender background is forced to white to match its image.

## Testing

Add or update tests covering:

- US and whitespace/case-normalized USA interactions render the three actions in Card, Pay by Bank, Manual Bank Link order.
- `CARD` and `BANK_ACCOUNT` filtering independently removes the corresponding tender choices; disallowing `BANK_ACCOUNT` removes both USA bank choices.
- Non-USA and missing-country interactions preserve the existing single Bank account tender and never expose Pay by Bank.
- No-saved-payment-method cards render the correct supplied image for each action, with decorative image semantics and a white card background.
- Bottom-sheet options use a card icon once and the same bank icon for both USA bank entries.
- Pay by Bank launches the provider directly and Manual Bank Link opens manual entry directly.
- The PBB provider header no longer contains `add-ach-manually` or **Connect another way**.
- Existing card copy overrides and non-USA bank copy overrides remain effective.
- Existing PBB, manual-bank, card, and payment-list tests continue to pass.

Run focused Chromium flow and primitive tests during development, followed by build, lint, and the full project test suite.
