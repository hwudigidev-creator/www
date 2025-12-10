import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)

  const isActive = (path) => {
    return location.pathname === path ? 'nav-icon-link active' : 'nav-icon-link'
  }

  const toggleNav = () => {
    setIsExpanded(!isExpanded)
  }

  const closeNav = () => {
    setIsExpanded(false)
  }

  // 點擊或捲動任何地方收起導覽
  useEffect(() => {
    if (!isExpanded) return

    const handleClose = () => {
      setIsExpanded(false)
    }

    // 延遲添加監聽，避免立即觸發
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClose)
      window.addEventListener('scroll', handleClose, { passive: true })
      window.addEventListener('touchmove', handleClose, { passive: true })
    }, 10)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClose)
      window.removeEventListener('scroll', handleClose)
      window.removeEventListener('touchmove', handleClose)
    }
  }, [isExpanded])

  return (
    <header className={`header ${isExpanded ? 'expanded' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeNav}>
          <div className="logo-icon"></div>
          <span>數位設計系</span>
        </Link>

        {/* 桌面版導覽 - 純 icon */}
        <nav className="nav nav-desktop">
          <Link to="/about" className={isActive('/about')} title="關於我們">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
          </Link>
          <Link to="/products" className={isActive('/products')} title="課程特色">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </Link>
          <Link to="/contact" className={isActive('/contact')} title="聯絡我們">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </Link>
        </nav>

        {/* 手機版展開按鈕 */}
        <button className="nav-toggle" onClick={toggleNav} aria-label="展開選單">
          <svg viewBox="0 0 24 24" fill="currentColor" className={`nav-toggle-icon ${isExpanded ? 'rotated' : ''}`}>
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>

        {/* 手機版展開選單 */}
        <nav className={`nav nav-mobile ${isExpanded ? 'show' : ''}`}>
          <Link to="/about" className={isActive('/about')} title="關於我們" onClick={closeNav}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
          </Link>
          <Link to="/products" className={isActive('/products')} title="課程特色" onClick={closeNav}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </Link>
          <Link to="/contact" className={isActive('/contact')} title="聯絡我們" onClick={closeNav}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
