export default function Settings() {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-5 space-y-6">
                <div><div className="font-semibold">Thông báo</div>
                    <div className="mt-2 space-y-2 text-sm"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Nhận thông báo qua email</label><label className="flex items-center gap-2"><input type="checkbox" /> Thông báo dự án mới</label><label className="flex items-center gap-2"><input type="checkbox" /> Thông báo tin nhắn</label></div>
                </div>
                <div><div className="font-semibold">Quyền riêng tư</div>
                    <div className="mt-2 space-y-2 text-sm"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Hiển thị hồ sơ công khai</label><label className="flex items-center gap-2"><input type="checkbox" /> Hiển thị trạng thái online</label></div>
                </div>
                <div><div className="font-semibold">Bảo mật</div><button className="btn btn-outline mt-2">Đổi mật khẩu</button></div>
            </div>
            <div className="card p-5"><div className="font-semibold">Trạng thái tài khoản</div><ul className="mt-3 text-sm space-y-2"><li>✅ Tài khoản đã xác thực</li><li>✅ Email đã xác nhận</li><li>✅ Số điện thoại đã xác nhận</li></ul></div>
        </div>
    )
}