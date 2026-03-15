import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box, Typography, CircularProgress, Avatar, Badge } from "@mui/material";
import { getConversations, type Conversation } from "../Queries/message-queries";
import { useChat } from "../../context/ChatContext";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

function timeAgo(dateStr: string) {
  const utcStr = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
  const diff = Date.now() - new Date(utcStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ConversationsList({ activeUserId }: { activeUserId?: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    getConversations()
      .then((res) => setConversations(res.data))
      .finally(() => setLoading(false));
  }, [unreadCount]); // refetch when unread count changes (new message arrived)

  return (
    <Box
      sx={{
        width: 300,
        flexShrink: 0,
        borderRight: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #e2e8f0" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
          Messages
        </Typography>
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
            <CircularProgress size={24} sx={{ color: "#4f46e5" }} />
          </Box>
        )}

        {!loading && conversations.length === 0 && (
          <Box sx={{ textAlign: "center", pt: 8, px: 3 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 40, color: "#cbd5e1", mb: 1 }} />
            <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
              No conversations yet
            </Typography>
          </Box>
        )}

        {conversations.map((conv) => {
          const isActive = conv.userId === activeUserId;
          return (
            <Box
              key={conv.userId}
              onClick={() => navigate(`/chat/${conv.userId}`)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: "pointer",
                bgcolor: isActive ? "#eef2ff" : "transparent",
                borderLeft: isActive ? "3px solid #4f46e5" : "3px solid transparent",
                transition: "all 0.15s ease",
                "&:hover": { bgcolor: isActive ? "#eef2ff" : "#f8fafc" },
              }}
            >
              <Badge badgeContent={conv.unreadCount} color="error" max={99}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {getInitials(conv.userName)}
                </Avatar>
              </Badge>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
                  <Typography
                    sx={{
                      fontWeight: conv.unreadCount > 0 ? 700 : 500,
                      fontSize: 14,
                      color: "#0f172a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conv.userName}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8", flexShrink: 0, ml: 1 }}>
                    {timeAgo(conv.lastMessageAt)}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: conv.unreadCount > 0 ? "#4f46e5" : "#64748b",
                    fontWeight: conv.unreadCount > 0 ? 600 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {conv.lastMessage}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
