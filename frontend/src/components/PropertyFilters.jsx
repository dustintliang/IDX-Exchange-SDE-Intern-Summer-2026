import { useState } from 'react';

const EMPTY_FILTERS = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
};

export default function PropertyFilters({ onSearch, onClear }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [priceError, setPriceError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    if (name === 'minPrice' || name === 'maxPrice') setPriceError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const min = Number(filters.minPrice);
    const max = Number(filters.maxPrice);
    if (filters.minPrice !== '' && filters.maxPrice !== '' && min > max) {
      setPriceError('Min price cannot be greater than max price.');
      return;
    }
    setPriceError('');
    onSearch(filters);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    setPriceError('');
    onClear();
  }

  return (
    <form className="filters" onSubmit={handleSubmit} aria-label="Property filters">
      <div className="filters-row">
        <input
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          name="zipcode"
          value={filters.zipcode}
          onChange={handleChange}
          placeholder="ZIP Code"
        />
        <div className="price-field">
          <input
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min Price"
            type="number"
            min="0"
            className={priceError ? 'input-error' : ''}
          />
        </div>
        <div className="price-field">
          <input
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max Price"
            type="number"
            min="0"
            className={priceError ? 'input-error' : ''}
          />
        </div>
        <select name="beds" value={filters.beds} onChange={handleChange} aria-label="Beds">
          <option value="">Any Beds</option>
          {['1', '2', '3', '4', '5'].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>
        <select name="baths" value={filters.baths} onChange={handleChange} aria-label="Baths">
          <option value="">Any Baths</option>
          {['1', '1.5', '2', '2.5', '3'].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>
      </div>
      {priceError && <p className="filter-error" role="alert">{priceError}</p>}
      <div className="filter-actions">
        <button type="submit" className="btn-primary">Search</button>
        <button type="button" className="btn-secondary" onClick={handleClear}>Clear Filters</button>
      </div>
    </form>
  );
}
