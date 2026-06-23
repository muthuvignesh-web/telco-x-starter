/* result.js — Page 2 controller */
(function () {
  'use strict';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

  /* ── RAG helpers (P2-AC-05: colour class + visible text always) ──────── */
  const RAG_CLASS = { green: 'tx-rag--green', amber: 'tx-rag--amber', red: 'tx-rag--red' };
  const RAG_LABEL = { green: 'GREEN', amber: 'AMBER', red: 'RED' };

  function ragBadge(status) {
    const s = (status || '').toLowerCase();
    const cls = RAG_CLASS[s] || 'tx-rag--green';
    const lbl = RAG_LABEL[s] || String(status || '').toUpperCase();
    return `<span class="tx-rag ${cls}" aria-label="Status: ${lbl}">${lbl}</span>`;
  }

  /* ── Connection badge ───────────────────────────────────────────────── */
  function connBadge(status) {
    if (status === 'active')   return `<span class="conn-badge conn-badge--active"><span class="conn-badge-dot" aria-hidden="true"></span>Active</span>`;
    if (status === 'previous') return `<span class="conn-badge conn-badge--previous"><span class="conn-badge-dot" aria-hidden="true"></span>Previously connected</span>`;
    return `<span class="conn-badge conn-badge--never"><span class="conn-badge-dot" aria-hidden="true"></span>Never connected</span>`;
  }

  /* ── Card builders ──────────────────────────────────────────────────── */

  /* Tool 4 fields: current_product_name, current_product_id, connected_since, upgrade_eligible */
  function cardCurrentPlan(sub, tech, currentProduct) {
    const speed = currentProduct
      ? `${currentProduct.down_mbps}/${currentProduct.up_mbps} Mbps`
      : (tech ? `Up to ${esc(tech.max_speed_mbps)} Mbps` : '');
    return `<div class="tx-card">
      <p class="card-label">Current plan</p>
      <p class="card-value">${esc(sub.current_product_name)}</p>
      <p class="card-sub">${speed}</p>
      <div style="margin-top:14px">
        <div class="detail-row"><span class="detail-key">Plan ID</span><span class="detail-val" style="font-family:monospace;font-size:.8125rem">${esc(sub.current_product_id)}</span></div>
        <div class="detail-row"><span class="detail-key">Technology</span><span class="detail-val">${esc(tech ? tech.technology : '—')}</span></div>
        <div class="detail-row"><span class="detail-key">Connected since</span><span class="detail-val">${esc(sub.connected_since)}</span></div>
      </div>
    </div>`;
  }

  /* Tool 2 fields: technology, max_speed_mbps */
  function cardTechnology(tech) {
    return `<div class="tx-card">
      <p class="card-label">Network technology</p>
      <p class="card-value">${esc(tech.technology)}</p>
      <p class="card-sub">Maximum speed: ${esc(tech.max_speed_mbps)} Mbps</p>
    </div>`;
  }

  /* Tool 5 fields: network_status, sync_down_mbps, sync_up_mbps, latency_ms, last_outage */
  function cardNetwork(network) {
    const badge = ragBadge(network.network_status);
    const outage = network.last_outage ? esc(network.last_outage) : 'None recorded';
    return `<div class="tx-card">
      <p class="card-label">Network health</p>
      ${badge}
      <div style="margin-top:14px">
        <div class="detail-row"><span class="detail-key">Sync down</span><span class="detail-val">${esc(network.sync_down_mbps)} Mbps</span></div>
        <div class="detail-row"><span class="detail-key">Sync up</span><span class="detail-val">${esc(network.sync_up_mbps)} Mbps</span></div>
        <div class="detail-row"><span class="detail-key">Latency</span><span class="detail-val">${esc(network.latency_ms)} ms</span></div>
        <div class="detail-row"><span class="detail-key">Last outage</span><span class="detail-val">${outage}</span></div>
      </div>
    </div>`;
  }

  /* Tool 6 fields: service_health, open_tickets, last_appointment */
  function cardService(service) {
    if (!service) {
      return `<div class="tx-card">
        <p class="card-label">Service health</p>
        <div class="service-error">
          <span class="service-error-icon" aria-hidden="true">&#9888;</span>
          Service status not available. Please contact customer care.
        </div>
      </div>`;
    }
    const badge = ragBadge(service.service_health);
    const appt = service.last_appointment ? esc(service.last_appointment) : 'None';
    return `<div class="tx-card">
      <p class="card-label">Service health</p>
      ${badge}
      <div style="margin-top:14px">
        <div class="detail-row"><span class="detail-key">Open tickets</span><span class="detail-val">${esc(service.open_tickets)}</span></div>
        <div class="detail-row"><span class="detail-key">Last appointment</span><span class="detail-val">${appt}</span></div>
      </div>
    </div>`;
  }

  /* Tool 4 field: upgrade_eligible (boolean) */
  function cardUpgrade(sub) {
    if (!sub.upgrade_eligible) return '';
    return `<div class="tx-card tx-card--full">
      <p class="card-label">Upgrade available</p>
      <p class="upgrade-body">You may be eligible for a speed or technology upgrade at this address.</p>
      <div class="upgrade-banner">
        <span aria-hidden="true">&#10003;</span>
        Contact your provider for upgrade
      </div>
    </div>`;
  }

  /* Tool 3 fields: product_id, name, down_mbps, up_mbps */
  function cardProductCatalogue(products, tech, locId) {
    const list = Array.isArray(products) ? products : [];
    const rows = list.map(p => `<div class="plan-row">
        <div>
          <p class="plan-name">${esc(p.name)}</p>
          <p class="plan-meta">Speed: ${esc(p.down_mbps)}/${esc(p.up_mbps)} Mbps</p>
          <p class="plan-id">${esc(p.product_id)}</p>
        </div>
        <a href="/details.html?plan=${encodeURIComponent(p.product_id)}&loc=${encodeURIComponent(locId)}&tech=${encodeURIComponent(tech.technology)}" class="tx-btn-primary tx-btn-sm" aria-label="View providers for ${esc(p.name)}">View providers</a>
      </div>`).join('');

    return `<div class="tx-card tx-card--full">
      <p class="card-label">Available plans for ${esc(tech.technology)}</p>
      <div class="plan-list">${rows || '<p style="color:var(--tx-muted);font-size:.875rem">No plans found for this technology.</p>'}</div>
    </div>`;
  }

  /* ── UI helpers ─────────────────────────────────────────────────────── */
  function showLoading(visible) {
    const el = document.getElementById('page-loading');
    el.hidden = !visible;
    el.setAttribute('aria-busy', String(visible));
  }

  function showError(msg) {
    showLoading(false);
    const el = document.getElementById('page-error');
    document.getElementById('page-error-text').textContent = msg;
    el.hidden = false;
  }

  function showContent() {
    showLoading(false);
    document.getElementById('result-content').hidden = false;
  }

  /* ── Address band ───────────────────────────────────────────────────── */
  function populateAddressBand(loc) {
    document.title = `Telco X — ${loc.address}, ${loc.suburb}`;
    document.getElementById('addr-title').textContent = loc.address;
    document.getElementById('addr-sub').textContent = `${loc.suburb} ${loc.state} ${loc.postcode}`;
    document.getElementById('conn-badge').innerHTML = connBadge(loc.connection_status);
  }

  /* ── Map panel ──────────────────────────────────────────────────────── */
  const MAPS_KEY = 'AIzaSyBax2w9RzwUo_T7BWUAmvt3liyqLjt20P8';

  function populateMap(loc) {
    const lat = loc.latitude;
    const lng = loc.longitude;
    const label = `${loc.address}, ${loc.suburb}`;
    const src = `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${lat},${lng}&zoom=16`;
    const iframe = document.getElementById('map-iframe');
    iframe.src = src;
    iframe.title = `Map showing location of ${label}`;
  }

  /* ── ACTIVE branch ──────────────────────────────────────────────────── */
  async function renderActive(id) {
    const [techRes, subRes, netRes, svcRes] = await Promise.allSettled([
      API.getTechnology(id),
      API.getSubscriber(id),
      API.getNetwork(id),
      API.getService(id),
    ]);

    const tech = techRes.status === 'fulfilled' ? techRes.value : null;
    const sub  = subRes.status  === 'fulfilled' ? subRes.value  : null;
    const net  = netRes.status  === 'fulfilled' ? netRes.value  : null;
    const svc  = svcRes.status  === 'fulfilled' ? svcRes.value  : null;

    /* Fetch products to resolve current plan speed */
    let currentProduct = null;
    if (tech && sub) {
      try {
        const products = await API.getProducts(tech.technology);
        currentProduct = (Array.isArray(products) ? products : [])
          .find(p => p.product_id === sub.current_product_id) || null;
      } catch (_) { /* non-critical — speed will fall back to max_speed_mbps */ }
    }

    const fragments = [];
    if (sub) fragments.push(cardCurrentPlan(sub, tech, currentProduct));
    if (tech) fragments.push(cardTechnology(tech));
    if (net)  fragments.push(cardNetwork(net));
    /* service card always rendered for active — shows inline error if svc null (P2-AC-04) */
    fragments.push(cardService(svc));
    /* upgrade card gated on upgrade_eligible flag (P2-AC-03) */
    if (sub) fragments.push(cardUpgrade(sub));

    document.getElementById('result-grid').innerHTML = fragments.join('');

    showContent();
  }

  /* ── NON-ACTIVE branch ──────────────────────────────────────────────── */
  async function renderNonActive(id) {
    const tech = await API.getTechnology(id);
    const products = await API.getProducts(tech.technology);

    document.getElementById('result-grid').innerHTML = [
      cardTechnology(tech),
      cardProductCatalogue(products, tech, id),
    ].join('');

    showContent();
  }

  /* ── Entry point ────────────────────────────────────────────────────── */
  async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
      document.getElementById('addr-title').textContent = 'No address selected';
      showError('Please select an address from the search page.');
      return;
    }

    try {
      const loc = await API.getLocation(id);
      populateAddressBand(loc);
      populateMap(loc);

      if (loc.connection_status === 'active') {
        await renderActive(id);
      } else {
        await renderNonActive(id);
      }
    } catch (err) {
      if (err.message === 'not_found') {
        showError('Address not found. It may have been removed or the link is incorrect.');
      } else {
        showError('Unable to load address details. Please try again or return to search.');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
