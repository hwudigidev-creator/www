import { useState, useRef, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getProducts } from '../services/api'
import Loading from '../components/Loading'

function Products() {
  const { data, loading, error } = useFetch(getProducts)
  const [contentOffset, setContentOffset] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const contentRef = useRef(null)

  // 用外層頁面滾動控制內容位置
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      const isMobile = window.innerWidth <= 768
      const visibleHeight = windowHeight - (isMobile ? 140 : 180)
      const contentHeight = contentRef.current?.scrollHeight || 800
      const maxOffset = Math.max(0, contentHeight - visibleHeight + 100)
      const offset = Math.min(scrollY, maxOffset)
      setContentOffset(offset)

      // 根據滾動位置計算當前活躍的課程卡片
      const products = data?.products || []
      if (products.length > 0) {
        const scrollPerCard = 150
        const index = Math.floor(scrollY / scrollPerCard) % products.length
        setActiveIndex(index)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
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
      {/* 第一區塊：標題區 */}
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="gradient-text">課程特色</h1>
          <p>多元化的專業課程，培養數位設計全方位能力</p>
        </div>
      </section>

      {/* 第二區塊：內容區 */}
      <section className="products-content-section">
        <div
          className="products-content-wrapper"
          style={{
            transform: `translateY(${-contentOffset}px)`,
          }}
        >
          <div className="products-content-scroll" ref={contentRef}>
            <div className="products-showcase">
              {/* 左側：課程卡片列表 */}
              <div className="products-list">
                {products?.map((product, index) => (
                  <div
                    key={product.id}
                    className={`product-item ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="product-item-icon">
                      <i className={`fa-solid ${getIconForProduct(index)}`}></i>
                    </div>
                    <div className="product-item-content">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 右側：旋轉的線框方塊 */}
              <div className="wireframe-cube-container">
                <div className="wireframe-glow"></div>
                <div className="wireframe-cube">
                  {/* 8 個頂點 */}
                  <div className="cube-vertex v1"></div>
                  <div className="cube-vertex v2"></div>
                  <div className="cube-vertex v3"></div>
                  <div className="cube-vertex v4"></div>
                  <div className="cube-vertex v5"></div>
                  <div className="cube-vertex v6"></div>
                  <div className="cube-vertex v7"></div>
                  <div className="cube-vertex v8"></div>
                  {/* 12 條邊 */}
                  <div className="cube-edge e1"></div>
                  <div className="cube-edge e2"></div>
                  <div className="cube-edge e3"></div>
                  <div className="cube-edge e4"></div>
                  <div className="cube-edge e5"></div>
                  <div className="cube-edge e6"></div>
                  <div className="cube-edge e7"></div>
                  <div className="cube-edge e8"></div>
                  <div className="cube-edge e9"></div>
                  <div className="cube-edge e10"></div>
                  <div className="cube-edge e11"></div>
                  <div className="cube-edge e12"></div>
                </div>
                {/* 濾鏡效果層 */}
                <div className="wireframe-filter"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="products-footer-spacer"></div>
    </div>
  )
}

// 根據索引返回對應的 Font Awesome 圖標
function getIconForProduct(index) {
  const icons = [
    'fa-robot',
    'fa-film',
    'fa-gamepad',
    'fa-wand-magic-sparkles',
    'fa-vr-cardboard',
    'fa-arrows-spin'
  ]
  return icons[index % icons.length]
}

export default Products
