// src/pages/account/Messages.jsx
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../lib/api";
import EmptyState from "../../components/EmptyState";

const buildKey = (a, b) => [a, b].sort().join(":"); // khớp BE

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // container khung chat + state để biết có đang bám đáy không
  const containerRef = useRef(null);
  const [autoStick, setAutoStick] = useState(true);

  // Theo dõi người dùng có đang ở gần đáy hay không
  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 40; // px cho phép
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    setAutoStick(atBottom);
  };

  // Auto scroll xuống đáy khi có tin nhắn mới (chỉ khi đang bám đáy)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (autoStick) {
      el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
    }
  }, [messages, activeUser, autoStick]);

  // Lấy current user + danh sách user khác
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    try {
      const decoded = jwtDecode(token);
      const id =
        decoded.sub ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        decoded.userId ||
        null;

      setCurrentUserId(id);

      // baseURL đã có /api sẵn nên thêm "api/..."
      api.get("api/users").then((res) => {
        const all = res.data || [];
        setUsers(all.filter((u) => u.id !== id));
      });
    } catch (err) {
      console.error("Decode token error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load thread khi chọn 1 user
  useEffect(() => {
    if (!activeUser || !currentUserId) return;

    const key = buildKey(currentUserId, activeUser.id);
    // console.log("🔑 conversationKey:", key);

    api
      .get(`api/messages/thread/${key}`)
      .then((res) => {
        // console.log("📥 thread resp:", res.data);
        setMessages(res.data || []);
        // bám đáy ngay sau khi đổi cuộc chat
        setTimeout(() => {
          const el = containerRef.current;
          if (el) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
        }, 0);
      })
      .catch((err) => {
        console.error("Messages error:", err.response?.data || err.message);
        setMessages([]);
      });
  }, [activeUser, currentUserId]);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!text.trim() || !activeUser || !currentUserId) return;
    try {
      const res = await api.post("api/messages", {
        receiverId: activeUser.id,
        text,
      });

      const saved =
        res.data || {
          id: crypto.randomUUID(),
          senderId: currentUserId,
          receiverId: activeUser.id,
          text,
          createdAt: new Date().toISOString(),
        };

      setMessages((prev) => [...prev, saved]);
      setText("");
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
    }
  };

  if (loading) return <p className="p-4">Đang tải...</p>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Sidebar: danh sách người dùng */}
      <div className="lg:col-span-1 card p-4">
        <div className="font-semibold mb-3">Người dùng</div>
        {users.length === 0 ? (
          <EmptyState title="Không có người dùng nào khác" />
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => {
                  setActiveUser(u);
                  setMessages([]); // clear trước khi load thread mới
                }}
                className={`cursor-pointer p-3 rounded-xl border ${
                  activeUser?.id === u.id
                    ? "border-brand-600 bg-brand-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="font-medium">👤 {u.fullName || u.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main chat */}
      <div className="lg:col-span-2 card p-4 flex flex-col">
        {activeUser ? (
          <div className="flex-1 flex flex-col">
            <div className="font-semibold mb-3">
              Đang chat với {activeUser.fullName || activeUser.email}
            </div>

            {/* Khung chat cố định */}
            <div className="border rounded-lg bg-slate-50 p-4 h-[400px] flex flex-col">
              <div
                ref={containerRef}
                onScroll={onScroll}
                className="flex-1 overflow-y-auto space-y-3 overscroll-contain"
              >
                {messages.length === 0 ? (
                  <EmptyState title="Chưa có tin nhắn nào" />
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md border text-slate-900 break-words ${
                        m.senderId === currentUserId
                          ? "ml-auto bg-white border-brand-200"
                          : "mr-auto bg-white border-slate-200"
                      }`}
                      title={
                        m.createdAt
                          ? new Date(m.createdAt).toLocaleString()
                          : ""
                      }
                    >
                      {m.text}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input flex-1"
                placeholder="Nhập tin nhắn..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="btn btn-primary" onClick={sendMessage}>
                Gửi
              </button>
            </div>
          </div>
        ) : (
          <EmptyState title="Chọn một người để bắt đầu chat" />
        )}
      </div>
    </div>
  );
}
