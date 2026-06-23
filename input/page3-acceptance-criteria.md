# Page 3 — Provider Details (`public/details.html`)
**Acceptance Criteria · v1.4 · 23 June 2026**

Provider selection page reached from Page 2. Two design variants exist depending on
`connection_status`:

- **`providers.html`** — non-active locations with `previous` status. Providers are listed
  with a **Sign up** button on each row.
- **`never-connected.html`** — locations with `never` status. Providers are shown as a
  read-only availability list (no Sign up button). The selected plan is fetched and
  displayed. Users are directed to contact their preferred provider directly.

Providers are driven exclusively by Tool 7 — the count and names must match Tool 7 data
exactly and must not be hardcoded.

---

## P3-AC-02 · Providers mode shows correct provider list for the selected technology
**Type:** Happy path

| | |
|---|---|
| **Given** | The user arrives at `details.html?id=LOC-007&mode=providers&tech=FTTP&product=P-FTTP-100` (`connection_status = previous`, technology = FTTP). |
| **When** | The page loads and fetches Tool 7 for technology key `FTTP`. |
| **Then** | The page displays exactly 5 provider rows — matching the Tool 7 FTTP count. Each row shows the provider name and a **Sign up** button. No network, service, or subscriber data is shown. |

---

## P3-AC-04 · Details mode does not render for a non-active location
**Type:** Validation

| | |
|---|---|
| **Given** | The user manually navigates to `details.html?id=LOC-006&mode=details` (`connection_status = previous` — no records in Tools 4, 5, or 6). |
| **When** | The page attempts to call `GET /api/locations/LOC-006/subscriber` (and `/network`, `/service`). |
| **Then** | All three API calls return 404. The page renders an error message: **"This address does not have an active subscription. Service details are only available for active locations."** No subscriber, network, or service card is displayed. A back link to `result.html?id=LOC-006` remains keyboard-accessible. |

---

## P3-AC-05 · Provider count matches Tool 7 exactly for Fixed Wireless technology
**Type:** Edge case

| | |
|---|---|
| **Given** | The user arrives at `details.html` with `mode=providers` and `tech=Fixed Wireless` (e.g. from a Fixed Wireless location such as LOC-008). |
| **When** | The page fetches `GET /api/technology/Fixed Wireless/providers` from Tool 7. |
| **Then** | Exactly **2** provider rows are rendered — matching the Tool 7 Fixed Wireless provider count. No more, no fewer. This confirms the provider list is data-driven and not hardcoded. Applies to both the `previous` (Sign up) and `never` (read-only) provider views. |

---

## Never-connected variant behaviour

The `never-connected` view applies when `connection_status = never`. It shares the same
Tool 7 data as P3-AC-02 and P3-AC-05 but differs in the following ways:

| Behaviour | Previous | Never |
|---|---|---|
| Provider rows | Sign up button | Green "Available" badge — no button |
| Plan display | Plan strip in page band only | Plan strip + full plan summary card (name, speed, product ID) |
| Info notice | None | Blue banner: "Contact your preferred provider directly to arrange a connection." |
| Technology card | Not shown | Shown (from Tool 2) |

---

## Business rules in scope

| Rule | Description |
|---|---|
| BR-02 | Non-active locations have no records in Tools 4, 5, or 6 — details mode must not render for them. |
| BR-05 | No NBN, RSP, or real-carrier terminology — generic terms only. |
| BR-06 | Provider list count must match Tool 7 exactly — no hardcoding. |
| BR-07 | Never-connected view is read-only — no Sign up button, no form submission. |

## Data sources

| AC / Variant | Tools used |
|---|---|
| P3-AC-02 | Tool 7 (`GET /api/technology/:tech/providers`) |
| P3-AC-04 | Tools 4, 5, 6 (all return 404 for non-active location) |
| P3-AC-05 | Tool 7 (`GET /api/technology/Fixed Wireless/providers`) |
| Never-connected view | Tool 1 (address), Tool 2 (technology), Tool 3 (selected plan), Tool 7 (providers) |

## Design files

| File | Applies to |
|---|---|
| `design/providers.html` | `connection_status = previous` — provider list with Sign up buttons |
| `design/never-connected.html` | `connection_status = never` — read-only provider availability list |
| `design/details.html` | Combined skeleton with error state for P3-AC-04 |

## Related issues

- `page2-acceptance-criteria.md` — upstream page that links here via "View provider details"
- `[Defect] Absolute asset paths break page when opened via file://` — serve via `npm start` → `http://localhost:3001`
