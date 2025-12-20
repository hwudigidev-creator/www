import { useEffect, useState } from 'react'

function Cube3D({ features }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [focusedCardIndex, setFocusedCardIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // 第二個畫面開始計算進度
      const startScroll = windowHeight
      const endScroll = windowHeight * 2.5 // 縮短動畫時間

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
    safeFeatures.push({ icon: 'fa-solid fa-question', title: '即將推出', description: '敬請期待' })
  }

  // 方塊旋轉 (0 ~ 0.3 進度)
  const rotateProgress = Math.min(1, scrollProgress / 0.3)
  const cubeRotateX = -35 + rotateProgress * 15 // X軸預設多轉15度
  const cubeRotateY = 30 + rotateProgress * 45 // Y軸預設30度

  // 分解進度 (0.3 ~ 0.7)
  const explodeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.4))

  // 角色圖滑入進度 (0.1 ~ 0.5) - 在方塊開始炸開時進入
  const characterEnterProgress = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.4))
  const easeOutCubicChar = (t) => 1 - Math.pow(1 - t, 3)
  const easedCharacter = easeOutCubicChar(characterEnterProgress)

  // 方塊往左移動的偏移量（隨角色圖滑入而移動）
  // 手機版不位移，桌面版往左移 150px
  const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768
  const cubeOffsetX = isMobileView ? 0 : easedCharacter * -150

  // 卡片內容顯示進度 (0.6 ~ 1.0)
  const contentProgress = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.4))

  // 6個面的配置：初始角度、炸開方向、目標位置（一橫排）
  const faceConfigs = [
    { name: 'front',  rotateX: 0,   rotateY: 0,    explodeX: 0,    explodeY: 0,    explodeZ: 250,  gridIndex: 0 },
    { name: 'top',    rotateX: 90,  rotateY: 0,    explodeX: 0,    explodeY: -250, explodeZ: 0,    gridIndex: 1 },
    { name: 'right',  rotateX: 0,   rotateY: 90,   explodeX: 250,  explodeY: 0,    explodeZ: 0,    gridIndex: 2 },
    { name: 'left',   rotateX: 0,   rotateY: -90,  explodeX: -250, explodeY: 0,    explodeZ: 0,    gridIndex: 3 },
    { name: 'back',   rotateX: 0,   rotateY: 180,  explodeX: 0,    explodeY: 0,    explodeZ: -250, gridIndex: 4 },
    { name: 'bottom', rotateX: -90, rotateY: 0,    explodeX: 0,    explodeY: 250,  explodeZ: 0,    gridIndex: 5 },
  ]

  // 判斷動畫是否完成（可以切換到捲動模式）- 提早完成讓 Footer 更快出現
  const isAnimationComplete = explodeProgress >= 0.85

  // 垂直捲動 - 用外層頁面滾動統一控制卡片聚焦
  useEffect(() => {
    if (!isAnimationComplete) return

    const totalCards = 6
    const windowHeight = window.innerHeight

    // 動畫完成時的頁面滾動位置（約 windowHeight * 2.5）
    const cardSectionStart = windowHeight * 2.5
    // 每張卡片切換所需的滾動距離（約半個畫面高度，讓用戶有足夠時間瀏覽）
    const scrollPerCard = windowHeight * 0.5

    const handleScroll = () => {
      const scrollY = window.scrollY

      // 計算在卡片區域內的相對位置
      const relativeScroll = scrollY - cardSectionStart
      // 根據滾動位置計算聚焦的卡片索引
      const index = Math.round(relativeScroll / scrollPerCard)
      setFocusedCardIndex(Math.min(Math.max(0, index), totalCards - 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始檢查

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isAnimationComplete])

  // 歸位階段進度
  const settlePhase = Math.max(0, (explodeProgress - 0.4) / 0.6)

  // 計算面的樣式（兩階段動畫：炸開 → 一張一張飛向左側）
  const getFaceCardStyle = (index) => {
    const config = faceConfigs[index]

    // 卡片尺寸和間距
    const cardWidth = 280
    const cardHeight = 280
    const cubeSize = 220
    const cardGap = 32

    // 緩動函數
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    // 階段1: 炸開 (0 ~ 0.4)
    // 階段2: 一張一張飛向左側 (0.4 ~ 1.0)
    const explodePhase = Math.min(1, explodeProgress / 0.4)
    const easedExplode = easeOutCubic(explodePhase)

    // 每張卡片有不同的飛行時機（錯開延遲）
    const cardDelay = index * 0.08 // 每張卡片延遲（縮短讓整體更緊湊）
    const cardSettleStart = cardDelay
    const cardSettleDuration = 0.7 // 每張卡片飛行時間（加長讓速度變慢）
    const cardSettleProgress = Math.max(0, Math.min(1, (settlePhase - cardSettleStart) / cardSettleDuration))
    const easedCardSettle = easeInOutCubic(cardSettleProgress)

    // 計算目標位置（依序垂直排列）
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const isMobile = viewportWidth <= 768

    // 手機版：卡片尺寸較小
    const mobileCardSize = 220
    const mobileCardGap = 24
    const actualCardWidth = isMobile ? mobileCardSize : cardWidth
    const actualCardGap = isMobile ? mobileCardGap : cardGap

    // X 位置計算
    // 注意：方塊會因為角色圖滑入而往左移 cubeOffsetX，飛行目標要考慮這個
    let targetX
    if (isMobile) {
      // 手機版：卡片置中，targetX = 0（方塊本來就在中央）
      targetX = 0
    } else {
      // 桌面版：左側欄位
      // wrapper left = (100vw - 1200) / 2 + 24
      // container margin-left: -100px
      // track padding-left: 200px
      // 卡片左邊緣 = wrapperLeft - 100 + 200 = wrapperLeft + 100
      // 卡片中心 = wrapperLeft + 100 + cardWidth/2
      const wrapperLeft = Math.max(24, (viewportWidth - 1200) / 2 + 24)
      const cardCenterX = wrapperLeft + 100 + cardWidth / 2
      // 方塊中心位置（已經被推向左邊）
      const cubeX = viewportWidth / 2 + cubeOffsetX
      targetX = cardCenterX - cubeX
    }

    // 垂直位置：對齊捲動列表
    // 第一張卡片在視窗中央，後續依序向下
    const targetY = index * (actualCardWidth + actualCardGap)

    // 階段1: 沿法線方向炸開
    const explodeX = config.explodeX * easedExplode * (1 - easedCardSettle)
    const explodeY = config.explodeY * easedExplode * (1 - easedCardSettle)
    const explodeZ = config.explodeZ * easedExplode * (1 - easedCardSettle)

    // 飛向目標位置
    const flyX = targetX * easedCardSettle
    const flyY = targetY * easedCardSettle

    // 合併位置
    const currentX = explodeX + flyX
    const currentY = explodeY + flyY
    const currentZ = explodeZ * (1 - easedCardSettle) // Z 軸歸零

    // 角度：漸進歸零
    const currentRotateX = config.rotateX * (1 - easedCardSettle)
    const currentRotateY = config.rotateY * (1 - easedCardSettle)

    // 尺寸：飛行時變大（用實際尺寸而非 scale，避免切換時跳動）
    // 手機版目標尺寸較小
    const targetWidth = isMobile ? mobileCardSize : cardWidth
    const targetHeight = isMobile ? mobileCardSize : cardHeight
    const currentWidth = cubeSize + (targetWidth - cubeSize) * easedCardSettle
    const currentHeight = cubeSize + (targetHeight - cubeSize) * easedCardSettle

    // 邊框顏色漸變：金色 → 藍紫色
    const borderProgress = easedCardSettle
    const r = Math.round(245 + (102 - 245) * borderProgress)
    const g = Math.round(184 + (126 - 184) * borderProgress)
    const b = Math.round(0 + (234 - 0) * borderProgress)
    const borderColor = `rgb(${r}, ${g}, ${b})`

    // 發光效果顏色也漸變
    const glowR = Math.round(245 + (118 - 245) * borderProgress)
    const glowG = Math.round(184 + (75 - 184) * borderProgress)
    const glowB = Math.round(0 + (162 - 0) * borderProgress)

    return {
      transform: `
        translate3d(${currentX}px, ${currentY}px, ${currentZ}px)
        rotateX(${currentRotateX}deg)
        rotateY(${currentRotateY}deg)
      `,
      width: `${currentWidth}px`,
      height: `${currentHeight}px`,
      marginLeft: `${-currentWidth / 2}px`, // 置中調整
      marginTop: `${-currentHeight / 2}px`,
      opacity: 1,
      borderColor: borderColor,
      borderRadius: '0', // 無圓角配合方塊
      boxShadow: `
        0 0 20px rgba(${r}, ${g}, ${b}, 0.4),
        0 0 40px rgba(${glowR}, ${glowG}, ${glowB}, 0.3),
        0 0 60px rgba(240, 147, 251, ${0.2 * borderProgress})
      `,
      // 傳遞卡片飛行進度供問號/內容透明度使用
      _cardProgress: easedCardSettle,
    }
  }

  // 完成狀態下的卡片樣式 - 無圓角配合方塊
  const getCompletedCardStyle = (index) => {
    const isFocused = index === focusedCardIndex
    return {
      borderColor: 'rgb(102, 126, 234)',
      borderRadius: '0',
      transform: isFocused ? 'scale(1.05)' : 'scale(1)',
      boxShadow: isFocused
        ? `
          0 0 30px rgba(102, 126, 234, 0.6),
          0 0 60px rgba(118, 75, 162, 0.5),
          0 0 90px rgba(240, 147, 251, 0.4)
        `
        : `
          0 0 20px rgba(102, 126, 234, 0.4),
          0 0 40px rgba(118, 75, 162, 0.3),
          0 0 60px rgba(240, 147, 251, 0.2)
        `,
      zIndex: isFocused ? 10 : 1,
    }
  }

  return (
    <div className="cube-section">
      {/* 動畫完成後：卡片列表（由外層頁面滾動控制） */}
      {isAnimationComplete && (
        <div className="cards-scroll-wrapper">
          <div className="cards-scroll-container">
            <div
              className="cards-scroll-track"
              style={{
                // 根據 focusedCardIndex 移動軌道，讓聚焦的卡片對齊中央
                transform: `translateY(${-focusedCardIndex * (window.innerWidth <= 768 ? (220 + 24) : (280 + 32))}px)`,
                transition: 'transform 0.4s ease-out',
              }}
            >
              {safeFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`scroll-card ${index === focusedCardIndex ? 'focused' : ''}`}
                  style={getCompletedCardStyle(index)}
                >
                  <i className={`card-icon ${feature.icon}`}></i>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 角色圖 - 從右側滑入，進場完成後加漂浮動畫 */}
      <div
        className={`character-image ${characterEnterProgress >= 1 ? 'entered' : ''}`}
        style={{
          opacity: easedCharacter,
          // 手機版從畫面外起始（50%），桌面版維持 35%
          // 進場完成後不設定 transform，讓 CSS 動畫接管
          transform: characterEnterProgress < 1
            ? `translateX(${(1 - easedCharacter) * (window.innerWidth <= 768 ? 50 : 35)}%)`
            : undefined,
        }}
      >
        <img
          src="/www/images/NeroS.webp"
          alt="Nero"
          style={{
            // 進場完成後不設定 transform，讓 CSS 動畫接管
            transform: characterEnterProgress < 1
              ? `scale(${0.7 + easedCharacter * 0.5})`
              : undefined,
            transformOrigin: 'right top',
          }}
        />
      </div>

      {/* 方塊和炸開動畫 */}
      {!isAnimationComplete && (
        <div className="cube-container" style={{ transform: `translateX(${cubeOffsetX}px)` }}>
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

            {/* 動畫中的卡片（炸開效果） */}
            {explodeProgress >= 0.1 && (
              <div className="exploding-faces" style={{ perspective: '1000px' }}>
                {safeFeatures.map((feature, index) => {
                  const styleData = getFaceCardStyle(index)
                  const cardProgress = styleData._cardProgress || 0
                  // 每張卡片各自的問號/內容透明度（基於各自的飛行進度）
                  const questionOpacity = cardProgress < 0.5 ? 1 - cardProgress * 2 : 0
                  const cardContentOpacity = cardProgress > 0.3 ? Math.min(1, (cardProgress - 0.3) / 0.4) : 0
                  // 移除內部屬性，避免傳遞給 DOM
                  const { _cardProgress, ...style } = styleData
                  return (
                    <div
                      key={index}
                      className="face-to-card"
                      style={style}
                    >
                      {questionOpacity > 0 && (
                        <div className="face-question" style={{ opacity: questionOpacity }}>
                          <span>?</span>
                        </div>
                      )}
                      <div className="face-content" style={{ opacity: cardContentOpacity }}>
                        <i className={`card-icon ${feature.icon}`}></i>
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
      )}
    </div>
  )
}

export default Cube3D
