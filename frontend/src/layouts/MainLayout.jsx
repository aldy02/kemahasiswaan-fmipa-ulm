// src/layouts/MainLayout.jsx
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");

  return (
    <div className="min-h-screen bg-[#F1F4F9]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
      />

      {/* Content wrapper — offset by sidebar on desktop */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="flex items-center lg:hidden px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}