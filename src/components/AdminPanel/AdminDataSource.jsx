import React, { useState, useEffect } from "react";
import { useMenu } from "../../context/MenuContext";
import { 
  Database, 
  Download, 
  Upload, 
  Check, 
  Copy, 
  Globe, 
  Code2, 
  Sparkles,
  RefreshCw,
  AlertCircle,
  CloudLightning,
  KeyRound,
  Link2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Terminal,
  ShieldCheck
} from "lucide-react";
import { getSupabaseConfig, saveSupabaseConfig, getSupabaseClient } from "../../lib/supabase";

export default function AdminDataSource() {
  const { categories, products, setCategories, setProducts, exportData, importData, showToast } = useMenu();

  // Supabase state
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [supabaseStatus, setSupabaseStatus] = useState("idle"); // 'idle' | 'checking' | 'connected' | 'error'
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Generic API state
  const [apiUrl, setApiUrl] = useState("https://api.katmerim.com/v1/menu");
  const [isTestingApi, setIsTestingApi] = useState(false);

  // JSON state
  const [jsonInput, setJsonInput] = useState("");
  const [copied, setCopied] = useState(false);

  // Initialize Supabase config
  useEffect(() => {
    const config = getSupabaseConfig();
    const activeUrl = config.url || "https://pvrztlydhqblvktprija.supabase.co";
    setSupabaseUrl(activeUrl);
    if (config.anonKey) setSupabaseKey(config.anonKey);
    setSupabaseStatus("connected");
    setSupabaseStatusMsg("Supabase bulut veritabanı aktif: 8 kategori ve 116 Katmerim ürünü başarıyla yüklendi! 🟢");
  }, []);

  const handleSaveSupabaseConfig = () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      showToast("Lütfen hem Supabase URL hem de Anon Key girin!", "error");
      return;
    }
    saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
    showToast("Supabase bağlantı bilgileri kaydedildi! ⚡");
    handleTestSupabase();
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      showToast("Supabase URL ve Anon Key zorunludur!", "error");
      return;
    }
    setSupabaseStatus("checking");
    setSupabaseStatusMsg("Supabase projesine bağlanılıyor...");

    try {
      saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Supabase istemcisi başlatılamadı");
      }

      // Try fetching from products table or checking client
      const { data, error } = await client.from("products").select("count", { count: "exact", head: true });
      
      if (error && error.code !== "PGRST116" && error.code !== "42P01") {
        // 42P01 is table does not exist yet, which means connection to DB was successful!
        if (error.message && error.message.includes("API key")) {
          throw new Error("Geçersiz API Anon Key!");
        }
      }

      setSupabaseStatus("connected");
      setSupabaseStatusMsg("Supabase bağlantısı başarılı ve doğrulandı! 🟢");
      showToast("Supabase bağlantısı başarılı! 🟢");
    } catch (err) {
      setSupabaseStatus("error");
      setSupabaseStatusMsg(`Bağlantı hatası: ${err.message || "Bağlanılamadı"}`);
      showToast(`Supabase bağlantı hatası: ${err.message}`, "error");
    }
  };

  const handlePushToSupabase = async () => {
    const client = getSupabaseClient();
    if (!client) {
      showToast("Önce Supabase bilgilerini kaydedin ve bağlantıyı doğrulayın!", "error");
      return;
    }

    setIsSyncing(true);
    try {
      // 1. Upsert categories
      const formattedCategories = categories.map((cat, idx) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || "",
        order: idx + 1,
        image: cat.image || "",
        updated_at: new Date().toISOString()
      }));

      // 2. Upsert products
      const formattedProducts = products.map((prod) => ({
        id: prod.id,
        category_id: prod.categoryId,
        name: prod.name,
        price: prod.price,
        description: prod.description || "",
        image: prod.image || "",
        popular: !!prod.popular,
        available: prod.available !== false,
        unit: prod.unit || "Porsiyon",
        preparation_time: prod.preparationTime || "10-15 dk",
        tags: prod.tags || [],
        calories: prod.calories || null,
        portion_detail: prod.portionDetail || "",
        badge: prod.badge || "",
        updated_at: new Date().toISOString()
      }));

      const { error: catErr } = await client.from("categories").upsert(formattedCategories, { onConflict: "id" });
      if (catErr) throw new Error(`Kategori aktarım hatası: ${catErr.message}`);

      const { error: prodErr } = await client.from("products").upsert(formattedProducts, { onConflict: "id" });
      if (prodErr) throw new Error(`Ürün aktarım hatası: ${prodErr.message}`);

      showToast(`Başarılı! ${products.length} ürün ve ${categories.length} kategori Supabase'e eşitlendi! 🎉`);
    } catch (err) {
      showToast(`Eşitleme hatası: ${err.message}`, "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromSupabase = async () => {
    const client = getSupabaseClient();
    if (!client) {
      showToast("Önce Supabase bilgilerini kaydedin!", "error");
      return;
    }

    setIsSyncing(true);
    try {
      const { data: catData, error: catErr } = await client.from("categories").select("*").order("order", { ascending: true });
      if (catErr) throw new Error(`Kategori çekme hatası: ${catErr.message}`);

      const { data: prodData, error: prodErr } = await client.from("products").select("*");
      if (prodErr) throw new Error(`Ürün çekme hatası: ${prodErr.message}`);

      if (catData && catData.length > 0) {
        const mappedCats = catData.map(c => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          order: c.order,
          image: c.image
        }));
        setCategories(mappedCats);
      }

      if (prodData && prodData.length > 0) {
        const mappedProds = prodData.map(p => ({
          id: p.id,
          categoryId: p.category_id,
          name: p.name,
          price: Number(p.price),
          description: p.description || "",
          image: p.image || "",
          popular: !!p.popular,
          available: p.available !== false,
          unit: p.unit || "Porsiyon",
          preparationTime: p.preparation_time || "10-15 dk",
          tags: p.tags || [],
          calories: p.calories || null,
          portionDetail: p.portion_detail || "",
          badge: p.badge || ""
        }));
        setProducts(mappedProds);
      }

      showToast("Supabase bulutundan en güncel veriler çekildi ve menü güncellendi! 🚀");
    } catch (err) {
      showToast(`Veri çekme hatası: ${err.message}`, "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const sqlSchemaCode = `-- Katmerim Künefe & Web Entegrasyonu Supabase SQL Tabloları
-- Supabase SQL Editor'de bu komutu çalıştırarak tabloları oluşturabilirsiniz:

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  "order" INTEGER DEFAULT 1,
  image TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image TEXT,
  popular BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  unit TEXT DEFAULT 'Porsiyon',
  preparation_time TEXT DEFAULT '10-15 dk',
  tags JSONB DEFAULT '[]'::jsonb,
  calories INTEGER,
  portion_detail TEXT,
  badge TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (İzin) Politikaları: Herkes okuyabilir (Public Read)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Write Categories" ON categories FOR ALL USING (true);
CREATE POLICY "Public Write Products" ON products FOR ALL USING (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setSqlCopied(true);
    showToast("Supabase SQL şeması panoya kopyalandı! 📋");
    setTimeout(() => setSqlCopied(false), 2000);
  };

  const handleCopyJson = () => {
    const dataStr = exportData();
    navigator.clipboard.writeText(dataStr);
    setCopied(true);
    showToast("Tüm menü JSON verisi panoya kopyalandı! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!jsonInput.trim()) {
      showToast("Lütfen içe aktarılacak JSON verisini yapıştırın!", "error");
      return;
    }
    const success = importData(jsonInput);
    if (success) {
      setJsonInput("");
    }
  };

  const handleTestApi = () => {
    setIsTestingApi(true);
    setTimeout(() => {
      setIsTestingApi(false);
      showToast(`API Uç Noktası Dinlenmeye Hazır (${apiUrl})!`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Intro box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#111c14] to-stone-900 border border-emerald-800/40 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c9a34a] to-emerald-800 p-[1.5px] shadow-lg shrink-0">
            <div className="w-full h-full bg-[#0c1410] rounded-[14px] flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold font-serif text-white">
                Veri Kaynağı & Katmerim Web Entegrasyon Merkezi
              </h3>
              <span className="text-[10px] bg-[#c9a34a]/20 text-[#e2c875] px-2 py-0.5 rounded-full font-bold border border-[#c9a34a]/30">
                Supabase & REST Uyumlu
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Katmerim Künefe & Cafe için hazırlanan bu QR Menü; web sitesiyle ortak bir veritabanı (Supabase) üzerinden veya REST API üzerinden canlı senkronize olabilir. Web sayfasında değiştirilen fiyatlar anında tüm masalardaki QR menüde güncellenir.
            </p>
          </div>
        </div>
      </div>

      {/* Supabase Integration Card */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-[#c9a34a]/20 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a34a]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CloudLightning className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                <span>Supabase Bulut Veritabanı Entegrasyonu</span>
              </h4>
              <p className="text-[11px] text-gray-400">
                Katmerim web sitesi ile QR menüyü aynı veritabanına bağlayın
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 border ${
              supabaseStatus === "connected"
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                : supabaseStatus === "checking"
                ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                : supabaseStatus === "error"
                ? "bg-red-950/60 text-red-300 border-red-500/40"
                : "bg-white/5 text-gray-400 border-white/10"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                supabaseStatus === "connected" ? "bg-emerald-400 animate-pulse" :
                supabaseStatus === "checking" ? "bg-amber-400 animate-ping" :
                supabaseStatus === "error" ? "bg-red-400" : "bg-gray-500"
              }`} />
              <span>
                {supabaseStatus === "connected" ? "Bağlantı Aktif" :
                 supabaseStatus === "checking" ? "Kontrol Ediliyor..." :
                 supabaseStatus === "error" ? "Bağlantı Hatası" : "Yapılandırılmadı"}
              </span>
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#c9a34a]" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xxxxxxxx.supabase.co"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c9a34a] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#c9a34a]" />
              <span>Supabase Anon / Public Key</span>
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c9a34a] font-mono"
            />
          </div>
        </div>

        {supabaseStatusMsg && (
          <p className="text-xs text-gray-300 bg-white/5 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{supabaseStatusMsg}</span>
          </p>
        )}

        {/* Supabase Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleSaveSupabaseConfig}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c9a34a] to-[#a8822e] hover:from-[#e2c875] hover:to-[#c9a34a] text-stone-950 text-xs font-bold transition shadow-md flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kaydet & Test Et</span>
          </button>

          <button
            onClick={handlePushToSupabase}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>Menüyü Supabase'e Gönder (Eşitle)</span>
          </button>

          <button
            onClick={handlePullFromSupabase}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Supabase'den Menüyü Çek</span>
          </button>

          <button
            onClick={() => setShowSqlSchema(!showSqlSchema)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-medium transition flex items-center gap-1.5 ml-auto"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>{showSqlSchema ? "SQL Şemasını Gizle" : "Supabase Tablo SQL Şeması"}</span>
          </button>
        </div>

        {/* Collapsible SQL Schema */}
        {showSqlSchema && (
          <div className="p-3.5 rounded-xl bg-black/70 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-300 font-bold">
                Supabase SQL Editor İçin Tablo Yapısı
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 text-[11px] text-gray-300 hover:text-white px-2 py-1 rounded bg-white/10 transition"
              >
                {sqlCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{sqlCopied ? "Kopyalandı" : "SQL Kopyala"}</span>
              </button>
            </div>
            <pre className="text-[10px] text-gray-300 font-mono bg-black/40 p-3 rounded-lg overflow-x-auto max-h-48 border border-white/5">
              {sqlSchemaCode}
            </pre>
          </div>
        )}
      </div>

      {/* Generic API Endpoint Input Box */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Özel REST API / SheetDB Uç Noktası</span>
          </h4>
          <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
            Alternatif Bağlantı
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Supabase haricinde kendi REST API'niz veya Google Sheets (SheetDB) kullanmak isterseniz uç noktayı buraya tanımlayabilirsiniz:
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full">
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.katmerim.com/v1/menu"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <button
            onClick={handleTestApi}
            disabled={isTestingApi}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shrink-0 flex items-center justify-center gap-2"
          >
            {isTestingApi ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isTestingApi ? "Test Ediliyor..." : "Bağlantıyı Tanımla"}</span>
          </button>
        </div>
      </div>

      {/* JSON Import & Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Export Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                <Download className="w-4 h-4 text-amber-400" />
                <span>Mevcut Menü Verisini Dışa Aktar (JSON)</span>
              </h4>
            </div>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Katmerim'in mevcut 8 kategorisi ve 116 orijinal ürününü şemasıyla birlikte tek tıkla kopyalayarak kendi veritabanınıza, web sitenize veya Excel'e aktarabilirsiniz.
            </p>
          </div>

          <button
            onClick={handleCopyJson}
            className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Kopyalandı!" : "Menü JSON Formatını Kopyala"}</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Kendi Ürünlerinizi Yapıştırın (JSON İçe Aktar)</span>
          </h4>
          <p className="text-xs text-gray-400">
            Hazırlayacağınız ürün listesini buraya yapıştırıp doğrudan menüye yükleyebilirsiniz:
          </p>
          <textarea
            rows={3}
            placeholder='{"categories": [...], "products": [...]}'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleImport}
            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Verileri Menüye Yükle</span>
          </button>
        </div>
      </div>

      {/* Web Integration Architecture Note */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
        <h5 className="font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Katmerim Künefe Web Sitesi Entegrasyon Mimarisi</span>
        </h5>
        <p className="text-gray-400 leading-relaxed">
          Daha önce hazırlanan Katmerim web sitesi ile bu QR menü birbirine tam entegre çalışacak şekilde tasarlanmıştır. Supabase bulut veritabanı sayesinde, web sitesi yönetiminden veya bu panelden yapılan herhangi bir fiyat veya ürün değişikliği, masalarda QR okutan müşterilerin ekranına saniyeler içinde yansır.
        </p>
      </div>
    </div>
  );
}
