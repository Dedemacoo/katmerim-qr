import React, { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { 
  BellRing, 
  Wifi, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Clock,
  Layers,
  MapPin
} from "lucide-react";

export default function Header() {
  const { 
    cafeInfo, 
    tableNumber, 
    setIsCallWaiterOpen, 
    setIsWifiModalOpen, 
    setIsSearchOpen, 
    isAdminMode, 
    setIsAdminMode,
    showCategoryGridFirst,
    setShowCategoryGridFirst,
    setIsTableModalOpen
  } = useMenu();

  const [logoLoaded, setLogoLoaded] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-[#080908]/95 backdrop-blur-xl border-b border-[#c9a34a]/20 shadow-2xl">
      {/* Top micro bar: Table Info, Location & Admin shortcut */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-3 text-amber-300">
          <button 
            onClick={() => setIsTableModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#141714] hover:bg-[#1a1f1a] text-amber-200 px-2.5 py-0.5 rounded-full border border-[#c9a34a]/40 transition font-medium active:scale-95 text-[11px]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold">Masa {tableNumber}</span>
            <span className="text-[10px] text-amber-400/80 underline ml-0.5">Değiştir</span>
          </button>

          <span className="hidden xs:flex items-center gap-1 text-[#aaa99f] text-[11px]">
            <MapPin className="w-3 h-3 text-[#c9a34a]" />
            <span>İpekyolu, Van</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Category Showcase Toggle */}
          <button
            onClick={() => {
              setShowCategoryGridFirst(prev => !prev);
              const el = document.getElementById("category-gateway-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
              showCategoryGridFirst
                ? "bg-[#c9a34a]/20 text-amber-300 border border-[#c9a34a]/50"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
            }`}
            title="Kategoriler Görünümü"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Kategoriler</span>
          </button>
        </div>
      </div>

      {/* Main Brand & Action Row */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src="/logo.png"
              alt="Katmerim Künefe & Cafe Logo"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-xl"
              onError={(e) => {
                if (!e.target.src.includes("katmerim.com")) {
                  e.target.src = "https://katmerim.com/logo.png";
                } else {
                  e.target.style.display = "none";
                  setLogoLoaded(false);
                }
              }}
            />
            {!logoLoaded && (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a34a] to-amber-900 p-[1.5px] shadow-lg">
                <div className="w-full h-full bg-[#080908] rounded-[14px] flex items-center justify-center">
                  <span className="text-xl font-bold font-serif text-[#c9a34a]">K</span>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-white font-serif truncate">
                Katmerim
              </h1>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold bg-[#c9a34a]/15 text-[#e2c875] px-1.5 py-0.5 rounded border border-[#c9a34a]/30">
                Künefe & Cafe
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#aaa99f] flex items-center gap-1 truncate font-medium mt-0.5">
              <Sparkles className="w-3 h-3 text-[#c9a34a] shrink-0" />
              <span>Van'ın En İyi Tatlıcısı</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: WiFi, Search, Call Waiter */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Live Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-gray-200 transition shadow-sm"
            aria-label="Ürün Ara"
            title="Ürün Ara"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-300" />
          </button>

          {/* Wifi Modal Button */}
          <button
            onClick={() => setIsWifiModalOpen(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-gray-200 transition shadow-sm"
            aria-label="Kafe WiFi"
            title="Misafir WiFi"
          >
            <Wifi className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#c9a34a]" />
          </button>

          {/* Call Waiter & Request Bill */}
          <button
            onClick={() => setIsCallWaiterOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#c9a34a] to-[#a8822e] hover:from-[#e2c875] hover:to-[#c9a34a] active:scale-95 text-stone-950 text-xs sm:text-sm font-extrabold transition shadow-md shadow-[#c9a34a]/20 border border-amber-200/40"
          >
            <BellRing className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-stone-950" />
            <span className="hidden sm:inline">Garson / Hesap</span>
            <span className="sm:hidden text-[11px]">Garson</span>
          </button>
        </div>
      </div>
    </header>
  );
}
