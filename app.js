'use strict';

const BMKG_API_PATHS = {
  latest: 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json',
  recentM5: 'https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json',
  felt: 'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json'
};

const FALLBACK_DATA_PATHS = {
  points: 'data/gempa.geojson',
  metadata: 'data/metadata.json'
};

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 15000;
const DATA_MODES = ['realtime', 'monthly'];

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
    loadingRealtime: 'Mengambil data real-time BMKG...',
    loadingMonthly: 'Memuat rekap bulanan...',
    modeChooserEyebrow: 'PILIH SUMBER DATA',
    modeChooserTitle: 'Mau melihat data yang mana?',
    modeChooserDescription: 'Kamu dapat mengganti mode kapan saja melalui tombol di bagian atas.',
    realtimeModeTitle: 'Real-time BMKG',
    realtimeModeDescription: 'Gempa terbaru, gempa M ≥ 5,0, dan gempa dirasakan dari feed BMKG.',
    monthlyModeTitle: 'Rekap Bulanan',
    monthlyModeDescription: 'Rekap 590 kejadian gempa pada periode Juni 2026.',
    chooseMode: 'Pilih mode',
    changeDataMode: 'Ganti mode data',
    realtimeShort: 'Real-time',
    monthlyShort: 'Bulanan',
    realtimeHeroEyebrow: 'MONITORING GEMPA TERKINI BMKG',
    monthlyHeroEyebrow: 'REKAP GEMPA BULANAN',
    realtimeDashboardTitle: 'Dashboard Gempa Indonesia',
    monthlyDashboardTitle: 'Rekap Gempa Juni 2026',
    sourceRealtime: 'REAL-TIME BMKG',
    sourceMonthly: 'REKAP JUNI 2026',
    monthlyStatus: 'Rekap bulanan Juni 2026 • {count} kejadian',
    footerRealtimeSource: '© 2026 QuakePulse. Sumber data real-time: BMKG.',
    footerRealtimeDeveloper: 'Data diperbarui otomatis setiap 5 menit dari feed resmi BMKG.',
    footerMonthlySource: '© 2026 QuakePulse. Rekap data gempa Juni 2026.',
    footerMonthlyDeveloper: 'Rekap bulanan memuat data lokal dari gempa juni.xlsx.',
    navMap: 'Peta',
    navAnalysis: 'Analisis',
    navSummary: 'Ringkasan',
    heroEyebrow: 'MONITORING GEMPA TERKINI BMKG',
    dashboardTitle: 'Dashboard Gempa Indonesia',
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
    depthClass: 'Kedalaman',
    shallow: 'Dangkal',
    intermediate: 'Menengah',
    deep: 'Dalam',
    magnitudeClass: 'Magnitudo',
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
    mapNote: 'Data gempa, wilayah dirasakan, dan potensi tsunami bersumber dari feed resmi BMKG.',
    analysisEyebrow: 'ANALISIS PARAMETER',
    analysisTitle: 'Kedalaman dan Magnitudo',
    depthAnalysis: 'ANALISIS KEDALAMAN',
    depthDistribution: 'Distribusi Kedalaman',
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
    footerSource: '© 2026 QuakePulse. Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika).',
    footerDeveloper: 'Data diperbarui otomatis setiap 5 menit dari feed resmi BMKG.',
    quakeSingular: 'kejadian',
    quakePlural: 'kejadian',
    dataSummary: '{start} - {end} • {count} kejadian gempa',
    liveUpdated: 'Data BMKG diperbarui {time}',
    fallbackActive: 'API BMKG tidak terjangkau • menampilkan data cadangan',
    realtimeFailed: 'Pembaruan gagal • data terakhir tetap ditampilkan',
    feltReport: 'Wilayah dirasakan',
    notFeltReported: 'Belum ada laporan dirasakan pada feed BMKG',
    tsunamiPotential: 'Potensi tsunami',
    tsunamiUnavailable: 'Tidak tersedia pada feed ini',
    shakemap: 'ShakeMap BMKG',
    openShakemap: 'Buka peta guncangan',
    bmkgSource: 'Keterangan BMKG',
    bmkgOfficial: 'BMKG',
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
    depthClassPopup: 'Kedalaman',
    magnitudeClassPopup: 'Magnitudo',
    estimatedRadius: 'Estimasi jangkauan',
    tsunamiStatus: 'Indikasi tsunami',
    estimatedDisclaimer: 'Informasi wilayah dirasakan dan potensi tsunami mengikuti data yang tersedia pada feed BMKG.',
    depthLegend: 'Kedalaman',
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
    loadingRealtime: 'Fetching real-time BMKG data...',
    loadingMonthly: 'Loading monthly recap...',
    modeChooserEyebrow: 'SELECT DATA SOURCE',
    modeChooserTitle: 'Which data would you like to view?',
    modeChooserDescription: 'You can change modes at any time using the button at the top.',
    realtimeModeTitle: 'Real-time BMKG',
    realtimeModeDescription: 'Latest earthquakes, M ≥ 5.0 events, and felt earthquakes from BMKG feeds.',
    monthlyModeTitle: 'Monthly Recap',
    monthlyModeDescription: 'Recap of 590 earthquake events during June 2026.',
    chooseMode: 'Select mode',
    changeDataMode: 'Change data mode',
    realtimeShort: 'Real-time',
    monthlyShort: 'Monthly',
    realtimeHeroEyebrow: 'LATEST BMKG EARTHQUAKE MONITORING',
    monthlyHeroEyebrow: 'MONTHLY EARTHQUAKE RECAP',
    realtimeDashboardTitle: 'Indonesia Earthquake Dashboard',
    monthlyDashboardTitle: 'June 2026 Earthquake Recap',
    sourceRealtime: 'REAL-TIME BMKG',
    sourceMonthly: 'JUNE 2026 RECAP',
    monthlyStatus: 'June 2026 monthly recap • {count} events',
    footerRealtimeSource: '© 2026 QuakePulse. Real-time data source: BMKG.',
    footerRealtimeDeveloper: 'Data refreshes automatically every 5 minutes from official BMKG feeds.',
    footerMonthlySource: '© 2026 QuakePulse. June 2026 earthquake recap.',
    footerMonthlyDeveloper: 'The monthly recap uses local data from gempa juni.xlsx.',
    navMap: 'Map',
    navAnalysis: 'Analysis',
    navSummary: 'Summary',
    heroEyebrow: 'LATEST BMKG EARTHQUAKE MONITORING',
    dashboardTitle: 'Indonesia Earthquake Dashboard',
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
    depthClass: 'Depth',
    shallow: 'Shallow',
    intermediate: 'Intermediate',
    deep: 'Deep',
    magnitudeClass: 'Magnitude',
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
    mapNote: 'Earthquake, felt-area, and tsunami-potential information comes from official BMKG feeds.',
    analysisEyebrow: 'PARAMETER ANALYSIS',
    analysisTitle: 'Depth and Magnitude',
    depthAnalysis: 'DEPTH ANALYSIS',
    depthDistribution: 'Depth Distribution',
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
    footerSource: '© 2026 QuakePulse. Data source: BMKG (Meteorology, Climatology, and Geophysics Agency).',
    footerDeveloper: 'Data refreshes automatically every 5 minutes from the official BMKG feeds.',
    quakeSingular: 'event',
    quakePlural: 'events',
    dataSummary: '{start} - {end} • {count} earthquake events',
    liveUpdated: 'BMKG data updated {time}',
    fallbackActive: 'BMKG API is unavailable • showing fallback data',
    realtimeFailed: 'Refresh failed • keeping the latest loaded data',
    feltReport: 'Felt reports',
    notFeltReported: 'No felt report is available in the BMKG feed',
    tsunamiPotential: 'Tsunami potential',
    tsunamiUnavailable: 'Not available in this feed',
    shakemap: 'BMKG ShakeMap',
    openShakemap: 'Open shaking map',
    bmkgSource: 'BMKG note',
    bmkgOfficial: 'BMKG',
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
    depthClassPopup: 'Depth',
    magnitudeClassPopup: 'Magnitude',
    estimatedRadius: 'Estimated range',
    tsunamiStatus: 'Tsunami indication',
    estimatedDisclaimer: 'Felt-area and tsunami-potential information follows the data available in BMKG feeds.',
    depthLegend: 'Depth',
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
  legendControl: null,
  mode: null,
  dataSource: 'BMKG',
  lastUpdated: null,
  refreshTimer: null,
  isRefreshing: false
};

