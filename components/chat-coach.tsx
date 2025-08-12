"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send } from 'lucide-react'
import { useChat } from "@/hooks/useChat"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

const seed: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hi! I’m your coach. Ask me about your meals, macros, or how to hit today’s target.",
  },
]

export function ChatCoach({ height = 560 }: { height?: number }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(seed)
  const [input, setInput] = React.useState("")
  // This state holds the current query to trigger the hook
  const [query, setQuery] = React.useState("")

  // Trigger the GET request when query changes
  const { data, loading, error } = useChat(query)

  // Append assistant response when data is returned
  React.useEffect(() => {
    if (data && !loading) {
      setMessages(prev => [...prev, { role: "assistant", content: data }])
      // Reset query to avoid re-running the hook on re-renders
      setQuery("")
    }
  }, [data, loading])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    // Append the user message
    setMessages(prev => [...prev, { role: "user", content: trimmed }])
    // Set the query to trigger the useChat hook
    setQuery(trimmed)
    setInput("")
  }

  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 px-1 pb-2">
        <span className="text-sm font-medium">Coach</span>
      </div>

      <div className="rounded border" style={{ height, overflowY: "auto" }}>
        <div className="p-3 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  m.role === "user"
                    ? "inline-block rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm"
                    : "inline-block rounded-lg bg-muted px-3 py-2 text-sm"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block rounded-lg bg-muted px-3 py-2 text-sm">
                Loading...
              </div>
            </div>
          )}
          {error && (
            <div className="text-left text-red-500 text-sm">
              Error: {error.message}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-2 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about meals, macros, timing..."
          aria-label="Message coach"
        />
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
      <div className="mt-2 text-[10px] text-muted-foreground">
        Press Enter to send.
      </div>
    </Card>
  )
}
