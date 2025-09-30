import { useState, useEffect } from "react";
import Input from '../components/ui/input'
import Textarea from '../components/ui/textarea'
import Select from '../components/ui/select'
import Button from '../components/ui/button'
import api from "../lib/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
export default function NewProject() {
    const navigate = useNavigate();

    // form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [budgetType, setBudgetType] = useState("Fixed");
    const [budgetAmount, setBudgetAmount] = useState(5000000);
    const [deadline, setDeadline] = useState("");
    const [skills, setSkills] = useState([]);

    // options
    const [categories, setCategories] = useState([]);
    const [skillOptions, setSkillOptions] = useState([]);

    const token = localStorage.getItem("token");
    let userId = "";
    if (token) {
        const decoded = jwtDecode(token);
        userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }

    // load categories + skills từ backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, skillRes] = await Promise.all([
                    api.get("/categories"),
                    api.get("/skills"),
                ]);
                setCategories(catRes.data);
                setSkillOptions(skillRes.data);
            } catch (err) {
                console.error("Load categories/skills failed", err);
            }
        };
        fetchData();
    }, []);

    const toggleSkill = (id) => {
        setSkills((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        try {
            const userId = "68dac620a2748a477d360bc0";
            const payload = {
                ownerId: userId,
                title,
                description,
                categoryId: categoryId || null,
                skillIds: skills,
                budgetType,
                budgetAmount: budgetAmount ? Number(budgetAmount) : null,
                deadline: deadline ? new Date(deadline).toISOString() : null,
                status: "Open",
            };
            console.log("Payload gửi:", payload);
            await api.post("/projects", payload);
            alert("Đăng dự án thành công!");
            navigate("/projects");
        } catch (err) {
            console.error("Create project failed", err.response?.data || err);
            alert("Có lỗi khi đăng dự án");
        }
    };

    return (
        <div className="container-ld py-10">
            <h1 className="text-3xl font-semibold text-center">Đăng dự án mới</h1>
            <div className="mt-8 space-y-6">
                <div className="card"><div className="card-header p-5 font-semibold">Thông tin dự án</div>
                    <div className="card-body grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">Tiêu đề dự án *</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="VD: Thiết kế logo cho công ty công nghệ"
                            />
                        </div>
                        <div>
                            <label className="text-sm">Danh mục *</label>
                            <Select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">--Chọn danh mục--</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm">Mô tả dự án *</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả chi tiết yêu cầu, mục tiêu và kỳ vọng..."
                            />
                        </div>
                    </div>
                </div>
                <div className="card-header p-5 font-semibold">Ngân sách</div>
                <div className="card-body grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm">Loại ngân sách *</label>
                        <div className="mt-2 flex gap-6 text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="budgetType"
                                    value="Fixed"
                                    checked={budgetType === "Fixed"}
                                    onChange={(e) => setBudgetType(e.target.value)}
                                />
                                Giá cố định
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="budgetType"
                                    value="Hourly"
                                    checked={budgetType === "Hourly"}
                                    onChange={(e) => setBudgetType(e.target.value)}
                                />
                                Theo giờ
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm">Tổng ngân sách (VND) *</label>
                        <Input
                            type="number"
                            value={budgetAmount}
                            onChange={(e) => setBudgetAmount(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="card"><div className="card-header p-5 font-semibold">Thời gian</div>
                    <div className="card-body grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">Thời gian hoàn thành *</label>
                            <Input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="card"><div className="card-header p-5 font-semibold">Kỹ năng cần thiết</div>
                    <div className="card-body grid md:grid-cols-3 gap-3 text-sm">
                        {skillOptions.map((s) => (
                            <label key={s.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={skills.includes(s.id)}
                                    onChange={() => toggleSkill(s.id)}
                                />
                                {s.name}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => navigate("/projects")}>
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleSubmit}>Đăng dự án</Button>
                </div>
            </div>
        </div>
    )
}