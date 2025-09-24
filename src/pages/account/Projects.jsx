import SearchBar from '../../components/SearchBar'
import StatCard from '../../components/StatCard'
import Progress from '../../components/ui/progress'
import Button from '../../components/ui/button'
import { myProjects } from '../../lib/mock'
export default function Projects() {
    return (
        <div className="container-ld py-8 space-y-6">
            <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Dự án cần tuyển Freelancer</h1><Button>+ Dự án mới</Button></div>
            <div className="card p-5"><SearchBar /></div>
            <div className="grid md:grid-cols-4 gap-4">
                <StatCard icon={'📦'} label="Tổng dự án" value={4} />
                <StatCard icon={'⏳'} label="Đang thực hiện" value={1} />
                <StatCard icon={'✅'} label="Hoàn thành" value={1} />
                <StatCard icon={'💰'} label="Tổng thu nhập" value={'60.000.000 đ'} />
            </div>
            {myProjects.map(p => (
                <div key={p.id} className="card"><div className="card-body">
                    <div className="flex items-start justify-between">
                        <div><div className="text-lg font-semibold">{p.title}</div><div className="mt-1 text-sm text-slate-500">Thiết kế UI/UX cho app fintech. Wireframe → Prototype → Final.</div></div>
                        <div className="flex gap-2"><Button variant="outline">Xem</Button><Button variant="outline">Chỉnh sửa</Button></div>
                    </div>
                    <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm"><div><div className="flex items-center justify-between"><span>Tiến độ</span><span>{p.progress}%</span></div><Progress value={p.progress} /></div><div className="text-right text-brand-700 font-semibold">{p.budget.toLocaleString('vi-VN')} đ</div></div>
                </div></div>
            ))}
            <div className="text-center"><Button variant="outline">Xem thêm dự án</Button></div>
        </div>
    )
}