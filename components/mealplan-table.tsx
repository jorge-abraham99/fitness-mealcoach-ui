"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type MealItem = {
  name: string
  qty: string
  kcal: number
  p: number
  c: number
  f: number
}

type MealSection = {
  key: "breakfast" | "lunch" | "snacks" | "dinner"
  label: string
  items: MealItem[]
}

const defaultPlan: MealSection[] = [
  {
    key: "breakfast",
    label: "Breakfast",
    items: [
      { name: "Greek Yogurt + Berries", qty: "1 cup + 1/2 cup", kcal: 220, p: 20, c: 28, f: 3 },
      { name: "Whole-grain Toast", qty: "1 slice", kcal: 90, p: 4, c: 16, f: 1 },
    ],
  },
  {
    key: "lunch",
    label: "Lunch",
    items: [
      { name: "Chicken Bowl (rice, veg)", qty: "1 bowl", kcal: 520, p: 40, c: 58, f: 14 },
    ],
  },
  {
    key: "snacks",
    label: "Snacks",
    items: [
      { name: "Protein Shake", qty: "1 scoop + water", kcal: 140, p: 25, c: 4, f: 2 },
      { name: "Banana", qty: "1 medium", kcal: 105, p: 1, c: 27, f: 0 },
    ],
  },
  {
    key: "dinner",
    label: "Dinner",
    items: [
      { name: "Salmon + Quinoa + Veg", qty: "1 plate", kcal: 480, p: 38, c: 40, f: 18 },
    ],
  },
]

type MealPlanTableProps = {
  plan?: MealSection[]
}

export function MealPlanTable({ plan = defaultPlan }: MealPlanTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Item</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead className="text-right">kcal</TableHead>
            <TableHead className="text-right">P</TableHead>
            <TableHead className="text-right">C</TableHead>
            <TableHead className="text-right">F</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plan.map((section) => (
            <SectionRows key={section.key} section={section} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function SectionRows({ section }: { section: MealSection }) {
  const totals = section.items.reduce(
    (acc, i) => {
      acc.kcal += i.kcal
      acc.p += i.p
      acc.c += i.c
      acc.f += i.f
      return acc
    },
    { kcal: 0, p: 0, c: 0, f: 0 },
  )

  return (
    <>
      <TableRow className="bg-muted/40 hover:bg-muted/40">
        <TableCell colSpan={6} id={section.key} className="font-medium">
          {section.label}
        </TableCell>
      </TableRow>
      {section.items.map((i, idx) => (
        <TableRow key={section.label + idx}>
          <TableCell>{i.name}</TableCell>
          <TableCell className="text-sm text-muted-foreground">{i.qty}</TableCell>
          <TableCell className="text-right">{i.kcal}</TableCell>
          <TableCell className="text-right">{i.p}g</TableCell>
          <TableCell className="text-right">{i.c}g</TableCell>
          <TableCell className="text-right">{i.f}g</TableCell>
        </TableRow>
      ))}
      <TableRow className="bg-muted/20 hover:bg-muted/20">
        <TableCell className="font-medium">Subtotal</TableCell>
        <TableCell />
        <TableCell className="text-right">{totals.kcal}</TableCell>
        <TableCell className="text-right">{totals.p}g</TableCell>
        <TableCell className="text-right">{totals.c}g</TableCell>
        <TableCell className="text-right">{totals.f}g</TableCell>
      </TableRow>
    </>
  )
}
