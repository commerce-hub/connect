# Default label and empty-action border design

## Goal

Preserve payment-method title space by moving the `Default` pill out of the
outer trailing column, and visually distinguish empty-state add actions with a
dotted outline.

## Default pill placement

The `Default` indicator remains a pill. It moves into the payment method's
metadata row, after the account details:

```text
Corporate purchasing card   [Verified & Provisioned]
Visa ending 4242                         [Default]
```

The account metadata grows and truncates first. The `Default` pill remains
right aligned and does not shrink. This prevents the outer row grid from
reserving a separate trailing column for the pill, so the title competes only
with its verification badge.

If a payment method has no metadata, the copy area renders a second row that
contains only the right-aligned `Default` pill. Default methods continue to
have no overflow trigger or `Remove` action. Non-default overflow behavior is
unchanged.

The pill keeps its existing accessible text, colors, border, and typography.

## Empty-state add actions

The existing stacked card and bank action buttons retain their icons, titles,
subtitles, height, spacing, and full-row click targets. Their solid outline
changes to a literal dotted outline using `border-style: dotted`.

Hover and keyboard focus strengthen the border color while retaining the
dotted style. This change applies only to the direct add actions on an empty
payment-method list. The saved-list footer action and add-method sheet remain
unchanged.

## Responsive behavior

At narrow widths, payment titles and configured action subtitles continue to
wrap according to the existing responsive rules. In the payment metadata row,
account details may truncate, but the `Default` pill stays fully visible.

## Testing

Browser test source covers:

- the `Default` pill inside the metadata row and outside the overflow column;
- right alignment and non-shrinking behavior at narrow widths;
- the metadata-free fallback row;
- unchanged default deletion protection and non-default overflow actions;
- dotted borders for empty-state card and bank actions;
- dotted borders remaining in hover and focus states;
- unchanged saved-list footer and add-method sheet borders and behavior.
