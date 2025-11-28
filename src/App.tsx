import { useEffect, useRef, useState, type FormEvent } from 'react'
import './App.css'
import { Header } from './components/Header'
import { LoginModal } from './components/LoginModal'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { ConfirmModal } from './components/ConfirmModal'
import { SignUpModal } from './components/SignUpModal'
import type { ChatMessage } from './types/chat'
import { signin, signup } from './api/auth'
import { sendChat } from './api/chat'

function App() {
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // 로그인 여부도 토큰 존재 여부로 초기화
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'))
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 회원가입 모달용 상태
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState('')

  // 응답 로딩
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

  // 게스트용 sessionId
  const [sessionId] = useState(() => {
    // 비로그인 게스트용 임시 아이디
    return 'guest-' + crypto.randomUUID()
  })

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

    try {
      const res = await sendChat(
        {
          userQuery: userText,
          sessionId: isLoggedIn ? undefined : sessionId,
        },
        token ?? undefined // 로그인 유저면 JWT 전달
      )

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: res.answer },
      ])
    } catch (err) {
      console.error(err)
      alert('챗봇 요청 실패: ' + (err as Error).message)
    } finally {
      setIsLoading(false)
    }

    // 기존 타이머 있으면 정리
    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
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

  // 토큰은 localStorage에서 초기값 읽기
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  )

  // 로그인 제출
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) return

    try {
      const res = await signin({ email, password })
      setToken(res.bearerToken)
      localStorage.setItem('token', res.bearerToken)
      handleCloseLoginModal()
    } catch (err) {
      console.error(err)
      const message =
        err instanceof TypeError
          ? '서버에 연결할 수 없습니다. 백엔드가 켜져 있는지 확인해주세요'
          : (err as Error).message

      alert('로그인 실패: ' + (err as Error).message)
    }
  }

  // 회원가입 제출
  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!signUpEmail.trim() || !signUpPassword.trim()) return
    if (signUpPassword !== signUpPasswordConfirm) {
      alert('비밀번호 확인이 일치하지 않습니다.')
      return
    }

    try {
      const res = await signup({
        email: signUpEmail,
        password: signUpPassword,
      })
      // 회원가입 후 자동 로그인 처리
      setToken(res.bearerToken)
      localStorage.setItem('token', res.bearerToken)
      setIsSignUpModalOpen(false)
    } catch (err) {
      console.error(err)
      const message =
        err instanceof TypeError
          ? '서버에 연결할 수 없습니다. 백엔드가 켜져 있는지 확인해제수요'
          : (err as Error).message

      alert('회원가입 실패: ' + (err as Error).message)
    }
  }

  // 로그인 모달 닫기
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
    setEmail('')
    setPassword('')
  }

  // 회원가입 모달 닫기
  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false)
    setSignUpEmail('')
    setSignUpPassword('')
    setSignUpPasswordConfirm('')
  }

  // 로그아웃 토큰 삭제
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('token')
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
        onClickSignUp={() => {
          // 로그인 모달 닫고 회원가입 모달 열기
          setIsLoginModalOpen(false)
          setIsSignUpModalOpen(true)
        }}
      />

      {/* 회원가입 모달 */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        email={signUpEmail}
        password={signUpPassword}
        passwordConfirm={signUpPasswordConfirm}
        onChangeEmail={setSignUpEmail}
        onChangePassword={setSignUpPassword}
        onChangePasswordConfirm={setSignUpPasswordConfirm}
        onSubmit={handleSignUpSubmit}
        onClose={handleCloseSignUpModal}
      />

      {/* 대화 내역 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title="대화 내역 삭제"
        message="정말로 대화 내역을 모두 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmClearMessages}
        onCancel={handleCancelClearMessages}
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