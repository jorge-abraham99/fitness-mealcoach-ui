import { useState, useEffect } from "react"

interface ChatResponse {
  data: string | null
  loading: boolean
  error: Error | null
}

export function useChat(message: string): ChatResponse {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!message) return

    setLoading(true)
    setError(null)

    // Abort controller to cancel pending requests if message changes or on unmount
    const controller = new AbortController()

    const fetchChatResponse = async () => {
      try {
        const params = new URLSearchParams({ prompt: message })
        // Update the endpoint as needed
        // const response = await fetch(`/api/chatbot/generate?${params.toString()}`, {
        //   method: "GET",
        //   signal: controller.signal,
        // })
        const response = await fetch(`http://localhost:8000/generate?${params.toString()}`, {
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

