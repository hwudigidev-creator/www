function ScrollIndicator({ direction = 'down', onClick }) {
  const isUp = direction === 'up'

  return (
    <div
      className={`cube-scroll-indicator ${isUp ? 'cube-scroll-up' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <span className="cube-scroll-text">{isUp ? 'Tap Up' : 'Tap Down'}</span>
      <div className="cube-scroll-icons">
        <span className="cube-scroll-icon">{isUp ? '▲' : '▼'}</span>
        <span className="cube-scroll-icon">{isUp ? '▲' : '▼'}</span>
      </div>
    </div>
  )
}

export default ScrollIndicator
