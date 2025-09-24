import Button from '../components/ui/button'
export default function Home() {
    return (
        <div>
            <section className="bg-gradient-to-r from-blue-50 to-orange-50 border-b">
                <div className="container-ld py-16 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Kết nối <span className="text-brand-700">Freelancer</span> & <span className="text-accent">Khách hàng</span></h1>
                        <p className="mt-4 text-slate-600">Tìm kiếm freelancer năng lực hoặc dự án phù hợp. Xây dựng sự nghiệp tự do với LanServe.</p>
                        <div className="mt-6 flex gap-3">
                            <Button> Tìm Freelancer </Button>
                            <Button variant="outline"> Đăng Dự Án </Button>
                        </div>
                    </div>
                    <div className="h-64 bg-slate-200 rounded-2xl" />
                </div>
            </section>
            <section className="container-ld py-12">
                <h2 className="text-2xl font-semibold">Danh mục dịch vụ</h2>
                <div className="mt-6 grid md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {['Thiết kế', 'Lập trình', 'Marketing', 'Dịch thuật', 'Viết lách', 'Nhiếp ảnh', 'SEO', 'Khác'].map(x => (
                        <div key={x} className="card p-5">
                            <div className="text-xl">📦</div>
                            <div className="mt-3 font-medium">{x}</div>
                            <div className="text-sm text-slate-500">Mô tả ngắn danh mục.</div>
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