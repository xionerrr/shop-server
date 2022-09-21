export type T_UserId = number

export enum E_Chat {
  requestChatMessages = 'requestChatMessages',
  getChatMessages = 'getChatMessages',
  sendChatMessage = 'sendChatMessage',
  getChatMessage = 'getChatMessage',
}

export interface I_ChatUser {
  socketId: string
  id: T_UserId
  email: string
}

export interface I_ChatMessage {
  id: string
  text: string
  author: string
  authorId: T_UserId
}
