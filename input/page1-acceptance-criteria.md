# Page 1 — Home & Address Search (`public/index.html`)
**Acceptance Criteria · v1.2 · 23 June 2026**

Entry point. The user searches an address and is routed to the result page.
All data comes from Tool 1 (`GET /api/locations`).

---

## P1-AC-01 · Address search returns matching suggestions
**Type:** Happy path

| | |
|---|---|
| **Given** | The user is on `index.html` and `GET /api/locations` returns all 10 locations. |
| **When** | The user types a partial string (e.g. "Eucalyptus") into the address search field. |
| **Then** | A suggestion list appears containing at least one matching result. Each suggestion shows the full address, suburb, state, and postcode. No page navigation occurs. |
| **A11y** | The suggestion list container has `role="listbox"` and each suggestion has `role="option"`. The list is announced via an `aria-live` region so screen reader users hear the number of results available (e.g. "3 suggestions available"). |

---

## P1-AC-02 · Selecting a suggestion navigates to the result page
**Type:** Happy path

| | |
|---|---|
| **Given** | The suggestion list is visible and contains one or more matching addresses. |
| **When** | The user clicks or keyboard-selects a suggestion (e.g. "88 Eucalyptus Drive, Carlton VIC 3053"). |
| **Then** | The browser navigates to `result.html?id=LOC-002`. The URL contains the correct location ID and no other parameters. |
| **A11y** | The suggestion list is fully keyboard-operable: arrow keys move focus between options, Enter or Space confirms selection. The focused option has a visible focus indicator meeting WCAG 2.1 AA contrast (3:1 minimum). Mouse and keyboard paths produce identical outcomes. |

---

## P1-AC-03 · Unrecognised search string shows inline error and stays on page
**Type:** Validation

| | |
|---|---|
| **Given** | The user is on `index.html`. |
| **When** | The user types a string that matches no location (e.g. "ZZZ Street") and submits the search. |
| **Then** | The inline error message **"This address doesn't exist"** is displayed in the `#search-error` element. The browser does **not** navigate away from `index.html`. |
| **A11y** | `#search-error` has `role="alert"` so the message is announced immediately by screen readers. The search input has `aria-describedby` pointing to `#search-error`. Error text contrast must meet WCAG AA (4.5:1 on the page background). |

---

## P1-AC-04 · Empty submission is blocked
**Type:** Validation

| | |
|---|---|
| **Given** | The user is on `index.html` with an empty search field. |
| **When** | The user attempts to submit the form without entering any text (e.g. by pressing Enter or clicking the search button). |
| **Then** | No API call is made and no navigation occurs. The Check Address button remains disabled. An appropriate inline message or disabled state prevents the empty submission. |
| **A11y** | The disabled button carries `aria-disabled="true"` (not CSS-only). The search field has a visible `<label for="search">` that persists regardless of input state — not placeholder-only. |

---

## P1-AC-05 · Case-insensitive and partial-suburb match returns results
**Type:** Edge case

| | |
|---|---|
| **Given** | The user is on `index.html`. |
| **When** | The user types a lower-case partial suburb string that matches one or more locations (e.g. "carlton" or "FITZROY"). |
| **Then** | The suggestion list returns the matching location(s) regardless of case. The match is not limited to address line; suburb matching is supported. |
| **A11y** | As the suggestion list updates, a screen reader announcement reflects the refreshed result count via `aria-live="polite"`. Minimum touch target for each suggestion row is 44 × 44 px (WCAG 2.5.5). |

---

## P1-AC-06 · All address links navigate to a valid page with visible content
**Type:** Happy path

| | |
|---|---|
| **Given** | The user is on `index.html`. The quick-pick location list is rendered with address items linking to `result.html?id={LOC-xxx}`. The files `public/result.html` and `public/details.html` exist and are served by the Express server. |
| **When** | The user clicks any address link in the location list (e.g. "12 Marngo Street, Brunswick"). |
| **Then** | The browser navigates to `result.html?id={locationId}`. The server responds with HTTP 200. The page contains a visible heading, a back link to `/index.html`, and at least one content card with visible text — the page is not blank. The same 200-response rule applies to onward links from `result.html` to `details.html`. |
| **A11y** | Back links on `result.html` and `details.html` are keyboard-reachable `<a>` elements with a descriptive `aria-label`. Focus moves to a logical starting point on page load. |

---

## Business rules in scope

| Rule | Description |
|---|---|
| BR-05 | No NBN, RSP, or real-carrier terminology — generic terms only. |
| BR-07 | Sign-up modal makes no real data submission. |

## Data source

All search and navigation data on this page comes from **Tool 1** (`tool1_locations.json`) via `GET /api/locations`.

## Related issues

- `[Defect] Absolute asset paths break page when opened via file://` — pages must be served via `npm start` → `http://localhost:3001`, not opened directly from disk.
