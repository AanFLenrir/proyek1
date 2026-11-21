"use client";

import { useState } from "react";
import Link from "next/link";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiSave,
  FiCheckCircle,
  FiLogOut,
  FiMapPin,
} from "react-icons/fi";

export default function ProfilPage() {
  const [name, setName] = useState("Rudi Hartono, S.Tr.Kom.");
  const [email, setEmail] = useState("rudi.hartono@visireka.unair.ac.id");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [role, setRole] = useState("Petugas Quality Control (QC)");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <VisirekaAppShell
      title="Profil Pengguna & Pengaturan Akun"
      subtitle="Pengaturan informasi pribadi, kredensial peran hak akses (RBAC), dan preferensi antarmuka"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            <span>Profil dan preferensi akun berhasil diperbarui secara lokal.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri: Kartu Identitas (Matches Figma) */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm text-center space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-600/30 border-4 border-background">
                RH
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-background" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-foreground">{name}</h3>
                <p className="text-xs text-muted-foreground">{email}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {role}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-xs text-left space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <FiMapPin className="text-emerald-600" />
                  <span>Blok Argopuro Lestari</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Ketinggian: 1.350 mdpl • Jawa Timur</p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-border">
              <Link
                href="/login"
                className="w-full py-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Ganti Akun / Keluar Sesi</span>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Form Edit Profil */}
          <div className="md:col-span-2 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
              Perbarui Informasi Profil
            </h4>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Nama Lengkap & Gelar:</label>
                <div className="relative">
                  <FiUser className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Alamat Email:</label>
                <div className="relative">
                  <FiMail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Nomor Telepon / WhatsApp:</label>
                <div className="relative">
                  <FiPhone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Peran Hak Akses (Role-Based Access Control):</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Petugas Quality Control (QC)">Petugas Quality Control (QC)</option>
                  <option value="Admin Perkebunan">Admin Perkebunan</option>
                  <option value="Pihak Manajemen / Eksekutif">Pihak Manajemen / Eksekutif</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <FiSave className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </VisirekaAppShell>
  );
}
