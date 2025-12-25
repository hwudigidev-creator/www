import { useState, useEffect, useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getAbout } from '../services/api'
import Loading from '../components/Loading'
import Footer from '../components/Footer'

function About() {
  const { data, loading, error } = useFetch(getAbout)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showFooter, setShowFooter] = useState(false)

  // 區塊數量（簡介、使命、願景）
  const totalSections = 3
  const maxIndex = totalSections - 1

  // 禁止頁面捲動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  // 下一個區塊
  const nextSection = useCallback(() => {
    if (showFooter) return
    if (activeIndex < maxIndex) {
      setActiveIndex(activeIndex + 1)
    } else {
      setShowFooter(true)
    }
  }, [activeIndex, maxIndex, showFooter])

  // 上一個區塊
  const prevSection = useCallback(() => {
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
  if (error) return <div className="error">載入關於我們資料時發生錯誤</div>

  // 區塊內容
  const sections = [
    {
      title: '關於我們',
      subtitle: '隨著時代變遷的靈活教學',
      content: data?.content,
      icon: 'fa-building'
    },
    {
      title: '我們的使命',
      subtitle: 'Our Mission',
      content: data?.mission,
      icon: 'fa-bullseye'
    },
    {
      title: '我們的願景',
      subtitle: 'Our Vision',
      content: data?.vision,
      icon: 'fa-eye'
    }
  ]

  const currentSection = sections[activeIndex]

  return (
    <div className="about no-scroll">
      {/* 上方箭頭 */}
      {(activeIndex > 0 || showFooter) && (
        <div className="cube-scroll-indicator cube-scroll-up" onClick={prevSection} style={{ cursor: 'pointer' }}>
          <div className="cube-scroll-icons">
            <span className="cube-scroll-icon">▲</span>
            <span className="cube-scroll-icon">▲</span>
          </div>
        </div>
      )}

      {/* 下方箭頭 */}
      {!showFooter && (
        <div className="cube-scroll-indicator" onClick={nextSection} style={{ cursor: 'pointer' }}>
          <div className="cube-scroll-icons">
            <span className="cube-scroll-icon">▼</span>
            <span className="cube-scroll-icon">▼</span>
          </div>
        </div>
      )}

      {/* 主要內容區 */}
      <section
        className="about-main"
        style={{
          opacity: showFooter ? 0 : 1,
          pointerEvents: showFooter ? 'none' : 'auto',
          transition: 'opacity 0.5s ease'
        }}
      >
        {/* 區塊卡片 */}
        <div className="about-section-card" key={activeIndex}>
          <div className="about-section-icon">
            <i className={`fa-solid ${currentSection.icon}`}></i>
          </div>
          <h1 className="gradient-text">{currentSection.title}</h1>
          <p className="about-section-subtitle">{currentSection.subtitle}</p>
          <div className="about-section-content">
            <p>{currentSection.content}</p>
          </div>
          {/* 指示點 */}
          <div className="about-section-dots">
            {sections.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div
        className="home-footer-wrapper"
        style={{
          opacity: showFooter ? 1 : 0,
          pointerEvents: showFooter ? 'auto' : 'none',
          transform: showFooter ? 'translateY(0)' : 'translateY(100px)',
          transition: 'all 0.5s ease'
        }}
      >
        <div className="footer-top-arrow" onClick={goToTop}>
          <div className="cube-scroll-icons">
            <span className="cube-scroll-icon">▲</span>
            <span className="cube-scroll-icon">▲</span>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default About
