import { useEffect, useRef, useState } from 'react'

function Cube3D({ features }) {
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // 計算滾動進度 (0 到 1)
      const startPoint = windowHeight * 0.5
      const endPoint = -container.offsetHeight * 0.5

      let progress = (startPoint - rect.top) / (startPoint - endPoint)
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 方塊效果 - 固定角度，滾動時拆解
  const cubeOpacity = 1 - scrollProgress * 2
  const cubeScale = 1 - scrollProgress * 0.3

  // 卡片展開 - 從方塊位置展開到網格
  const cardsOpacity = Math.max(0, (scrollProgress - 0.3) * 2)
  const cardsVisible = scrollProgress > 0.2

  // 計算每張卡片從方塊中心飛出的位置
  const getCardTransform = (index) => {
    if (scrollProgress < 0.3) {
      // 卡片聚集在方塊位置
      return {
        transform: 'scale(0.1) rotateY(45deg)',
        opacity: 0
      }
    }

    const expandProgress = Math.min(1, (scrollProgress - 0.3) / 0.5)
    const finalOpacity = Math.min(1, expandProgress * 1.5)

    return {
      transform: `scale(${0.1 + expandProgress * 0.9}) rotateY(${45 - expandProgress * 45}deg)`,
      opacity: finalOpacity,
      transitionDelay: `${index * 0.08}s`
    }
  }

  return (
    <div className="cube-section" ref={containerRef}>
      {/* 3D 方塊 - 固定在左下井字焦點 */}
      <div className="cube-container">
        <div
          className="cube-wrapper"
          style={{
            opacity: Math.max(0, cubeOpacity),
            transform: `scale(${cubeScale})`,
            pointerEvents: scrollProgress > 0.3 ? 'none' : 'auto'
          }}
        >
          <div className="cube">
            <div className="cube-face cube-front">
              <span>?</span>
            </div>
            <div className="cube-face cube-back">
              <span>?</span>
            </div>
            <div className="cube-face cube-right">
              <span>?</span>
            </div>
            <div className="cube-face cube-left">
              <span>?</span>
            </div>
            <div className="cube-face cube-top">
              <span>?</span>
            </div>
            <div className="cube-face cube-bottom">
              <span>?</span>
            </div>
          </div>
        </div>

        {/* 展開的字卡 */}
        <div
          className="expanded-cards"
          style={{
            opacity: cardsOpacity,
            pointerEvents: scrollProgress < 0.4 ? 'none' : 'auto',
            visibility: cardsVisible ? 'visible' : 'hidden'
          }}
        >
          <div className="cards-grid">
            {features?.map((feature, index) => {
              const cardStyle = getCardTransform(index)
              return (
                <div
                  key={index}
                  className="feature-card-3d"
                  style={cardStyle}
                >
                  <div className="card-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cube3D
