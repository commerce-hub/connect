# Recipient-aware payment selection design

## Context

Bank payment sources can be verification-verified before their downstream recipient is ready. The interaction response may include:

```json
{"recipient":{"id":"...","status":"PROVISIONED"}}
```

`recipient.status` is not constrained by the API schema, so only the exact observed value `PROVISIONED` is treated as ready.

## UI rules

| Source state | Label | Selectable |
| --- | --- | --- |
| Non-bank, verification `VERIFIED` | Existing verified label (`Ready`) | Yes |
| Bank, verification `VERIFIED`, recipient absent | `Ready` | Yes |
| Bank, verification `VERIFIED`, recipient `PROVISIONED` | `Verified & Ready` | Yes |
| Bank, verification `VERIFIED`, recipient present with any other/blank status | `Verified` | No |
| Verification not `VERIFIED` | Existing status presentation | No |

Recipient absence intentionally preserves backward compatibility. Recipient readiness affects list radio selection and attach eligibility; unrelated transfer-selector behavior remains unchanged.

## Design

Centralize label and eligibility decisions in a pure helper. Use that helper for list rendering, initial/added-source preselection, attach guards, and post-verification selection. Expose an optional public `PaymentSourceRecipient` type without narrowing the service's open status string.

