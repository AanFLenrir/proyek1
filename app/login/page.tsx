"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  FiLock,
  FiMail,
  FiShield,
  FiArrowRight,
  FiCamera,
  FiTrendingUp,
} from "react-icons/fi";
import { UserRole } from "@/lib/visireka-store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("qc.rudi@visireka.unair.ac.id");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRole>("qc_inspector");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const setQuickRole = (role: UserRole, userEmail: string) => {
    setSelectedRole(role);
    setEmail(userEmail);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-background via-emerald-950/5 to-background p-4 sm:p-6 lg:p-8">
      {/* Top Navbar */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-emerald-600/30">
            V
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              VISIREKA
            </span>
            <span className="block text-[10px] text-muted-foreground font-medium">Smart Coffee Intelligence</span>
          </div>
        </Link>
        <ThemeToggle labels={{ toLight: "Terang", toDark: "Gelap" }} />
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card/95 backdrop-blur-md shadow-2xl space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1">
              <FiShield className="w-3.5 h-3.5" />
              <span>Autentikasi Terpusat (RBAC)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Masuk ke VISIREKA</h1>
            <p className="text-xs text-muted-foreground">
              Akses panel kendali inspeksi citra CNN dan pemodelan panen regresi linear
            </p>
          </div>

          {/* Role Switcher Pills */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
              Pilih Peran Pengguna (SRS):
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border">
              <button
                type="button"
                onClick={() => setQuickRole("qc_inspector", "qc.rudi@visireka.unair.ac.id")}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition ${
                  selectedRole === "qc_inspector"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Petugas QC
              </button>
              <button
                type="button"
                onClick={() => setQuickRole("farm_admin", "admin.budi@visireka.unair.ac.id")}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition ${
                  selectedRole === "farm_admin"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin Kebun
              </button>
              <button
                type="button"
                onClick={() => setQuickRole("management", "siti.rahma@visireka.unair.ac.id")}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition ${
                  selectedRole === "management"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Manajemen
              </button>
            </div>
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Alamat Email Akun</span>
                <span className="text-[10px] text-emerald-600 font-medium">Terdaftar</span>
              </label>
              <div className="relative">
                <FiMail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perkebunan.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-foreground">Kata Sandi</label>
                <a href="#" className="text-emerald-600 text-[11px] font-semibold hover:underline">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <FiLock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                />
                <span>Ingat sesi masuk</span>
              </label>
              <span className="text-[10px] text-muted-foreground">TLS 1.3 Terenkripsi</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="pt-2 border-t border-border space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">
              Akses Cepat Pengujian Akademik:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Link
                href="/inspeksi"
                className="p-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground flex items-center gap-2 font-medium transition"
              >
                <FiCamera className="w-4 h-4 text-emerald-600" />
                <span>Buka Scanner AI</span>
              </Link>
              <Link
                href="/estimasi"
                className="p-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground flex items-center gap-2 font-medium transition"
              >
                <FiTrendingUp className="w-4 h-4 text-amber-600" />
                <span>Buka Estimasi</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Identity */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-muted-foreground pt-4">
        <p className="font-semibold text-foreground">Program Studi D4 Teknik Informatika, Fakultas Vokasi, Universitas Airlangga</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Tahun 2026 • Proyek Terpadu VISIREKA (Smart Agriculture Arabica)</p>
      </footer>
    </div>
  );
}
