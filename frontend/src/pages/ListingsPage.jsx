import { useState, useEffect, useRef } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';

export default function ListingsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Each new request increments this counter. The .then() callback checks
  // that its id still matches before writing state — this drops stale responses
  // and prevents old results from flashing in after a newer request lands first.
  const requestId = useRef(0);

  function loadProperties(filters = {}) {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    fetchProperties({ ...filters, limit: 20 })
      .then((result) => {
        if (id !== requestId.current) return;
        setData(result);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setError(err.message);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div className="listings-page">
      <header className="listings-header">
        <h1>IDX Exchange</h1>
      </header>

      <PropertyFilters
        onSearch={(filters) => loadProperties(filters)}
        onClear={() => loadProperties()}
      />

      {data && !loading && (
        <p className="count">
          Showing {data.results.length} of {Number(data.total).toLocaleString()} properties
        </p>
      )}

      {loading && (
        <div className="state-message">
          <div className="spinner" />
          <span>Loading properties…</span>
        </div>
      )}

      {error && !loading && (
        <div className="state-message error">
          <strong>Could not load listings.</strong>
          <span>{error}</span>
          <span className="hint">Make sure the backend server is running on port 5000.</span>
        </div>
      )}

      {data && !loading && data.results.length === 0 && (
        <div className="state-message">
          <span>No properties found matching your filters.</span>
          <span className="hint">Try broadening your search.</span>
        </div>
      )}

      {data && !loading && data.results.length > 0 && (
        <div className="property-grid">
          {data.results.map((p) => (
            <PropertyCard key={p.L_ListingID} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
