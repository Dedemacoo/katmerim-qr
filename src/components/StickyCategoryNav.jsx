import React, { useRef, useEffect } from "react";
import { useMenu } from "../context/MenuContext";
import { getCategoryIcon } from "../utils/iconMap";
import { motion } from "framer-motion";

export default function StickyCategoryNav() {
  const { categories, products, activeCategory, setActiveCategory } = useMenu();
  const navContainerRef = useRef(null);
  const activeBtnRef = useRef(null);

  // Auto-scroll active category button into view smoothly
  useEffect(() => {
    if (activeBtnRef.current && navContainerRef.current) {
      const container = navContainerRef.current;
      const button = activeBtnRef.current;
      const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-[84px] sm:top-[94px] z-30 bg-[#080908]/95 backdrop-blur-xl border-b border-[#c9a34a]/20 py-2 sm:py-2.5 shadow-xl">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div 
          ref={navContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat.id;
            const count = products.filter(p => p.categoryId === cat.id).length;
            const isFirst = idx === 0;

            return (
              <button
                key={cat.id}
                ref={isActive ? activeBtnRef : null}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const el = document.getElementById("product-showcase-section");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`relative shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 select-none ${
                  isActive
                    ? "text-stone-950 shadow-md shadow-black/80"
                    : "text-gray-400 hover:text-white bg-[#141714] hover:bg-[#1a1f1a] border border-white/5"
                } ${isFirst && !isActive ? "border-[#c9a34a]/40 text-amber-200" : ""}`}
              >
                {/* Active Indicator with Framer Motion layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#c9a34a] to-[#a8822e] rounded-xl border border-[#e2c875]"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}

                {/* Content */}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className={isActive ? "text-stone-950" : isFirst ? "text-[#c9a34a]" : "text-gray-400"}>
                    {getCategoryIcon(cat.icon, "w-3.5 h-3.5 sm:w-4 sm:h-4")}
                  </span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-stone-950/20 text-stone-950"
                        : "bg-black/50 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
