import { useState, useRef, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getProducts } from '../services/api'
import Loading from '../components/Loading'

function Products() {
  const { data, loading, error } = useFetch(getProducts)
  const [contentOffset, setContentOffset] = useState(0)
  const contentRef = useRef(null)

  // 用外層頁面滾動控制內容位置（同聯絡頁）
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // 可視區域高度（扣除 header + 標題區）
      const isMobile = window.innerWidth <= 768
      const visibleHeight = windowHeight - (isMobile ? 140 : 180)

      // 內容實際高度
      const contentHeight = contentRef.current?.scrollHeight || 800

      // 內容可以移動的最大距離
      const maxOffset = Math.max(0, contentHeight - visibleHeight + 100)

      // 根據頁面滾動計算內容移動量（限制在 0 到 maxOffset 之間）
      const offset = Math.min(scrollY, maxOffset)
      setContentOffset(offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    // 延遲執行一次，確保內容已渲染
    setTimeout(handleScroll, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [data])

  if (loading) return <Loading />
  if (error) return <div className="error">載入課程資料時發生錯誤</div>

  const { products } = data || {}

  return (
    <div className="products">
      {/* 第一區塊：標題區 - FIXED 不動 */}
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="gradient-text">課程特色</h1>
          <p>多元化的專業課程，培養數位設計全方位能力</p>
        </div>
      </section>

      {/* 第二區塊：內容區 - FIXED 在底部，由外層滾動控制 */}
      <section className="products-content-section">
        <div
          className="products-content-wrapper"
          style={{
            transform: `translateY(${-contentOffset}px)`,
          }}
        >
          <div className="products-content-scroll" ref={contentRef}>
            <div className="products-grid">
              {products?.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      '課程圖片'
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    {product.price && (
                      <span className="product-price">NT$ {product.price?.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer 滾動空間 - 讓 Footer 可以上浮 */}
      <div className="products-footer-spacer"></div>
    </div>
  )
}

export default Products
