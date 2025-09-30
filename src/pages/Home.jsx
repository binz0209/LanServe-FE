import Button from '../components/ui/button'
import { useEffect, useState } from 'react'
import api from '../lib/axios'
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [freelancers, setFreelancers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // load category từ backend
        api.get("/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Load categories failed", err));

        // load freelancer nổi bật (cần BE có GetAll UserProfiles)
        api.get("/userprofiles")
            .then((res) => setFreelancers(res.data))
            .catch((err) => console.error("Load freelancers failed", err));
    }, []);

    return (
        <div>
            <section className="bg-gradient-to-r from-blue-50 to-orange-50 border-b">
                <div className="container-ld py-16 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Kết nối <span className="text-brand-700">Freelancer</span> & <span className="text-accent">Khách hàng</span></h1>
                        <p className="mt-4 text-slate-600">Tìm kiếm freelancer năng lực hoặc dự án phù hợp. Xây dựng sự nghiệp tự do với LanServe.</p>
                        <div className="mt-6 flex gap-3">
                            <Button> Tìm Freelancer </Button>
                            <Button variant="outline" onClick={() => navigate("/post-project")}>
                                Đăng Dự Án
                            </Button>
                        </div>
                    </div>
                    <div className="h-64 bg-slate-200 rounded-2xl" />
                </div>
            </section>
            <section className="container-ld py-12">
                <h2 className="text-2xl font-semibold">Danh mục dịch vụ</h2>
                <div className="mt-6 grid md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {categories.map((c) => (
                        <div key={c.id} className="card p-5">
                            <div className="text-xl">📦</div>
                            <div className="mt-3 font-medium">{c.name}</div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="bg-white border-y">
                <div className="container-ld py-12">
                    <h2 className="text-2xl font-semibold">Freelancer nổi bật</h2>
                    <div className="mt-6 grid md:grid-cols-3 gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="card p-5">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-slate-200" />
                                    <div>
                                        <div className="font-medium">Nguyễn Minh Anh</div>
                                        <div className="text-sm text-slate-500">UI/UX Designer</div>
                                    </div>
                                </div>
                                <div className="mt-3 text-sm text-slate-600">⭐ 4.9 (156) • 500.000đ/giờ</div>
                                <Button className="mt-4 w-full" variant="outline">Xem hồ sơ</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="bg-gradient-to-r from-blue-500 to-orange-500 text-white">
                <div className="container-ld py-14 text-center">
                    <h2 className="text-3xl font-semibold">Sẵn sàng bắt đầu dự án của bạn?</h2>
                    <div className="mt-6 flex gap-3 justify-center">
                        <Button className="bg-white text-slate-900">Đăng ký miễn phí</Button>
                        <Button variant="outline" className="border-white text-white">Tìm hiểu thêm</Button>
                    </div>
                </div>
            </section>
        </div>
    )
}