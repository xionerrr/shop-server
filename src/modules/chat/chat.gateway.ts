import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets'
import { SubscribeMessage } from '@nestjs/websockets/decorators'

@WebSocketGateway(8000, { cors: '*' })
export class ChatGateway {
  @WebSocketServer()
  server

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log(message)
    this.server.emit('message', message)
  }
}
