import React, { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles,
  Receipt
} from "lucide-react";

export default function TableCartDrawer() {
  const { 
    cart, 
    cartTotal, 
    cartItemCount, 
    tableNumber, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    isCartOpen, 
    setIsCartOpen,
    showToast
  } = useMenu();

  const [orderSent, setOrderSent] = useState(false);

  if (cart.length === 0 && !isCartOpen) return null;

  const handleConfirmOrder = () => {
    setOrderSent(true);
    showToast(`Masa ${tableNumber} siparişiniz iletildi! Tatlılarınız hazırlanıyor ✨`);
    setTimeout(() => {
      setOrderSent(false);
      setIsCartOpen(false);
      clearCart();
    }, 2800);
  };

  return (
    <>
      {/* Floating Bottom Bar (always visible if cart has items and drawer is closed) */}
      {cart.length > 0 && !isCartOpen && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-40 max-w-lg mx-auto"
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between p-3 sm:p-3.5 bg-gradient-to-r from-[#c9a34a] via-[#b89138] to-[#9e7a27] hover:from-[#e2c875] hover:to-[#c9a34a] rounded-2xl text-stone-950 font-black shadow-2xl shadow-black/90 border border-amber-200/50 active:scale-98 transition group"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/20 flex items-center justify-center relative">
                <ShoppingBag className="w-5 h-5 text-stone-950" />
                <span className="absolute -top-1.5 -right-1.5 bg-black text-[#c9a34a] text-[10px] sm:text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#c9a34a]">
                  {cartItemCount}
                </span>
              </div>
              <div className="text-left">
                <span className="text-[10px] sm:text-xs text-stone-900 block font-semibold">
                  Masa {tableNumber} Siparişleri
                </span>
                <span className="text-xs sm:text-sm font-black text-stone-950">
                  Adisyonu İncele
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-serif font-black text-stone-950">
                {cartTotal} ₺
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-y-[-2px] transition-transform">
                <ChevronUp className="w-4 h-4 text-stone-950" />
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {/* Full Modal Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Content Sheet */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="relative w-full max-w-lg bg-[#0c0e0c] border border-[#c9a34a]/30 rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col overflow-hidden z-10 shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#c9a34a]/20 flex items-center justify-between bg-[#080908]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#181d18] border border-[#c9a34a]/40 flex items-center justify-center text-[#c9a34a]">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-serif flex items-center gap-2">
                      <span>Masa {tableNumber} Adisyonu</span>
                      <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#c9a34a]/20 text-[#e2c875] border border-[#c9a34a]/40 font-bold">
                        {cartItemCount} Ürün
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Eklediğiniz ürünleri kontrol edip onaylayabilirsiniz.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-3.5 sm:p-4 overflow-y-auto space-y-2.5 flex-1 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto stroke-1" />
                    <p className="text-sm font-medium">Masanıza henüz bir ürün eklemediniz.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs text-[#c9a34a] underline font-bold"
                    >
                      Menüyü Keşfedin
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between gap-2.5 hover:border-[#c9a34a]/40 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {item.name}
                          </h4>
                          {item.extras && item.extras.length > 0 && (
                            <span className="text-[10px] text-gray-400 block truncate">
                              +{item.extras.map((e) => e.name).join(", ")}
                            </span>
                          )}
                          {item.note && (
                            <span className="text-[10px] text-amber-300/80 italic block truncate">
                              "{item.note}"
                            </span>
                          )}
                          <span className="text-xs font-bold text-[#c9a34a] font-serif mt-0.5 block">
                            {item.unitPrice * item.quantity} ₺
                          </span>
                        </div>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-300 active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          className="w-7 h-7 rounded-lg bg-[#c9a34a] hover:bg-[#e2c875] text-stone-950 font-bold flex items-center justify-center active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="w-7 h-7 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 flex items-center justify-center transition ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order Confirmation Screen Overlay */}
              {orderSent && (
                <div className="absolute inset-0 bg-[#0c0e0c]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#c9a34a]/20 border-2 border-[#c9a34a] flex items-center justify-center text-[#c9a34a] animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-white">
                    Siparişiniz İletildi!
                  </h3>
                  <p className="text-xs text-gray-300 max-w-xs">
                    Masa {tableNumber} siparişleriniz mutfağa ulaştı. Tatlılarınız taze fırına verildi.
                  </p>
                </div>
              )}

              {/* Footer Calculations & Actions */}
              {cart.length > 0 && (
                <div className="p-3.5 sm:p-4 bg-[#080908] border-t border-[#c9a34a]/20 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Masa / Kuver:</span>
                    <span className="text-[#c9a34a] font-semibold">Ücretsiz (0 ₺)</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-sm font-bold text-white">Toplam Tutar:</span>
                    <span className="text-xl sm:text-2xl font-serif font-black text-[#e2c875]">
                      {cartTotal} ₺
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={clearCart}
                      className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition"
                    >
                      Adisyonu Boşalt
                    </button>

                    <button
                      onClick={handleConfirmOrder}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a34a] to-[#a8822e] hover:from-[#e2c875] hover:to-[#c9a34a] text-stone-950 text-xs font-black transition shadow-lg shadow-black flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-stone-950" />
                      <span>Siparişi Onayla</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
