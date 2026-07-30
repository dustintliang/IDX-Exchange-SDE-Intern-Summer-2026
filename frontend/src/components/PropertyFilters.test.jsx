import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

describe('PropertyFilters', () => {
  it('renders all six filter inputs', () => {
    render(<PropertyFilters onSearch={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /beds/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /baths/i })).toBeInTheDocument();
  });

  it('calls onSearch with the current filter values when Search is clicked', () => {
    const onSearch = vi.fn();
    render(<PropertyFilters onSearch={onSearch} onClear={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('City'), {
      target: { name: 'city', value: 'San Diego' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ city: 'San Diego' }));
  });

  it('resets all inputs and calls onClear when Clear Filters is clicked', () => {
    const onClear = vi.fn();
    render(<PropertyFilters onSearch={vi.fn()} onClear={onClear} />);
    const cityInput = screen.getByPlaceholderText('City');
    fireEvent.change(cityInput, { target: { name: 'city', value: 'Manteca' } });
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(cityInput.value).toBe('');
  });

  it('does not call onSearch when the form is idle', () => {
    const onSearch = vi.fn();
    render(<PropertyFilters onSearch={onSearch} onClear={vi.fn()} />);
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('shows an error and blocks onSearch when minPrice is greater than maxPrice', () => {
    const onSearch = vi.fn();
    render(<PropertyFilters onSearch={onSearch} onClear={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Min Price'), {
      target: { name: 'minPrice', value: '900000' },
    });
    fireEvent.change(screen.getByPlaceholderText('Max Price'), {
      target: { name: 'maxPrice', value: '500000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Min price cannot be greater than max price.');
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('clears the price error message when Clear Filters is clicked', () => {
    render(<PropertyFilters onSearch={vi.fn()} onClear={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Min Price'), {
      target: { name: 'minPrice', value: '900000' },
    });
    fireEvent.change(screen.getByPlaceholderText('Max Price'), {
      target: { name: 'maxPrice', value: '100000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
