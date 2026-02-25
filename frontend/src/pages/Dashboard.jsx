// src/pages/Dashboard.jsx
import { FileText, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

const stats = [
  {
    label: "Total pengajuan",
    value: 16,
    icon: <FileText size={22} />,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    label: "Diterima",
    value: 15,
    icon: <CheckCircle2 size={22} />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    label: "Revisi",
    value: 0,
    icon: <AlertCircle size={22} />,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    label: "Ditolak",
    value: 1,
    icon: <XCircle size={22} />,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
];

const activities = [
  {
    title: "Workshop Fisika Modern",
    type: "Peminjaman ruangan",
    time: "2 hari yang lalu",
    status: "Diterima",
  },
  {
    title: "Tunjangan Gaji Orang Tua",
    type: "Keterangan mahasiswa kuliah",
    time: "5 hari yang lalu",
    status: "Diterima",
  },
  {
    title: "Latihan Prapon Badminton",
    type: "Izin praktikum ulang",
    time: "12 hari yang lalu",
    status: "Ditolak",
  },
];

const statusStyle = {
  Diterima: "bg-emerald-500 text-white",
  Ditolak: "bg-red-500 text-white",
  Revisi: "bg-amber-500 text-white",
};

const StatusIcon = ({ status }) => {
  if (status === "Diterima") return <CheckCircle2 size={13} />;
  if (status === "Ditolak") return <XCircle size={13} />;
  return <AlertCircle size={13} />;
};

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="px-6 pt-6 pb-1 lg:px-8 lg:pt-7 lg:pb-1">

        {/* Breadcrumb */}
        <p className="text-xs text-slate-400 mb-1">Master User / Dashboard</p>
        <h1 className="text-2xl lg:text-[28px] font-bold text-primary-1 mb-6">
          Dashboard
        </h1>

        {/* Welcome Banner */}
        <div className="bg-primary-2 rounded-2xl px-6 py-6 lg:px-8 lg:py-7 mb-5 text-white">
          <h2 className="text-[18px] lg:text-[22px] font-bold mb-1.5">
            Selamat Datang, Aldy!
          </h2>
          <p className="text-sm opacity-90">
            Anda memiliki 1 pengajuan surat menunggu persetujuan
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${s.iconBg} ${s.iconColor}`}>
                {s.icon}
              </div>
              <p className="text-xs text-slate-400 mb-1">{s.label}</p>
              <p className="text-[26px] font-bold text-slate-800 leading-none">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 className="text-[17px] font-bold text-slate-800 mb-3">
          Aktivitas Terbaru
        </h2>

        {/* Tidak ada mb di sini — biarkan pb container yang handle jarak bawah */}
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden mb-4">
          {activities.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-4 lg:px-5 hover:bg-slate-50 transition-colors ${
                i < activities.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={16} className="text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                  {item.title}
                </p>
                <p className="text-[12px] text-slate-400 mt-0.5">{item.type}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{item.time}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold shrink-0 ${statusStyle[item.status]}`}>
                <StatusIcon status={item.status} />
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}
