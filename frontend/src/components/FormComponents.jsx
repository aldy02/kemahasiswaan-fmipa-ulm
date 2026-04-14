import React from "react";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Label
export function FormLabel({ children, required, error }) {
  return (
    <label className={`block text-[13px] lg:text-sm font-medium mb-1.5 ${error ? "text-red-700" : "text-primary-1"}`}>
      {children}
      {required && <span className="text-error-1 ml-0.5">*</span>}
    </label>
  );
}

// Field error
export function FormFieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-[12px] text-red-700">
      <AlertCircle size={13} className="shrink-0" />
      {message}
    </p>
  );
}

// Base class
const baseInput   = "w-full px-4 py-3 border rounded-lg text-sm text-primary-1 placeholder-neutral-1 focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white";
const normalBorder = `${baseInput} border-gray-200 focus:ring-primary-2`;
const errorBorder  = `${baseInput} border-red-700 focus:ring-red-700 placeholder-red-700`;

// Text input
export function FormTextInput({ placeholder, value, onChange, type = "text", disabled, error }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseInput} ${
        disabled
          ? "cursor-not-allowed opacity-60 border-gray-200"
          : error
          ? errorBorder
          : normalBorder
      }`}
    />
  );
}

// Input number
export function FormNumberInput({ placeholder, value, onChange, error }) {
  return (
    <input
      type="number"
      min="1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={error ? errorBorder : normalBorder}
    />
  );
}

// Select input
export function FormSelectInput({ placeholder, value, onChange, options, disabled, error }) {
  const isEmpty = !value;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        className={`${baseInput} appearance-none pr-10
          ${disabled
            ? "cursor-not-allowed opacity-60 border-gray-200"
            : error
            ? "border-red-700 focus:ring-red-700"
            : "border-gray-200 focus:ring-primary-2"
          }
          ${isEmpty
            ? error ? "text-red-700" : "text-neutral-2"
            : "text-primary-1"
          }
        `}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-primary-1">{o}</option>
        ))}
      </select>
      {/* Merah jika error dan kosong */}
      <span className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 ${isEmpty && error ? "text-red-700" : "text-neutral-2"}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

// Input tanggal
export function FormDateInput({ value, onChange, disabled, error }) {
  const isEmpty = !value;
  return (
    <div className="relative">
      {/* Calendar icon */}
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isEmpty && error ? "text-red-700" : "text-neutral-2"}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8"  y1="2" x2="8"  y2="6" />
          <line x1="3"  y1="10" x2="21" y2="10" />
        </svg>
      </span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        className={`${baseInput} pl-10 pr-4
          ${disabled
            ? "cursor-not-allowed opacity-60 border-gray-200"
            : error
            ? "border-red-700 focus:ring-red-700"
            : "border-gray-200 focus:ring-primary-2"
          }
          ${isEmpty
            ? error ? "text-red-700 [&::-webkit-datetime-edit]:text-red-700 [&::-webkit-datetime-edit-fields-wrapper]:text-red-700" : "text-neutral-2"
            : "text-primary-1"
          }
        `}
      />
    </div>
  );
}

// Time input
export function FormTimeInput({ value, onChange, error }) {
  const isEmpty = !value;
  return (
    <div className="relative">
      {/* Merah jika error dan kosong */}
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isEmpty && error ? "text-red-700" : "text-neutral-2"}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseInput} pl-10 pr-4
          ${error
            ? "border-red-700 focus:ring-red-700"
            : "border-gray-200 focus:ring-primary-2"
          }
          ${isEmpty
            ? error ? "text-red-700 [&::-webkit-datetime-edit]:text-red-700 [&::-webkit-datetime-edit-fields-wrapper]:text-red-700" : "text-neutral-2"
            : "text-primary-1"
          }
        `}
      />
    </div>
  );
}

