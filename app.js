'use strict';

const DATA_PATHS = {
  points: 'data/gempa.geojson',
  metadata: 'data/metadata.json'
};

const DEPTH_CLASSES = ['Dangkal', 'Menengah', 'Dalam'];
const MAGNITUDE_CLASSES = ['lt3', '3to5', 'gte5'];

const DEPTH_COLORS = {
  Dangkal: '#E53935',
  Menengah: '#FBC02D',
  Dalam: '#2E7D32'
};

const MAGNITUDE_COLORS = {
  lt3: '#86a9f2',
  '3to5': '#1647b8',
  gte5: '#b3c4ec'
};

const TRANSLATIONS = {
  id: {
    pageTitle: 'QuakePulse | Monitoring Gempa',
    loading: 'Memuat data gempa...',
    navMap: 'Peta',
    navAnalysis: 'Analisis',
    navSummary: 'Ringkasan',
    heroEyebrow: 'MONITORING KEJADIAN GEMPA',
    dashboardTitle: 'Dashboard Gempa Regional',
    totalQuakesLabel: 'TOTAL GEMPA',
    activeFilter: 'Sesuai filter aktif',
    dominantDepthLabel: 'KEDALAMAN DOMINAN',
    strongestMagnitudeLabel: 'MAGNITUDO TERKUAT',
    averageDepthLabel: 'RATA-RATA KEDALAMAN',
    kilometersBelowSurface: 'Kilometer di bawah permukaan',
    filterEyebrow: 'FILTER DATA',
    filterTitle: 'Atur tampilan peta',
    reset: 'Reset',
    startDate: 'Tanggal mulai',
    endDate: 'Tanggal selesai',
    locationLabel: 'Lokasi kejadian',
    allLocations: 'Semua lokasi',
    locationNotFound: 'Lokasi tidak ditemukan.',
    allLocationsSelected: 'Semua lokasi dipilih',
    depthClass: 'Kelas kedalaman',
    shallow: 'Dangkal',
    intermediate: 'Menengah',
    deep: 'Dalam',
    magnitudeClass: 'Kelas magnitudo',
    micro: 'Mikro',
    minor: 'Kecil',
    moderate: 'Sedang',
    strong: 'Kuat',
    magnitudeLt3: 'M < 3,0',
    magnitude3To5: '3,0 ≤ M < 5,0',
    magnitudeGte5: 'M ≥ 5,0',
    magnitudeLegend: 'Ukuran Magnitudo',
    tsunamiIndication: 'Indikasi awal tsunami',
    notIndicated: 'Tidak terindikasi',
    verifyBmkg: 'Perlu verifikasi BMKG',
    layers: 'Layer',
    earthquakePoints: 'Titik gempa',
    estimatedBuffer: 'Buffer estimasi getaran',
    filterHelp: 'Klik titik gempa untuk melihat magnitudo, kedalaman, dan estimasi jangkauan getaran.',
    applyFilter: 'Terapkan filter',
    spatialDistribution: 'Distribusi Spasial Gempa',
    configureFilter: 'Atur Filter',
    fitData: 'Lihat Semua Data',
    mapNote: 'Buffer merupakan estimasi visualisasi, bukan laporan resmi wilayah dirasakan. Informasi tsunami wajib diverifikasi melalui BMKG.',
    analysisEyebrow: 'ANALISIS PARAMETER',
    analysisTitle: 'Kedalaman dan Magnitudo',
    depthAnalysis: 'ANALISIS KEDALAMAN',
    depthDistribution: 'Distribusi Kelas Kedalaman',
    magnitudeAnalysis: 'ANALISIS MAGNITUDO',
    magnitudeComposition: 'Komposisi Magnitudo',
    locationSummary: 'RINGKASAN LOKASI',
    topLocations: 'Lokasi dengan Kejadian Terbanyak',
    rank: 'Peringkat',
    location: 'Lokasi',
    total: 'Total',
    strongestEvents: 'KEJADIAN TERKUAT',
    topMagnitudeEvents: 'Top 10 Magnitudo',
    date: 'Tanggal',
    depth: 'Kedalaman',
    home: 'Beranda',
    filterNav: 'Filter',
    footerSource: '© 2026 QuakePulse. Data diolah dari gempa juni.xlsx.',
    footerDeveloper: 'Dikembangkan sebagai WebGIS gempa statis untuk GitHub Pages.',
    quakeSingular: 'kejadian',
    quakePlural: 'kejadian',
    dataSummary: '{start} - {end} • {count} kejadian gempa',
    noData: 'Tidak ada data',
    adjustFilter: 'Ubah filter untuk menampilkan data',
    selectedOneLocation: '1 lokasi dipilih: {location}',
    selectedManyLocations: '{count} lokasi dipilih',
    filteredCount: '{count} data sesuai filter',
    showingTop: 'Menampilkan {count} lokasi teratas',
    showingEvents: 'Menampilkan {count} kejadian terkuat',
    popupTitle: 'Gempa Magnitudo {magnitude}',
    time: 'Waktu',
    coordinates: 'Koordinat',
    depthClassPopup: 'Kelas kedalaman',
    magnitudeClassPopup: 'Kelas magnitudo',
    estimatedRadius: 'Estimasi jangkauan',
    tsunamiStatus: 'Indikasi tsunami',
    estimatedDisclaimer: 'Radius merupakan model visualisasi sederhana, bukan laporan resmi area dirasakan atau ShakeMap.',
    depthLegend: 'Kelas Kedalaman',
    bufferLegend: 'Buffer estimasi',
    countUnit: 'kejadian',
    averageShort: 'rata-rata',
    loadFailed: 'Data gagal dimuat',
    localServerHelp: 'Jalankan project melalui local server, bukan dengan membuka index.html langsung.',
    loadFileFailed: 'Gagal membaca {path}: HTTP {status}',
    unknown: 'Tidak diketahui',
    km: 'km',
    m: 'm'
  },
  en: {
    pageTitle: 'QuakePulse | Earthquake Monitoring',
    loading: 'Loading earthquake data...',
    navMap: 'Map',
    navAnalysis: 'Analysis',
    navSummary: 'Summary',
    heroEyebrow: 'EARTHQUAKE EVENT MONITORING',
    dashboardTitle: 'Regional Earthquake Dashboard',
    totalQuakesLabel: 'TOTAL EARTHQUAKES',
    activeFilter: 'Based on active filters',
    dominantDepthLabel: 'DOMINANT DEPTH',
    strongestMagnitudeLabel: 'STRONGEST MAGNITUDE',
    averageDepthLabel: 'AVERAGE DEPTH',
    kilometersBelowSurface: 'Kilometres below the surface',
    filterEyebrow: 'DATA FILTERS',
    filterTitle: 'Configure map display',
    reset: 'Reset',
    startDate: 'Start date',
    endDate: 'End date',
    locationLabel: 'Event location',
    allLocations: 'All locations',
    locationNotFound: 'Location not found.',
    allLocationsSelected: 'All locations selected',
    depthClass: 'Depth class',
    shallow: 'Shallow',
    intermediate: 'Intermediate',
    deep: 'Deep',
    magnitudeClass: 'Magnitude class',
    micro: 'Micro',
    minor: 'Minor',
    moderate: 'Moderate',
    strong: 'Strong',
    magnitudeLt3: 'M < 3.0',
    magnitude3To5: '3.0 ≤ M < 5.0',
    magnitudeGte5: 'M ≥ 5.0',
    magnitudeLegend: 'Magnitude Size',
    tsunamiIndication: 'Initial tsunami indication',
    notIndicated: 'Not indicated',
    verifyBmkg: 'BMKG verification required',
    layers: 'Layers',
    earthquakePoints: 'Earthquake points',
    estimatedBuffer: 'Estimated shaking buffer',
    filterHelp: 'Select an earthquake point to view magnitude, depth, and estimated shaking range.',
    applyFilter: 'Apply filters',
    spatialDistribution: 'Earthquake Spatial Distribution',
    configureFilter: 'Filters',
    fitData: 'View All Data',
    mapNote: 'The buffer is a visual estimate, not an official felt-area report. Tsunami information must be verified through BMKG.',
    analysisEyebrow: 'PARAMETER ANALYSIS',
    analysisTitle: 'Depth and Magnitude',
    depthAnalysis: 'DEPTH ANALYSIS',
    depthDistribution: 'Depth Class Distribution',
    magnitudeAnalysis: 'MAGNITUDE ANALYSIS',
    magnitudeComposition: 'Magnitude Composition',
    locationSummary: 'LOCATION SUMMARY',
    topLocations: 'Locations with the Most Events',
    rank: 'Rank',
    location: 'Location',
    total: 'Total',
    strongestEvents: 'STRONGEST EVENTS',
    topMagnitudeEvents: 'Top 10 Magnitudes',
    date: 'Date',
    depth: 'Depth',
    home: 'Home',
    filterNav: 'Filters',
    footerSource: '© 2026 QuakePulse. Data processed from gempa juni.xlsx.',
    footerDeveloper: 'Developed as a static earthquake WebGIS for GitHub Pages.',
    quakeSingular: 'event',
    quakePlural: 'events',
    dataSummary: '{start} - {end} • {count} earthquake events',
    noData: 'No data',
    adjustFilter: 'Adjust the filters to display data',
    selectedOneLocation: '1 location selected: {location}',
    selectedManyLocations: '{count} locations selected',
    filteredCount: '{count} matching records',
    showingTop: 'Showing the top {count} locations',
    showingEvents: 'Showing the {count} strongest events',
    popupTitle: 'Magnitude {magnitude} Earthquake',
    time: 'Time',
    coordinates: 'Coordinates',
    depthClassPopup: 'Depth class',
    magnitudeClassPopup: 'Magnitude class',
    estimatedRadius: 'Estimated range',
    tsunamiStatus: 'Tsunami indication',
    estimatedDisclaimer: 'The radius is a simple visual model, not an official felt-area report or ShakeMap.',
    depthLegend: 'Depth Class',
    bufferLegend: 'Estimated buffer',
    countUnit: 'events',
    averageShort: 'average',
    loadFailed: 'Unable to load data',
    localServerHelp: 'Run the project through a local server instead of opening index.html directly.',
    loadFileFailed: 'Unable to read {path}: HTTP {status}',
    unknown: 'Unknown',
    km: 'km',
    m: 'm'
  }
};

