"use client"

import { useMealPlan } from "@/hooks/usePlan"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Card } from "@/components/ui/card"
import { MacroCircle } from "@/components/macro-circle"
import { ChatCoach } from "@/components/chat-coach"
import { MealPlanContainer } from "@/components/meal-plan-container"

export default function Page() {
  // Fetch live macro data from useMealPlan (summary contains the real numbers)
  const { summary, loading, error } = useMealPlan({
    date: new Date().toISOString().split("T")[0],
  })

  // Dummy objective values (if these are not available from the API)
  const objectiveMacros = {
    protein: 140,
    carbs: 250,
    fats: 75,
  }

  // Build macro data only when summary is available
  const macros = summary
    ? [
        { label: "Protein", type: "protein", value: summary.protein, objective: objectiveMacros.protein, unit: "g", color: "#10b981" },
        { label: "Carbs", type: "carbs", value: summary.carbs, objective: objectiveMacros.carbs, unit: "g", color: "#f59e0b" },
        { label: "Fats", type: "fats", value: summary.fat, objective: objectiveMacros.fats, unit: "g", color: "#ef4444" },
      ]
    : []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <SidebarTrigger />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Daily Overview</h1>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </header>

        <main className="px-4 py-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            {/* Main column */}
            <div className="space-y-6">
              {/* Macro summary: show real macro values when available */}
              {loading ? (
                <p className="p-4">Loading macros ...</p>
              ) : error ? (
                <p className="p-4 text-red-500">Error loading macros: {error.message}</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {macros.map((m, i) => (
                    <Card key={i} className="p-3">
                      <div className="flex items-center gap-3">
                        <MacroCircle
                          size={72}
                          strokeWidth={8}
                          value={m.value}
                          objective={m.objective}
                          color={m.color}
                          background="#e5e7eb"
                          ariaLabel={`${m.label} progress`}
                        />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">{m.label}</span>
                          <span className="text-xl font-semibold">
                            {m.value}/{m.objective}
                            <span className="text-xs text-muted-foreground ml-1">{m.unit}</span>
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* MealPlanContainer now handles the live summary and Meal Plan display */}
              <MealPlanContainer />
            </div>

            {/* Right column: Chat interface */}
            <div className="xl:sticky xl:top-20">
              <ChatCoach height={640} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
