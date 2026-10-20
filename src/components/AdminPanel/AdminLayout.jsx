import React from "react";
import { useMenu } from "../../context/MenuContext";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Layers, 
  Database, 
  Settings, 
  ArrowLeft,
  SlidersHorizontal,
  Sparkles,
  LogOut
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminDataSource from "./AdminDataSource";
import AdminSettings from "./AdminSettings";
import AdminQRCodes from "./AdminQRCodes";
import { QrCode } from "lucide-react";

export default function AdminLayout() {
  const { adminTab, setAdminTab, setIsAdminMode, logoutAdmin, cafeInfo } = useMenu();

  const tabs = [
    { id: "dashboard", label: "Genel Bakış", icon: LayoutDashboard },
    { id: "products", label: "Ürünler & Fiyat", icon: UtensilsCrossed },
    { id: "categories", label: "Kategoriler", icon: Layers },
    { id: "qrcodes", label: "Masa QR Kartları", icon: QrCode },
    { id: "datasource", label: "Veri Kaynağı (API)", icon: Database },
    { id: "settings", label: "Kafe Ayarları", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09100d] text-gray-100 pb-16">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0c1410]/95 backdrop-blur-xl border-b border-emerald-900/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Menüye Dön</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold font-serif text-white">
                  Katmerim Yönetim Paneli
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                  Admin Demo
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Canlı Senkronizasyon</span>
            </div>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-500/30 transition shadow-sm"
              title="Yönetim oturumunu kapat"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition whitespace-nowrap ${
                    isActive
                      ? "text-[#c9a34a] border-[#c9a34a] bg-white/[0.03]"
                      : "text-gray-400 hover:text-gray-200 border-transparent hover:bg-white/[0.01]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {adminTab === "dashboard" && <AdminDashboard />}
        {adminTab === "products" && <AdminProducts />}
        {adminTab === "categories" && <AdminCategories />}
        {adminTab === "qrcodes" && <AdminQRCodes />}
        {adminTab === "datasource" && <AdminDataSource />}
        {adminTab === "settings" && <AdminSettings />}
      </main>
    </div>
  );
}
