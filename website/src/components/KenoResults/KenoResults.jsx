import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchDraws, fetchDrawRangeOptions } from '../../api/drawsApi';
import SearchForm from './SearchForm';
import ResultRow from './ResultRow';
import Pagination from './Pagination';
import '../../styles/keno.css';

const PER_PAGE = 20;

const EMPTY_FILTERS = { date: '', ky: '', boSo: '', tuKy: '', denKy: '' };

function buildApiParams(applied, page) {
  const params = { page, pageSize: PER_PAGE };
  if (applied.date) params.date = applied.date;
  if (applied.ky && applied.ky.trim() && applied.ky.trim() !== '0') {
    params.drawNumbers = applied.ky.trim();
  }
  if (applied.tuKy) params.fromDraw = applied.tuKy;
  if (applied.denKy) params.toDraw = applied.denKy;
  return params;
}

export default function KenoResults() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [drawOptions, setDrawOptions] = useState([]);
  const [draws, setDraws] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchDrawRangeOptions()
      .then((res) => { if (!cancelled) setDrawOptions(res.data); })
      .catch((err) => { if (!cancelled) console.error('Failed to load draw options:', err); });
    return () => { cancelled = true; };
  }, []);

  const loadDraws = useCallback(async (applied, page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDraws(buildApiParams(applied, page));
      setDraws(res.data);
      setTotalPages(Math.max(1, res.pagination.totalPages));
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu');
      setDraws([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDraws(appliedFilters, currentPage);
  }, [appliedFilters, currentPage, loadDraws]);

  const matchedNumbers = useMemo(() => {
    const nums = new Set();
    if (appliedFilters.boSo.trim()) {
      appliedFilters.boSo.split(',').forEach((s) => {
        const n = parseInt(s.trim(), 10);
        if (n >= 1 && n <= 80) nums.add(n);
      });
    }
    return nums;
  }, [appliedFilters.boSo]);

  const handleSearch = () => {
    let corrected = { ...filters };
    if (corrected.tuKy && corrected.denKy) {
      const from = parseInt(corrected.tuKy, 10);
      const to = parseInt(corrected.denKy, 10);
      if (from > to) {
        corrected.tuKy = String(to);
        corrected.denKy = String(from);
        setFilters(corrected);
      }
    }
    setAppliedFilters(corrected);
    setCurrentPage(1);
  };

  return (
    <div className="KQKeno">
      <div className="keno-header">
        <div className="keno-title">
          <img src="/images/keno.png" alt="Keno" className="keno-icon" />
          <h1>KẾT QUẢ KENO</h1>
        </div>
        <SearchForm
          filters={filters}
          onFilterChange={setFilters}
          onSearch={handleSearch}
          drawOptions={drawOptions}
        />
      </div>

      <div className="keno-table">
        <div className="keno-results">
          {loading && <div className="keno-empty">Đang tải...</div>}
          {!loading && error && <div className="keno-empty">{error}</div>}
          {!loading && !error && draws.map((draw, idx) => (
            <ResultRow
              key={draw.id}
              draw={draw}
              isOdd={idx % 2 === 1}
              matchedNumbers={matchedNumbers}
            />
          ))}
          {!loading && !error && draws.length === 0 && (
            <div className="keno-empty">Không có kết quả phù hợp.</div>
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
