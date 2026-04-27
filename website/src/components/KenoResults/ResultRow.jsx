export default function ResultRow({ draw, isOdd, matchedNumbers }) {
  const { evenCount, oddCount, bigCount, smallCount } = draw;

  let eoLabel, eoClass;
  if (evenCount > oddCount) {
    eoLabel = `Chan(${evenCount})`;
    eoClass = 'icChan';
  } else if (oddCount > evenCount) {
    eoLabel = `Le(${oddCount})`;
    eoClass = 'icLe';
  } else {
    eoLabel = 'Hoa CL';
    eoClass = 'icHoaCL';
  }

  let bsLabel, bsClass;
  if (bigCount > smallCount) {
    bsLabel = `Lon(${bigCount})`;
    bsClass = 'icLon';
  } else if (smallCount > bigCount) {
    bsLabel = `Nho(${smallCount})`;
    bsClass = 'icBe';
  } else {
    bsLabel = 'Hoa LN';
    bsClass = 'icHoaLB';
  }

  return (
    <div className={`keno-row${isOdd ? ' odd' : ''}`}>
      <div className="keno-col-info">
        <div className="info-draw">#{draw.id} {draw.date}  {draw.time}</div>
        <div className="info-badges">
          <span className={`icKeno ${eoClass}`}>{eoLabel}</span>
          <span className={`icKeno ${bsClass}`}>{bsLabel}</span>
        </div>
      </div>
      <div className="keno-col-numbers">
        <div className="numbers-grid">
          {draw.numbers.map((num, i) => (
            <div
              key={i}
              className={`number-cell${matchedNumbers.has(num) ? ' active' : ''}`}
            >
              {String(num).padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
