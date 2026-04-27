import { useState, useRef, useEffect } from 'react';

function DrawDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = options.filter(o => String(o).includes(search));

  return (
    <div className="draw-dropdown" ref={ref}>
      <div className="draw-dropdown-input">
        <input
          type="text"
          value={open ? search : (value || '')}
          placeholder={placeholder}
          onFocus={() => { setOpen(true); setSearch(''); }}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
        />
        {value && (
          <button className="draw-dropdown-clear" onClick={() => { onChange(''); setSearch(''); }}>×</button>
        )}
      </div>
      {open && (
        <ul className="draw-dropdown-list">
          {filtered.map(o => (
            <li
              key={o}
              className={o === value ? 'selected' : ''}
              onClick={() => { onChange(String(o)); setOpen(false); setSearch(''); }}
            >
              #{o}
            </li>
          ))}
          {filtered.length === 0 && <li className="no-match">Không tìm thấy</li>}
        </ul>
      )}
    </div>
  );
}

export default function SearchForm({ filters, onFilterChange, onSearch, drawOptions }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="keno-search">
      <div className="keno-search-row">
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
            placeholder="VD: 278001;278002;278003"
            onChange={e => onFilterChange({ ...filters, ky: e.target.value })}
            style={{ width: 180 }}
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
      </div>
      <div className="keno-search-row">
        <label>
          Từ kỳ
          <DrawDropdown
            value={filters.tuKy}
            onChange={v => onFilterChange({ ...filters, tuKy: v })}
            options={drawOptions}
            placeholder="Chọn kỳ..."
          />
        </label>
        <label>
          Đến kỳ
          <DrawDropdown
            value={filters.denKy}
            onChange={v => onFilterChange({ ...filters, denKy: v })}
            options={drawOptions}
            placeholder="Chọn kỳ..."
          />
        </label>
        <button className="btn-xem" onClick={onSearch}>XEM</button>
      </div>
    </div>
  );
}
