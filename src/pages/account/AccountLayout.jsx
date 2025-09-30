import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { jwtDecode } from "jwt-decode";

export default function AccountLayout() {
  const [profile, setProfile] = useState(null);
  const [rating, setRating] = useState({ avg: "-", count: 0 });
  const location = useLocation();
  const search = location.search || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    // 1) Hồ sơ: MERGE thay vì overwrite
    axios
      .get(`/userprofiles/by-user/${userId}`)
      .then((res) => {
        setProfile((prev) => ({ ...(prev || {}), ...res.data }));
      })
      .catch((err) => console.error("Profile error:", err));

    // 2) Thông tin user (fullName): cũng MERGE
    axios
      .get("/users/me")
      .then((res) => {
        const fullName = res.data?.fullName ?? res.data?.name ?? "";
        setProfile((prev) => ({ ...(prev || {}), fullName }));
      })
      .catch((err) => console.error("User error:", err));

    // 3) Reviews (rating)
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
        } else {
          setRating({ avg: "-", count: 0 });
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

        <div className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">
              {profile.fullName && profile.fullName.trim()
                ? profile.fullName
                : "Người dùng ẩn"}
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

        <div className="px-5 border-t border-slate-100">
          <nav className="flex gap-2 overflow-x-auto">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={{ pathname: t.to, search }}
                className={({ isActive }) => `tab ${isActive ? "tab-active" : ""}`}
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
