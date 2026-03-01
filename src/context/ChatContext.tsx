import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";

interface ChatContextType {
  connection: HubConnection | null;
  unreadCount: number;
  activeChatUserId: string | null;
  setActiveChatUserId: (id: string | null) => void;
  sendMessage: (receiverId: string, message: string) => void;
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
      .withUrl("http://localhost:5211/chathub", { withCredentials: true })
      .withAutomaticReconnect()
      .build();
    const initializeConnection = async () => {
      await newConnection.start();
      setConnection(newConnection);
      newConnection.on(
        "ReceiveMessage",
        (messageObject: { senderId: string }) => {
          if (messageObject.senderId !== activeChatUserIdRef.current) {
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
  return (
    <ChatContext.Provider
      value={useMemo(() => {
        return {
          connection,
          unreadCount,
          activeChatUserId,
          setActiveChatUserId,
          sendMessage,
        };
      }, [
        connection,
        unreadCount,
        activeChatUserId,
        setActiveChatUserId,
        sendMessage,
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