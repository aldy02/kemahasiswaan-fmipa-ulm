// src/pages/FormKeteranganMahasiswaKuliah.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Settings, User, Users, MessageSquare, AlertCircle } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { keteranganMahasiswaKuliahData } from "../../test/data";

const PRODI_OPTIONS = [
    "S1 Matematika", "S1 Statistika", "S1 Fisika", "S1 Kimia",
    "S1 Biologi", "S1 Ilmu Komputer", "S1 Farmasi",
];
const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const TAHUN_AJARAN_OPTIONS = ["2021/2022", "2022/2023", "2023/2024", "2024/2025", "2025/2026"];

// ── Primitives ────────────────────────────────────────────────────────────────
function Label({ children, required }) {
    return (
        <label className="block text-[13px] lg:text-sm font-medium text-primary-1 mb-1.5">
            {children}{required && <span className="text-error-1 ml-0.5">*</span>}
        </label>
    );
}

function TextInput({ placeholder, value, onChange, type = "text", disabled }) {
    return (
        <input type={type} value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder} disabled={disabled}
            className={`w-full px-3.5 py-2.5 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 transition-all
        ${disabled ? "cursor-not-allowed opacity-60" : "focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white"}`}
        />
    );
}

function SelectInput({ placeholder, value, onChange, options, disabled }) {
    return (
        <div className="relative">
            <select value={value} onChange={(e) => onChange && onChange(e.target.value)} disabled={disabled}
                className={`w-full px-3.5 py-2.5 text-[13px] lg:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none pr-10 transition-all
          ${disabled ? "cursor-not-allowed opacity-60" : "focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white"}
          ${value ? "text-primary-1" : "text-neutral-2"}`}>
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
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
function Card({ icon, title, subtitle, children, dimmed }) {
    return (
        <div className={`bg-white rounded-2xl p-5 lg:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.05)] lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:border lg:border-slate-200 transition-opacity ${dimmed ? "opacity-80" : ""}`}>
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

function InfoBanner() {
    return (
        <div className="flex items-start gap-2.5 mt-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] lg:text-[13px] text-amber-700 leading-snug">
                <span className="font-bold">Info:</span> Bagian ini akan diisi otomatis oleh operator sistem setelah permohonan disetujui.
            </p>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function toInputDate(str) {
    if (!str || str === "-") return "";
    // handle "dd-mm-yyyy"
    const p = str.split("-");
    if (p.length === 3) {
        // if year is 4 digits it's dd-mm-yyyy
        if (p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`;
        // already yyyy-mm-dd
        return str;
    }
    return "";
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FormKeteranganMahasiswaKuliah() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    // Operator (disabled)
    const [noSurat, setNoSurat] = useState("");
    const [namaDosen, setNamaDosen] = useState("");
    const [nip, setNip] = useState("");
    const [pangkat, setPangkat] = useState("");
    const [jabatan, setJabatan] = useState("");

    // Mahasiswa
    const [nim, setNim] = useState("");
    const [nama, setNama] = useState("");
    const [tempatLahir, setTempatLahir] = useState("");
    const [tanggalLahir, setTanggalLahir] = useState("");
    const [prodi, setProdi] = useState("");
    const [semester, setSemester] = useState("");
    const [tahunAjaran, setTahunAjaran] = useState("");

    // Orang Tua/Wali
    const [namaOrtu, setNamaOrtu] = useState("");
    const [nipOrtu, setNipOrtu] = useState("");
    const [instansiOrtu, setInstansiOrtu] = useState("");
    const [pangkatOrtu, setPangkatOrtu] = useState("");
    const [jabatanOrtu, setJabatanOrtu] = useState("");

    // Tambahan
    const [keterangan, setKeterangan] = useState("");

    useEffect(() => {
        if (!isEdit) return;
        const item = keteranganMahasiswaKuliahData.find((d) => d.id === Number(id));
        if (!item) return;
        setNoSurat(item.noSurat === "-" ? "" : item.noSurat || "");
        setNamaDosen(item.disetujuiOleh === "-" ? "" : item.disetujuiOleh || "");
        setNip(item.nip === "-" ? "" : item.nip || "");
        setPangkat(item.pangkat === "-" ? "" : item.pangkat || "");
        setJabatan(item.jabatan === "-" ? "" : item.jabatan || "");
        setNim(item.nim || "");
        setNama(item.nama || "");
        setTempatLahir(item.tempatLahir || "");
        setTanggalLahir(toInputDate(item.tanggalLahir));
        setProdi(item.prodi || "");
        setSemester(item.semester || "");
        setTahunAjaran(item.tahunAjaran || "");
        setNamaOrtu(item.namaOrtu || "");
        setNipOrtu(item.nipOrtu === "-" ? "" : item.nipOrtu || "");
        setInstansiOrtu(item.instansiOrtu || "");
        setPangkatOrtu(item.pangkatOrtu === "-" ? "" : item.pangkatOrtu || "");
        setJabatanOrtu(item.jabatanOrtu || "");
        setKeterangan(item.keterangan || "");
    }, [id, isEdit]);

    // ── Sections ─────────────────────────────────────────────────────────────
    const sectionOperator = (
        <Card icon={<Settings size={18} />} title="Informasi Operator" subtitle="Data administratif yang diisi oleh operator sistem" dimmed>
            {/* Desktop */}
            <div className="hidden lg:flex flex-col gap-4">
                <div><Label>No Surat</Label><TextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} disabled /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Nama Dosen</Label><TextInput placeholder="Masukkan nama dosen" value={namaDosen} onChange={setNamaDosen} disabled /></div>
                    <div><Label>NIP</Label><TextInput placeholder="Masukkan NIP dosen" value={nip} onChange={setNip} disabled /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Pangkat/Golongan</Label><TextInput placeholder="Masukkan pangkat/golongan" value={pangkat} onChange={setPangkat} disabled /></div>
                    <div><Label>Jabatan</Label><TextInput placeholder="Masukkan jabatan" value={jabatan} onChange={setJabatan} disabled /></div>
                </div>
            </div>
            {/* Mobile */}
            <div className="lg:hidden flex flex-col gap-3">
                <div><Label>No Surat</Label><TextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} disabled /></div>
                <div><Label>Nama Dosen</Label><TextInput placeholder="Masukkan nama dosen" value={namaDosen} onChange={setNamaDosen} disabled /></div>
                <div><Label>NIP</Label><TextInput placeholder="Masukkan NIP Dosen" value={nip} onChange={setNip} disabled /></div>
                <div><Label>Pangkat/Golongan</Label><TextInput placeholder="Masukkan pangkat/golongan" value={pangkat} onChange={setPangkat} disabled /></div>
                <div><Label>Jabatan</Label><TextInput placeholder="Masukkan jabatan" value={jabatan} onChange={setJabatan} disabled /></div>
            </div>
            <InfoBanner />
        </Card>
    );

    const sectionMahasiswa = (
        <Card icon={<User size={18} />} title="Informasi Mahasiswa" subtitle="Informasi lengkap mahasiswa yang mengajukan surat keterangan mahasiswa kuliah">
            {/* Desktop: 2 columns, Tahun Ajaran spans full */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-4">
                <div><Label required>NIM</Label><TextInput placeholder="Masukkan NIM" value={nim} onChange={setNim} /></div>
                <div><Label required>Nama Mahasiswa</Label><TextInput placeholder="Masukkan nama lengkap" value={nama} onChange={setNama} /></div>
                <div><Label required>Tempat Lahir</Label><TextInput placeholder="Masukkan tempat lahir" value={tempatLahir} onChange={setTempatLahir} /></div>
                <div><Label required>Tanggal Lahir</Label><DateInput value={tanggalLahir} onChange={setTanggalLahir} /></div>
                <div><Label required>Program Studi</Label><SelectInput placeholder="Pilih program studi" value={prodi} onChange={setProdi} options={PRODI_OPTIONS} /></div>
                <div><Label required>Semester</Label><SelectInput placeholder="Pilih semester" value={semester} onChange={setSemester} options={SEMESTER_OPTIONS} /></div>
                <div className="lg:col-span-2">
                    <Label required>Tahun Ajaran</Label>
                    <SelectInput placeholder="Pilih tahun ajaran" value={tahunAjaran} onChange={setTahunAjaran} options={TAHUN_AJARAN_OPTIONS} />
                </div>
            </div>
            {/* Mobile: stacked */}
            <div className="lg:hidden flex flex-col gap-3">
                <div><Label required>NIM</Label><TextInput placeholder="Masukkan NIM" value={nim} onChange={setNim} /></div>
                <div><Label required>Nama Mahasiswa</Label><TextInput placeholder="Masukkan nama lengkap" value={nama} onChange={setNama} /></div>
                <div><Label required>Tempat Lahir</Label><TextInput placeholder="Masukkan tempat lahir" value={tempatLahir} onChange={setTempatLahir} /></div>
                <div><Label required>Tanggal Lahir</Label><DateInput value={tanggalLahir} onChange={setTanggalLahir} /></div>
                <div><Label required>Program Studi</Label><SelectInput placeholder="Pilih program studi" value={prodi} onChange={setProdi} options={PRODI_OPTIONS} /></div>
                <div><Label required>Semester</Label><SelectInput placeholder="Pilih semester" value={semester} onChange={setSemester} options={SEMESTER_OPTIONS} /></div>
                <div><Label required>Tahun Ajaran</Label><SelectInput placeholder="Pilih tahun ajaran" value={tahunAjaran} onChange={setTahunAjaran} options={TAHUN_AJARAN_OPTIONS} /></div>
            </div>
        </Card>
    );

    const sectionOrtu = (
        <Card icon={<Users size={18} />} title="Informasi Orang Tua/Wali" subtitle="Informasi lengkap orang tua/wali mahasiswa">
            {/* Desktop: 2 columns, Jabatan spans full */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-4">
                <div><Label required>Nama Orang Tua/Wali</Label><TextInput placeholder="Masukkan nama orang tua/wali" value={namaOrtu} onChange={setNamaOrtu} /></div>
                <div><Label>NIP Orang Tua/Wali</Label><TextInput placeholder="Masukkan NIP orang tua/wali" value={nipOrtu} onChange={setNipOrtu} /></div>
                <div><Label required>Instansi</Label><TextInput placeholder="Masukkan nama instansi tempat bekerja" value={instansiOrtu} onChange={setInstansiOrtu} /></div>
                <div><Label>Pangkat/Golongan</Label><TextInput placeholder="Masukkan pangkat/golongan" value={pangkatOrtu} onChange={setPangkatOrtu} /></div>
                <div className="lg:col-span-2">
                    <Label required>Jabatan</Label>
                    <TextInput placeholder="Masukkan jabatan orang tua/wali" value={jabatanOrtu} onChange={setJabatanOrtu} />
                </div>
            </div>
            {/* Mobile: stacked */}
            <div className="lg:hidden flex flex-col gap-3">
                <div><Label required>Nama Orang Tua/Wali</Label><TextInput placeholder="Masukkan nama orang tua/wali" value={namaOrtu} onChange={setNamaOrtu} /></div>
                <div><Label>NIP Orang Tua/Wali</Label><TextInput placeholder="Masukkan NIP orang tua/wali" value={nipOrtu} onChange={setNipOrtu} /></div>
                <div><Label required>Instansi</Label><TextInput placeholder="Masukkan nama instansi tempat bekerja" value={instansiOrtu} onChange={setInstansiOrtu} /></div>
                <div><Label>Pangkat/Golongan</Label><TextInput placeholder="Masukkan pangkat/golongan" value={pangkatOrtu} onChange={setPangkatOrtu} /></div>
                <div><Label required>Jabatan</Label><TextInput placeholder="Masukkan jabatan orang tua/wali" value={jabatanOrtu} onChange={setJabatanOrtu} /></div>
            </div>
        </Card>
    );

    const sectionTambahan = (
        <Card icon={<MessageSquare size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait surat keterangan mahasiswa kuliah">
            <Label>Keterangan</Label>
            <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Masukkan keterangan tambahan jika diperlukan" rows={4}
                className="w-full px-3.5 py-3 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all resize-none" />
        </Card>
    );

    return (
        <MainLayout>
            {/* ── Page header ── */}
            <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
                <p className="hidden lg:block text-sm text-neutral-1 mb-1">Pengajuan Surat / Keterangan Mahasiswa Kuliah</p>
                <h1 className="text-2xl lg:text-3xl font-bold text-primary-1 leading-tight">
                    {isEdit ? "Ubah Surat Keterangan Mahasiswa Kuliah" : "Pengajuan Surat Keterangan Mahasiswa Kuliah"}
                </h1>
                <p className="lg:hidden text-[13px] text-neutral-2 mt-1">
                    Silakan lengkapi formulir di bawah ini untuk mengajukan surat keterangan mahasiswa kuliah
                </p>
            </div>

            <div className="hidden lg:block h-6" />

            <div className="mx-0 lg:mx-8 pb-10">

                {/* Desktop: white outer panel */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-8">
                    <h2 className="text-xl font-bold text-primary-1 mb-1">Form Surat Keterangan Mahasiswa Kuliah</h2>
                    <p className="text-sm text-neutral-2 mb-7">Silakan lengkapi formulir di bawah ini untuk mengajukan surat keterangan mahasiswa kuliah</p>
                    <div className="flex flex-col gap-5">
                        {sectionOperator}
                        {sectionMahasiswa}
                        {sectionOrtu}
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

                {/* Mobile: cards stacked */}
                <div className="lg:hidden flex flex-col gap-4 px-4 pt-4">
                    {sectionOperator}
                    {sectionMahasiswa}
                    {sectionOrtu}
                    {sectionTambahan}
                </div>

                {/* Mobile footer — Kirim only */}
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