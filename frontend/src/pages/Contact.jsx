import { useState, useRef, useEffect, useCallback } from 'react'
import { submitContact } from '../services/api'
import contactOptions from '../data/contactOptions.json'
import hslist from '../data/hslist.json'
import departmentList from '../data/departments.json'
import Footer from '../components/Footer'

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
  const [activeRow, setActiveRow] = useState(0)
  const [showFooter, setShowFooter] = useState(false)
  const schoolInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const deptInputRef = useRef(null)
  const deptDropdownRef = useRef(null)

  const { careerTypes } = contactOptions
  const schools = hslist.filter(s => s.value !== '-1')
  const totalRows = 4 // 校名科別, 姓名手機, Email, 職涯留言+送出

  const filteredSchools = schools.filter(school =>
    school.label.toLowerCase().includes(schoolInput.toLowerCase())
  )

  const filteredDepts = departmentList.filter(dept =>
    dept.label.toLowerCase().includes(deptInput.toLowerCase())
  )

  // 禁止頁面捲動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
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

  // 導航
  const nextRow = useCallback(() => {
    if (showFooter) return
    if (activeRow < totalRows - 1) {
      setActiveRow(activeRow + 1)
    } else {
      setShowFooter(true)
    }
  }, [activeRow, showFooter])

  const prevRow = useCallback(() => {
    if (showFooter) {
      setShowFooter(false)
    } else if (activeRow > 0) {
      setActiveRow(activeRow - 1)
    }
  }, [activeRow, showFooter])

  const goToTop = useCallback(() => {
    setShowFooter(false)
    setActiveRow(0)
  }, [])

  // 驗證函數
  const validatePhone = (phone) => {
    const phoneRegex = /^09\d{8}$/
    return phoneRegex.test(phone.replace(/-/g, ''))
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 選擇學校
  const handleSchoolSelect = (school) => {
    setFormData(prev => ({ ...prev, school: school.value }))
    setSchoolInput(school.label)
    setShowSchoolDropdown(false)
    if (errors.school) setErrors(prev => ({ ...prev, school: '' }))
  }

  const handleSchoolInputChange = (e) => {
    const value = e.target.value
    setSchoolInput(value)
    setShowSchoolDropdown(true)
    const exactMatch = schools.find(s => s.label === value)
    setFormData(prev => ({ ...prev, school: exactMatch ? exactMatch.value : value }))
    if (errors.school) setErrors(prev => ({ ...prev, school: '' }))
  }

  // 選擇科別
  const handleDeptSelect = (dept) => {
    setFormData(prev => ({ ...prev, department: dept.value }))
    setDeptInput(dept.label)
    setShowDeptDropdown(false)
    if (errors.department) setErrors(prev => ({ ...prev, department: '' }))
  }

  const handleDeptInputChange = (e) => {
    const value = e.target.value
    setDeptInput(value)
    setShowDeptDropdown(true)
    const exactMatch = departmentList.find(d => d.label === value)
    setFormData(prev => ({ ...prev, department: exactMatch ? exactMatch.value : value }))
    if (errors.department) setErrors(prev => ({ ...prev, department: '' }))
  }

  // 驗證表單
  const validateForm = () => {
    const newErrors = {}
    if (!schoolInput.trim()) newErrors.school = '請輸入或選擇學校'
    if (!deptInput.trim()) newErrors.department = '請輸入或選擇科別'
    if (!formData.name.trim()) newErrors.name = '請輸入姓名'
    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入手機號碼'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '手機格式不正確'
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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

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
    if (!validateForm()) return

    setSubmitting(true)
    setResult(null)

    try {
      const submitData = {
        ...formData,
        school: schoolInput,
        department: deptInput,
        career: careerTypes[formData.careerIndex].label,
        careerDescription: careerTypes[formData.careerIndex].description
      }
      const response = await submitContact(submitData)
      setResult({ success: true, message: response.message || '感謝您的留言！' })
      setFormData({ school: '', department: '', name: '', phone: '', email: '', careerIndex: 0, message: '' })
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const rowHeight = isMobile ? 140 : 120

  return (
    <div className="contact no-scroll">
      {/* 上方箭頭 */}
      {(activeRow > 0 || showFooter) && (
        <div className="cube-scroll-indicator cube-scroll-up" onClick={prevRow} style={{ cursor: 'pointer' }}>
          <div className="cube-scroll-icons">
            <span className="cube-scroll-icon">▲</span>
            <span className="cube-scroll-icon">▲</span>
          </div>
        </div>
      )}

      {/* 下方箭頭 */}
      {!showFooter && (
        <div className="cube-scroll-indicator" onClick={nextRow} style={{ cursor: 'pointer' }}>
          <div className="cube-scroll-icons">
            <span className="cube-scroll-icon">▼</span>
            <span className="cube-scroll-icon">▼</span>
          </div>
        </div>
      )}

      {/* 標題區 */}
      <section
        className="contact-hero"
        style={{
          opacity: showFooter ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}
      >
        <div className="contact-hero-content">
          <h1 className="gradient-text">聯絡我們</h1>
          <p>對數位設計系或AI工作流有興趣，或任何想了解的？</p>
        </div>
      </section>

      {/* 表單區 */}
      <section
        className="contact-form-section contact-form-rows"
        style={{
          opacity: showFooter ? 0 : 1,
          pointerEvents: showFooter ? 'none' : 'auto',
          transition: 'opacity 0.5s ease'
        }}
      >

        <div className="contact-form-viewport">
          <form
            className="contact-form contact-form-track"
            onSubmit={handleSubmit}
            style={{
              transform: `translateY(${-activeRow * rowHeight}px)`,
              transition: 'transform 0.4s ease-out'
            }}
          >
            {/* Row 0: 校名 + 科別 */}
            <div className={`form-row-item ${activeRow === 0 ? 'active' : ''}`}>
              <div className="form-row">
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
                        {filteredSchools.slice(0, 6).map(school => (
                          <li key={school.value} onClick={() => handleSchoolSelect(school)}
                              className={formData.school === school.value ? 'selected' : ''}>
                            {school.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {errors.school && <span className="error-message">{errors.school}</span>}
                </div>

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
                        {filteredDepts.slice(0, 6).map(dept => (
                          <li key={dept.value} onClick={() => handleDeptSelect(dept)}
                              className={formData.department === dept.value ? 'selected' : ''}>
                            {dept.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {errors.department && <span className="error-message">{errors.department}</span>}
                </div>
              </div>
            </div>

            {/* Row 1: 姓名 + 手機 */}
            <div className={`form-row-item ${activeRow === 1 ? 'active' : ''}`}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">姓名 <span className="required">*</span></label>
                  <input type="text" id="name" name="name" value={formData.name}
                         onChange={handleChange} placeholder="請輸入您的姓名"
                         className={errors.name ? 'error' : ''} />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">手機 <span className="required">*</span></label>
                  <input type="tel" id="phone" name="phone" value={formData.phone}
                         onChange={handleChange} placeholder="例：0912345678"
                         className={errors.phone ? 'error' : ''} />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Row 2: Email */}
            <div className={`form-row-item ${activeRow === 2 ? 'active' : ''}`}>
              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input type="email" id="email" name="email" value={formData.email}
                       onChange={handleChange} placeholder="請輸入您的電子郵件"
                       className={errors.email ? 'error' : ''} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            {/* Row 3: 你想成為 + 留言 + 送出 */}
            <div className={`form-row-item ${activeRow === 3 ? 'active' : ''}`}>
              <div className="form-row career-message-row">
                <div className="form-group career-group">
                  <label>你想成為</label>
                  <div className="career-selector">
                    <div className="career-selector-controls">
                      <button type="button" className="arrow-btn" onClick={() => handleCareerChange(-1)}>◀</button>
                      <div className="career-display">
                        <i className={`career-icon ${currentCareer.icon}`}></i>
                        <span className="career-label">{currentCareer.label}</span>
                        <span className="career-description">{currentCareer.description}</span>
                      </div>
                      <button type="button" className="arrow-btn" onClick={() => handleCareerChange(1)}>▶</button>
                    </div>
                    <div className="career-dots">
                      {careerTypes.map((_, index) => (
                        <span key={index}
                              className={`dot ${index === formData.careerIndex ? 'active' : ''}`}
                              onClick={() => setFormData(prev => ({ ...prev, careerIndex: index }))} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group message-group">
                  <label htmlFor="message">留言（選填）</label>
                  <textarea id="message" name="message" value={formData.message}
                            onChange={handleChange} placeholder="有什麼想告訴我們的嗎？" rows={3} />
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
            </div>
          </form>
        </div>

        {/* 進度指示點 */}
        <div className="contact-form-dots">
          {[...Array(totalRows)].map((_, index) => (
            <span key={index}
                  className={`dot ${index === activeRow ? 'active' : ''}`}
                  onClick={() => setActiveRow(index)} />
          ))}
        </div>
      </section>

      {/* Footer */}
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

export default Contact
