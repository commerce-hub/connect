# Earnings Native Account Balance Design

## Goal

Limit native accounts in the payment-method list to accounts whose payment-source name ends with the exact suffix ` - Earnings`, and display each visible native account's available balance beside its masked account number.

## Scope

This is a Wallet SDK presentation change. Card and bank-account visibility remains unchanged. MPP behavior and API contracts remain unchanged.

## Existing Data Flow

When the payment-method list contains native accounts, the Wallet SDK queues one `GET /interaction/source/native/balances` request. The response is a map of native account identifiers to balance information. The SDK matches an entry using the payment source ID, position ID, or token and formats the numeric balance as US currency.

MPP obtains the available balances from the CommerceHub `v1/funds/balance-inquiry` endpoint. It matches each returned balance to a native account by product type and exposes the resulting map through `GET /interaction/source/native/balances`.

## Visibility Rule

Before converting interaction payment sources into payment-list rows, retain all non-native payment sources and retain a native payment source only when:

```ts
source.name?.trim().endsWith(' - Earnings') === true
```

The match is case-sensitive and applies to the top-level payment-source `name`. A missing name, a differently cased suffix, or `Earnings` appearing anywhere except the end excludes the native account from the payment-method list.

The rule applies only to the payment-method list. It does not alter MPP responses, transfer-source behavior, or the underlying interaction state.

## Balance Presentation

Keep the existing balance request, matching, error handling, and US-dollar formatting. For native payment methods, render the formatted balance in the metadata row immediately after the masked account label. While the balance request is pending, render the existing loading placeholder in that same inline position.

Native balances must no longer occupy the far-right trailing area of the list row. Existing non-native trailing behavior remains unchanged.

If the balance request fails or no matching balance is returned, render the account label without a balance. Do not show an error message or placeholder after loading completes.

## Testing

Add focused tests proving that:

- A native source whose trimmed top-level name ends with ` - Earnings` appears.
- Native sources with missing names, different casing, or a non-terminal `Earnings` token do not appear.
- Card and bank sources remain visible.
- The SDK requests `GET /interaction/source/native/balances` when a qualifying native source is listed.
- The loading placeholder and resolved balance appear beside the masked account number.
- The resolved native balance does not render in the trailing balance container.

Run the focused browser test in Chromium, followed by lint and the full relevant test suite.
