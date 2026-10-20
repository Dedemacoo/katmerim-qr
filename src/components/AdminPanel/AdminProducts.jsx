import React, { useState } from "react";
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
  Filter,
  DollarSign,
  Image as ImageIcon
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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
    prepTime: "12-15 dk",
    calories: "450 kcal",
  });

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast("Lütfen ürün adı ve fiyatını girin!", "error");
      return;
    }

    const defaultImg = "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80";

    addProduct({
      name: formData.name,
      categoryId: formData.categoryId,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      description: formData.description || "Taze malzemelerle özenle hazırlanmıştır.",
      tag: formData.tag || null,
      image: formData.image || defaultImg,
      isPopular: formData.isPopular,
      prepTime: formData.prepTime,
      calories: formData.calories,
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
      prepTime: "12-15 dk",
      calories: "450 kcal",
    });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      categoryId: editingProduct.categoryId,
      price: Number(editingProduct.price),
      oldPrice: editingProduct.oldPrice ? Number(editingProduct.oldPrice) : null,
      description: editingProduct.description,
      tag: editingProduct.tag || null,
      image: editingProduct.image,
      isPopular: editingProduct.isPopular,
      prepTime: editingProduct.prepTime,
      calories: editingProduct.calories,
    });

    setEditingProduct(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Ürün adı ile ara..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#c9a34a]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#141714] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c9a34a]"
          >
            <option value="all" className="bg-[#0e1713]">Tüm Kategoriler ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0e1713]">
                {c.name} ({products.filter(p => p.categoryId === c.id).length})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a34a] to-[#a8822e] hover:from-[#e2c875] hover:to-[#c9a34a] text-stone-950 text-xs font-black transition shadow-lg shadow-black shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#09100d] border-b border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ürün</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Fiyat (₺)</th>
                <th className="py-3 px-4">Stok Durumu</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedProducts.map((p) => {
                const categoryObj = categories.find((c) => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{p.name}</span>
                            {p.tag && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                                {p.tag}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                            {p.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 text-gray-300 font-medium text-[11px]">
                        {categoryObj?.name || p.categoryId}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif font-bold text-emerald-400 text-sm">
                          {p.price} ₺
                        </span>
                        {p.oldPrice && (
                          <span className="text-[10px] text-gray-500 line-through">
                            {p.oldPrice} ₺
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductAvailability(p.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                          p.isAvailable
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900"
                            : "bg-red-950/80 text-red-300 border border-red-700/50 hover:bg-red-900"
                        }`}
                        title="Durumu değiştirmek için tıklayın"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isAvailable ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span>{p.isAvailable ? "Stokta Var" : "Tükendi"}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition"
                          title="Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`"${p.name}" ürününü silmek istediğinize emin misiniz?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-950/50 text-gray-400 hover:text-red-400 flex items-center justify-center transition"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 bg-[#09100d] border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              Toplam <strong className="text-white">{filteredProducts.length}</strong> üründen{" "}
              <strong className="text-[#c9a34a]">
                {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </strong>{" "}
              arası gösteriliyor
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  currentPage === 1
                    ? "text-gray-600 bg-white/[0.02] cursor-not-allowed"
                    : "text-gray-300 bg-white/5 hover:bg-white/10"
                }`}
              >
                Önceki
              </button>

              <span className="px-2 py-1 text-gray-400 font-bold">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  currentPage === totalPages
                    ? "text-gray-600 bg-white/[0.02] cursor-not-allowed"
                    : "text-gray-300 bg-white/5 hover:bg-white/10"
                }`}
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0e1713] border border-emerald-800/50 rounded-3xl p-5 z-10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold font-serif text-white">Yeni Ürün Ekle</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Ürün Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Fıstıklı Havuç Dilim Baklava"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Kategori *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0e1713] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Fiyat (₺) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Örn: 290"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">İndirimsiz Fiyat (Opsiyonel)</label>
                  <input
                    type="number"
                    placeholder="Örn: 340"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Öne Çıkan Etiket</label>
                  <input
                    type="text"
                    placeholder="Örn: Şefin İmzası, Yeni, Favori"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Görsel URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  placeholder="İçindekiler, servis detayı vb..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-950"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setEditingProduct(null)}
          />
          <div className="relative w-full max-w-lg bg-[#0e1713] border border-emerald-800/50 rounded-3xl p-5 z-10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold font-serif text-white">Ürünü Düzenle</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Ürün Adı</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Kategori</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0e1713] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">İndirimsiz Eski Fiyat</label>
                  <input
                    type="number"
                    value={editingProduct.oldPrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Öne Çıkan Etiket</label>
                  <input
                    type="text"
                    value={editingProduct.tag || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Görsel URL</label>
                <input
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-950"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
