import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import SkillBar from "../../components/SkillBar";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY4ZGFjNmU1OTYzODk1Njc0OTUzYjZhMiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Im5ndXllbnZhbmFAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJmcmVlbGFuY2VyIiwiZXhwIjoxNzU5MjQ3NjgxLCJpc3MiOiJMYW5TZXJ2ZSIsImF1ZCI6IkxhblNlcnZlQ2xpZW50In0.1kW7yyuv5sYAhUbDGHjAE9V7oXvk5kA_8Z60rCBH7Q8";
    if (!token) return;

    // Giải mã token để lấy userId
    const decoded = jwtDecode(token);
    const userId =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];
    // tuỳ backend bạn trả claim nào

    axios
      .get(`/userprofiles/by-user/${userId}`)
      .then(async (res) => {
        setProfile(res.data);

        // 👇 thêm bước resolve skillIds thành skill names
        if (res.data.skillIds?.length > 0) {
          const sres = await axios.post("/skills/resolve", res.data.skillIds);
          setSkills(sres.data); // [{id, name}]
        }
      })
      .catch((err) => console.error(err));
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
