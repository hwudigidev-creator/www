import { useEffect, useState } from 'react'

function Cube3D({ features }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [focusedCardIndex, setFocusedCardIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      const startScroll = windowHeight
      const endScroll = windowHeight * 2.5

      let progress = (scrollY - startScroll) / (endScroll - startScroll)
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const safeFeatures = features?.slice(0, 6) || []
  while (safeFeatures.length < 6) {
    safeFeatures.push({ icon: 'fa-solid fa-question', title: '即將推出', description: '敬請期待' })
  }

  const rotateProgress = Math.min(1, scrollProgress / 0.3)
  const cubeRotateX = -35 + rotateProgress * 15
  const cubeRotateY = 30 + rotateProgress * 45

  const explodeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.4))

  const characterEnterProgress = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.4))
  const easeOutCubicChar = (t) => 1 - Math.pow(1 - t, 3)
  const easedCharacter = easeOutCubicChar(characterEnterProgress)

  const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768
  const cubeOffsetX = isMobileView ? 0 : easedCharacter * -150

  const contentProgress = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.4))

  const faceConfigs = [
    { name: 'front',  rotateX: 0,   rotateY: 0,    explodeX: 0,    explodeY: 0,    explodeZ: 250,  gridIndex: 0 },
    { name: 'top',    rotateX: 90,  rotateY: 0,    explodeX: 0,    explodeY: -250, explodeZ: 0,    gridIndex: 1 },
    { name: 'right',  rotateX: 0,   rotateY: 90,   explodeX: 250,  explodeY: 0,    explodeZ: 0,    gridIndex: 2 },
    { name: 'left',   rotateX: 0,   rotateY: -90,  explodeX: -250, explodeY: 0,    explodeZ: 0,    gridIndex: 3 },
    { name: 'back',   rotateX: 0,   rotateY: 180,  explodeX: 0,    explodeY: 0,    explodeZ: -250, gridIndex: 4 },
    { name: 'bottom', rotateX: -90, rotateY: 0,    explodeX: 0,    explodeY: 250,  explodeZ: 0,    gridIndex: 5 },
  ]

  const isAnimationComplete = explodeProgress >= 0.85

  useEffect(() => {
    if (!isAnimationComplete) return

    const totalCards = 6
    const windowHeight = window.innerHeight

    const cardSectionStart = windowHeight * 2.5
    const scrollPerCard = windowHeight * 0.5

    const handleScroll = () => {
      const scrollY = window.scrollY

      const relativeScroll = scrollY - cardSectionStart
      const index = Math.round(relativeScroll / scrollPerCard)
      setFocusedCardIndex(Math.min(Math.max(0, index), totalCards - 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isAnimationComplete])

  const settlePhase = Math.max(0, (explodeProgress - 0.4) / 0.6)

  const getFaceCardStyle = (index) => {
    const config = faceConfigs[index]

    const cardWidth = 280
    const cardHeight = 280
    const cubeSize = 220
    const cardGap = 32

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const explodePhase = Math.min(1, explodeProgress / 0.4)
    const easedExplode = easeOutCubic(explodePhase)

    const cardDelay = index * 0.08
    const cardSettleStart = cardDelay
    const cardSettleDuration = 0.7
    const cardSettleProgress = Math.max(0, Math.min(1, (settlePhase - cardSettleStart) / cardSettleDuration))
    const easedCardSettle = easeInOutCubic(cardSettleProgress)

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const isMobile = viewportWidth <= 768

    const mobileCardSize = 220
    const mobileCardGap = 24
    const actualCardWidth = isMobile ? mobileCardSize : cardWidth
    const actualCardGap = isMobile ? mobileCardGap : cardGap

    let targetX
    if (isMobile) {
      targetX = 0
    } else {
      const wrapperLeft = Math.max(24, (viewportWidth - 1200) / 2 + 24)
      const cardCenterX = wrapperLeft + 100 + cardWidth / 2
      const cubeX = viewportWidth / 2 + cubeOffsetX
      targetX = cardCenterX - cubeX
    }

    const targetY = index * (actualCardWidth + actualCardGap)

    const explodeX = config.explodeX * easedExplode * (1 - easedCardSettle)
    const explodeY = config.explodeY * easedExplode * (1 - easedCardSettle)
    const explodeZ = config.explodeZ * easedExplode * (1 - easedCardSettle)

    const flyX = targetX * easedCardSettle
    const flyY = targetY * easedCardSettle

    const currentX = explodeX + flyX
    const currentY = explodeY + flyY
    const currentZ = explodeZ * (1 - easedCardSettle)

    const currentRotateX = config.rotateX * (1 - easedCardSettle)
    const currentRotateY = config.rotateY * (1 - easedCardSettle)

    const targetWidth = isMobile ? mobileCardSize : cardWidth
    const targetHeight = isMobile ? mobileCardSize : cardHeight
    const currentWidth = cubeSize + (targetWidth - cubeSize) * easedCardSettle
    const currentHeight = cubeSize + (targetHeight - cubeSize) * easedCardSettle

    const borderProgress = easedCardSettle
    const r = Math.round(245 + (102 - 245) * borderProgress)
    const g = Math.round(184 + (126 - 184) * borderProgress)
    const b = Math.round(0 + (234 - 0) * borderProgress)
    const borderColor = `rgb(${r}, ${g}, ${b})`

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
      marginLeft: `${-currentWidth / 2}px`,
      marginTop: `${-currentHeight / 2}px`,
      opacity: 1,
      borderColor: borderColor,
      borderRadius: '0',
      boxShadow: `
        0 0 20px rgba(${r}, ${g}, ${b}, 0.4),
        0 0 40px rgba(${glowR}, ${glowG}, ${glowB}, 0.3),
        0 0 60px rgba(240, 147, 251, ${0.2 * borderProgress})
      `,
      _cardProgress: easedCardSettle,
    }
  }

  // 點擊箭頭滾動到下一個區域
  const scrollToNext = (e) => {
    e.preventDefault()
    const windowHeight = window.innerHeight
    window.scrollTo({ top: windowHeight * 3, behavior: 'smooth' })
  }

  // 箭頭顯示：方塊動畫開始前顯示
  const showCubeIndicator = scrollProgress < 0.3

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
      {/* 向下滾動指示器 - 金色風格 */}
      <div
        className="cube-scroll-indicator"
        style={{ opacity: showCubeIndicator ? 1 : 0, pointerEvents: showCubeIndicator ? 'auto' : 'none' }}
        onClick={scrollToNext}
      >
        <div className="cube-scroll-icons">
          <span className="cube-scroll-icon">▼</span>
          <span className="cube-scroll-icon">▼</span>
          <span className="cube-scroll-icon">▼</span>
        </div>
      </div>

      {isAnimationComplete && (
        <div className="cards-scroll-wrapper">
          <div className="cards-scroll-container">
            <div
              className="cards-scroll-track"
              style={{
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

      <div
        className={`character-image ${characterEnterProgress >= 1 ? 'entered' : ''}`}
        style={{
          opacity: easedCharacter,
          transform: characterEnterProgress < 1
            ? `translateX(${(1 - easedCharacter) * (window.innerWidth <= 768 ? 50 : 35)}%)`
            : undefined,
        }}
      >
        <img
          src="/www/images/NeroS.webp"
          alt="Nero"
          style={{
            transform: characterEnterProgress < 1
              ? `scale(${0.7 + easedCharacter * 0.5})`
              : undefined,
            transformOrigin: 'right top',
          }}
        />
      </div>

      {!isAnimationComplete && (
        <div className="cube-container" style={{ transform: `translateX(${cubeOffsetX}px)` }}>
          <div className="cube-wrapper">
            <div
              className="cube"
              style={{
                transform: explodeProgress > 0
                  ? `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg) scale(${1 - explodeProgress * 0.2})`
                  : `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg)`,
                opacity: explodeProgress > 0.8 ? 1 - (explodeProgress - 0.8) * 5 : 1,
              }}
            >
              {explodeProgress < 0.1 && (
                <>
                  <div className="home-face home-front"><span>?</span></div>
                  <div className="home-face home-back"><span>?</span></div>
                  <div className="home-face home-right"><span>?</span></div>
                  <div className="home-face home-left"><span>?</span></div>
                  <div className="home-face home-top"><span>?</span></div>
                  <div className="home-face home-bottom"><span>?</span></div>
                </>
              )}
            </div>

            {explodeProgress >= 0.1 && (
              <div className="exploding-faces" style={{ perspective: '1000px' }}>
                {safeFeatures.map((feature, index) => {
                  const styleData = getFaceCardStyle(index)
                  const cardProgress = styleData._cardProgress || 0
                  const questionOpacity = cardProgress < 0.5 ? 1 - cardProgress * 2 : 0
                  const cardContentOpacity = cardProgress > 0.3 ? Math.min(1, (cardProgress - 0.3) / 0.4) : 0
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
