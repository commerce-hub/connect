# Needs-info status label design

## Goal

Change the fallback verification badge shown for a `NOT_VERIFIED` payment method from `Action required` to `Needs info`.

## Scope

Update the shared fallback presentation used by payment-method verification badges. Keep the existing labels for verified, under-review, require-info, and declined statuses unchanged. This intentionally keeps `NOT_VERIFIED` terminology consistent anywhere that shared badge is rendered.

## Testing

Update the primitive rendering test and payment-method-list flow test to expect `Needs info`. Run the focused tests, TypeScript build, and ESLint. Browser test execution may require the Playwright browser installation that is currently unavailable in this environment.

