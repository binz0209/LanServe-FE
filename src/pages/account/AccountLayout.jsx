import { Outlet, NavLink } from 'react-router-dom'
export default function AccountLayout() {
    const tabs = [{ to: 'profile', label: 'Hồ sơ cá nhân' }, { to: 'my-projects', label: 'Dự án của tôi' }, { to: 'messages', label: 'Tin nhắn' }, { to: 'settings', label: 'Cài đặt' }]
    return (
        <div className="container-ld py-8">
            <div className="card overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-blue-600 to-orange-500" />
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <div className="text-xl font-semibold">Nguyễn Minh Anh <span className="badge badge-success ml-2">Đã xác thực</span></div>
                        <div className="text-sm text-slate-600">Full Stack Developer & UI/UX Designer • TP HCM • Tham gia 3/2023 • ⭐ 4.9/5 (127)</div>
                    </div>
                    <button className="btn btn-outline">Chỉnh sửa hồ sơ</button>
                </div>
                <div className="px-5 border-t border-slate-100">
                    <nav className="flex gap-2 overflow-x-auto">{tabs.map(t => <NavLink key={t.to} to={t.to} className={({ isActive }) => `tab ${isActive ? 'tab-active' : ''}`}>{t.label}</NavLink>)}</nav>
                </div>
            </div>
            <div className="mt-6"><Outlet /></div>
        </div>
    )
}