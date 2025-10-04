import { useEffect, useState } from "react";
import api from "../../lib/api";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Profile token:", token);
  
    let currentUserId = null;
    if (token) {
      const decoded = jwtDecode(token);
      currentUserId =
        decoded.sub ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded.userId;
      console.log("Decoded userId:", currentUserId);
    }
  
    if (!currentUserId) return;
    api.get(`/api/userprofiles/by-user/${currentUserId}`)
      .then((res) => {
        console.log("Profile data:", res.data);
        setProfile(res.data);
        setIsOwner(res.data.userId === currentUserId);
      })
      .catch((err) => {
        console.error("Get profile error:", err.response?.data || err.message);
      });
  }, []);
  

  if (!profile) return <p className="p-4">Đang tải hồ sơ...</p>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Thông tin cá nhân */}
      <div className="space-y-6">
        <div className="card p-5">
          <div className="font-semibold">Thông tin cá nhân</div>
          <div className="mt-3 text-sm grid gap-2">
            <div>
              Chức danh: <b>{profile.title}</b>
            </div>
            <div>Nơi ở: {profile.location ?? "Chưa cập nhật"}</div>
            <div>Rate: {profile.hourlyRate ?? "-"} VND/h</div>
          </div>
        </div>

        <div className="card p-5">
          <div className="font-semibold mb-3">Ngôn ngữ</div>
          <div className="flex gap-2 flex-wrap">
            {profile.languages?.map((lang, i) => (
              <span key={i} className="badge">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="font-semibold mb-3">Chứng chỉ</div>
          <ul className="text-sm space-y-2">
            {profile.certifications?.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Giới thiệu & kỹ năng */}
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-5">
          <div className="font-semibold mb-3">Giới thiệu</div>
          <p className="text-sm text-slate-700">{profile.bio}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Kỹ năng chuyên môn</div>
            <button className="btn btn-outline">+ Thêm kỹ năng</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="badge">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
