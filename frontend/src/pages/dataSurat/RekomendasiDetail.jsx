import { useParams, useNavigate } from "react-router-dom";
import { SquarePen, ArrowLeft, User, CheckCircle, FileText, MessageSquare, Check, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { rekomendasiData } from "../../test/data";

// Status Badge
function StatusBadge({ status }) {
  const map = {
    Diterima: { iconBg: "bg-succes-1", pillBg: "bg-succes-1", iconColor: "text-succes-1", icon: <Check size={14} strokeWidth={3} />, textColor: "text-primary-1" },
    Ditolak: { iconBg: "bg-error-2", pillBg: "bg-error-2", iconColor: "text-error-2", icon: <X size={14} strokeWidth={3} />, textColor: "text-primary-1" },
    Revisi: { iconBg: "bg-warning-1", pillBg: "bg-warning-1", iconColor: "text-warning-1", icon: <span className="font-black text-[13px] leading-none">!</span>, textColor: "text-primary-1" },
  };
  const cfg = map[status] ?? { iconBg: "bg-slate-400", pillBg: "bg-slate-300", icon: null, textColor: "text-primary-1" };
  return (
    <>
      {/* Desktop */}
      <span className="hidden md:inline-flex items-center gap-2.5">
        <span className={`flex items-center justify-center w-5 h-5 rounded-full ${cfg.iconBg} text-white shrink-0`}>
          {cfg.icon}
        </span>
        <span className={`text-[15px] font-bold ${cfg.textColor}`}>
          {status}
        </span>
      </span>
      {/* Mobile */}
      <span className={`md:hidden inline-flex items-center gap-1.5 ${cfg.pillBg} text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap`}>
        <span className={`flex items-center justify-center w-4 h-4 rounded-full bg-white ${cfg.iconColor} shrink-0`}>
          {cfg.icon}
        </span>
        {status}
      </span>
    </>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary-2/10 flex items-center justify-center text-primary-2 shrink-0">{icon}</div>
        <h3 className="text-base font-bold text-primary-1">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs text-neutral-2 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-primary-1">{value || "-"}</p>
    </div>
  );
}

export default function RekomendasiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = rekomendasiData.find((d) => d.id === Number(id));

  if (!item) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-primary-1 font-semibold text-lg">Data tidak ditemukan</p>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-primary-2 text-sm font-medium hover:underline">
            <ArrowLeft size={15} /> Kembali
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-4 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">Data Surat / Rekomendasi / Detail</p>
        <h1 className="hidden lg:block text-2xl lg:text-3xl font-bold text-primary-1 mb-1">Data Surat Rekomendasi</h1>
      </div>

      <div className="hidden lg:block h-6" />

      <div className="mx-0 lg:mx-8 bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-0 lg:p-7 pb-8">

        {/* Panel Header — Desktop */}
        <div className="hidden lg:flex items-start justify-between gap-4 mb-1">
          <div>
            <h2 className="text-xl font-bold text-primary-1">Detail Surat Rekomendasi</h2>
            <p className="text-sm text-neutral-2 mt-0.5">No. Surat: {item.noSurat}</p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Panel Header — Mobile */}
        <div className="lg:hidden px-4 pt-4 mb-1">
          <h2 className="text-xl font-bold text-primary-1">Detail Surat Rekomendasi</h2>
          <p className="text-sm text-neutral-2 mt-0.5">No. Surat: {item.noSurat}</p>
          <div className="mt-3"><StatusBadge status={item.status} /></div>
        </div>

        <hr className="border-slate-200 my-5 mx-4 lg:mx-0" />

        {/* ── Desktop: 2-column grid ── */}
        {/* LEFT: Informasi Mahasiswa, Detail Permohonan */}
        {/* RIGHT: Informasi Persetujuan, Keterangan */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <SectionCard icon={<User size={20} />} title="Informasi Mahasiswa">
              <div className="grid grid-cols-2 gap-x-6">
                <Field label="NIM" value={item.nim} />
                <Field label="Nama" value={item.nama} />
                <Field label="Program Studi" value={item.prodi} />
                <Field label="Angkatan" value={item.angkatan} />
                <Field label="Semester" value={item.semester} />
                <Field label="Tahun Ajaran" value={item.tahunAjaran} />
              </div>
            </SectionCard>

            <SectionCard icon={<FileText size={20} />} title="Detail Permohonan">
              <Field label="Keperluan" value={item.keperluan} />
              <Field label="Tanggal Pengajuan" value={item.tanggalPengajuan} />
            </SectionCard>
          </div>

          <div className="flex flex-col gap-4">
            <SectionCard icon={<CheckCircle size={20} />} title="Informasi Persetujuan">
              <div className="grid grid-cols-2 gap-x-6">
                <Field label="Disetujui Oleh" value={item.disetujuiOleh} />
                <Field label="Jabatan" value={item.jabatan} />
                <Field label="NIP" value={item.nip} />
                <Field label="Pangkat/Golongan" value={item.pangkat} />
              </div>
            </SectionCard>

            <SectionCard icon={<MessageSquare size={20} />} title="Keterangan">
              <p className="text-sm text-neutral-2 leading-relaxed">{item.keterangan || "-"}</p>
            </SectionCard>
          </div>
        </div>

        {/* ── Mobile: Persetujuan → Mahasiswa → Permohonan → Keterangan ── */}
        <div className="lg:hidden flex flex-col gap-4 px-4">
          <SectionCard icon={<CheckCircle size={20} />} title="Informasi Persetujuan">
            <Field label="Disetujui Oleh" value={item.disetujuiOleh} />
            <Field label="Jabatan" value={item.jabatan} />
            <Field label="NIP" value={item.nip} />
            <Field label="Pangkat/Golongan" value={item.pangkat} />
          </SectionCard>

          <SectionCard icon={<User size={20} />} title="Informasi Mahasiswa">
            <Field label="NIM" value={item.nim} />
            <Field label="Nama" value={item.nama} />
            <Field label="Program Studi" value={item.prodi} />
            <Field label="Angkatan" value={item.angkatan} />
            <Field label="Semester" value={item.semester} />
            <Field label="Tahun Ajaran" value={item.tahunAjaran} />
          </SectionCard>

          <SectionCard icon={<FileText size={20} />} title="Detail Permohonan">
            <Field label="Keperluan" value={item.keperluan} />
            <Field label="Tanggal Pengajuan" value={item.tanggalPengajuan} />
          </SectionCard>

          <SectionCard icon={<MessageSquare size={20} />} title="Keterangan">
            <p className="text-sm text-neutral-2 leading-relaxed">{item.keterangan || "-"}</p>
          </SectionCard>
        </div>

        {/* ── Footer Buttons ── */}
        <div className="flex justify-end items-center gap-3 mt-6 px-4 lg:px-0">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={15} /> Kembali
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-2 hover:bg-blue-600 text-white font-semibold text-sm transition-colors">
            <SquarePen size={15} /> Ubah
          </button>
        </div>
      </div>
    </MainLayout>
  );
}