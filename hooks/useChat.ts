import { useState, useEffect } from "react"

interface ChatResponse {
  data: string | null
  loading: boolean
  error: Error | null
}

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://fitness-mealcoach-ui.vercel.app'

export function useChat(message: string): ChatResponse {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!message) return

    setLoading(true)
    setError(null)

    const controller = new AbortController()

    const fetchChatResponse = async () => {
      try {
        const params = new URLSearchParams({ prompt: message })
        const response = await fetch(`${API_URL}/generate?${params.toString()}`, {
          method: "GET",
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseText = await response.text()
        setData(responseText)
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchChatResponse()

    return () => {
      controller.abort()
    }
  }, [message])

  return { data, loading, error }
}