const state = {
  pointsData: null,
  metadata: null,
  filteredFeatures: [],
  map: null,
  pointLayer: null,
  bufferLayer: null,
  depthChart: null,
  magnitudeChart: null,
  locationNames: [],
  language: 'id',
  initialFitDone: false,
  lightBase: null,
  osmBase: null,
  legendControl: null
};

const mobileLayoutQuery = window.matchMedia('(max-width: 1020px)');

const elements = {
  loadingOverlay: document.getElementById('loadingOverlay'),
  periodLabel: document.getElementById('periodLabel'),
  totalQuakes: document.getElementById('totalQuakes'),
  dominantDepth: document.getElementById('dominantDepth'),
  dominantDepthDetail: document.getElementById('dominantDepthDetail'),
  strongestMagnitude: document.getElementById('strongestMagnitude'),
  strongestMagnitudeDetail: document.getElementById('strongestMagnitudeDetail'),
  averageDepth: document.getElementById('averageDepth'),
  averageDepthDetail: document.getElementById('averageDepthDetail'),
  startDate: document.getElementById('startDate'),
  endDate: document.getElementById('endDate'),
  locationSearch: document.getElementById('locationSearch'),
  locationOptions: document.getElementById('locationOptions'),
  locationSearchEmpty: document.getElementById('locationSearchEmpty'),
  locationAll: document.getElementById('locationAll'),
  locationSelectionSummary: document.getElementById('locationSelectionSummary'),
  togglePoints: document.getElementById('togglePoints'),
  toggleBuffers: document.getElementById('toggleBuffers'),
  resetButton: document.getElementById('resetButton'),
  fitButton: document.getElementById('fitButton'),
  applyFilterButton: document.getElementById('applyFilterButton'),
  filterPanel: document.getElementById('filterPanel'),
  filterToggleButton: document.getElementById('filterToggleButton'),
  bottomFilterButton: document.getElementById('bottomFilterButton'),
  locationTableBody: document.getElementById('locationTableBody'),
  eventTableBody: document.getElementById('eventTableBody'),
  tableStatus: document.getElementById('tableStatus'),
  eventTableStatus: document.getElementById('eventTableStatus'),
  languageToggle: document.getElementById('languageToggle'),
  languageMenu: document.getElementById('languageMenu'),
  languageCode: document.getElementById('languageCode')
};

