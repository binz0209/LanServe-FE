import { useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setErr("Vui lòng nhập đủ thông tin.");
    // TODO: Gọi API thật sau này
    nav("/account/profile");
  };

  return (
    <div className="container-ld py-12 grid md:grid-cols-2 gap-10">
      <div className="hidden md:block">
        <div className="h-80 rounded-2xl bg-gradient-to-br from-blue-200 to-orange-200" />
        <h2 className="mt-6 text-2xl font-semibold">Chào mừng trở lại LanServe</h2>
        <p className="text-slate-600 mt-2">Đăng nhập để quản lý dự án, trao đổi và nhận việc nhanh chóng.</p>
      </div>

      <div className="card">
        <form className="card-body space-y-4" onSubmit={onSubmit}>
          <h1 className="text-2xl font-semibold">Đăng nhập</h1>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <div>
            <label className="text-sm">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm">Mật khẩu</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Ghi nhớ đăng nhập
            </label>
            <Link to="#" className="text-brand-700 hover:underline">Quên mật khẩu?</Link>
          </div>
          <Button type="submit" className="w-full">Đăng nhập</Button>
          <div className="text-sm text-center text-slate-600">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-brand-700 hover:underline">Đăng ký</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
