import { useEffect, useState, useRef, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import DOMPurify from "dompurify"; // npm i dompurify
import api from "../../lib/api";
import EmptyState from "../../components/EmptyState";

// Nếu cần lấy projectId từ conversationKey khi gửi tin
const parseKey = (key = "") => {
  const [projectId = "null", receiverId = "", senderId = ""] = String(key).split(":");
  return { projectId, receiverId, senderId };
};

// ---- Helper: normalize Mongo Extended JSON -> object phẳng cho FE ----
function normalizeMessage(m = {}) {
  const getOid = (o) => (o && o.$oid) || o || null;
  const getDate = (d) => {
    if (!d) return null;
    // Hỗ trợ: {$date: {$numberLong: "1759269348500"}} hoặc {$date: "2025-10-01T...Z"} hoặc timestamp số
    const raw = (d.$date && (d.$date.$numberLong || d.$date)) || d;
    const n = Number(raw);
    try {
      return Number.isFinite(n) ? new Date(n).toISOString() : new Date(raw).toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  return {
    id: getOid(m._id) || m.id || crypto.randomUUID(),
    conversationKey: m.conversationKey || "",
    projectId: getOid(m.projectId) || m.projectId || null,
    senderId: getOid(m.senderId) || m.senderId || null,
    receiverId: getOid(m.receiverId) || m.receiverId || null,
    text: m.text || m.html || "",
    createdAt: getDate(m.createdAt) || new Date().toISOString(),
    isRead: Boolean(m.isRead),
  };
}

// ---- Helper: xác định chuỗi có phải HTML không ----
const isHtml = (s) => typeof s === "string" && /^\s*</.test(s);

// ---- Helper: gọi API hành động proposal trong HTML embed ----
async function handleProposalAction(action, proposalId, projectId) {
  // Điều chỉnh route theo BE của bạn
  const url = `api/proposals/${proposalId}/${action}`;
  const payload = { projectId };
  const res = await api.post(url, payload);
  return res.data;
}

export default function Messages() {
  // STATE
  const [usersMap, setUsersMap] = useState(new Map()); // id -> user
  const [conversations, setConversations] = useState([]); // {conversationKey, partnerId, ...}
  const [activeUser, setActiveUser] = useState(null);
  const [activeConversationKey, setActiveConversationKey] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // REF + auto-stick
  const containerRef = useRef(null);
  const [autoStick, setAutoStick] = useState(true);

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 40;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    setAutoStick(atBottom);
  };

  // Auto scroll xuống đáy khi có tin mới / đổi user (nếu đang bám đáy)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (autoStick) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, [messages, activeUser, autoStick]);

  // Lấy current user từ JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    try {
      const decoded = jwtDecode(token);
      const id =
        decoded.sub ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded.userId ||
        null;
      setCurrentUserId(id);
    } catch (err) {
      console.error("Decode token error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load conversations và users
  useEffect(() => {
    if (!currentUserId) return;

    const load = async () => {
      try {
        // 1) Danh sách hội thoại của user
        // Nên dùng all lower-case để nhất quán route
        const { data: convs } = await api.get("api/messages/my-conversations");
        const list = Array.isArray(convs) ? convs : [];
        console.log("Conversations from API:", list);
        setConversations(list);

        // 2) Lấy thông tin user đối tác
        const { data: allUsers } = await api.get("api/users");
        const newMap = new Map(
          (allUsers || []).map((u) => {
            const key = u.id || u._id || u.userId; // bắt mọi biến thể
            return [key, u];
          })
        );
        setUsersMap(newMap);
        console.log("UsersMap:", Array.from(newMap.entries()));

        // 3) Auto chọn conv đầu tiên nếu chưa có
        if (!activeUser && list.length > 0) {
          const first = list[0];
          const firstPartner = newMap.get(first.partnerId);
          if (firstPartner) {
            setActiveUser(firstPartner);
            setActiveConversationKey(first.conversationKey);
          }
        }
      } catch (err) {
        console.error("Load conversations error:", err?.response?.data || err?.message);
        setConversations([]);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // Load thread theo conversationKey, normalize dữ liệu
  useEffect(() => {
    if (!activeConversationKey || !currentUserId) return;
    api
      .get(`api/messages/thread/${activeConversationKey}`)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : [];
        const normalized = raw.map(normalizeMessage);
        console.log("Thread normalized:", normalized);
        setMessages(normalized);

        // bám đáy sau khi đổi cuộc chat
        setTimeout(() => {
          const el = containerRef.current;
          if (el) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
        }, 0);
      })
      .catch((err) => {
        console.error("Messages error:", err.response?.data || err.message);
        setMessages([]);
      });
  }, [activeConversationKey, currentUserId]);

  // Event delegation: nghe click nút trong HTML embed (proposal-card)
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onClick = async (e) => {
      const btn = e.target.closest?.("button[data-action]");
      if (!btn || !root.contains(btn)) return;

      const card = btn.closest(".proposal-card");
      if (!card) return;

      const action = btn.getAttribute("data-action"); // accept | reject | cancel
      const proposalId = card.getAttribute("data-proposal-id");
      const projectId = card.getAttribute("data-project-id");
      if (!action || !proposalId) return;

      try {
        btn.disabled = true;
        console.log("Proposal action:", { action, proposalId, projectId });
        await handleProposalAction(action, proposalId, projectId);

        // Thêm 1 system message nhẹ để feedback
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            senderId: "system",
            receiverId: currentUserId,
            text: `Đã ${
              action === "accept" ? "đồng ý" : action === "reject" ? "từ chối" : "huỷ"
            } đề xuất #${proposalId}`,
            createdAt: new Date().toISOString(),
            isRead: true,
          },
        ]);
      } catch (err) {
        console.error("Proposal action error:", err?.response?.data || err?.message);
        alert(`Thao tác thất bại: ${err?.response?.data || err?.message}`);
      } finally {
        btn.disabled = false;
      }
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [containerRef, currentUserId]);

  // Gửi tin nhắn text (giữ nguyên parse projectId từ key nếu có)
  const sendMessage = async () => {
    if (!text.trim() || !activeUser || !currentUserId) return;
    try {
      const { projectId } = parseKey(activeConversationKey || "");
      const res = await api.post("api/messages", {
        receiverId: activeUser.id || activeUser._id || activeUser.userId,
        text,
        projectId: projectId && projectId !== "null" ? projectId : null,
      });

      const saved =
        res.data ||
        normalizeMessage({
          _id: { $oid: crypto.randomUUID() },
          conversationKey: activeConversationKey,
          senderId: currentUserId,
          receiverId: activeUser.id || activeUser._id || activeUser.userId,
          text,
          createdAt: { $date: Date.now() },
          isRead: true,
        });

      setMessages((prev) => [...prev, saved]);
      setText("");
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
    }
  };

  // Sidebar items: dùng partnerId từ BE, không tự parse key để tìm partner
  const sidebarItems = useMemo(() => {
    const items = (conversations || []).map((c) => {
      const partner = usersMap.get(c.partnerId) || null;
      return {
        conversationKey: c.conversationKey,
        partnerId: c.partnerId,
        partnerName: partner?.fullName || partner?.email || c.partnerId,
        lastMessage: c.lastMessage || "",
        lastAt: c.lastAt ? new Date(c.lastAt) : null,
        unreadCount: c.unreadCount || 0,
        userObj: partner,
      };
    });
    console.log("SidebarItems:", items);
    return items;
  }, [conversations, usersMap]);

  if (loading) return <p className="p-4">Đang tải...</p>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1 card p-4">
        <div className="font-semibold mb-3">Đoạn chat</div>
        {sidebarItems.length === 0 ? (
          <EmptyState title="Chưa có đoạn chat nào" />
        ) : (
          <div className="space-y-2">
            {sidebarItems.map((it) => (
              <div
                key={it.conversationKey || it.partnerId}
                onClick={() => {
                  if (it.userObj) {
                    setActiveUser(it.userObj);
                    setActiveConversationKey(it.conversationKey);
                    setMessages([]);
                  }
                }}
                className={`cursor-pointer p-3 rounded-xl border flex items-start gap-3 ${
                  activeUser?.id === it.partnerId || activeUser?._id === it.partnerId
                    ? "border-brand-600 bg-brand-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium truncate">👤 {it.partnerName}</div>
                    {it.lastAt && (
                      <div className="text-xs text-slate-500 shrink-0">
                        {it.lastAt.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 truncate">
                    {it.lastMessage || "—"}
                  </div>
                </div>
                {it.unreadCount > 0 && (
                  <span className="badge badge-primary shrink-0">{it.unreadCount}</span>
                )}
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
                  messages.map((m) => {
                    const isMine = m.senderId === currentUserId;
                    const showHtml = isHtml(m.text);
                    const safeHtml = showHtml ? DOMPurify.sanitize(m.text) : "";

                    return (
                      <div
                        key={m.id}
                        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md border text-slate-900 break-words ${
                          isMine
                            ? "ml-auto bg-white border-brand-200"
                            : "mr-auto bg-white border-slate-200"
                        }`}
                        title={m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                      >
                        {showHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
                        ) : (
                          m.text
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Input */}
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
          <EmptyState title="Chọn một đoạn chat để bắt đầu" />
        )}
      </div>
    </div>
  );
}
