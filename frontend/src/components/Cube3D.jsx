import { useState } from 'react'
import ScrollIndicator from './ScrollIndicator'

function Cube3D({ features, stage, animProgress, onPrev, isAnimating, showFooter, onToggleFooter }) {
  const [focusedCardIndex, setFocusedCardIndex] = useState(0)

  const safeFeatures = features?.slice(0, 6) || []
  while (safeFeatures.length < 6) {
    safeFeatures.push({ icon: 'fa-solid fa-question', title: '即將推出', description: '敬請期待' })
  }

  const explodeProgress = animProgress

  const characterEnterProgress = Math.max(0, Math.min(1, explodeProgress / 0.4))
  const easeOutCubicChar = (t) => 1 - Math.pow(1 - t, 3)
  const easedCharacter = easeOutCubicChar(characterEnterProgress)

  const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768
  const cubeOffsetX = isMobileView ? 0 : easedCharacter * -150

  const rotateProgress = Math.min(1, explodeProgress / 0.3)
  const cubeRotateX = -35 + rotateProgress * 15
  const cubeRotateY = 30 + rotateProgress * 45

  const faceConfigs = [
    { name: 'front',  rotateX: 0,   rotateY: 0,    explodeX: 0,    explodeY: 0,    explodeZ: 250 },
    { name: 'top',    rotateX: 90,  rotateY: 0,    explodeX: 0,    explodeY: -250, explodeZ: 0 },
    { name: 'right',  rotateX: 0,   rotateY: 90,   explodeX: 250,  explodeY: 0,    explodeZ: 0 },
    { name: 'left',   rotateX: 0,   rotateY: -90,  explodeX: -250, explodeY: 0,    explodeZ: 0 },
    { name: 'back',   rotateX: 0,   rotateY: 180,  explodeX: 0,    explodeY: 0,    explodeZ: -250 },
    { name: 'bottom', rotateX: -90, rotateY: 0,    explodeX: 0,    explodeY: 250,  explodeZ: 0 },
  ]

  const showCube = stage >= 1
  const isAnimationComplete = animProgress >= 1

  const showCubeFaces = explodeProgress < 0.1
  const showExploding = explodeProgress >= 0.1

  const settlePhase = Math.max(0, (explodeProgress - 0.4) / 0.6)

  const getCardStyle = (index) => {
    const config = faceConfigs[index]
    const cubeSize = 220
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const isMobile = viewportWidth <= 768

    const cardWidth = isMobile ? 220 : 280
    const cardHeight = isMobile ? 220 : 280
    const cardGap = isMobile ? 24 : 32

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const explodePhase = Math.min(1, explodeProgress / 0.4)
    const easedExplode = easeOutCubic(explodePhase)

    const cardDelay = index * 0.08
    const cardSettleProgress = Math.max(0, Math.min(1, (settlePhase - cardDelay) / 0.7))
    const easedCardSettle = easeInOutCubic(cardSettleProgress)

    let targetX
    if (isMobile) {
      targetX = 0
    } else {
      const wrapperLeft = Math.max(24, (viewportWidth - 1200) / 2 + 24)
      const cardCenterX = wrapperLeft + 100 + cardWidth / 2
      const cubeX = viewportWidth / 2 + cubeOffsetX
      targetX = cardCenterX - cubeX
    }

    const baseY = index * (cardHeight + cardGap)
    const scrollOffset = isAnimationComplete ? -focusedCardIndex * (cardHeight + cardGap) : 0
    const targetY = baseY + scrollOffset

    const explodeX = config.explodeX * easedExplode * (1 - easedCardSettle)
    const explodeY = config.explodeY * easedExplode * (1 - easedCardSettle)
    const explodeZ = config.explodeZ * easedExplode * (1 - easedCardSettle)

    const currentX = explodeX + targetX * easedCardSettle
    const currentY = explodeY + targetY * easedCardSettle
    const currentZ = explodeZ * (1 - easedCardSettle)

    const currentRotateX = config.rotateX * (1 - easedCardSettle)
    const currentRotateY = config.rotateY * (1 - easedCardSettle)

    const currentWidth = cubeSize + (cardWidth - cubeSize) * easedCardSettle
    const currentHeight = cubeSize + (cardHeight - cubeSize) * easedCardSettle

    const r = Math.round(245 + (102 - 245) * easedCardSettle)
    const g = Math.round(184 + (126 - 184) * easedCardSettle)
    const b = Math.round(0 + (234 - 0) * easedCardSettle)

    const glowR = Math.round(245 + (118 - 245) * easedCardSettle)
    const glowG = Math.round(184 + (75 - 184) * easedCardSettle)
    const glowB = Math.round(0 + (162 - 0) * easedCardSettle)

    const isFocused = isAnimationComplete && index === focusedCardIndex
    const focusScale = isFocused ? 1.05 : 1
    const focusGlow = isFocused ? 0.6 : 0.4

    // 動畫完成後改用 2D transform，讓 backdrop-filter 生效
    const transform = isAnimationComplete
      ? `translate(${currentX}px, ${currentY}px) scale(${focusScale})`
      : `translate3d(${currentX}px, ${currentY}px, ${currentZ}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(${focusScale})`

    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform,
      width: `${currentWidth}px`,
      height: `${currentHeight}px`,
      marginLeft: `${-currentWidth / 2}px`,
      marginTop: `${-currentHeight / 2}px`,
      borderColor: `rgb(${r}, ${g}, ${b})`,
      boxShadow: `
        0 0 20px rgba(${r}, ${g}, ${b}, ${focusGlow}),
        0 0 40px rgba(${glowR}, ${glowG}, ${glowB}, ${focusGlow * 0.75}),
        0 0 60px rgba(240, 147, 251, ${0.2 * easedCardSettle})
      `,
      transition: isAnimationComplete ? 'transform 0.4s ease-out, box-shadow 0.3s ease' : 'none',
      zIndex: isFocused ? 10 : 1,
      cursor: isAnimationComplete ? 'pointer' : 'default',
      _progress: easedCardSettle,
    }
  }

  const nextCard = () => {
    if (focusedCardIndex < 5) {
      setFocusedCardIndex(focusedCardIndex + 1)
      onToggleFooter?.(false)
    } else {
      onToggleFooter?.(true)
    }
  }
  const prevCard = () => {
    if (showFooter) {
      onToggleFooter?.(false)
    } else if (focusedCardIndex > 0) {
      setFocusedCardIndex(focusedCardIndex - 1)
    } else {
      onPrev?.()
    }
  }

  if (!showCube) return null

  return (
    <div className="cube-section" style={{ opacity: 1 }}>
      {/* 浮動翻頁工具 */}
      {isAnimationComplete && !isAnimating && (
        <ScrollIndicator
          showUp={true}
          showDown={!showFooter}
          onUp={prevCard}
          onDown={nextCard}
        />
      )}

      <div
        className={`character-image ${characterEnterProgress >= 1 ? 'entered' : ''}`}
        style={{
          opacity: easedCharacter,
          transform: characterEnterProgress < 1
            ? `translateX(${(1 - easedCharacter) * (isMobileView ? 50 : 35)}%)`
            : undefined,
        }}
      >
        <img
          src="/www/images/NeroS.webp"
          alt="Nero"
          style={{
            transform: characterEnterProgress < 1 ? `scale(${0.7 + easedCharacter * 0.5})` : undefined,
            transformOrigin: 'right top',
          }}
        />
      </div>

      <div className="cube-container" style={{ transform: `translateX(${cubeOffsetX}px)` }}>
        <div className={`cube-wrapper ${isAnimationComplete ? 'settled' : ''}`}>
          <div
            className="cube"
            style={{
              transform: `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg) scale(${1 - explodeProgress * 0.2})`,
              opacity: explodeProgress > 0.8 ? 1 - (explodeProgress - 0.8) * 5 : 1,
            }}
          >
            {showCubeFaces && (
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

          {showExploding && (
            <div
              className={`exploding-faces ${isAnimationComplete ? 'settled' : ''}`}
              style={isAnimationComplete ? {} : { perspective: '1000px' }}
            >
              {safeFeatures.map((feature, index) => {
                const styleData = getCardStyle(index)
                const progress = styleData._progress || 0
                const questionOpacity = progress < 0.5 ? 1 - progress * 2 : 0
                const contentOpacity = progress > 0.3 ? Math.min(1, (progress - 0.3) / 0.4) : 0
                const { _progress, ...style } = styleData
                return (
                  <div
                    key={index}
                    className="face-to-card"
                    style={style}
                    onClick={isAnimationComplete ? () => setFocusedCardIndex(index) : undefined}
                  >
                    {questionOpacity > 0 && (
                      <div className="face-question" style={{ opacity: questionOpacity }}>
                        <span>?</span>
                      </div>
                    )}
                    <div className="face-content" style={{ opacity: contentOpacity }}>
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
    </div>
  )
}

export default Cube3D
