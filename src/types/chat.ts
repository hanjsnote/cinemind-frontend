export type ChatMessage = {
    id : number
    role: 'user' | 'assistant'
    text: string
    // 응답시간
    elapsedSeconds?: number
}