import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import api from "../lib/api";

interface ChatContextType {
  connection: HubConnection | null;
  unreadCount: number;
  activeChatUserId: string | null;
  setActiveChatUserId: (id: string | null) => void;
  sendMessage: (receiverId: string, message: string) => void;
  refreshUnread: () => Promise<void>;
}
const ChatContext = createContext<ChatContextType | null>(null);

export default function ChatProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeChatUserId, _setActiveChatUserId] = useState<string | null>(
    null,
  );
  const { userData, isLoading } = useAuth();
  const activeChatUserIdRef = useRef<string | null>(null);

  const setActiveChatUserId = (id: string | null) => {
    activeChatUserIdRef.current = id;
    _setActiveChatUserId(id);
  };
  useEffect(() => {
    if (!userData || isLoading) return;
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_BFF_URL || "http://localhost:5211"}/chathub`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();
    const initializeConnection = async () => {
      await newConnection.start();
      setConnection(newConnection);
      newConnection.on(
        "ReceiveMessage",
        (messageObject: { senderId: string }) => {
          if (
            messageObject.senderId !== userData.id &&
            messageObject.senderId !== activeChatUserIdRef.current
          ) {
            setUnreadCount((prev) => prev + 1);
          }
        },
      );
    }; 
    initializeConnection();
    return () => {
      newConnection.off("ReceiveMessage");
      newConnection.stop();
    };
  }, [userData, isLoading]);
  const sendMessage = async (receiverId: string, message: string) => {
    connection?.invoke("SendMessage", receiverId, message);
  };

  const refreshUnread = async () => {
    const res = await api.get<number>("/api/messages/unread-count");
    setUnreadCount(res.data);
  };
  return (
    <ChatContext.Provider
      value={useMemo(() => {
        return {
          connection,
          unreadCount,
          activeChatUserId,
          setActiveChatUserId,
          sendMessage,
          refreshUnread,
        };
      }, [
        connection,
        unreadCount,
        activeChatUserId,
        setActiveChatUserId,
        sendMessage,
        refreshUnread,
      ])}
    >
      {children}
    </ChatContext.Provider>
  );
}
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}