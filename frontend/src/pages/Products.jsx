import { useFetch } from '../hooks/useFetch'
import { getProducts } from '../services/api'
import Loading from '../components/Loading'

function Products() {
  const { data, loading, error } = useFetch(getProducts)

  if (loading) return <Loading />
  if (error) return <div className="error">載入課程資料時發生錯誤</div>

  const { products } = data || {}

  return (
    <div className="products">
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">課程特色</h2>
          <p className="section-subtitle">多元化的專業課程，培養數位設計全方位能力</p>
        </div>
        <div className="products-grid">
          {products?.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  '課程圖片'
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {product.price && (
                  <span className="product-price">NT$ {product.price?.toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Products
