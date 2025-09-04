export interface Chat {
  _id: string;
  userIDs: string[];
  lastMessage?: string;
  seenBy?: string;
  messages?: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  chatId: string;
  userId: string | any;
  text: string;
  attachment?: string;
  attachmentType?: 'image' | 'document' | 'other';
  createdAt: Date;
}