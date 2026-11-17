"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserRole } from "@/lib/visireka-store";
import {
  FiBell,
  FiCpu,
  FiCheckCircle,
  FiLayers,
  FiMenu,
  FiX,
} from "react-icons/fi";

interface HeaderProps {
  currentRole: UserRole;
  title?: string;
  subtitle?: string;
}

export function VisirekaHeader({ currentRole, title, subtitle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    qc_inspector: { label: "Petugas QC", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    farm_admin: { label: "Admin Kebun", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
    management: { label: "Pihak Manajemen", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
    super_admin: { label: "Super Admin", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  };

  const notifications = [
    { id: 1, title: "Model CNN Terverifikasi", time: "5m lalu", text: "Bobot model 224x224 siap untuk inferensi real-time." },
    { id: 2, title: "Jadwal Panen Baru", time: "1j lalu", text: "Blok Argopuro Lestari dijadwalkan petik merah 25 Nov 2026." },
    { id: 3, title: "Input Agroklimat", time: "3j lalu", text: "Data curah hujan & suhu bulan Oktober berhasil diverifikasi." },
  ];

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Page Title & Breadcrumb */}
      <div>
        {title ? (
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">VISIREKA</span>
            <span>/</span>
            <span className="capitalize">{currentRole.replace("_", " ")}</span>
          </div>
        )}
      </div>

      {/* Header Controls & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Indikator Model AI */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <FiCpu className="w-3.5 h-3.5 animate-pulse" />
          <span>AI Engine: CNN & Regresi Siap</span>
        </div>

        {/* Role Badge */}
        <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${roleLabels[currentRole].color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {roleLabels[currentRole].label}
        </div>

        {/* Notifikasi Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition"
            title="Notifikasi Sistem"
          >
            <FiBell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card p-3 shadow-xl z-50 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border font-semibold">
                <span>Notifikasi Sistem (3)</span>
                <span className="text-[10px] text-muted-foreground">Tandai Dibaca</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-muted/60 space-y-0.5">
                    <div className="flex justify-between items-center font-medium text-foreground">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Theme Toggle */}
        <ThemeToggle labels={{ toLight: "Ganti ke Mode Terang", toDark: "Ganti ke Mode Gelap" }} />

        {/* Akses Cepat Tombol Baru */}
        <Link
          href="/inspeksi"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <FiLayers className="w-3.5 h-3.5" />
          <span>Inspeksi QC</span>
        </Link>
      </div>
    </header>
  );
}
