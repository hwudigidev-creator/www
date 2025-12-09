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
            <span>AI 時代的設計教育</span>
          </div>
          <h1>
            {hero?.title || '醒吾科技大學'}
            <br />
            <span>數位設計系</span>
          </h1>
          <p>{hero?.subtitle || '培養數位時代的創意設計人才'}</p>
          <div className="hero-actions">
            <Link to={hero?.buttonLink || '/products'} className="btn btn-primary">
              {hero?.buttonText || '探索課程'}
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
          <h2 className="section-title">專業領域</h2>
          <p className="section-subtitle">結合 AI 技術與創意設計，培養全方位數位設計人才</p>
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