function t(key, variables = {}) {
  const dictionary = TRANSLATIONS[state.language] || TRANSLATIONS.id;
  const fallback = TRANSLATIONS.id[key] ?? key;
  const template = dictionary[key] ?? fallback;
  return Object.entries(variables).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function currentLocale() {
  return state.language === 'en' ? 'en-US' : 'id-ID';
}

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(currentLocale(), { maximumFractionDigits }).format(value);
}

function formatDate(dateString, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!dateString) return '–';
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat(currentLocale(), options).format(date);
}

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return new Intl.DateTimeFormat(currentLocale(), {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function displayDepth(depthClass) {
  const keys = { Dangkal: 'shallow', Menengah: 'intermediate', Dalam: 'deep' };
  return t(keys[depthClass] || 'unknown');
}

function magnitudeClassFor(magnitude) {
  const value = Number(magnitude);
  if (value < 3) return 'lt3';
  if (value < 5) return '3to5';
  return 'gte5';
}

function displayMagnitudeClass(magnitudeClass) {
  const keys = { lt3: 'magnitudeLt3', '3to5': 'magnitude3To5', gte5: 'magnitudeGte5' };
  return t(keys[magnitudeClass] || 'unknown');
}

function displayTsunami(code) {
  return code === 'verify' ? t('verifyBmkg') : t('notIndicated');
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(t('loadFileFailed', { path, status: response.status }));
  return response.json();
}

function hideLoading() {
  elements.loadingOverlay.classList.add('hidden');
  window.setTimeout(() => elements.loadingOverlay.remove(), 300);
}

function showLoadError(error) {
  const localHelp = window.location.protocol === 'file:' ? `<br><small>${escapeHtml(t('localServerHelp'))}</small>` : '';
  elements.loadingOverlay.innerHTML = `
    <span class="material-symbols-outlined" style="font-size:2.2rem;color:#b42318">error</span>
    <p><strong>${escapeHtml(t('loadFailed'))}</strong><br>${escapeHtml(error.message || error)}${localHelp}</p>
  `;
}

function normalizeData() {
  state.pointsData.features = (state.pointsData.features || []).filter((feature) => {
    const [lon, lat] = feature.geometry?.coordinates || [];
    const p = feature.properties || {};
    const valid = Number.isFinite(Number(lat)) && Number.isFinite(Number(lon)) && p.date;
    if (valid) p.magnitude_class = magnitudeClassFor(p.magnitude);
    return valid;
  });

  state.locationNames = [...new Set(state.pointsData.features.map((feature) => feature.properties.location || t('unknown')))]
    .sort((a, b) => a.localeCompare(b, 'id'));
}

function initializeDateInputs() {
  const dates = state.pointsData.features.map((feature) => feature.properties.date).sort();
  const minDate = state.metadata?.date_start || dates[0];
  const maxDate = state.metadata?.date_end || dates[dates.length - 1];
  elements.startDate.min = minDate;
  elements.startDate.max = maxDate;
  elements.endDate.min = minDate;
  elements.endDate.max = maxDate;
  elements.startDate.value = minDate;
  elements.endDate.value = maxDate;
}

function buildLocationOptions() {
  elements.locationOptions.innerHTML = state.locationNames.map((name) => `
    <label class="district-option" data-search="${escapeHtml(name.toLowerCase())}">
      <input class="location-filter" type="checkbox" value="${escapeHtml(name)}" checked />
      <span>${escapeHtml(name)}</span>
    </label>
  `).join('');
}

function selectedValues(selector) {
  return new Set([...document.querySelectorAll(`${selector}:checked`)].map((input) => input.value));
}

function selectedLocations() {
  if (elements.locationAll.checked) return new Set(state.locationNames);
  return selectedValues('.location-filter:not(#locationAll)');
}

function syncLocationAllState() {
  const locationInputs = [...document.querySelectorAll('.location-filter:not(#locationAll)')];
  const checkedCount = locationInputs.filter((input) => input.checked).length;
  elements.locationAll.checked = checkedCount === locationInputs.length;
  elements.locationAll.indeterminate = checkedCount > 0 && checkedCount < locationInputs.length;
  updateLocationSelectionSummary();
}

function updateLocationSelectionSummary() {
  if (elements.locationAll.checked) {
    elements.locationSelectionSummary.textContent = t('allLocationsSelected');
    return;
  }
  const selected = [...selectedLocations()];
  if (selected.length === 1) {
    elements.locationSelectionSummary.textContent = t('selectedOneLocation', { location: selected[0] });
  } else {
    elements.locationSelectionSummary.textContent = t('selectedManyLocations', { count: selected.length });
  }
}

function filterLocationOptions() {
  const query = elements.locationSearch.value.trim().toLowerCase();
  let visibleCount = 0;
  document.querySelectorAll('#locationOptions .district-option').forEach((label) => {
    const visible = !query || label.dataset.search.includes(query);
    label.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  elements.locationSearchEmpty.hidden = visibleCount > 0;
}

function initializeMap() {
  state.map = L.map('map', {
    preferCanvas: true,
    zoomControl: true,
    minZoom: 3
  }).setView([-8.2, 111.2], 7);

  state.lightBase = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(state.map);

  state.osmBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  });

  L.control.layers(
    { 'Peta Terang': state.lightBase, OpenStreetMap: state.osmBase },
    null,
    { position: 'topright', collapsed: true }
  ).addTo(state.map);

  state.pointLayer = L.layerGroup().addTo(state.map);
  state.bufferLayer = L.layerGroup().addTo(state.map);

  state.legendControl = L.control({ position: 'bottomleft' });
  state.legendControl.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = legendHtml();
    return div;
  };
  state.legendControl.addTo(state.map);
}

function legendHtml() {
  return `
    <strong>${escapeHtml(t('depthLegend'))}</strong>
    ${DEPTH_CLASSES.map((depthClass) => `
      <div class="legend-row"><span class="legend-swatch" style="background:${DEPTH_COLORS[depthClass]}"></span>${escapeHtml(displayDepth(depthClass))}</div>
    `).join('')}
    <div class="legend-row"><span class="legend-buffer"></span>${escapeHtml(t('bufferLegend'))}</div>
    <strong class="legend-section-title">${escapeHtml(t('magnitudeLegend'))}</strong>
    ${MAGNITUDE_CLASSES.map((magnitudeClass) => `
      <div class="legend-row"><span class="legend-mag-dot ${magnitudeClass}"></span>${escapeHtml(displayMagnitudeClass(magnitudeClass))}</div>
    `).join('')}
  `;
}

function refreshLegend() {
  const legend = document.querySelector('.map-legend');
  if (legend) legend.innerHTML = legendHtml();
}

function popupHtml(feature) {
  const p = feature.properties;
  const coordinates = feature.geometry.coordinates;
  const statusClass = p.tsunami_code === 'verify' ? 'popup-status verify' : 'popup-status';
  return `
    <div class="popup-title">
      <span class="material-symbols-outlined">earthquake</span>
      ${escapeHtml(t('popupTitle', { magnitude: formatNumber(p.magnitude, 2) }))}
    </div>
    <div class="popup-grid">
      <span>${escapeHtml(t('date'))}</span><strong>${escapeHtml(formatDateTime(p.datetime))}</strong>
      <span>${escapeHtml(t('location'))}</span><strong>${escapeHtml(p.location)}</strong>
      <span>${escapeHtml(t('coordinates'))}</span><strong>${formatNumber(coordinates[1], 5)}, ${formatNumber(coordinates[0], 5)}</strong>
      <span>${escapeHtml(t('depth'))}</span><strong>${formatNumber(p.depth_km, 2)} ${escapeHtml(t('km'))}</strong>
      <span>${escapeHtml(t('depthClassPopup'))}</span><strong>${escapeHtml(displayDepth(p.depth_class))}</strong>
      <span>${escapeHtml(t('magnitudeClassPopup'))}</span><strong>${escapeHtml(displayMagnitudeClass(magnitudeClassFor(p.magnitude)))}</strong>
      <span>${escapeHtml(t('estimatedRadius'))}</span><strong>${formatNumber(p.estimated_radius_km, 1)} ${escapeHtml(t('km'))} (${formatNumber(p.estimated_radius_m)} ${escapeHtml(t('m'))})</strong>
      <span>${escapeHtml(t('tsunamiStatus'))}</span><strong><span class="${statusClass}">${escapeHtml(displayTsunami(p.tsunami_code))}</span></strong>
    </div>
    <p class="popup-note">${escapeHtml(t('estimatedDisclaimer'))}</p>
  `;
}

function markerRadius(magnitude) {
  const magnitudeClass = magnitudeClassFor(magnitude);
  if (magnitudeClass === 'lt3') return 4.5;
  if (magnitudeClass === '3to5') return 7.5;
  return 11.5;
}

function renderMap(features) {
  state.pointLayer.clearLayers();
  state.bufferLayer.clearLayers();

  features.forEach((feature) => {
    const p = feature.properties;
    const [lon, lat] = feature.geometry.coordinates;
    const color = DEPTH_COLORS[p.depth_class] || DEPTH_COLORS.Dangkal;

    L.circle([lat, lon], {
      radius: Number(p.estimated_radius_m),
      color,
      weight: 1,
      opacity: 0.65,
      fillColor: color,
      fillOpacity: 0.045,
      interactive: false
    }).addTo(state.bufferLayer);

    L.circleMarker([lat, lon], {
      radius: markerRadius(p.magnitude),
      color: '#ffffff',
      weight: 1.3,
      opacity: 1,
      fillColor: color,
      fillOpacity: 0.9,
      bubblingMouseEvents: false
    })
      .bindPopup(popupHtml(feature), { maxWidth: 320 })
      .bindTooltip(`M ${formatNumber(p.magnitude, 2)} • ${formatNumber(p.depth_km, 1)} km`, { direction: 'top', offset: [0, -5] })
      .addTo(state.pointLayer);
  });

  syncLayerVisibility();
}

function syncLayerVisibility() {
  if (elements.togglePoints.checked) {
    if (!state.map.hasLayer(state.pointLayer)) state.pointLayer.addTo(state.map);
  } else if (state.map.hasLayer(state.pointLayer)) {
    state.map.removeLayer(state.pointLayer);
  }

  if (elements.toggleBuffers.checked) {
    if (!state.map.hasLayer(state.bufferLayer)) state.bufferLayer.addTo(state.map);
  } else if (state.map.hasLayer(state.bufferLayer)) {
    state.map.removeLayer(state.bufferLayer);
  }
}

function fitToFeatures(features = state.filteredFeatures) {
  if (!features.length) return;
  const bounds = L.latLngBounds(features.map((feature) => [
    feature.geometry.coordinates[1],
    feature.geometry.coordinates[0]
  ]));
  if (features.length === 1) {
    state.map.setView(bounds.getCenter(), 10);
  } else {
    state.map.fitBounds(bounds.pad(0.08), { maxZoom: 10 });
  }
}

function countBy(features, property) {
  return features.reduce((counts, feature) => {
    const key = feature.properties[property] ?? t('unknown');
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function dominantEntry(counts, preferredOrder = []) {
  return Object.entries(counts).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return preferredOrder.indexOf(a[0]) - preferredOrder.indexOf(b[0]);
  })[0] || [null, 0];
}

function updatePeriodLabel(features) {
  if (!features.length) {
    elements.periodLabel.textContent = `${t('noData')} • ${t('adjustFilter')}`;
    return;
  }
  const dates = features.map((feature) => feature.properties.date).sort();
  elements.periodLabel.textContent = t('dataSummary', {
    start: formatDate(dates[0]),
    end: formatDate(dates[dates.length - 1]),
    count: formatNumber(features.length)
  });
}

function updateStats(features) {
  elements.totalQuakes.textContent = formatNumber(features.length);

  if (!features.length) {
    elements.dominantDepth.textContent = '–';
    elements.dominantDepthDetail.textContent = t('noData');
    elements.strongestMagnitude.textContent = '–';
    elements.strongestMagnitudeDetail.textContent = t('noData');
    elements.averageDepth.textContent = '–';
    elements.averageDepthDetail.textContent = t('kilometersBelowSurface');
    return;
  }

  const depthCounts = countBy(features, 'depth_class');
  const [dominantDepthClass, dominantDepthCount] = dominantEntry(depthCounts, DEPTH_CLASSES);
  elements.dominantDepth.textContent = displayDepth(dominantDepthClass);
  elements.dominantDepthDetail.textContent = `${formatNumber(dominantDepthCount)} ${t('countUnit')}`;

  const strongest = [...features].sort((a, b) => {
    const magDiff = b.properties.magnitude - a.properties.magnitude;
    if (magDiff !== 0) return magDiff;
    return a.properties.depth_km - b.properties.depth_km;
  })[0];
  elements.strongestMagnitude.textContent = `M ${formatNumber(strongest.properties.magnitude, 2)}`;
  elements.strongestMagnitudeDetail.textContent = strongest.properties.location;

  const averageDepth = features.reduce((sum, feature) => sum + Number(feature.properties.depth_km), 0) / features.length;
  elements.averageDepth.textContent = `${formatNumber(averageDepth, 1)} km`;
  elements.averageDepthDetail.textContent = t('kilometersBelowSurface');
}

function chartTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#686d7d';
}

function updateCharts(features) {
  const depthCounts = countBy(features, 'depth_class');
  const magnitudeCounts = countBy(features, 'magnitude_class');

  const depthLabels = DEPTH_CLASSES.map(displayDepth);
  const depthValues = DEPTH_CLASSES.map((key) => depthCounts[key] || 0);
  const magnitudeLabels = MAGNITUDE_CLASSES.map(displayMagnitudeClass);
  const magnitudeValues = MAGNITUDE_CLASSES.map((key) => magnitudeCounts[key] || 0);

  if (!state.depthChart) {
    state.depthChart = new Chart(document.getElementById('depthChart'), {
      type: 'bar',
      data: {
        labels: depthLabels,
        datasets: [{
          label: t('countUnit'),
          data: depthValues,
          backgroundColor: DEPTH_CLASSES.map((key) => DEPTH_COLORS[key]),
          borderRadius: 7,
          maxBarThickness: 70
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { displayColors: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: chartTextColor(), font: { family: 'Inter', size: 11 } } },
          y: { beginAtZero: true, grid: { color: '#eceef3' }, ticks: { precision: 0, color: chartTextColor(), font: { family: 'Inter', size: 10 } } }
        }
      }
    });
  } else {
    state.depthChart.data.labels = depthLabels;
    state.depthChart.data.datasets[0].label = t('countUnit');
    state.depthChart.data.datasets[0].data = depthValues;
    state.depthChart.update();
  }

  if (!state.magnitudeChart) {
    state.magnitudeChart = new Chart(document.getElementById('magnitudeChart'), {
      type: 'doughnut',
      data: {
        labels: magnitudeLabels,
        datasets: [{
          data: magnitudeValues,
          backgroundColor: MAGNITUDE_CLASSES.map((key) => MAGNITUDE_COLORS[key]),
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, color: chartTextColor(), font: { family: 'Inter', size: 10 }, padding: 15 }
          },
          tooltip: { displayColors: true }
        }
      }
    });
  } else {
    state.magnitudeChart.data.labels = magnitudeLabels;
    state.magnitudeChart.data.datasets[0].data = magnitudeValues;
    state.magnitudeChart.update();
  }
}

