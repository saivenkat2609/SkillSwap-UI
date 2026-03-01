import { useEffect, useRef, useState } from "react";
import { Box, Typography, CircularProgress, Avatar, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { getMessageHistory, markAsRead, type Message } from "../Queries/message-queries";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface Props {
  otherUserId?: string;
  otherUserName?: string;
}

export default function ChatWindow({ otherUserId, otherUserName }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { connection, sendMessage, setActiveChatUserId } = useChat();
  const { userData } = useAuth();

  // Load history + mark as read when opening a conversation
  useEffect(() => {
    if (!otherUserId) return;

    setActiveChatUserId(otherUserId);
    setLoading(true);
    setMessages([]);

    getMessageHistory(otherUserId)
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));

    markAsRead(otherUserId).catch(() => {});

    return () => setActiveChatUserId(null);
  }, [otherUserId]);

  // Listen for real-time messages in this conversation
  useEffect(() => {
    if (!connection || !otherUserId) return;

    const handler = (msg: Message) => {
      if (msg.senderId === otherUserId || msg.senderId === userData?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    connection.on("ReceiveMessage", handler);
    return () => connection.off("ReceiveMessage", handler);
  }, [connection, otherUserId, userData?.id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !otherUserId) return;
    sendMessage(otherUserId, text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Empty state
  if (!otherUserId) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc",
          gap: 1,
        }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: 56, color: "#cbd5e1" }} />
        <Typography sx={{ fontWeight: 600, color: "#64748b", fontSize: 16 }}>
          Select a conversation
        </Typography>
        <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
          Choose a conversation from the left to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#f8fafc", minWidth: 0 }}>
      {/* Chat Header */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #4f46e5, #6366f1)",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {getInitials(otherUserName || "?")}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>
            {otherUserName}
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
            <CircularProgress size={24} sx={{ color: "#4f46e5" }} />
          </Box>
        )}

        {!loading && messages.length === 0 && (
          <Box sx={{ textAlign: "center", pt: 6 }}>
            <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
              No messages yet. Say hi! 👋
            </Typography>
          </Box>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === userData?.id;
          return (
            <Box
              key={msg.messageId}
              sx={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}
            >
              <Box
                sx={{
                  maxWidth: "65%",
                  px: 2,
                  py: 1,
                  borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  bgcolor: isMine ? "#4f46e5" : "#ffffff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  border: isMine ? "none" : "1px solid #e2e8f0",
                }}
              >
                <Typography sx={{ fontSize: 14, color: isMine ? "#ffffff" : "#0f172a", lineHeight: 1.5 }}>
                  {msg.content}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: isMine ? "rgba(255,255,255,0.65)" : "#94a3b8",
                    mt: 0.25,
                    textAlign: "right",
                  }}
                >
                  {formatTime(msg.sentAt)}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          gap: 1.5,
          alignItems: "flex-end",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#f8fafc",
              fontSize: 14,
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!text.trim()}
          sx={{
            bgcolor: "#4f46e5",
            color: "#fff",
            width: 40,
            height: 40,
            flexShrink: 0,
            "&:hover": { bgcolor: "#4338ca" },
            "&:disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
