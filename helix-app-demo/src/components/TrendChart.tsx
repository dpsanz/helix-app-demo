type Point = { label: string; value: number }
type Props = { title: string; description: string; data: Point[]; unit: string; targetLabel: string }

export default function TrendChart({ title, description, data, unit, targetLabel }: Props) {
  const width = 560; const height = 180; const padX = 28; const padY = 22
  const values = data.map(point => point.value)
  const min = Math.min(...values); const max = Math.max(...values); const spread = Math.max(max - min, 1)
  const points = data.map((point, index) => ({ ...point, x: padX + index * ((width - padX * 2) / Math.max(data.length - 1, 1)), y: height - padY - ((point.value - min) / spread) * (height - padY * 2) }))
  const line = points.map(point => `${point.x},${point.y}`).join(' ')
  const area = `${padX},${height - padY} ${line} ${width - padX},${height - padY}`
  const latest = data.at(-1)?.value ?? 0

  return <article className="trend-card">
    <div className="trend-heading"><div><span className="eyebrow">{targetLabel}</span><h3>{title}</h3><p>{description}</p></div><strong>{latest}<small>{unit}</small></strong></div>
    <div className="trend-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}: valor atual ${latest} ${unit}`}>
      {[0, 1, 2].map(row => <line key={row} x1={padX} x2={width - padX} y1={padY + row * ((height - padY * 2) / 2)} y2={padY + row * ((height - padY * 2) / 2)} className="chart-gridline" />)}
      <polygon points={area} className="chart-area" /><polyline points={line} className="chart-line" />
      {points.map(point => <circle key={point.label} cx={point.x} cy={point.y} r="4" className="chart-point" />)}
    </svg><div className="chart-labels">{data.map(point => <span key={point.label}>{point.label}</span>)}</div></div>
  </article>
}
