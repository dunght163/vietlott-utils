export default function StatBadges({ draw }) {
  const { bigCount, smallCount, evenCount, oddCount, bigSmallBadge, evenOddBadge } = draw;

  const getBigSmallClass = (type) => {
    if (type === 'lon' && bigSmallBadge === 'lon') return 'btn_tx tx_lon';
    if (type === 'be' && bigSmallBadge === 'be') return 'btn_tx tx_be';
    if (type === 'hoalb' && bigSmallBadge === 'hoalb') return 'btn_tx tx_hoalb';
    return 'btn_tx';
  };

  const getEvenOddClass = (type) => {
    if (type === 'chan' && evenOddBadge === 'chan') return 'btn_tx tx_chan';
    if (type === 'le' && evenOddBadge === 'le') return 'btn_tx tx_le';
    if (type === 'hoacl' && evenOddBadge === 'hoacl') return 'btn_tx tx_hoacl';
    return 'btn_tx';
  };

  return (
    <div className="stat-badges">
      <div className="group-tx">
        <span className={getBigSmallClass('lon')}>Lớn ({bigCount})</span>
        <span className={getBigSmallClass('hoalb')}>Hòa LN</span>
        <span className={getBigSmallClass('be')}>Nhỏ ({smallCount})</span>
      </div>
      <div className="group-tx">
        <span className={getEvenOddClass('chan')}>Chẵn ({evenCount})</span>
        <span className="btn_tx">C 11-12</span>
        <span className={getEvenOddClass('hoacl')}>Hòa CL</span>
        <span className="btn_tx">L 11-12</span>
        <span className={getEvenOddClass('le')}>Lẻ ({oddCount})</span>
      </div>
    </div>
  );
}
