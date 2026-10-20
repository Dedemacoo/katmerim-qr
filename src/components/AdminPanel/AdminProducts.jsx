import React, { useState, useRef } from "react";
import { useMenu } from "../../context/MenuContext";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Sparkles,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Layers,
  Camera,
  RotateCcw,
  Eye,
  DollarSign
} from "lucide-react";

export default function AdminProducts() {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductAvailability,
    showToast 
  } = useMenu();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Pagination & Display settings
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); // 15, 30, 50, or 'all'

  // Image Upload helper state for Add Modal
  const [addImageSourceType, setAddImageSourceType] = useState("upload"); // 'upload' | 'url'
  const addFileInputRef = useRef(null);

  // Image Upload helper state for Edit Modal
  const [editImageSourceType, setEditImageSourceType] = useState("upload"); // 'upload' | 'url'
  const editFileInputRef = useRef(null);

  // New product form state
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "tatlilar",
    price: "",
    oldPrice: "",
    description: "",
    tag: "",
    image: "",
    isPopular: false,
    prepTime: "10-15 dk",
    calories: "450 kcal",
  });

  // Client-side image compression
  const compressImage = (file, callback) => {
    if (!file || !file.type.startsWith("image/")) {
      showToast("Lütfen geçerli bir görsel dosyası (JPG, PNG, WEBP) seçin!", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG
        const dataUrl = canvas.toDataURL("image/webp", 0.85);
        callback(dataUrl);
        showToast("Görsel başarıyla yüklendi ve optimize edildi! 📸");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Calculate pagination
  const perPage = itemsPerPage === "all" ? filteredProducts.length || 1 : Number(itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / perPage) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedProducts = itemsPerPage === "all"
    ? filteredProducts
    : filteredProducts.slice(
        (safeCurrentPage - 1) * perPage,
        safeCurrentPage * perPage
      );

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast("Lütfen ürün adı ve fiyatını girin!", "error");
      return;
    }

    const defaultImg = "https://katmerim.com/logo.png";

    addProduct({
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      description: formData.description.trim() || "Özel tarifimizle taze hazırlanır.",
      tag: formData.tag.trim() || null,
      image: formData.image || defaultImg,
      isPopular: formData.isPopular,
      prepTime: formData.prepTime || "10-15 dk",
      calories: formData.calories || "",
    });

    setIsAddModalOpen(false);
    setFormData({
      name: "",
      categoryId: "tatlilar",
      price: "",
      oldPrice: "",
      description: "",
      tag: "",
      image: "",
      isPopular: false,
      prepTime: "10-15 dk",
      calories: "450 kcal",
    });
    showToast(`"${formData.name}" menüye başarıyla eklendi! 🎉`);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name.trim(),
      categoryId: editingProduct.categoryId,
      price: Number(editingProduct.price),
      oldPrice: editingProduct.oldPrice ? Number(editingProduct.oldPrice) : null,
      description: editingProduct.description || "",
      tag: editingProduct.tag || null,
      image: editingProduct.image,
      isPopular: editingProduct.isPopular,
      prepTime: editingProduct.prepTime || "10-15 dk",
      calories: editingProduct.calories || "",
    });

    setEditingProduct(null);
    showToast(`"${editingProduct.name}" bilgileri güncellendi! ✅`);
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#111c14] to-stone-900 border border-emerald-800/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#c9a34a] block mb-1">
            Katmerim Menü Yönetimi
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
            <span>Ürünler & Fiyat Listesi</span>
            <span className="text-xs bg-[#c9a34a]/20 text-[#e2c875] px-2.5 py-0.5 rounded-full border border-[#c9a34a]/30 font-sans font-bold">
              {products.length} Toplam Ürün
            </span>
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Tüm tatlı ve içeceklerin fiyatlarını, görsellerini, açıklamalarını ve kategorilerini buradan kolayca güncelleyebilirsiniz.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a34a] to-[#a8822e] hover:from-[#e2c875] hover:to-[#c9a34a] text-stone-950 text-xs font-black transition shadow-lg shadow-[#c9a34a]/20 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* CATEGORY SWITCHING BAR - Açık, Anlaşılır ve Tek Tıkla Geçişli */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#c9a34a]" />
            <span>Kategori Seçimi & Filtreleme</span>
          </label>
          <span className="text-[11px] text-gray-400">
            Kategoriye tıklayarak ürünleri anında filtreleyebilirsiniz
          </span>
        </div>

        {/* Horizontal Category Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {/* All Categories Pill */}
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border ${
              selectedCategory === "all"
                ? "bg-[#c9a34a] text-stone-950 border-amber-300 shadow-md shadow-[#c9a34a]/30"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5"
            }`}
          >
            <span>Tüm Ürünler</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedCategory === "all" ? "bg-black/20 text-stone-950" : "bg-white/10 text-gray-400"
            }`}>
              {products.length}
            </span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCategorySelect(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? "bg-[#c9a34a] text-stone-950 border-amber-300 shadow-md shadow-[#c9a34a]/30"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5"
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? "bg-black/20 text-stone-950" : "bg-white/10 text-gray-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter, Search & Display Controls Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Ürün adı veya açıklamayla ara..."
            className="w-full pl-10 pr-9 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a34a]"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Current Active Category Indicator & Per Page Selector */}
        <div className="flex items-center gap-3 text-xs justify-between md:justify-end">
          <div className="text-gray-400 flex items-center gap-1.5">
            <span>Listelenen:</span>
            <strong className="text-white">
              {filteredProducts.length} Ürün
            </strong>
            {selectedCategory !== "all" && (
              <span className="text-[#c9a34a] font-medium">
                ({activeCategoryObj?.name})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
            <span className="text-gray-400 hidden sm:inline">Sayfa Başı:</span>
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5">
              {[15, 30, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setItemsPerPage(num);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    itemsPerPage === num
                      ? "bg-[#c9a34a] text-stone-950"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setItemsPerPage("all");
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  itemsPerPage === "all"
                    ? "bg-[#c9a34a] text-stone-950"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Tümü
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#09100d] border-b border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Görsel & Ürün Adı</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Fiyat</th>
                <th className="py-3 px-4">Stok Durumu</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-500/60 mx-auto" />
                    <p className="font-semibold text-white">Eşleşen ürün bulunamadı</p>
                    <p className="text-xs text-gray-500">
                      Arama terimini değiştirebilir veya kategoriyi "Tümü" olarak seçebilirsiniz.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSearch("");
                        setCurrentPage(1);
                      }}
                      className="mt-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                    >
                      Filtreleri Temizle
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const categoryObj = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition group">
                      {/* Product Thumbnail & Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => setEditingProduct(p)}
                            className="relative w-12 h-12 rounded-xl bg-[#141714] border border-white/10 overflow-hidden shrink-0 cursor-pointer group-hover:border-[#c9a34a]/50 transition flex items-center justify-center"
                            title="Fotoğrafı değiştirmek için tıklayın"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                e.target.src = "https://katmerim.com/logo.png";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                              <Camera className="w-4 h-4 text-amber-300" />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span 
                                onClick={() => setEditingProduct(p)}
                                className="font-bold text-white text-sm hover:text-[#c9a34a] cursor-pointer transition"
                              >
                                {p.name}
                              </span>
                              {p.tag && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                                  {p.tag}
                                </span>
                              )}
                              {p.isPopular && (
                                <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded font-bold border border-red-500/30">
                                  Popüler
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                              {p.description || "Açıklama belirtilmemiş"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Pill */}
                      <td className="py-3 px-4">
                        <span 
                          onClick={() => handleCategorySelect(p.categoryId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#c9a34a]/15 text-gray-300 hover:text-[#e2c875] border border-white/5 font-semibold text-[11px] cursor-pointer transition"
                          title="Bu kategorideki tüm ürünleri listele"
                        >
                          <Layers className="w-3 h-3 text-[#c9a34a]" />
                          <span>{categoryObj?.name || p.categoryId}</span>
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif font-black text-emerald-400 text-sm">
                            {p.price} ₺
                          </span>
                          {p.oldPrice && (
                            <span className="text-[10px] text-gray-500 line-through">
                              {p.oldPrice} ₺
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Toggle Button */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleProductAvailability(p.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition border ${
                            p.isAvailable
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900"
                              : "bg-red-950/80 text-red-300 border-red-500/40 hover:bg-red-900"
                          }`}
                          title="Stok durumunu değiştirmek için tıklayın"
                        >
                          <span className={`w-2 h-2 rounded-full ${p.isAvailable ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                          <span>{p.isAvailable ? "Stokta Var" : "Tükendi"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#c9a34a]/20 text-gray-300 hover:text-[#e2c875] border border-white/5 hover:border-[#c9a34a]/30 transition text-xs font-semibold"
                            title="Ürünü Düzenle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Düzenle</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`"${p.name}" ürününü menüden silmek istediğinize emin misiniz?`)) {
                                deleteProduct(p.id);
                                showToast(`"${p.name}" silindi.`);
                              }
                            }}
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 flex items-center justify-center transition"
                            title="Ürünü Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ULTRA-CLEAR PAGINATION BAR */}
        {totalPages > 1 && itemsPerPage !== "all" && (
          <div className="p-4 bg-[#09100d] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Info text */}
            <div className="text-gray-400 text-center sm:text-left">
              Toplam <strong className="text-white">{filteredProducts.length}</strong> üründen{" "}
              <strong className="text-[#c9a34a]">
                {(safeCurrentPage - 1) * perPage + 1} -{" "}
                {Math.min(safeCurrentPage * perPage, filteredProducts.length)}
              </strong>{" "}
              arası gösteriliyor
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition border ${
                  safeCurrentPage === 1
                    ? "text-gray-600 bg-white/[0.01] border-white/5 cursor-not-allowed"
                    : "text-gray-200 bg-white/5 hover:bg-white/10 border-white/10 active:scale-95"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Önceki Sayfa</span>
              </button>

              {/* Page Number Chips */}
              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first, last, and around current page
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - safeCurrentPage) <= 1
                    );
                  })
                  .map((page, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const hasGap = prevPage && page - prevPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {hasGap && <span className="text-gray-600 px-1">...</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                            safeCurrentPage === page
                              ? "bg-[#c9a34a] text-stone-950 shadow-md shadow-[#c9a34a]/30"
                              : "bg-white/5 hover:bg-white/10 text-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition border ${
                  safeCurrentPage === totalPages
                    ? "text-gray-600 bg-white/[0.01] border-white/5 cursor-not-allowed"
                    : "text-gray-200 bg-white/5 hover:bg-white/10 border-white/10 active:scale-95"
                }`}
              >
                <span>Sonraki Sayfa</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD NEW PRODUCT MODAL WITH FILE UPLOAD & CATEGORY SELECTION */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0e1713] border border-[#c9a34a]/40 rounded-3xl p-5 sm:p-6 z-10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#c9a34a]/15 text-[#e2c875] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-serif text-white">Yeni Ürün Ekle</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block text-gray-300 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Havuç Dilim Baklava"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a34a]"
                />
              </div>

              {/* Category & Price Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#c9a34a]" />
                    <span>Kategori Seçimi *</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141714] border border-white/10 rounded-xl text-white font-semibold focus:outline-none focus:border-[#c9a34a]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0e1713]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Fiyat (₺) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Örn: 290"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-[#c9a34a]"
                  />
                </div>
              </div>

              {/* GÖRSEL YÜKLEME ALANI (FILE UPLOAD & URL TOGGLE) */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#c9a34a]" />
                    <span>Ürün Görseli</span>
                  </label>
                  {/* Mode switch: Dosya Yükle vs URL */}
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setAddImageSourceType("upload")}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                        addImageSourceType === "upload"
                          ? "bg-[#c9a34a] text-stone-950"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Dosyadan Yükle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddImageSourceType("url")}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                        addImageSourceType === "url"
                          ? "bg-[#c9a34a] text-stone-950"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Web Linki</span>
                    </button>
                  </div>
                </div>

                {/* Upload Section */}
                {addImageSourceType === "upload" ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={addFileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          compressImage(file, (dataUrl) => {
                            setFormData({ ...formData, image: dataUrl });
                          });
                        }
                      }}
                      className="hidden"
                    />

                    {formData.image ? (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <img
                          src={formData.image}
                          alt="Önizleme"
                          className="w-16 h-16 rounded-xl object-contain bg-[#121412] border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-emerald-400 font-bold block text-xs">
                            ✓ Fotoğraf Başarıyla Seçildi
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate">
                            Optimize edildi, anında yüklenecektir.
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => addFileInputRef.current?.click()}
                              className="text-[11px] text-[#c9a34a] hover:underline font-semibold"
                            >
                              Başka Fotoğraf Seç
                            </button>
                            <span className="text-gray-600">•</span>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, image: "" })}
                              className="text-[11px] text-red-400 hover:underline font-semibold"
                            >
                              Kaldır
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => addFileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/15 hover:border-[#c9a34a]/60 rounded-2xl p-4 text-center cursor-pointer transition bg-white/[0.01] hover:bg-white/[0.03]"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#c9a34a]/10 text-[#c9a34a] flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-white">
                          Cihazınızdan Fotoğraf Seçin
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Telefonda galeriden veya bilgisayarınızdan dosya yükleyin
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://katmerim.com/images/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#c9a34a] font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Old Price & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">
                    Eski / İndirimsiz Fiyat (Opsiyonel)
                  </label>
                  <input
                    type="number"
                    placeholder="Örn: 350"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9a34a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">
                    Öne Çıkan Etiket (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Şefin İmzası, Yeni, Çok Satan"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9a34a]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Ürün Açıklaması</label>
                <textarea
                  rows={2}
                  placeholder="İçindekiler, servis detayı ve sunum hakkında..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9a34a]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-semibold transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#c9a34a] to-[#a8822e] hover:from-[#e2c875] hover:to-[#c9a34a] text-stone-950 rounded-xl font-black shadow-lg transition active:scale-95"
                >
                  Ürünü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PRODUCT MODAL WITH FILE UPLOAD & PROMINENT CATEGORY SELECTOR */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setEditingProduct(null)}
          />
          <div className="relative w-full max-w-lg bg-[#0e1713] border border-[#c9a34a]/40 rounded-3xl p-5 sm:p-6 z-10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#c9a34a]/15 text-[#e2c875] flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-white">Ürünü Düzenle</h3>
                  <span className="text-[11px] text-gray-400">
                    Fiyat, kategori ve fotoğrafı anında güncelleyin
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block text-gray-300 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-[#c9a34a]"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PROMINENT CATEGORY CHANGER */}
                <div>
                  <label className="block text-gray-300 font-bold mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#c9a34a]" />
                    <span>Kategori Değiştir *</span>
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141714] border border-[#c9a34a]/40 rounded-xl text-white font-bold focus:outline-none focus:border-[#c9a34a]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0e1713]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-gray-300 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Fiyat (₺) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-emerald-400 font-serif font-black text-sm focus:outline-none focus:border-[#c9a34a]"
                  />
                </div>
              </div>

              {/* GÖRSEL YÜKLEME & DEĞİŞTİRME BÖLÜMÜ */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#c9a34a]" />
                    <span>Görseli Değiştir</span>
                  </label>
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setEditImageSourceType("upload")}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                        editImageSourceType === "upload"
                          ? "bg-[#c9a34a] text-stone-950"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Cihazdan Seç</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditImageSourceType("url")}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                        editImageSourceType === "url"
                          ? "bg-[#c9a34a] text-stone-950"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Link ile</span>
                    </button>
                  </div>
                </div>

                {/* Edit Upload Section */}
                {editImageSourceType === "upload" ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          compressImage(file, (dataUrl) => {
                            setEditingProduct({ ...editingProduct, image: dataUrl });
                          });
                        }
                      }}
                      className="hidden"
                    />

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <img
                        src={editingProduct.image}
                        alt={editingProduct.name}
                        className="w-16 h-16 rounded-xl object-contain bg-[#121412] border border-white/10 shrink-0"
                        onError={(e) => {
                          e.target.src = "https://katmerim.com/logo.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-bold block text-xs">
                          Mevcut Ürün Görseli
                        </span>
                        <p className="text-[10px] text-gray-400">
                          Yeni bir fotoğraf yüklemek için aşağıdaki butona basın:
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#c9a34a] hover:bg-[#d8b257] text-stone-950 font-bold text-[11px] transition shadow-sm"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Yeni Fotoğraf Yükle</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#c9a34a] font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Old Price & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">
                    İndirimsiz Eski Fiyat
                  </label>
                  <input
                    type="number"
                    value={editingProduct.oldPrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9a34a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">
                    Öne Çıkan Etiket
                  </label>
                  <input
                    type="text"
                    value={editingProduct.tag || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9a34a]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9a34a]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-semibold transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#c9a34a] to-[#a8822e] hover:from-[#e2c875] hover:to-[#c9a34a] text-stone-950 rounded-xl font-black shadow-lg transition active:scale-95"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
