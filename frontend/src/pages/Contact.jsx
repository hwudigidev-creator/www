import { useState } from 'react'
import { submitContact } from '../services/api'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)

    try {
      const response = await submitContact(formData)
      setResult({ success: true, message: response.message || '感謝您的留言！' })
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setResult({ success: false, message: '發送失敗，請稍後再試。' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact">
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">聯絡我們</h2>
          <p className="section-subtitle">對數位設計系有任何問題嗎？歡迎與我們聯繫</p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="請輸入您的姓名"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">電子郵件</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="請輸入您的電子郵件"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">訊息內容</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="請輸入您想詢問的問題或建議"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? '發送中...' : '發送訊息'}
          </button>
          {result && (
            <div className={`form-message ${result.success ? 'success' : 'error'}`}>
              {result.message}
            </div>
          )}
        </form>
      </section>
    </div>
  )
}

export default Contact
