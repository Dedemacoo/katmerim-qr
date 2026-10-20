import React, { useEffect } from "react";
import { useMenu } from "../context/MenuContext";
import Header from "./Header";
import AnnouncementBar from "./AnnouncementBar";
import CategoryGateway from "./CategoryGateway";
import StickyCategoryNav from "./StickyCategoryNav";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import CallWaiterModal from "./CallWaiterModal";
import WifiModal from "./WifiModal";
import SearchModal from "./SearchModal";
import TablePickerModal from "./TablePickerModal";
import { getCategoryIcon } from "../utils/iconMap";
import { Sparkles, MapPin, Phone, Heart, Navigation, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function InstagramIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function CustomerMenu() {
  const { 
    categories, 
    products, 
    activeCategory, 
    cafeInfo, 
    toast,
    tableNumber 
  } = useMenu();

  const currentCategoryObj = categories.find((c) => c.id === activeCategory) || categories[0];
  const categoryProducts = products.filter((p) => p.categoryId === currentCategoryObj?.id);

  return (
    <div className="min-h-screen bg-[#080908] text-[#eee8d9] pb-28 selection:bg-[#c9a34a] selection:text-black">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#141714] border border-[#c9a34a]/60 text-[#e2c875] text-xs font-bold shadow-2xl shadow-black flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#c9a34a] shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Brand & Actions Header */}
      <Header />

      {/* Dynamic Announcement Ticker */}
      <AnnouncementBar />

      <main>
        {/* Category First Gateway Showcase */}
        {/* Requirement: "öncelik kategorileme olmalı qr açılınca hemen ürün çıkması yerine önce kategoriler çıkmalı sol üstte tatlıalr-kahveler-soğuk içecekler vs vs diye gider ama en önde tatlılar olmak zorunda" */}
        <CategoryGateway />

        {/* Sticky Horizontal Category Bar */}
        <StickyCategoryNav />

        {/* Products Showcase Section */}
        <section id="product-showcase-section" className="max-w-4xl mx-auto px-3 sm:px-4 pt-5 sm:pt-6">
          {/* Active Category Header */}
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#c9a34a]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#141714] border border-[#c9a34a]/40 flex items-center justify-center text-[#c9a34a]">
                {getCategoryIcon(currentCategoryObj?.icon, "w-4 h-4")}
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold font-serif text-white flex items-center gap-2">
                  <span>{currentCategoryObj?.name}</span>
                  {currentCategoryObj?.id === "tatlilar" && (
                    <span className="text-[10px] bg-[#c9a34a] text-stone-950 px-2 py-0.2 rounded-full font-black uppercase">
                      Spesiyal
                    </span>
                  )}
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-400">
                  {currentCategoryObj?.subtitle} ({categoryProducts.length} Çeşit)
                </p>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {categoryProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white/[0.02] rounded-2xl border border-white/5 p-6">
              <p className="text-sm font-semibold">Bu kategoride henüz ürün bulunmuyor.</p>
              <p className="text-xs text-gray-500 mt-1">
                Yönetim panelinden dilediğiniz zaman bu kategoriye yeni ürün ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {categoryProducts.map((prod, idx) => (
                <ProductCard key={prod.id} product={prod} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* Footer Brand & Social Info */}
        <footer className="max-w-4xl mx-auto px-4 mt-16 pt-8 border-t border-[#c9a34a]/20 text-center text-xs text-gray-400 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-1">
            <img
              src="https://katmerim.com/logo.png"
              alt="Katmerim Logo"
              className="h-10 w-auto mb-1 drop-shadow-lg"
            />
            <h3 className="font-serif font-black text-base text-white">
              {cafeInfo.name}
            </h3>
            <p className="text-[#e2c875] text-xs font-semibold">
              {cafeInfo.slogan}
            </p>
            <p className="text-gray-400 text-[11px] max-w-sm">
              {cafeInfo.address}
            </p>
          </div>

          {/* Action Links: Phone, Maps, Instagram, WhatsApp */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-gray-300 pt-1">
            <a
              href={`tel:${cafeInfo.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs border border-white/5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#c9a34a]" />
              <span>{cafeInfo.phone}</span>
            </a>

            <a
              href="https://www.instagram.com/katmerimkunefecafe?igsi=cjd3NXQza3Q5MXdv"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs border border-white/5 transition"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>@katmerimkunefecafe</span>
            </a>

            <a
              href="https://wa.me/905013336500"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs border border-emerald-700/40 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a
              href="https://share.google/hfHKb2rMUsaU3m6lo"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c9a34a]/15 hover:bg-[#c9a34a]/25 text-[#e2c875] text-xs border border-[#c9a34a]/40 transition"
            >
              <Navigation className="w-3.5 h-3.5 text-[#c9a34a]" />
              <span>Yol Tarifi Al ↗</span>
            </a>
          </div>

          <div className="pt-3 text-[10px] text-gray-500 flex items-center justify-center gap-1">
            <span>Masa {tableNumber} için hazırlandı</span>
            <span>•</span>
            <span>Katmerim Künefe & Cafe Dijital QR Menü</span>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <ProductDetailModal />
      <CallWaiterModal />
      <WifiModal />
      <SearchModal />
      <TablePickerModal />
    </div>
  );
}
