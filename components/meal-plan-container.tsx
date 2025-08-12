"use client"

import { Card } from "@/components/ui/card"
import { HeaderMetric } from "@/components/header-metric"
import { MealPlanList } from "@/components/mealplan-list"
import { useMealPlan } from "@/hooks/usePlan"

export function MealPlanContainer() {
  const { mealPlan, summary, loading, error, refresh } = useMealPlan({
    date: new Date().toISOString().split("T")[0],
  })

  const objectiveKcal = 2200

  if (loading) return <p className="p-4">Loading meal plan...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error.message}</p>

  return (
    <>
      <Card className="p-4">
        <HeaderMetric
          title="Total kcal"
          current={summary?.calories || 0}
          objective={objectiveKcal}
          accentClass="from-emerald-500 to-emerald-400"
          size="compact"
        />
      </Card>
      <Card className="p-4">
        <div className="mb-3">
          <h2 className="text-base font-medium">Meal Plan</h2>
          <p className="text-xs text-muted-foreground">
            Today’s plan organized by meal.
          </p>
        </div>
        <MealPlanList mealPlan={mealPlan} refresh={refresh} />
      </Card>
    </>
  )
}