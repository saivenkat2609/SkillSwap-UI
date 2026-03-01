import { Box } from "@mui/material";
import { useParams } from "react-router";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import { getConversations, type Conversation } from "../Queries/message-queries";

export default function ChatPage() {
  const { userId } = useParams<{ userId: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    getConversations().then((res) => setConversations(res.data));
  }, []);

  const activeConversation = conversations.find((c) => c.userId === userId);

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>
      <ConversationsList activeUserId={userId} />
      <ChatWindow
        otherUserId={userId}
        otherUserName={activeConversation?.userName}
      />
    </Box>
  );
}
