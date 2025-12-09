import { useFetch } from '../hooks/useFetch'
import { getAbout } from '../services/api'
import Loading from '../components/Loading'

function About() {
  const { data, loading, error } = useFetch(getAbout)

  if (loading) return <Loading />
  if (error) return <div className="error">載入關於我們資料時發生錯誤</div>

  return (
    <div className="about">
      <section className="section">
        <div className="about-content">
          <div className="about-text">
            <h2>{data?.title || '關於我們'}</h2>
            <p>{data?.content}</p>
            <p><strong>我們的使命：</strong>{data?.mission}</p>
            <p><strong>我們的願景：</strong>{data?.vision}</p>
          </div>
          <div className="about-image">
            公司形象圖片
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
