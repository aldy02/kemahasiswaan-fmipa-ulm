import { useState } from "react";
import loginImage from "../assets/loginImage.png";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  const [nim, setNim] = useState("");
  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

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
      {/* <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white overflow-y-auto"> */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white overflow-hidden">
        <div className="max-w-sm w-full mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-1 mb-2">
              Register!
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NIM / NIP */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">
                NIM/NIP
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Masukkan NIM/NIP"
                className="w-full px-4 py-3 border text-primary-1 border-gray-200 rounded-lg text-sm placeholder-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Nama Depan */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">
                Nama Depan
              </label>
              <input
                type="text"
                value={namaDepan}
                onChange={(e) => setNamaDepan(e.target.value)}
                placeholder="Masukkan nama depan"
                className="w-full px-4 py-3 border text-primary-1 border-gray-200 rounded-lg text-sm placeholder-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Nama Belakang */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">
                Nama Belakang
              </label>
              <input
                type="text"
                value={namaBelakang}
                onChange={(e) => setNamaBelakang(e.target.value)}
                placeholder="Masukkan nama belakang"
                className="w-full px-4 py-3 border text-primary-1 border-gray-200 rounded-lg text-sm placeholder-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
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
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={2} />
                  ) : (
                    <Eye size={20} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-sm font-medium text-primary-1 mb-1.5">
                Konfirmasi Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan konfirmasi password"
                  className="w-full px-4 py-3 border text-primary-1 border-gray-200 rounded-lg text-sm placeholder-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-1 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} strokeWidth={2} />
                  ) : (
                    <Eye size={20} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Register"
              )}
            </button>

          </form>

          {/* Login */}
          <p className="text-center text-sm text-neutral-1 mt-6">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="underline text-primary-2 hover:text-blue-700 font-semibold transition-colors"
            >
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}