import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { getHomeData } from '../services/api'
import Loading from '../components/Loading'

function Home() {
  const { data, loading, error } = useFetch(getHomeData)

  if (loading) return <Loading />
  if (error) return <div className="error">載入失頁資料時發生錯誤</div>

  const { hero, features } = data || {}

  return (
    <div className="home">
      <section className="hero">
        <h1>{hero?.title || '歡迎來到我們的官方網站'}</h1>
        <p>{hero?.subtitle || '我們致力於提供最優質的產品與服務'}</p>
        <Link to={hero?.buttonLink || '/about'} className="hero-btn">
          {hero?.buttonText || '了解更多'}
        </Link>
      </section>

      <section className="section">
        <h2 className="section-title">我們的特色</h2>
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
