const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

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

export async function fetchDraws({ date, drawNumbers, fromDraw, toDraw, page = 1, pageSize = 20 } = {}) {
  return request(`/draws${buildQuery({ date, drawNumbers, fromDraw, toDraw, page, pageSize })}`);
}

export async function fetchDrawRangeOptions() {
  return request('/draws/range-options');
}
