import React from "react";
import { useMenu } from "../../context/MenuContext";
import { 
  Eye, 
  ShoppingBag, 
  TrendingUp, 
  Utensils, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  RefreshCw,
  QrCode,
  ExternalLink
} from "lucide-react";

export default function AdminDashboard() {
  const { products, categories, setIsAdminMode, resetToDefaults } = useMenu();

  const totalProducts = products.length;
  const outOfStock = products.filter(p => !p.isAvailable).length;
  const popularCount = products.filter(p => p.isPopular).length;

  const stats = [
    {
      title: "Bugünkü Menü Okutma",
      value: "482",
      change: "+18%",
      isPositive: true,
      icon: Eye,
      color: "text-emerald-400",
      bg: "bg-emerald-950/60 border-emerald-800/40",
    },
    {
      title: "Aktif Masa Sayısı",
      value: "12 / 16",
      change: "%75 Doluluk",
      isPositive: true,
      icon: Utensils,
      color: "text-amber-400",
      bg: "bg-amber-950/60 border-amber-800/40",
    },
    {
      title: "Toplam Ürün Çeşidi",
      value: totalProducts,
      change: `${outOfStock} Tükendi`,
      isPositive: outOfStock === 0,
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-950/60 border-blue-800/40",
    },
    {
      title: "Öne Çıkan Spesiyaller",
      value: popularCount,
      change: "Tatlı Ağırlıklı",
      isPositive: true,
      icon: Sparkles,
      color: "text-purple-400",
      bg: "bg-purple-950/60 border-purple-800/40",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">
            Yönetim & Canlı Panel
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Katmerim Künefe ve Kafe
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-md">
            Menüdeki ürünlerinizi, fiyatlarınızı ve stok durumunuzu anlık olarak yönetin. Yapılan tüm değişiklikler saniyesinde müşterinin QR ekranına yansır.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdminMode(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950"
          >
            <Eye className="w-4 h-4" />
            <span>Müşteri Menüsüne Dön</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl border ${stat.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">
                  {stat.title}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>

              <div>
                <span className="text-2xl font-extrabold text-white font-serif block">
                  {stat.value}
                </span>
                <span className={`text-[11px] font-semibold ${stat.isPositive ? "text-emerald-400" : "text-amber-400"}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Summary Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Ordered Products */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>En Çok Satan Tatlılar & Ürünler</span>
            </h3>
            <span className="text-[10px] text-gray-500 font-semibold">Son 24 Saat</span>
          </div>

          <div className="space-y-2">
            {products.slice(0, 4).map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-white">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400 font-serif">{p.price} ₺</span>
                  <span className={`w-2 h-2 rounded-full ${p.isAvailable ? "bg-emerald-400" : "bg-red-400"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cafe Information Snapshot */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>QR Menü & Sistem Durumu</span>
            </h3>
            <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              Canlı / Aktif
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-gray-300">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
              <span className="text-gray-400">Öncelikli Kategori:</span>
              <span className="font-bold text-amber-400">1. Tatlılar (Sabit)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
              <span className="text-gray-400">Veri Senkronizasyonu:</span>
              <span className="font-bold text-emerald-400">Anlık (LocalStorage + API Ready)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
              <span className="text-gray-400">Web Entegrasyonu:</span>
              <span className="font-bold text-blue-400">Modüler Mimari (Hazır)</span>
            </div>

            <button
              onClick={resetToDefaults}
              className="w-full mt-2 py-2 rounded-xl bg-white/5 hover:bg-red-950/40 text-gray-400 hover:text-red-300 border border-white/5 hover:border-red-800/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Demo Menüyü Orijinal Verilere Sıfırla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
