// src/pages/FormPeminjamanRuangan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, FileText, Users, Calendar, Info } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { peminjamanRuanganData } from "../../test/data";

const TEMPAT_OPTIONS = [
  "Ruang Kuliah I.1.1",
  "Ruang Kuliah I.1.2",
  "Ruang Kuliah I.1.3",
  "Ruang Kuliah I.2.1",
  "Ruang Kuliah I.2.3",
  "Ruang Kuliah I.2.4",
  "Ruang Kuliah I.2.6",
  "Ruang Kuliah II.1.2",
];

// ── Input primitives ──────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-[13px] lg:text-sm font-medium text-primary-1 mb-1.5">
      {children}{required && <span className="text-error-1 ml-0.5">*</span>}
    </label>
  );
}

function TextInput({ placeholder, value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all"
    />
  );
}

function SelectInput({ placeholder, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 text-[13px] lg:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all pr-10 ${value ? "text-primary-1" : "text-neutral-2"}`}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((o) => <option key={o} value={o} className="text-primary-1">{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

function DateInput({ value, onChange }) {
  // value stored as "yyyy-mm-dd", displayed as "dd/mm/yy"
  const toDisplay = (v) => {
    if (!v) return "";
    const [y, m, d] = v.split("-");
    if (!y || !m || !d) return v;
    return `${d}/${m}/${y.slice(-2)}`;
  };
  const handleInput = (raw) => {
    // strip non-digits
    const digits = raw.replace(/\D/g, "");
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    if (digits.length > 4) formatted = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4, 6);
    // convert to yyyy-mm-dd for storage when complete
    if (digits.length === 6) {
      const d = digits.slice(0, 2);
      const m = digits.slice(2, 4);
      const y = "20" + digits.slice(4, 6);
      onChange(`${y}-${m}-${d}`);
    } else {
      // store partial as-is so field stays editable
      onChange(digits.length === 0 ? "" : value);
    }
    return formatted;
  };
  const [display, setDisplay] = React.useState(toDisplay(value));
  React.useEffect(() => { setDisplay(toDisplay(value)); }, [value]);

  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-2 pointer-events-none">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </span>
      <input
        type="text"
        inputMode="numeric"
        maxLength={8}
        placeholder="dd/mm/yy"
        value={display}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
          let fmt = digits;
          if (digits.length > 2) fmt = digits.slice(0, 2) + "/" + digits.slice(2);
          if (digits.length > 4) fmt = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4, 6);
          setDisplay(fmt);
          if (digits.length === 6) {
            const d = digits.slice(0, 2);
            const m = digits.slice(2, 4);
            const y = "20" + digits.slice(4, 6);
            onChange(`${y}-${m}-${d}`);
          } else if (digits.length === 0) {
            onChange("");
          }
        }}
        className={`w-full pl-10 pr-4 py-2.5 text-[13px] lg:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all ${display ? "text-primary-1" : "text-neutral-2"}`}
      />
    </div>
  );
}

function TimeInput({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-2 pointer-events-none">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </span>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 text-[13px] lg:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all ${value ? "text-primary-1" : "text-neutral-2"}`}
      />
    </div>
  );
}

