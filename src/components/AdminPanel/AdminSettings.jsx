import React, { useState } from "react";
import { useMenu } from "../../context/MenuContext";
import { Settings, Save, Wifi, Megaphone, Store, Phone, MapPin } from "lucide-react";

export default function AdminSettings() {
  const { cafeInfo, updateCafeInfo } = useMenu();
  const [formData, setFormData] = useState({ ...cafeInfo });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCafeInfo(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand & Slogan */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
        <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-400" />
          <span>Kafe & Marka Bilgileri</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-gray-400 font-semibold mb-1">İşletme Adı</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold mb-1">Slogan / Başlık</label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold mb-1">Telefon</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold mb-1">Çalışma Saatleri</label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-400 font-semibold mb-1">Adres</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Guest WiFi Settings */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
        <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span>Misafir WiFi Ağı Yapılandırması</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-gray-400 font-semibold mb-1">WiFi Ağ Adı (SSID)</label>
            <input
              type="text"
              value={formData.wifiName}
              onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold mb-1">WiFi Şifresi</label>
            <input
              type="text"
              value={formData.wifiPass}
              onChange={(e) => setFormData({ ...formData, wifiPass: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Announcement / Banner Settings */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
        <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>Canlı Duyuru & Kampanya Bandı</span>
        </h3>

        <div className="text-xs">
          <label className="block text-gray-400 font-semibold mb-1">
            Menü Üstü Kayan / Sabit Duyuru Metni
          </label>
          <input
            type="text"
            value={formData.announcement}
            onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
            placeholder="Örn: Saat 14:00 - 18:00 arası Çay İkramımızdır!"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Boş bırakırsanız duyuru bandı gizlenir.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950"
        >
          <Save className="w-4 h-4" />
          <span>Ayarları Kaydet</span>
        </button>
      </div>
    </form>
  );
}
