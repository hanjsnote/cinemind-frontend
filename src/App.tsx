import { useEffect, useRef, useState, type FormEvent } from 'react'
import './App.css'
import { Header } from './components/Header'
import { LoginModal } from './components/LoginModal'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { ConfirmModal } from './components/ConfirmModal'
import type { ChatMessage } from './types/chat'

function App() {
  // 상태는 여기에서만 관리
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const pendingTimeoutRef = useRef<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const hasMessages = messages.length > 0

  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false)

  // 메시지 추가될 때마다 스크롤 맨 아래로
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 채팅 제출
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    const userText = query.trim()
    setQuery('')

    // 유저 메시지 추가
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: userText },
    ])

    setIsLoading(true)

    // 기존 타이머 있으면 정리
    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
    }

    try {
      // TODO: 나중에 여기에서 실제 백엔드 /api/chat 호출
      await new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: 'assistant',
              text: `LLM 응답 예시: "${userText}" 에 대한 답변입니다.`,
            },
          ])
          pendingTimeoutRef.current = null
          resolve()
        }, 1500)

        pendingTimeoutRef.current = id
      })
    } catch (err) {
      console.error('요청 중 에러 발생:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 응답 중지
  const handleStopResponse = () => {
    if (!isLoading) return

    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
    }
    setIsLoading(false)
  }

  // 로그인 제출
  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      console.log('이메일/비밀번호 입력 필요')
      return
    }

    console.log('로그인 시도:', { email, password })
    // TODO: /api/auth/login + JWT 저장
    setIsLoggedIn(true)
    handleCloseLoginModal()
  }

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
    setEmail('')
    setPassword('')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setMessages([])
  }

  // 대화 내역 삭제 여부
  const handleConfirmClearMessages = () => {
    setMessages([])
    setIsConfirmClearOpen(false)
  }

  const handleCancelClearMessages = () => {
    setIsConfirmClearOpen(false)
  }

  return (
    <div className="app">
      {/* 상단 헤더 */}
      <Header
        isLoggedIn={isLoggedIn}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        onClickLogin={() => setIsLoginModalOpen(true)}
        onClickLogout={handleLogout}
        onClearMessages={() => setIsConfirmClearOpen(true)}

      />

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        email={email}
        password={password}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onSubmit={handleLoginSubmit}
        onClose={handleCloseLoginModal}
      />

      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title="대화 내역 삭제"
        message="정말로 대화 내역을 모두 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmClearMessages}
        onCancel={handleCancelClearMessages}
      />

      {/* 메인 영역 */}
      <main className={`app-main ${hasMessages ? 'chat-mode' : ''}`}>
        {hasMessages ? (
          <div className="chat-layout">
            <MessageList
              messages={messages}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput
              query={query}
              onChangeQuery={setQuery}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              hasMessages={hasMessages}
              onStop={handleStopResponse}
            />
          </div>
        ) : (
          <ChatInput
            query={query}
            onChangeQuery={setQuery}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            hasMessages={false}
            onStop={handleStopResponse}
          />
        )}
      </main>
    </div>
  )
}

export default App