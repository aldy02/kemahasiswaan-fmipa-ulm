// src/layouts/MainLayout.jsx
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");

  return (
    <div>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
      />

      <div className="lg:pl-64">
        {/* Humberger */}
        <div className="flex items-center lg:hidden px-4 py-3 bg-[#F4F7FE] border-b border-slate-100 sticky top-0 z-50 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-primary-1 hover:bg-primary-3/8 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}