function updateLocationTable(features) {
  const counts = countBy(features, 'location');
  const topLocations = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10);
  elements.tableStatus.textContent = topLocations.length ? t('showingTop', { count: topLocations.length }) : t('noData');

  if (!topLocations.length) {
    elements.locationTableBody.innerHTML = `<tr><td class="empty-cell" colspan="3">${escapeHtml(t('adjustFilter'))}</td></tr>`;
    return;
  }

  elements.locationTableBody.innerHTML = topLocations.map(([location, count], index) => `
    <tr>
      <td><span class="rank-badge">${index + 1}</span></td>
      <td>${escapeHtml(location)}</td>
      <td><span class="metric-chip">${formatNumber(count)}</span></td>
    </tr>
  `).join('');
}

function updateEventTable(features) {
  const strongest = [...features].sort((a, b) => {
    const magDiff = b.properties.magnitude - a.properties.magnitude;
    if (magDiff !== 0) return magDiff;
    return a.properties.depth_km - b.properties.depth_km;
  }).slice(0, 10);

  elements.eventTableStatus.textContent = strongest.length ? t('showingEvents', { count: strongest.length }) : t('noData');

  if (!strongest.length) {
    elements.eventTableBody.innerHTML = `<tr><td class="empty-cell" colspan="4">${escapeHtml(t('adjustFilter'))}</td></tr>`;
    return;
  }

  elements.eventTableBody.innerHTML = strongest.map((feature) => {
    const p = feature.properties;
    return `
      <tr>
        <td>${escapeHtml(formatDate(p.date))}</td>
        <td><span class="metric-chip">M ${formatNumber(p.magnitude, 2)}</span></td>
        <td>${formatNumber(p.depth_km, 1)} km</td>
        <td>${escapeHtml(p.location)}</td>
      </tr>
    `;
  }).join('');
}

