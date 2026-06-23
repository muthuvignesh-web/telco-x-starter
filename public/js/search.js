// Page 1 — Address search (P1-AC-01 through P1-AC-06)
(function () {
  const searchInput   = document.getElementById('search');
  const checkBtn      = document.getElementById('check-btn');
  const suggestionList = document.getElementById('suggestion-list');
  const searchCount   = document.getElementById('search-count');
  const searchError   = document.getElementById('search-error');
  const searchErrorText = document.getElementById('search-error-text');
  const locationListEl = document.getElementById('location-list');

  let allLocations = [];
  let filtered = [];
  let activeIndex = -1;

  // ─── Boot ─────────────────────────────────────────────────────────────
  async function init() {
    try {
      allLocations = await API.searchLocations('');
      renderLocationList(allLocations);
    } catch {
      locationListEl.innerHTML =
        '<li><div class="location-item" style="opacity:.5">Could not load addresses.</div></li>';
    }
  }

  // ─── Quick-pick list (all addresses) ──────────────────────────────────
  function renderLocationList(locations) {
    locationListEl.innerHTML = locations.map(l => `
      <li>
        <a href="/result.html?id=${l.id}"
           class="location-item"
           aria-label="${escHtml(l.address)}, ${escHtml(l.suburb)} ${escHtml(l.state)} ${escHtml(l.postcode)}">
          <span class="location-item-left">
            <span class="location-item-addr">${escHtml(l.address)}</span>
            <span class="location-item-suburb">${escHtml(l.suburb)} ${escHtml(l.state)} ${escHtml(l.postcode)}</span>
          </span>
          <svg class="location-item-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </li>`).join('');
  }

  // ─── Suggestion listbox ────────────────────────────────────────────────
  function renderSuggestions(locations) {
    filtered = locations;
    activeIndex = -1;

    if (!locations.length) {
      closeSuggestions();
      searchCount.textContent = '0 suggestions available';
      return;
    }

    suggestionList.innerHTML = locations.map((l, i) => `
      <li
        role="option"
        id="suggestion-${i}"
        class="suggestion-item"
        tabindex="-1"
        aria-selected="false"
        data-id="${escAttr(l.id)}"
      >
        <span class="suggestion-address">${escHtml(l.address)}</span>
        <span class="suggestion-meta">${escHtml(l.suburb)} ${escHtml(l.state)} ${escHtml(l.postcode)}</span>
      </li>`).join('');

    suggestionList.removeAttribute('hidden');
    searchInput.setAttribute('aria-expanded', 'true');

    const count = locations.length;
    searchCount.textContent = `${count} suggestion${count === 1 ? '' : 's'} available`;

    suggestionList.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        navigate(item.dataset.id);
      });
    });
  }

  function closeSuggestions() {
    suggestionList.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.setAttribute('aria-activedescendant', '');
    activeIndex = -1;
  }

  // ─── Keyboard focus tracking within listbox ────────────────────────────
  function setActiveItem(index) {
    const items = suggestionList.querySelectorAll('.suggestion-item');
    items.forEach((item, i) => item.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    if (index >= 0 && items[index]) {
      searchInput.setAttribute('aria-activedescendant', `suggestion-${index}`);
      items[index].scrollIntoView({ block: 'nearest' });
    } else {
      searchInput.setAttribute('aria-activedescendant', '');
    }
    activeIndex = index;
  }

  // ─── Navigation ───────────────────────────────────────────────────────
  function navigate(id) {
    closeSuggestions();
    window.location.href = `/result.html?id=${encodeURIComponent(id)}`;
  }

  // ─── Error helpers ─────────────────────────────────────────────────────
  function showError(msg) {
    searchErrorText.textContent = msg;
    searchError.removeAttribute('hidden');
  }

  function hideError() {
    searchError.setAttribute('hidden', '');
  }

  // ─── Input → filter (P1-AC-01, P1-AC-05) ──────────────────────────────
  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(onInput, 150);
  });

  function onInput() {
    const q = searchInput.value.trim();
    hideError();

    if (!q) {
      checkBtn.disabled = true;
      checkBtn.setAttribute('aria-disabled', 'true');
      closeSuggestions();
      searchCount.textContent = '';
      return;
    }

    checkBtn.disabled = false;
    checkBtn.setAttribute('aria-disabled', 'false');

    const ql = q.toLowerCase();
    const matches = allLocations.filter(l =>
      `${l.address} ${l.suburb} ${l.state} ${l.postcode}`.toLowerCase().includes(ql)
    );
    renderSuggestions(matches);
  }

  // ─── Keyboard navigation (P1-AC-02) ───────────────────────────────────
  searchInput.addEventListener('keydown', e => {
    const items = suggestionList.querySelectorAll('.suggestion-item');
    const total = items.length;
    const open  = !suggestionList.hidden;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open || !total) return;
        setActiveItem(activeIndex < total - 1 ? activeIndex + 1 : 0);
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!open || !total) return;
        setActiveItem(activeIndex > 0 ? activeIndex - 1 : total - 1);
        break;

      case 'Enter':
        if (open && activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          navigate(items[activeIndex].dataset.id);
        } else {
          e.preventDefault();
          handleCheckAddress();
        }
        break;

      case ' ':
        if (open && activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          navigate(items[activeIndex].dataset.id);
        }
        break;

      case 'Escape':
        closeSuggestions();
        break;

      case 'Tab':
        closeSuggestions();
        break;
    }
  });

  // ─── Check address button (P1-AC-03, P1-AC-04) ────────────────────────
  checkBtn.addEventListener('click', handleCheckAddress);

  function handleCheckAddress() {
    const q = searchInput.value.trim();
    if (!q) return;

    const ql = q.toLowerCase();
    const matches = allLocations.filter(l =>
      `${l.address} ${l.suburb} ${l.state} ${l.postcode}`.toLowerCase().includes(ql)
    );

    if (!matches.length) {
      closeSuggestions();
      showError("This address doesn't exist");
      return;
    }

    if (matches.length === 1) {
      navigate(matches[0].id);
    } else {
      renderSuggestions(matches);
    }
  }

  // ─── Clear button ──────────────────────────────────────────────────────
  const clearBtn = document.querySelector('.search-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.focus();
    });
  }

  // ─── Close suggestions when clicking outside ───────────────────────────
  document.addEventListener('mousedown', e => {
    if (!searchInput.contains(e.target) && !suggestionList.contains(e.target)) {
      closeSuggestions();
    }
  });

  // ─── Helpers ──────────────────────────────────────────────────────────
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escAttr(s) {
    return String(s).replace(/"/g, '&quot;');
  }

  init();
})();
