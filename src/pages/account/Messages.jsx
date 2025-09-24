import EmptyState from '../../components/EmptyState'
export default function Messages() {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 card p-4">
                <div className="font-semibold mb-3">Cuộc trò chuyện</div>
                <div className="space-y-3">
                    {['Nguyễn Minh Anh', 'Trần Đức Thành', 'Lê Thị Hương', 'Phạm Văn Khoa'].map((n, i) => (
                        <div key={n} className={`p-3 rounded-xl border ${i === 0 ? 'border-brand-600 bg-brand-50' : 'border-slate-200'}`}>
                            <div className="font-medium">{n}</div>
                            <div className="text-xs text-slate-500">Tin nhắn gần nhất…</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2"><EmptyState title="Quản lý tin nhắn" actionLabel="Mở ứng dụng tin nhắn" /></div>
        </div>
    )
}