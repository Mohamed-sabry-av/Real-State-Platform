// services/chat.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';

export interface Chat {
  _id: string;
  userIDs: string[];
  lastMessage?: string;
  seenBy?: string;
  messages?: Message[];
  createdAt: Date;
  updatedAt: Date;
  receiver?: any; // معلومات المستقبل
}

export interface Message {
  _id: string;
  chatId: string;
  userId: string | any;
  text: string;
  attachment?: string;
  attachmentType?: 'image' | 'document' | 'other';
  createdAt: Date;
  isRead?: boolean;
  tempId?: string; // للرسائل المؤقتة
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  private activeChatSubject = new BehaviorSubject<Chat | null>(null);
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private typingUsersSubject = new BehaviorSubject<Map<string, boolean>>(new Map());
  
  chats$ = this.chatsSubject.asObservable();
  activeChat$ = this.activeChatSubject.asObservable();
  messages$ = this.messagesSubject.asObservable();
  typingUsers$ = this.typingUsersSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private socketService: SocketService
  ) {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    // استقبال رسالة جديدة
    this.socketService.on('newMessage', (message: Message) => {
      const currentMessages = this.messagesSubject.value;
      
      // إضافة الرسالة للمحادثة النشطة
      if (this.activeChatSubject.value?._id === message.chatId) {
        this.messagesSubject.next([...currentMessages, message]);
      }
      
      // تحديث آخر رسالة في قائمة المحادثات
      this.updateChatLastMessage(message.chatId, message.text);
    });

    // استقبال إشعار الكتابة
    this.socketService.on('userTyping', ({ chatId, userId, isTyping }: { chatId: string, userId: string, isTyping: boolean }) => {
      const typingUsers = this.typingUsersSubject.value;
      if (isTyping) {
        typingUsers.set(userId, true);
      } else {
        typingUsers.delete(userId);
      }
      this.typingUsersSubject.next(new Map(typingUsers));
    });

        // استقبال تأكيد قراءة الرسائل
    this.socketService.on('messagesRead', ({ chatId, userId }:{chatId:any,userId:any}) => {
      const messages = this.messagesSubject.value;
      const updatedMessages = messages.map(msg => {
        if (msg.chatId === chatId && msg.userId !== userId) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      this.messagesSubject.next(updatedMessages);
    });
  }

  // إنشاء محادثة جديدة
  createChat(receiverId: string): Observable<Chat> {
    return this.apiService.postRequest<Chat>('api/chats', { receiverId });
  }

  // جلب كل المحادثات
  loadChats() {
    this.apiService.getRequest<Chat[]>('api/chats').subscribe({
      next: (chats) => {
        this.chatsSubject.next(chats);
      },
      error: (error) => console.error('Error loading chats:', error)
    });
  }

  // جلب محادثة واحدة مع الرسائل
  loadChat(chatId: string) {
    this.apiService.getRequest<Chat>(`api/chats/${chatId}`).subscribe({
      next: (chat) => {
        this.activeChatSubject.next(chat);
        this.messagesSubject.next(chat.messages || []);
        this.socketService.joinChat(chatId);
      },
      error: (error) => console.error('Error loading chat:', error)
    });
  }

  // إرسال رسالة
  sendMessage(chatId: string, text: string, file?: File): Observable<Message> {
    // إنشاء رسالة مؤقتة
    const tempMessage: Message = {
      _id: '',
      tempId: Date.now().toString(),
      chatId,
      userId: localStorage.getItem('userId') || '',
      text,
      createdAt: new Date(),
      isRead: false
    };

    // إضافة الرسالة المؤقتة للواجهة
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, tempMessage]);

    // إرسال للخادم
    const formData = new FormData();
    formData.append('text', text);
    if (file) {
      formData.append('attachment', file);
    }

    return new Observable(observer => {
      this.apiService.postRequest<Message>(`api/messages/${chatId}`, formData).subscribe({
        next: (message) => {
          // استبدال الرسالة المؤقتة بالرسالة الحقيقية
          const messages = this.messagesSubject.value;
          const updatedMessages = messages.map(msg => 
            msg.tempId === tempMessage.tempId ? message : msg
          );
          this.messagesSubject.next(updatedMessages);
          
          // إرسال عبر Socket
          this.socketService.sendMessage(chatId, message);
          
          observer.next(message);
          observer.complete();
        },
        error: (error) => {
          // إزالة الرسالة المؤقتة في حالة الفشل
          const messages = this.messagesSubject.value;
          const filteredMessages = messages.filter(msg => msg.tempId !== tempMessage.tempId);
          this.messagesSubject.next(filteredMessages);
          
          observer.error(error);
        }
      });
    });
  }

  // تغيير المحادثة النشطة
  setActiveChat(chat: Chat | null) {
    // مغادرة المحادثة السابقة
    if (this.activeChatSubject.value) {
      this.socketService.leaveChat(this.activeChatSubject.value._id);
    }
    
    this.activeChatSubject.next(chat);
    this.messagesSubject.next([]);
    
    if (chat) {
      this.loadChat(chat._id);
    }
  }

  // إرسال إشعار الكتابة
  sendTypingStatus(chatId: string, isTyping: boolean) {
    this.socketService.sendTyping(chatId, isTyping);
  }

  // تحديث آخر رسالة في قائمة المحادثات
  private updateChatLastMessage(chatId: string, lastMessage: string) {
    const chats = this.chatsSubject.value;
    const updatedChats = chats.map(chat => 
      chat._id === chatId ? { ...chat, lastMessage } : chat
    );
    this.chatsSubject.next(updatedChats);
  }

  // حذف محادثة
  deleteChat(chatId: string): Observable<any> {
    return this.apiService.deleteRequest(`api/chats/${chatId}`);
  }
}