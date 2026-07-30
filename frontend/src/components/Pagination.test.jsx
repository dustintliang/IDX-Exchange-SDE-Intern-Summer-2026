import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination, { getPageNumbers } from './Pagination';

// ── getPageNumbers unit tests ─────────────────────────────────────────────────

describe('getPageNumbers', () => {
  it('returns all pages when totalPages is 7 or fewer', () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageNumbers(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('shows ellipsis after the start window when on page 1', () => {
    const pages = getPageNumbers(1, 20);
    expect(pages[0]).toBe(1);
    expect(pages).toContain('...');
    expect(pages[pages.length - 1]).toBe(20);
  });

  it('shows ellipsis before the end window when on the last page', () => {
    const pages = getPageNumbers(20, 20);
    expect(pages[0]).toBe(1);
    expect(pages).toContain('...');
    expect(pages[pages.length - 1]).toBe(20);
  });

  it('shows ellipsis on both sides when in the middle', () => {
    const pages = getPageNumbers(10, 20);
    expect(pages[0]).toBe(1);
    expect(pages[pages.length - 1]).toBe(20);
    expect(pages.filter((p) => p === '...').length).toBe(2);
  });

  // Debug challenge: last page must not appear twice near the end
  it('does not duplicate the last page when currentPage is near the end', () => {
    const pages = getPageNumbers(8, 10);
    const pageNums = pages.filter((p) => p !== '...');
    const unique = [...new Set(pageNums)];
    expect(pageNums).toEqual(unique);
    expect(pages[pages.length - 1]).toBe(10);
  });

  it('fills a single-page gap instead of inserting ellipsis', () => {
    // currentPage=4, totalPages=20: window is [3,4,5], gap between 1 and 3 is exactly 2
    // → page 2 should be inserted rather than "1 ... 3"
    const pages = getPageNumbers(4, 20);
    const idx1 = pages.indexOf(1);
    expect(pages[idx1 + 1]).toBe(2); // 2 filled in, no ellipsis in that gap
    expect(pages[idx1 + 2]).toBe(3);
  });
});

// ── Pagination component tests ────────────────────────────────────────────────

describe('Pagination component', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('disables the Prev button on page 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls onPageChange with the clicked page number', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with currentPage + 1 when Next is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with currentPage - 1 when Prev is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
