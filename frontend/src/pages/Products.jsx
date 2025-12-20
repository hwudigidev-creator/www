import { useState, useEffect, useRef } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getProducts } from '../services/api'
import Loading from '../components/Loading'

// 課程對應的示意圖片
const productImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
  'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800',
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
  'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'
]

function Products() {
  const { data, loading, error } = useFetch(getProducts)
  const [activeIndex, setActiveIndex] = useState(0)
  const [cubeRotation, setCubeRotation] = useState(45)
  const [cubePitch, setCubePitch] = useState(-30)
  const prevIndexRef = useRef(0)

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

  // 切換卡片時觸發方塊旋轉 + 俯仰變化
  useEffect(() => {
    if (activeIndex !== prevIndexRef.current) {
      const direction = activeIndex > prevIndexRef.current ? 1 : -1
      setCubeRotation(prev => prev + (90 * direction))
      setCubePitch(prev => prev + (10 * direction))
      prevIndexRef.current = activeIndex
    }
  }, [activeIndex])

  if (loading) return <Loading />
  if (error) return <div className="error">載入課程資料時發生錯誤</div>

  const { products } = data || {}
  const activeProduct = products?.[activeIndex]
  const currentImage = productImages[activeIndex % productImages.length]

  return (
    <div className="products">
      {/* 標題區 */}
      <section className="products-hero">
        <h1 className="gradient-text">課程特色</h1>
        <p>探索數位設計系的專業課程與學習內容</p>
      </section>

      {/* 固定的展示區 */}
      <section className="products-fixed-section">
        {/* 左側：方塊與圖片區 */}
        <div className="cube-showcase">
          {/* 圖片展示區 */}
          <div className="showcase-image-container">
            <img
              src={currentImage}
              alt={activeProduct?.name || '課程圖片'}
              className="showcase-image"
              key={activeIndex}
            />
          </div>

          {/* 漂浮的線框方塊 */}
          <div className="wireframe-cube-container">
            <div className="wireframe-glow"></div>
            <div
              className="wireframe-cube"
              style={{ transform: `rotateX(${cubePitch}deg) rotateY(${cubeRotation}deg)` }}
            >
              {/* 6 個半透明濾鏡面 */}
              <div className="cube-face front"></div>
              <div className="cube-face back"></div>
              <div className="cube-face left"></div>
              <div className="cube-face right"></div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
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
          </div>
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

      {/* 滾動空間 - 多一個卡片高度讓 Footer 可以上來 */}
      <div
        className="products-scroll-spacer"
        style={{ height: `${((products?.length || 1) + 1) * 60}vh` }}
      ></div>

      {/* Footer 滾動空間 */}
      <div className="products-footer-spacer"></div>
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
