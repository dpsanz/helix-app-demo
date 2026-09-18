import { useState } from 'react'

type Point = { label: string; value: number }
type Props = { title: string; description: string; data: Point[]; unit: string; targetLabel: string }

export default function TrendChart({ title, description, data, unit, targetLabel }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const width = 560; const height = 180; const padX = 28; const padY = 22
  const values = data.map(point => point.value)
  const min = Math.min(...values); const max = Math.max(...values); const spread = Math.max(max - min, 1)
  const points = data.map((point, index) => ({ ...point, x: padX + index * ((width - padX * 2) / Math.max(data.length - 1, 1)), y: height - padY - ((point.value - min) / spread) * (height - padY * 2) }))
  const line = points.map(point => `${point.x},${point.y}`).join(' ')
  const area = `${padX},${height - padY} ${line} ${width - padX},${height - padY}`
  const latest = data.at(-1)?.value ?? 0
  const activePoint = activeIndex === null ? null : points[activeIndex]
  const tooltipX = activePoint ? Math.min(Math.max(activePoint.x, 64), width - 64) : 0
  const tooltipY = activePoint ? Math.max(activePoint.y - 48, 8) : 0

  return <article className="trend-card">
    <div className="trend-heading"><div><span className="eyebrow">{targetLabel}</span><h3>{title}</h3><p>{description}</p></div><strong>{activePoint?.value ?? latest}<small>{unit}</small></strong></div>
    <div className="trend-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}: valor atual ${latest} ${unit}`} onMouseLeave={() => setActiveIndex(null)}>
      {[0, 1, 2].map(row => <line key={row} x1={padX} x2={width - padX} y1={padY + row * ((height - padY * 2) / 2)} y2={padY + row * ((height - padY * 2) / 2)} className="chart-gridline" />)}
      <polygon points={area} className="chart-area" /><polyline points={line} className="chart-line" />
      {activePoint && <line x1={activePoint.x} x2={activePoint.x} y1={padY} y2={height - padY} className="chart-guide" />}
      {points.map((point, index) => <g key={point.label} className={activeIndex === index ? 'chart-point-group active' : 'chart-point-group'} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)} tabIndex={0} role="button" aria-label={`${point.label}: ${point.value} ${unit}`}>
        <circle cx={point.x} cy={point.y} r="14" className="chart-hit-area" />
        <circle cx={point.x} cy={point.y} r="4" className="chart-point" />
      </g>)}
      {activePoint && <g className="chart-tooltip" transform={`translate(${tooltipX - 57} ${tooltipY})`} pointerEvents="none">
        <rect width="114" height="34" rx="7" />
        <text x="57" y="14" className="chart-tooltip-label">{activePoint.label}</text>
        <text x="57" y="27" className="chart-tooltip-value">{activePoint.value} {unit}</text>
      </g>}
    </svg><div className="chart-labels">{data.map(point => <span key={point.label}>{point.label}</span>)}</div></div>
  </article>
}
