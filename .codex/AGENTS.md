You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.
## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
## Accessibility Requirements
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.
### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection


## Current State

- Use prettier config from root (`.prettierrc`).
- Angular application scaffolded in repo root (Angular CLI v20, standalone bootstrap, routing enabled, SSR disabled).
- UI screens implemented to match `docs/design-guidelines.md` reference screenshots:
  - Welcome/signup: `/`
  - Setup flow: `/setup/shipping` → `/setup/payment` → `/setup/later`
  - App shell + settings: `/app/*` (sidebar + settings sections)
  - Wallet: `/app/wallet` with “Add card” drawer (soft-input design; includes billing address fields + state/zip)
- Page UIs are now **PrimeNG-first** (PrimeNG components/directives + PrimeIcons) with Tailwind used primarily for layout
  and spacing.
- API integration implemented from `docs/swagger.yaml` (typed models + HttpClient services) and wired into screens via
  `rxResource`.
- Build + tests verified locally (`npm run build`, `npm run test -- --watch=false --browsers=ChromeHeadless`);
  production build currently warns on the 1MB initial bundle budget.
- A file checkpoint snapshot was saved at `.codex/checkpoints/2026-03-17-ui-screens/`.

## Architectural Decisions

### App Structure

- Route-level screens live under `src/app/pages/**` and are registered in `src/app/app.routes.ts`.
- Local UI primitives under `src/app/ui/**` are minimized; `ui-brand-mark` remains the primary local primitive used by
  route-level pages.
- The root `App` component is intentionally minimal and only renders `<router-outlet />`.

### API & Server State

- `docs/swagger.yaml` is the source of truth for backend endpoints and shapes; the app uses a small, typed client layer
  under `src/app/api/**`.
- Base URL is configured via an injection token `API_BASE_URL` (`src/app/api/api-config.ts`) and defaults to
  `http://localhost:6600`.
- HTTP is done via Angular `HttpClient` (enabled with `provideHttpClient()` in `src/app/app.config.ts`).
- Cookie-based auth is supported by always sending `withCredentials: true`.
- Server state is modeled with Angular `rxResource`:
  - Shared profile resource lives in `CustomerProfileStore` (`src/app/state/customer-profile.store.ts`) and is
    reloaded after successful mutations.
  - Screens use local `rxResource` instances for mutations (send OTP, validate OTP, save addresses, add payment
    sources) and call `profile.reload()` on completion.

### Routing

- Routes are grouped into:
  - `setup/*` for narrow setup flows (shipping, payment, setup-later confirmation).
  - `app/*` for the logged-in shell (sidebar) with nested pages (settings, wallet, activity, subscriptions).

### Forms & Local State

- Forms use Angular Reactive Forms for validation and deterministic error states.
- Local UI state uses Angular signals for flags like “submitted” and dialog open/closed.
- PrimeNG form controls are preferred (`pInputText`, `p-select`, `p-button`) and validation uses PrimeNG conventions
  (e.g. `p-invalid` class + `p-message`).

### Payment + Card UI

- Prefer a minimal “pills” step indicator (`ui-progress-pills`) over `p-steps` when screens call for a lightweight
  progress affordance.
- For card-entry forms inside drawers/modals, keep the footer actions pinned and make the form body scrollable.
- Use shared Tailwind component classes (`ui-input-soft`, `ui-select-soft`, `ui-icon-button`) for the filled, rounded
  control style shown in `docs/`.
- Keep state/province options local to each page for now (`US_STATES` constants), instead of introducing a shared
  dependency.

### UI Stack

