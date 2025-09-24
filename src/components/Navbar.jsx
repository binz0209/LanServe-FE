import { Link, NavLink } from 'react-router-dom'
import Button from './ui/button'
export default function Navbar() {
    const item = 'px-3 py-2 rounded-lg hover:bg-slate-100 text-sm';
    const active = ({ isActive }) => isActive ? 'text-brand-700 font-medium' : 'text-slate-700';
    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="container-ld flex h-14 items-center justify-between">
                <Link to="/" className="font-bold text-lg"><span className="text-brand-700">Lan</span>Serve</Link>
                <nav className="hidden md:flex gap-1">
                    <NavLink to="/" className={({ isActive }) => `${item} ${active({ isActive })}`}>Trang chủ</NavLink>
                    <NavLink to="/projects" className={({ isActive }) => `${item} ${active({ isActive })}`}>Dự án</NavLink>
                    <NavLink to="/post-project" className={({ isActive }) => `${item} ${active({ isActive })}`}>Đăng dự án</NavLink>
                    <NavLink to="/how-it-works" className={({ isActive }) => `${item} ${active({ isActive })}`}>Cách hoạt động</NavLink>
                </nav>
                <div className="flex items-center gap-2">
                    <NavLink to="/account/messages" className={({ isActive }) => `${item} ${active({ isActive })}`}>💬</NavLink>
                    <NavLink to="/account/profile" className={({ isActive }) => `${item} ${active({ isActive })}`}>👤 Tài khoản</NavLink>
                    {/* <Button variant="primary" as={Link} to="/post-project">Đăng ký</Button> */}
                    <NavLink to="/login" className={({isActive})=>`${item} ${active({isActive})}`}>Đăng nhập</NavLink>
                    <Button variant="primary" as={Link} to="/register">Đăng ký</Button>
                </div>
            </div>
        </header>
    )
}