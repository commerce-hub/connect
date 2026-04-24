# OTP Verification Email Template Design

## Summary

Create a standalone HTML email template that uses the provided screenshot as a visual guideline and is safe for broad email-client delivery, including Outlook desktop, Gmail, and Apple Mail.

The template will expose a single dynamic placeholder:

```html
{{otp}}
```

All remaining copy will be static in the template. The OTP value will be rendered as one centered verification-code string rather than split into six visual cells.

## Goals

- Create one self-contained HTML email template file.
- Match the screenshot's structure and tone closely.
- Keep the markup compatible with major email clients.
- Use only `{{otp}}` as the dynamic content placeholder.
- Keep the output easy to hand off to a transactional email sender.

## Non-Goals

- No MJML, React Email, or separate template build pipeline.
- No JavaScript or client-side OTP formatting logic.
- No per-digit OTP placeholders.
- No external CSS or web fonts.
- No attempt to make the template themeable in this first version.

## Output Location

Create the template at:

- `docs/otp-verification-email.html`

This keeps it close to the existing reference artifact under `docs/`.

## Approach

Use a single HTML file with:

- table-based layout for email client compatibility
- inline styles for all critical presentation
- a minimal `<style>` block only for resets and small mobile-safe improvements

The design will recreate the screenshot's main structure without relying on browser-only layout features such as flexbox or grid.

## Layout

The email will use a centered card on a light gray canvas.

### Header area

- small brand mark area centered at the top
- because no separate logo asset was provided, the template will render a simple dark monogram badge that visually echoes the screenshot without requiring an external image

### Title area

- centered heading split across two lines:
  - `Your Signup verification`
  - `Code`

### OTP area

- one centered code container
- `{{otp}}` rendered as a single string with strong tracking and bold styling
- the container will visually suggest the screenshot's code row while remaining compatible with email clients

### Warning area

- static warning card with muted beige background
- static explanatory copy modeled on the screenshot

### Footer area

- centered automated-message note

## Static Copy

The template will keep the non-OTP content static and close to the screenshot:

- `Don't share this code to anyone!`
- `Was this request not made by you?`
- `This code was generated from a request made using Chrome browser on macOS on 12/02/2024 AH. If you did not initiate this request, you can safely ignore this email.`
- `This is an automated message. Please do not reply.`

If the exact wording needs to change later, that can be edited directly in the HTML template without changing the template structure.

## Compatibility Constraints

- Use nested presentation tables for the primary layout.
- Inline critical styles on each element.
- Use safe font fallbacks such as `Arial, Helvetica, sans-serif`.
- Avoid CSS features that are unreliable in Outlook desktop.
- Treat rounded corners and subtle shadows as progressive enhancement only.
- Avoid dependence on external images, background images, or unsupported selectors.

## Error Handling

This template has no runtime behavior, so error handling is limited to graceful rendering behavior:

- if a client strips some CSS, the email should still remain readable
- if rounded corners or shadows are ignored, the layout should still hold
- if the monogram badge styling is simplified by a client, the heading and OTP content should still communicate the purpose clearly

## Verification

Primary verification is structural and manual:

1. Confirm the generated HTML is valid enough for normal email sending workflows.
2. Confirm the file uses table-based layout and inline critical styles.
3. Confirm `{{otp}}` appears exactly once as the only placeholder token.
4. Confirm the template remains readable when opened directly in a browser as a rough preview.
5. Confirm there are no dependencies on scripts, external CSS, or local runtime assets.

True inbox-client rendering verification is out of scope unless a dedicated email testing service is introduced.

## Risks And Mitigations

- A single `{{otp}}` token cannot reproduce the screenshot's six-box code layout exactly.
  Mitigation: render the OTP as one emphasized string inside a bordered code container.

- Outlook desktop may flatten some decorative styling.
  Mitigation: keep the structure table-based and make the visual hierarchy depend on spacing, borders, and font weight rather than advanced CSS.

- The recreated badge will not exactly match the screenshot's original brand icon.
  Mitigation: use a simple neutral monogram treatment that preserves the visual balance of the email without introducing external asset requirements.
