// src/components/form/FormComponents.jsx
// Shared form primitives dan layout components
// Digunakan oleh: FormPeminjamanRuangan, FormPeminjamanAlatBahan,
//                 FormIzinTidakMengikutiKuliah, FormIzinPraktikumUlang,
//                 FormRekomendasi, FormKeteranganMahasiswaKuliah, dst.

import React from "react";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Label ─────────────────────────────────────────────────────────────────────
export function FormLabel({ children, required }) {
  return (
    <label className="block text-[13px] lg:text-sm font-medium text-primary-1 mb-1.5">
      {children}
      {required && <span className="text-error-1 ml-0.5">*</span>}
    </label>
  );
}

// ── Text Input ────────────────────────────────────────────────────────────────
export function FormTextInput({ placeholder, value, onChange, type = "text", disabled }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3.5 py-2.5 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 transition-all
        ${disabled
          ? "cursor-not-allowed opacity-60"
          : "focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white"
        }`}
    />
  );
}

// ── Number Input ──────────────────────────────────────────────────────────────
export function FormNumberInput({ placeholder, value, onChange }) {
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

// ── Select Input ──────────────────────────────────────────────────────────────
export function FormSelectInput({ placeholder, value, onChange, options, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 text-[13px] lg:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none pr-10 transition-all
          ${disabled
            ? "cursor-not-allowed opacity-60"
            : "focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white"
          }
          ${value ? "text-primary-1" : "text-neutral-2"}`}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-primary-1">{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

// ── Date Input (dd/mm/yy text format) ─────────────────────────────────────────
export function FormDateInput({ value, onChange, disabled }) {
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
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </span>
      <input
        type="text"
        inputMode="numeric"
        maxLength={8}
        placeholder="dd/mm/yy"
        value={display}
        disabled={disabled}
        onChange={(e) => {
          if (disabled) return;
          const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
          let fmt = digits;
          if (digits.length > 2) fmt = digits.slice(0, 2) + "/" + digits.slice(2);
          if (digits.length > 4) fmt = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4, 6);
          setDisplay(fmt);
          if (digits.length === 6) {
            const d = digits.slice(0, 2), m = digits.slice(2, 4), y = "20" + digits.slice(4, 6);
            onChange(`${y}-${m}-${d}`);
          } else if (digits.length === 0) {
            onChange("");
          }
        }}
        className={`w-full pl-10 pr-4 py-2.5 text-[13px] lg:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all
          ${disabled
            ? "cursor-not-allowed opacity-60"
            : "focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white"
          }
          ${display ? "text-primary-1" : "text-neutral-2"}`}
      />
    </div>
  );
}

