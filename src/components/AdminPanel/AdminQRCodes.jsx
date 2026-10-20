import React, { useState, useEffect } from "react";
import { useMenu } from "../../context/MenuContext";
import { QRCodeSVG } from "qrcode.react";
import { 
  Printer, 
  Download, 
  Sparkles, 
  QrCode, 
  ExternalLink, 
  Plus, 
  Trash2, 
  RotateCcw,
  Layers,
  Check,
  Sliders,
  FileText
} from "lucide-react";

const STORAGE_KEY_TABLES = "katmerim_admin_tables_v1";

const DEFAULT_TABLES = [
  "1", "2", "3", "4", "5", "6", "7", "8",
  "9", "10", "11", "12", "13", "14", "15", "16"
];

export default function AdminQRCodes() {
  const { cafeInfo, showToast } = useMenu();

  // Load custom tables from localStorage or fallback
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TABLES);
      return saved ? JSON.parse(saved) : DEFAULT_TABLES;
    } catch {
      return DEFAULT_TABLES;
    }
  });

  const [selectedTable, setSelectedTable] = useState(() => tables[0] || "1");
  const [newTableInput, setNewTableInput] = useState("");
  const [batchCount, setBatchCount] = useState(20);
  const [printMode, setPrintMode] = useState("single"); // 'single' | 'all'

  const [baseUrl, setBaseUrl] = useState(() => {
    try {
      return window.location.origin;
    } catch {
      return "http://localhost:5173";
    }
  });

  // Save tables whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(tables));
    } catch {}
  }, [tables]);

  // Current selected table URL
  const selectedFullUrl = `${baseUrl}/?masa=${encodeURIComponent(selectedTable)}`;

  // Add a single table
  const handleAddTable = (e) => {
    e?.preventDefault();
    const val = newTableInput.trim();
    if (!val) {
      showToast("Lütfen bir masa numarası veya adı girin!", "error");
      return;
    }
    if (tables.includes(val)) {
      showToast(`'Masa ${val}' zaten listede mevcut!`, "error");
      return;
    }
    const updated = [...tables, val];
    setTables(updated);
    setSelectedTable(val);
    setNewTableInput("");
    showToast(`Masa ${val} başarıyla eklendi! ✨`);
  };

  // Remove a table
  const handleDeleteTable = (t, e) => {
    e?.stopPropagation();
    if (tables.length <= 1) {
      showToast("En az bir masa kalmalıdır!", "error");
      return;
    }
    const updated = tables.filter((item) => item !== t);
    setTables(updated);
    if (selectedTable === t) {
      setSelectedTable(updated[0] || "1");
    }
    showToast(`Masa ${t} silindi.`);
  };

  // Batch generate (e.g. 1 to N)
  const handleBatchGenerate = () => {
    const count = parseInt(batchCount, 10);
    if (isNaN(count) || count < 1 || count > 100) {
      showToast("Lütfen 1 ile 100 arasında bir masa sayısı girin!", "error");
      return;
    }
    const generated = Array.from({ length: count }, (_, i) => String(i + 1));
    setTables(generated);
    setSelectedTable(generated[0]);
    showToast(`1'den ${count}'e kadar toplam ${count} masa oluşturuldu! 🚀`);
  };

  // Reset to default 16 tables
  const handleResetTables = () => {
    setTables(DEFAULT_TABLES);
    setSelectedTable("1");
    showToast("Masa listesi varsayılan 16 masaya sıfırlandı.");
  };

  // Print Single or All
  const handlePrint = (mode = "single") => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Print CSS Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr-area, #printable-qr-area * {
            visibility: visible;
          }
          #printable-qr-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            page-break-inside: avoid;
            break-inside: avoid;
            background: #09120e !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Top Banner (No Print) */}
      <div className="no-print p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#122118] to-stone-900 border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">
            Baskı & Masa Kartı Yönetimi
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
            <span>Masa QR Kod & Stant Kartı Oluşturucu</span>
            <span className="text-xs bg-[#c9a34a]/20 text-[#e2c875] px-2.5 py-0.5 rounded-full border border-[#c9a34a]/40 font-sans font-bold">
              {tables.length} Masa Kayıtlı
            </span>
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
            İstediğiniz kadar yeni masa ekleyin veya toplu masa sayısı belirleyin. Seçili tek masanın veya tüm masaların QR akrilik stant kartlarını tek tıkla yazdırabilir ya da PDF olarak kaydedebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handlePrint("single")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition border border-white/10 shadow-md"
            title="Sadece ekranda seçili olan masanın kartını yazdır"
          >
            <Printer className="w-3.5 h-3.5 text-[#c9a34a]" />
            <span>Masa {selectedTable} Kartını Yazdır</span>
          </button>

          <button
            onClick={() => handlePrint("all")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950"
            title="Tüm masaların kartlarını topluca yazdır"
          >
            <Printer className="w-4 h-4" />
            <span>Tüm Masaları Toplu Yazdır ({tables.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid (No Print) */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Add New Table Form */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#c9a34a]/20 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 font-serif">
              <Plus className="w-4 h-4 text-[#c9a34a]" />
              <span>Yeni Masa Ekle</span>
            </h3>
            <form onSubmit={handleAddTable} className="flex items-center gap-2">
              <input
                type="text"
                value={newTableInput}
                onChange={(e) => setNewTableInput(e.target.value)}
                placeholder="Örn: 17 veya Bahçe 1, Teras 2..."
                className="flex-1 px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a34a]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#c9a34a] hover:bg-[#d8b257] active:scale-95 text-stone-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Masayı Ekle</span>
              </button>
            </form>
          </div>

          {/* Quick Batch Table Generator */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2 font-serif">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Toplu Masa Sayısı Ayarla</span>
            </h3>
            <p className="text-[11px] text-gray-400">
              Kafedeki toplam masa sayısını girerek 1'den o sayıya kadar otomatik masa listesi oluşturun:
            </p>
            <div className="flex items-center gap-2">
              <div className="relative w-28">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500 text-center"
                />
              </div>
              <button
                type="button"
                onClick={handleBatchGenerate}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
              >
                Toplu Oluştur
              </button>
              <button
                type="button"
                onClick={handleResetTables}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 text-xs font-medium transition ml-auto flex items-center gap-1"
                title="Varsayılan 16 masaya dön"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sıfırla</span>
              </button>
            </div>
          </div>

          {/* Table List & Selection */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Masa Seçimi ({tables.length} Masa)</span>
              </h3>
              <span className="text-[10px] text-gray-400">
                Seçmek için tıklayın, kaldırmak için ×'e basın
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
              {tables.map((tbl) => {
                const isSelected = selectedTable === tbl;
                return (
                  <div
                    key={tbl}
                    onClick={() => setSelectedTable(tbl)}
                    className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none border ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 border-emerald-400 shadow-md shadow-emerald-950"
                        : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className="truncate">Masa {tbl}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTable(tbl, e)}
                      title={`Masa ${tbl}'yi sil`}
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition opacity-60 hover:opacity-100 ${
                        isSelected
                          ? "hover:bg-black/20 text-stone-950"
                          : "hover:bg-red-500/20 text-red-400"
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Base Domain URL */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Menü Web Adresi (Domain)
            </label>
            <p className="text-[11px] text-gray-400 mb-2">
              QR kodun yönlendireceği adres. Canlı yayına aldığınızda (Örn: <code className="text-[#c9a34a]">https://menu.katmerim.com</code>) burayı güncelleyebilirsiniz:
            </p>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://menu.katmerim.com"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#c9a34a]"
            />

            <div className="pt-2 text-[11px] text-gray-400 space-y-1">
              <span className="font-semibold text-gray-300 block">Seçili Masa Hedef URL'si:</span>
              <a
                href={selectedFullUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 font-mono break-all hover:underline flex items-center gap-1"
              >
                <span>{selectedFullUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Live Stand Mockup Preview Column */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Masa Stant Kartı Canlı Önizlemesi
              </span>
              <span className="text-xs text-[#c9a34a] font-serif font-bold">
                Masa {selectedTable}
              </span>
            </div>

            {/* Stand Card Component */}
            <div className="w-full bg-gradient-to-b from-[#0f1d16] to-[#070d0a] border-2 border-[#c9a34a]/50 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
              {/* Gold metallic top badge */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#c9a34a] to-amber-500" />

              <div className="mb-4">
                <img
                  src="/logo.png"
                  alt="Katmerim Logo"
                  className="h-12 w-auto mx-auto object-contain drop-shadow-md mb-1.5"
                  onError={(e) => {
                    if (!e.target.src.includes("katmerim.com")) {
                      e.target.src = "https://katmerim.com/logo.png";
                    }
                  }}
                />
                <h4 className="font-serif font-black text-lg text-white">
                  {cafeInfo.name}
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-[#e2c875] font-bold mt-0.5">
                  Van'ın En İyi Tatlıcısı
                </p>
              </div>

              {/* Table Badge */}
              <div className="inline-block bg-[#c9a34a] text-stone-950 text-xs font-black uppercase px-4 py-1 rounded-full shadow-md mb-4 border border-amber-300/40">
                Masa {selectedTable}
              </div>

              {/* Real High-Res QR Code Card */}
              <div className="bg-white p-4 rounded-2xl shadow-xl inline-block mx-auto mb-4 border-2 border-[#c9a34a]/40">
                <QRCodeSVG
                  value={selectedFullUrl}
                  size={168}
                  level="H"
                  fgColor="#09120e"
                  bgColor="#ffffff"
                  includeMargin={false}
                />
              </div>

              <p className="text-xs font-bold text-white mb-1">
                Kameranızla QR Kodu Okutun
              </p>
              <p className="text-[10px] text-gray-400 max-w-[220px] mx-auto leading-relaxed mb-4">
                Menümüzü inceleyin, garson ve hesap çağırın.
              </p>

              {/* Guest WiFi Info Box */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-2.5 text-[11px] text-gray-300 text-left space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ücretsiz WiFi:</span>
                  <span className="font-semibold text-white">{cafeInfo.wifiName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">WiFi Şifresi:</span>
                  <span className="font-mono font-bold text-emerald-400">{cafeInfo.wifiPass}</span>
                </div>
              </div>
            </div>

            {/* Quick Print single button */}
            <div className="mt-3 text-center">
              <button
                onClick={() => handlePrint("single")}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#c9a34a]" />
                <span>Yalnızca Masa {selectedTable} Kartını Yazdır</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden / Printable Stand Cards Area (Active during window.print()) */}
      <div id="printable-qr-area" className="hidden print:block">
        <div className="grid grid-cols-2 gap-6 p-4">
          {(printMode === "all" ? tables : [selectedTable]).map((tbl) => {
            const tableUrl = `${baseUrl}/?masa=${encodeURIComponent(tbl)}`;
            return (
              <div
                key={tbl}
                className="print-card w-full max-w-sm mx-auto bg-[#09120e] text-white border-2 border-[#c9a34a] rounded-3xl p-6 text-center shadow-lg relative my-4"
                style={{ breakInside: "avoid" }}
              >
                <div className="mb-3">
                  <img
                    src="/logo.png"
                    alt="Katmerim Logo"
                    className="h-12 w-auto mx-auto object-contain mb-1"
                    onError={(e) => {
                      if (!e.target.src.includes("katmerim.com")) {
                        e.target.src = "https://katmerim.com/logo.png";
                      }
                    }}
                  />
                  <h3 className="font-serif font-black text-lg text-white">
                    {cafeInfo.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#e2c875] font-bold">
                    Van'ın En İyi Tatlıcısı
                  </p>
                </div>

                <div className="inline-block bg-[#c9a34a] text-stone-950 text-xs font-black uppercase px-5 py-1.5 rounded-full mb-3">
                  Masa {tbl}
                </div>

                <div className="bg-white p-3.5 rounded-2xl inline-block mx-auto mb-3 border border-[#c9a34a]">
                  <QRCodeSVG
                    value={tableUrl}
                    size={160}
                    level="H"
                    fgColor="#09120e"
                    bgColor="#ffffff"
                    includeMargin={false}
                  />
                </div>

                <p className="text-xs font-bold text-white mb-0.5">
                  Kameranızla QR Kodu Okutun
                </p>
                <p className="text-[10px] text-gray-400 max-w-[200px] mx-auto leading-relaxed mb-3">
                  Menümüzü inceleyin, garson ve hesap çağırın.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-[10px] text-gray-300 text-left space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ücretsiz WiFi:</span>
                    <span className="font-semibold text-white">{cafeInfo.wifiName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">WiFi Şifresi:</span>
                    <span className="font-mono font-bold text-emerald-400">{cafeInfo.wifiPass}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
