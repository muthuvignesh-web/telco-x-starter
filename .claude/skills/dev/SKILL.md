---
name: dev-telco-x
description: Engineer operating manual for the Telco X build. Use when implementing routes, mock APIs, page logic, or interactions, and when driving the GitHub workflow with Claude Code.
---

# Engineer — Telco X

You build the app. Orchestrate Claude Code; own the architecture decisions.

## Use this skill to
- Implement the six TODO endpoints in `server.js` using the `lib/data.js` getters.
- Build Page 2 (status branch + map pin) and Page 3 (details + providers modes).
- Drive the GitHub arc: Issue → Branch → Build → Tests → PR → AI Review → Human Merge.

## Watch these (business rules in code)
- Guard Tools 4/5/6 with `isActive(id)` — non-active must not leak records.
- Gate the upgrade card on `upgrade_eligible`.
- Preserve the selected address across back navigation.

## Prompts you own (constrained build)
- "Implement GET /api/locations/:id/subscriber. Active locations only — return 404-style guard for non-active. Use lib/data.js. Add a test for active and non-active."
- "Build the Page 2 status branch from connection_status. Do not modify the data files."

## Three-Tier
🔴 You own: architecture + merge approval. 🟡 Claude assists: implementation. 🟢 Automate: scaffolding, boilerplate, test stubs.

---

## Accessibility — WCAG 2.2 AAA (mandatory on every page)

Every page you build or modify must satisfy WCAG 2.2 Level AAA. The table below is the enforceable checklist — verify each criterion before raising a PR.

### 1. Perceivable

| Criterion | ID | Requirement | How to implement |
|---|---|---|---|
| Non-text contrast | 1.4.11 | UI components and focus indicators must have ≥ 3:1 contrast against adjacent colours. | Use `outline: 2px solid var(--tx-blue)` on `:focus-visible`; verify with a contrast tool. |
| Text contrast — AA | 1.4.3 | Normal text ≥ 4.5:1; large text (18 px+ or 14 px bold) ≥ 3:1. | Body text on surfaces must pass. Muted text must not fall below 4.5:1. |
| Text contrast — AAA | 1.4.6 | Normal text ≥ 7:1; large text ≥ 4.5:1. | Use `--tx-muted: #4A5566` (≥ 7:1 on white). Opacity-based colours on dark backgrounds must be opaque enough — `rgba(255,255,255,.8)` minimum on `#102A43`. |
| Resize text | 1.4.4 | Text must scale to 200 % without loss of content or function. | Use `rem` units for every `font-size`. Never use `px` for text. Root font-size on `body` must be `1rem`. |
| Visual presentation | 1.4.8 | Text blocks: foreground/background selectable, width ≤ 80 characters, line-height ≥ 1.5, no justified alignment, text resizable 200 % without assistive tech. | Cap content columns at `max-width: 760px`. Set `line-height: 1.5` on body. Never use `text-align: justify`. |
| Images of text | 1.4.9 | No images of text except logos. | Use real HTML text for all labels, headings, and body copy. |
| Reflow | 1.4.10 | No horizontal scrolling at 320 px viewport width. | Test at 320 px. Use `flex-direction: column` and `width: 100%` in mobile breakpoints. |

### 2. Operable

| Criterion | ID | Requirement | How to implement |
|---|---|---|---|
| Keyboard accessible | 2.1.1 | All functionality available by keyboard. | Every interactive element reachable and operable via Tab, arrow keys, Enter, Space, Escape. |
| No keyboard trap | 2.1.2 | Focus must not become trapped in any component. | Test modal/dropdown close via Escape; focus must return to trigger element. |
| Keyboard — AAA | 2.1.3 | All functionality available by keyboard without exception. | No mouse-only interactions (hover tooltips, drag-only). |
| Timing adjustable | 2.2.1 | If time limits exist, user can turn off, adjust, or extend them. | No session timeouts in this app. If added later, provide at least 20-second warning. |
| No timing | 2.2.3 | No time limits unless real-time or essential. | Do not add countdown timers or auto-advancing content. |
| Interruptions | 2.2.4 | User can postpone or suppress non-emergency interruptions. | Avoid auto-updating content; if used, provide a pause control. |
| Touch target size | 2.5.5 | Every interactive element ≥ 44 × 44 px. | Set `min-height: 44px; min-width: 44px` on all buttons, links, and list items. Use `display: inline-flex; align-items: center` to maintain alignment. |
| Focus visible | 2.4.7 | Keyboard focus indicator always visible. | Never remove `:focus` outline. Use `:focus-visible` to suppress it for mouse only. |
| Focus appearance | 2.4.11/12 | Focus indicator area ≥ perimeter of component × 2 px; contrast ≥ 3:1 (AA) / encloses component (AAA). | Use `outline: 2px solid var(--tx-blue); outline-offset: 3px` as the minimum. |
| Focus order | 2.4.3 | Focus order preserves meaning and operability. | Avoid `tabindex > 0`. Ensure DOM order matches visual order. |
| Link purpose | 2.4.9 | Link purpose identifiable from link text alone (AAA). | No "click here" or "read more". Use descriptive labels or `aria-label`. |
| Headings and labels | 2.4.6 | Headings and labels describe topic or purpose. | Every section has a heading. Every form field has a visible `<label for="…">`. |
| Location | 2.4.8 | User knows where they are in a set of pages. | Include a page `<title>` that names the current page. Breadcrumbs or active nav state where applicable. |
| Skip links | 2.4.1 | Bypass blocks of repeated content. | Keep `<a class="skip-link" href="#main">Skip to main content</a>` as the first element in `<body>`. |
| Dragging alternatives | 2.5.7 | Any drag operation has a single-pointer alternative. | Do not add drag-only interactions. |
| Target size — minimum | 2.5.8 | Targets ≥ 24 × 24 px (AA). Combined with 2.5.5 AAA: use 44 × 44 px as the floor. | Enforced by the 44 px rule above. |

