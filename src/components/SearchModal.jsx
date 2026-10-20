import React, { useState, useRef, useEffect } from "react";
import { useMenu } from "../context/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, Plus, Clock } from "lucide-react";

export default function SearchModal() {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    products, 
    setSelectedProduct, 
    categories 
  } = useMenu();

  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
        );
      })
    : [];

  const quickTags = ["Simit Katmer", "Hasır Künefe", "Fıstık Zade", "Cennet Çamuru", "Menengiç", "Latte", "Frozen"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 sm:pt-16">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Search Modal Content */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl bg-[#0c0e0c] border border-[#c9a34a]/30 rounded-b-3xl sm:rounded-3xl p-4 sm:p-5 z-10 shadow-2xl max-h-[85vh] flex flex-col"
        >
          {/* Search Input Bar */}
          <div className="relative flex items-center mb-3.5">
            <Search className="absolute left-3.5 w-4.5 h-4.5 text-[#c9a34a]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Menüde lezzet arayın (örn: Katmer, Künefe, Menengiç)..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#c9a34a] shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-12 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="ml-2 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center transition shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 border-b border-white/5">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider shrink-0 mr-1">
              Popüler:
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#c9a34a]/20 text-gray-300 hover:text-[#e2c875] border border-white/5 hover:border-[#c9a34a]/40 shrink-0 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results List */}
          <div className="overflow-y-auto space-y-2 py-3 no-scrollbar flex-1">
            {query.trim() === "" ? (
              <div className="text-center py-12 text-gray-500 space-y-2">
                <Search className="w-10 h-10 mx-auto text-gray-600 stroke-1" />
                <p className="text-xs">Tatlı veya içecek adı yazarak hızlıca bulabilirsiniz.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400 space-y-2">
                <p className="text-sm font-semibold">"{query}" ile eşleşen bir ürün bulunamadı.</p>
                <p className="text-xs text-gray-500">
                  Lütfen farklı bir kelime deneyin veya kategorilerden göz atın.
                </p>
              </div>
            ) : (
              filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-[#c9a34a]/40 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#e2c875] truncate">
                          {prod.name}
                        </h4>
                        {prod.tag && (
                          <span className="text-[9px] bg-[#c9a34a]/20 text-[#e2c875] px-1.5 py-0.2 rounded font-bold">
                            {prod.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate max-w-xs">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-sm font-bold text-[#c9a34a] font-serif">
                      {prod.price} ₺
                    </span>
                    <span className="text-[10px] text-gray-500 block">İncele →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
