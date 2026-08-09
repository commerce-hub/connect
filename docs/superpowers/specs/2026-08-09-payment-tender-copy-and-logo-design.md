# Payment Tender Copy and Logo Design

## Goal

Standardize the card and manual-bank tender labels across the empty state and add-payment bottom sheet, and replace the empty-state manual-bank artwork.

## Copy

Use these exact titles in both surfaces:

- **Credit or debit card**
- **Manual bank details**

The USA **Pay by Bank** title and all existing subtitles remain unchanged. Apply **Credit or debit card** as the default SDK card-tender title so the old **Add credit or debit card** wording does not appear in either launcher. Preserve merchant copy overrides outside the fixed USA tender names.

## Image and layout

Regenerate `MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE` from `/Users/unnikrishnan.b/Downloads/manual_ach_logo.jpeg` using the existing optimizer and embedded-data-URL workflow. This new image contains the single blue bank artwork.

Use the regenerated image only where the empty no-saved-payment-method list already renders tender brand images. Do not change the bottom-sheet layout or its existing SVG card/bank icons. Do not change the compact empty-list layout.

## Testing

Update resolver and flow expectations to verify both surfaces use the exact titles. Verify the new manual image data URL differs from the prior generated value, remains a valid optimized JPEG, and stays under the existing size limit. Retain the existing regional tender, icon, navigation, subtitle, and accessibility tests.
