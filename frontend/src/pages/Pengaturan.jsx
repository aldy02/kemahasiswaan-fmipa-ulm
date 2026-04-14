import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ShieldCheck, Eye, EyeOff, ChevronDown, ArrowLeft, Save, AlertCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import { getUserById, updateUser } from "../api/userApi";

const LEVEL_OPTIONS = ["mahasiswa", "dosen", "admin"];

const baseInput = "w-full px-4 py-3 border rounded-lg text-sm text-primary-1 placeholder-neutral-1 focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white";
const normalBorder = `${baseInput} border-gray-200 focus:ring-primary-2`;
const errorBorder = `${baseInput} border-red-700 focus:ring-red-700 placeholder-red-700`;
const disabledCls = `${baseInput} border-gray-200 cursor-not-allowed opacity-60`;

function FieldLabel({ children, error }) {
  return (
    <label className={`block text-[13px] lg:text-sm font-medium mb-1.5 ${error ? "text-red-700" : "text-primary-1"}`}>
      {children}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-[12px] text-red-700">
      <AlertCircle size={13} className="shrink-0" />
      {message}
    </p>
  );
}

function CardHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-5 lg:mb-6">
      <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-primary-2/10 flex items-center justify-center text-primary-2 shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-[15px] lg:text-base font-bold text-primary-1 leading-snug">{title}</h2>
        <p className="text-[11px] lg:text-xs text-neutral-2 mt-0.5 leading-snug">{subtitle}</p>
      </div>
    </div>
  );
}

