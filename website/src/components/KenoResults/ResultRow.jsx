import StatBadges from './StatBadges';

const BADGE_CONFIG = {
  chan: { label: 'Chẵn', className: 'icChan' },
  le: { label: 'Lẻ', className: 'icLe' },
  hoacl: { label: 'Hòa CL', className: 'icHoaCL' },
  lon: { label: 'Lớn', className: 'icLon' },
  be: { label: 'Nhỏ', className: 'icBe' },
  hoalb: { label: 'Hòa LB', className: 'icHoaLB' },
};

export default function ResultRow({ draw, isOdd, matchedNumbers }) {
  const eoBadge = BADGE_CONFIG[draw.evenOddBadge];
  const bsBadge = BADGE_CONFIG[draw.bigSmallBadge];

  return (
    <div className={`keno-row${isOdd ? ' odd' : ''}`}>
      <div className="keno-col-ky">
        <div className="ky-number">#{draw.id}</div>
        <div className="ky-badges">
          <span className={`icKeno ${eoBadge.className}`}>{eoBadge.label}</span>
          <span className={`icKeno ${bsBadge.className}`}>{bsBadge.label}</span>
        </div>
      </div>
      <div className="keno-col-time">
        <div>{draw.date}</div>
        <div>{draw.time}</div>
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
        <StatBadges draw={draw} />
      </div>
    </div>
  );
}
