import { useState, useEffect, useRef } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getProducts } from '../services/api'
import Loading from '../components/Loading'

// 圖片基礎路徑
const imgBase = import.meta.env.BASE_URL + 'images/products/'

// 課程對應的示意圖片（本地）
const productImages = [
  imgBase + 'P01.webp',  // AI 創意設計
  imgBase + 'P02.webp',  // 3D 動畫
  imgBase + 'P03.webp',  // 遊戲設計
  imgBase + 'P04.webp',  // 影視特效
  imgBase + 'P05.webp',  // AR/VR
  imgBase + 'P06.webp'   // UI/UX
]

// 外層滾動背景圖
const bgImage = imgBase + 'P00.webp'

// 頁面底圖
const pageBg = imgBase + 'BG.webp'

function Products() {
  const { data, loading, error } = useFetch(getProducts)
  const [activeIndex, setActiveIndex] = useState(0)
  const [cubeRotation, setCubeRotation] = useState(60)
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
      {/* 全螢幕背景底圖 */}
      <div
        className="products-bg"
        style={{ backgroundImage: `url(${pageBg})` }}
      />

      {/* 標題區 */}
      <section className="products-hero">
        <h1 className="gradient-text">課程特色</h1>
        <p>探索數位設計系的專業課程與學習內容</p>
      </section>

      {/* 固定的展示區 */}
      <section className="products-fixed-section">
        {/* 左側：方塊與圖片區 */}
        <div className="cube-showcase">
          {/* 圖片展示區 - 雙層：外層邊緣模糊、內層中心清晰 */}
          <div className="showcase-image-container">
            {/* 清晰的底層 */}
            <img
              src={currentImage}
              alt={activeProduct?.name || '課程圖片'}
              className="showcase-image showcase-image-clear"
              key={`clear-${activeIndex}`}
            />
            {/* 外層 - 自動循環滾動背景 */}
            <div className="showcase-image-blur-wrapper">
              <img
                src={bgImage}
                alt=""
                className="showcase-image-blur-img"
              />
            </div>
          </div>

          {/* 漂浮的線框方塊 */}
          <div className="wireframe-cube-container">
            <div className="wireframe-glow"></div>
            <div
              className="wireframe-cube"
              style={{ transform: `rotateX(${cubePitch}deg) rotateY(${cubeRotation}deg)` }}
            >
              {/* 6 個濾鏡面 */}
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
