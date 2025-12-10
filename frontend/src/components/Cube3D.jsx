import { useEffect, useState } from 'react'

function Cube3D({ features }) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // 第二個畫面開始計算進度
      const startScroll = windowHeight
      const endScroll = windowHeight * 3.5

      let progress = (scrollY - startScroll) / (endScroll - startScroll)
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 確保有 6 個 features
  const safeFeatures = features?.slice(0, 6) || []
  while (safeFeatures.length < 6) {
    safeFeatures.push({ icon: '?', title: '即將推出', description: '敬請期待' })
  }

  // 方塊旋轉 (0 ~ 0.3 進度)
  const rotateProgress = Math.min(1, scrollProgress / 0.3)
  const cubeRotateX = -20 + rotateProgress * 15
  const cubeRotateY = 45 + rotateProgress * 45

  // 分解進度 (0.3 ~ 0.7)
  const explodeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.4))

  // 卡片內容顯示進度 (0.6 ~ 1.0)
  const contentProgress = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.4))

  // 6個面的配置：初始角度、炸開方向、目標位置
  const faceConfigs = [
    { name: 'front',  rotateX: 0,   rotateY: 0,    explodeX: 0,    explodeY: 0,    explodeZ: 250,  gridX: 0, gridY: 0 },
    { name: 'top',    rotateX: 90,  rotateY: 0,    explodeX: 0,    explodeY: -250, explodeZ: 0,    gridX: 1, gridY: 0 },
    { name: 'right',  rotateX: 0,   rotateY: 90,   explodeX: 250,  explodeY: 0,    explodeZ: 0,    gridX: 2, gridY: 0 },
    { name: 'left',   rotateX: 0,   rotateY: -90,  explodeX: -250, explodeY: 0,    explodeZ: 0,    gridX: 0, gridY: 1 },
    { name: 'back',   rotateX: 0,   rotateY: 180,  explodeX: 0,    explodeY: 0,    explodeZ: -250, gridX: 1, gridY: 1 },
    { name: 'bottom', rotateX: -90, rotateY: 0,    explodeX: 0,    explodeY: 250,  explodeZ: 0,    gridX: 2, gridY: 1 },
  ]

  // 計算面的樣式（兩階段動畫：炸開 → 歸位）
  const getFaceCardStyle = (index) => {
    const config = faceConfigs[index]

    // 卡片尺寸和間距（正方形 300x300）
    const cardSize = 300
    const cardWidth = cardSize
    const cardHeight = cardSize
    const gap = 24
    const cubeSize = 220  // 方塊也放大

    // 目標位置（相對於中心）
    const targetX = (config.gridX - 1) * (cardWidth + gap)
    const targetY = (config.gridY - 0.5) * (cardHeight + gap)

    // 緩動函數
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    // 階段1: 炸開 (0 ~ 0.4)
    // 階段2: 歸位 (0.4 ~ 1.0)
    const explodePhase = Math.min(1, explodeProgress / 0.4)
    const settlePhase = Math.max(0, (explodeProgress - 0.4) / 0.6)

    const easedExplode = easeOutCubic(explodePhase)
    const easedSettle = easeInOutCubic(settlePhase)

    // 階段1: 沿法線方向炸開
    const explodeX = config.explodeX * easedExplode * (1 - easedSettle)
    const explodeY = config.explodeY * easedExplode * (1 - easedSettle)
    const explodeZ = config.explodeZ * easedExplode * (1 - easedSettle)

    // 階段2: 飛向目標位置
    const moveX = targetX * easedSettle
    const moveY = targetY * easedSettle

    // 合併位置
    const currentX = explodeX + moveX
    const currentY = explodeY + moveY
    const currentZ = explodeZ + (100 * Math.sin(easedSettle * Math.PI)) // 歸位時有弧線

    // 角度：階段1保持原角度，階段2漸進歸零
    const currentRotateX = config.rotateX * (1 - easedSettle)
    const currentRotateY = config.rotateY * (1 - easedSettle)

    // 尺寸：階段2才開始變大
    const scaleX = 1 + (cardWidth / cubeSize - 1) * easedSettle
    const scaleY = 1 + (cardHeight / cubeSize - 1) * easedSettle

    return {
      transform: `
        perspective(1000px)
        translate3d(${currentX}px, ${currentY}px, ${currentZ}px)
        rotateX(${currentRotateX}deg)
        rotateY(${currentRotateY}deg)
        scale(${scaleX}, ${scaleY})
      `,
      opacity: 1,
    }
  }

  return (
    <div className="cube-section">
      <div className="cube-container">
        {/* 方塊/卡片容器 */}
        <div className="cube-wrapper">
          {/* 旋轉的外層 - 分解後停止旋轉 */}
          <div
            className="cube"
            style={{
              transform: explodeProgress > 0
                ? `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg) scale(${1 - explodeProgress * 0.2})`
                : `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg)`,
              opacity: explodeProgress > 0.8 ? 1 - (explodeProgress - 0.8) * 5 : 1,
            }}
          >
            {/* 只在未分解時顯示方塊面 */}
            {explodeProgress < 0.1 && (
              <>
                <div className="cube-face cube-front"><span>?</span></div>
                <div className="cube-face cube-back"><span>?</span></div>
                <div className="cube-face cube-right"><span>?</span></div>
                <div className="cube-face cube-left"><span>?</span></div>
                <div className="cube-face cube-top"><span>?</span></div>
                <div className="cube-face cube-bottom"><span>?</span></div>
              </>
            )}
          </div>

          {/* 分解中的面/卡片 */}
          {explodeProgress >= 0.1 && (
            <div className="exploding-faces">
              {safeFeatures.map((feature, index) => {
                const style = getFaceCardStyle(index)
                return (
                  <div
                    key={index}
                    className="face-to-card"
                    style={style}
                  >
                    {/* 問號面（淡出） */}
                    <div
                      className="face-question"
                      style={{ opacity: 1 - contentProgress }}
                    >
                      <span>?</span>
                    </div>
                    {/* 卡片內容（淡入） */}
                    <div
                      className="face-content"
                      style={{ opacity: contentProgress }}
                    >
                      <div className="card-icon">{feature.icon}</div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cube3D
