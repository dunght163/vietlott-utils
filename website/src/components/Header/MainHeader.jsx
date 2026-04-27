import '../../styles/header.css';

const quickLinks1 = ['XSMN', 'XSMT', 'XSMB', 'XSDT', 'TIN TUC'];
const quickLinks2 = [
  { label: 'MEGA', active: false },
  { label: 'POWER', active: false },
  { label: '3DPRO', active: false },
  { label: 'LOTTO', active: false },
  { label: 'KENO', active: true },
];

export default function MainHeader() {
  return (
    <div id="header">
      <div className="container header-inner">
        <div className="header-logo">
          <a href="/"><img src="/images/logo_mc.png" alt="Minh Chính Lottery" /></a>
        </div>
        <div className="header-right">
          <div className="quick-links">
            <div className="quick-row">
              {quickLinks1.map(l => <a key={l} href="#" className="quick-btn">{l}</a>)}
            </div>
            <div className="quick-row">
              {quickLinks2.map(l => (
                <a key={l.label} href="#" className={`quick-btn${l.active ? ' active' : ''}`}>{l.label}</a>
              ))}
            </div>
          </div>
          <div className="ticket-checker">
            <span className="checker-label">Dò Vé Số</span>
            <input type="date" className="checker-input" />
            <select className="checker-select">
              <option>Chọn tỉnh</option>
            </select>
            <input type="text" maxLength={6} placeholder="Số vé" className="checker-input" />
            <button className="checker-btn">Dò</button>
          </div>
        </div>
      </div>
    </div>
  );
}
