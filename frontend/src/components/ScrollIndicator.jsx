import { useEffect, useRef } from 'react'

function ScrollIndicator({ showUp = true, showDown = true, onUp, onDown }) {
  const cooldownRef = useRef(false)

  useEffect(() => {
    // 只在電腦版啟用滾輪
    const isMobile = window.innerWidth <= 768

    if (isMobile) return

    const handleWheel = (e) => {
      // 防止連續觸發
      if (cooldownRef.current) return

      // 判斷滾動方向
      if (e.deltaY > 0 && showDown) {
        // 向下滾動
        onDown?.()
        cooldownRef.current = true
      } else if (e.deltaY < 0 && showUp) {
        // 向上滾動
        onUp?.()
        cooldownRef.current = true
      }

      // 冷卻時間 500ms
      if (cooldownRef.current) {
        setTimeout(() => {
          cooldownRef.current = false
        }, 500)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [showUp, showDown, onUp, onDown])

  return (
    <div className="scroll-float-tool">
      {/* UP 區塊 */}
      <div
        className={`scroll-float-section scroll-float-up ${showUp ? '' : 'hidden'}`}
        onClick={onUp}
      >
        <div className="scroll-float-icons">
          <span className="scroll-float-icon">▲</span>
          <span className="scroll-float-icon">▲</span>
        </div>
        <span className="scroll-float-text">UP</span>
      </div>

      {/* 分隔線 */}
      <div className="scroll-float-divider"></div>

      {/* DOWN 區塊 */}
      <div
        className={`scroll-float-section scroll-float-down ${showDown ? '' : 'hidden'}`}
        onClick={onDown}
      >
        <span className="scroll-float-text">DOWN</span>
        <div className="scroll-float-icons">
          <span className="scroll-float-icon">▼</span>
          <span className="scroll-float-icon">▼</span>
        </div>
      </div>
    </div>
  )
}

export default ScrollIndicator
