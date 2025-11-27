import type { FormEvent } from 'react'

type ChatInputProps = {
  query: string
  onChangeQuery: (value: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  hasMessages: boolean
  onStop: () => void
}

export function ChatInput({
  query,
  onChangeQuery,
  onSubmit,
  isLoading,
  hasMessages,
  onStop,
}: ChatInputProps) {
  return (
    <form
      className={`chat-input ${hasMessages ? 'chat-input-bottom' : ''}`}
      onSubmit={onSubmit}
    >
      <input
        type="text"
        placeholder="Cine Mind 영화 관련 정보 챗봇입니다."
        value={query}
        onChange={(e) => onChangeQuery(e.target.value)}
        disabled={isLoading}
      />

      {isLoading ? (
        <div className="chat-actions">
          <div className="spinner" />
          <button
            type="button"
            className="icon-button stop-button"
            onClick={onStop}
          >
            <span className="icon">■</span>
          </button>
        </div>
      ) : (
        <button type="submit" className="icon-button send-button">
          <span className="icon">▶</span>
        </button>
      )}
    </form>
  )
}