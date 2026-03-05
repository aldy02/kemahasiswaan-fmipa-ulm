import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, SquarePen, Trash2, FileSearchCorner, Check, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { izinPraktikumUlangData } from "../../test/data";

const ITEMS_PER_PAGE = 10;

function StatusBadge({ status }) {
  const map = {
    Diterima: { iconBg: "bg-succes-1", pillBg: "bg-succes-1", iconColor: "text-succes-1", icon: <Check size={14} strokeWidth={3} />, textColor: "text-primary-1" },
    Ditolak:  { iconBg: "bg-error-2",  pillBg: "bg-error-2",  iconColor: "text-error-2",  icon: <X size={14} strokeWidth={3} />,     textColor: "text-primary-1" },
    Revisi:   { iconBg: "bg-warning-1", pillBg: "bg-warning-1", iconColor: "text-warning-1", icon: <span className="font-black text-[13px] leading-none">!</span>, textColor: "text-primary-1" },
  };
  const cfg = map[status] ?? { iconBg: "bg-slate-400", pillBg: "bg-slate-300", icon: null, textColor: "text-primary-1" };
  return (
    <>
      <span className="hidden md:inline-flex items-center gap-2.5">
        <span className={`flex items-center justify-center w-5 h-5 rounded-full ${cfg.iconBg} text-white shrink-0`}>{cfg.icon}</span>
        <span className={`text-[15px] font-bold ${cfg.textColor}`}>{status}</span>
      </span>
      <span className={`md:hidden inline-flex items-center gap-1.5 ${cfg.pillBg} text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap`}>
        <span className={`flex items-center justify-center w-4 h-4 rounded-full bg-white ${cfg.iconColor} shrink-0`}>{cfg.icon}</span>
        {status}
      </span>
    </>
  );
}

function DesktopTable({ data, navigate }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["No surat", "Nama", "NIM", "Prodi", "Mata Kuliah", "Status", "Action"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-2 border-b border-slate-200 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-100">
              <td className="px-4 py-3.5 text-sm font-semibold text-primary-1 border-b border-slate-50">{item.noSurat}</td>
              <td className="px-4 py-3.5 text-sm font-semibold text-primary-1 border-b border-slate-50">{item.nama}</td>
              <td className="px-4 py-3.5 text-sm font-semibold text-primary-1 border-b border-slate-50">{item.nim}</td>
              <td className="px-4 py-3.5 text-sm font-semibold text-primary-1 border-b border-slate-50">{item.prodi}</td>
              <td className="px-4 py-3.5 text-sm font-semibold text-primary-1 border-b border-slate-50">{item.mataKuliah}</td>
              <td className="px-4 py-3.5 border-b border-slate-50"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3.5 border-b border-slate-50">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/data-surat/izin-praktikum-ulang/${item.id}`)}
                    title="Lihat dokumen"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-1 hover:text-black transition-opacity"
                  >
                    <FileSearchCorner size={20} />
                  </button>
                  <button title="Ubah" className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-2 hover:text-blue-700 transition-opacity"><SquarePen size={20} /></button>
                  <button title="Hapus" className="w-8 h-8 flex items-center justify-center rounded-lg text-error-1 hover:text-red-900 transition-opacity"><Trash2 size={20} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Mobile Card — click card → detail
function MobileCard({ item, navigate }) {
  return (
    <div
      onClick={() => navigate(`/data-surat/izin-praktikum-ulang/${item.id}`)}
      className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-3 cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-[15px] text-primary-1">{item.nama}</p>
          <p className="text-[13px] text-neutral-1 mt-0.5">{item.nim}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <hr className="border-slate-100 my-3" />
      {[
        ["No Surat", item.noSurat],
        ["Prodi", item.prodi],
        ["Mata Kuliah", item.mataKuliah],
      ].map(([label, value]) => (
        <div key={label} className="flex justify-between text-[13px] mb-1.5 last:mb-0">
          <span className="text-neutral-1">{label}</span>
          <span className="text-primary-1 font-semibold">{value}</span>
        </div>
      ))}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 border border-primary-2 text-primary-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium hover:bg-primary-2/5 transition-colors"
        >
          <SquarePen size={13} /> Ubah
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 border border-error-1 text-error-1 rounded-full px-3.5 py-1.5 text-[13px] font-medium hover:bg-error-1/5 transition-colors"
        >
          <Trash2 size={13} /> Hapus
        </button>
      </div>
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button onClick={() => onChange(current - 1)} disabled={current === 1} className="px-3 py-1.5 text-[13px] rounded-lg text-neutral-2 hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed">Previous</button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`min-w-9 py-1.5 text-[13px] bg-neutral-3 rounded-lg font-medium transition-colors ${p === current ? "bg-primary-2 text-white" : "text-primary-1 hover:bg-slate-300/80"}`}>{p}</button>
      ))}
      <button onClick={() => onChange(current + 1)} disabled={current === total} className="px-3 py-1.5 text-[13px] rounded-lg text-neutral-2 hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed">Next</button>
    </div>
  );
}

export default function IzinPraktikumUlang() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = izinPraktikumUlangData.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  return (
    <MainLayout>
      <div className="px-4 pt-5 pb-0 lg:px-8 lg:pt-7">
        <p className="hidden lg:block text-sm text-neutral-1 mb-1">Data Surat / Izin Praktikum Ulang</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-primary-1 mb-1">Data Surat Izin Praktikum Ulang</h1>
        <p className="lg:hidden text-[13px] text-neutral-1 mt-0.5">Informasi data surat izin praktikum ulang</p>
      </div>

      <div className="hidden lg:block h-6" />

      <div className="mx-0 lg:mx-8 bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-0 lg:p-7 pb-6">
        <h2 className="hidden lg:block text-lg font-bold text-primary-1 mb-5">Izin Praktikum Ulang</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 px-4 pt-4 lg:px-0 lg:pt-0">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-1 pointer-events-none"><Search size={15} /></span>
            <input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Cari berdasarkan nama mahasiswa..." className="w-full pl-9 pr-3 py-2.5 text-[13px] text-primary-1 border border-slate-200 rounded-xl outline-none placeholder-neutral-1 focus:border-primary-2 transition-colors bg-white" />
          </div>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-2 hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
            <Plus size={15} /> Tambah
          </button>
        </div>

        <div className="hidden lg:block">
          <DesktopTable data={paginated} navigate={navigate} />
        </div>
        <div className="lg:hidden px-4">
          {paginated.map((item) => <MobileCard key={item.id} item={item} navigate={navigate} />)}
        </div>

        {totalPages > 1 && <Pagination current={page} total={totalPages} onChange={setPage} />}
      </div>
    </MainLayout>
  );
}