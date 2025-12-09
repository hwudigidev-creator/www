function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} 品牌名稱. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
