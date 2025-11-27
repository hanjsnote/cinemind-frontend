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
          className={`chat-message ${
            msg.role === 'user'
              ? 'chat-message-user'
              : 'chat-message-assistant'
          }`}
        >
          <div className="chat-message-bubble">{msg.text}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </section>
  )
}