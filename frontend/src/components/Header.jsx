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
          品牌名稱
        </Link>
        <nav className="nav">
          <Link to="/" className={isActive('/')}>
            首頁
          </Link>
          <Link to="/about" className={isActive('/about')}>
            關於我們
          </Link>
          <Link to="/products" className={isActive('/products')}>
            產品服務
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
