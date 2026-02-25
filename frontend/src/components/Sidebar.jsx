// src/components/Sidebar.jsx
import { useState } from "react";
import {
  House,
  Mails,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: <House size={20} />,
    key: "dashboard",
  },
  {
    label: "Pengajuan Surat",
    icon: <Mails size={20} />,
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
    icon: <Mails size={20} />,
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

  const activeParent = activeKey?.includes("::") ? activeKey.split("::")[0] : null;
  const activeChild = activeKey?.includes("::") ? activeKey.split("::")[1] : null;

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
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Aldy&backgroundColor=b6e3f4"
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

            {/* Close button mobile */}
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
                  ? activeParent === item.key
                  : activeKey === item.key;

                return (
                  <div key={item.key}>
                    <button
                      className={`
                        flex items-center gap-3.5 w-full px-4 py-3
                        rounded-xl text-[14px] font-medium text-left
                        transition-colors duration-150
                        ${
                          isParentActive
                            ? "bg-primary-3/10 text-primary-3"
                            : "text-neutral-1 hover:bg-slate-50 hover:text-primary-1"
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
                        <span className="text-neutral-1 shrink-0">
                          {openMenus[item.key] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </span>
                      )}
                    </button>

                    {item.children && openMenus[item.key] && (
                      <div className="ml-4 pl-5 mt-1 mb-1 flex flex-col gap-0.5 border-l-2 border-slate-100">
                        {item.children.map((child) => {
                          const isChildActive = activeParent === item.key && activeChild === child;
                          return (
                            <button
                              key={child}
                              className={`
                                w-full text-left px-3 py-2 text-[13px] rounded-lg
                                transition-colors leading-tight
                                ${
                                  isChildActive
                                    ? "bg-primary-3/10 text-primary-3 font-medium"
                                    : "text-neutral-1 hover:text-primary-1 hover:bg-slate-50"
                                }
                              `}
                              onClick={() => {
                                setActiveKey(`${item.key}::${child}`);
                                onClose();
                              }}
                            >
                              {child}
                            </button>
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
