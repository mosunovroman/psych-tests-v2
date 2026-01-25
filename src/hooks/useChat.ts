import { useState, useEffect } from 'react'
import { chatService, OfflineError } from '../services/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isOffline?: boolean
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Здравствуйте! Я помогу определить, какие тесты вам подойдут. Расскажите, что вас беспокоит в последнее время?'
}

const OFFLINE_MESSAGE = '📵 Нет подключения к интернету. Чат-бот недоступен в офлайн-режиме, но вы можете проходить тесты и смотреть историю результатов.'

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
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

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
      let errorContent = 'Извините, произошла ошибка. Попробуйте позже.'
      let isOffline = false

      if (error instanceof OfflineError) {
        errorContent = OFFLINE_MESSAGE
        isOffline = true
      }

      const errorMessage: Message = {
        role: 'assistant',
        content: errorContent,
        isOffline
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

  return { messages, sendMessage, isLoading, clearHistory, isOnline }
}
