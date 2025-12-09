import { useEffect, useRef, useState } from 'react'

function Cube3D({ features }) {
  const containerRef = useRef(null)
  const cardsRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [cardPositions, setCardPositions] = useState([])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // 計算滾動進度 (0 到 1)
      const startPoint = windowHeight * 0.6
      const endPoint = -container.offsetHeight * 0.4

      let progress = (startPoint - rect.top) / (startPoint - endPoint)
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 計算卡片目標位置
  useEffect(() => {
    const updateCardPositions = () => {
      if (!cardsRef.current) return
      const cards = cardsRef.current.querySelectorAll('.card-target')
      const positions = Array.from(cards).map(card => {
        const rect = card.getBoundingClientRect()
        const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        }
      })
      setCardPositions(positions)
    }

    updateCardPositions()
    window.addEventListener('resize', updateCardPositions)
    return () => window.removeEventListener('resize', updateCardPositions)
  }, [features])

  // 方塊隨滾動微微轉動
  const cubeRotateX = -25 + scrollProgress * 15
  const cubeRotateY = 45 + scrollProgress * 30

  // 分解階段 (0.3 開始分解)
  const explodeProgress = Math.max(0, (scrollProgress - 0.25) / 0.5)
  const isExploding = scrollProgress > 0.25

  // 6 個面的初始位置和目標動畫
  const faces = [
    { name: 'front', rotateX: 0, rotateY: 0, translateZ: 1 },
    { name: 'back', rotateX: 0, rotateY: 180, translateZ: 1 },
    { name: 'right', rotateX: 0, rotateY: 90, translateZ: 1 },
    { name: 'left', rotateX: 0, rotateY: -90, translateZ: 1 },
    { name: 'top', rotateX: 90, rotateY: 0, translateZ: 1 },
    { name: 'bottom', rotateX: -90, rotateY: 0, translateZ: 1 }
  ]

  // 計算每個面分解後的位置
  const getFaceStyle = (index) => {
    const face = faces[index]
    const cubeSize = 125 // half of --cube-size (250px)

    // 基礎 3D 位置
    let transform = ''

    if (!isExploding || explodeProgress < 0.01) {
      // 正常方塊狀態
      switch (face.name) {
        case 'front':
          transform = `translateZ(${cubeSize}px)`
          break
        case 'back':
          transform = `rotateY(180deg) translateZ(${cubeSize}px)`
          break
        case 'right':
          transform = `rotateY(90deg) translateZ(${cubeSize}px)`
          break
        case 'left':
          transform = `rotateY(-90deg) translateZ(${cubeSize}px)`
          break
        case 'top':
          transform = `rotateX(90deg) translateZ(${cubeSize}px)`
          break
        case 'bottom':
          transform = `rotateX(-90deg) translateZ(${cubeSize}px)`
          break
      }
      return { transform, opacity: 1 }
    }

    // 分解動畫 - 面展開飛向卡片位置
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    const easedProgress = easeOutCubic(Math.min(1, explodeProgress))

    // 展開方向
    const spreadDirections = [
      { x: 0, y: -150, z: 200 },    // front -> 上
      { x: 0, y: 150, z: -200 },    // back -> 下
      { x: 250, y: -80, z: 100 },   // right -> 右上
      { x: -250, y: -80, z: 100 },  // left -> 左上
      { x: 150, y: 100, z: 150 },   // top -> 右下
      { x: -150, y: 100, z: 150 }   // bottom -> 左下
    ]

    const dir = spreadDirections[index]
    const spreadX = dir.x * easedProgress
    const spreadY = dir.y * easedProgress
    const spreadZ = dir.z * easedProgress

    // 旋轉歸零
    const faceRotateX = face.rotateX * (1 - easedProgress)
    const faceRotateY = face.rotateY * (1 - easedProgress)

    // 縮小並淡出
    const scale = 1 - easedProgress * 0.6
    const opacity = 1 - easedProgress

    transform = `
      translate3d(${spreadX}px, ${spreadY}px, ${spreadZ}px)
      rotateX(${faceRotateX}deg)
      rotateY(${faceRotateY}deg)
      scale(${scale})
    `

    return { transform, opacity }
  }

  // 卡片出現動畫
  const getCardStyle = (index) => {
    const appearProgress = Math.max(0, (scrollProgress - 0.35 - index * 0.03) / 0.4)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    const easedProgress = easeOutCubic(Math.min(1, appearProgress))

    return {
      opacity: easedProgress,
      transform: `
        translateY(${(1 - easedProgress) * 60}px)
        scale(${0.8 + easedProgress * 0.2})
      `
    }
  }

  return (
    <div className="cube-section" ref={containerRef}>
      {/* 3D 方塊 - 固定在左下井字焦點 */}
      <div className="cube-container">
        <div
          className="cube-wrapper"
          style={{
            opacity: isExploding && explodeProgress > 0.8 ? 0 : 1,
            pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto'
          }}
        >
          <div
            className="cube"
            style={{
              transform: `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg)`
            }}
          >
            {faces.map((face, index) => {
              const style = getFaceStyle(index)
              return (
                <div
                  key={face.name}
                  className={`cube-face cube-${face.name}`}
                  style={style}
                >
                  <span>?</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 展開的字卡 */}
        <div
          className="expanded-cards"
          ref={cardsRef}
          style={{
            pointerEvents: scrollProgress < 0.5 ? 'none' : 'auto'
          }}
        >
          <div className="cards-grid">
            {features?.map((feature, index) => {
              const cardStyle = getCardStyle(index)
              return (
                <div
                  key={index}
                  className="feature-card-3d card-target"
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