const mobileLayoutQuery = window.matchMedia('(max-width: 1020px)');

const elements = {
  loadingOverlay: document.getElementById('loadingOverlay'),
  modeChooser: document.getElementById('modeChooser'),
  modeChoiceButtons: [...document.querySelectorAll('[data-mode-choice]')],
  changeModeButton: document.getElementById('changeModeButton'),
  currentModeIcon: document.getElementById('currentModeIcon'),
  currentModeLabel: document.getElementById('currentModeLabel'),
  sourceBadge: document.getElementById('sourceBadge'),
  sourceBadgeIcon: document.getElementById('sourceBadgeIcon'),
  sourceBadgeText: document.getElementById('sourceBadgeText'),
  heroEyebrow: document.getElementById('heroEyebrow'),
  dashboardTitle: document.getElementById('dashboardTitle'),
  footerSource: document.getElementById('footerSource'),
  footerDeveloper: document.getElementById('footerDeveloper'),
  periodLabel: document.getElementById('periodLabel'),
  liveStatus: document.getElementById('liveStatus'),
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
  if (Number.isNaN(date.getTime())) return '–';
  return `${new Intl.DateTimeFormat(currentLocale(), {
    timeZone: 'Asia/Jakarta',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).format(date)} WIB`;
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

function displayTsunami(featureProperties) {
  return featureProperties.tsunami_potential || t('tsunamiUnavailable');
}

async function fetchJson(path, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const separator = path.includes('?') ? '&' : '?';
    const response = await fetch(`${path}${separator}_=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(t('loadFileFailed', { path, status: response.status }));
    return response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function depthClassFor(depthKm) {
  const depth = Number(depthKm);
  if (depth < 60) return 'Dangkal';
  if (depth <= 300) return 'Menengah';
  return 'Dalam';
}

function wibDateKey(dateTimeString) {
  const date = new Date(dateTimeString);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function estimatedRadiusKm(magnitude, depthKm) {
  const magnitudeValue = Number(magnitude);
  const depthValue = Number(depthKm);
  const base = magnitudeValue < 3
    ? 3 + magnitudeValue * 2.2
    : magnitudeValue < 5
      ? 12 + (magnitudeValue - 3) * 18
      : 50 + (magnitudeValue - 5) * 42;
  const depthFactor = Math.max(0.45, Math.min(1, 1 - depthValue / 650));
  return Math.max(3, Math.round(base * depthFactor * 10) / 10);
}

function extractBmkgEvents(payload) {
  const value = payload?.Infogempa?.gempa;
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeBmkgEvent(raw, index = 0) {
  const coordinateValues = String(raw.Coordinates || '').split(',').map((value) => Number(value.trim()));
  const [latitude, longitude] = coordinateValues;
  const magnitude = Number.parseFloat(String(raw.Magnitude || '').replace(',', '.'));
  const depthKm = Number.parseFloat(String(raw.Kedalaman || '').replace(',', '.'));
  const datetime = raw.DateTime || '';
  if (![latitude, longitude, magnitude, depthKm].every(Number.isFinite) || !datetime) return null;

  const radiusKm = estimatedRadiusKm(magnitude, depthKm);
  const rawPotential = String(raw.Potensi || '').trim();
  const tsunamiPotential = /tsunami/i.test(rawPotential) ? rawPotential : '';
  const bmkgNote = rawPotential && !tsunamiPotential ? rawPotential : '';
  const shakemapUrl = raw.Shakemap ? `https://static.bmkg.go.id/${String(raw.Shakemap).replace(/^\/+/, '')}` : '';

  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [longitude, latitude] },
    properties: {
      id: `${datetime}-${latitude}-${longitude}-${index}`,
      datetime,
      date: wibDateKey(datetime),
      time: raw.Jam || '',
      latitude,
      longitude,
      depth_km: depthKm,
      depth_class: depthClassFor(depthKm),
      magnitude,
      magnitude_class: magnitudeClassFor(magnitude),
      location: String(raw.Wilayah || t('unknown')).replace(/\s+/g, ' ').trim(),
      estimated_radius_km: radiusKm,
      estimated_radius_m: Math.round(radiusKm * 1000),
      felt: String(raw.Dirasakan || '').replace(/\s+/g, ' ').trim(),
      tsunami_potential: tsunamiPotential,
      bmkg_note: bmkgNote,
      shakemap_url: shakemapUrl,
      source: 'BMKG'
    }
  };
}

