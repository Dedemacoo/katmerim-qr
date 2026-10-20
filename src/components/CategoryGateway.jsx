import React from "react";
import { useMenu } from "../context/MenuContext";
import { getCategoryIcon } from "../utils/iconMap";
import { motion } from "framer-motion";
import { ChevronRight, ArrowDown, Sparkles } from "lucide-react";

export default function CategoryGateway() {
  const { 
    categories, 
    products, 
    activeCategory, 
    setActiveCategory 
  } = useMenu();

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const productSection = document.getElementById("product-showcase-section");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="category-gateway-section" className="max-w-4xl mx-auto px-3 sm:px-4 pt-3 sm:pt-5 pb-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#c9a34a] font-extrabold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#c9a34a]" />
            <span>Önce Kategori Seçin</span>
          </span>
          <h2 className="text-lg sm:text-2xl font-bold font-serif text-white">
            Katmerim Menü
          </h2>
        </div>

        <button
          onClick={() => {
            const productSection = document.getElementById("product-showcase-section");
            if (productSection) {
              productSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="text-[11px] sm:text-xs text-[#e2c875] hover:text-white flex items-center gap-1 font-semibold bg-[#141714] px-3 py-1.5 rounded-full border border-[#c9a34a]/30 active:scale-95 transition"
        >
          <span>Tüm Ürünler</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#c9a34a]" />
        </button>
      </div>

      {/* Grid of Categories - 1st is Tatlılar (Spotlight Feature) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        {categories.map((cat, index) => {
          const isTatlilar = cat.id === "tatlilar";
          const count = products.filter(p => p.categoryId === cat.id).length;
          const isSelected = activeCategory === cat.id;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectCategory(cat.id)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? "ring-2 ring-[#c9a34a] border-[#e2c875] shadow-xl shadow-black/80"
                  : isTatlilar
                  ? "border-[#c9a34a]/60 hover:border-[#c9a34a] shadow-lg shadow-black/50"
                  : "border-white/10 hover:border-white/20"
              } ${
                isTatlilar
                  ? "col-span-2 aspect-[2.1/1] sm:aspect-[2.4/1]"
                  : "aspect-[1.15/1] sm:aspect-[1.25/1]"
              }`}
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />

              {/* Bottom text protection gradient only - Keep food photo bright and natural */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between z-10">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold backdrop-blur-md ${
                    isTatlilar
                      ? "bg-[#c9a34a] text-stone-950 shadow-md shadow-[#c9a34a]/30"
                      : "bg-black/60 text-[#eee8d9] border border-white/15"
                  }`}
                >
                  {getCategoryIcon(cat.icon, "w-2.5 h-2.5 sm:w-3 sm:h-3")}
                  <span>{cat.badge || "Menü"}</span>
                </span>

                <span className="text-[9px] sm:text-[10px] font-bold text-white/90 bg-black/50 backdrop-blur-md px-1.5 py-0.5 sm:px-2 rounded-full border border-white/10">
                  {count} Çeşit
                </span>
              </div>

              {/* Content bottom */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 z-10">
                <div className="flex items-end justify-between gap-1.5">
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-serif font-bold text-white leading-tight truncate ${
                        isTatlilar ? "text-base sm:text-2xl text-[#e2c875]" : "text-xs sm:text-base"
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-300 truncate font-normal mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 ${
                      isSelected
                        ? "bg-[#c9a34a] text-stone-950 font-bold"
                        : "bg-white/20 text-white group-hover:bg-white/30"
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Glowing border for Tatlılar (First Category Priority) */}
              {isTatlilar && (
                <div className="absolute inset-0 border border-[#c9a34a]/40 rounded-2xl pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
