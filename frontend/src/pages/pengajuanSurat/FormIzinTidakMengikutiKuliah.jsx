// src/pages/FormIzinTidakMengikutiKuliah.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Users, GraduationCap, CalendarDays, Info, MessageSquare, Plus, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { izinTidakMengikutiKuliahData } from "../../test/data";

const PRODI_OPTIONS = [
  "S1 Matematika",
  "S1 Statistika",
  "S1 Fisika",
  "S1 Kimia",
  "S1 Biologi",
  "S1 Ilmu Komputer",
  "S1 Farmasi",
];

// ── Primitives ────────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-[13px] lg:text-sm font-medium text-primary-1 mb-1.5">
      {children}{required && <span className="text-error-1 ml-0.5">*</span>}
    </label>
  );
}

function TextInput({ placeholder, value, onChange, type = "text" }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3.5 py-2.5 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all"
    />
  );
}

function SelectInput({ placeholder, value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
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
      <input type="text" inputMode="numeric" maxLength={8} placeholder="dd/mm/yy" value={display}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
          let fmt = digits;
          if (digits.length > 2) fmt = digits.slice(0, 2) + "/" + digits.slice(2);
          if (digits.length > 4) fmt = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4, 6);
          setDisplay(fmt);
          if (digits.length === 6) {
            const d = digits.slice(0, 2), m = digits.slice(2, 4), y = "20" + digits.slice(4, 6);
            onChange(`${y}-${m}-${d}`);
          } else if (digits.length === 0) { onChange(""); }
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
        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-primary-2/10 flex items-center justify-center text-primary-2 shrink-0">{icon}</div>
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

// ── Data Mahasiswa dynamic list ───────────────────────────────────────────────
function MahasiswaSection({ items, setItems }) {
  const addItem = () => setItems([...items, { nim: "", nama: "", prodi: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  return (
    <div className="flex flex-col gap-5">
      {items.map((it, i) => (
        <div key={i}>
          {/* Desktop label */}
          <p className="hidden lg:block text-sm font-semibold text-primary-1 mb-4">Mahasiswa {i + 1}</p>

          {/* Mobile label + delete button */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <p className="text-[13px] font-semibold text-primary-1">Mahasiswa {i + 1}</p>
            {items.length > 1 && (
              <button onClick={() => removeItem(i)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-error-2 text-white hover:bg-red-500 transition-colors shrink-0">
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Desktop: 3 fields in row + delete */}
          <div className="hidden lg:flex items-end gap-3">
            <div className="flex-1">
              <Label required>NIM Mahasiswa</Label>
              <TextInput placeholder="Masukkan NIM mahasiswa" value={it.nim} onChange={(v) => updateItem(i, "nim", v)} />
            </div>
            <div className="flex-1">
              <Label required>Nama Mahasiswa</Label>
              <TextInput placeholder="Masukkan nama mahasiswa" value={it.nama} onChange={(v) => updateItem(i, "nama", v)} />
            </div>
            <div className="flex-1">
              <Label required>Program Studi Mahasiswa</Label>
              <SelectInput placeholder="Pilih program studi mahasiswa" value={it.prodi} onChange={(v) => updateItem(i, "prodi", v)} options={PRODI_OPTIONS} />
            </div>
            {items.length > 1 ? (
              <button onClick={() => removeItem(i)}
                className="w-10.5 h-10.5 flex items-center justify-center rounded-xl border border-slate-200 bg-gray-50 text-slate-400 hover:border-error-1 hover:bg-error-1/5 hover:text-error-1 transition-colors shrink-0">
                <X size={16} strokeWidth={2} />
              </button>
            ) : <div className="w-10.5 shrink-0" />}
          </div>
          {/* Desktop separator */}
          {i < items.length - 1 && <hr className="hidden lg:block border-slate-200 mt-7" />}

          {/* Mobile: stacked */}
          <div className="lg:hidden flex flex-col gap-3">
            <div><Label required>NIM Mahasiswa</Label><TextInput placeholder="Masukkan NIM mahasiswa" value={it.nim} onChange={(v) => updateItem(i, "nim", v)} /></div>
            <div><Label required>Nama Mahasiswa</Label><TextInput placeholder="Masukkan nama mahasiswa" value={it.nama} onChange={(v) => updateItem(i, "nama", v)} /></div>
            <div><Label required>Program Studi Mahasiswa</Label><SelectInput placeholder="Pilih program studi mahasiswa" value={it.prodi} onChange={(v) => updateItem(i, "prodi", v)} options={PRODI_OPTIONS} /></div>
          </div>
          {i < items.length - 1 && <hr className="lg:hidden border-slate-200 mt-5" />}
        </div>
      ))}

      <div>
        <button onClick={addItem}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-2 hover:bg-blue-600 text-white text-[13px] font-semibold rounded-xl transition-colors">
          <Plus size={14} /> Tambah
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FormIzinTidakMengikutiKuliah() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [mahasiswaItems, setMahasiswaItems] = useState([{ nim: "", nama: "", prodi: "" }]);
  const [namaDosen, setNamaDosen] = useState("");
  const [mataKuliah, setMataKuliah] = useState("");
  const [prodiDosen, setProdiDosen] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [sebab, setSebab] = useState("");
  const [tempat, setTempat] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const item = izinTidakMengikutiKuliahData.find((d) => d.id === Number(id));
    if (!item) return;
    setMahasiswaItems([{ nim: item.nim || "", nama: item.nama || "", prodi: item.prodi || "" }]);
    setNamaDosen(item.namaDosen || "");
    setMataKuliah(item.mataKuliah || "");
    setProdiDosen(item.prodiDosen || "");
    setTanggalMulai(toInputDate(item.tanggalMulai));
    setTanggalAkhir(toInputDate(item.tanggalAkhir));
    setSebab(item.sebab || "");
    setTempat(item.tempat === "-" ? "" : item.tempat || "");
    setKeterangan(item.keterangan || "");
  }, [id, isEdit]);

  // ── Sections ──────────────────────────────────────────────────────────────
  const sectionMahasiswa = (
    <Card icon={<Users size={18} />} title="Data Mahasiswa" subtitle="Informasi lengkap mahasiswa yang mengajukan izin tidak mengikuti kuliah">
      <MahasiswaSection items={mahasiswaItems} setItems={setMahasiswaItems} />
    </Card>
  );

  const sectionMataKuliah = (
    <Card icon={<GraduationCap size={18} />} title="Informasi Mata Kuliah" subtitle="Data mata kuliah dan dosen pengampu yang akan ditinggalkan">
      {/* Desktop: 3 cols */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
        <div><Label required>Nama Dosen</Label><TextInput placeholder="Masukkan nama dosen pengampu" value={namaDosen} onChange={setNamaDosen} /></div>
        <div><Label required>Mata Kuliah</Label><TextInput placeholder="Masukkan nama mata kuliah" value={mataKuliah} onChange={setMataKuliah} /></div>
        <div><Label required>Program Studi</Label><SelectInput placeholder="Masukkan program studi dosen" value={prodiDosen} onChange={setProdiDosen} options={PRODI_OPTIONS} /></div>
      </div>
      {/* Mobile: stacked */}
      <div className="lg:hidden flex flex-col gap-3">
        <div><Label required>Nama Dosen</Label><TextInput placeholder="Masukkan nama dosen pengampu" value={namaDosen} onChange={setNamaDosen} /></div>
        <div><Label required>Mata Kuliah</Label><TextInput placeholder="Masukkan nama mata kuliah" value={mataKuliah} onChange={setMataKuliah} /></div>
        <div><Label required>Program Studi</Label><SelectInput placeholder="Masukkan program studi dosen" value={prodiDosen} onChange={setProdiDosen} options={PRODI_OPTIONS} /></div>
      </div>
    </Card>
  );

  const sectionJadwal = (
    <Card icon={<CalendarDays size={18} />} title="Jadwal Izin" subtitle="Tentukan periode waktu izin tidak mengikuti kuliah">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div><Label required>Tanggal Mulai</Label><DateInput value={tanggalMulai} onChange={setTanggalMulai} /></div>
        <div><Label required>Tanggal Akhir</Label><DateInput value={tanggalAkhir} onChange={setTanggalAkhir} /></div>
      </div>
    </Card>
  );

  const sectionAlasan = (
      <Card icon={<Info size={18} />} title="Alasan & Tempat Izin" subtitle="Sebab dan lokasi terkait izin tidak mengikuti kuliah">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label required>Sebab</Label>
            <textarea value={sebab} onChange={(e) => setSebab(e.target.value)} placeholder="Masukkan alasan tidak mengikuti kuliah" rows={3}
              className="w-full px-3.5 py-3 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all resize-none" />
          </div>
          <div>
            <Label required>Tempat</Label>
            <textarea value={tempat} onChange={(e) => setTempat(e.target.value)} placeholder="Masukkan lokasi/tempat tujuan" rows={3}
              className="w-full px-3.5 py-3 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all resize-none" />
          </div>
        </div>
      </Card>
    );

  const sectionTambahan = (
    <Card icon={<MessageSquare size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait izin tidak mengikuti kuliah">
      <Label>Keterangan</Label>
      <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Masukkan keterangan tambahan jika diperlukan" rows={4}
        className="w-full px-3.5 py-3 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all resize-none" />
    </Card>
  );

  return (
    <MainLayout>
      {/* ── Page header ── */}
      <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">Pengajuan Surat / Izin Tidak Mengikuti Kuliah</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-primary-1 leading-tight">
          {isEdit ? "Ubah Surat Izin Tidak Mengikuti Kuliah" : "Pengajuan Surat Izin Tidak Mengikuti Kuliah"}
        </h1>
        <p className="lg:hidden text-[13px] text-neutral-2 mt-1">
          Silahkan lengkapi formulir di bawah ini untuk mengajukan izin tidak mengikuti kuliah
        </p>
      </div>

      <div className="hidden lg:block h-6" />

      <div className="mx-0 lg:mx-8 pb-10">

        {/* Desktop: white outer panel */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-8">
          <h2 className="text-xl font-bold text-primary-1 mb-1">Form Izin Tidak Mengikuti Kuliah</h2>
          <p className="text-sm text-neutral-2 mb-7">Silakan lengkapi formulir di bawah ini untuk mengajukan izin tidak mengikuti kuliah</p>
          <div className="flex flex-col gap-5">
            {sectionMahasiswa}
            {sectionMataKuliah}
            {sectionJadwal}
            {sectionAlasan}
            {sectionTambahan}
          </div>
          <div className="hidden lg:flex justify-end items-center gap-3 mt-7 pt-5 border-t border-slate-200">
            <button onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-colors">
              <ArrowLeft size={15} /> Kembali
            </button>
            <button onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm">
              <Send size={15} /> Kirim
            </button>
          </div>
        </div>

        {/* Mobile: cards stacked on page background */}
        <div className="lg:hidden flex flex-col gap-4 px-4 pt-4">
          {sectionMahasiswa}
          {sectionMataKuliah}
          {sectionJadwal}
          {sectionAlasan}
          {sectionTambahan}
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden flex flex-col gap-3 mt-6 px-4">
          <button onClick={() => navigate(-1)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-all">
            <ArrowLeft size={15} /> Kembali
          </button>
          <button onClick={() => navigate(-1)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-all shadow-md shadow-blue-200">
            <Send size={15} /> Kirim
          </button>
        </div>
      </div>
    </MainLayout>
  );
}