function featureIdentity(feature) {
  const p = feature.properties;
  const [longitude, latitude] = feature.geometry.coordinates;
  return `${p.datetime}|${latitude.toFixed(3)}|${longitude.toFixed(3)}|${Number(p.magnitude).toFixed(1)}`;
}

function mergeDuplicateFeatures(features) {
  const merged = new Map();
  features.forEach((feature) => {
    const key = featureIdentity(feature);
    if (!merged.has(key)) {
      merged.set(key, feature);
      return;
    }
    const current = merged.get(key);
    const target = current.properties;
    const incoming = feature.properties;
    if (!target.felt && incoming.felt) target.felt = incoming.felt;
    if (!target.tsunami_potential && incoming.tsunami_potential) target.tsunami_potential = incoming.tsunami_potential;
    if (!target.bmkg_note && incoming.bmkg_note) target.bmkg_note = incoming.bmkg_note;
    if (!target.shakemap_url && incoming.shakemap_url) target.shakemap_url = incoming.shakemap_url;
    if (incoming.location.length > target.location.length) target.location = incoming.location;
  });
  return [...merged.values()].sort((a, b) => new Date(b.properties.datetime) - new Date(a.properties.datetime));
}

function metadataFromFeatures(features, source = 'BMKG') {
  const dates = features.map((feature) => feature.properties.date).filter(Boolean).sort();
  return {
    source,
    date_start: dates[0] || '',
    date_end: dates[dates.length - 1] || '',
    total_events: features.length,
    updated_at: new Date().toISOString()
  };
}

