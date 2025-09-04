// services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  
  onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
      autoConnect: false
    });

    this.setupSocketListeners();
  }

  connect(userId: string) {
    this.socket.auth = { userId };
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  private setupSocketListeners() {
    // استقبال المستخدمين المتصلين
    this.socket.on('onlineUsers', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    });

    // استقبال رسالة جديدة
    this.socket.on('newMessage', (data) => {
      // سنتعامل معها في Chat Service
    });

    // إشعار بأن المستخدم يكتب
    this.socket.on('typing', (data) => {
      // سنتعامل معها لاحقاً
    });
  }

  // إرسال رسالة
  sendMessage(chatId: string, message: any) {
    this.socket.emit('sendMessage', { chatId, message });
  }

  // الانضمام لمحادثة
  joinChat(chatId: string) {
    this.socket.emit('joinChat', chatId);
  }

  // مغادرة محادثة
  leaveChat(chatId: string) {
    this.socket.emit('leaveChat', chatId);
  }

  // إشعار بالكتابة
  sendTyping(chatId: string, isTyping: boolean) {
    this.socket.emit('typing', { chatId, isTyping });
  }

  // الاستماع لحدث معين
  on(eventName: string, callback: Function) {
    // this.socket.on(eventName, callback);
  }

  // إلغاء الاستماع
  off(eventName: string) {
    this.socket.off(eventName);
  }
}