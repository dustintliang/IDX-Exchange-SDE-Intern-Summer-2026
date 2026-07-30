import { useState, useEffect, useRef } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 20;

export default function ListingsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Increment on every new request; stale .then() callbacks check their id
  // matches the current value before writing state — prevents old results
  // from flashing in after a faster newer request has already resolved.
  const requestId = useRef(0);

  function loadProperties(activeFilters = {}, page = 1) {
    const id = ++requestId.current;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    setLoading(true);
    setError(null);
    fetchProperties({ ...activeFilters, limit: ITEMS_PER_PAGE, offset })
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

  function handleSearch(newFilters) {
    setFilters(newFilters);
    setCurrentPage(1);
    loadProperties(newFilters, 1);
  }

  function handleClear() {
    setFilters({});
    setCurrentPage(1);
    loadProperties({}, 1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    loadProperties(filters, page);
    window.scrollTo(0, 0);
  }

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const showingFrom = data && data.results.length > 0 ? offset + 1 : 0;
  const showingTo = data ? offset + data.results.length : 0;

  return (
    <div className="listings-page">
      <header className="listings-header">
        <h1>IDX Exchange</h1>
      </header>

      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      {data && !loading && (
        <p className="count">
          {data.results.length === 0
            ? 'No properties found'
            : `Showing ${showingFrom.toLocaleString()}–${showingTo.toLocaleString()} of ${Number(data.total).toLocaleString()} properties`}
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

      {data && !loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
