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
      const startPoint = windowHeight * 0.8
      const endPoint = -container.offsetHeight * 0.3

      let progress = (startPoint - rect.top) / (startPoint - endPoint)
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 方塊旋轉角度
  const cubeRotateX = scrollProgress * 360
  const cubeRotateY = scrollProgress * 720
  const cubeScale = 1 - scrollProgress * 0.5
  const cubeOpacity = 1 - scrollProgress

  // 卡片展開
  const cardsOpacity = scrollProgress
  const cardsScale = 0.8 + scrollProgress * 0.2

  return (
    <div className="cube-section" ref={containerRef}>
      {/* 3D 方塊 */}
      <div
        className="cube-container"
        style={{
          opacity: cubeOpacity,
          transform: `scale(${cubeScale})`,
          pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto'
        }}
      >
        <div
          className="cube"
          style={{
            transform: `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg)`
          }}
        >
          <div className="cube-face cube-front">
            <span>AI</span>
          </div>
          <div className="cube-face cube-back">
            <span>VFX</span>
          </div>
          <div className="cube-face cube-right">
            <span>Game</span>
          </div>
          <div className="cube-face cube-left">
            <span>Anim</span>
          </div>
          <div className="cube-face cube-top">
            <span>XR</span>
          </div>
          <div className="cube-face cube-bottom">
            <span>Flow</span>
          </div>
        </div>
      </div>

      {/* 展開的字卡 */}
      <div
        className="expanded-cards"
        style={{
          opacity: cardsOpacity,
          transform: `scale(${cardsScale})`,
          pointerEvents: scrollProgress < 0.5 ? 'none' : 'auto'
        }}
      >
        <div className="cards-grid">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="feature-card-3d"
              style={{
                transitionDelay: `${index * 0.1}s`,
                transform: scrollProgress > 0.3
                  ? 'translateY(0) rotateX(0)'
                  : 'translateY(50px) rotateX(-15deg)',
                opacity: scrollProgress > 0.3 ? 1 : 0
              }}
            >
              <div className="card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cube3D
