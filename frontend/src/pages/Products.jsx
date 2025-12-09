import { useFetch } from '../hooks/useFetch'
import { getProducts } from '../services/api'
import Loading from '../components/Loading'

function Products() {
  const { data, loading, error } = useFetch(getProducts)

  if (loading) return <Loading />
  if (error) return <div className="error">載入產品資料時發生錯誤</div>

  const { products } = data || {}

  return (
    <div className="products">
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">產品服務</h2>
          <p className="section-subtitle">探索我們精心設計的產品與服務</p>
        </div>
        <div className="products-grid">
          {products?.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  '產品圖片'
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="product-price">NT$ {product.price?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Products
