import React, { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { Clock, Flame, Sparkles, ChevronRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product, index }) {
  const { setSelectedProduct } = useMenu();
  const [imgError, setImgError] = useState(false);

  // Fallback high quality dessert image if url fails
  const fallbackImg = "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3, delay: (index % 6) * 0.03 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => setSelectedProduct(product)}
      className={`group relative flex flex-col justify-between rounded-2xl overflow-hidden bg-[#121412] border border-white/10 hover:border-[#c9a34a]/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#c9a34a]/15 ${
        !product.isAvailable ? "opacity-60 grayscale-[40%]" : ""
      }`}
    >
      <div>
        {/* Product Image Container - Bright, vibrant, 100% visible (NO darkening gradient!) */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#181d18] flex items-center justify-center p-2">
          <img
            src={imgError ? fallbackImg : product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges - Top left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {product.tag && (
              <span className="inline-flex items-center gap-1 bg-[#c9a34a] text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{product.tag}</span>
              </span>
            )}
            {product.isPopular && !product.tag && (
              <span className="inline-flex items-center gap-1 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                <Flame className="w-2.5 h-2.5" />
                <span>Popüler</span>
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="inline-flex items-center gap-1.5 bg-red-950 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-500/40 shadow-lg">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Tükendi</span>
              </span>
            </div>
          )}

          {/* Prep time badge */}
          {product.prepTime && product.isAvailable && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-200 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 font-medium">
                <Clock className="w-2.5 h-2.5 text-[#c9a34a]" />
                <span>{product.prepTime}</span>
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-[#e2c875] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer: Price & Inspect Button (NO Cart Order button!) */}
      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-2 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-extrabold text-[#c9a34a] font-serif">
            {product.price} ₺
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-500 line-through">
              {product.oldPrice} ₺
            </span>
          )}
        </div>

        {/* Inspect / View Details Button */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1d221d] group-hover:bg-[#c9a34a] text-[#e2c875] group-hover:text-stone-950 text-xs font-bold transition-all border border-[#c9a34a]/30">
          <span>İncele</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.div>
  );
}
