const API_URL = import.meta.env.VITE_API_URL || ''

async function fetchAPI(action, options = {}) {
  const url = API_URL ? `${API_URL}?action=${action}` : ''

  if (!url) {
    console.warn('API URL not configured, using mock data')
    return getMockData(action)
  }

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    return getMockData(action)
  }
}

function getMockData(action) {
  const mockData = {
    getHomeData: {
      hero: {
        title: '歡迎來到我們的官方網站',
        subtitle: '我們致力於提供最優質的產品與服務，讓您的生活更加美好。',
        buttonText: '了解更多',
        buttonLink: '/about'
      },
      features: [
        { icon: '🚀', title: '快速服務', description: '我們提供迅速且高效的服務體驗' },
        { icon: '💎', title: '優質產品', description: '嚴選最高品質的產品給您' },
        { icon: '🤝', title: '專業團隊', description: '經驗豐富的專業團隊為您服務' },
        { icon: '💬', title: '客戶支援', description: '24/7 全天候客戶服務支援' }
      ]
    },
    getProducts: {
      products: [
        { id: 1, name: '產品 A', description: '這是產品 A 的描述文字', price: 1200, image: '' },
        { id: 2, name: '產品 B', description: '這是產品 B 的描述文字', price: 2400, image: '' },
        { id: 3, name: '產品 C', description: '這是產品 C 的描述文字', price: 3600, image: '' },
        { id: 4, name: '產品 D', description: '這是產品 D 的描述文字', price: 4800, image: '' }
      ]
    },
    getAbout: {
      title: '關於我們',
      content: '我們是一家致力於創新與品質的公司。自創立以來，我們始終堅持以客戶為中心的理念，不斷提升產品品質與服務水準。',
      mission: '我們的使命是透過創新科技與優質服務，為客戶創造更大的價值。',
      vision: '成為業界最受信賴的合作夥伴，引領產業發展趨勢。'
    },
    submitContact: {
      success: true,
      message: '感謝您的留言，我們會盡快與您聯繫！'
    }
  }

  return mockData[action] || {}
}

export async function getHomeData() {
  return fetchAPI('getHomeData')
}

export async function getProducts() {
  return fetchAPI('getProducts')
}

export async function getAbout() {
  return fetchAPI('getAbout')
}

export async function submitContact(data) {
  if (!API_URL) {
    return getMockData('submitContact')
  }

  return fetchAPI('submitContact', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
