import { useParams, useNavigate } from "react-router-dom";
import { SquarePen, ArrowLeft, FileText, Users, CalendarDays, Info, MessageSquare, Check, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { izinPraktikumUlangData } from "../../test/data";

function StatusBadge({ status }) {
  const map = {
    Diterima: { pillBg: "bg-succes-1", iconColor: "text-succes-1", icon: <Check size={14} strokeWidth={3} /> },
    Ditolak:  { pillBg: "bg-error-2",  iconColor: "text-error-2",  icon: <X size={14} strokeWidth={3} /> },
    Revisi:   { pillBg: "bg-warning-1", iconColor: "text-warning-1", icon: <span className="font-black text-[13px] leading-none">!</span> },
  };
  const cfg = map[status] ?? { pillBg: "bg-slate-400", iconColor: "text-slate-600", icon: null };
  return (
    <span className={`inline-flex items-center gap-2.5 ${cfg.pillBg} text-white font-bold text-sm px-4 py-2.5 lg:rounded-xl rounded-full whitespace-nowrap`}>
      <span className={`flex items-center justify-center w-4 h-4 rounded-full bg-white ${cfg.iconColor} shrink-0`}>{cfg.icon}</span>
      {status}
    </span>
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

// Mahasiswa item
function MahasiswaItem({ index, mhs, showIndex }) {
  return (
    <div className="mb-4 last:mb-0">
      {showIndex && (
        <p className="text-xs text-neutral-2 mb-1">Mahasiswa {index + 1}</p>
      )}
      <p className="text-sm font-medium text-primary-1">{mhs.nama || "-"}</p>
      <p className="text-xs font-medium text-primary-1 mt-0.5">
        {mhs.nim} · {mhs.prodi} · {mhs.mataKuliah}
      </p>
    </div>
  );
}

export default function IzinPraktikumUlangDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = izinPraktikumUlangData.find((d) => d.id === Number(id));

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

  const mahasiswas = item.mahasiswas ?? [];
  const isMulti = mahasiswas.length > 1;

  const cardSurat = (
    <SectionCard icon={<FileText size={20} />} title="Informasi Surat">
      <Field label="No Surat" value={item.noSurat} />
      <Field label="Jenis Surat" value={item.jenisSurat} />
      <Field label="Tanggal Pengajuan" value={item.tanggalPengajuan} />
    </SectionCard>
  );

  const cardMahasiswa = (
    <SectionCard icon={<Users size={20} />} title="Data Mahasiswa">
      {isMulti ? (
        mahasiswas.map((mhs, i) => (
          <MahasiswaItem key={i} index={i} mhs={mhs} showIndex />
        ))
      ) : (
        <>
          <Field label="NIM" value={mahasiswas[0]?.nim} />
          <Field label="Nama" value={mahasiswas[0]?.nama} />
          <Field label="Mata Kuliah" value={mahasiswas[0]?.mataKuliah} />
          <Field label="Program Studi" value={mahasiswas[0]?.prodi} />
        </>
      )}
    </SectionCard>
  );

  const cardJadwal = (
    <SectionCard icon={<CalendarDays size={20} />} title="Jadwal Izin">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Field label="Tanggal Mulai" value={item.tanggalMulai} />
        <Field label="Tanggal Akhir" value={item.tanggalAkhir} />
      </div>
    </SectionCard>
  );

  const cardAlasan = (
    <SectionCard icon={<Info size={20} />} title="Alasan & Tempat Izin">
      <Field label="Sebab" value={item.sebab} />
      <Field label="Tempat" value={item.tempat} />
    </SectionCard>
  );

  const cardKeterangan = (
    <SectionCard icon={<MessageSquare size={20} />} title="Keterangan">
      <p className="text-sm text-neutral-2 leading-relaxed">{item.keterangan === "-" ? "-" : item.keterangan || "-"}</p>
    </SectionCard>
  );

  return (
    <MainLayout>
      <div className="px-4 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">Data Surat / Izin Praktikum Ulang / Detail</p>
        <h1 className="hidden lg:block text-2xl lg:text-3xl font-bold text-primary-1 mb-1">Data Surat Izin Praktikum Ulang</h1>
      </div>

      <div className="hidden lg:block h-6" />

      <div className="mx-0 lg:mx-8 bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-0 lg:p-7 pb-8">

        {/* Header Desktop */}
        <div className="hidden lg:flex items-start justify-between gap-4 mb-1">
          <div>
            <h2 className="text-xl font-bold text-primary-1">Detail Izin Praktikum Ulang</h2>
            <p className="text-sm text-neutral-2 mt-0.5">No. Surat: {item.noSurat}</p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Header Mobile */}
        <div className="lg:hidden px-4 pt-4 mb-1">
          <h2 className="text-xl font-bold text-primary-1">Detail Izin Praktikum Ulang</h2>
          <p className="text-sm text-neutral-2 mt-0.5">No. Surat: {item.noSurat}</p>
          <div className="mt-3"><StatusBadge status={item.status} /></div>
        </div>

        <hr className="border-slate-200 my-5 mx-4 lg:mx-0" />

        {/* Desktop: 2-col — Kiri: Surat + Mahasiswa | Kanan: Jadwal + Alasan + Keterangan */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            {cardSurat}
            {cardMahasiswa}
          </div>
          <div className="flex flex-col gap-4">
            {cardJadwal}
            {cardAlasan}
            {cardKeterangan}
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="lg:hidden flex flex-col gap-4 px-4">
          {cardSurat}
          {cardMahasiswa}
          {cardJadwal}
          {cardAlasan}
          {cardKeterangan}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-3 mt-6 px-4 lg:px-0">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-colors">
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