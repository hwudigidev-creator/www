import { useFetch } from '../hooks/useFetch'
import { getHomeData } from '../services/api'
import Loading from '../components/Loading'
import Cube3D from '../components/Cube3D'
import { useEffect, useState } from 'react'

function Home() {
  const { data, loading, error } = useFetch(getHomeData)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      // 計算滾動進度 (0 到 1)，在第一個畫面高度內完成
      const progress = Math.min(1, scrollY / (windowHeight * 0.8))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToFeatures = (e) => {
    e.preventDefault()
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) return <Loading />
  if (error) return <div className="error">載入首頁資料時發生錯誤</div>

  const { hero, features } = data || {}

  return (
    <div className="home">
      {/* Hero Section - sticky 讓滾動時可見毛玻璃效果 */}
      <section className="hero">
        {/* 滾動時漸進毛玻璃效果 */}
        <div
          className="hero-blur-overlay"
          style={{
            opacity: scrollProgress,
            backdropFilter: `blur(${scrollProgress * 20}px)`,
            WebkitBackdropFilter: `blur(${scrollProgress * 20}px)`
          }}
        />
        <div className="hero-content">
          <h1>
            <span className="gradient-text">AI 時代的設計教育</span>
          </h1>
          <p>{hero?.subtitle || '培養數位時代的創意設計人才'}</p>
          <div className="hero-actions">
            <button onClick={scrollToFeatures} className="btn btn-outline-gradient">
              {hero?.buttonText || '探索課程'}
            </button>
          </div>
        </div>
      </section>

      {/* 3D Cube Section - 固定在底部 */}
      <Cube3D features={features} />

      {/* Footer 滾動空間 - 為 fixed cube-section 創造滾動空間 */}
      <div id="features" className="footer-spacer"></div>
    </div>
  )
}

export default Home
