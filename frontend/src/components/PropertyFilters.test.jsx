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
});
