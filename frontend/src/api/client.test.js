import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProperties, fetchPropertyDetail } from './client';

beforeEach(() => {
  global.fetch = vi.fn();
});

describe('fetchProperties', () => {
  it('calls /api/properties with no query string when no params given', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: 100, limit: 20, offset: 0, results: [] }),
    });
    await fetchProperties();
    expect(global.fetch).toHaveBeenCalledWith('/api/properties');
  });

  it('strips empty string params before building the query string', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: 5, limit: 20, offset: 0, results: [] }),
    });
    await fetchProperties({ city: 'San Diego', zipcode: '', minPrice: '' });
    expect(global.fetch).toHaveBeenCalledWith('/api/properties?city=San+Diego');
  });

  it('throws a meaningful error message when the server returns an error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Database error' }),
    });
    await expect(fetchProperties()).rejects.toThrow('Database error');
  });

  it('falls back to a generic HTTP error if the body has no error field', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({}),
    });
    await expect(fetchProperties()).rejects.toThrow('Server error (HTTP 503)');
  });
});

describe('fetchPropertyDetail', () => {
  it('calls /api/properties/:id with the given id', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ L_ListingID: '123', L_Address: '123 Main St' }),
    });
    const data = await fetchPropertyDetail('123');
    expect(global.fetch).toHaveBeenCalledWith('/api/properties/123');
    expect(data.L_ListingID).toBe('123');
  });
});
