// src/components/DataSuratDetailComponents.jsx
import { useNavigate } from "react-router-dom";
import { Check, X, ArrowLeft, SquarePen } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

// ─────────────────────────────────────────────
// DetailStatusBadge
// ─────────────────────────────────────────────
const detailStatusConfig = {
  Diterima: { pillBg: "bg-succes-1",  iconColor: "text-succes-1",  icon: <Check size={14} strokeWidth={3} /> },
  Ditolak:  { pillBg: "bg-error-2",   iconColor: "text-error-2",   icon: <X size={14} strokeWidth={3} /> },
  Revisi:   { pillBg: "bg-warning-1", iconColor: "text-warning-1", icon: <span className="font-black text-[13px] leading-none">!</span> },
};

export function DetailStatusBadge({ status }) {
  const cfg = detailStatusConfig[status] ?? { pillBg: "bg-slate-400", iconColor: "text-slate-600", icon: null };
  return (
    <span className={`inline-flex items-center gap-2.5 ${cfg.pillBg} text-white font-bold text-sm px-4 py-2.5 lg:rounded-xl rounded-full whitespace-nowrap`}>
      <span className={`flex items-center justify-center w-4 h-4 rounded-full bg-white ${cfg.iconColor} shrink-0`}>
        {cfg.icon}
      </span>
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────
// SectionCard
// ─────────────────────────────────────────────
export function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary-2/10 flex items-center justify-center text-primary-2 shrink-0">
          {icon}
        </div>
        <h3 className="text-base font-bold text-primary-1">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Field — single label + value row
// ─────────────────────────────────────────────
export function Field({ label, value }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs text-neutral-2 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-primary-1">{value || "-"}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// FieldWithSub — label + main value + sub value
// ─────────────────────────────────────────────
export function FieldWithSub({ label, main, sub }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs text-neutral-2 mb-0.5">{label}</p>
      <p className="text-sm mt-1 font-medium text-primary-1">{main || "-"}</p>
      {sub && <p className="text-sm font-medium text-primary-1 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// MahasiswaItem — for multi/single mahasiswa list
// ─────────────────────────────────────────────
export function MahasiswaItem({ index, mhs, showIndex }) {
  return (
    <div className="mb-4 last:mb-0">
      {showIndex && <p className="text-xs text-neutral-2 mb-1">Mahasiswa {index + 1}</p>}
      <p className="text-sm font-medium text-primary-1">{mhs.nama || "-"}</p>
      <p className="text-xs font-medium text-primary-1 mt-0.5">
        {[mhs.nim, mhs.prodi, mhs.mataKuliah].filter(Boolean).join(" · ")}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// DetailPageLayout — main wrapper for all detail pages
//
// Props:
//  - breadcrumb: string
//  - pageTitle: string
//  - detailTitle: string
//  - noSurat: string
//  - status: string
//  - editPath: string  — navigate target for Ubah button
//  - leftCards: ReactNode[]  — cards for left column (desktop)
//  - rightCards: ReactNode[] — cards for right column (desktop)
//  - mobileCards: ReactNode[] — cards stacked on mobile (ordered as desired)
// ─────────────────────────────────────────────
export function DetailPageLayout({
  breadcrumb,
  pageTitle,
  detailTitle,
  noSurat,
  status,
  editPath,
  leftCards = [],
  rightCards = [],
  mobileCards = [],
}) {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="px-4 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">{breadcrumb}</p>
        <h1 className="hidden lg:block text-2xl lg:text-3xl font-bold text-primary-1 mb-1">{pageTitle}</h1>
      </div>

      <div className="hidden lg:block h-6" />

      <div className="mx-0 lg:mx-8 bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-0 lg:p-7 pb-8">

        {/* Panel Header — Desktop */}
        <div className="hidden lg:flex items-start justify-between gap-4 mb-1">
          <div>
            <h2 className="text-xl font-bold text-primary-1">{detailTitle}</h2>
            <p className="text-sm text-neutral-2 mt-0.5">No. Surat: {noSurat || "-"}</p>
          </div>
          <DetailStatusBadge status={status} />
        </div>

        {/* Panel Header — Mobile */}
        <div className="lg:hidden px-4 pt-4 mb-1">
          <h2 className="text-xl font-bold text-primary-1">{detailTitle}</h2>
          <p className="text-sm text-neutral-2 mt-0.5">No. Surat: {noSurat || "-"}</p>
          <div className="mt-3">
            <DetailStatusBadge status={status} />
          </div>
        </div>

        <hr className="border-slate-200 my-5 mx-4 lg:mx-0" />

        {/* Desktop: 2-column grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">{leftCards}</div>
          <div className="flex flex-col gap-4">{rightCards}</div>
        </div>

        {/* Mobile: single column */}
        <div className="lg:hidden flex flex-col gap-4 px-4">
          {mobileCards}
        </div>

        {/* Footer Buttons */}
        <DetailFooter editPath={editPath} />
      </div>
    </MainLayout>
  );
}

// ─────────────────────────────────────────────
// DetailFooter — Kembali + Ubah buttons
// ─────────────────────────────────────────────
export function DetailFooter({ editPath }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end items-center gap-3 mt-6 px-4 lg:px-0">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary-1 font-semibold text-sm hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft size={15} /> Kembali
      </button>
      <button
        onClick={() => navigate(editPath)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-2 hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
      >
        <SquarePen size={15} /> Ubah
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// NotFound — shown when item is not found
// ─────────────────────────────────────────────
export function NotFound() {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-primary-1 font-semibold text-lg">Data tidak ditemukan</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-primary-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={15} /> Kembali
        </button>
      </div>
    </MainLayout>
  );
}