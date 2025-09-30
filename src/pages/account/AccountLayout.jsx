import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { jwtDecode } from "jwt-decode";

export default function AccountLayout() {
  const [profile, setProfile] = useState(null);
  const [rating, setRating] = useState({ avg: "-", count: 0 });

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY4ZGFjNmU1OTYzODk1Njc0OTUzYjZhMiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Im5ndXllbnZhbmFAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJmcmVlbGFuY2VyIiwiZXhwIjoxNzU5MjIxMDc2LCJpc3MiOiJMYW5TZXJ2ZSIsImF1ZCI6IkxhblNlcnZlQ2xpZW50In0.QjPDSBO-BHo3EIxwx6VBVKpkuzJExdJ4e5rjEtIW9O0"; // token test
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    // 1. UserProfile
    axios
      .get(`/userprofiles/by-user/${userId}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Profile error:", err));

    // 2. User (fullName)
    axios
      .get("/users/me")
      .then((res) =>
        setProfile((prev) =>
          prev
            ? { ...prev, fullName: res.data.fullName }
            : { fullName: res.data.fullName }
        )
      )
      .catch((err) => console.error("User error:", err));

    // 3. Reviews (rating)
    axios
      .get(`/reviews/by-user/${userId}`)
      .then((res) => {
        const reviews = res.data || [];
        if (reviews.length > 0) {
          const total = reviews.reduce(
            (sum, r) => sum + (Number(r.rating) || 0),
            0
          );
          const avg = total / reviews.length;
          setRating({ avg: avg.toFixed(1), count: reviews.length });
        }
      })
      .catch((err) => console.error("Review error:", err));
  }, []);

  const tabs = [
    { to: "profile", label: "Hồ sơ cá nhân" },
    { to: "my-projects", label: "Dự án của tôi" },
    { to: "messages", label: "Tin nhắn" },
    { to: "settings", label: "Cài đặt" },
  ];

  if (!profile) return <p className="p-4">Đang tải...</p>;

  return (
    <div className="container-ld py-8">
      <div className="card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-orange-500" />

        {/* Thông tin user */}
        <div className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">
              {profile.fullName ?? "Người dùng ẩn"}
              <span className="badge badge-success ml-2">Đã xác thực</span>
            </div>
            <div className="text-sm text-slate-600">
              {profile.title ?? "Chưa có chức danh"} •{" "}
              {profile.location ?? "Chưa rõ"} • Tham gia{" "}
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                : "-"}{" "}
              • ⭐ {rating.avg}/5{" "}
              {rating.count > 0 ? `(${rating.count} đánh giá)` : ""}
            </div>
          </div>
          <button className="btn btn-outline">Chỉnh sửa hồ sơ</button>
        </div>

        {/* Tabs */}
        <div className="px-5 border-t border-slate-100">
          <nav className="flex gap-2 overflow-x-auto">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  `tab ${isActive ? "tab-active" : ""}`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
