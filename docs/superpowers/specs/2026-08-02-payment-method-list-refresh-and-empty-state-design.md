# Payment method list refresh and empty-state design

## Goal

Keep the payment-method list authoritative after payment-source mutations, align
its status presentation with recipient provisioning, protect the default method
from deletion, and replace the empty-list header action with descriptive add
buttons in the content area.

## Empty payment-method state

The empty state uses the heading `Payment methods`. It does not render the
header-level `Add` action.

When the interaction permits adding payment sources, the content renders one
full-width outlined button for each allowed tender type. Buttons are stacked,
left aligned, and intentionally tall enough to use the available space. Each
button contains its payment-type icon, title, and subtitle. It does not contain
a chevron.

Default copy is:

- `Add credit or debit card` with `Add your card details`;
- `Add bank account` with `Connect or enter an account`.

Configured empty-state titles, messages, and action copy remain supported. A
card or bank button is omitted when its tender type is not allowed. When saved
methods exist, the current footer-level `Add payment method` behavior remains
unchanged.

The markup keeps alignment concerns in styling so the same controls can later
move from the initial left-aligned option to a centered presentation without
changing their actions or data flow.

## Default method actions

A default payment method keeps its `Default` label but does not render the
`Remove` menu item. If that leaves the method with no overflow actions, its
overflow trigger is omitted as well, avoiding an empty menu.

Non-default eligible methods continue to offer `Mark as default` where the
interaction permits it. Non-default methods continue to offer `Remove`.

## Verification and recipient presentation

The list follows this matrix:

| Verification status | Recipient status | Badge | Selectable and markable as default |
| --- | --- | --- | --- |
| `VERIFIED` | recipient absent | `Verified & Provisioned` | Yes |
| `VERIFIED` | `PROVISIONED` | `Verified & Provisioned` | Yes |
| `VERIFIED` | any other value or blank on a present recipient | `Verified` | No |
| `UNDER_REVIEW` | any | `Needs review` | No |
| `REQUIRE_INFO` | any | `Needs info` | No |
| `DECLINED` | any | `Can't use` | No |
| `NOT_VERIFIED` | any | `Action required` | No |
| missing | any | no badge | No |

The current centralized eligibility helper already implements the requested
selection behavior: verified non-bank sources and verified bank sources with
an absent or provisioned recipient are eligible. The implementation changes
the verified display labels and preserves the existing non-verified labels,
missing-badge behavior, selection guards, and default-action guards.

## Interaction refresh behavior

`GET /interaction` is the authoritative source for the payment-method list.
The SDK requests it:

- after a successful card creation call;
- after a successful ACH creation call;
- after a successful attach or mark-as-default call;
- whenever an internal navigation path returns to the payment-method list,
  including back, change, completion, outcome, failure, and Escape paths.

Successful mutation responses may still provide immediate flow-specific
feedback and SDK events, but the subsequent interaction response supplies the
authoritative list. Existing request deduplication prevents simultaneous
refreshes for the same interaction from issuing redundant calls.

A refresh failure retains the existing refresh error behavior. It must not
repeat a completed mutation or emit its completion event twice.

## Accessibility

The empty-state actions use native buttons with meaningful visible titles and
subtitles. The whole outlined row is clickable. Existing disabled, focus, and
busy behavior is preserved. Omitting a default method's unused overflow trigger
also prevents keyboard and assistive-technology users from opening an empty
menu.

## Testing

Browser tests cover:

- the `Payment methods` empty-state heading and absence of the header `Add`;
- stacked outlined card and bank buttons, their copy, lack of chevrons, and
  allowed-tender filtering;
- absence of `Remove` and of an empty overflow trigger for a default method;
- continued actions for non-default methods;
- every verification/recipient row in the matrix, including missing status;
- a fresh interaction request after card, ACH, attach, and mark-as-default
  success;
- a fresh interaction request on every return-to-list path;
- no duplicate completion events when a refresh follows a mutation.