### 3. Understandable

| Criterion | ID | Requirement | How to implement |
|---|---|---|---|
| Language of page | 3.1.1 | `lang` attribute on `<html>`. | Always `<html lang="en">`. |
| Language of parts | 3.1.2 | Mark up inline foreign-language phrases. | Use `lang="…"` on any non-English inline text. |
| Unusual words | 3.1.3 | Mechanism to identify unusual words or jargon. | Add a `<dfn>` or `title` attribute for technical terms (FTTP, HFC, etc.). |
| Error identification | 3.3.1 | Errors described in text, not colour alone. | `role="alert"` + `aria-live="assertive"` on `#search-error`. Error icon + text message together. |
| Labels or instructions | 3.3.2 | Labels and instructions provided when input required. | Visible `<label>` above every input. Hint text via `aria-describedby`. |
| Error suggestion | 3.3.3 | Suggest correction when error detected. | Error messages must explain the fix (e.g. "This address doesn't exist — try a suburb or postcode"). |
| Error prevention | 3.3.4 | For legal/financial/data, provide review, correction, or reversal. | No payment/legal flows in this app; apply if added later. |
| Help | 3.3.5 | Context-sensitive help available. | Hint text (`#search-hint`) provides inline guidance. Link to Contact page in footer. |
| Consistent navigation | 3.2.3 | Navigation repeated in same order across pages. | Header and footer nav identical on every page. Do not reorder links between pages. |
| Consistent identification | 3.2.4 | Components with same function labelled consistently. | "Check address" button label must not change. RAG status labels must use the same wording throughout. |
| On focus / on input | 3.2.1/2 | No context change on focus or input alone. | Never navigate on focus. Navigation only happens on explicit selection (click or Enter/Space). |

### 4. Robust

| Criterion | ID | Requirement | How to implement |
|---|---|---|---|
| Parsing | 4.1.1 | No duplicate IDs; valid HTML nesting. | Run HTML validator before each PR. IDs must be unique per page. |
| Name, role, value | 4.1.2 | All UI components have accessible name, role, and state. | Buttons: visible label or `aria-label`. Inputs: `<label for="…">` or `aria-label`. Dynamic state (expanded, selected, disabled) via ARIA attributes, not CSS only. |
| Status messages | 4.1.3 | Status messages programmatically determinable without focus. | Use `role="status"` or `aria-live="polite"` for non-urgent updates; `role="alert"` / `aria-live="assertive"` for errors. |

### 5. ARIA rules (apply everywhere)

- `aria-expanded` is only valid on elements with `role="combobox"`, `role="button"`, or similar — never on a bare `<input>` without an explicit role.
- RAG status must always carry a text label, not colour alone. Use `.tx-rag--green/amber/red` with a visible text sibling.
- `aria-live` regions must be in the DOM on page load, not injected later, so assistive technology registers them.
- `aria-disabled="true"` is not the same as the `disabled` attribute — set both when a button is disabled.
- `aria-label` overrides visible text for AT; keep them in sync with what a sighted user sees.

### 6. Fonts and sizing rules

- All `font-size` values must use `rem`, never `px` or `pt`.
- `line-height` must be at least `1.5` for body text (WCAG 1.4.12).
- Letter-spacing, word-spacing, and line-height must be overridable by user stylesheets — do not use `!important` on these properties.
- Do not set a maximum font size that blocks browser zoom.

### 7. Pre-PR accessibility checklist

Before opening any pull request, confirm:

- [ ] All text colours pass 7:1 on their background (or 4.5:1 if large text).
- [ ] All interactive elements have a visible focus indicator (≥ 2 px, ≥ 3:1 contrast).
- [ ] All interactive elements have a touch target ≥ 44 × 44 px.
- [ ] No `px` units used for `font-size`.
- [ ] `<html lang="en">` present on every page.
- [ ] Every form input has a visible `<label>`.
- [ ] Errors use `role="alert"` and include a text description of how to fix.
- [ ] No `aria-expanded` on a bare `<input>` without `role="combobox"`.
- [ ] Skip link present as first focusable element.
- [ ] Page tested at 320 px width (no horizontal scroll).
- [ ] No interaction relies on hover or drag alone.
