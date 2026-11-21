"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserRole, initialFarms } from "@/lib/visireka-store";
import {
  FiBell,
  FiCpu,
  FiCheckCircle,
  FiMenu,
  FiX,
  FiMapPin,
  FiChevronDown,
  FiGrid,
  FiCamera,
  FiTrendingUp,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiBookOpen,
  FiMessageSquare,
  FiShield,
  FiUser,
  FiLogIn,
} from "react-icons/fi";

interface HeaderProps {
  currentRole: UserRole;
  title?: string;
  subtitle?: string;
  selectedFarmId?: string;
  onSelectFarm?: (farmId: string) => void;
}

export function VisirekaHeader({
  currentRole,
  title,
  subtitle,
  selectedFarmId = "farm-01",
  onSelectFarm,
}: HeaderProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);

  const farms = initialFarms;
  const currentFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    qc_inspector: { label: "Petugas QC", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    farm_admin: { label: "Admin Kebun", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
    management: { label: "Manajemen", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
    super_admin: { label: "Super Admin", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: FiGrid },
    { href: "/inspeksi", label: "Scanner Kualitas (CNN)", icon: FiCamera, badge: "AI" },
    { href: "/estimasi", label: "Estimasi Panen (Regresi)", icon: FiTrendingUp, badge: "AI" },
    { href: "/kebun", label: "Data Kebun", icon: FiMapPin },
    { href: "/riwayat", label: "Riwayat Terpadu", icon: FiClock },
    { href: "/kalender", label: "Kalender Panen", icon: FiCalendar },
    { href: "/analitik", label: "Analitik Agroklimat", icon: FiBarChart2 },
    { href: "/edukasi", label: "Edukasi SNI & SCA", icon: FiBookOpen },
    { href: "/konsultasi", label: "Konsultasi Agronomi", icon: FiMessageSquare },
    { href: "/profil", label: "Profil Pengguna", icon: FiUser },
    { href: "/admin", label: "Panel Admin", icon: FiShield },
    { href: "/login", label: "Ganti Akun / Login", icon: FiLogIn },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border/80 bg-background/90 backdrop-blur-md px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
        {/* Left: Mobile Brand / Farm Selector */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition"
            aria-label="Buka Menu"
          >
            <FiMenu className="w-5 h-5 text-emerald-600" />
          </button>

          {/* Farm Selector Chip (Matches Figma) */}
          <div className="relative">
            <button
              onClick={() => setShowFarmDropdown(!showFarmDropdown)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-500/15 transition shadow-xs"
            >
              <FiMapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[200px]">{currentFarm.name}</span>
              <span className="hidden sm:inline text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
                • {currentFarm.elevationMasl} mdpl
              </span>
              <FiChevronDown className="w-3 h-3 text-emerald-600 shrink-0" />
            </button>

            {showFarmDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 text-xs space-y-1">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Pilih Petak Kebun Aktif:
                </p>
                {farms.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      if (onSelectFarm) onSelectFarm(f.id);
                      setShowFarmDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition ${
                      f.id === currentFarm.id
                        ? "bg-emerald-600 text-white font-bold"
                        : "hover:bg-muted text-foreground font-medium"
                    }`}
                  >
                    <div>
                      <p className="text-xs">{f.name}</p>
                      <p className={`text-[10px] ${f.id === currentFarm.id ? "text-white/80" : "text-muted-foreground"}`}>
                        {f.location} • {f.elevationMasl} mdpl
                      </p>
                    </div>
                    {f.id === currentFarm.id && <FiCheckCircle className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center / Title (Desktop only) */}
        <div className="hidden xl:block text-center">
          {title && <h1 className="text-sm font-bold text-foreground truncate max-w-md">{title}</h1>}
          {subtitle && <p className="text-[11px] text-muted-foreground truncate max-w-md">{subtitle}</p>}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* AI Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
            <FiCpu className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>AI Dual Engine Siap</span>
          </div>

          {/* Role Badge */}
          <div className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${roleLabels[currentRole].color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {roleLabels[currentRole].label}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle labels={{ toLight: "Mode Terang", toDark: "Mode Gelap" }} />

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition"
              title="Notifikasi"
            >
              <FiBell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-3 shadow-2xl z-50 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-border font-bold">
                  <span className="text-foreground">Notifikasi Sistem</span>
                  <span className="text-[10px] text-emerald-600 font-semibold cursor-pointer">Tandai Dibaca</span>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">Model CNN Terkalibrasi</p>
                    <p className="text-[11px] text-muted-foreground">Deteksi 224x224 RGB siap dengan akurasi 91,40% (SNI 01-2907-2008).</p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                    <p className="font-semibold text-amber-800 dark:text-amber-300">Musim Panen Mendatang</p>
                    <p className="text-[11px] text-muted-foreground">Estimasi panen puncak Blok Argopuro: 11.850 kg buah ceri.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Matches Google Stitch / Figma) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-card h-full shadow-2xl flex flex-col border-r border-border z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-emerald-600/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-emerald-600/30">
                  V
                </div>
                <div>
                  <h2 className="font-extrabold text-base tracking-tight text-foreground">VISIREKA</h2>
                  <p className="text-[10px] text-muted-foreground">Smart Agriculture Arabica</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Farm Pill in Drawer */}
            <div className="px-4 py-3 bg-muted/40 border-b border-border">
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Perkebunan Terpilih</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <FiMapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentFarm.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{currentFarm.location}</p>
            </div>

            {/* Links List */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border bg-muted/30 text-[10px] text-muted-foreground">
              <p className="font-bold text-foreground">D4 Teknik Informatika UNAIR 2026</p>
              <p>Fakultas Vokasi Universitas Airlangga</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
