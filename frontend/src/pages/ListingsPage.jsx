import { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';

export default function ListingsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProperties({ limit: 20 })
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="listings-page">
      <header className="listings-header">
        <h1>IDX Exchange</h1>
        {data && !loading && (
          <p className="count">
            Showing {data.results.length} of {Number(data.total).toLocaleString()} properties
          </p>
        )}
      </header>

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

      {data && !loading && (
        <div className="property-grid">
          {data.results.map((p) => (
            <PropertyCard key={p.L_ListingID} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