// ── Section card — same look on mobile and desktop ────────────────────────────
function Card({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 lg:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.05)] lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-0 lg:border lg:border-slate-200">
      <div className="flex items-start gap-3 mb-5 lg:mb-6">
        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-primary-2/10 flex items-center justify-center text-primary-2 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-[15px] lg:text-base font-bold text-primary-1 leading-snug">{title}</h3>
          {subtitle && <p className="text-[11px] lg:text-xs text-neutral-2 mt-0.5 leading-snug">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function toInputDate(str) {
  if (!str || str === "-") return "";
  const p = str.split("-");
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : "";
}
function toInputTime(str) {
  return str ? str.replace(" WITA", "").trim() : "";
}

// ── Icon: group of people (Kepemimpinan) ─────────────────────────────────────
const PeopleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FormPeminjamanRuangan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [noSurat, setNoSurat] = useState("");
  const [namaOrganisasi, setNamaOrganisasi] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tempatKegiatan, setTempatKegiatan] = useState("");
  const [namaPJ, setNamaPJ] = useState("");
  const [kontakPJ, setKontakPJ] = useState("");
  const [namaKetPelaksana, setNamaKetPelaksana] = useState("");
  const [nimKetPelaksana, setNimKetPelaksana] = useState("");
  const [namaKetOrg, setNamaKetOrg] = useState("");
  const [nimKetOrg, setNimKetOrg] = useState("");
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamBerakhir, setJamBerakhir] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const item = peminjamanRuanganData.find((d) => d.id === Number(id));
    if (!item) return;
    setNoSurat(item.noSurat === "-" ? "" : item.noSurat || "");
    setNamaOrganisasi(item.organisasi || "");
    setNamaKegiatan(item.namaKegiatan || "");
    setTempatKegiatan(item.tempatKegiatan || "");
    setNamaPJ(item.penanggungJawab?.nama || "");
    setKontakPJ(item.penanggungJawab?.telp || "");
    setNamaKetPelaksana(item.ketuaPelaksana?.nama || "");
    setNimKetPelaksana(item.ketuaPelaksana?.nim || "");
    setNamaKetOrg(item.ketuaOrganisasi?.nama || "");
    setNimKetOrg(item.ketuaOrganisasi?.nim || "");
    setTanggalPinjam(toInputDate(item.tanggalPinjam));
    setTanggalKembali(toInputDate(item.tanggalKembali));
    setJamMulai(toInputTime(item.jamMulai));
    setJamBerakhir(toInputTime(item.jamBerakhir));
    setKeterangan(item.keterangan || "");
  }, [id, isEdit]);

  return (
    <MainLayout>
      {/* ── Page header ── */}
      <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">Pengajuan Surat / Peminjaman Ruangan</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-primary-1 leading-tight">
          {isEdit ? "Ubah Surat Peminjaman Ruangan" : "Pengajuan Surat Peminjaman Ruangan"}
        </h1>
        {/* Mobile subtitle */}
        <p className="lg:hidden text-[13px] text-neutral-2 mt-1">
          Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman ruangan
        </p>
      </div>

      <div className="hidden lg:block h-6" />

      {/* ── Content area ── */}
      <div className="mx-0 lg:mx-8 pb-10">

        {/* Desktop: white outer panel wrapping all cards */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-8">
          <h2 className="text-xl font-bold text-primary-1 mb-1">Form Peminjaman Ruangan</h2>
          <p className="text-sm text-neutral-2 mb-7">Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman ruangan</p>

          <div className="flex flex-col gap-5">
            {/* 1 */}
            <Card icon={<FileText size={20} />} title="Informasi Surat" subtitle="Masukkan informasi terkait nomor surat pengajuan">
              <Label>No Surat</Label>
              <TextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} />
            </Card>
            {/* 2 */}
            <Card icon={<PeopleIcon size={20} />} title="Detail Organisasi & Kegiatan" subtitle="Informasi lengkap mengenai organisasi dan kegiatan yang akan dilaksanakan">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><Label required>Nama Organisasi</Label><TextInput placeholder="Masukkan nama organisasi" value={namaOrganisasi} onChange={setNamaOrganisasi} /></div>
                <div><Label required>Nama Kegiatan</Label><TextInput placeholder="Masukkan nama kegiatan" value={namaKegiatan} onChange={setNamaKegiatan} /></div>
              </div>
              <Label required>Tempat Kegiatan</Label>
              <SelectInput placeholder="Pilih tempat kegiatan" value={tempatKegiatan} onChange={setTempatKegiatan} options={TEMPAT_OPTIONS} />
            </Card>
            {/* 3 */}
            <Card icon={<Users size={20} />} title="Informasi Kepemimpinan" subtitle="Data penanggung jawab, ketua organisasi, dan ketua pelaksana kegiatan">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold text-primary-1 mb-3 pb-2 border-b border-slate-200">Penanggung Jawab</p>
                  <div className="flex flex-col gap-3">
                    <div><Label required>Nama Penanggung Jawab</Label><TextInput placeholder="Masukkan nama penanggung jawab" value={namaPJ} onChange={setNamaPJ} /></div>
                    <div><Label required>Kontak Penanggung Jawab</Label><TextInput placeholder="Masukkan nomor telepon" value={kontakPJ} onChange={setKontakPJ} type="tel" /></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-1 mb-3 pb-2 border-b border-slate-200">Ketua Pelaksana</p>
                  <div className="flex flex-col gap-3">
                    <div><Label required>Nama Ketua Pelaksana</Label><TextInput placeholder="Masukkan nama ketua pelaksana" value={namaKetPelaksana} onChange={setNamaKetPelaksana} /></div>
                    <div><Label required>NIM Ketua Pelaksana</Label><TextInput placeholder="Masukkan NIM ketua pelaksana" value={nimKetPelaksana} onChange={setNimKetPelaksana} /></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-1 mb-3 pb-2 border-b border-slate-200">Ketua Organisasi</p>
                  <div className="flex flex-col gap-3">
                    <div><Label required>Nama Ketua Organisasi</Label><TextInput placeholder="Masukkan nama ketua organisasi" value={namaKetOrg} onChange={setNamaKetOrg} /></div>
                    <div><Label required>NIM Ketua Organisasi</Label><TextInput placeholder="Masukkan NIM Ketua Organisasi" value={nimKetOrg} onChange={setNimKetOrg} /></div>
                  </div>
                </div>
              </div>
            </Card>
            {/* 4 */}
            <Card icon={<Calendar size={20} />} title="Jadwal Peminjaman" subtitle="Tentukan tanggal dan waktu peminjaman ruangan">
              <div className="grid grid-cols-2 gap-4">
                <div><Label required>Tanggal Pinjam</Label><DateInput value={tanggalPinjam} onChange={setTanggalPinjam} /></div>
                <div><Label required>Tanggal Kembali</Label><DateInput value={tanggalKembali} onChange={setTanggalKembali} /></div>
                <div><Label required>Jam Mulai</Label><TimeInput value={jamMulai} onChange={setJamMulai} /></div>
                <div><Label required>Jam Berakhir</Label><TimeInput value={jamBerakhir} onChange={setJamBerakhir} /></div>
              </div>
            </Card>
            {/* 5 */}
            <Card icon={<Info size={20} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait peminjaman ruangan">
              <Label>Keterangan</Label>
              <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Masukkan keterangan tambahan jika diperlukan" rows={4}
                className="w-full px-4 py-3 text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all resize-none" />
            </Card>
          </div>

          {/* Desktop footer — inside the white panel */}
          <div className="hidden lg:flex justify-end items-center gap-3 mt-7 pt-5 border-t border-slate-200">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={15} /> Kembali
            </button>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <Send size={15} /> Kirim
            </button>
          </div>
        </div>

        {/* Mobile: cards stacked directly on the page background */}
        <div className="lg:hidden flex flex-col gap-4 px-4 pt-4">

          {/* 1. Informasi Surat */}
          <Card icon={<FileText size={18} />} title="Informasi Surat" subtitle="Masukkan informasi terkait nomor surat pengajuan">
            <Label>No Surat</Label>
            <TextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} />
          </Card>

          {/* 2. Detail Organisasi & Kegiatan */}
          <Card icon={<PeopleIcon size={18} />} title="Detail Organisasi & Kegiatan" subtitle="Informasi lengkap mengenai organisasi dan kegiatan yang akan dilaksanakan">
            <div className="flex flex-col gap-3.5">
              <div><Label required>Nama Organisasi</Label><TextInput placeholder="Masukkan nama organisasi" value={namaOrganisasi} onChange={setNamaOrganisasi} /></div>
              <div><Label required>Nama Kegiatan</Label><TextInput placeholder="Masukkan nama kegiatan" value={namaKegiatan} onChange={setNamaKegiatan} /></div>
              <div><Label required>Tempat Kegiatan</Label><SelectInput placeholder="Pilih tempat kegiatan" value={tempatKegiatan} onChange={setTempatKegiatan} options={TEMPAT_OPTIONS} /></div>
            </div>
          </Card>

          {/* 3. Informasi Kepemimpinan */}
          <Card icon={<Users size={18} />} title="Informasi Kepemimpinan" subtitle="Data penanggung jawab, ketua organisasi, dan ketua pelaksana kegiatan">
            {/* Penanggung Jawab */}
            <p className="text-[13px] font-semibold text-primary-1 mb-2">Penanggung Jawab</p>
            <hr className="border-slate-200 mb-3" />
            <div className="flex flex-col gap-3 mb-5">
              <div><Label required>Nama Penanggung Jawab</Label><TextInput placeholder="Masukkan nama penanggung jawab" value={namaPJ} onChange={setNamaPJ} /></div>
              <div><Label required>Kontak Penanggung Jawab</Label><TextInput placeholder="Masukkan nomor telepon" value={kontakPJ} onChange={setKontakPJ} type="tel" /></div>
            </div>
            {/* Ketua Pelaksana */}
            <p className="text-[13px] font-semibold text-primary-1 mb-2">Ketua Pelaksana</p>
            <hr className="border-slate-200 mb-3" />
            <div className="flex flex-col gap-3 mb-5">
              <div><Label required>Nama Ketua Pelaksana</Label><TextInput placeholder="Masukkan nama ketua pelaksana" value={namaKetPelaksana} onChange={setNamaKetPelaksana} /></div>
              <div><Label required>NIM Ketua Pelaksana</Label><TextInput placeholder="Masukkan NIM ketua pelaksana" value={nimKetPelaksana} onChange={setNimKetPelaksana} /></div>
            </div>
            {/* Ketua Organisasi */}
            <p className="text-[13px] font-semibold text-primary-1 mb-2">Ketua Organisasi</p>
            <hr className="border-slate-200 mb-3" />
            <div className="flex flex-col gap-3">
              <div><Label required>Nama Ketua Organisasi</Label><TextInput placeholder="Masukkan nama ketua organisasi" value={namaKetOrg} onChange={setNamaKetOrg} /></div>
              <div><Label required>NIM Ketua Organisasi</Label><TextInput placeholder="Masukkan NIM Ketua Organisasi" value={nimKetOrg} onChange={setNimKetOrg} /></div>
            </div>
          </Card>

          {/* 4. Jadwal Peminjaman */}
          <Card icon={<Calendar size={18} />} title="Jadwal Peminjaman" subtitle="Tentukan tanggal dan waktu peminjaman ruangan">
            <div className="flex flex-col gap-3.5">
              <div><Label required>Tanggal Pinjam</Label><DateInput value={tanggalPinjam} onChange={setTanggalPinjam} /></div>
              <div><Label required>Tanggal Kembali</Label><DateInput value={tanggalKembali} onChange={setTanggalKembali} /></div>
              <div><Label required>Jam Mulai</Label><TimeInput value={jamMulai} onChange={setJamMulai} /></div>
              <div><Label required>Jam Berakhir</Label><TimeInput value={jamBerakhir} onChange={setJamBerakhir} /></div>
            </div>
          </Card>

          {/* 5. Informasi Tambahan */}
          <Card icon={<Info size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait peminjaman ruangan">
            <Label>Keterangan</Label>
            <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Masukkan keterangan tambahan jika diperlukan" rows={4}
              className="w-full px-3.5 py-3 text-[13px] text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all resize-none" />
          </Card>

        </div>

        {/* Mobile footer buttons */}
        <div className="lg:hidden flex flex-col gap-3 mt-6 px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={15} /> Kembali
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-all shadow-md shadow-blue-200 hover:shadow-blue-300"
          >
            <Send size={15} /> Kirim
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
