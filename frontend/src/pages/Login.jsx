// src/pages/Login.jsx
import { useState } from "react";
import loginImage from "../assets/loginImage.png";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    // fixed inset-0 (fix heigh problem)
    <div className="fixed inset-0 flex bg-white">

      {/* Left */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white overflow-y-auto">
        <div className="max-w-sm w-full mx-auto">
          {/* Head */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-1 mb-2">Login!</h1>
            <p className="text-sm text-neutral-1 leading-relaxed">
              Selamat datang di Aplikasi Auto Generate Surat Layanan Kemahasiswaan FMIPA ULM
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full px-4 py-3 border text-primary-1 border-gray-200 rounded-lg text-sm placeholder-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 border text-primary-1 border-gray-200 rounded-lg text-sm placeholder-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white pr-12"
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

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">
                Captcha
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Masukkan captcha"
                  className="flex-1 px-4 py-3 border text-primary-1 border-gray-200 rounded-lg text-sm placeholder-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                />
                <div
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 select-none tracking-widest min-w-24 text-center flex items-center justify-center"
                  style={{ fontFamily: "monospace", letterSpacing: "0.15em" }}
                >
                  Lhqshas
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div>
              <a href="#" className="underline text-sm text-primary-2 hover:text-blue-700 font-medium transition-colors">
                Lupa Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </span>
              ) : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-neutral-1 mt-6">
            Belum punya akun?{" "}
            <a href="#" className="underline text-primary-2 hover:text-blue-700 font-semibold transition-colors">
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Right - image hidden on mobile */}
      <div className="hidden md:block flex-1 overflow-hidden">
        <img
          src={loginImage}
          alt="Photo Universitas Lambung Mangkurat"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}