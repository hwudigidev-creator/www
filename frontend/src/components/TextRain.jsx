import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import textRainData from '../data/textRain.json'

function TextRain() {
  const [drops, setDrops] = useState([])
  const usedPositions = useRef([])

  // 將分類資料轉換為帶顏色的文字陣列
  const textsWithColor = useMemo(() => {
    const result = []
    const { categories } = textRainData
    Object.keys(categories).forEach(category => {
      const { color, texts } = categories[category]
      texts.forEach(text => {
        result.push({ text, color })
      })
    })
    return result
  }, [])

  // 找一個不重疊的位置
  const findNonOverlappingPosition = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const minDistance = isMobile ? 10 : 6 // 手機間距大一點
    const maxAttempts = 15
    // 手機用全寬 (5%-95%)，電腦用中間 50% (25%-75%)
    const rangeStart = isMobile ? 5 : 25
    const rangeWidth = isMobile ? 90 : 50

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const left = rangeStart + Math.random() * rangeWidth
      const isOverlapping = usedPositions.current.some(pos =>
        Math.abs(pos.left - left) < minDistance && Date.now() - pos.time < 4000
      )
      if (!isOverlapping) {
        return left
      }
    }
    // 如果找不到，還是回傳一個隨機位置
    return rangeStart + Math.random() * rangeWidth
  }, [])

  // 判斷是否為手機
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  const createDrop = useCallback(() => {
    // 隨機組合 2-3 個詞句
    const count = 2 + Math.floor(Math.random() * 2)
    const selectedItems = []
    for (let i = 0; i < count; i++) {
      const item = textsWithColor[Math.floor(Math.random() * textsWithColor.length)]
      selectedItems.push(item)
    }
    // 使用第一個詞的顏色，組合文字用·隔開
    const combinedText = selectedItems.map(item => item.text).join('·')
    const color = selectedItems[0].color

    const id = Date.now() + Math.random()
    const left = findNonOverlappingPosition()
    // 手機速度更慢
    const duration = isMobile ? (12 + Math.random() * 6) : (10 + Math.random() * 5)
    const delay = Math.random() * 0.5
    const opacity = 0.3 + Math.random() * 0.3 // 最大 0.6
    const fontSize = 12 + Math.random() * 4
    const blur = 0.3 + Math.random() * 0.2 // 0.3 ~ 0.5px 模糊

    // 記錄使用的位置
    usedPositions.current.push({ left, time: Date.now() })
    // 清理過期的位置記錄
    usedPositions.current = usedPositions.current.filter(pos => Date.now() - pos.time < 8000)

    return { id, text: combinedText, color, left, duration, delay, opacity, fontSize, blur }
  }, [textsWithColor, findNonOverlappingPosition, isMobile])

  useEffect(() => {
    // 手機版數量減少
    const initialCount = isMobile ? 3 : 5
    const maxCount = isMobile ? 18 : 30
    const intervalTime = isMobile ? 1200 : 700

    // 初始少量，逐漸增加
    const initialDrops = Array.from({ length: initialCount }, () => createDrop())
    setDrops(initialDrops)

    const interval = setInterval(() => {
      setDrops(prev => {
        const newDrop = createDrop()
        const updated = [...prev, newDrop]
        if (updated.length > maxCount) {
          return updated.slice(-maxCount)
        }
        return updated
      })
    }, intervalTime)

    return () => clearInterval(interval)
  }, [createDrop, isMobile])

  const handleAnimationEnd = (id) => {
    setDrops(prev => prev.filter(drop => drop.id !== id))
  }

  return (
    <div className="text-rain-container">
      {drops.map(drop => (
        <div
          key={drop.id}
          className={`text-rain-drop text-rain-${drop.color}`}
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            fontSize: `${drop.fontSize}px`,
            '--base-opacity': drop.opacity,
            '--base-blur': `${drop.blur}px`,
            '--start-blur': `${drop.blur + 3}px`,
          }}
          onAnimationEnd={() => handleAnimationEnd(drop.id)}
        >
          {drop.text.split('').map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default TextRain
