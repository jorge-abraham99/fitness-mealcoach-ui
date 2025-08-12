import { Badge } from "@/components/ui/badge"
import { Sunrise, Salad, Cookie, Moon, Dot } from 'lucide-react'

type MealItem = {
  name: string
  qty: string
  kcal: number
  p: number
  c: number
  f: number
}

type MealKey = "breakfast" | "lunch" | "snacks" | "dinner"

type MealSection = {
  key: MealKey
  label: string
  items: MealItem[]
}

type MealPlanListProps = {
  mealPlan?: MealSection[]
  refresh?: () => void
}

// Icons and colors per section
const sectionMeta: Record<MealKey, { 
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
  text: string;
  border: string;
}> = {
  breakfast: { icon: Sunrise, tint: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  lunch: { icon: Salad, tint: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  snacks: { icon: Cookie, tint: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
  dinner: { icon: Moon, tint: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
}

function MacroPill({
  label,
  value,
  className,
}: {
  label: string
  value: number | string
  className: string
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      <Dot className="h-3 w-3" />
      {label} {value}
    </span>
  )
}

export function MealPlanList({ mealPlan = [], refresh }: MealPlanListProps) {
  if (!mealPlan.length) {
    return (
      <p className="text-sm text-muted-foreground">No meals planned for today.</p>
    )
  }

  return (
    <div className="space-y-4">
      {/* Optional: Add refresh button */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium">Meal Plan</h2>
          <p className="text-xs text-muted-foreground">
            Today’s plan organized by meal.
          </p>
        </div>
        <button
          onClick={() => refresh?.()}
          className="text-xs px-2 py-1 rounded border bg-muted hover:bg-muted-foreground/10 transition"
          aria-label="Refresh meal plan"
        >
          ↻
        </button>
      </div>

      {mealPlan.map((section) => (
        <MealSectionBlock key={section.key} section={section} />
      ))}
    </div>
  )
}

function MealSectionBlock({ section }: { section: MealSection }) {
  const meta = sectionMeta[section.key]
  const Icon = meta.icon

  const totals = section.items.reduce(
    (acc, i) => {
      acc.kcal += i.kcal
      acc.p += i.p
      acc.c += i.c
      acc.f += i.f
      return acc
    },
    { kcal: 0, p: 0, c: 0, f: 0 }
  )

  return (
    <section aria-labelledby={`${section.key}-heading`} className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <div className={`grid h-8 w-8 place-items-center rounded-md ${meta.tint}`}>
          <Icon className={`h-4 w-4 ${meta.text}`} />
        </div>
        <h3 id={`${section.key}-heading`} className="text-sm font-semibold">
          {section.label}
        </h3>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className={`text-xs ${meta.border} ${meta.text} border`}>
            {totals.kcal} kcal
          </Badge>
          <MacroPill label="P" value={`${totals.p}g`} className="bg-emerald-100 text-emerald-700" />
          <MacroPill label="C" value={`${totals.c}g`} className="bg-amber-100 text-amber-700" />
          <MacroPill label="F" value={`${totals.f}g`} className="bg-rose-100 text-rose-700" />
        </div>
      </div>

      <ul className="mt-3 space-y-2">
        {section.items.map((item, idx) => (
          <li key={idx} className="group">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60 group-hover:bg-foreground transition-colors" />
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.qty}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                    {item.p}g P
                  </Badge>
                  <Badge variant="outline" className="border-amber-200 text-amber-700">
                    {item.c}g C
                  </Badge>
                  <Badge variant="outline" className="border-rose-200 text-rose-700">
                    {item.f}g F
                  </Badge>
                  <span className="ml-1 text-muted-foreground">{item.kcal} kcal</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}