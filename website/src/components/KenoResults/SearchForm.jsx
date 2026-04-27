export default function SearchForm({ filters, onFilterChange, onSearch }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="keno-search">
      <label>
        Ngày
        <input
          type="date"
          value={filters.date}
          max={today}
          onChange={e => onFilterChange({ ...filters, date: e.target.value })}
        />
      </label>
      <label>
        Kỳ
        <input
          type="text"
          value={filters.ky}
          onChange={e => onFilterChange({ ...filters, ky: e.target.value })}
          style={{ width: 60 }}
        />
      </label>
      <label>
        Bộ số
        <input
          type="text"
          value={filters.boSo}
          placeholder="VD: 04,12,23,35 ..."
          onChange={e => onFilterChange({ ...filters, boSo: e.target.value })}
          style={{ width: 160 }}
        />
      </label>
      <button className="btn-xem" onClick={onSearch}>XEM</button>
    </div>
  );
}
