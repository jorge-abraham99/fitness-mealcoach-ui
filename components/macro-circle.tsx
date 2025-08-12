"use client"

type MacroCircleProps = {
  size?: number
  strokeWidth?: number
  value?: number
  objective?: number
  color?: string
  background?: string
  ariaLabel?: string
}

export function MacroCircle({
  size = 96,
  strokeWidth = 10,
  value = 0,
  objective = 100,
  color = "#10b981",
  background = "#e5e7eb",
  ariaLabel = "macro circle",
}: MacroCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = Math.max(0, Math.min(1, value / Math.max(1, objective)))
  const dash = circumference * ratio
  const gap = circumference - dash

  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={ariaLabel}>
      <svg width={size} height={size}>
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          <circle r={radius} cx={0} cy={0} fill="transparent" stroke={background} strokeWidth={strokeWidth} />
          <circle
            r={radius}
            cx={0}
            cy={0}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
          />
        </g>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-sm font-medium">{Math.round(ratio * 100)}%</span>
        <span className="sr-only">{`${value} of ${objective}`}</span>
      </div>
    </div>
  )
}
