// Telco X — service availability prototype (STARTER)
// Two endpoints are fully worked as examples. The rest are guided TODOs —
// connecting Tools 2–7 is the build challenge. Each TODO returns 501 with a hint.

const express = require('express');
const path = require('path');
const data = require('./lib/data');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// WORKED EXAMPLE — Tool 1 (Locations). Search + select + helpful error.
// ============================================================

// AC1: all ten addresses can be searched/selected. Optional ?q= filter.
app.get('/api/locations', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  const match = (l) => `${l.address} ${l.suburb} ${l.state} ${l.postcode}`.toLowerCase().includes(q);
  const results = q ? data.locations.filter(match) : data.locations;
  res.json(results.map(({ id, address, suburb, state, postcode }) =>
    ({ id, address, suburb, state, postcode })));
});

// AC2/AC3: select one address; unknown id returns a helpful error.
app.get('/api/locations/:id', (req, res) => {
  const location = data.getLocation(req.params.id);
  if (!location) {
    return res.status(404).json({
      error: 'Address not found',
      message: 'We could not find that address. Check the details and try again.'
    });
  }
  res.json(location); // includes coordinates for the map pin + connection_status
});

// ============================================================
// TODO — connect Tools 2–6 (build phase: 35–105 min)
// ============================================================

// Tool 2 — technology for a location.
app.get('/api/locations/:id/technology', (req, res) => {
  const location = data.getLocation(req.params.id);
  if (!location) return res.status(404).json({ error: 'Location not found' });
  const tech = data.getTechnology(req.params.id);
  if (!tech) return res.status(404).json({ error: 'Technology record not found for this location' });
  res.json(tech);
});

// Tool 3 — valid products for a technology.
app.get('/api/technology/:tech/products', (req, res) => {
  const products = data.getProductsForTechnology(req.params.tech);
  res.json(products);
});

// Tool 4 — subscriber record. ACTIVE locations only.
app.get('/api/locations/:id/subscriber', (req, res) => {
  const location = data.getLocation(req.params.id);
  if (!location) return res.status(404).json({ error: 'Location not found' });
  if (!data.isActive(req.params.id)) {
    return res.status(403).json({ error: 'Subscriber records are only available for active locations' });
  }
  const subscriber = data.getSubscriber(req.params.id);
  if (!subscriber) return res.status(404).json({ error: 'Subscriber record not found' });
  res.json(subscriber);
});

// Tool 5 — network record. ACTIVE locations only.
app.get('/api/locations/:id/network', (req, res) => {
  const location = data.getLocation(req.params.id);
  if (!location) return res.status(404).json({ error: 'Location not found' });
  if (!data.isActive(req.params.id)) {
    return res.status(403).json({ error: 'Network records are only available for active locations' });
  }
  const network = data.getNetwork(req.params.id);
  if (!network) return res.status(404).json({ error: 'Network record not found' });
  res.json(network);
});

// Tool 6 — service record. ACTIVE locations only.
app.get('/api/locations/:id/service', (req, res) => {
  const location = data.getLocation(req.params.id);
  if (!location) return res.status(404).json({ error: 'Location not found' });
  if (!data.isActive(req.params.id)) {
    return res.status(403).json({ error: 'Service records are only available for active locations' });
  }
  const service = data.getService(req.params.id);
  if (!service) return res.status(404).json({ error: 'Service record not found' });
  res.json(service);
});

// Tool 7 — providers for a technology.
app.get('/api/technology/:tech/providers', (req, res) => {
  const providers = data.getProvidersForTechnology(req.params.tech);
  res.json(providers);
});

// Wi-Fi placement assistant
app.get('/wifi-setup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wifi-setup.html'));
});
// TODO: POST /api/wifi-tips — replace mock delay with real vision model call

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Telco X starter running on http://localhost:${PORT}`));
}
module.exports = app;
