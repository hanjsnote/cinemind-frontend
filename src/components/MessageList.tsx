import type { RefObject } from 'react'
import type { ChatMessage } from '../types/chat'

type MessageListProps = {
  messages: ChatMessage[]
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  return (
    <section className="chat-messages">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-message ${msg.role === 'user'
              ? 'chat-message-user'
              : 'chat-message-assistant'
            }`}
        >
          {/* assistant 메시지일 때만 시간 표시 */}
          {msg.role === 'assistant' && msg.elapsedSeconds != null && (
            <div className="chat-message-time">
              {msg.elapsedSeconds.toFixed(1)} s
            </div>
          )}

          <div className="chat-message-bubble">{msg.text}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </section>
  )
}