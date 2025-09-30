import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { jwtDecode } from "jwt-decode";
import Progress from "../../components/ui/progress";
import Button from "../../components/ui/button";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    axios
      .get(`/projects/by-owner/${userId}`)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!projects.length) return <p className="p-4">Bạn chưa có dự án nào.</p>;

  return (
    <div className="container-ld py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dự án của tôi</h1>
      {projects.map((p) => (
        <div key={p.id} className="card">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{p.title}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {p.description}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Xem</Button>
                <Button variant="outline">Chỉnh sửa</Button>
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span>Trạng thái</span>
                  <span>{p.status}</span>
                </div>
                <Progress value={p.status === "Completed" ? 100 : 50} />
              </div>
              <div className="text-right text-brand-700 font-semibold">
                {p.budgetAmount?.toLocaleString("vi-VN")} đ
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
