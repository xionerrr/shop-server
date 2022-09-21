import { v4 } from 'uuid'

import { I_ChatMessage, I_ChatUser } from 'models/sockets/chat'

export class ChatService {
  messages: I_ChatMessage[] = [
    { author: 'authorMessage', authorId: 1, id: 'id1', text: 'text' },
  ]

  getAllMessages(): I_ChatMessage[] {
    return this.messages
  }

  createMessage(user: I_ChatUser, text: string): I_ChatMessage {
    const messagedId = v4()
    const message: I_ChatMessage = {
      id: messagedId,
      text,
      authorId: user.id,
      author: user.email,
    }

    this.messages.push(message)

    return message
  }
}
