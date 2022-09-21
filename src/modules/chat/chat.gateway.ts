import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets'
import { Logger, UseGuards } from '@nestjs/common'
import { SubscribeMessage } from '@nestjs/websockets/decorators'
import { AuthGuard } from '@nestjs/passport'
import { Socket } from 'socket.io'

import { E_Chat, I_ChatMessage, I_ChatUser } from 'models/sockets/chat'
import { PrismaService } from 'modules/prisma/prisma.service'
import { ChatService } from './chat.service'

@WebSocketGateway(8000, { cors: '*' })
export class ChatGateway {
  constructor(private chat: ChatService, private prisma: PrismaService) {}

  @WebSocketServer()
  server

  private logger: Logger = new Logger('LobbyChatGateway')

  users: I_ChatUser[] = []

  async afterInit() {
    this.logger.log('Init LobbyChatGateway')
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected LobbyGateway: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('test')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message)
  }

  @SubscribeMessage(E_Chat.requestChatMessages)
  getAllMessages(client: Socket) {
    const messages = this.chat.getAllMessages()

    const payload: { messages: I_ChatMessage[] } = {
      messages,
    }

    client.emit(E_Chat.getChatMessages, payload)
  }

  @SubscribeMessage(E_Chat.sendChatMessage)
  async sendChatMessage(client: Socket, data: { text: string }) {
    const usersDB = await this.prisma.user.findMany()
    console.log(usersDB)
    this.users = usersDB.map(
      (user): I_ChatUser => ({
        id: user.id,
        email: user.email,
        socketId: client.id,
      }),
    )
    const user = this.users.find((user) => user.socketId === client.id)
    const message = this.chat.createMessage(user, data.text)
    const messageLobbyPayload: { message: I_ChatMessage } = {
      message,
    }
    this.server.emit(E_Chat.getChatMessage, messageLobbyPayload)
  }
}