function applyFilters({ fit = false } = {}) {
  const startDate = elements.startDate.value;
  const endDate = elements.endDate.value;
  const locations = selectedLocations();
  const depthClasses = selectedValues('.depth-filter');
  const magnitudeClasses = selectedValues('.magnitude-filter');

  state.filteredFeatures = state.pointsData.features.filter((feature) => {
    const p = feature.properties;
    return (!startDate || p.date >= startDate)
      && (!endDate || p.date <= endDate)
      && locations.has(p.location)
      && depthClasses.has(p.depth_class)
      && magnitudeClasses.has(magnitudeClassFor(p.magnitude));
  });

  updatePeriodLabel(state.filteredFeatures);
  updateStats(state.filteredFeatures);
  renderMap(state.filteredFeatures);
  updateCharts(state.filteredFeatures);
  updateLocationTable(state.filteredFeatures);
  updateEventTable(state.filteredFeatures);
  updateLocationSelectionSummary();

  if (fit) fitToFeatures(state.filteredFeatures);
  if (!state.initialFitDone && state.filteredFeatures.length) {
    fitToFeatures(state.filteredFeatures);
    state.initialFitDone = true;
  }
}

function resetFilters() {
  elements.startDate.value = elements.startDate.min;
  elements.endDate.value = elements.endDate.max;
  document.querySelectorAll('.depth-filter, .magnitude-filter, .location-filter')
    .forEach((input) => { input.checked = true; input.indeterminate = false; });
  elements.togglePoints.checked = true;
  elements.toggleBuffers.checked = true;
  elements.locationSearch.value = '';
  filterLocationOptions();
  syncLocationAllState();
  applyFilters({ fit: true });
}