- **Angular:** v20.x, standalone components (`ApplicationConfig` + `bootstrapApplication` pattern).
- **PrimeNG:** v20.x.
  - Global config via `providePrimeNG(...)` in `src/app/app.config.ts`.
  - Animations enabled via `provideAnimations()` (required for many PrimeNG components).
  - Theme preset: `@primeuix/themes/aura` (Aura).
  - Ripple enabled (`ripple: true`).
  - Global styles loaded via `angular.json`:
    - `primeicons/primeicons.css`
    - `primeflex/primeflex.css`
  - Pages prefer PrimeNG components for structure and behavior (`p-button`, `p-card`, `p-message`, `p-steps`,
    `p-panelMenu`, `p-menu`, `p-table`, `p-progressSpinner`, `p-avatar`, `p-drawer`).
  - Overlays/sheets use PrimeNG `p-drawer` in `headless` mode for full control over markup and Tailwind styling.

#### PrimeNG + Standalone Imports

- The app is built with standalone route components, but PrimeNG is a mix of standalone components and NgModule exports.
- Prefer importing standalone PrimeNG components directly in a page’s `imports: [...]` (e.g. `Button`, `Card`, `Select`,
  `InputText`, `Message`, `Steps`, `Menu`, `PanelMenu`, `ProgressSpinner`, `Drawer`).
- If a PrimeNG component is not standalone, import its module instead (example: `TableModule` from `primeng/table`).

### Styling

- **Tailwind CSS:** v3.x (selected for compatibility with Angular’s PostCSS pipeline).
  - PostCSS plugin configured in `postcss.config.js` as `tailwindcss` + `autoprefixer`.
  - Tailwind directives live in `src/styles.css` (`@tailwind base/components/utilities`).
  - Content scanning configured in `tailwind.config.js` for `./src/**/*.{html,ts}`.
  - Semantic design tokens are defined as CSS variables in `src/styles.css` and mapped into Tailwind colors in
    `tailwind.config.js`:
    - `brand.green`, `brand.blue`
    - `ink.primary`, `ink.secondary`, `ink.tertiary`
  - Shared UI utility classes live in `@layer components`; the remaining commonly used helpers are layout-level
    (`.ui-page`, `.ui-narrow`).
  - Prefer component classes in `src/styles.css` (`ui-input`, `ui-input-soft`, `ui-select`, `ui-select-soft`,
    `ui-icon-button`) over PrimeNG theme overrides; apply them via `class`/`styleClass` on PrimeNG components.

### Design Guidelines (UI look-and-feel)

- **Reference screens:** stored in `docs/` and treated as the source of truth for spacing, component shapes, and states.
- **Guidelines doc:** `docs/design-guidelines.md` captures the current design rules derived from those screens;
  `README.md` links to it.
- **Palette decisions (source of truth):**
  - Brand green: `#228800`
  - Brand blue: `#237CB8`
  - Text: `#0E0E0E` (primary), `#2D2D2D` (secondary), `#464646` (tertiary)
- **Token strategy:** prefer semantic tokens (e.g., “text / primary”, “accent / green”) implemented via Tailwind theme
  extension or CSS variables, rather than scattering hex values across components.

### UI Primitives (Local)

- `ui-brand-mark`: top-left “link” mark used on shell screens.
- `ui-progress-pills`: preferred minimal step indicator for setup flows (use instead of `p-steps` when the design shows
  pills).
- `ui-icon`: legacy/unused by current pages; prefer PrimeIcons (`pi pi-*`) instead.
- `ui-dialog` remains a fallback/experiment; prefer PrimeNG `p-drawer` for product UI overlays.

### Build Settings

- Angular build budgets configured in `angular.json` (`initial` warning: `1MB`, error: `2MB`); current production build
  may exceed the warning threshold after adding PrimeNG drawer.
- Avoid using effects for change detection; prefer Angular signals and `rxResource` for deterministic updates.

## Developer Commands

- Install deps: `npm install`
- Dev server: `npm run start`
- Production build: `npm run build`
- Unit tests: `npm run test`

## Angular

See `https://angular.dev/llms.txt` for Angular-specific LLM guidance and best practices.

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable,
performant, and accessible code following Angular and TypeScript best practices.

## PrimeNG

See `https://primeng.org/llms/llms.txt` for PrimeNG-specific LLM guidance and best practices.

## Code Style

Using our standard Prettier config file.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the
  `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
