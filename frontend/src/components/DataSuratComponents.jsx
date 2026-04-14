import { useState } from "react";
import { createPortal } from "react-dom";
import { Search, Plus, Check, X, FileSearchCorner, SquarePen, Trash2, AlertCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

const ITEMS_PER_PAGE = 10;

// StatusBadge
const statusConfig = {
  Diterima: {
    iconBg: "bg-succes-1",  pillBg: "bg-succes-1",  iconColor: "text-succes-1",
    icon: <Check size={14} strokeWidth={3} />,
    textColor: "text-primary-1",
  },
  Ditolak: {
    iconBg: "bg-error-2",   pillBg: "bg-error-2",   iconColor: "text-error-2",
    icon: <X size={14} strokeWidth={3} />,
    textColor: "text-primary-1",
  },
  Revisi: {
    iconBg: "bg-warning-1", pillBg: "bg-warning-1", iconColor: "text-warning-1",
    icon: <span className="font-black text-[13px] leading-none">!</span>,
    textColor: "text-primary-1",
  },
  Menunggu: {
    iconBg: "bg-warning-1", pillBg: "bg-warning-1", iconColor: "text-warning-1",
    icon: <span className="font-black text-[13px] leading-none">!</span>,
    textColor: "text-primary-1",
  },
};

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] ?? {
    iconBg: "bg-slate-400", pillBg: "bg-slate-300",
    icon: null, textColor: "text-primary-1", iconColor: "text-slate-400",
  };
  return (
    <>
      {/* Desktop */}
      <span className="hidden md:inline-flex items-center gap-2.5">
        <span className={`flex items-center justify-center w-5 h-5 rounded-full ${cfg.iconBg} text-white shrink-0`}>
          {cfg.icon}
        </span>
        <span className={`text-[15px] font-bold ${cfg.textColor}`}>{status}</span>
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

// Delete Confirmation Modal
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Data!",
  description = "Apakah Anda yakin ingin menghapus data tabel ini? Tindakan ini tidak dapat dibatalkan!",
}) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-1 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
          <Trash2 size={26} className="text-error-3" />
        </div>
        <h3 className="text-lg font-bold text-primary-1 mb-1">{title}</h3>
        <p className="text-sm text-neutral-1 leading-relaxed mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-primary-1 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-error-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Pagination
export function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1.5 text-[13px] rounded-lg text-neutral-2 hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`min-w-9 py-1.5 text-[13px] bg-neutral-3 rounded-lg font-medium transition-colors ${
            p === current ? "bg-primary-2 text-white" : "text-primary-1 hover:bg-slate-300/80"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="px-3 py-1.5 text-[13px] rounded-lg text-neutral-2 hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

// DataTable (desktop)
export function DataTable({ columns, data, onView, onEdit, onDelete }) {
  const hasActions = onView || onEdit || onDelete;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-neutral-2 border-b border-slate-200 whitespace-nowrap">
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-2 border-b border-slate-200 whitespace-nowrap">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-100">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3.5 text-sm font-semibold text-primary-1 border-b border-slate-50">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-3.5 border-b border-slate-50">
                  <div className="flex items-center gap-1.5">
                    {onView   && <button onClick={() => onView(item)}   title="Lihat" className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-1 hover:text-black transition-colors"><FileSearchCorner size={20} /></button>}
                    {onEdit   && <button onClick={() => onEdit(item)}   title="Ubah"  className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-2 hover:text-blue-700 transition-colors"><SquarePen size={20} /></button>}
                    {onDelete && <button onClick={() => onDelete(item)} title="Hapus" className="w-8 h-8 flex items-center justify-center rounded-lg text-error-1 hover:text-red-900 transition-colors"><Trash2 size={20} /></button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// MobileCard
export function MobileCard({ title, subtitle, status, fields = [], onClick, onEdit, onDelete }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-3 ${onClick ? "cursor-pointer active:scale-[0.99]" : ""} transition-transform`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-[15px] text-primary-1">{title}</p>
          {subtitle && <p className="text-[13px] text-neutral-1 mt-0.5">{subtitle}</p>}
        </div>
        {status && <StatusBadge status={status} />}
      </div>
      {fields.length > 0 && (
        <>
          <hr className="border-slate-100 my-3" />
          {fields.map(([label, value]) => (
            <div key={label} className="flex justify-between text-[13px] mb-1.5 last:mb-0">
              <span className="text-neutral-1">{label}</span>
              <span className="text-primary-1 font-semibold">{value}</span>
            </div>
          ))}
        </>
      )}
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 mt-4">
          {onEdit  && <button onClick={(e) => { e.stopPropagation(); onEdit();   }} className="inline-flex items-center gap-1.5 border border-primary-2 text-primary-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium hover:bg-primary-2/5 transition-colors"><SquarePen size={13} /> Ubah</button>}
          {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="inline-flex items-center gap-1.5 border border-error-1 text-error-1 rounded-full px-3.5 py-1.5 text-[13px] font-medium hover:bg-error-1/5 transition-colors"><Trash2 size={13} /> Hapus</button>}
        </div>
      )}
    </div>
  );
}

// SuratPageLayout
export function SuratPageLayout({
  breadcrumb,
  pageTitle,
  pageSubtitle,
  cardTitle,
  searchPlaceholder = "Cari...",
  data = [],
  loading = false,
  error = "",
  filterFn,
  columns = [],
  getMobileCardProps,
  onView,
  onEdit,
  onDelete,
  onTambah,
}) {
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(1);
  const [deleteTarget,  setDeleteTarget]  = useState(null);

  const filtered   = filterFn ? data.filter((d) => filterFn(d, search)) : data;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch        = (val) => { setSearch(val); setPage(1); };
  const handleDeleteRequest = (item) => setDeleteTarget(item);
  const handleDeleteConfirm = async () => {
    if (onDelete && deleteTarget) {
      await onDelete(deleteTarget);
    }
    setDeleteTarget(null);
  };

  return (
    <MainLayout>
      <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">{breadcrumb}</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-primary-1 mb-1">{pageTitle}</h1>
        <p className="lg:hidden text-[13px] text-neutral-1 mt-0.5">{pageSubtitle}</p>
      </div>

      <div className="hidden lg:block h-6" />

      <div className="mx-0 lg:mx-8 bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-0 lg:p-7 pb-6">
        {cardTitle && <h2 className="hidden lg:block text-lg font-bold text-primary-1 mb-5">{cardTitle}</h2>}

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm mx-4 lg:mx-0">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 px-4 pt-4 lg:px-0 lg:pt-0">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-1 pointer-events-none">
              <Search size={15} />
            </span>
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 text-[13px] text-primary-1 border border-slate-200 rounded-xl outline-none placeholder-neutral-1 focus:border-primary-2 transition-colors bg-white"
            />
          </div>
          <button
            onClick={onTambah}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-2 hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            <Plus size={15} /> Tambah
          </button>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="px-4 lg:px-0 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block">
              <DataTable
                columns={columns}
                data={paginated}
                onView={onView}
                onEdit={onEdit}
                onDelete={handleDeleteRequest}
              />
            </div>

            {/* Mobile */}
            <div className="lg:hidden px-4">
              {paginated.map((item) => {
                const cardProps = getMobileCardProps?.(item) ?? {};
                return (
                  <MobileCard
                    key={item.id}
                    {...cardProps}
                    onClick={onView ? () => onView(item) : undefined}
                    onEdit={onEdit   ? () => onEdit(item)   : undefined}
                    onDelete={() => handleDeleteRequest(item)}
                  />
                );
              })}
            </div>

            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </MainLayout>
  );
}