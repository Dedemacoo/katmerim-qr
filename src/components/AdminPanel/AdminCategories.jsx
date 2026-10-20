import React, { useState } from "react";
import { useMenu } from "../../context/MenuContext";
import { getCategoryIcon } from "../../utils/iconMap";
import { 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Edit2, 
  Trash2, 
  Lock, 
  Sparkles, 
  X,
  Layers
} from "lucide-react";

export default function AdminCategories() {
  const { 
    categories, 
    products, 
    reorderCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    showToast 
  } = useMenu();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [newCat, setNewCat] = useState({
    name: "",
    subtitle: "",
    badge: "Yeni",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
  });

  const moveCategory = (index, direction) => {
    // Prevent moving anything above Tatlılar (index 0)
    if (index === 0 && direction === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    // Keep Tatlılar always at index 0 as requested by user
    if (targetIndex === 0) {
      showToast("Kural: 'Tatlılar' daima en başta yer almak zorundadır! 🌟", "info");
      return;
    }

    const updated = [...categories];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    reorderCategories(updated);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCat.name) return;
    const id = newCat.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + `-${Date.now()}`;
    addCategory({ ...newCat, id });
    setIsAddOpen(false);
    setNewCat({
      name: "",
      subtitle: "",
      badge: "Yeni",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    });
  };

  return (
    <div className="space-y-5">
      {/* Notice regarding Tatlılar priority */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Öncelik Kuralı:</strong> "Tatlılar" kategorisi müşterinin QR ekranında daima ilk sırada gösterilir.
          </span>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Kategori Ekle</span>
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-2.5">
        {categories.map((cat, index) => {
          const isTatlilar = cat.id === "tatlilar";
          const count = products.filter((p) => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                isTatlilar
                  ? "bg-amber-950/20 border-amber-500/40 shadow-md shadow-amber-950/20"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Drag / Index badge */}
                <div className="flex flex-col items-center justify-center">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isTatlilar
                        ? "bg-amber-500 text-stone-950"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Category Image Preview */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">
                      {getCategoryIcon(cat.icon, "w-4 h-4")}
                    </span>
                    <h4 className="text-sm font-bold text-white font-serif truncate">
                      {cat.name}
                    </h4>
                    {isTatlilar ? (
                      <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.2 rounded-full font-extrabold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Sabit Öncelik</span>
                      </span>
                    ) : (
                      cat.badge && (
                        <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.2 rounded-full font-medium">
                          {cat.badge}
                        </span>
                      )
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {cat.subtitle} • <span className="text-emerald-400 font-semibold">{count} Ürün</span>
                  </p>
                </div>
              </div>

              {/* Actions & Reordering */}
              <div className="flex items-center gap-1 shrink-0">
                {!isTatlilar && (
                  <>
                    <button
                      disabled={index <= 1}
                      onClick={() => moveCategory(index, -1)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                        index <= 1
                          ? "text-gray-600 cursor-not-allowed"
                          : "bg-white/5 hover:bg-white/10 text-gray-300"
                      }`}
                      title="Yukarı Taşı"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={index === categories.length - 1}
                      onClick={() => moveCategory(index, 1)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                        index === categories.length - 1
                          ? "text-gray-600 cursor-not-allowed"
                          : "bg-white/5 hover:bg-white/10 text-gray-300"
                      }`}
                      title="Aşağı Taşı"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setEditingCat(cat)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center transition"
                  title="Düzenle"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {!isTatlilar && (
                  <button
                    onClick={() => {
                      if (window.confirm(`"${cat.name}" kategorisini silmek istediğinize emin misiniz?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-950/40 text-gray-400 hover:text-red-400 flex items-center justify-center transition"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0e1713] border border-emerald-800/50 rounded-3xl p-5 z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-base font-bold font-serif text-white">Yeni Kategori Ekle</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Kategori Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Özel Menüler & Fırsatlar"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Alt Açıklama</label>
                <input
                  type="text"
                  placeholder="Örn: Günün spesiyalleri ve paylaşımlıklar"
                  value={newCat.subtitle}
                  onChange={(e) => setNewCat({ ...newCat, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Görsel URL</label>
                <input
                  type="url"
                  value={newCat.image}
                  onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingCat(null)} />
          <div className="relative w-full max-w-md bg-[#0e1713] border border-emerald-800/50 rounded-3xl p-5 z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-base font-bold font-serif text-white">Kategoriyi Düzenle</h3>
              <button onClick={() => setEditingCat(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateCategory(editingCat.id, {
                  name: editingCat.name,
                  subtitle: editingCat.subtitle,
                  badge: editingCat.badge,
                  image: editingCat.image,
                });
                setEditingCat(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Kategori Adı</label>
                <input
                  type="text"
                  required
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Alt Açıklama</label>
                <input
                  type="text"
                  value={editingCat.subtitle}
                  onChange={(e) => setEditingCat({ ...editingCat, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Görsel URL</label>
                <input
                  type="url"
                  value={editingCat.image}
                  onChange={(e) => setEditingCat({ ...editingCat, image: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
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
