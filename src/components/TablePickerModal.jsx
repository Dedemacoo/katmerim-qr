import React from "react";
import { useMenu } from "../context/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Utensils } from "lucide-react";

export default function TablePickerModal() {
  const { isTableModalOpen, setIsTableModalOpen, tableNumber, setTableNumber, showToast } = useMenu();

  if (!isTableModalOpen) return null;

  const tables = Array.from({ length: 16 }, (_, i) => i + 1);

  const handleSelect = (num) => {
    setTableNumber(num);
    setIsTableModalOpen(false);
    showToast(`Masa ${num} seçildi! ✨`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsTableModalOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm bg-[#0c0e0c] border border-[#c9a34a]/30 rounded-3xl p-5 z-10 shadow-2xl text-center"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2 text-left">
              <Utensils className="w-4 h-4 text-[#c9a34a]" />
              <h3 className="text-sm font-bold text-white font-serif">Masa Numarası Seçin</h3>
            </div>
            <button
              onClick={() => setIsTableModalOpen(false)}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-4 text-left">
            Bulunduğunuz masanın üzerindeki QR kodunda yer alan masa numarasını seçebilirsiniz:
          </p>

          <div className="grid grid-cols-4 gap-2 mb-2">
            {tables.map((num) => {
              const isCurrent = tableNumber === num;
              return (
                <button
                  key={num}
                  onClick={() => handleSelect(num)}
                  className={`py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 flex flex-col items-center justify-center ${
                    isCurrent
                      ? "bg-[#c9a34a] text-stone-950 font-black shadow-md shadow-[#c9a34a]/30"
                      : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/5"
                  }`}
                >
                  <span className="text-[10px] text-gray-400">Masa</span>
                  <span className="text-sm sm:text-base">{num}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
