import { useState, useRef, useEffect } from 'react'
import { submitContact } from '../services/api'
import contactOptions from '../data/contactOptions.json'
import hslist from '../data/hslist.json'
import departmentList from '../data/departments.json'

function Contact() {
  const [formData, setFormData] = useState({
    school: '',
    department: '',
    name: '',
    phone: '',
    email: '',
    careerIndex: 0,
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [schoolInput, setSchoolInput] = useState('')
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [deptInput, setDeptInput] = useState('')
  const [showDeptDropdown, setShowDeptDropdown] = useState(false)
  const [formOffset, setFormOffset] = useState(0)
  const schoolInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const deptInputRef = useRef(null)
  const deptDropdownRef = useRef(null)
  const formRef = useRef(null)

  const { careerTypes } = contactOptions
  // 使用 hslist.json 的學校清單，排除第一項（請輸入或選擇學校）
  const schools = hslist.filter(s => s.value !== '-1')

  // 過濾符合的學校選項
  const filteredSchools = schools.filter(school =>
    school.label.toLowerCase().includes(schoolInput.toLowerCase())
  )

  // 過濾符合的科別選項
  const filteredDepts = departmentList.filter(dept =>
    dept.label.toLowerCase().includes(deptInput.toLowerCase())
  )

  // 用外層頁面滾動控制表單位置（同首頁卡片）
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // 可視區域高度（扣除 header + 標題區）
      const isMobile = window.innerWidth <= 768
      const visibleHeight = windowHeight - (isMobile ? 140 : 180)

      // 表單實際高度
      const formHeight = formRef.current?.scrollHeight || 800

      // 表單可以移動的最大距離
      const maxOffset = Math.max(0, formHeight - visibleHeight + 100)

      // 根據頁面滾動計算表單移動量（限制在 0 到 maxOffset 之間）
      const offset = Math.min(scrollY, maxOffset)
      setFormOffset(offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    // 延遲執行一次，確保表單已渲染
    setTimeout(handleScroll, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          schoolInputRef.current && !schoolInputRef.current.contains(e.target)) {
        setShowSchoolDropdown(false)
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(e.target) &&
          deptInputRef.current && !deptInputRef.current.contains(e.target)) {
        setShowDeptDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 驗證手機格式 (台灣手機 09xx-xxx-xxx)
  const validatePhone = (phone) => {
    const phoneRegex = /^09\d{8}$/
    return phoneRegex.test(phone.replace(/-/g, ''))
  }

  // 驗證 Email 格式
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 選擇學校
  const handleSchoolSelect = (school) => {
    setFormData(prev => ({ ...prev, school: school.value }))
    setSchoolInput(school.label)
    setShowSchoolDropdown(false)
    if (errors.school) {
      setErrors(prev => ({ ...prev, school: '' }))
    }
  }

  // 學校輸入變更
  const handleSchoolInputChange = (e) => {
    const value = e.target.value
    setSchoolInput(value)
    setShowSchoolDropdown(true)
    const exactMatch = schools.find(s => s.label === value)
    if (exactMatch) {
      setFormData(prev => ({ ...prev, school: exactMatch.value }))
    } else {
      setFormData(prev => ({ ...prev, school: value }))
    }
    if (errors.school) {
      setErrors(prev => ({ ...prev, school: '' }))
    }
  }

  // 選擇科別
  const handleDeptSelect = (dept) => {
    setFormData(prev => ({ ...prev, department: dept.value }))
    setDeptInput(dept.label)
    setShowDeptDropdown(false)
    if (errors.department) {
      setErrors(prev => ({ ...prev, department: '' }))
    }
  }

  // 科別輸入變更
  const handleDeptInputChange = (e) => {
    const value = e.target.value
    setDeptInput(value)
    setShowDeptDropdown(true)
    const exactMatch = departmentList.find(d => d.label === value)
    if (exactMatch) {
      setFormData(prev => ({ ...prev, department: exactMatch.value }))
    } else {
      setFormData(prev => ({ ...prev, department: value }))
    }
    if (errors.department) {
      setErrors(prev => ({ ...prev, department: '' }))
    }
  }

  // 驗證表單
  const validateForm = () => {
    const newErrors = {}

    if (!schoolInput.trim()) {
      newErrors.school = '請輸入或選擇學校'
    }
    if (!deptInput.trim()) {
      newErrors.department = '請輸入或選擇科別'
    }
    if (!formData.name.trim()) {
      newErrors.name = '請輸入姓名'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入手機號碼'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '手機格式不正確 (例：0912345678)'
    }
    if (!formData.email.trim()) {
      newErrors.email = '請輸入電子郵件'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '電子郵件格式不正確'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // 左右箭頭切換職涯類型
  const handleCareerChange = (direction) => {
    setFormData(prev => {
      let newIndex = prev.careerIndex + direction
      if (newIndex < 0) newIndex = careerTypes.length - 1
      if (newIndex >= careerTypes.length) newIndex = 0
      return { ...prev, careerIndex: newIndex }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setResult(null)

    try {
      const submitData = {
        ...formData,
        school: schoolInput,  // 使用顯示的學校名稱
        department: deptInput,  // 使用顯示的科別名稱
        career: careerTypes[formData.careerIndex].label,
        careerDescription: careerTypes[formData.careerIndex].description
      }
      const response = await submitContact(submitData)
      setResult({ success: true, message: response.message || '感謝您的留言！' })
      setFormData({
        school: '',
        department: '',
        name: '',
        phone: '',
        email: '',
        careerIndex: 0,
        message: ''
      })
      setSchoolInput('')
      setDeptInput('')
      setErrors({})
    } catch (error) {
      setResult({ success: false, message: '發送失敗，請稍後再試。' })
    } finally {
      setSubmitting(false)
    }
  }

  const currentCareer = careerTypes[formData.careerIndex]

  return (
    <div className="contact">
      {/* 第一區塊：標題區 - FIXED 不動 */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="gradient-text">聯絡我們</h1>
          <p>對數位設計系或AI工作流有興趣，或任何想了解的？</p>
        </div>
      </section>

      {/* 第二區塊：表單區 - FIXED 在底部，由外層滾動控制 */}
      <section className="contact-form-section">
        <div
          className="contact-form-wrapper"
          style={{
            transform: `translateY(${-formOffset}px)`,
          }}
        >
          <div className="contact-form-scroll" ref={formRef}>
            <form className="contact-form" onSubmit={handleSubmit}>
              {/* 校名 + 科別 並列 */}
              <div className="form-row">
                {/* 校名 - 可搜尋輸入 */}
                <div className="form-group">
                  <label htmlFor="school">校名 <span className="required">*</span></label>
                  <div className="autocomplete-wrapper">
                    <input
                      ref={schoolInputRef}
                      type="text"
                      id="school"
                      name="school"
                      value={schoolInput}
                      onChange={handleSchoolInputChange}
                      onFocus={() => setShowSchoolDropdown(true)}
                      placeholder="輸入或選擇學校"
                      className={errors.school ? 'error' : ''}
                      autoComplete="off"
                    />
                    {showSchoolDropdown && filteredSchools.length > 0 && (
                      <ul className="autocomplete-dropdown" ref={dropdownRef}>
                        {filteredSchools.map(school => (
                          <li
                            key={school.value}
                            onClick={() => handleSchoolSelect(school)}
                            className={formData.school === school.value ? 'selected' : ''}
                          >
                            {school.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {errors.school && <span className="error-message">{errors.school}</span>}
                </div>

                {/* 科別 - 可搜尋輸入 */}
                <div className="form-group">
                  <label htmlFor="department">科別 <span className="required">*</span></label>
                  <div className="autocomplete-wrapper">
                    <input
                      ref={deptInputRef}
                      type="text"
                      id="department"
                      name="department"
                      value={deptInput}
                      onChange={handleDeptInputChange}
                      onFocus={() => setShowDeptDropdown(true)}
                      placeholder="輸入或選擇科別"
                      className={errors.department ? 'error' : ''}
                      autoComplete="off"
                    />
                    {showDeptDropdown && filteredDepts.length > 0 && (
                      <ul className="autocomplete-dropdown" ref={deptDropdownRef}>
                        {filteredDepts.map(dept => (
                          <li
                            key={dept.value}
                            onClick={() => handleDeptSelect(dept)}
                            className={formData.department === dept.value ? 'selected' : ''}
                          >
                            {dept.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {errors.department && <span className="error-message">{errors.department}</span>}
                </div>
              </div>

              {/* 姓名 + 手機 並列 */}
              <div className="form-row">
                {/* 姓名 */}
                <div className="form-group">
                  <label htmlFor="name">姓名 <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="請輸入您的姓名"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* 手機 */}
                <div className="form-group">
                  <label htmlFor="phone">手機 <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="例：0912345678"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="請輸入您的電子郵件"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* 你想成為 + 留言 並排 */}
              <div className="form-row career-message-row">
                {/* 你想成為 - 左右箭頭切換 */}
                <div className="form-group career-group">
                  <label>你想成為</label>
                  <div className="career-selector">
                    <div className="career-selector-controls">
                      <button
                        type="button"
                        className="arrow-btn"
                        onClick={() => handleCareerChange(-1)}
                        aria-label="上一個選項"
                      >
                        ◀
                      </button>
                      <div className="career-display">
                        <span className="career-icon">{currentCareer.icon}</span>
                        <span className="career-label">{currentCareer.label}</span>
                        <span className="career-description">{currentCareer.description}</span>
                      </div>
                      <button
                        type="button"
                        className="arrow-btn"
                        onClick={() => handleCareerChange(1)}
                        aria-label="下一個選項"
                      >
                        ▶
                      </button>
                    </div>
                    {/* 圓點在框內底部 */}
                    <div className="career-dots">
                      {careerTypes.map((_, index) => (
                        <span
                          key={index}
                          className={`dot ${index === formData.careerIndex ? 'active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, careerIndex: index }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 留言 */}
                <div className="form-group message-group">
                  <label htmlFor="message">留言（其他想說的話）</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="有什麼想告訴我們的嗎？"
                    rows={4}
                  />
                </div>
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
          </div>
        </div>
      </section>

      {/* Footer 滾動空間 - 讓 Footer 可以上浮 */}
      <div className="contact-footer-spacer"></div>
    </div>
  )
}

export default Contact
