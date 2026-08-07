# Featured Earnings Account Design

## Goal

Present the qualifying native Earnings account as a prominent informational balance row at the top of the payment-method list.

## Identification and Ordering

Reuse the existing native-account visibility rule: the trimmed top-level payment-source name must end with the exact, case-sensitive suffix ` - Earnings`.

Move the qualifying Earnings source before all other visible payment sources. Preserve the original relative order of every non-Earnings source.

## Presentation

Map the Earnings source to an explicit `featured-informational` payment-method presentation. The row:

- retains its native-account icon, display name, masked account number, loading state, and balance;
- uses a soft gray surface;
- has additional space below it before regular payment methods;
- displays no verification status or status label;
- displays no radio button, overflow menu, delete action, mark-default action, or chevron;
- is completely non-clickable and cannot become the selected payment source.

The treatment applies only to the qualifying Earnings account. Other native-account types retain standard payment-method behavior if they become visible in the future.

## Accessibility

The row remains in the `Payment methods` list with its existing accessible label. It exposes no interactive descendant and does not advertise selected, disabled, or action-required behavior.

## Testing

Add mapping, primitive, and flow coverage for stable ordering, preserved balance content, the featured class and spacing, and absence of all interactive/status controls.
