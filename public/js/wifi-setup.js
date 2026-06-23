/* wifi-setup.js — Wi-Fi placement assistant scaffold */
(function () {
  'use strict';

  const inputModem     = document.getElementById('input-modem');
  const inputFloorplan = document.getElementById('input-floorplan');
  const previewModem     = document.getElementById('preview-modem');
  const previewFloorplan = document.getElementById('preview-floorplan');
  const previewModemName     = document.getElementById('preview-modem-name');
  const previewFloorplanName = document.getElementById('preview-floorplan-name');
  const btn          = document.getElementById('btn-get-tips');
  const btnHint      = document.getElementById('btn-hint');
  const loadingState = document.getElementById('loading-state');
  const resultsSection = document.getElementById('results-section');
  const tipsList     = document.getElementById('tips-list');
  const confidenceLabel = document.getElementById('confidence-label');

  /* ── File preview ────────────────────────────────────────────────────── */
  function showPreview(input, previewEl, nameEl) {
    const file = input.files && input.files[0];
    if (file) {
      nameEl.textContent = file.name;
      previewEl.hidden = false;
    } else {
      previewEl.hidden = true;
    }
    updateButton();
  }

  inputModem.addEventListener('change', () =>
    showPreview(inputModem, previewModem, previewModemName));

  inputFloorplan.addEventListener('change', () =>
    showPreview(inputFloorplan, previewFloorplan, previewFloorplanName));

  /* ── Enable button when both inputs have files ───────────────────────── */
  function updateButton() {
    const ready = !!(inputModem.files && inputModem.files[0]) &&
                  !!(inputFloorplan.files && inputFloorplan.files[0]);
    btn.disabled = !ready;
    btn.setAttribute('aria-disabled', String(!ready));
    btnHint.textContent = ready ? '' : 'Upload both files to continue';
  }

  /* ── Button click: show loading, then show results ───────────────────── */
  btn.addEventListener('click', function () {
    if (btn.disabled) return;

    // Show loading, hide results
    loadingState.hidden = false;
    loadingState.setAttribute('aria-busy', 'true');
    resultsSection.hidden = true;
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');

    // TODO: call GET /api/wifi-tips with form data (multipart) instead of mock delay
    setTimeout(function () {
      loadingState.hidden = true;
      loadingState.setAttribute('aria-busy', 'false');

      // Populate tips with placeholder data
      const placeholderTips = [
        'Place your modem in a central location to distribute the signal evenly across all rooms.',
        'Keep the modem elevated — on a shelf or desk — rather than on the floor to improve coverage.',
        'Avoid placing the modem near thick concrete or brick walls, which can significantly reduce range.',
        'Keep the modem away from other electronics such as microwaves and cordless phones that cause interference.',
        'If coverage is poor in distant rooms, consider a Wi-Fi extender or mesh network node positioned halfway between the modem and the dead zone.',
      ];

      tipsList.innerHTML = placeholderTips
        .map(tip => `<li>${tip}</li>`)
        .join('');

      confidenceLabel.textContent = 'Confidence: High (demo)';
      resultsSection.hidden = false;
      btn.disabled = false;
      btn.setAttribute('aria-disabled', 'false');
    }, 1500);
  });

})();