async function loadBmkgRealtimeData() {
  const responses = await Promise.allSettled(Object.values(BMKG_API_PATHS).map((path) => fetchJson(path)));
  const events = responses.flatMap((result) => result.status === 'fulfilled' ? extractBmkgEvents(result.value) : []);
  const features = mergeDuplicateFeatures(events.map(normalizeBmkgEvent).filter(Boolean));
  if (!features.length) throw new Error('Feed BMKG tidak mengembalikan data yang dapat diproses.');
  return {
    pointsData: { type: 'FeatureCollection', features },
    metadata: metadataFromFeatures(features, 'BMKG'),
    partialFailure: responses.some((result) => result.status === 'rejected')
  };
}

async function loadMonthlyData(source = 'monthly') {
  const [pointsData, metadata] = await Promise.all([
    fetchJson(FALLBACK_DATA_PATHS.points),
    fetchJson(FALLBACK_DATA_PATHS.metadata)
  ]);
  return { pointsData, metadata: { ...metadata, source } };
}

async function loadFallbackData() {
  return loadMonthlyData('fallback');
}

function showLoading(messageKey = 'loading') {
  elements.loadingOverlay.innerHTML = `
    <div class="loader" aria-hidden="true"></div>
    <p>${escapeHtml(t(messageKey))}</p>
  `;
  elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  elements.loadingOverlay.classList.add('hidden');
  // Overlay tetap berada di DOM agar dapat digunakan kembali saat mode diganti.
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
    if (!valid) return false;
    p.magnitude = Number(p.magnitude);
    p.depth_km = Number(p.depth_km);
    p.depth_class = p.depth_class || depthClassFor(p.depth_km);
    p.magnitude_class = magnitudeClassFor(p.magnitude);
    p.estimated_radius_km = Number(p.estimated_radius_km) || estimatedRadiusKm(p.magnitude, p.depth_km);
    p.estimated_radius_m = Number(p.estimated_radius_m) || Math.round(p.estimated_radius_km * 1000);
    p.felt = p.felt || '';
    p.tsunami_potential = p.tsunami_potential || '';
    p.shakemap_url = p.shakemap_url || '';
    p.source = p.source || (state.dataSource === 'BMKG' ? 'BMKG' : 'Rekap bulanan');
    return true;
  });

  state.locationNames = [...new Set(state.pointsData.features.map((feature) => feature.properties.location || t('unknown')))]
    .sort((a, b) => a.localeCompare(b, 'id'));
}

