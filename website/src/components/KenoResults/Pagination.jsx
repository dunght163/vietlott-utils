export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div id="pagenav">
      <ul className="pagenav">
        {pages.map(p => (
          <li key={p} className={p === currentPage ? 'active' : ''}>
            <a href="#" onClick={e => { e.preventDefault(); onPageChange(p); }}>{p}</a>
          </li>
        ))}
        {currentPage < totalPages && (
          <li>
            <a href="#" onClick={e => { e.preventDefault(); onPageChange(currentPage + 1); }}>&gt;&gt;</a>
          </li>
        )}
      </ul>
    </div>
  );
}
