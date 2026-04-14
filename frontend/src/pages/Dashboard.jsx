import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import { getSurats } from "../api/suratApi";

function parseDate(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("-");
  return new Date(`${y}-${m}-${d}`).getTime();
}

function relativeTime(str) {
  const diff = Date.now() - parseDate(str);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari yang lalu";
  if (days < 30) return `${days} hari yang lalu`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan yang lalu`;
  return `${Math.floor(months / 12)} tahun yang lalu`;
}

function getSuratTitle(surat) {
  const j = surat.jenisSurat;
  if (j === "Peminjaman Ruangan") return surat.namaKegiatan || surat.organisasi || "-";
  if (j === "Peminjaman Alat/Bahan") return surat.kegiatan || surat.organisasi || "-";
  if (j === "Izin Tidak Mengikuti Kuliah") return surat.mataKuliah || surat.namaDosen || "-";
  if (j === "Izin Praktikum Ulang") return surat.mahasiswas?.[0]?.mataKuliah || "-";
  if (j === "Rekomendasi") return surat.keperluan || "-";
  if (j === "Keterangan") return surat.keperluan || "-";
  if (j === "Keterangan Mahasiswa Kuliah") return surat.keterangan || "-";
  return "-";
}

// Link jenis surat
const ROUTE_MAP = {
  "Peminjaman Ruangan": "/data-surat/peminjaman-ruangan",
  "Peminjaman Alat/Bahan": "/data-surat/peminjaman-alat-bahan",
  "Izin Tidak Mengikuti Kuliah": "/data-surat/izin-tidak-mengikuti-kuliah",
  "Izin Praktikum Ulang": "/data-surat/izin-praktikum-ulang",
  "Rekomendasi": "/data-surat/rekomendasi",
  "Keterangan": "/data-surat/keterangan",
  "Keterangan Mahasiswa Kuliah": "/data-surat/keterangan-mahasiswa-kuliah",
};

// Status
const STATUS_CONFIG = {
  Diterima: { pill: "bg-succes-1 text-white", icon: <CheckCircle2 size={13} /> },
  Ditolak: { pill: "bg-error-2 text-white", icon: <XCircle size={13} /> },
  Revisi: { pill: "bg-warning-1 text-white", icon: <AlertCircle size={13} /> },
  Menunggu: { pill: "bg-warning-1 text-white", icon: <Clock size={13} /> },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { pill: "bg-slate-400 text-white", icon: <AlertCircle size={13} /> };
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold shrink-0 ${cfg.pill}`}>
      {cfg.icon}
      <span>{status}</span>
    </div>
  );
}

function StatCard({ label, value, icon, iconBg, iconColor, loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <p className="text-xs text-neutral-1 mb-1">{label}</p>
      {loading ? (
        <div className="h-8 w-10 bg-slate-100 rounded animate-pulse" />
      ) : (
        <p className="text-[26px] font-bold text-primary-1 leading-none">{value}</p>
      )}
    </div>
  );
}

// Main
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [surats, setSurats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getSurats()
      .then((res) => setSurats(res.data.filter((s) => s.userId === String(user.id))))
      .catch(() => setError("Gagal memuat data. Periksa koneksi Anda."))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const firstName = user?.namaDepan || "Pengguna";
  const total = surats.length;
  const diterima = surats.filter((s) => s.status === "Diterima").length;
  const revisi = surats.filter((s) => s.status === "Revisi").length;
  const ditolak = surats.filter((s) => s.status === "Ditolak").length;
  const pending = surats.filter((s) => !["Diterima", "Ditolak", "Revisi"].includes(s.status)).length;

  const recentSurats = [...surats]
    .sort((a, b) => parseDate(b.tanggalPengajuan) - parseDate(a.tanggalPengajuan))
    .slice(0, 3);

  const stats = [
    { label: "Total pengajuan", value: total, icon: <FileText size={22} />, iconBg: "bg-indigo-50", iconColor: "text-indigo-500" },
    { label: "Diterima", value: diterima, icon: <CheckCircle2 size={22} />, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Revisi", value: revisi, icon: <AlertCircle size={22} />, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    { label: "Ditolak", value: ditolak, icon: <XCircle size={22} />, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  const handleActivityClick = (item) => {
    const base = ROUTE_MAP[item.jenisSurat];
    if (base) navigate(`${base}/${item.id}`);
  };

  return (
    <MainLayout>
      <div className="px-6 pt-6 pb-1 lg:px-8 lg:pt-7 lg:pb-1">

        <p className="text-sm text-neutral-1 mb-1">Master User / Dashboard</p>
        <h1 className="text-2xl lg:text-[32px] font-bold text-primary-1 mb-6">Dashboard</h1>

        {/* Welcome Banner */}
        <div className="bg-primary-2 rounded-2xl px-6 py-6 lg:px-8 lg:py-7 mb-5 text-white">
          <h2 className="text-[18px] lg:text-[22px] font-bold mb-1.5">
            Selamat Datang, {firstName}!
          </h2>
          <p className="text-sm opacity-90">
            {loading
              ? "Memuat data surat..."
              : pending > 0
                ? `Anda memiliki ${pending} surat yang sedang menunggu persetujuan`
                : "Anda tidak memiliki surat yang sedang diajukan/diproses"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => <StatCard key={s.label} {...s} loading={loading} />)}
        </div>

        {/* Aktivitas Terbaru */}
        <h2 className="text-[17px] font-bold text-primary-1 mb-3">Aktivitas Terbaru</h2>

        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden mb-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-4 lg:px-5 ${i < 3 ? "border-b border-slate-100" : ""}`}>
                <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                  <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/4" />
                </div>
                <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse shrink-0" />
              </div>
            ))
          ) : recentSurats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <FileText size={36} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">Belum ada pengajuan surat</p>
            </div>
          ) : (
            recentSurats.map((item, i) => (
              <button
                key={item.id}
                onClick={() => handleActivityClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-4 lg:px-5 text-left
                  hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer
                  ${i < recentSurats.length - 1 ? "border-b border-slate-100" : ""}`}
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary-1 leading-tight truncate">
                    {getSuratTitle(item)}
                  </p>
                  <p className="text-[12px] text-neutral-1 mt-0.5">{item.jenisSurat}</p>
                  <p className="text-[11px] text-neutral-2 mt-0.5">{relativeTime(item.tanggalPengajuan)}</p>
                </div>
                <StatusBadge status={item.status} />
              </button>
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
}