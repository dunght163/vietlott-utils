const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

// Flip to true to serve data from src/data/mockKenoData.js instead of hitting the backend.
// Useful for offline demos when the backend isn't running.
const USE_MOCK_DATA = false;

function buildQuery(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.append(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.error?.message || JSON.stringify(body);
    } catch {
      detail = await res.text();
    }
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json();
}

async function mockFetchDraws({ date, drawNumbers, fromDraw, toDraw, page = 1, pageSize = 20 } = {}) {
  const { mockKenoData } = await import('../data/mockKenoData');
  let rows = mockKenoData;

  if (date) rows = rows.filter((d) => d.dateRaw === date);

  if (drawNumbers !== undefined && drawNumbers !== null && String(drawNumbers).trim() !== '' && String(drawNumbers).trim() !== '0') {
    const ids = String(drawNumbers).split(';').map((s) => s.trim()).filter(Boolean);
    rows = rows.filter((d) => ids.includes(String(d.id)));
  }

  if (fromDraw) rows = rows.filter((d) => d.id >= Number(fromDraw));
  if (toDraw) rows = rows.filter((d) => d.id <= Number(toDraw));

  const total = rows.length;
  const start = (page - 1) * pageSize;
  return {
    data: rows.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

async function mockFetchDrawRangeOptions() {
  const { mockKenoData } = await import('../data/mockKenoData');
  return { data: mockKenoData.map((d) => d.id).sort((a, b) => b - a) };
}

export async function fetchDraws({ date, drawNumbers, fromDraw, toDraw, page = 1, pageSize = 20 } = {}) {
  if (USE_MOCK_DATA) return mockFetchDraws({ date, drawNumbers, fromDraw, toDraw, page, pageSize });
  return request(`/draws${buildQuery({ date, drawNumbers, fromDraw, toDraw, page, pageSize })}`);
}

export async function fetchDrawRangeOptions() {
  if (USE_MOCK_DATA) return mockFetchDrawRangeOptions();
  return request('/draws/range-options');
}
