import { useEffect, useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);


  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setErr("Vui lòng nhập đủ thông tin.");

    setErr("");
    setLoading(true);
    try {
      const res = await api.post("api/auth/login", form);
      const token = res.data?.accessToken || res.data?.token;
      if (!token) throw new Error("Không nhận được token từ server");

      // Lưu token
      localStorage.setItem("token", token);

      // Gắn header mặc định ngay lập tức cho các request sau login
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // Lưu user (nếu BE trả về)
      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }


      const decoded = jwtDecode(token);
      const userId =
        decoded.sub ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded.userId ||
        null;

        console.log("Đăng nhập thành công ✅");
        console.log("JWT Token:", token);
        console.log("UserID:", userId);
      // Điều hướng
      nav("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-ld py-12 grid md:grid-cols-2 gap-10">
      <div className="hidden md:block">
        <div className="h-80 rounded-2xl bg-gradient-to-br from-blue-200 to-orange-200" />
        <h2 className="mt-6 text-2xl font-semibold">Chào mừng trở lại LanServe</h2>
        <p className="text-slate-600 mt-2">
          Đăng nhập để quản lý dự án, trao đổi và nhận việc nhanh chóng.
        </p>
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
            <Link to="#" className="text-brand-700 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          <div className="text-sm text-center text-slate-600">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-brand-700 hover:underline">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
