"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiGrid,
  FiCamera,
  FiTrendingUp,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiMessageSquare,
  FiBookOpen,
  FiShield,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";
import { UserRole } from "@/lib/visireka-store";

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function VisirekaSidebar({ currentRole, onRoleChange }: SidebarProps) {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      label: "Utama & Analitik",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: FiGrid },
        { href: "/analitik", label: "Analitik & Mutu", icon: FiBarChart2 },
        { href: "/kalender", label: "Kalender Panen", icon: FiCalendar },
      ],
    },
    {
      label: "Sistem Cerdas AI",
      items: [
        { href: "/inspeksi", label: "Inspeksi Mutu (CNN)", icon: FiCamera, badge: "AI" },
        { href: "/estimasi", label: "Estimasi Panen (Regresi)", icon: FiTrendingUp, badge: "AI" },
      ],
    },
    {
      label: "Manajemen Lapangan",
      items: [
        { href: "/kebun", label: "Manajemen Kebun", icon: FiMapPin },
        { href: "/riwayat", label: "Riwayat Terpadu", icon: FiClock },
      ],
    },
    {
      label: "Pengetahuan & Bantuan",
      items: [
        { href: "/konsultasi", label: "Konsultasi Agronomi", icon: FiMessageSquare },
        { href: "/edukasi", label: "Pusat Edukasi SNI/SCA", icon: FiBookOpen },
      ],
    },
    {
      label: "Sistem & Hak Akses",
      items: [
        { href: "/admin", label: "Panel Admin & Audit", icon: FiShield },
        { href: "/profil", label: "Profil & Akun", icon: FiUser },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card/60 backdrop-blur-sm h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20">
          V
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              VISIREKA
            </span>
            <span className="text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            Vision & Regression AI for Arabica Coffee
          </p>
        </div>
      </div>

      {/* Role Switcher (Simulasi Aktor SRS untuk Pengujian Dosen) */}
      <div className="p-3 mx-4 my-3 bg-muted/50 rounded-xl border border-border/80 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
            Peran Simulasi (SRS):
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <FiCheckCircle className="w-3 h-3" /> Aktif
          </span>
        </div>
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
        >
          <option value="qc_inspector">Petugas Quality Control (QC)</option>
          <option value="farm_admin">Admin Perkebunan</option>
          <option value="management">Pihak Manajemen / Eksekutif</option>
          <option value="super_admin">Super Administrator</option>
        </select>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2.5 mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border text-[11px] text-muted-foreground">
        <p className="font-semibold text-foreground">D4 Teknik Informatika</p>
        <p>Fakultas Vokasi, Universitas Airlangga</p>
      </div>
    </aside>
  );
}
