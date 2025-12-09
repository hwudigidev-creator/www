import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/about">關於我們</Link>
          <Link to="/products">課程特色</Link>
          <Link to="/contact">聯絡我們</Link>
          <a href="https://www.hwu.edu.tw/" target="_blank" rel="noopener noreferrer">學校官網</a>
        </div>
        <p>&copy; {currentYear} 醒吾科技大學 數位設計系. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
