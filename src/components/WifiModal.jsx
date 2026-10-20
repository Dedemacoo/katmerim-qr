import React, { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Copy, Check, X, ShieldCheck } from "lucide-react";

export default function WifiModal() {
  const { isWifiModalOpen, setIsWifiModalOpen, cafeInfo, showToast } = useMenu();
  const [copied, setCopied] = useState(false);

  if (!isWifiModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(cafeInfo.wifiPass || "katmerim65");
    setCopied(true);
    showToast("WiFi şifresi panoya kopyalandı! 📶");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsWifiModalOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm bg-[#0c0e0c] border border-[#c9a34a]/30 rounded-3xl p-5 sm:p-6 z-10 shadow-2xl text-center"
        >
          <button
            onClick={() => setIsWifiModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-[#181d18] border border-[#c9a34a]/40 flex items-center justify-center text-[#c9a34a] mx-auto mb-4 shadow-lg shadow-black">
            <Wifi className="w-7 h-7" />
          </div>

          <h3 className="text-base sm:text-lg font-bold font-serif text-white mb-1">
            Katmerim Misafir WiFi
          </h3>
          <p className="text-xs text-gray-400 mb-5">
            Katmerim Künefe & Cafe hızlı kablosuz ağına bağlanın.
          </p>

          <div className="space-y-3 bg-white/[0.03] p-4 rounded-2xl border border-white/5 mb-5 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">
                Ağ Adı (SSID)
              </span>
              <span className="text-sm font-semibold text-white">
                {cafeInfo.wifiName || "Katmerim_Cafe"}
              </span>
            </div>

            <div className="border-t border-white/5 pt-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">
                  WiFi Şifresi
                </span>
                <span className="text-base font-mono font-bold text-[#e2c875]">
                  {cafeInfo.wifiPass || "katmerim65"}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c9a34a]/20 hover:bg-[#c9a34a]/30 text-[#e2c875] text-xs font-bold border border-[#c9a34a]/40 transition active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Kopyalandı" : "Kopyala"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c9a34a]" />
            <span>Yüksek Hızlı Ücretsiz Misafir Bağlantısı</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
