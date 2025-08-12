"use client"

import { cn } from "@/lib/utils"

type HeaderMetricProps = {
  title?: string
  current?: number
  objective?: number
  accentClass?: string // e.g. "from-emerald-500 to-emerald-400"
  size?: "default" | "compact"
}

export function HeaderMetric({
  title = "Total kcal vs Objective",
  current = 1540,
  objective = 2200,
  accentClass = "from-emerald-500 to-emerald-400",
  size = "default",
}: HeaderMetricProps) {
  const pct = Math.min(100, Math.round((current / Math.max(1, objective)) * 100))
  const titleClass = size === "compact" ? "text-sm" : "text-base"
  const valueClass = size === "compact" ? "text-xl" : "text-2xl"
  const barHeight = size === "compact" ? "h-2" : "h-3"
  const subTextClass = "text-xs text-muted-foreground"

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <h2 className={cn("font-medium", titleClass)}>{title}</h2>
          <p className={subTextClass}>Stay in your target to hit today’s goal.</p>
        </div>
        <div className="text-right">
          <div className={cn("font-semibold", valueClass)}>{current}</div>
          <div className={subTextClass}>of {objective} kcal</div>
        </div>
      </div>

      <div className="mt-3">
        <div className={cn(barHeight, "w-full rounded-full bg-muted overflow-hidden")}>
          <div
            className={cn("h-full rounded-full bg-gradient-to-r", accentClass)}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Calories progress"
          />
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{pct}% of daily objective</div>
      </div>
    </div>
  )
}
