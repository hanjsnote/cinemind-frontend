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
import type { ChatLogResponse } from './types/api'
import { fetchChatLogs } from './api/chat'
import { useTypewriter } from './hooks/useTypewriter'

function App() {
  // ===== 인증 / 로그인 관련 상태 =====

  // JWT 토큰 (없으면 null) - localStorage 초기값을 읽어옴
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  )

  // 토큰 존재 여부로 로그인 상태 계산 (따로 set할 필요 없음)
  const isLoggedIn = !!token

  // 상단 ... 메뉴 열림 여부
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 로그인 모달 열림 여부
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // 회원가입 모달 열림 여부
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)

  // 로그인 폼 입력값
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 회원가입 폼 입력값
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState('')

  // ===== 채팅 관련 상태 =====

  // 입력창에 적고 있는 텍스트
  const [query, setQuery] = useState('')

  // 대화 메시지 리스트
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // 챗봇 응답 로딩 여부 (스피너 / 정지 버튼 표시용)
  const [isLoading, setIsLoading] = useState(false)

  // 스크롤을 마지막 메시지로 내리기 위한 ref
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // "대화 내역 삭제" 확인 모달 열림 여부
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false)

  // 한 번이라도 메시지가 있으면 true → 레이아웃을 chat 모드로
  const hasMessages = messages.length > 0

  // 비로그인 게스트 전용 sessionId (컴포넌트 최초 마운트 시 한 번만 생성)
  const [sessionId] = useState(() => 'guest-' + crypto.randomUUID())

  // 챗봇 응답 타자 효과
  const { startTypewriter } = useTypewriter(setMessages, setIsLoading)

  // ===== 공통 효과 =====

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 로그인된 유저의 지난 대화 불러오기
  useEffect(() => {
    if (!token) return            // 비로그인/게스트면 아무것도 안 함

    fetchChatLogs(token)
      .then((logs) => {
        setMessages(mapLogsToMessages(logs))
      })
      .catch((e) => {
        console.error('초기 대화 로그 로드 실패', e)
      })
  }, [token])

  // ===== 핸들러들 =====

  // 채팅 전송
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    const userText = query.trim()
    setQuery('')

    // 1) 사용자 메시지 추가
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: userText },
    ])

    setIsLoading(true)

    // 2) 응답 시간 측정 시작
    const start = performance.now()

    try {
      // 로그인 상태면 JWT 기반(user_id)으로, 비로그인 상태면 sessionId 기반으로 메모리 분리
      const res = await sendChat(
        {
          userQuery: userText,
          sessionId: isLoggedIn ? undefined : sessionId,
        },
        token ?? undefined // 로그인 유저면 Authorization 헤더에 토큰 전달
      )

      const end = performance.now()
      // 소수 1자리까지(예: 4.3s)
      const elapsedSeconds = Math.round((end - start) / 100) / 10

      const assistantId = Date.now() + 1

      // 3) 챗봇 응답 메시지 + 응답 시간 저장
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          text: '',
          elapsedSeconds,
        },
      ])

      // 훅이 제공하는 함수 호출
      startTypewriter(assistantId, res.answer)
    } catch (err) {
      console.error(err)
      alert('챗봇 요청 실패: ' + (err as Error).message)
      setIsLoading(false)
    } 
  }

  // 응답 중지 버튼 (현재는 로딩 UI만 꺼줌)
  const handleStopResponse = () => {
    if (!isLoading) return
    setIsLoading(false)
  }

  // 로그인 폼 제출
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    try {
      const res = await signin({ email, password })

      const bearerToken = res.bearerToken

      // 토큰 상태 + localStorage 둘 다 저장
      setToken(bearerToken)
      localStorage.setItem('token', bearerToken)

      // 로그인 모달 닫기 + 폼 초기화
      handleCloseLoginModal()

      // 서버 대화로그 가져오기 
      try {
        const logs = await fetchChatLogs(bearerToken)
        const historyMessages = mapLogsToMessages(logs)

        // 게스트로 주고받은 메시지는 버리고 로그인 유저의 DB 히스토리로 messages를 교체
        setMessages(historyMessages)
      } catch (historyError) {
        console.error('대화 로그 불러오기 실패', historyError)
        // 실패하더라도 로그인 자체는 유지
      }
    } catch (err) {
      console.error(err)
      const message =
        err instanceof TypeError
          ? '서버에 연결할 수 없습니다. 백엔드가 켜져 있는지 확인해주세요.'
          : (err as Error).message

      alert('로그인 실패: ' + message)
    }
  }

  // 회원가입 폼 제출
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

      // 회원가입 후 자동 로그인
      setToken(res.bearerToken)
      localStorage.setItem('token', res.bearerToken)
      setIsSignUpModalOpen(false)
    } catch (err) {
      console.error(err)
      const message =
        err instanceof TypeError
          ? '서버에 연결할 수 없습니다. 백엔드가 켜져 있는지 확인해주세요.'
          : (err as Error).message

      alert('회원가입 실패: ' + message)
    }
  }

  // 로그인 모달 닫기 + 입력값 초기화
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
    setEmail('')
    setPassword('')
  }

  // 회원가입 모달 닫기 + 입력값 초기화
  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false)
    setSignUpEmail('')
    setSignUpPassword('')
    setSignUpPasswordConfirm('')
  }

  // 로그아웃: 토큰 삭제 + 대화 초기화
  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setMessages([])
  }

  // "대화 내역 삭제" 모달에서 삭제 확정
  const handleConfirmClearMessages = () => {
    setMessages([])
    setIsConfirmClearOpen(false)
  }

  // "대화 내역 삭제" 모달에서 취소
  const handleCancelClearMessages = () => {
    setIsConfirmClearOpen(false)
  }

  // ===== 렌더링 =====

  return (
    <div className="app">
      {/* 상단 헤더 (... 메뉴 + 로그인/로그아웃) */}
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
          // 로그인 모달 닫고 → 회원가입 모달 열기
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

      {/* 메인 영역 (대화 + 입력창) */}
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

// 백엔드 ChatLogResponse -> 프론트 ChatMessage 변환 함수
function mapLogsToMessages(logs: ChatLogResponse[]): ChatMessage[] {
  return logs.map((log, index) => {
    const role = log.role === 'USER' ? 'user' : 'assistant'

    // createdAt 을 숫자로 바꿔서 id로 써도 되고, 단순 index 써도 됨
    const id = Date.parse(log.createdAt) || index

    return {
      id,
      role,
      text: log.content,
    }
  })
}