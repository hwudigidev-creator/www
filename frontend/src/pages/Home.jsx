import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { getHomeData } from '../services/api'
import Loading from '../components/Loading'

function Home() {
  const { data, loading, error } = useFetch(getHomeData)

  if (loading) return <Loading />
  if (error) return <div className="error">載入首頁資料時發生錯誤</div>

  const { hero, features } = data || {}

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨</span>
            <span>全新上線</span>
          </div>
          <h1>
            {hero?.title || '歡迎來到'}
            <br />
            <span>我們的官方網站</span>
          </h1>
          <p>{hero?.subtitle || '我們致力於提供最優質的產品與服務，讓您的生活更加美好。探索我們的解決方案，開啟嶄新的可能。'}</p>
          <div className="hero-actions">
            <Link to={hero?.buttonLink || '/products'} className="btn btn-primary">
              {hero?.buttonText || '探索產品'}
            </Link>
            <Link to="/about" className="btn btn-secondary">
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">為什麼選擇我們</h2>
          <p className="section-subtitle">我們提供全方位的解決方案，滿足您的各種需求</p>
        </div>
        <div className="features-grid">
          {features?.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
