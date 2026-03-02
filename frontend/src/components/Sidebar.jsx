// src/components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { House, Mails, Settings, LogOut, ChevronUp, ChevronDown, ChevronLeft } from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: <House size={20} />,
    key: "dashboard",
    path: "/",
  },
  {
    label: "Pengajuan Surat",
    icon: <Mails size={20} />,
    key: "pengajuan",
    children: [
      { label: "Peminjaman ruangan",           path: "/pengajuan-surat/peminjaman-ruangan" },
      { label: "Peminjaman alat/bahan",        path: "/pengajuan-surat/peminjaman-alat-bahan" },
      { label: "Izin tidak mengikuti kuliah",  path: "/pengajuan-surat/izin-tidak-mengikuti-kuliah" },
      { label: "Izin praktikum ulang",         path: "/pengajuan-surat/izin-praktikum-ulang" },
      { label: "Rekomendasi",                  path: "/pengajuan-surat/rekomendasi" },
      { label: "Keterangan",                   path: "/pengajuan-surat/keterangan" },
      { label: "Keterangan mahasiswa kuliah",  path: "/pengajuan-surat/keterangan-mahasiswa-kuliah" },
    ],
  },
  {
    label: "Data Surat",
    icon: <Mails size={20} />,
    key: "data",
    children: [
      { label: "Peminjaman ruangan",           path: "/data-surat/peminjaman-ruangan" },
      { label: "Peminjaman alat/bahan",        path: "/data-surat/peminjaman-alat-bahan" },
      { label: "Izin tidak mengikuti kuliah",  path: "/data-surat/izin-tidak-mengikuti-kuliah" },
      { label: "Izin praktikum ulang",         path: "/data-surat/izin-praktikum-ulang" },
      { label: "Rekomendasi",                  path: "/data-surat/rekomendasi" },
      { label: "Keterangan",                   path: "/data-surat/keterangan" },
      { label: "Keterangan mahasiswa kuliah",  path: "/data-surat/keterangan-mahasiswa-kuliah" },
    ],
  },
  {
    label: "Pengaturan",
    icon: <Settings size={20} />,
    key: "pengaturan",
    path: "/pengaturan",
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  // Auto-open parent jika child route sedang aktif
  const getInitialOpenMenus = () => {
    const open = { pengajuan: false, data: false };
    menuItems.forEach((item) => {
      if (item.children?.some((c) => location.pathname.startsWith(c.path))) {
        open[item.key] = true;
      }
    });
    return open;
  };

  const [openMenus, setOpenMenus] = useState(getInitialOpenMenus);

  const toggleMenu = (key) =>
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-99 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Outer wrapper */}
      <div
        className={`
          fixed top-0 left-0 h-full z-100
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 overflow-visible" : "-translate-x-full overflow-hidden"}
          lg:translate-x-0 lg:overflow-visible
        `}
      >
        {/* Sidebar panel */}
        <aside className="w-64 h-full bg-white flex flex-col shadow-[2px_0_20px_rgba(0,0,0,0.08)]">

          {/* Profile */}
          <div className="relative flex items-center gap-3 px-6 pt-7 pb-6 border-b border-slate-100 shrink-0">
            <div className="w-13 h-13 rounded-2xl overflow-hidden bg-indigo-50 shrink-0">
              <img
                src="https://api.dicebear.com/9.x/micah/svg?backgroundColor=d1d4f9,b6e3f4&seed=Aidan"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-primary-1 leading-tight">
                Aldy Rahman
              </span>
              <span className="block text-[12px] text-neutral-1 mt-0.5">
                2011016210022
              </span>
            </div>

            {isOpen && (
              <button
                onClick={onClose}
                className="lg:hidden absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-md flex items-center justify-center text-neutral-1 hover:text-primary-1 hover:shadow-lg transition-all z-10"
                aria-label="Tutup sidebar"
              >
                <ChevronLeft size={15} />
              </button>
            )}
          </div>

          {/* Nav scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <nav className="flex flex-col px-4 py-5 gap-1">
              {menuItems.map((item) => {
                const isParentActive = item.children
                  ? item.children.some((c) => location.pathname.startsWith(c.path))
                  : location.pathname === item.path;

                return (
                  <div key={item.key}>
                    {item.children ? (
                      <button
                        className={`
                          flex items-center gap-3.5 w-full px-4 py-3
                          rounded-xl text-[14px] font-medium text-left
                          transition-colors duration-150
                          ${isParentActive
                            ? "bg-primary-3/10 text-primary-3"
                            : "text-neutral-1 hover:bg-slate-50 hover:text-primary-1"
                          }
                        `}
                        onClick={() => toggleMenu(item.key)}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="flex-1 leading-tight">{item.label}</span>
                        <span className="text-neutral-1 shrink-0">
                          {openMenus[item.key] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </span>
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`
                          flex items-center gap-3.5 w-full px-4 py-3
                          rounded-xl text-[14px] font-medium
                          transition-colors duration-150
                          ${isParentActive
                            ? "bg-primary-3/10 text-primary-3"
                            : "text-neutral-1 hover:bg-slate-50 hover:text-primary-1"
                          }
                        `}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="flex-1 leading-tight">{item.label}</span>
                      </Link>
                    )}

                    {item.children && openMenus[item.key] && (
                      <div className="ml-4 pl-5 mt-1 mb-1 flex flex-col gap-0.5 border-l-2 border-slate-100">
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={onClose}
                              className={`
                                w-full text-left px-3 py-2 text-[13px] rounded-lg
                                transition-colors leading-tight
                                ${isChildActive
                                  ? "bg-primary-3/10 text-primary-3 font-medium"
                                  : "text-neutral-1 hover:text-primary-1 hover:bg-slate-50"
                                }
                              `}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Logout */}
          <div className="px-4 pb-5 pt-3 border-t border-slate-100 shrink-0">
            <button className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-[14px] font-medium text-neutral-1 hover:text-error-3 hover:bg-red-50 transition-colors">
              <LogOut size={20} className="shrink-0" />
              <span>Logout</span>
            </button>
          </div>

        </aside>
      </div>
    </>
  );
}