export default function Pengaturan() {
  const navigate = useNavigate();
  const { user, saveUser } = useAuth();

  // Profile
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState("");
  const [level, setLevel] = useState("");

  // Keamanan
  const [passwordSaatIni, setPasswordSaatIni] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    getUserById(user.id).then((res) => {
      const d = res.data;
      setNim(d.nim || "");
      setEmail(d.email || "");
      setNamaDepan(d.namaDepan || "");
      setNamaBelakang(d.namaBelakang || "");
      setLevel(d.level || "mahasiswa");
    });
  }, [user?.id]);

  const clearErr = (field) => setErrors((p) => ({ ...p, [field]: "" }));
  const inputCls = (field) => errors[field] ? errorBorder : normalBorder;

  const handleSimpan = async () => {
    const e = {};
    let ok = true;

    if (!nim.trim()) { e.nim = "NIM/NIP tidak boleh kosong."; ok = false; }
    if (!email.trim()) { e.email = "Email tidak boleh kosong."; ok = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { e.email = "Format email tidak valid."; ok = false; }

    if (!namaDepan.trim()) { e.namaDepan = "Nama depan tidak boleh kosong."; ok = false; }
    if (!namaBelakang.trim()) { e.namaBelakang = "Nama belakang tidak boleh kosong."; ok = false; }

    const ubahPassword = passwordSaatIni || passwordBaru || konfirmasiPassword;
    if (ubahPassword) {
      if (!passwordSaatIni) {
        e.passwordSaatIni = "Kata sandi saat ini tidak boleh kosong."; ok = false;
      } else if (passwordSaatIni !== user?.password) {
        e.passwordSaatIni = "Kata sandi saat ini tidak sesuai."; ok = false;
      }
      if (!passwordBaru) {
        e.passwordBaru = "Kata sandi baru tidak boleh kosong."; ok = false;
      } else if (passwordBaru.length < 6) {
        e.passwordBaru = "Kata sandi minimal 6 karakter."; ok = false;
      }
      if (passwordBaru !== konfirmasiPassword) {
        e.konfirmasiPassword = "Konfirmasi kata sandi tidak cocok."; ok = false;
      }
    }

    setErrors(e);
    if (!ok) return;

    setLoading(true);
    try {
      const payload = {
        ...user,
        nim: nim.trim(),
        email: email.trim(),
        namaDepan: namaDepan.trim(),
        namaBelakang: namaBelakang.trim(),
        level,
        updatedAt: new Date().toISOString(),
        ...(ubahPassword && { password: passwordBaru }),
      };
      const res = await updateUser(user.id, payload);
      saveUser(res.data);
      setSuccess("Pengaturan berhasil disimpan.");
      setPasswordSaatIni(""); setPasswordBaru(""); setKonfirmasiPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setErrors((p) => ({ ...p, api: "Terjadi kesalahan. Periksa koneksi internet Anda." }));
    } finally {
      setLoading(false);
    }
  };

  // Spinner
  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">Master User / Pengaturan</p>
        <h1 className="text-2xl lg:text-[28px] font-bold text-primary-1 mb-6">Pengaturan Akun</h1>
      </div>

      {/* Global banners */}
      <div className="px-4 lg:px-8">
        {errors.api && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
            <AlertCircle size={15} className="shrink-0" /> {errors.api}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm">
            ✓ {success}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="px-4 lg:px-8 pb-6 flex flex-col gap-5">

        {/* Profilee Section */}
        <div className="bg-white rounded-2xl p-5 lg:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.05)] lg:border lg:border-slate-200">
          <CardHeader
            icon={<User size={20} />}
            title="Informasi Profil"
            subtitle="Kelola informasi dasar profil dan identitas anda"
          />

          {/* Desktop grid */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <FieldLabel error={errors.nim}>NIM/NIP</FieldLabel>
              <input type="text" value={nim}
                onChange={(e) => { setNim(e.target.value); clearErr("nim"); }}
                placeholder="Masukkan NIM/NIP" className={inputCls("nim")} />
              <FieldError message={errors.nim} />
            </div>
            <div>
              <FieldLabel error={errors.email}>Email</FieldLabel>
              <input type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
                placeholder="Masukkan email" className={inputCls("email")} />
              <FieldError message={errors.email} />
            </div>
            <div>
              <FieldLabel error={errors.namaDepan}>Nama Depan</FieldLabel>
              <input type="text" value={namaDepan}
                onChange={(e) => { setNamaDepan(e.target.value); clearErr("namaDepan"); }}
                placeholder="Masukkan nama depan" className={inputCls("namaDepan")} />
              <FieldError message={errors.namaDepan} />
            </div>
            <div>
              <FieldLabel error={errors.namaBelakang}>Nama Belakang</FieldLabel>
              <input type="text" value={namaBelakang}
                onChange={(e) => { setNamaBelakang(e.target.value); clearErr("namaBelakang"); }}
                placeholder="Masukkan nama belakang" className={inputCls("namaBelakang")} />
              <FieldError message={errors.namaBelakang} />
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Level Akun</FieldLabel>
              <div className="relative">
                <select value={level} disabled
                  className={`${disabledCls} appearance-none pr-10 capitalize`}>
                  {LEVEL_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2 opacity-60" />
              </div>
            </div>
          </div>

          {/* Mobile stacked */}
          <div className="lg:hidden flex flex-col gap-4">
            <div>
              <FieldLabel error={errors.nim}>NIM/NIP</FieldLabel>
              <input type="text" value={nim}
                onChange={(e) => { setNim(e.target.value); clearErr("nim"); }}
                placeholder="Masukkan NIM/NIP" className={inputCls("nim")} />
              <FieldError message={errors.nim} />
            </div>
            <div>
              <FieldLabel error={errors.email}>Email</FieldLabel>
              <input type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
                placeholder="Masukkan email" className={inputCls("email")} />
              <FieldError message={errors.email} />
            </div>
            <div>
              <FieldLabel error={errors.namaDepan}>Nama Depan</FieldLabel>
              <input type="text" value={namaDepan}
                onChange={(e) => { setNamaDepan(e.target.value); clearErr("namaDepan"); }}
                placeholder="Masukkan nama depan" className={inputCls("namaDepan")} />
              <FieldError message={errors.namaDepan} />
            </div>
            <div>
              <FieldLabel error={errors.namaBelakang}>Nama Belakang</FieldLabel>
              <input type="text" value={namaBelakang}
                onChange={(e) => { setNamaBelakang(e.target.value); clearErr("namaBelakang"); }}
                placeholder="Masukkan nama belakang" className={inputCls("namaBelakang")} />
              <FieldError message={errors.namaBelakang} />
            </div>
            <div>
              <FieldLabel>Level Akun</FieldLabel>
              <div className="relative">
                <select value={level} disabled
                  className={`${disabledCls} appearance-none pr-10 capitalize`}>
                  {LEVEL_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2 opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Keamanan Section */}
        <div className="bg-white rounded-2xl p-5 lg:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.05)] lg:border lg:border-slate-200">
          <CardHeader
            icon={<ShieldCheck size={20} />}
            title="Keamanan"
            subtitle="Ubah kata sandi untuk menjaga keamanan akun anda"
          />

          {/* Kata Sandi Saat Ini */}
          <div className="mb-4">
            <FieldLabel error={errors.passwordSaatIni}>Kata Sandi Saat Ini</FieldLabel>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={passwordSaatIni}
                onChange={(e) => { setPasswordSaatIni(e.target.value); clearErr("passwordSaatIni"); }}
                placeholder="Masukkan kata sandi saat ini"
                className={`${inputCls("passwordSaatIni")} pr-12`}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2 hover:text-primary-1 transition-colors">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <FieldError message={errors.passwordSaatIni} />
          </div>

          {/* Desktop: 2 kolom */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <FieldLabel error={errors.passwordBaru}>Kata Sandi Baru</FieldLabel>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={passwordBaru}
                  onChange={(e) => { setPasswordBaru(e.target.value); clearErr("passwordBaru"); }}
                  placeholder="Masukkan kata sandi baru"
                  className={`${inputCls("passwordBaru")} pr-12`}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2 hover:text-primary-1 transition-colors">
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldError message={errors.passwordBaru} />
            </div>
            <div>
              <FieldLabel error={errors.konfirmasiPassword}>Konfirmasi Kata Sandi Baru</FieldLabel>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={konfirmasiPassword}
                  onChange={(e) => { setKonfirmasiPassword(e.target.value); clearErr("konfirmasiPassword"); }}
                  placeholder="Masukkan konfirmasi kata sandi baru"
                  className={`${inputCls("konfirmasiPassword")} pr-12`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2 hover:text-primary-1 transition-colors">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldError message={errors.konfirmasiPassword} />
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="lg:hidden flex flex-col gap-4">
            <div>
              <FieldLabel error={errors.passwordBaru}>Kata Sandi Baru</FieldLabel>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={passwordBaru}
                  onChange={(e) => { setPasswordBaru(e.target.value); clearErr("passwordBaru"); }}
                  placeholder="Masukkan kata sandi baru"
                  className={`${inputCls("passwordBaru")} pr-12`}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2 hover:text-primary-1 transition-colors">
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldError message={errors.passwordBaru} />
            </div>
            <div>
              <FieldLabel error={errors.konfirmasiPassword}>Konfirmasi Kata Sandi Baru</FieldLabel>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={konfirmasiPassword}
                  onChange={(e) => { setKonfirmasiPassword(e.target.value); clearErr("konfirmasiPassword"); }}
                  placeholder="Masukkan konfirmasi kata sandi baru"
                  className={`${inputCls("konfirmasiPassword")} pr-12`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2 hover:text-primary-1 transition-colors">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldError message={errors.konfirmasiPassword} />
            </div>
          </div>
        </div>

        {/* Footer Desktop */}
        <div className="hidden lg:flex justify-end items-center gap-3 mt-2">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-colors">
            <ArrowLeft size={15} /> Kembali
          </button>
          <button onClick={handleSimpan} disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <><Spinner /> Menyimpan...</> : <><Save size={15} /> Simpan</>}
          </button>
        </div>

      </div>

      {/* Footer Mobile */}
      <div className="lg:hidden flex flex-col gap-3 px-4 pb-6 mt-2">
        <button onClick={handleSimpan} disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? <><Spinner /> Menyimpan...</> : "Simpan"}
        </button>
        <button onClick={() => navigate(-1)}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-colors">
          <ArrowLeft size={15} /> Kembali
        </button>
      </div>

    </MainLayout>
  );
}