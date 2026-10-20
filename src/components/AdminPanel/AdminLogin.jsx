import React, { useState } from "react";
import { useMenu } from "../../context/MenuContext";
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const { loginAdmin, setIsAdminMode } = useMenu();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      // User specified: kullanıcı admin, şifre admin123
      if (username.trim() === "admin" && password.trim() === "admin123") {
        loginAdmin();
      } else {
        setError("Kullanıcı adı veya şifre hatalı! (admin / admin123)");
        setLoading(false);
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#080908] text-[#eee8d9] flex flex-col justify-center items-center p-4 selection:bg-[#c9a34a] selection:text-black">
      {/* Back to Menu */}
      <button
        onClick={() => {
          setIsAdminMode(false);
          // Clean url
          window.history.replaceState({}, document.title, window.location.pathname);
        }}
        className="fixed top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold transition border border-white/5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Müşteri Menüsüne Dön</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm bg-[#0e110e] border border-[#c9a34a]/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
      >
        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a34a] to-transparent" />

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Katmerim Logo"
            className="h-14 w-auto mx-auto object-contain drop-shadow-xl mb-2"
            onError={(e) => {
              if (!e.target.src.includes("katmerim.com")) {
                e.target.src = "https://katmerim.com/logo.png";
              }
            }}
          />
          <h2 className="text-xl font-bold font-serif text-white">
            Katmerim Yönetim Girişi
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Menü ve kafe yönetimi için yetkili girişi
          </p>
        </div>

        {/* Error message if any */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-[#c9a34a]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#c9a34a] transition placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#c9a34a]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#c9a34a] transition placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c9a34a] to-[#a8822e] hover:from-[#e2c875] hover:to-[#c9a34a] active:scale-98 text-stone-950 font-black text-xs sm:text-sm transition shadow-lg shadow-black flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-stone-950" />
            )}
            <span>{loading ? "Giriş Yapılıyor..." : "Yönetim Paneline Giriş Yap"}</span>
          </button>
        </form>

        {/* Quick Demo Hint */}
        <div className="mt-5 pt-4 border-t border-white/5 text-center">
          <p className="text-[11px] text-gray-400 mb-1.5">
            Yetkili Giriş Bilgileri:
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 text-xs text-[#e2c875] bg-[#c9a34a]/10 hover:bg-[#c9a34a]/20 px-3 py-1 rounded-full border border-[#c9a34a]/30 transition"
          >
            <Sparkles className="w-3 h-3 text-[#c9a34a]" />
            <span>Kullanıcı: admin | Şifre: admin123 (Otomatik Doldur)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
