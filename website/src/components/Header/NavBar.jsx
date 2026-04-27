import { menuData } from '../../data/menuData';
import '../../styles/navbar.css';

export default function NavBar() {
  return (
    <nav id="navbar3">
      <div className="container">
        <ul className="nav-menu">
          {menuData.map((menu, idx) => (
            <li key={idx} className="nav-item">
              <a href="#" className={`nav-link${menu.label === 'KENO' ? ' nav-keno' : ''}`}>
                <i className={`fa fa-fw ${menu.icon}`}></i>
                <span>{menu.label}</span>
              </a>
              {menu.items && (
                <ul className="dropdown">
                  {menu.items.map((item, i) => {
                    const isObj = typeof item === 'object';
                    return (
                      <li key={i}>
                        <a href={isObj ? item.href : '#'} className={isObj && item.active ? 'active' : ''}>
                          {isObj ? item.label : item}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
              {menu.groups && (
                <ul className="dropdown dropdown-wide">
                  {menu.groups.map((group, gi) => (
                    <li key={gi} className="dropdown-group">
                      <span className="group-title">{group.title}</span>
                      <ul>
                        {group.items.map((item, ii) => (
                          <li key={ii}><a href="#">{item}</a></li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
