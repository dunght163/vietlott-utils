import { useState, useMemo } from 'react';
import { mockKenoData } from '../../data/mockKenoData';
import SearchForm from './SearchForm';
import ResultRow from './ResultRow';
import Pagination from './Pagination';
import '../../styles/keno.css';

const PER_PAGE = 20;

export default function KenoResults() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ date: '', ky: '', boSo: '', tuKy: '', denKy: '' });
  const [appliedFilters, setAppliedFilters] = useState({ date: '', ky: '', boSo: '', tuKy: '', denKy: '' });

  const drawOptions = useMemo(() => {
    return mockKenoData.map(d => d.id).sort((a, b) => b - a);
  }, []);

  const matchedNumbers = useMemo(() => {
    const nums = new Set();
    if (appliedFilters.boSo.trim()) {
      appliedFilters.boSo.split(',').forEach(s => {
        const n = parseInt(s.trim(), 10);
        if (n >= 1 && n <= 80) nums.add(n);
      });
    }
    return nums;
  }, [appliedFilters.boSo]);

  const filteredData = useMemo(() => {
    let data = mockKenoData;

    if (appliedFilters.date) {
      const parts = appliedFilters.date.split('-');
      const filterDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      data = data.filter(d => d.date === filterDate);
    }

    if (appliedFilters.ky && appliedFilters.ky !== '0') {
      const kyValues = appliedFilters.ky.split(';').map(s => s.trim()).filter(Boolean);
      if (kyValues.length > 0) {
        data = data.filter(d => kyValues.includes(String(d.id)));
      }
    }

    if (appliedFilters.tuKy) {
      const from = parseInt(appliedFilters.tuKy, 10);
      data = data.filter(d => d.id >= from);
    }

    if (appliedFilters.denKy) {
      const to = parseInt(appliedFilters.denKy, 10);
      data = data.filter(d => d.id <= to);
    }

    return data;
  }, [appliedFilters]);

  const totalPages = Math.ceil(filteredData.length / PER_PAGE);
  const pageData = filteredData.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSearch = () => {
    let correctedFilters = { ...filters };
    if (correctedFilters.tuKy && correctedFilters.denKy) {
      const from = parseInt(correctedFilters.tuKy, 10);
      const to = parseInt(correctedFilters.denKy, 10);
      if (from > to) {
        correctedFilters.tuKy = String(to);
        correctedFilters.denKy = String(from);
        setFilters(correctedFilters);
      }
    }
    setAppliedFilters(correctedFilters);
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
          {pageData.map((draw, idx) => (
            <ResultRow
              key={draw.id}
              draw={draw}
              isOdd={idx % 2 === 1}
              matchedNumbers={matchedNumbers}
            />
          ))}
          {pageData.length === 0 && (
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
