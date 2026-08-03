// ================= SCHEDULE (groups) =================

const SCHEDULE_TIME_FILTER_LABELS = {
  all: 'Будь-який час',
  morning: 'Ранковий час (до 12)',
  day: 'Денний час (12–17)',
  evening: 'Вечірній час (після 17)',
};
const SCHEDULE_TIME_FILTER_ORDER = ['morning', 'day', 'evening'];

const SCHEDULE_LEVEL_ORDER = ['з нуля', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const SCHEDULE_LEVEL_BADGE_CLASS = {
  'з нуля': 'status-free',
  A1: 'status-a',
  A2: 'status-a',
  B1: 'status-b',
  B2: 'status-b',
  C1: 'status-c',
  C2: 'status-c',
};

const scheduleFilterState = {
  time: 'all',
  level: 'all',
};

let scheduleAllLessons = [];
let scheduleAllRates = [];

// --- helpers -------------------------------------------------------------

// Pulls the first HH:MM out of a schedule string like "ВТ, ПТ 10:40"
// and buckets it into a time-of-day category.
function scheduleCategorizeTime(scheduleStr) {
  const match = (scheduleStr || '').match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const hours = parseInt(match[1], 10);
  if (hours < 12) return 'morning';
  if (hours < 17) return 'day';
  return 'evening';
}

// Normalizes level text so "a1", "A1", " A1 " all match the same bucket,
// while keeping the original casing for display.
function scheduleNormalizeLevel(levelStr) {
  return (levelStr || '').trim();
}

function scheduleLevelKey(levelStr) {
  return scheduleNormalizeLevel(levelStr).toLowerCase();
}

function scheduleMatchesFilters(row, excludeKey) {
  if (excludeKey !== 'level' && scheduleFilterState.level !== 'all') {
    if (scheduleLevelKey(row.level) !== scheduleFilterState.level.toLowerCase()) return false;
  }
  if (excludeKey !== 'time' && scheduleFilterState.time !== 'all') {
    if (scheduleCategorizeTime(row.schedule) !== scheduleFilterState.time) return false;
  }
  return true;
}

function scheduleFindRate(rateName) {
  return scheduleAllRates.find(
    (r) => (r.name || '').trim().toLowerCase() === (rateName || '').trim().toLowerCase()
  );
}

const SCHEDULE_MONTHS = {
  'січня': '01',
  'лютого': '02',
  'березня': '03',
  'квітня': '04',
  'травня': '05',
  'червня': '06',
  'липня': '07',
  'серпня': '08',
  'вересня': '09',
  'жовтня': '10',
  'листопада': '11',
  'грудня': '12',
};

// "7 серпня" -> "7.08"; falls back to the original text if it doesn't
// match the expected "<day> <month name>" pattern (e.g. already numeric).
function scheduleFormatDate(dateStr) {
  const raw = (dateStr || '').trim();
  const match = raw.match(/^(\d{1,2})\s+([а-яіїєґ']+)$/iu);
  if (!match) return raw;

  const day = match[1];
  const month = SCHEDULE_MONTHS[match[2].toLowerCase()];
  if (!month) return raw;

  return `${day}.${month}`;
}

// --- filter rendering ------------------------------------------------------

function scheduleRenderTimeFilter() {
  const select = document.getElementById('filter-time');
  if (!select) return;

  const available = new Set();
  scheduleAllLessons.forEach((row) => {
    if (!scheduleMatchesFilters(row, 'time')) return;
    const cat = scheduleCategorizeTime(row.schedule);
    if (cat) available.add(cat);
  });

  if (scheduleFilterState.time !== 'all' && !available.has(scheduleFilterState.time)) {
    scheduleFilterState.time = 'all';
  }

  const options = ['all', ...SCHEDULE_TIME_FILTER_ORDER.filter((t) => available.has(t))];

  select.innerHTML = options
    .map(
      (val) =>
        `<option value="${val}"${val === scheduleFilterState.time ? ' selected' : ''}>${SCHEDULE_TIME_FILTER_LABELS[val]}</option>`
    )
    .join('');
}

function scheduleRenderLevelFilter() {
  const select = document.getElementById('filter-level');
  if (!select) return;

  const availableRaw = new Map(); // lowercase key -> original display text
  scheduleAllLessons.forEach((row) => {
    if (!scheduleMatchesFilters(row, 'level')) return;
    const raw = scheduleNormalizeLevel(row.level);
    if (raw) availableRaw.set(raw.toLowerCase(), raw);
  });

  if (scheduleFilterState.level !== 'all' && !availableRaw.has(scheduleFilterState.level.toLowerCase())) {
    scheduleFilterState.level = 'all';
  }

  // Order known levels first (in SCHEDULE_LEVEL_ORDER), then anything unexpected found in the sheet
  const knownFound = SCHEDULE_LEVEL_ORDER.filter((l) => availableRaw.has(l.toLowerCase()));
  const knownKeys = new Set(knownFound.map((l) => l.toLowerCase()));
  const extraFound = [...availableRaw.keys()]
    .filter((k) => !knownKeys.has(k))
    .map((k) => availableRaw.get(k));

  const displayLevels = [...knownFound, ...extraFound];

  const optionsHtml = [
    `<option value="all"${scheduleFilterState.level === 'all' ? ' selected' : ''}>Всі рівні</option>`,
    ...displayLevels.map((lvl) => {
      const label = lvl.toLowerCase() === 'з нуля' ? 'З нуля' : lvl;
      const selected = scheduleFilterState.level.toLowerCase() === lvl.toLowerCase() ? ' selected' : '';
      return `<option value="${lvl}"${selected}>${label}</option>`;
    }),
  ];

  select.innerHTML = optionsHtml.join('');
}

// --- card rendering ---------------------------------------------------------

function scheduleRenderGroupCards() {
  const grid = document.getElementById('schedule-grid');
  if (!grid) return;

  const filtered = scheduleAllLessons.filter((row) => scheduleMatchesFilters(row, null));

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="schedule-empty">Групи за цими фільтрами не знайдені.</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map((row) => {
      const title = row.groupNumber
        ? `Група ${row.groupNumber}`
        : `Група`;

      const badgeClass = SCHEDULE_LEVEL_BADGE_CLASS[scheduleNormalizeLevel(row.level)] || 'status-a';
      const isFromScratch = row.level.toLowerCase() === 'з нуля';
      const badgeLabel = isFromScratch
        ? row.timeStart
          ? `З нуля (старт ${scheduleFormatDate(row.timeStart)})`
          : 'З нуля'
        : scheduleNormalizeLevel(row.level);

      const rate = scheduleFindRate(row.rate);
      const priceLine = rate
        ? `${rate.price} грн. / ${rate.quantity} уроків`
        : row.rate || '—';

      // start date is already folded into the badge for "з нуля" groups;
      // for other levels with a start date, still show it as a separate row
      const startLine =
        row.timeStart && !isFromScratch
          ? `<li><span class="dot"></span>Старт: <b>${scheduleFormatDate(row.timeStart)}</b></li>`
          : '';

      return `
        <div class="group-card">
          <div class="blob" style="bottom: -20px; right: -20px; width: 100px; height: 100px">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#e7ebea" />
            </svg>
          </div>
          <div class="group-head">
            <h4>${title}</h4>
            <span class="status-pill ${badgeClass}">${badgeLabel}</span>
          </div>
          <ul class="group-rows">
            <li><span class="dot"></span>Розклад: <b>${row.schedule}</b></li>
            <li><span class="dot"></span>Викладач: <b>${row.teacher}</b></li>
            <li><span class="dot"></span>Вартість: <b>${priceLine}</b></li>
            ${startLine}
          </ul>
          <a href="#booking" class="group-link"
            >Записатись
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      `;
    })
    .join('');
}

function scheduleRenderAll() {
  scheduleRenderTimeFilter();
  scheduleRenderLevelFilter();
  scheduleRenderGroupCards();
}

// --- init ---------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
  console.log('schedule init');
  const grid = document.getElementById('schedule-grid');
  console.log('schedule grid element:', grid);
  if (!grid) {
    console.warn('schedule.js: #schedule-grid not found — aborting');
    return;
  }

  const [lessons, rates] = await Promise.all([getLessons('Чеська'), getRates()]);
  scheduleAllLessons = lessons || [];
  scheduleAllRates = rates || [];

  console.log('schedule lessons:', scheduleAllLessons);
  console.log('schedule rates:', scheduleAllRates);

  scheduleRenderAll();

  document.getElementById('filter-time')?.addEventListener('change', (e) => {
    scheduleFilterState.time = e.target.value;
    scheduleRenderAll();
  });
  document.getElementById('filter-level')?.addEventListener('change', (e) => {
    scheduleFilterState.level = e.target.value;
    scheduleRenderAll();
  });
});
