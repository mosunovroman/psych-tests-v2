import { useState, useEffect } from 'react'
import { chatService } from '../services/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Здравствуйте! Я помогу определить, какие тесты вам подойдут. Расскажите, что вас беспокоит в последнее время?'
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('chatHistory')
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.length > 0 ? parsed : [INITIAL_MESSAGE]
      }
    } catch {
      // ignore
    }
    return [INITIAL_MESSAGE]
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(messages.slice(-20)))
    } catch {
      // ignore
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await chatService.send([...messages, userMessage])
      const assistantMessage: Message = { role: 'assistant', content: response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте позже.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([INITIAL_MESSAGE])
    localStorage.removeItem('chatHistory')
  }

  return { messages, sendMessage, isLoading, clearHistory }
}
