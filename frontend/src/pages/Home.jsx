import { useFetch } from '../hooks/useFetch'
import { getHomeData } from '../services/api'
import Loading from '../components/Loading'
import Cube3D from '../components/Cube3D'
import Footer from '../components/Footer'
import { useEffect, useState, useCallback, useRef } from 'react'

function Home() {
  const { data, loading, error } = useFetch(getHomeData)
  const [stage, setStage] = useState(0)
  const [animProgress, setAnimProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [cardResetKey, setCardResetKey] = useState(0)
  const animationRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  const animateTo = useCallback((targetProgress, duration = 2000) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsAnimating(true)

    const startProgress = animProgress
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const t = Math.min(1, elapsed / duration)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      const newProgress = startProgress + (targetProgress - startProgress) * eased
      setAnimProgress(newProgress)

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [animProgress])

  const goNext = useCallback(() => {
    if (isAnimating) return
    if (stage === 0) {
      setStage(1)
      animateTo(1, 4000)
    }
  }, [stage, isAnimating, animateTo])

  const goPrev = useCallback(() => {
    if (isAnimating) return
    if (stage === 1) {
      setStage(0)
      setAnimProgress(0)
      setShowFooter(false)
      setCardResetKey(k => k + 1)
    }
  }, [stage, isAnimating])

  const toggleFooter = useCallback((show) => {
    setShowFooter(show)
  }, [])

  const goToTop = useCallback(() => {
    setShowFooter(false)
    setStage(0)
    setAnimProgress(0)
    setCardResetKey(k => k + 1)
  }, [])

  if (loading) return <Loading />
  if (error) return <div className="error">載入首頁資料時發生錯誤</div>

  const { hero, features } = data || {}

  return (
    <div className="home no-scroll">
      <section
        className="hero"
        style={{
          opacity: stage === 0 ? 1 : 0,
          pointerEvents: stage === 0 ? 'auto' : 'none',
          transition: 'opacity 0.8s ease'
        }}
      >
        <div className="hero-content">
          <h1>
            <span className="gradient-text">AI 時代的設計教育</span>
          </h1>
          <p>{hero?.subtitle || '培養數位時代的創意設計人才'}</p>
          <div className="hero-actions">
            <button onClick={goNext} className="btn btn-outline-gradient">
              {hero?.buttonText || '探索課程'}
            </button>
          </div>
        </div>
        <div className="scroll-indicator" onClick={goNext} style={{ cursor: 'pointer' }}>
          <div className="scroll-icons">
            <span className="scroll-icon">▼</span>
            <span className="scroll-icon">▼</span>
            <span className="scroll-icon">▼</span>
          </div>
        </div>
      </section>

      <Cube3D
        key={cardResetKey}
        features={features}
        stage={stage}
        animProgress={animProgress}
        onPrev={goPrev}
        isAnimating={isAnimating}
        showFooter={showFooter}
        onToggleFooter={toggleFooter}
      />

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

export default Home
