import '../../styles/header.css';

export default function TopBar() {
  return (
    <div id="topheader">
      <div className="container">
        <ul className="topbar-links">
          <li><a href="#">minhchinhlottery.com</a></li>
          <li><a href="#">doisotrung.com.vn</a></li>
          <li><a href="#">xosocao.net</a></li>
          <li className="topbar-right"><a href="#">Thay đổi thông tin vé dò tại đây</a></li>
        </ul>
      </div>
    </div>
  );
}
