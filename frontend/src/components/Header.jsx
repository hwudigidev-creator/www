import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link'
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon"></div>
          <span>數位設計系</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={isActive('/')}>
            首頁
          </Link>
          <Link to="/about" className={isActive('/about')}>
            關於我們
          </Link>
          <Link to="/products" className={isActive('/products')}>
            課程特色
          </Link>
          <Link to="/contact" className={isActive('/contact')}>
            聯絡我們
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