// ── Time Input ────────────────────────────────────────────────────────────────
export function FormTimeInput({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-2 pointer-events-none">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 text-[13px] lg:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all ${value ? "text-primary-1" : "text-neutral-2"}`}
      />
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function FormTextarea({ placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-3 text-[13px] lg:text-sm text-primary-1 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder-neutral-2 focus:ring-2 focus:ring-primary-2 focus:border-transparent focus:bg-white transition-all resize-none"
    />
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
export function FormCard({ icon, title, subtitle, children, dimmed = false }) {
  return (
    <div className={`bg-white rounded-2xl p-5 lg:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.05)] lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:border lg:border-slate-200 transition-opacity ${dimmed ? "opacity-80" : ""}`}>
      <div className="flex items-start gap-3 mb-5 lg:mb-6">
        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-primary-2/10 flex items-center justify-center text-primary-2 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-[15px] lg:text-base font-bold text-primary-1 leading-snug">{title}</h3>
          {subtitle && (
            <p className="text-[11px] lg:text-xs text-neutral-2 mt-0.5 leading-snug">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Operator Info Banner ──────────────────────────────────────────────────────
export function FormInfoBanner({ text = "Bagian ini akan diisi otomatis oleh operator sistem setelah permohonan disetujui." }) {
  return (
    <div className="flex items-start gap-2.5 mt-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
      <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
      <p className="text-[12px] lg:text-[13px] text-amber-700 leading-snug">
        <span className="font-bold">Info:</span> {text}
      </p>
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────────────────
// breadcrumb + title + mobile subtitle
export function FormPageHeader({ breadcrumb, title, subtitle }) {
  return (
    <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
      {breadcrumb && (
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">{breadcrumb}</p>
      )}
      <h1 className="text-2xl lg:text-3xl font-bold text-primary-1 leading-tight">{title}</h1>
      {subtitle && (
        <p className="lg:hidden text-[13px] text-neutral-2 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// ── Desktop Panel ─────────────────────────────────────────────────────────────
// White outer panel that wraps all cards on desktop
export function FormDesktopPanel({ title, subtitle, children, footer }) {
  return (
    <div className="hidden lg:block bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-8">
      <h2 className="text-xl font-bold text-primary-1 mb-1">{title}</h2>
      <p className="text-sm text-neutral-2 mb-7">{subtitle}</p>
      <div className="flex flex-col gap-5">
        {children}
      </div>
      {footer}
    </div>
  );
}

// ── Mobile Cards Container ────────────────────────────────────────────────────
export function FormMobileCards({ children }) {
  return (
    <div className="lg:hidden flex flex-col gap-4 px-4 pt-4">
      {children}
    </div>
  );
}

// ── Desktop Footer (inside panel) ─────────────────────────────────────────────
export function FormDesktopFooter({ onBack, onSubmit }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  const handleSubmit = onSubmit || (() => navigate(-1));

  return (
    <div className="hidden lg:flex justify-end items-center gap-3 mt-7 pt-5 border-t border-slate-200">
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft size={15} /> Kembali
      </button>
      <button
        onClick={handleSubmit}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm"
      >
        <Send size={15} /> Kirim
      </button>
    </div>
  );
}

// ── Mobile Footer (Kembali + Kirim stacked) ───────────────────────────────────
export function FormMobileFooter({ onBack, onSubmit, showBack = true }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  const handleSubmit = onSubmit || (() => navigate(-1));

  return (
    <div className="lg:hidden flex flex-col gap-3 mt-6 px-4">
      {showBack && (
        <button
          onClick={handleBack}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={15} /> Kembali
        </button>
      )}
      <button
        onClick={handleSubmit}
        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-all shadow-md shadow-blue-200"
      >
        <Send size={15} /> Kirim
      </button>
    </div>
  );
}

// ── Helper: "dd-mm-yyyy" → "yyyy-mm-dd" ──────────────────────────────────────
export function toFormDate(str) {
  if (!str || str === "-") return "";
  const p = str.split("-");
  if (p.length === 3) {
    if (p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`; // dd-mm-yyyy
    return str; // already yyyy-mm-dd
  }
  return "";
}

// ── Helper: "HH:MM WITA" → "HH:MM" ──────────────────────────────────────────
export function toFormTime(str) {
  return str ? str.replace(" WITA", "").trim() : "";
}


// ── Operator Section (reusable across Rekomendasi, Keterangan, KeteranganMahasiswaKuliah) ──
export function FormOperatorSection({
  noSurat, setNoSurat, namaDosen, setNamaDosen,
  nip, setNip, pangkat, setPangkat, jabatan, setJabatan,
}) {
  return (
    <>
      {/* Desktop layout */}
      <div className="hidden lg:flex flex-col gap-4">
        <div>
          <FormLabel>No Surat</FormLabel>
          <FormTextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} disabled />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FormLabel>Nama Dosen</FormLabel><FormTextInput placeholder="Masukkan nama dosen" value={namaDosen} onChange={setNamaDosen} disabled /></div>
          <div><FormLabel>NIP</FormLabel><FormTextInput placeholder="Masukkan NIP dosen" value={nip} onChange={setNip} disabled /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FormLabel>Pangkat/Golongan</FormLabel><FormTextInput placeholder="Masukkan pangkat/golongan" value={pangkat} onChange={setPangkat} disabled /></div>
          <div><FormLabel>Jabatan</FormLabel><FormTextInput placeholder="Masukkan jabatan" value={jabatan} onChange={setJabatan} disabled /></div>
        </div>
      </div>
      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col gap-3">
        <div><FormLabel>No Surat</FormLabel><FormTextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} disabled /></div>
        <div><FormLabel>Nama Dosen</FormLabel><FormTextInput placeholder="Masukkan nama dosen" value={namaDosen} onChange={setNamaDosen} disabled /></div>
        <div><FormLabel>NIP</FormLabel><FormTextInput placeholder="Masukkan NIP Dosen" value={nip} onChange={setNip} disabled /></div>
        <div><FormLabel>Pangkat/Golongan</FormLabel><FormTextInput placeholder="Masukkan pangkat/golongan" value={pangkat} onChange={setPangkat} disabled /></div>
        <div><FormLabel>Jabatan</FormLabel><FormTextInput placeholder="Masukkan jabatan" value={jabatan} onChange={setJabatan} disabled /></div>
      </div>
      <FormInfoBanner />
    </>
  );
}

// ── People Icon (group) ───────────────────────────────────────────────────────
export const PeopleGroupIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
);