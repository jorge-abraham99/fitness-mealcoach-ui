'use client'

import { useState, useEffect, useCallback } from 'react'

// === Types ===
export interface TransformedMealSection {
  key: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
  label: string
  items: {
    name: string
    qty: string
    kcal: number
    p: number
    c: number
    f: number
  }[]
}

export interface NutritionSummary {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface UseMealPlanOptions {
  date?: string // Format: YYYY-MM-DD, defaults to today
  userId?: string | null
}

interface UseMealPlanReturn {
  mealPlan: TransformedMealSection[]
  summary: NutritionSummary | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

// === Helper: Parse number from string like "51.2" or "360 kcal" ===
const parseNum = (value: string | number): number => {
  if (typeof value === 'number') return value
  return parseFloat(value.toString().replace(/[^\d.-]/g, '')) || 0
}

// === Map API keys to component keys ===
const mapMealKey = (key: string): TransformedMealSection['key'] => {
  const map: Record<string, TransformedMealSection['key']> = {
    Breakfast: 'breakfast',
    Lunch: 'lunch',
    Dinner: 'dinner',
    Snack: 'snacks',
  }
  return map[key] || 'snacks'
}

// Use the relative path for API calls
const API_BASE_URL = 'http://localhost:8000' // Adjust based on your setup

export function useMealPlan(options: UseMealPlanOptions = {}): UseMealPlanReturn {
  const {
    date = new Date().toISOString().split('T')[0],
    userId = null,
  } = options

  const [mealPlan, setMealPlan] = useState<TransformedMealSection[]>([])
  const [summary, setSummary] = useState<NutritionSummary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // === Transform API response into frontend format ===
  const transformResponse = useCallback((data: any) => {
    const apiPlan = data.meal_plan
    if (!apiPlan) {
      return { mealPlan: [], summary: null }
    }

    // Extract daily totals
    const dailyTotals = apiPlan['Daily Totals'] || {}
    const transformedSummary: NutritionSummary = {
      calories: parseNum(dailyTotals['Total Energy (kcal)']),
      protein: parseNum(dailyTotals['Total Protein']),
      carbs: parseNum(dailyTotals['Total Carbohydrate']),
      fat: parseNum(dailyTotals['Total Fat']),
    }

    // Transform each meal section
    const transformed: TransformedMealSection[] = Object.entries(apiPlan)
      .filter(([key]) => key !== 'Daily Totals')
      .map(([mealKey, mealData]: [string, any]) => {
        const items = Object.entries(mealData.Details || {}).map(([foodName, details]: [string, any]) => ({
          name: foodName,
          qty: details.quantity || '--',
          kcal: parseNum(details['Energy (kcal)']),
          p: parseNum(details['Protein (g)']),
          c: parseNum(details['Carbohydrate (g)']),
          f: parseNum(details['Fat (g)']),
        }))

        return {
          key: mapMealKey(mealKey),
          label: mealKey,
          items,
        }
      })

    // Sort order
    const sortOrder = ['breakfast', 'lunch', 'snacks', 'dinner']
    transformed.sort((a, b) => sortOrder.indexOf(a.key) - sortOrder.indexOf(b.key))

    return { mealPlan: transformed, summary: transformedSummary }
  }, [])

  // === Fetch data from API ===
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // FIX: Calling the /api/generate endpoint without parameters as requested
      const url = `${API_BASE_URL}/generate_meal_plan`
      const response = await fetch(url, { method: 'GET' })
      if (!response.ok) throw new Error(`Failed to fetch meal plan: ${response.status}`)
      const data = await response.json()
      const { mealPlan: mp, summary: sm } = transformResponse(data)
      setMealPlan(mp)
      setSummary(sm)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [transformResponse]) // FIX: Removed date and userId from dependencies

  // === Refresh: re-fetch data manually ===
  const refresh = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  // === Load on mount ===
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { mealPlan, summary, loading, error, refresh }
}
