import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { getHomeData } from '../services/api'
import Loading from '../components/Loading'
import Cube3D from '../components/Cube3D'

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
          <h1>
            <span className="gradient-text">AI 時代的設計教育</span>
          </h1>
          <p>{hero?.subtitle || '培養數位時代的創意設計人才'}</p>
          <div className="hero-actions">
            <Link to={hero?.buttonLink || '/products'} className="btn btn-outline-gradient">
              {hero?.buttonText || '探索課程'}
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Cube + Features Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">專業領域</h2>
          <p className="section-subtitle">結合 AI 技術與創意設計，培養全方位數位設計人才</p>
        </div>
        <Cube3D features={features} />
      </section>
    </div>
  )
}

export default Home