function initializeDateInputs({ preserve = false } = {}) {
  const dates = state.pointsData.features.map((feature) => feature.properties.date).filter(Boolean).sort();
  const minDate = state.metadata?.date_start || dates[0];
  const maxDate = state.metadata?.date_end || dates[dates.length - 1];
  const previousStart = elements.startDate.value;
  const previousEnd = elements.endDate.value;
  elements.startDate.min = minDate;
  elements.startDate.max = maxDate;
  elements.endDate.min = minDate;
  elements.endDate.max = maxDate;
  elements.startDate.value = preserve && previousStart >= minDate && previousStart <= maxDate ? previousStart : minDate;
  elements.endDate.value = preserve && previousEnd >= minDate && previousEnd <= maxDate ? previousEnd : maxDate;
}

function buildLocationOptions({ selected = new Set(), selectAll = true } = {}) {
  elements.locationOptions.innerHTML = state.locationNames.map((name) => `
    <label class="district-option" data-search="${escapeHtml(name.toLowerCase())}">
      <input class="location-filter" type="checkbox" value="${escapeHtml(name)}" ${selectAll || selected.has(name) ? 'checked' : ''} />
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
  const tsunamiText = displayTsunami(p);
  const statusClass = /tidak berpotensi|not potential/i.test(tsunamiText) ? 'popup-status' : 'popup-status verify';
  const feltText = p.felt || t('notFeltReported');
  const shakemapRow = p.shakemap_url
    ? `<span>${escapeHtml(t('shakemap'))}</span><strong><a href="${escapeHtml(p.shakemap_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openShakemap'))}</a></strong>`
    : '';
  const bmkgNoteRow = p.bmkg_note
    ? `<span>${escapeHtml(t('bmkgSource'))}</span><strong>${escapeHtml(p.bmkg_note)}</strong>`
    : '';
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
      <span>${escapeHtml(t('feltReport'))}</span><strong>${escapeHtml(feltText)}</strong>
      <span>${escapeHtml(t('tsunamiPotential'))}</span><strong><span class="${statusClass}">${escapeHtml(tsunamiText)}</span></strong>
      ${bmkgNoteRow}
      ${shakemapRow}
    </div>
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

function updateLiveStatus(status = 'live') {
  if (!elements.liveStatus) return;
  elements.liveStatus.classList.remove('is-warning');
  if (status === 'monthly') {
    elements.liveStatus.textContent = t('monthlyStatus', {
      count: formatNumber(state.pointsData?.features?.length || 0)
    });
    return;
  }
  if (status === 'fallback') {
    elements.liveStatus.textContent = t('fallbackActive');
    elements.liveStatus.classList.add('is-warning');
    return;
  }
  if (status === 'error') {
    elements.liveStatus.textContent = t('realtimeFailed');
    elements.liveStatus.classList.add('is-warning');
    return;
  }
  const updated = state.lastUpdated || new Date();
  const formatted = new Intl.DateTimeFormat(currentLocale(), {
    timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(updated);
  elements.liveStatus.textContent = t('liveUpdated', { time: `${formatted} WIB` });
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

function updateModeUI() {
  const isRealtime = state.mode === 'realtime';
  const hasMode = DATA_MODES.includes(state.mode);

  elements.currentModeIcon.textContent = isRealtime ? 'sensors' : hasMode ? 'calendar_month' : 'database';
  elements.currentModeLabel.textContent = isRealtime ? t('realtimeShort') : hasMode ? t('monthlyShort') : t('chooseMode');
  elements.changeModeButton.setAttribute('aria-label', t('changeDataMode'));

  if (!hasMode) return;

  elements.heroEyebrow.textContent = isRealtime ? t('realtimeHeroEyebrow') : t('monthlyHeroEyebrow');
  elements.dashboardTitle.textContent = isRealtime ? t('realtimeDashboardTitle') : t('monthlyDashboardTitle');
  elements.sourceBadgeIcon.textContent = isRealtime ? 'sensors' : 'calendar_month';
  elements.sourceBadgeText.textContent = isRealtime ? t('sourceRealtime') : t('sourceMonthly');
  elements.footerSource.textContent = isRealtime ? t('footerRealtimeSource') : t('footerMonthlySource');
  elements.footerDeveloper.textContent = isRealtime ? t('footerRealtimeDeveloper') : t('footerMonthlyDeveloper');
}

function openModeChooser() {
  elements.modeChooser.hidden = false;
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => elements.modeChoiceButtons[0]?.focus(), 30);
}

function closeModeChooser() {
  elements.modeChooser.hidden = true;
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
  updateModeUI();
  document.querySelectorAll('.language-option').forEach((option) => {
    const selected = option.dataset.language === state.language;
    option.classList.toggle('is-selected', selected);
    option.setAttribute('aria-checked', String(selected));
  });
  updateLocationSelectionSummary();
  refreshLegend();
  if (state.pointsData) {
    applyFilters();
    updateLiveStatus(state.mode === 'monthly' ? 'monthly' : state.dataSource === 'BMKG' ? 'live' : 'fallback');
  }
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

  elements.locationOptions.addEventListener('change', (event) => {
    if (!event.target.matches('.location-filter')) return;
    syncLocationAllState();
    applyFilters();
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

  elements.modeChoiceButtons.forEach((button) => {
    button.addEventListener('click', () => setDataMode(button.dataset.modeChoice));
  });
  elements.changeModeButton.addEventListener('click', openModeChooser);

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

function captureLocationFilterState() {
  if (!state.pointsData || !elements.locationOptions.children.length) return { selectAll: true, selected: new Set() };
  return { selectAll: elements.locationAll.checked, selected: selectedLocations() };
}

async function refreshRealtimeData({ initial = false } = {}) {
  if (state.mode !== 'realtime' || state.isRefreshing) return;
  state.isRefreshing = true;
  const locationState = initial
    ? { selectAll: true, selected: new Set() }
    : captureLocationFilterState();

  try {
    let loaded;
    try {
      loaded = await loadBmkgRealtimeData();
      state.dataSource = 'BMKG';
      state.lastUpdated = new Date();
    } catch (bmkgError) {
      console.warn('BMKG realtime load failed:', bmkgError);
      if (!initial && state.pointsData) {
        updateLiveStatus('error');
        return;
      }
      loaded = await loadFallbackData();
      state.dataSource = 'fallback';
      state.lastUpdated = new Date();
    }

    state.pointsData = loaded.pointsData;
    state.metadata = loaded.metadata;
    normalizeData();
    initializeDateInputs({ preserve: !initial });
    buildLocationOptions(locationState);
    elements.locationAll.checked = locationState.selectAll;
    syncLocationAllState();
    filterLocationOptions();
    applyFilters({ fit: initial });
    updateLiveStatus(state.dataSource === 'BMKG' ? 'live' : 'fallback');
  } finally {
    state.isRefreshing = false;
  }
}

async function loadMonthlyMode({ initial = true } = {}) {
  const loaded = await loadMonthlyData('monthly');
  state.dataSource = 'monthly';
  state.lastUpdated = null;
  state.pointsData = loaded.pointsData;
  state.metadata = loaded.metadata;
  normalizeData();
  initializeDateInputs({ preserve: false });
  buildLocationOptions({ selectAll: true, selected: new Set() });
  elements.locationAll.checked = true;
  syncLocationAllState();
  filterLocationOptions();
  applyFilters({ fit: initial });
  updateLiveStatus('monthly');
}

async function setDataMode(mode) {
  if (!DATA_MODES.includes(mode) || state.isRefreshing) return;

  if (state.refreshTimer) {
    window.clearInterval(state.refreshTimer);
    state.refreshTimer = null;
  }

  state.mode = mode;
  state.initialFitDone = false;
  updateModeUI();
  closeModeChooser();
  showLoading(mode === 'realtime' ? 'loadingRealtime' : 'loadingMonthly');

  try {
    if (mode === 'realtime') {
      await refreshRealtimeData({ initial: true });
      state.refreshTimer = window.setInterval(() => refreshRealtimeData(), REFRESH_INTERVAL_MS);
    } else {
      await loadMonthlyMode({ initial: true });
    }
    hideLoading();
    window.setTimeout(() => state.map?.invalidateSize(), 100);
  } catch (error) {
    console.error(error);
    showLoadError(error);
  }
}

async function initialize() {
  try {
    initializeMap();
    bindEvents();

    const savedLanguage = localStorage.getItem('quakepulse-language');
    state.language = TRANSLATIONS[savedLanguage] ? savedLanguage : 'id';
    applyTranslations();

    updateModeUI();
    openModeChooser();
  } catch (error) {
    console.error(error);
    showLoadError(error);
  }
}

initialize();
