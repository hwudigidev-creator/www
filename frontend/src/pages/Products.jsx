import { useState, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getProducts } from '../services/api'
import Loading from '../components/Loading'

function Products() {
  const { data, loading, error } = useFetch(getProducts)
  const [activeIndex, setActiveIndex] = useState(0)

  // 根據滾動位置切換當前卡片
  useEffect(() => {
    const handleScroll = () => {
      const products = data?.products || []
      if (products.length === 0) return

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const scrollPerCard = windowHeight * 0.6

      const index = Math.floor(scrollY / scrollPerCard)
      setActiveIndex(Math.min(Math.max(0, index), products.length - 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [data])

  if (loading) return <Loading />
  if (error) return <div className="error">載入課程資料時發生錯誤</div>

  const { products } = data || {}
  const activeProduct = products?.[activeIndex]

  return (
    <div className="products">
      {/* 固定的展示區 */}
      <section className="products-fixed-section">
        {/* 左側：旋轉的線框方塊 */}
        <div className="wireframe-cube-container">
          <div className="wireframe-glow"></div>
          <div className="wireframe-cube">
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
          <div className="wireframe-filter"></div>
        </div>

        {/* 右側：當前課程卡片 */}
        <div className="product-display">
          {activeProduct && (
            <div className="product-card-large" key={activeIndex}>
              <div className="product-card-icon">
                <i className={`fa-solid ${getIconForProduct(activeIndex)}`}></i>
              </div>
              <h2>{activeProduct.name}</h2>
              <p>{activeProduct.description}</p>
              <div className="product-card-dots">
                {products?.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === activeIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 滾動空間 */}
      <div
        className="products-scroll-spacer"
        style={{ height: `${(products?.length || 1) * 60}vh` }}
      ></div>
    </div>
  )
}

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
