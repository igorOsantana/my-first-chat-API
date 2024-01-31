import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  AUTH_SERVICES,
  TAuthServices,
} from 'src/auth/interfaces/service.interface';
import { ChatEntity } from 'src/chat/chat.entity';
import { TEventCreateNewChatInput } from 'src/chat/chat.interface';
import { ChatPresenter } from 'src/chat/chat.presenter';
import {
  CHAT_USECASES,
  TCreateChatUseCase,
  TFindByIdChatUseCase,
  TMarkAsReadChatUseCase,
} from 'src/chat/interfaces/use-case.interface';
import {
  MESSAGE_USE_CASES,
  TMessageUseCaseSend,
} from './interfaces/use-case.interface';
import { MessageEntity } from './message.entity';
import { TEventSendNewMessageInput } from './message.interface';
import { MessagePresenter } from './message.presenter';

@WebSocketGateway(undefined, {
  transports: ['websocket'],
  cors: '*',
})
export class MessageWebSocketGateway implements OnGatewayConnection {
  private connectedClients: Map<string, Socket> = new Map();
  constructor(
    @Inject(AUTH_SERVICES)
    private readonly authServices: TAuthServices,
    @Inject(CHAT_USECASES.MARK_AS_READ)
    private readonly markAsReadChatUseCase: TMarkAsReadChatUseCase,
    @Inject(CHAT_USECASES.CREATE)
    private readonly createChatUseCase: TCreateChatUseCase,
    @Inject(CHAT_USECASES.FIND_BY_ID)
    private readonly findByIdChatUseCase: TFindByIdChatUseCase,
    @Inject(MESSAGE_USE_CASES.SEND)
    private readonly messageUseCaseSend: TMessageUseCaseSend,
  ) {}

  async handleConnection(client: Socket) {
    console.log('trying to connecting');
    const userId = await this.extractUserIdFromSocket(client);

    if (userId) {
      this.connectedClients.set(userId, client);
      console.log('connected: ', userId);
    } else {
      console.error('Missing token.');
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = await this.extractUserIdFromSocket(client);
    this.connectedClients.delete(userId);
    console.log('disconnected: ', userId);
  }

  @SubscribeMessage('markChatAsRead')
  async markChatAsRead(client: Socket, chatId: string) {
    const userId = await this.extractUserIdFromSocket(client);
    await this.markAsReadChatUseCase.execute({ id: chatId, userId });
  }

  @SubscribeMessage('createNewChat')
  async createNewChat(client: Socket, payload: TEventCreateNewChatInput) {
    try {
      const reqUserId = await this.extractUserIdFromSocket(client);

      const newChat = await this.createChatUseCase.execute({
        ...payload,
        senderId: reqUserId,
      });
      newChat.setDataByReqUserId(reqUserId);

      const recipientId = newChat.recipient.id;
      const recipientClient = this.connectedClients.get(recipientId);

      this.emitReceiveNewChatEvent(client, newChat, reqUserId, recipientClient);
    } catch (error) {
      console.error(error);
    }
  }

  private emitReceiveNewChatEvent(
    client: Socket,
    newChat: ChatEntity,
    reqUserId: string,
    recipientClient: Socket,
  ) {
    client.emit('receiveNewChat', new ChatPresenter(newChat, reqUserId));

    if (recipientClient) {
      recipientClient.emit(
        'receiveNewChat',
        new ChatPresenter(newChat, reqUserId),
      );
    }
  }

  @SubscribeMessage('sendNewMessage')
  async sendNewMessage(client: Socket, payload: TEventSendNewMessageInput) {
    try {
      const userId = await this.extractUserIdFromSocket(client);

      const chat = await this.findByIdChatUseCase.execute(payload.chatId);
      chat.setDataByReqUserId(userId);

      const recipientClient = this.connectedClients.get(chat.recipient.id);
      const newMessage = await this.messageUseCaseSend.execute({
        ...payload,
        ownerId: userId,
      });

      this.emitReceiveNewMessageEvent(client, newMessage, recipientClient);
    } catch (error) {
      console.error(error);
    }
  }

  private emitReceiveNewMessageEvent(
    client: Socket,
    newMessage: MessageEntity,
    recipientClient: Socket,
  ) {
    client.emit('receiveNewMessage', new MessagePresenter(newMessage));

    if (recipientClient) {
      recipientClient.emit(
        'receiveNewMessage',
        new MessagePresenter(newMessage),
      );
    }
  }

  private async extractUserIdFromSocket(
    socket: Socket,
  ): Promise<string | null> {
    const token = socket.handshake.query.token;
    if (token && typeof token === 'string') {
      const payload = this.authServices.verifyToken(token);
      return payload.sub;
    }

    return null;
  }
}
