import SkillBar from '../../components/SkillBar'
export default function Profile() {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-6">
                <div className="card p-5"><div className="font-semibold">Thông tin cá nhân</div>
                    <div className="mt-3 text-sm grid gap-2"><div>Họ và tên: <b>Nguyễn Minh Anh</b></div><div>Email: minhanh@example.com</div><div>SĐT: 0912 345 678</div><div>Website: minh-anh.dev</div></div></div>
                <div className="card p-5"><div className="font-semibold mb-3">Ngôn ngữ</div><div className="flex gap-2 flex-wrap"><span className="badge">Tiếng Việt</span><span className="badge">English</span><span className="badge">日本語</span></div></div>
                <div className="card p-5"><div className="font-semibold mb-3">Chứng chỉ</div><ul className="text-sm space-y-2"><li>AWS Certified Developer</li><li>Google UX Design Certificate</li><li>Meta Frontend Certificate</li></ul></div>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <div className="card p-5"><div className="font-semibold mb-3">Giới thiệu</div><p className="text-sm text-slate-700">Passionate developer đam mê web & mobile. Luôn sẵn sàng học hỏi công nghệ mới.</p></div>
                <div className="card p-5"><div className="flex items-center justify-between"><div className="font-semibold">Kỹ năng chuyên môn</div><button className="btn btn-outline">+ Thêm kỹ năng</button></div>
                    <div className="mt-4 space-y-3"><SkillBar label="Figma" value={95} /><SkillBar label="React" value={90} /><SkillBar label="Node.js" value={85} /><SkillBar label="TypeScript" value={80} /></div></div>
                <div className="card p-5"><div className="font-semibold mb-3">Dự án gần đây</div><ul className="list-disc list-inside text-sm text-slate-700 space-y-1"><li>E-commerce Website Redesign • Hoàn thành • 15.000.000đ</li><li>Mobile App UI/UX • Đang thực hiện • 8.000.000đ</li></ul></div>
            </div>
        </div>
    )
}