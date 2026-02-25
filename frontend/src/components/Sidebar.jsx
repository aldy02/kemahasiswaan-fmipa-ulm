// src/components/Sidebar.jsx
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Database,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    key: "dashboard",
  },
  {
    label: "Pengajuan Surat",
    icon: <FileText size={20} />,
    key: "pengajuan",
    children: [
      "Peminjaman ruangan",
      "Peminjaman alat/bahan",
      "Izin tidak mengikuti kuliah",
      "Izin praktikum ulang",
      "Rekomendasi",
      "Keterangan",
      "Keterangan mahasiswa kuliah",
    ],
  },
  {
    label: "Data Surat",
    icon: <Database size={20} />,
    key: "data",
    children: [
      "Peminjaman ruangan",
      "Peminjaman alat/bahan",
      "Izin tidak mengikuti kuliah",
      "Izin praktikum ulang",
      "Rekomendasi",
      "Keterangan",
      "Keterangan mahasiswa kuliah",
    ],
  },
  {
    label: "Pengaturan",
    icon: <Settings size={20} />,
    key: "pengaturan",
  },
];

export default function Sidebar({ isOpen, onClose, activeKey, setActiveKey }) {
  const [openMenus, setOpenMenus] = useState({ pengajuan: true, data: false });

  const toggleMenu = (key) =>
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Outer wrapper — slide animation + overflow visible saat open agar close button tidak terpotong */}
      <div
        className={`
          fixed top-0 left-0 h-full z-[100]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 overflow-visible" : "-translate-x-full overflow-hidden"}
          lg:translate-x-0 lg:overflow-visible
        `}
      >
        {/* Sidebar panel — overflow-y scroll hanya pada konten nav, bukan seluruh aside */}
        <aside className="w-[240px] h-full bg-white flex flex-col shadow-[2px_0_20px_rgba(0,0,0,0.08)]">

          {/* Profile row */}
          <div className="relative flex items-center gap-3 px-6 pt-7 pb-6 border-b border-slate-100 shrink-0">
            <div className="w-[52px] h-[52px] rounded-2xl overflow-hidden bg-indigo-50 shrink-0">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Aldy&backgroundColor=b6e3f4"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-slate-800 leading-tight">
                Aldy Rahman
              </span>
              <span className="block text-[12px] text-slate-400 mt-0.5">
                2011016210022
              </span>
            </div>

            {/* Close button — absolute, di luar aside tapi relatif ke profile row */}
            {isOpen && (
              <button
                onClick={onClose}
                className="lg:hidden absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-lg transition-all z-10"
                aria-label="Tutup sidebar"
              >
                <ChevronLeft size={15} />
              </button>
            )}
          </div>

          {/* Scrollable nav area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <nav className="flex flex-col h-full px-4 py-5 gap-1">
              {menuItems.map((item) => (
                <div key={item.key}>
                  <button
                    className={`
                      flex items-center gap-3.5 w-full px-4 py-3
                      rounded-xl text-[14px] font-medium text-left
                      transition-colors duration-150
                      ${
                        activeKey === item.key
                          ? "bg-indigo-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }
                    `}
                    onClick={() => {
                      if (item.children) {
                        toggleMenu(item.key);
                      } else {
                        setActiveKey(item.key);
                        onClose();
                      }
                    }}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1 leading-tight">{item.label}</span>
                    {item.children && (
                      <span className="text-slate-400 shrink-0">
                        {openMenus[item.key] ? (
                          <ChevronUp size={15} />
                        ) : (
                          <ChevronDown size={15} />
                        )}
                      </span>
                    )}
                  </button>

                  {item.children && openMenus[item.key] && (
                    <div className="ml-4 pl-5 mt-1 mb-1 flex flex-col gap-0.5 border-l-2 border-slate-100">
                      {item.children.map((child) => (
                        <button
                          key={child}
                          className={`
                            w-full text-left px-3 py-2 text-[13px] rounded-lg
                            transition-colors leading-tight
                            ${
                              activeKey === child
                                ? "bg-indigo-50 text-blue-600 font-medium"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                            }
                          `}
                          onClick={() => {
                            setActiveKey(child);
                            onClose();
                          }}
                        >
                          {child}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Logout */}
              <div className="mt-auto pt-5 border-t border-slate-100">
                <button className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-[14px] font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={20} className="shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>

        </aside>
      </div>
    </>
  );
}