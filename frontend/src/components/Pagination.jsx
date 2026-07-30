// Build a compact list of page numbers with '...' gaps.
// Always includes page 1 and the last page; shows a window of ±1 around
// the current page; fills single-page gaps to avoid "4 ... 6" sequences.
export function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const inWindow = (i) => i >= currentPage - 1 && i <= currentPage + 1;
  const range = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || inWindow(i)) range.push(i);
  }

  const result = [];
  let prev;
  for (const page of range) {
    if (prev !== undefined) {
      const gap = page - prev;
      if (gap === 2) result.push(prev + 1); // fill single-page gap
      else if (gap > 2) result.push('...');
    }
    result.push(page);
    prev = page;
  }
  return result;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination-ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={`pagination-btn${page === currentPage ? ' active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
