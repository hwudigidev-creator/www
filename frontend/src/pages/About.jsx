import { useState, useEffect, useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getAbout } from '../services/api'
import Loading from '../components/Loading'
import Footer from '../components/Footer'
import TextRain from '../components/TextRain'

function About() {
  const { data, loading, error } = useFetch(getAbout)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showFooter, setShowFooter] = useState(false)

  // 區塊數量（簡介、使命、融合動畫、願景）
  const totalSections = 4
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

  // 融合動畫結束後自動切換下一張 (index 2 是融合卡片)
  useEffect(() => {
    if (activeIndex === 2) {
      const timer = setTimeout(() => {
        setActiveIndex(3)
      }, 3500) // 動畫約3.5秒後切換
      return () => clearTimeout(timer)
    }
  }, [activeIndex])

  if (loading) return <Loading />
  if (error) return <div className="error">載入關於我們資料時發生錯誤</div>

  // 區塊內容
  const sections = [
    {
      title: '關於數位設計',
      subtitle: 'DigiDesign',
      content: '醒吾科技大學數位設計系成立於數位內容產業蓬勃發展之際，致力於培養具備創意思維與技術能力的數位設計人才，讓學生在動畫、遊戲、互動多媒體、影視特效等領域具備專業競爭力。\n\n過去我們培養許多【T型】人材，傳統設計團隊的中流砥柱。在一個領域做到極致，具備廣泛知識協作；是團隊中穩定的執行起點。',
      icon: 'fa-building',
      bgLetter: 'T'
    },
    {
      title: '雙核驅動進化',
      subtitle: 'Our Mission',
      content: '過去，T 型人才是團隊的穩定起點；現在，隨行動媒體快速發展，我們需要的是雙核驅動的 【π型】強者。我們不只教你一項專長，而是讓你同時深耕設計與技術兩大領域。\n\n醒吾數位設計系致力於培養能獨立解決複雜問題的頂尖人才——當你需要協作時，你是核心；當你需要獨當一面時，你就是最高效的單兵戰力。',
      icon: 'fa-bullseye',
      bgLetter: 'π'
    },
    {
      type: 'fusion',
      title: '',
      subtitle: '',
      content: '',
      icon: '',
      bgLetter: ''
    },
    {
      title: '未來世代指揮官',
      subtitle: 'Our Vision',
      content: '如果說 π型 是雙核強者，那麼【H型】人才就是【AI時代】連結萬物的樞紐。\n\n在這裡，我們教你連結跨域而非僅僅跨域。你將學會一種新語言：將感性的設計美學，轉譯為理性的運算邏輯。H 型人才懂得如何與 AI 對話，讓機器成為你的手腳。你將成為人機協作的架構師，站在科技與人文的交會點，重新定義設計的邊界。',
      icon: 'fa-eye',
      bgLetter: 'H'
    }
  ]

  const currentSection = sections[activeIndex]

  return (
    <div className="about no-scroll">
      {/* 背景文字雨 */}
      <TextRain />

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

      {/* 標題區 */}
      <section
        className="page-hero"
        style={{
          opacity: showFooter ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}
      >
        <div className="page-hero-content">
          <h1 className="gradient-text">關於我們</h1>
          <p>隨著時代變遷的靈活教學</p>
        </div>
      </section>

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
        <div className={`about-section-card ${currentSection.type === 'fusion' ? 'fusion-card' : ''}`} key={activeIndex}>
          {currentSection.type === 'fusion' ? (
            <>
              {/* 融合動畫 */}
              <div className="fusion-animation">
                <span className="fusion-letter fusion-t">T</span>
                <span className="fusion-letter fusion-pi">π</span>
                <span className="fusion-letter fusion-h">H</span>
                <div className="fusion-flash"></div>
              </div>
            </>
          ) : (
            <>
              <span className="about-bg-letter" data-letter={currentSection.bgLetter}>{currentSection.bgLetter}</span>
              <div className="about-section-header">
                <div className="about-section-icon">
                  <i className={`fa-solid ${currentSection.icon}`}></i>
                </div>
                <div className="about-section-titles">
                  <h1 className="gradient-text">{currentSection.title}</h1>
                  <p className="about-section-subtitle">{currentSection.subtitle}</p>
                </div>
              </div>
              <div className="about-section-content">
                <p dangerouslySetInnerHTML={{
                  __html: currentSection.content
                    ?.replace(/\n/g, '<br/>')
                    ?.replace(/【([^】]+)】/g, '<span class="highlight-flow">【$1】</span>')
                }} />
              </div>
            </>
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

export default About
