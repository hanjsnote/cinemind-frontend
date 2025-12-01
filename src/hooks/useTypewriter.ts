import { useCallback, useEffect, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { ChatMessage } from '../types/chat'

// 챗봇 응답 타자 효과 함수
export function useTypewriter(
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) {
  const typingIntervalRef = useRef<number | null>(null)

  const clearTyping = useCallback(() => {
    if (typingIntervalRef.current !== null) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
  }, [])

  const startTypewriter = useCallback(
    (messageId: number, fullText: string) => {
      const typingSpeed = 20 //ms

      // 혹시 전에 돌아가던 인터벌 있으면 정리
      clearTyping()

      let index = 0
      const id = window.setInterval(() => {
        index++

        setMessages(prev =>
          prev.map(m =>
            m.id === messageId
            ? {...m, text: fullText.slice(0, index)}
            : m
          )
        )

        if (index >= fullText.length) {
          clearInterval(id)
          typingIntervalRef.current = null
          setIsLoading(false)
        }
      }, typingSpeed)

      typingIntervalRef.current = id
    },
    [clearTyping, setMessages, setIsLoading]
  )

  // 컴포넌트 언마운트 시 인터벌 정리
  useEffect(() => {
    return () => {
      clearTyping()
    }
  }, [clearTyping])

  return { startTypewriter, clearTyping }
}