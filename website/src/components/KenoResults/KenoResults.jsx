import { useState, useMemo } from 'react';
import { mockKenoData } from '../../data/mockKenoData';
import SearchForm from './SearchForm';
import ResultRow from './ResultRow';
import Pagination from './Pagination';
import '../../styles/keno.css';

const PER_PAGE = 15;

export default function KenoResults() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ date: '', ky: '0', boSo: '' });
  const [appliedFilters, setAppliedFilters] = useState({ date: '', ky: '0', boSo: '' });

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
      data = data.filter(d => String(d.id).includes(appliedFilters.ky));
    }

    return data;
  }, [appliedFilters]);

  const totalPages = Math.ceil(filteredData.length / PER_PAGE);
  const pageData = filteredData.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  };

  return (
    <div className="KQKeno">
      <div className="keno-header">
        <div className="keno-title">
          <img src="/images/keno.png" alt="Keno" className="keno-icon" />
          <h1>KẾT QUẢ KENO</h1>
        </div>
        <SearchForm filters={filters} onFilterChange={setFilters} onSearch={handleSearch} />
      </div>

      <div className="keno-table">
        <div className="keno-col-headers">
          <div className="col-header col-ky">Kỳ xổ</div>
          <div className="col-header col-time">Thời gian</div>
          <div className="col-header col-result">Kết quả</div>
        </div>

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
