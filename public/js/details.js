/* details.js — Page 3 controller */
(function () {
  'use strict';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

  function initials(name) {
    return (name || '').split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
  }

  /* ── UI helpers ──────────────────────────────────────────────────────── */
  function showLoading(visible) {
    const el = document.getElementById('page-loading');
    el.hidden = !visible;
    el.setAttribute('aria-busy', String(visible));
  }

  function showError(msg, backUrl) {
    showLoading(false);
    document.getElementById('page-error-text').textContent = msg;
    if (backUrl) document.getElementById('page-error-back').href = backUrl;
    document.getElementById('page-error').hidden = false;
  }

  function showContent() {
    showLoading(false);
    document.getElementById('page-content').hidden = false;
  }

  /* ── Connection badge ───────────────────────────────────────────────── */
  function connBadge(status) {
    if (status === 'active')   return `<span class="conn-badge conn-badge--active"><span class="conn-badge-dot" aria-hidden="true"></span>Active</span>`;
    if (status === 'previous') return `<span class="conn-badge conn-badge--previous"><span class="conn-badge-dot" aria-hidden="true"></span>Previously connected</span>`;
    return `<span class="conn-badge conn-badge--never"><span class="conn-badge-dot" aria-hidden="true"></span>Never connected</span>`;
  }

  /* ── Page band ──────────────────────────────────────────────────────── */
  function populateBand(loc, tech, product) {
    document.title = `Telco X — Providers for ${loc.address}`;
    document.getElementById('band-title').textContent = loc.address;
    document.getElementById('band-sub').textContent = `${loc.suburb} ${loc.state} ${loc.postcode}`;
    document.getElementById('conn-badge').innerHTML = connBadge(loc.connection_status);

    const backLink = document.getElementById('back-link');
    backLink.href = `/result.html?id=${encodeURIComponent(loc.id)}`;
    backLink.setAttribute('aria-label', `Back to result for ${loc.address}`);

    const chips = [];
    if (tech) chips.push(`
      <div class="plan-chip">
        <span class="plan-chip-label">Technology</span>
        <span class="plan-chip-value">${esc(tech.technology)}</span>
      </div>`);
    if (product) {
      chips.push(`
        <div class="plan-chip">
          <span class="plan-chip-label">Selected plan</span>
          <span class="plan-chip-value">${esc(product.name)} &mdash; ${esc(product.down_mbps)} / ${esc(product.up_mbps)} Mbps</span>
        </div>
        <div class="plan-chip">
          <span class="plan-chip-label">Product ID</span>
          <span class="plan-chip-value">${esc(product.product_id)}</span>
        </div>`);
    }
    if (chips.length) {
      const strip = document.getElementById('plan-strip');
      strip.innerHTML = chips.join('');
      strip.hidden = false;
    }
  }

  /* ── Plan summary cards (never only) ─────────────────────────────────── */
  function buildPlanCards(tech, product) {
    const techCard = tech ? `
      <div class="tx-card">
        <p class="card-label">Connection technology</p>
        <p class="card-value">${esc(tech.technology)}</p>
        <p class="card-sub">Maximum speed: ${esc(tech.max_speed_mbps)} Mbps</p>
      </div>` : '';

    const planCard = product ? `
      <div class="tx-card">
        <p class="card-label">Selected plan</p>
        <p class="card-value">${esc(product.name)}</p>
        <p class="card-sub">${esc(product.down_mbps)} Mbps down &middot; ${esc(product.up_mbps)} Mbps up</p>
        <div style="margin-top:16px">
          <div class="detail-row">
            <span class="detail-key">Product ID</span>
            <span class="detail-val" style="font-family:monospace;font-size:.8125rem">${esc(product.product_id)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Technology</span>
            <span class="detail-val">${esc(tech ? tech.technology : '')}</span>
          </div>
        </div>
      </div>` : '';

    if (!techCard && !planCard) return '';
    return `<div class="info-grid">${techCard}${planCard}</div>`;
  }

  /* ── Provider row builders ───────────────────────────────────────────── */
  function rowNever(name, tech, product) {
    const meta = tech
      ? `${esc(tech.technology)}${product ? ` &middot; ${esc(product.name)} &mdash; ${esc(product.down_mbps)} / ${esc(product.up_mbps)} Mbps` : ''}`
      : '';
    return `<div class="provider-row" role="listitem">
      <div class="provider-avatar" aria-hidden="true">${esc(initials(name))}</div>
      <div class="provider-info">
        <p class="provider-name">${esc(name)}</p>
        ${meta ? `<p class="provider-meta">${meta}</p>` : ''}
      </div>
      <span class="provider-status" aria-label="${esc(name)}: Available at this address">
        <span class="provider-status-dot" aria-hidden="true"></span>
        Available
      </span>
    </div>`;
  }

  function rowPrevious(name, tech, product) {
    const meta = tech
      ? `${esc(tech.technology)}${product ? ` &middot; ${esc(product.name)} &mdash; ${esc(product.down_mbps)} / ${esc(product.up_mbps)} Mbps` : ''}`
      : '';
    return `<div class="provider-row" role="listitem">
      <div class="provider-avatar" aria-hidden="true">${esc(initials(name))}</div>
      <div class="provider-info">
        <p class="provider-name">${esc(name)}</p>
        ${meta ? `<p class="provider-meta">${meta}</p>` : ''}
      </div>
      <button class="tx-btn-primary tx-btn-sm signup-btn" aria-label="Sign up with ${esc(name)}">Sign up</button>
      <span class="provider-status provider-status--mobile" aria-label="${esc(name)}: Available at this address">
        <span class="provider-status-dot" aria-hidden="true"></span>
        Available
      </span>
    </div>`;
  }

  function rowActive(name, tech) {
    return `<div class="provider-row" role="listitem">
      <div class="provider-avatar" aria-hidden="true">${esc(initials(name))}</div>
      <div class="provider-info">
        <p class="provider-name">${esc(name)}</p>
        ${tech ? `<p class="provider-meta">${esc(tech.technology)}</p>` : ''}
      </div>
      <span class="provider-status" aria-label="${esc(name)}: Available at this address">
        <span class="provider-status-dot" aria-hidden="true"></span>
        Available
      </span>
    </div>`;
  }

  /* ── Section + list HTML ────────────────────────────────────────────── */
  function sectionHeader(label, count) {
    return `<div class="section-row">
      <span class="section-label">${label}</span>
      <span class="count-badge" aria-label="${count} provider${count !== 1 ? 's' : ''} available">
        ${count} provider${count !== 1 ? 's' : ''}
      </span>
    </div>`;
  }

  /* ── Render: never (read-only + plan cards + info notice) ────────────── */
  function renderNever(tech, product, providers) {
    const list = Array.isArray(providers) ? providers : [];
    const rows = list.map(n => rowNever(n, tech, product)).join('');
    document.getElementById('page-content').innerHTML =
      buildPlanCards(tech, product) +
      sectionHeader('Providers available at this address', list.length) +
      `<div class="provider-list" role="list">${rows}</div>` +
      `<div class="info-notice" role="note">
         <span class="info-notice-icon" aria-hidden="true">&#9432;</span>
         <span>Contact your preferred provider directly to arrange a connection.</span>
       </div>`;
  }

  /* ── Render: previous (Sign up buttons) ─────────────────────────────── */
  function renderPrevious(tech, product, providers) {
    const list = Array.isArray(providers) ? providers : [];
    const rows = list.map(n => rowPrevious(n, tech, product)).join('');
    const content = document.getElementById('page-content');
    content.innerHTML =
      sectionHeader('Providers available at this address', list.length) +
      `<div class="provider-list" role="list">${rows}</div>`;

    content.querySelectorAll('.signup-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        this.textContent = 'Requested ✓';
        this.disabled = true;
        this.setAttribute('aria-label', 'Sign-up request sent');
      });
    });
  }

  /* ── Render: active (read-only, no plan cards) ───────────────────────── */
  function renderActive(tech, providers) {
    const list = Array.isArray(providers) ? providers : [];
    const rows = list.map(n => rowActive(n, tech)).join('');
    document.getElementById('page-content').innerHTML =
      sectionHeader('Providers at this address', list.length) +
      `<div class="provider-list" role="list">${rows}</div>`;
  }

  /* ── Entry point ────────────────────────────────────────────────────── */
  async function init() {
    const params = new URLSearchParams(window.location.search);
    const locId   = params.get('loc');
    const techParam = params.get('tech');
    const planParam = params.get('plan');
    const mode    = params.get('mode');

    if (!locId) {
      document.getElementById('band-title').textContent = 'No location specified';
      showError('Please select an address from the search page.');
      return;
    }

    try {
      const loc = await API.getLocation(locId);
      const backUrl = `/result.html?id=${encodeURIComponent(locId)}`;

      /* P3-AC-04: details mode requested for a non-active location */
      if (mode === 'details' && loc.connection_status !== 'active') {
        populateBand(loc, null, null);
        showError(
          'This address does not have an active subscription. Service details are only available for active locations.',
          backUrl
        );
        return;
      }

      /* Resolve technology */
      let techData = null;
      try { techData = await API.getTechnology(locId); } catch (_) {}

      /* Resolve selected plan */
      let product = null;
      if (planParam && techData) {
        try {
          const products = await API.getProducts(techData.technology);
          product = (Array.isArray(products) ? products : []).find(p => p.product_id === planParam) || null;
        } catch (_) {}
      }

      /* Fetch providers — use URL tech param as fallback if Tool 2 failed */
      const techName = (techData && techData.technology) || techParam || '';
      let providers = [];
      if (techName) {
        try { providers = await API.getProviders(techName); } catch (_) {}
      }

      populateBand(loc, techData, product);

      const status = loc.connection_status;
      if (status === 'never') {
        renderNever(techData, product, providers);
      } else if (status === 'previous') {
        renderPrevious(techData, product, providers);
      } else {
        renderActive(techData, providers);
      }

      showContent();
    } catch (err) {
      if (err.message === 'not_found') {
        showError('Address not found. It may have been removed or the link is incorrect.');
      } else {
        showError('Unable to load provider details. Please try again or return home.');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
