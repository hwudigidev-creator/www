import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/about">關於我們</Link>
          <Link to="/products">產品服務</Link>
          <Link to="/contact">聯絡我們</Link>
        </div>
        <p>&copy; {currentYear} 品牌名稱. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
