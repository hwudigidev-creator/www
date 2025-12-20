const API_URL = import.meta.env.VITE_API_URL || ''
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || ''

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
        title: '醒吾科技大學',
        subtitle: '培養數位時代的創意設計人才。結合 AI 輔助設計、動畫、遊戲、互動多媒體與影視特效，打造全方位的數位設計專業能力。',
        buttonText: '探索課程',
        buttonLink: '/products'
      },
      features: [
        {
          icon: 'fa-solid fa-robot',
          title: 'AI 輔助設計',
          description: '學習運用 AI 工具加速創作流程，掌握 AIGC 生成式 AI 技術，提升設計效率與創意表現。'
        },
        {
          icon: 'fa-solid fa-film',
          title: '動畫設計',
          description: '從 2D 動畫到 3D 動畫，學習角色設計、動態捕捉、動畫製作全流程技術。'
        },
        {
          icon: 'fa-solid fa-gamepad',
          title: '遊戲開發',
          description: '遊戲企劃、關卡設計、Unity/Unreal 引擎開發，打造沉浸式遊戲體驗。'
        },
        {
          icon: 'fa-solid fa-wand-magic-sparkles',
          title: '影視特效',
          description: 'VFX 視覺特效、合成技術、動態圖像設計，創造震撼視覺效果。'
        },
        {
          icon: 'fa-solid fa-vr-cardboard',
          title: '互動多媒體',
          description: 'AR/VR 擴增實境、互動裝置、數位展演，探索新媒體藝術可能性。'
        },
        {
          icon: 'fa-solid fa-arrows-spin',
          title: 'AI 工作流',
          description: '建立高效的 AI 創作工作流程，整合多種 AI 工具實現自動化設計流程。'
        }
      ]
    },
    getProducts: {
      products: [
        {
          id: 1,
          name: 'AI 輔助設計',
          description: '學習運用 AI 工具加速創作流程，掌握 AIGC 生成式 AI 技術，提升設計效率與創意表現。',
          price: null,
          image: ''
        },
        {
          id: 2,
          name: '動畫設計',
          description: '從 2D 動畫到 3D 動畫，學習角色設計、動態捕捉、動畫製作全流程技術。',
          price: null,
          image: ''
        },
        {
          id: 3,
          name: '遊戲開發',
          description: '遊戲企劃、關卡設計、Unity/Unreal 引擎開發，打造沉浸式遊戲體驗。',
          price: null,
          image: ''
        },
        {
          id: 4,
          name: '影視特效',
          description: 'VFX 視覺特效、合成技術、動態圖像設計，創造震撼視覺效果。',
          price: null,
          image: ''
        },
        {
          id: 5,
          name: '互動多媒體',
          description: 'AR/VR 擴增實境、互動裝置、數位展演，探索新媒體藝術可能性。',
          price: null,
          image: ''
        },
        {
          id: 6,
          name: 'AI 工作流',
          description: '建立高效的 AI 創作工作流程，整合多種 AI 工具實現自動化設計流程。',
          price: null,
          image: ''
        }
      ]
    },
    getAbout: {
      title: '關於數位設計系',
      content: '醒吾科技大學數位設計系成立於數位內容產業蓬勃發展之際，致力於培養具備創意思維與技術能力的數位設計人才。我們結合最新的 AI 技術與傳統設計美學，讓學生在動畫、遊戲、互動多媒體、影視特效等領域具備專業競爭力。',
      mission: '培養具備 AI 時代競爭力的數位設計專業人才，結合創意思維與技術實作，使學生能夠在快速變遷的數位產業中持續成長。',
      vision: '成為台灣數位設計教育的領航者，培育能夠引領產業創新的設計人才，為數位內容產業注入創意動能。'
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
  // 優先使用獨立的聯絡表單 API (Google Apps Script)
  if (CONTACT_API_URL) {
    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8', // Google Apps Script 需要 text/plain 避免 CORS preflight
        },
        body: JSON.stringify(data),
        redirect: 'follow',
        mode: 'cors',
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Contact API Error:', error)
      return {
        success: false,
        message: '發送失敗，請稍後再試。'
      }
    }
  }

  // 回退到原本的 API
  if (!API_URL) {
    return getMockData('submitContact')
  }

  return fetchAPI('submitContact', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
