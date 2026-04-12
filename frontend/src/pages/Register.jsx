// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import loginImage from "../assets/loginImage.png";
import { useAuth } from "../contexts/AuthContext";
import { createUser, getUserByEmail } from "../api/userApi";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const { saveUser } = useAuth();

  const [form, setForm] = useState({
    nim: "",
    namaDepan: "",
    namaBelakang: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const { nim, namaDepan, namaBelakang, email, password, confirmPassword } = form;
    if (!nim.trim()) return "NIM/NIP tidak boleh kosong.";
    if (!namaDepan.trim()) return "Nama depan tidak boleh kosong.";
    if (!namaBelakang.trim()) return "Nama belakang tidak boleh kosong.";
    if (!email.trim()) return "Email tidak boleh kosong.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Format email tidak valid.";
    if (password.length < 6) return "Password minimal 6 karakter.";
    if (password !== confirmPassword)
      return "Konfirmasi password tidak cocok.";
    return null;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const validationError = validate();
  if (validationError) { setError(validationError); return; }

  setLoading(true);
  try {
    // Ambil semua user sekaligus, filter di client
    const allUsersRes = await api.get("/users");
    const allUsers = allUsersRes.data;

    // Cek NIM
    if (allUsers.some((u) => u.nim === form.nim.trim())) {
      setError("NIM/NIP sudah terdaftar. Silakan gunakan NIM/NIP lain.");
      return;
    }

    // Cek email
    if (allUsers.some((u) => u.email === form.email.trim().toLowerCase())) {
      setError("Email sudah terdaftar. Silakan gunakan email lain.");
      return;
    }

    // Buat user baru
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

    setSuccess("Akun berhasil dibuat! Mengalihkan ke dashboard...");

    setTimeout(() => {
      saveUser(newUser);
      navigate("/", { replace: true });
    }, 1200);
  } catch (err) {
    console.error("Register error:", err);
    setError("Terjadi kesalahan. Periksa koneksi internet Anda.");
  } finally {
    setLoading(false);
  }
};

  const inputClass =
    "w-full px-4 py-3 border text-primary-1 border-gray-200 rounded-lg text-sm placeholder-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white";

  return (
    <div className="fixed inset-0 flex bg-white">

      {/* Left Image */}
      <div className="hidden md:block flex-1 overflow-hidden">
        <img
          src={loginImage}
          alt="Photo Universitas Lambung Mangkurat"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white overflow-y-auto">
        <div className="max-w-sm w-full mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-1 mb-2">Register!</h1>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NIM / NIP */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">NIM/NIP</label>
              <input
                type="text"
                value={form.nim}
                onChange={set("nim")}
                placeholder="Masukkan NIM/NIP"
                className={inputClass}
              />
            </div>

            {/* Nama Depan */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">Nama Depan</label>
              <input
                type="text"
                value={form.namaDepan}
                onChange={set("namaDepan")}
                placeholder="Masukkan nama depan"
                className={inputClass}
              />
            </div>

            {/* Nama Belakang */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">Nama Belakang</label>
              <input
                type="text"
                value={form.namaBelakang}
                onChange={set("namaBelakang")}
                placeholder="Masukkan nama belakang"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="Masukkan email"
                className={inputClass}
              />
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
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-1 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                </button>
              </div>
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
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-1 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                </button>
              </div>
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

          {/* Login link */}
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