import React, { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BellRing, 
  CreditCard, 
  Banknote, 
  GlassWater, 
  Cigarette, 
  CheckCircle2, 
  X,
  Sparkles
} from "lucide-react";

export default function CallWaiterModal() {
  const { isCallWaiterOpen, setIsCallWaiterOpen, tableNumber, showToast } = useMenu();
  const [calledType, setCalledType] = useState(null);

  if (!isCallWaiterOpen) return null;

  const actions = [
    {
      id: "waiter",
      title: "Garson Çağır",
      desc: "Masaya servis personeli talep et",
      icon: BellRing,
      color: "from-[#c9a34a] to-amber-700",
      accent: "text-[#c9a34a]",
    },
    {
      id: "bill_card",
      title: "Hesap İste (Kredi Kartı)",
      desc: "POS cihazı ile masa başında ödeme",
      icon: CreditCard,
      color: "from-blue-600 to-indigo-700",
      accent: "text-blue-400",
    },
    {
      id: "bill_cash",
      title: "Hesap İste (Nakit)",
      desc: "Nakit ödeme için hesap pusulası",
      icon: Banknote,
      color: "from-amber-600 to-orange-700",
      accent: "text-amber-400",
    },
    {
      id: "water",
      title: "Su & Bardak İste",
      desc: "Ekstra bardak veya su servisi",
      icon: GlassWater,
      color: "from-cyan-600 to-teal-700",
      accent: "text-cyan-400",
    },
    {
      id: "ashtray",
      title: "Küllük İstiyorum",
      desc: "Açık alan için temiz küllük servisi",
      icon: Cigarette,
      color: "from-stone-600 to-stone-700",
      accent: "text-stone-300",
    },
  ];

  const handleAction = (action) => {
    setCalledType(action.title);
    showToast(`Masa ${tableNumber}: "${action.title}" çağrısı personele iletildi! 🛎️`);
    setTimeout(() => {
      setCalledType(null);
      setIsCallWaiterOpen(false);
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCallWaiterOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative w-full max-w-md bg-[#0c0e0c] border border-[#c9a34a]/30 rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 z-10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#c9a34a]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#181d18] border border-[#c9a34a]/40 flex items-center justify-center text-[#c9a34a] shadow-md">
                <BellRing className="w-5 h-5 animate-pulse text-[#c9a34a]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold font-serif text-white">
                  Masa {tableNumber} Servis & Çağrı
                </h3>
                <p className="text-[11px] text-gray-400">
                  İhtiyacınızı seçin, personelimiz anında masanıza gelsin.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCallWaiterOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action List */}
          <div className="py-3.5 space-y-2">
            {actions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => handleAction(act)}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#c9a34a]/40 transition group text-left active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${act.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#e2c875] transition-colors">
                        {act.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-gray-400">{act.desc}</p>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#c9a34a] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>

          {/* Success Call Overlay */}
          {calledType && (
            <div className="absolute inset-0 bg-[#0c0e0c]/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#c9a34a]/20 border-2 border-[#c9a34a] flex items-center justify-center text-[#c9a34a] animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold font-serif text-white">
                Çağrınız Alındı!
              </h4>
              <p className="text-xs text-[#e2c875]">
                "{calledType}" talebiniz Masa {tableNumber} için personele aktarıldı.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
