import api from "../../lib/api";

export interface Message {
  messageId: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  readAt: string | null;
}

export interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export const getConversations = () =>
  api.get<Conversation[]>("/api/messages/conversations");

export const getMessageHistory = (otherUserId: string) =>
  api.get<Message[]>(`/api/messages/${otherUserId}`);

export const markAsRead = (userId: string) =>
  api.put(`/api/messages/mark-as-read/${userId}`);
