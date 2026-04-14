import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import loginImage from "../assets/loginImage.png";
import { createUser } from "../api/userApi";
import api from "../api/axios";

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-[12px] text-red-700">
      <AlertCircle size={13} className="shrink-0" />
      {message}
    </p>
  );
}

const INIT_ERRORS = {
  nim: "", namaDepan: "", namaBelakang: "",
  email: "", password: "", confirmPassword: "", api: "",
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nim: "", namaDepan: "", namaBelakang: "",
    email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(INIT_ERRORS);
  const [success, setSuccess] = useState("");

  const set = (field) => (e) => { setForm((p) => ({ ...p, [field]: e.target.value })); clearErr(field); };
  const setErr = (field, msg) => setErrors((p) => ({ ...p, [field]: msg }));
  const clearErr = (field) => setErr(field, "");

  const validate = () => {
    const errs = { ...INIT_ERRORS };
    let hasError = false;
    const { nim, namaDepan, namaBelakang, email, password, confirmPassword } = form;

    if (!nim.trim()) { errs.nim = "NIM/NIP tidak boleh kosong."; hasError = true; }
    if (!namaDepan.trim()) { errs.namaDepan = "Nama depan tidak boleh kosong."; hasError = true; }
    if (!namaBelakang.trim()) { errs.namaBelakang = "Nama belakang tidak boleh kosong."; hasError = true; }
    if (!email.trim()) { errs.email = "Email tidak boleh kosong."; hasError = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errs.email = "Format email tidak valid."; hasError = true; }
    if (password.length < 6) { errs.password = "Password minimal 6 karakter."; hasError = true; }
    if (password !== confirmPassword) { errs.confirmPassword = "Konfirmasi password tidak cocok."; hasError = true; }
    return { errs, hasError };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    const { errs, hasError } = validate();
    if (hasError) { setErrors(errs); return; }

    setLoading(true);
    try {
      const allUsersRes = await api.get("/users");
      const allUsers = allUsersRes.data;

      if (allUsers.some((u) => u.nim === form.nim.trim())) {
        setErr("api", "NIM/NIP sudah terdaftar. Silakan gunakan NIM/NIP lain.");
        return;
      }
      if (allUsers.some((u) => u.email === form.email.trim().toLowerCase())) {
        setErr("api", "Email sudah terdaftar. Silakan gunakan email lain.");
        return;
      }

      const payload = {
        nim: form.nim.trim(),
        namaDepan: form.namaDepan.trim(),
        namaBelakang: form.namaBelakang.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        level: "mahasiswa",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await createUser(payload);
      const newUser = res.data;

      setSuccess("Akun berhasil dibuat! Silakan login dengan akun Anda.");
    } catch {
      setErr("api", "Terjadi kesalahan. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const base = "w-full px-4 py-3 border rounded-lg text-sm text-primary-1 placeholder-neutral-1 focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white";
  const normal = `${base} border-gray-200 focus:ring-primary-2`;
  const err = `${base} border-red-700 focus:ring-red-700 placeholder-red-700`;
  const cls = (field) => errors[field] ? err : normal;

  return (
    <div className="fixed inset-0 flex bg-white">

      {/* Left: Image */}
      <div className="hidden md:block flex-1 overflow-hidden">
        <img src={loginImage} alt="Photo Universitas Lambung Mangkurat" className="w-full h-full object-cover" />
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white overflow-y-auto">
        <div className="max-w-sm w-full mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-1 mb-2">Register!</h1>
          </div>

          {/* API error */}
          {errors.api && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errors.api}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NIM / NIP */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">NIM/NIP</label>
              <input type="text" value={form.nim} onChange={set("nim")} placeholder="Masukkan NIM/NIP" className={cls("nim")} />
              <FieldError message={errors.nim} />
            </div>

            {/* Nama Depan */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">Nama Depan</label>
              <input type="text" value={form.namaDepan} onChange={set("namaDepan")} placeholder="Masukkan nama depan" className={cls("namaDepan")} />
              <FieldError message={errors.namaDepan} />
            </div>

            {/* Nama Belakang */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">Nama Belakang</label>
              <input type="text" value={form.namaBelakang} onChange={set("namaBelakang")} placeholder="Masukkan nama belakang" className={cls("namaBelakang")} />
              <FieldError message={errors.namaBelakang} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="Masukkan email" className={cls("email")} />
              <FieldError message={errors.email} />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Masukkan password"
                  className={`${cls("password")} pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-1 transition-colors">
                  {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Masukkan konfirmasi password"
                  className={`${cls("confirmPassword")} pr-12`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-1 transition-colors">
                  {showConfirmPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full py-3.5 bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </span>
              ) : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-1 mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="underline text-primary-2 hover:text-blue-700 font-semibold transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}