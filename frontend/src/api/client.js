async function request(path, params = {}) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
  const query = new URLSearchParams(filtered).toString();
  const url = `/api${path}${query ? `?${query}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Server error (HTTP ${res.status})`);
  }
  return res.json();
}

export function fetchProperties(params = {}) {
  return request('/properties', params);
}

export function fetchPropertyDetail(id) {
  return request(`/properties/${id}`);
}

export function fetchOpenHouses(id) {
  return request(`/properties/${id}/openhouses`);
}