// Textarea
export function FormTextarea({ placeholder, value, onChange, rows = 4, error }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${baseInput} resize-none ${error ? errorBorder : normalBorder}`}
    />
  );
}

// Section card
export function FormCard({ icon, title, subtitle, children, dimmed = false }) {
  return (
    <div className={`bg-white rounded-2xl p-5 lg:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.05)] lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:border lg:border-slate-200 transition-opacity ${dimmed ? "opacity-80" : ""}`}>
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

// Operator Info Banner
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

// Header Halaman
export function FormPageHeader({ breadcrumb, title, subtitle }) {
  return (
    <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
      {breadcrumb && <p className="hidden lg:block text-sm text-neutral-1 mb-1">{breadcrumb}</p>}
      <h1 className="text-2xl lg:text-3xl font-bold text-primary-1 leading-tight">{title}</h1>
      {subtitle && <p className="lg:hidden text-[13px] text-neutral-2 mt-1">{subtitle}</p>}
    </div>
  );
}

// Desktop Panel
export function FormDesktopPanel({ title, subtitle, children, footer }) {
  return (
    <div className="hidden lg:block bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-8">
      <h2 className="text-xl font-bold text-primary-1 mb-1">{title}</h2>
      <p className="text-sm text-neutral-2 mb-7">{subtitle}</p>
      <div className="flex flex-col gap-5">{children}</div>
      {footer}
    </div>
  );
}

// Mobile Cards Container
export function FormMobileCards({ children }) {
  return <div className="lg:hidden flex flex-col gap-4 px-4 pt-4">{children}</div>;
}

// Desktop Footer
export function FormDesktopFooter({ onBack, onSubmit, loading }) {
  const navigate    = useNavigate();
  const handleBack  = onBack   || (() => navigate(-1));
  const handleSubmit = onSubmit || (() => {});

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
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Memproses...
          </>
        ) : (
          <><Send size={15} /> Kirim</>
        )}
      </button>
    </div>
  );
}

// Mobile Footer
export function FormMobileFooter({ onBack, onSubmit, showBack = true, loading }) {
  const navigate    = useNavigate();
  const handleBack  = onBack   || (() => navigate(-1));
  const handleSubmit = onSubmit || (() => {});

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
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary-2 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold text-sm transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Memproses...
          </>
        ) : (
          <><Send size={15} /> Kirim</>
        )}
      </button>
    </div>
  );
}

// Helpers
export function toFormDate(str) {
  if (!str || str === "-") return "";
  const p = str.split("-");
  if (p.length === 3) {
    if (p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`; // dd-mm-yyyy → yyyy-mm-dd
    return str;
  }
  return "";
}

export function toFormTime(str) {
  return str ? str.replace(" WITA", "").trim() : "";
}

// Operator section
export function FormOperatorSection({
  noSurat, setNoSurat, namaDosen, setNamaDosen,
  nip, setNip, pangkat, setPangkat, jabatan, setJabatan,
}) {
  return (
    <>
      <div className="hidden lg:flex flex-col gap-4">
        <div><FormLabel>No Surat</FormLabel><FormTextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} disabled /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><FormLabel>Nama Dosen</FormLabel><FormTextInput placeholder="Masukkan nama dosen" value={namaDosen} onChange={setNamaDosen} disabled /></div>
          <div><FormLabel>NIP</FormLabel><FormTextInput placeholder="Masukkan NIP dosen" value={nip} onChange={setNip} disabled /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FormLabel>Pangkat/Golongan</FormLabel><FormTextInput placeholder="Masukkan pangkat/golongan" value={pangkat} onChange={setPangkat} disabled /></div>
          <div><FormLabel>Jabatan</FormLabel><FormTextInput placeholder="Masukkan jabatan" value={jabatan} onChange={setJabatan} disabled /></div>
        </div>
      </div>
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

// FormField
export function FormField({ label, required, error, children }) {
  return (
    <div>
      <FormLabel required={required} error={error}>{label}</FormLabel>
      {children}
      <FormFieldError message={error} />
    </div>
  );
}

// FormGrid
export function FormGrid({ cols = 2, children }) {
  const colClass = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" }[cols] || "lg:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-4`}>{children}</div>
  );
}

// Kepemimpinan Section
export function KepemimpinanSection({ groups }) {
  return (
    <>
      {/* Desktop: 3 columns */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {groups.map(({ label, fields }) => (
          <div key={label}>
            <p className="text-sm font-semibold text-primary-1 mb-3 pb-2 border-b border-slate-200">{label}</p>
            <div className="flex flex-col gap-3">
              {fields.map(({ label: fl, placeholder, value, onChange, error, type }) => (
                <FormField key={fl} label={fl} required error={error}>
                  <FormTextInput placeholder={placeholder} value={value} onChange={onChange} type={type} error={error} />
                </FormField>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Mobile: stacked */}
      <div className="lg:hidden flex flex-col gap-0">
        {groups.map(({ label, fields }, gi, arr) => (
          <div key={label}>
            <p className="text-[13px] font-semibold text-primary-1 mb-2">{label}</p>
            <hr className="border-slate-200 mb-3" />
            <div className={`flex flex-col gap-3 ${gi < arr.length - 1 ? "mb-5" : ""}`}>
              {fields.map(({ label: fl, placeholder, value, onChange, error, type }) => (
                <FormField key={fl} label={fl} required error={error}>
                  <FormTextInput placeholder={placeholder} value={value} onChange={onChange} type={type} error={error} />
                </FormField>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// People Group Icon
export const PeopleGroupIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
);

export function toApiDate(str) {
  if (!str) return "";
  return str.split("-").reverse().join("-");
}