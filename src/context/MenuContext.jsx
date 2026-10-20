import React, { createContext, useContext, useState, useEffect } from "react";
import { initialCategories, initialProducts, initialCafeInfo } from "../data/initialData";

const MenuContext = createContext(null);

const STORAGE_KEY_CATEGORIES = "katmerim_categories_v2";
const STORAGE_KEY_PRODUCTS = "katmerim_products_v2";
const STORAGE_KEY_CAFE = "katmerim_cafe_info_v2";
const STORAGE_KEY_CART = "katmerim_cart_v2";

export function MenuProvider({ children }) {
  // Load data from localStorage or fallback
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [cafeInfo, setCafeInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAFE);
      return saved ? JSON.parse(saved) : initialCafeInfo;
    } catch {
      return initialCafeInfo;
    }
  });

  // Table number from URL query parameter (e.g. ?masa=4) or default 4
  const [tableNumber, setTableNumber] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const masa = params.get("masa");
      return masa ? parseInt(masa, 10) : 4;
    } catch {
      return 4;
    }
  });

  // Navigation and active states
  // User specifically requested: "öncelik kategorileme olmalı qr açılınca hemen ürün çıkması yerine önce kategoriler çıkmalı sol üstte tatlıalr-kahveler-soğuk içecekler vs vs diye gider ama en önde tatlılar olmak zorunda"
  // Default active category is 'tatlilar'
  const [activeCategory, setActiveCategory] = useState("tatlilar");
  const [showCategoryGridFirst, setShowCategoryGridFirst] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  // Admin Mode & Authentication
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true" || window.location.hash === "#admin") {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem("katmerim_admin_auth") === "true";
    } catch {
      return false;
    }
  });

  const [adminTab, setAdminTab] = useState("dashboard"); // 'dashboard' | 'products' | 'categories' | 'datasource' | 'settings'

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#admin") {
        setIsAdminMode(true);
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const loginAdmin = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem("katmerim_admin_auth", "true");
    } catch {}
    showToast("Yönetici girişi başarılı! Hoş geldiniz.");
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
    try {
      sessionStorage.removeItem("katmerim_admin_auth");
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      url.hash = "";
      window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ""));
    } catch {}
    showToast("Yönetim panelinden güvenle çıkış yapıldı.");
  };

  // Notification toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CAFE, JSON.stringify(cafeInfo));
  }, [cafeInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  // Cart actions
  const addToCart = (product, portion = null, extras = [], note = "", quantity = 1) => {
    const portionPrice = portion ? portion.priceAdd : 0;
    const extrasPrice = extras.reduce((sum, item) => sum + item.price, 0);
    const unitPrice = product.price + portionPrice + extrasPrice;

    const cartItemId = `${product.id}-${portion?.name || "std"}-${extras.map(e => e.name).sort().join("|")}-${note}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          unitPrice,
          portionName: portion?.name || null,
          extras,
          note,
          quantity,
          image: product.image,
        },
      ];
    });

    showToast(`"${product.name}" masanıza eklendi! ✨`);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = cartItemId => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Admin Product Actions
  const addProduct = newProd => {
    const id = `prod-${Date.now()}`;
    setProducts(prev => [
      {
        id,
        prepTime: "10-15 dk",
        calories: "300 kcal",
        portions: [{ name: "Standart", priceAdd: 0 }],
        extras: [],
        allergens: [],
        isAvailable: true,
        ...newProd,
      },
      ...prev,
    ]);
    showToast("Yeni ürün başarıyla eklendi! 🎉");
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast("Ürün güncellendi.");
  };

  const deleteProduct = id => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Ürün menüden kaldırıldı.");
  };

  const toggleProductAvailability = id => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
    const prod = products.find(p => p.id === id);
    showToast(
      prod?.isAvailable ? "Ürün 'Tükendi' olarak işaretlendi." : "Ürün tekrar stokta!",
      "info"
    );
  };

  // Admin Category Actions
  const addCategory = newCat => {
    const id = newCat.id || `cat-${Date.now()}`;
    setCategories(prev => [...prev, { ...newCat, id }]);
    showToast("Yeni kategori eklendi.");
  };

  const updateCategory = (id, fields) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...fields } : c))
    );
    showToast("Kategori güncellendi.");
  };

  const deleteCategory = id => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast("Kategori silindi.");
  };

  const reorderCategories = newCategories => {
    setCategories(newCategories);
  };

  const updateCafeInfo = fields => {
    setCafeInfo(prev => ({ ...prev, ...fields }));
    showToast("Kafe bilgileri güncellendi.");
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    setCategories(initialCategories);
    setProducts(initialProducts);
    setCafeInfo(initialCafeInfo);
    setCart([]);
    showToast("Tüm menü orijinal ayarlarına sıfırlandı!");
  };

  // Import / Export Data for seamless external API/JSON integration
  const exportData = () => {
    return JSON.stringify(
      {
        version: "1.0",
        cafeInfo,
        categories,
        products,
      },
      null,
      2
    );
  };

  const importData = jsonString => {
    try {
      const data = JSON.parse(jsonString);
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
      if (data.cafeInfo) {
        setCafeInfo(data.cafeInfo);
      }
      showToast("Menü verileri başarıyla aktarıldı! 🚀");
      return true;
    } catch (err) {
      showToast("Geçersiz JSON formatı!", "error");
      return false;
    }
  };

  return (
    <MenuContext.Provider
      value={{
        categories,
        products,
        cafeInfo,
        activeCategory,
        setActiveCategory,
        showCategoryGridFirst,
        setShowCategoryGridFirst,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        tableNumber,
        setTableNumber,
        isCartOpen,
        setIsCartOpen,
        isCallWaiterOpen,
        setIsCallWaiterOpen,
        isWifiModalOpen,
        setIsWifiModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        isTableModalOpen,
        setIsTableModalOpen,
        isAdminMode,
        setIsAdminMode,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        adminTab,
        setAdminTab,
        toast,
        showToast,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        updateCafeInfo,
        resetToDefaults,
        exportData,
        importData,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
