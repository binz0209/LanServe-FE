import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar'
import StatCard from '../../components/StatCard'
import Progress from '../../components/ui/progress'
import Button from '../../components/ui/button'
import api from "../../lib/axios";
import { myProjects } from '../../lib/mock'
import { useNavigate } from "react-router-dom";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        api.get("/projects/open")
            .then((res) => setProjects(res.data))
            .catch((err) => console.error("Load projects failed", err));
    }, []);

    return (
        <div className="container-ld py-8 space-y-6">
            <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Dự án cần tuyển Freelancer</h1><Button onClick={() => navigate("/post-project")}>+ Dự án mới</Button></div>
            <div className="card p-5"><SearchBar /></div>
            <div className="grid md:grid-cols-4 gap-4">
                <StatCard icon="📦" label="Tổng dự án" value={projects.length} />
                <StatCard
                    icon="⏳"
                    label="Đang thực hiện"
                    value={projects.filter((p) => p.status === "InProgress").length}
                />
                <StatCard
                    icon="✅"
                    label="Hoàn thành"
                    value={projects.filter((p) => p.status === "Completed").length}
                />
                <StatCard
                    icon="💰"
                    label="Tổng ngân sách"
                    value={projects.reduce((sum, p) => sum + (p.budgetAmount ?? 0), 0).toLocaleString("vi-VN") + " đ"}
                />
            </div>
            {projects.map((p) => (
                <div key={p.id} className="card">
                    <div className="card-body">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-lg font-semibold">{p.title}</div>
                                <div className="mt-1 text-sm text-slate-500">{p.description}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">Xem</Button>
                                <Button variant="outline">Chỉnh sửa</Button>
                            </div>
                        </div>

                        {/* Status + Budget */}
                        <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                                    {p.status}
                                </span>
                            </div>
                            <div className="text-right text-brand-700 font-semibold">
                                {(p.budgetAmount ?? 0).toLocaleString("vi-VN")} đ
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="text-center"><Button variant="outline">Xem thêm dự án</Button></div>
        </div>
    )
}