## Issue: Scaffold Wi-Fi modem placement assistant
 
**Stage:** Scaffold  
**Tier:** 🟢 AI Automate — create files and routes only. No logic decisions.
 
---
 
### Context
 
We are adding a new feature to the existing Telco X app.
The app is a three-page Express/Node.js web app.
Pages are served from the `public/` directory.
Routes are defined in `server.js`.
Do NOT modify `lib/data.js` or any file in `/data`.
Do NOT modify or break any existing routes or pages.
Follow the design tokens in `DESIGN_SYSTEM.md`.
 
---
 
### Task
 
Create a skeleton for the modem placement assistant feature.
Do not implement logic — scaffold structure only, with clearly marked TODO comments.
 
---
 
### Files to create
 
1. `public/wifi-setup.html`
   - Page heading: "Improve your Wi-Fi setup"
   - Sub-heading: "Check modem placement"
   - Privacy note (visible on load, above upload controls):
     "Images are used only to generate placement tips in this demo.
      Do not upload sensitive personal information."
   - Two labelled file input controls:
     - Label 1: "Modem photo"
     - Label 2: "Home floorplan"
   - Thumbnail or filename preview area beneath each input (hidden until file chosen)
   - Button: "Get placement tips" (disabled until both inputs have a file)
   - Loading state div (hidden by default):
     text "Analysing your home setup…", with a spinner placeholder
   - Results section (hidden by default):
     - Heading: "Your Wi-Fi placement tips"
     - Ordered list with 5 empty `
` items marked TODO
     - Confidence label placeholder: "Confidence: —"
     - Disclaimer: "These tips are indicative only. Actual Wi-Fi performance
       may depend on walls, building materials, device type, and network conditions."
   - Link back to home: "Back to address search"
   - All colours and type from DESIGN_SYSTEM.md tokens
 
2. `lib/wifiTips.js`
   - Export a single function: `getTips(modemCondition, floorplanCondition)`
   - Add a TODO comment: replace with real vision model call
   - Return a hardcoded array of 5 tip strings for now
   - Add a TODO comment: map modemCondition and floorplanCondition to tip sets
 
3. `public/js/wifi-setup.js`
   - Wire the two file inputs to show preview on change
   - Enable "Get placement tips" button only when both inputs have files
   - On button click: show loading state, hide results
   - Add a TODO comment: call GET /api/wifi-tips with form data
   - After 1.5s mock delay: hide loading, show results with placeholder tips
 
---
 
### Route to add in server.js
 
GET /wifi-setup
  → res.sendFile('public/wifi-setup.html')
 
Do NOT add any POST or API routes yet — mark with a TODO comment in server.js:
  // TODO: POST /api/wifi-tips — replace mock delay with real vision model call
 
---
 
### Nav update
 
In the shared header on ALL existing pages (index, result, details):
  Add a nav link: "Improve your Wi-Fi setup" → /wifi-setup
  Use secondary button style from DESIGN_SYSTEM.md
 
---
 
### Rules
 
- Do NOT modify lib/data.js or any file in /data
- Do NOT change any existing route or break existing tests
- Do NOT implement tip selection logic — leave as TODOs
- All new markup must follow DESIGN_SYSTEM.md (colours, type, spacing, radius)
- Every form control must have a visible label (accessibility)
- Run npm test after scaffolding — all existing tests must still pass
- Stop after scaffold — do not proceed to implement the TODOs
 
---
 
### Acceptance criteria (scaffold only)
 
AC-01: GET /wifi-setup returns 200 and serves wifi-setup.html
AC-03: Page shows two labelled upload controls on load
AC-09: npm test passes with no regressions on existing routes