function openFilterPanel() {
  elements.filterPanel.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeFilterPanel() {
  elements.filterPanel.classList.remove('is-open');
  document.body.style.overflow = '';
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });
  elements.languageCode.textContent = state.language.toUpperCase();
  document.querySelectorAll('.language-option').forEach((option) => {
    const selected = option.dataset.language === state.language;
    option.classList.toggle('is-selected', selected);
    option.setAttribute('aria-checked', String(selected));
  });
  updateLocationSelectionSummary();
  refreshLegend();
  if (state.pointsData) applyFilters();
}

function setLanguage(language) {
  if (!TRANSLATIONS[language]) return;
  state.language = language;
  localStorage.setItem('quakepulse-language', language);
  elements.languageMenu.hidden = true;
  elements.languageToggle.classList.remove('is-open');
  elements.languageToggle.setAttribute('aria-expanded', 'false');
  applyTranslations();
}

function toggleLanguageMenu() {
  const willOpen = elements.languageMenu.hidden;
  elements.languageMenu.hidden = !willOpen;
  elements.languageToggle.classList.toggle('is-open', willOpen);
  elements.languageToggle.setAttribute('aria-expanded', String(willOpen));
}

function bindEvents() {
  [elements.startDate, elements.endDate].forEach((input) => input.addEventListener('change', () => applyFilters()));

  document.querySelectorAll('.depth-filter, .magnitude-filter')
    .forEach((input) => input.addEventListener('change', () => applyFilters()));

  document.querySelectorAll('.location-filter:not(#locationAll)').forEach((input) => {
    input.addEventListener('change', () => {
      syncLocationAllState();
      applyFilters();
    });
  });

  elements.locationAll.addEventListener('change', () => {
    const checked = elements.locationAll.checked;
    document.querySelectorAll('.location-filter:not(#locationAll)').forEach((input) => { input.checked = checked; });
    elements.locationAll.indeterminate = false;
    updateLocationSelectionSummary();
    applyFilters();
  });

  elements.locationSearch.addEventListener('input', filterLocationOptions);
  elements.resetButton.addEventListener('click', resetFilters);
  elements.fitButton.addEventListener('click', () => fitToFeatures());
  elements.togglePoints.addEventListener('change', syncLayerVisibility);
  elements.toggleBuffers.addEventListener('change', syncLayerVisibility);
  elements.filterToggleButton.addEventListener('click', openFilterPanel);
  elements.bottomFilterButton.addEventListener('click', openFilterPanel);
  elements.applyFilterButton.addEventListener('click', () => { applyFilters(); closeFilterPanel(); });

  elements.languageToggle.addEventListener('click', toggleLanguageMenu);
  document.querySelectorAll('.language-option').forEach((option) => {
    option.addEventListener('click', () => setLanguage(option.dataset.language));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.language-picker')) {
      elements.languageMenu.hidden = true;
      elements.languageToggle.classList.remove('is-open');
      elements.languageToggle.setAttribute('aria-expanded', 'false');
    }
    if (mobileLayoutQuery.matches && elements.filterPanel.classList.contains('is-open')) {
      const clickedPanel = event.target.closest('#filterPanel');
      const clickedOpenButton = event.target.closest('#filterToggleButton, #bottomFilterButton');
      if (!clickedPanel && !clickedOpenButton) closeFilterPanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeFilterPanel();
      elements.languageMenu.hidden = true;
      elements.languageToggle.classList.remove('is-open');
      elements.languageToggle.setAttribute('aria-expanded', 'false');
    }
  });

  mobileLayoutQuery.addEventListener('change', (event) => {
    if (!event.matches) closeFilterPanel();
    window.setTimeout(() => state.map?.invalidateSize(), 260);
  });

  window.addEventListener('resize', () => window.setTimeout(() => state.map?.invalidateSize(), 120));
}

async function initialize() {
  try {
    [state.pointsData, state.metadata] = await Promise.all([
      fetchJson(DATA_PATHS.points),
      fetchJson(DATA_PATHS.metadata)
    ]);

    normalizeData();
    initializeDateInputs();
    buildLocationOptions();
    initializeMap();
    bindEvents();

    const savedLanguage = localStorage.getItem('quakepulse-language');
    state.language = TRANSLATIONS[savedLanguage] ? savedLanguage : 'id';
    applyTranslations();
    syncLocationAllState();
    applyFilters({ fit: true });
    hideLoading();
  } catch (error) {
    console.error(error);
    showLoadError(error);
  }
}

initialize();
