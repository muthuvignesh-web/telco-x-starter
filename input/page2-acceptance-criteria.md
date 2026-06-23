# Page 2 — Address Result (`public/result.html`)
**Acceptance Criteria · v1.3 · 23 June 2026**

Core branching page. Behaviour differs based on `connection_status` from Tool 1.
Active locations use Tools 4, 5, and 6. Non-active locations use Tools 2 and 3 only.

---

## P2-AC-01 · Active location shows subscriber, network, and service cards
**Type:** Happy path

| | |
|---|---|
| **Given** | The user navigates to `result.html?id=LOC-001` (`connection_status = active`). |
| **When** | The page loads and fetches Tools 1, 2, 4, 5, and 6 for LOC-001. |
| **Then** | The page displays: (1) the address and an **Active** connection badge; (2) a map panel with a pin pointing to the exact address coordinates (lat -37.7665, lng 144.9596 from Tool 1); (3) the current product card (Ultra, 1000/50 Mbps); (4) a network health RAG card showing status as Green, Amber, or Red; (5) a service health RAG card showing status as Green, Amber, or Red. No product catalogue is shown. |

---

## P2-AC-02 · Non-active location shows product catalogue, hides subscriber data
**Type:** Happy path

| | |
|---|---|
| **Given** | The user navigates to `result.html?id=LOC-005` (`connection_status = previous`, technology determined by Tool 2). |
| **When** | The page loads and fetches Tools 1 and 2 for LOC-005, then fetches the product catalogue from Tool 3. |
| **Then** | The page displays: (1) the address and a **Previously connected** badge; (2) a map panel with the correct pin coordinates from Tool 1; (3) the product catalogue for the location's technology. No network card, no service card, and no subscriber card are rendered. |

---

## P2-AC-03 · Upgrade card is shown only when `upgrade_eligible` is true
**Type:** Happy path

| | |
|---|---|
| **Given** | The user navigates to `result.html?id=LOC-002` (active, `upgrade_eligible = true`) and then `result.html?id=LOC-001` (active, `upgrade_eligible = false`). |
| **When** | Both pages load fully. |
| **Then** | For LOC-002: an upgrade card is visible, showing a green banner with the message **"Contact your provider for upgrade"**. For LOC-001: no upgrade card element is rendered in the DOM (element is absent or has `display:none`). The difference is driven solely by the `upgrade_eligible` flag from Tool 4. |

---

## P2-AC-04 · Service health unavailable shows a user-friendly error message
**Type:** Validation

| | |
|---|---|
| **Given** | The user navigates to `result.html` for an active location where the service health data from Tool 6 is not available, or the API call to `GET /api/locations/:id/service` returns a non-200 response. |
| **When** | The page loads and the service health API call fails or returns empty data. |
| **Then** | The page renders the inline error message **"Service status not available. Please contact customer care."** in place of the service health card. No blank or broken card is shown. All other cards (network health, current product) remain visible and functional. |

---

## P2-AC-05 · RAG status badge includes both colour class and visible text label
**Type:** Edge case

| | |
|---|---|
| **Given** | The user navigates to `result.html?id=LOC-003` (active, `service_health = red` per Tool 6). |
| **When** | The page loads and renders the service health card and the network health card. |
| **Then** | The service health RAG badge contains both a colour indicator (CSS class `tx-rag--red` for Red, `tx-rag--amber` for Amber, `tx-rag--green` for Green) **AND** the visible text `RED`, `AMBER`, or `GREEN` respectively. Colour alone is not used to convey status. The same rule applies to the network health badge from Tool 5. |

---

## Business rules in scope

| Rule | Description |
|---|---|
| BR-01 | `active` = existing subscriber → show Tools 4, 5, 6 data. |
| BR-02 | `previous` / `never` = non-subscriber → show Tools 2, 3 only. No network, service, or subscriber cards. |
| BR-03 | Do not show an upgrade card when `upgrade_eligible = false`. |
| BR-04 | RAG status must always carry a text label — never colour alone. |
| BR-05 | No NBN, RSP, or real-carrier terminology — generic terms only. |

## Data sources

| Branch | Tools used |
|---|---|
| Active | Tool 1 (location + coordinates), Tool 2 (technology), Tool 4 (subscriber + upgrade flag), Tool 5 (network health), Tool 6 (service health) |
| Non-active | Tool 1 (location + coordinates), Tool 2 (technology), Tool 3 (product catalogue) |

## Design files

- `design/result-active.html` — active branch skeleton
- `design/result-nonactive.html` — previous / never branch skeleton

## Related issues

- `[Design] Wire Page 2 — Address Result into the app` — developer handoff issue (to be raised)
- `[Defect] Absolute asset paths break page when opened via file://` — serve via `npm start` → `http://localhost:3001`
