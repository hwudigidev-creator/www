import { useState, useRef, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getAbout } from '../services/api'
import Loading from '../components/Loading'

function About() {
  const { data, loading, error } = useFetch(getAbout)
  const [contentOffset, setContentOffset] = useState(0)
  const contentRef = useRef(null)

  // 用外層頁面滾動控制內容位置（同聯絡頁）
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // 可視區域高度（扣除 header + 標題區）
      const isMobile = window.innerWidth <= 768
      const visibleHeight = windowHeight - (isMobile ? 140 : 180)

      // 內容實際高度
      const contentHeight = contentRef.current?.scrollHeight || 800

      // 內容可以移動的最大距離
      const maxOffset = Math.max(0, contentHeight - visibleHeight + 100)

      // 根據頁面滾動計算內容移動量（限制在 0 到 maxOffset 之間）
      const offset = Math.min(scrollY, maxOffset)
      setContentOffset(offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    // 延遲執行一次，確保內容已渲染
    setTimeout(handleScroll, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [data])

  if (loading) return <Loading />
  if (error) return <div className="error">載入關於我們資料時發生錯誤</div>

  return (
    <div className="about">
      {/* 第一區塊：標題區 - FIXED 不動 */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="gradient-text">{data?.title || '關於我們'}</h1>
          <p>隨著時代變遷的靈活教學</p>
        </div>
      </section>

      {/* 第二區塊：內容區 - FIXED 在底部，由外層滾動控制 */}
      <section className="about-content-section">
        <div
          className="about-content-wrapper"
          style={{
            transform: `translateY(${-contentOffset}px)`,
          }}
        >
          <div className="about-content-scroll" ref={contentRef}>
            <div className="about-card">
              <div className="about-text">
                <p>{data?.content}</p>
                <div className="about-block">
                  <h3>我們的使命</h3>
                  <p>{data?.mission}</p>
                </div>
                <div className="about-block">
                  <h3>我們的願景</h3>
                  <p>{data?.vision}</p>
                </div>
              </div>
              <div className="about-image">
                公司形象圖片
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer 滾動空間 - 讓 Footer 可以上浮 */}
      <div className="about-footer-spacer"></div>
    </div>
  )
}

export default About
