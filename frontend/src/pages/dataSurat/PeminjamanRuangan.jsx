// src/pages/PeminjamanRuangan.jsx
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, FileText, Check, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { peminjamanRuanganData } from "../../test/data";

const ITEMS_PER_PAGE = 10;

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Diterima: { bg: "bg-green-500",  icon: <Check size={9} strokeWidth={3} /> },
    Ditolak:  { bg: "bg-red-500",    icon: <X size={9} strokeWidth={3} />    },
    Revisi:   { bg: "bg-yellow-500", icon: null                               },
  };
  const cfg = map[status] ?? { bg: "bg-slate-400", icon: null };

  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.bg} text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>
      {cfg.icon && (
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/30">
          {cfg.icon}
        </span>
      )}
      {status}
    </span>
  );
}

// ── Desktop Table ─────────────────────────────────────────────────────────────
function DesktopTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["No surat", "Organisasi", "Tempat kegiatan", "Tanggal pinjam", "Tanggal kembali", "Status", "Action"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 border-b border-slate-200 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-100">
              <td className="px-4 py-3.5 text-sm font-semibold text-[#1e3a5f] border-b border-slate-50">{item.noSurat}</td>
              <td className="px-4 py-3.5 text-sm text-slate-700 border-b border-slate-50">{item.organisasi}</td>
              <td className="px-4 py-3.5 text-sm font-semibold text-slate-700 border-b border-slate-50">{item.tempatKegiatan}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600 border-b border-slate-50">{item.tanggalPinjam}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600 border-b border-slate-50">{item.tanggalKembali}</td>
              <td className="px-4 py-3.5 border-b border-slate-50">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3.5 border-b border-slate-50">
                <div className="flex items-center gap-1.5">
                  <button title="Lihat dokumen" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:opacity-75 transition-opacity">
                    <FileText size={14} />
                  </button>
                  <button title="Ubah" className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:opacity-75 transition-opacity">
                    <Pencil size={14} />
                  </button>
                  <button title="Hapus" className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:opacity-75 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Mobile Card ───────────────────────────────────────────────────────────────
function MobileCard({ item }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-[15px] text-slate-800">{item.organisasi}</p>
          <p className="text-[13px] text-slate-500 mt-0.5">{item.tempatKegiatan}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <hr className="border-slate-100 my-3" />

      {[
        ["No Surat", item.noSurat],
        ["Tanggal Pinjam", item.tanggalPinjam],
        ["Tanggal Kembali", item.tanggalKembali],
      ].map(([label, value]) => (
        <div key={label} className="flex justify-between text-[13px] mb-1.5 last:mb-0">
          <span className="text-slate-500">{label}</span>
          <span className="text-slate-800 font-medium">{value}</span>
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        <button className="inline-flex items-center gap-1.5 border border-slate-300 text-slate-600 rounded-lg px-3.5 py-1.5 text-[13px] font-medium hover:bg-slate-50 transition-colors">
          <Pencil size={13} /> Ubah
        </button>
        <button className="inline-flex items-center gap-1.5 border border-red-400 text-red-500 rounded-lg px-3.5 py-1.5 text-[13px] font-medium hover:bg-red-50 transition-colors">
          <Trash2 size={13} /> Hapus
        </button>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1.5 text-[13px] rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`min-w-9 py-1.5 text-[13px] rounded-lg font-medium transition-colors ${
            p === current ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="px-3 py-1.5 text-[13px] rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PeminjamanRuangan() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = peminjamanRuanganData.filter((d) =>
    d.organisasi.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <MainLayout>
      {/* ── Header area: padding hanya di desktop ── */}
      <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
        {/* Breadcrumb — desktop only */}
        <p className="hidden lg:block text-xs text-slate-400 mb-1">
          Data Surat / Peminjaman Ruangan
        </p>

        {/* Page Title */}
        <h1 className="text-2xl lg:text-[28px] font-bold text-primary-1 mb-1">
          Data Surat Peminjaman Ruangan
        </h1>

        {/* Subtitle — mobile only */}
        <p className="lg:hidden text-[13px] text-slate-400 mt-0.5">
          Informasi data surat peminjaman ruangan
        </p>
      </div>

      {/* ── Desktop spacing ── */}
      <div className="hidden lg:block h-6" />

      {/* ── Panel desktop / transparent mobile ── */}
      <div className="
        mx-0 lg:mx-8
        bg-transparent lg:bg-white
        rounded-none lg:rounded-2xl
        shadow-none lg:shadow-[0_2px_12px_rgba(0,0,0,0.05)]
        p-0 lg:p-7
        pb-6
      ">
        {/* Panel title — desktop only */}
        <h2 className="hidden lg:block text-[17px] font-bold text-slate-800 mb-5">
          Peminjaman Ruangan
        </h2>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 px-4 pt-4 lg:px-0 lg:pt-0">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search size={15} />
            </span>
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari berdasarkan nama organisasi..."
              className="w-full pl-9 pr-3 py-2.5 text-[13px] text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors bg-white"
            />
          </div>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
            <Plus size={15} /> Tambah
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <DesktopTable data={paginated} />
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden px-4">
          {paginated.map((item) => (
            <MobileCard key={item.id} item={item} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination current={page} total={totalPages} onChange={setPage} />
        )}
      </div>
    </MainLayout>
  );
}