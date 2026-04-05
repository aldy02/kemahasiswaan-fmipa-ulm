// src/pages/FormPeminjamanAlatBahan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, FileText, Users, Package, Calendar, Info, Plus, Trash2, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { peminjamanAlatBahanData } from "../../test/data";

// ── Reusable primitives ───────────────────────────────────────────────────────
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

function NumberInput({ placeholder, value, onChange }) {
  return (
    <input
      type="number"
      min="1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all"
    />
  );
}

// DateInput — dd/mm/yy text format
function DateInput({ value, onChange }) {
  const toDisplay = (v) => {
    if (!v) return "";
    const [y, m, d] = v.split("-");
    if (!y || !m || !d) return v;
    return `${d}/${m}/${y.slice(-2)}`;
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

// ── Section Card ──────────────────────────────────────────────────────────────
function Card({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 lg:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.05)] lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:border lg:border-slate-200">
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

// ── Icon: group of people ─────────────────────────────────────────────────────
const PeopleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function toInputDate(str) {
  if (!str || str === "-") return "";
  const p = str.split("-");
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : "";
}

// Parse "Proyektor - 1" → { nama: "Proyektor", jumlah: "1" }
function parseAlatItem(raw) {
  if (!raw) return { nama: "", jumlah: "" };
  const lastDash = raw.lastIndexOf(" - ");
  if (lastDash === -1) return { nama: raw, jumlah: "" };
  return { nama: raw.slice(0, lastDash).trim(), jumlah: raw.slice(lastDash + 3).trim() };
}

// ── Alat/Bahan sub-section ────────────────────────────────────────────────────
function AlatBahanSection({ items, setItems }) {
  const addItem = () => setItems([...items, { nama: "", jumlah: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => {
    const next = items.map((it, idx) => idx === i ? { ...it, [field]: val } : it);
    setItems(next);
  };

  return (
    <div className="flex flex-col gap-5">
      {items.map((it, i) => (
        <div key={i}>
          {/* Desktop item label — no delete button beside it */}
          <p className="hidden lg:block text-sm font-semibold text-primary-1 mb-4">Item {i + 1}</p>

          {/* Mobile item label — delete button sejajar di kanan */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <p className="text-[13px] font-semibold text-primary-1">Item {i + 1}</p>
            {items.length > 1 && (
              <button
                onClick={() => removeItem(i)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-error-2 text-white hover:bg-red-500 transition-colors shrink-0"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Desktop: inputs + delete button in one row */}
          <div className="hidden lg:flex items-end gap-3">
            <div className="flex-1">
              <Label required>Nama Alat/Bahan</Label>
              <TextInput
                placeholder="Masukkan nama alat/bahan"
                value={it.nama}
                onChange={(v) => updateItem(i, "nama", v)}
              />
            </div>
            <div className="flex-1">
              <Label required>Jumlah Alat/Bahan</Label>
              <NumberInput
                placeholder="Masukkan jumlah (contoh: 5, 10, 25)"
                value={it.jumlah}
                onChange={(v) => updateItem(i, "jumlah", v)}
              />
            </div>
            {/* Delete button — square box, hover red */}
            {items.length > 1 ? (
              <button
                onClick={() => removeItem(i)}
                className="w-10.5 h-10.5 flex items-center justify-center rounded-xl border border-slate-200 bg-gray-50 text-slate-400 hover:border-error-1 hover:bg-error-1/5 hover:text-error-1 transition-colors shrink-0"
              >
                <X size={16} strokeWidth={2} />
              </button>
            ) : (
              <div className="w-10.5 shrink-0" />
            )}
          </div>
          {/* Desktop separator between items */}
          {i < items.length - 1 && (
            <hr className="hidden lg:block border-slate-200 mt-7" />
          )}

          {/* Mobile: stacked inputs + separator between items */}
          <div className="lg:hidden">
            <div className="flex flex-col gap-3">
              <div>
                <Label required>Nama Alat/Bahan</Label>
                <TextInput
                  placeholder="Masukkan nama alat/bahan"
                  value={it.nama}
                  onChange={(v) => updateItem(i, "nama", v)}
                />
              </div>
              <div>
                <Label required>Jumlah Alat/Bahan</Label>
                <NumberInput
                  placeholder="Masukkan jumlah (contoh: 5, 10, 25)"
                  value={it.jumlah}
                  onChange={(v) => updateItem(i, "jumlah", v)}
                />
              </div>
            </div>
            {i < items.length - 1 && (
              <hr className="border-slate-200 mt-7" />
            )}
          </div>
        </div>
      ))}

      <div>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-2 hover:bg-blue-600 text-white text-[13px] font-semibold rounded-xl transition-colors"
        >
          <Plus size={14} /> Tambah
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FormPeminjamanAlatBahan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [noSurat, setNoSurat] = useState("");
  const [namaOrganisasi, setNamaOrganisasi] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [namaPJ, setNamaPJ] = useState("");
  const [kontakPJ, setKontakPJ] = useState("");
  const [namaKetPelaksana, setNamaKetPelaksana] = useState("");
  const [nimKetPelaksana, setNimKetPelaksana] = useState("");
  const [namaKetOrg, setNamaKetOrg] = useState("");
  const [nimKetOrg, setNimKetOrg] = useState("");
  const [alatItems, setAlatItems] = useState([{ nama: "", jumlah: "" }]);
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const item = peminjamanAlatBahanData.find((d) => d.id === Number(id));
    if (!item) return;
    setNoSurat(item.noSurat === "-" ? "" : item.noSurat || "");
    setNamaOrganisasi(item.organisasi || "");
    setNamaKegiatan(item.kegiatan || "");
    setNamaPJ(item.penanggungJawab?.nama || "");
    setKontakPJ(item.penanggungJawab?.telp || "");
    setNamaKetPelaksana(item.ketuaPelaksana?.nama || "");
    setNimKetPelaksana(item.ketuaPelaksana?.nim || "");
    setNamaKetOrg(item.ketuaOrganisasi?.nama || "");
    setNimKetOrg(item.ketuaOrganisasi?.nim || item.ketuaOrganisasi?.telp || "");
    setTanggalPinjam(toInputDate(item.tanggalPinjam));
    setTanggalKembali(toInputDate(item.tanggalKembali));
    setKeterangan(item.keterangan || "");
    // parse daftarAlat
    if (item.daftarAlat?.length) {
      setAlatItems(item.daftarAlat.map((a) => parseAlatItem(a.nama)));
    }
  }, [id, isEdit]);

  // ── Shared section content ──────────────────────────────────────────────────
  const sectionInformasiSurat = (
    <Card icon={<FileText size={18} />} title="Informasi Surat" subtitle="Masukkan informasi terkait nomor surat pengajuan">
      <Label>No Surat</Label>
      <TextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} />
    </Card>
  );

  const sectionOrganisasi = (
    <Card icon={<PeopleIcon size={18} />} title="Detail Organisasi & Kegiatan" subtitle="Informasi lengkap mengenai organisasi dan kegiatan yang akan dilaksanakan">
      {/* Desktop: 2 columns, Mobile: stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label required>Nama Organisasi</Label>
          <TextInput placeholder="Masukkan nama organisasi" value={namaOrganisasi} onChange={setNamaOrganisasi} />
        </div>
        <div>
          <Label required>Nama Kegiatan</Label>
          <TextInput placeholder="Masukkan nama kegiatan" value={namaKegiatan} onChange={setNamaKegiatan} />
        </div>
      </div>
    </Card>
  );

  const sectionKepemimpinan = (
    <Card icon={<Users size={18} />} title="Informasi Kepemimpinan" subtitle="Data penanggung jawab, ketua organisasi, dan ketua pelaksana kegiatan">
      {/* Desktop: 3 columns */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
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
      {/* Mobile: stacked */}
      <div className="lg:hidden flex flex-col gap-0">
        <p className="text-[13px] font-semibold text-primary-1 mb-2">Penanggung Jawab</p>
        <hr className="border-slate-200 mb-3" />
        <div className="flex flex-col gap-3 mb-5">
          <div><Label required>Nama Penanggung Jawab</Label><TextInput placeholder="Masukkan nama penanggung jawab" value={namaPJ} onChange={setNamaPJ} /></div>
          <div><Label required>Kontak Penanggung Jawab</Label><TextInput placeholder="Masukkan nomor telepon" value={kontakPJ} onChange={setKontakPJ} type="tel" /></div>
        </div>
        <p className="text-[13px] font-semibold text-primary-1 mb-2">Ketua Pelaksana</p>
        <hr className="border-slate-200 mb-3" />
        <div className="flex flex-col gap-3 mb-5">
          <div><Label required>Nama Ketua Pelaksana</Label><TextInput placeholder="Masukkan nama ketua pelaksana" value={namaKetPelaksana} onChange={setNamaKetPelaksana} /></div>
          <div><Label required>NIM Ketua Pelaksana</Label><TextInput placeholder="Masukkan NIM ketua pelaksana" value={nimKetPelaksana} onChange={setNimKetPelaksana} /></div>
        </div>
        <p className="text-[13px] font-semibold text-primary-1 mb-2">Ketua Organisasi</p>
        <hr className="border-slate-200 mb-3" />
        <div className="flex flex-col gap-3">
          <div><Label required>Nama Ketua Organisasi</Label><TextInput placeholder="Masukkan nama ketua organisasi" value={namaKetOrg} onChange={setNamaKetOrg} /></div>
          <div><Label required>NIM Ketua Organisasi</Label><TextInput placeholder="Masukkan NIM Ketua Organisasi" value={nimKetOrg} onChange={setNimKetOrg} /></div>
        </div>
      </div>
    </Card>
  );

  const sectionAlatBahan = (
    <Card icon={<Package size={18} />} title="Detail Alat/Bahan" subtitle="Informasi alat atau bahan yang akan dipinjam">
      <AlatBahanSection items={alatItems} setItems={setAlatItems} />
    </Card>
  );

  const sectionJadwal = (
    <Card icon={<Calendar size={18} />} title="Jadwal Peminjaman" subtitle="Tentukan tanggal peminjaman dan pengembalian alat/bahan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div><Label required>Tanggal Pinjam</Label><DateInput value={tanggalPinjam} onChange={setTanggalPinjam} /></div>
        <div><Label required>Tanggal Kembali</Label><DateInput value={tanggalKembali} onChange={setTanggalKembali} /></div>
      </div>
    </Card>
  );

  const sectionTambahan = (
    <Card icon={<Info size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait peminjaman alat/bahan">
      <Label>Keterangan</Label>
      <textarea
        value={keterangan}
        onChange={(e) => setKeterangan(e.target.value)}
        placeholder="Masukkan keterangan tambahan jika diperlukan"
        rows={4}
        className="w-full px-3.5 py-3 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all resize-none"
      />
    </Card>
  );

  return (
    <MainLayout>
      {/* ── Page header ── */}
      <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">Pengajuan Surat / Peminjaman Alat/Bahan</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-primary-1 leading-tight">
          {isEdit ? "Ubah Surat Peminjaman Alat/Bahan" : "Pengajuan Surat Peminjaman Alat/Bahan"}
        </h1>
        <p className="lg:hidden text-[13px] text-neutral-2 mt-1">
          Silahkan lengkapi formulir di bawah ini untuk mengajukan peminjaman alat/bahan
        </p>
      </div>

      <div className="hidden lg:block h-6" />

      <div className="mx-0 lg:mx-8 pb-10">

        {/* ── Desktop: white outer panel ── */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-8">
          <h2 className="text-xl font-bold text-primary-1 mb-1">Form Peminjaman Alat/Bahan</h2>
          <p className="text-sm text-neutral-2 mb-7">Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman alat/bahan</p>

          <div className="flex flex-col gap-5">
            {sectionInformasiSurat}
            {sectionOrganisasi}
            {sectionKepemimpinan}
            {sectionAlatBahan}
            {sectionJadwal}
            {sectionTambahan}
          </div>

          {/* Desktop footer — inside panel */}
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

        {/* ── Mobile: cards stacked on page background ── */}
        <div className="lg:hidden flex flex-col gap-4 px-4 pt-4">
          {sectionInformasiSurat}
          {sectionOrganisasi}
          {sectionKepemimpinan}
          {sectionAlatBahan}
          {sectionJadwal}
          {sectionTambahan}
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