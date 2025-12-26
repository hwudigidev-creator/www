import { useState, useEffect, useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getProducts } from '../services/api'
import Loading from '../components/Loading'
import Footer from '../components/Footer'

// 圖片基礎路徑
const imgBase = import.meta.env.BASE_URL + 'images/products/'

// 課程對應的示意影片（本地）
const productVideos = [
  imgBase + 'V01.mp4',  // AI 創意設計
  imgBase + 'V02.mp4',  // 3D 動畫
  imgBase + 'V03.mp4',  // 遊戲設計
  imgBase + 'V04.mp4',  // 影視特效
  imgBase + 'V05.mp4',  // AR/VR
  imgBase + 'V06.mp4'   // UI/UX
]

// 備用圖片（影片無法播放時使用）
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

// 每張卡片對應的固定方塊角度 [rotateY, rotateX]
const cubeAngles = [
  [60, -30],   // P01: AI 創意設計
  [150, -20],  // P02: 3D 動畫
  [240, -10],  // P03: 遊戲設計
  [330, 0],    // P04: 影視特效
  [420, 10],   // P05: AR/VR
  [510, 20],   // P06: UI/UX
]

function Products() {
  const { data, loading, error } = useFetch(getProducts)
  const [activeIndex, setActiveIndex] = useState(0)
  const [videoErrors, setVideoErrors] = useState({})
  const [showFooter, setShowFooter] = useState(false)

  const products = data?.products || []
  const maxIndex = products.length - 1

  // 根據 activeIndex 取得固定角度
  const [cubeRotation, cubePitch] = cubeAngles[activeIndex] || cubeAngles[0]

  // 禁止頁面捲動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  // 下一張卡片
  const nextCard = useCallback(() => {
    if (showFooter) return
    if (activeIndex < maxIndex) {
      setActiveIndex(activeIndex + 1)
    } else {
      setShowFooter(true)
    }
  }, [activeIndex, maxIndex, showFooter])

  // 上一張卡片
  const prevCard = useCallback(() => {
    if (showFooter) {
      setShowFooter(false)
    } else if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }, [activeIndex, showFooter])

  // 回到頂部
  const goToTop = useCallback(() => {
    setShowFooter(false)
    setActiveIndex(0)
  }, [])

  if (loading) return <Loading />
  if (error) return <div className="error">載入課程資料時發生錯誤</div>

  const activeProduct = products?.[activeIndex]
  const currentVideo = productVideos[activeIndex % productVideos.length]
  const currentImage = productImages[activeIndex % productImages.length]
  const useImage = videoErrors[activeIndex]

  // 影片載入錯誤時切換到圖片
  const handleVideoError = () => {
    setVideoErrors(prev => ({ ...prev, [activeIndex]: true }))
  }

  return (
    <div className="products no-scroll">
      {/* 全螢幕背景底圖 */}
      <div
        className="products-bg"
        style={{ backgroundImage: `url(${pageBg})` }}
      />

      {/* 標題區 */}
      <section
        className="products-hero"
        style={{
          opacity: showFooter ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}
      >
        <h1 className="gradient-text">課程特色</h1>
        <p>探索數位設計系的專業課程與學習內容</p>
      </section>

      {/* 上方箭頭 */}
      {(activeIndex > 0 || showFooter) && (
        <div className="cube-scroll-indicator cube-scroll-up" onClick={prevCard} style={{ cursor: 'pointer' }}>
          <div className="cube-scroll-icons">
            <span className="cube-scroll-icon">▲</span>
            <span className="cube-scroll-icon">▲</span>
          </div>
        </div>
      )}

      {/* 下方箭頭 */}
      {!showFooter && (
        <div className="cube-scroll-indicator" onClick={nextCard} style={{ cursor: 'pointer' }}>
          <div className="cube-scroll-icons">
            <span className="cube-scroll-icon">▼</span>
            <span className="cube-scroll-icon">▼</span>
          </div>
        </div>
      )}

      {/* 固定的展示區 */}
      <section
        className="products-fixed-section"
        style={{
          opacity: showFooter ? 0 : 1,
          pointerEvents: showFooter ? 'none' : 'auto',
          transition: 'opacity 0.5s ease'
        }}
      >
        {/* 左側：方塊與圖片區 */}
        <div className="cube-showcase">
          {/* 影片/圖片展示區 */}
          <div className="showcase-image-container">
            {/* 清晰影片或圖片 - 平躺在後面 */}
            {useImage ? (
              <img
                src={currentImage}
                alt={activeProduct?.name || '課程圖片'}
                className="showcase-image showcase-image-clear"
                key={`img-${activeIndex}`}
              />
            ) : (
              <video
                src={currentVideo}
                className="showcase-image showcase-image-clear"
                key={`video-${activeIndex}`}
                autoPlay
                loop
                muted
                playsInline
                poster={currentImage}
                onError={handleVideoError}
              />
            )}
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
              {/* 6 個濾鏡面 - 用 backdrop-filter 看後面的圖 */}
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
                    onClick={() => setActiveIndex(index)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div
        className="home-footer-wrapper"
        style={{
          visibility: showFooter ? 'visible' : 'hidden',
          pointerEvents: showFooter ? 'auto' : 'none',
          transform: showFooter ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.5s ease, visibility 0.5s'
        }}
      >
        <Footer onTop={goToTop} />
      </div>
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
