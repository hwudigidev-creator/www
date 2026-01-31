import { useState, useCallback } from 'react'

/**
 * 頁面導航 Hook
 * @param {number} totalSections - 總階段數
 * @returns {object} 導航狀態與函數
 */
function usePageNavigation(totalSections) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showFooter, setShowFooter] = useState(false)

  const maxIndex = totalSections - 1

  // 下一階段
  const next = useCallback(() => {
    if (showFooter) return
    if (activeIndex < maxIndex) {
      setActiveIndex(prev => prev + 1)
    } else {
      setShowFooter(true)
    }
  }, [activeIndex, maxIndex, showFooter])

  // 上一階段
  const prev = useCallback(() => {
    if (showFooter) {
      setShowFooter(false)
    } else if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1)
    }
  }, [activeIndex, showFooter])

  // 回到頂部
  const goToTop = useCallback(() => {
    setShowFooter(false)
    setActiveIndex(0)
  }, [])

  // 跳到指定階段
  const goTo = useCallback((index) => {
    if (index >= 0 && index <= maxIndex) {
      setShowFooter(false)
      setActiveIndex(index)
    }
  }, [maxIndex])

  return {
    activeIndex,
    setActiveIndex,
    showFooter,
    setShowFooter,
    next,
    prev,
    goToTop,
    goTo,
    showUp: activeIndex > 0 || showFooter,
    showDown: !showFooter,
    isFirst: activeIndex === 0 && !showFooter,
    isLast: showFooter
  }
}

export { usePageNavigation }
