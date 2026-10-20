import React, { useState, useEffect } from "react";
import { useMenu } from "../context/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Clock, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Check,
  Info
} from "lucide-react";

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct } = useMenu();
  const [imgError, setImgError] = useState(false);

  const fallbackImg = "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80";

  useEffect(() => {
    if (selectedProduct) {
      setImgError(false);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 26, stiffness: 340 }}
          className="relative w-full max-w-lg bg-[#0e110e] border border-[#c9a34a]/40 rounded-3xl max-h-[92vh] flex flex-col overflow-hidden z-10 shadow-2xl"
        >
          {/* Top Bar with Badge & Close Button */}
          <div className="px-4 py-3 bg-[#080908] border-b border-white/5 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              {selectedProduct.tag ? (
                <span className="inline-flex items-center gap-1.5 bg-[#c9a34a] text-stone-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedProduct.tag}</span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-gray-400">
                  Ürün Detayı
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Full Image Container - NO dark gradients, NO cropping, 100% visible food */}
          <div className="relative w-full bg-[#141714] flex items-center justify-center p-3 sm:p-4 border-b border-white/5">
            <img
              src={imgError ? fallbackImg : selectedProduct.image}
              alt={selectedProduct.name}
              onError={() => setImgError(true)}
              className="w-auto h-auto max-h-[260px] sm:max-h-[320px] max-w-full object-contain rounded-2xl shadow-md"
            />
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {selectedProduct.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                  {selectedProduct.prepTime && (
                    <span className="flex items-center gap-1 text-[#e2c875]">
                      <Clock className="w-3.5 h-3.5 text-[#c9a34a]" />
                      <span>{selectedProduct.prepTime}</span>
                    </span>
                  )}
                  {selectedProduct.calories && (
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{selectedProduct.calories}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-[#c9a34a] font-serif block">
                  {selectedProduct.price} ₺
                </span>
                {selectedProduct.oldPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    {selectedProduct.oldPrice} ₺
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.03] p-3.5 rounded-2xl border border-white/5">
              {selectedProduct.description}
            </p>

            {/* Allergens warning if any */}
            {selectedProduct.allergens && selectedProduct.allergens.length > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-amber-300 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 text-[#c9a34a]" />
                <span className="font-semibold">Alerjen Bilgisi:</span>
                <span className="text-amber-200/80">
                  {selectedProduct.allergens.join(", ")}
                </span>
              </div>
            )}

            {/* Extras / Servis Tercihleri (Informational only, not an order form) */}
            {selectedProduct.extras && selectedProduct.extras.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-xs uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#c9a34a]" />
                  <span>İsteğe Göre Servis İlavesi</span>
                </label>
                <div className="space-y-1.5">
                  {selectedProduct.extras.map((extra) => (
                    <div
                      key={extra.name}
                      className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold bg-white/[0.02] border border-white/5"
                    >
                      <span className="text-gray-200">{extra.name}</span>
                      <span className="text-[#c9a34a] font-serif font-bold">+{extra.price} ₺</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simple Close Footer (NO order button!) */}
          <div className="p-3.5 sm:p-4 bg-[#080908] border-t border-white/5 flex items-center justify-end">
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#c9a34a] hover:bg-[#e2c875] text-stone-950 font-black text-xs sm:text-sm transition shadow-lg shadow-black active:scale-95 text-center"
            >
              Menüye Dön
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
