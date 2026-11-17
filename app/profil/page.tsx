"use client";

import { useState } from "react";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiLock,
  FiSave,
  FiCheckCircle,
} from "react-icons/fi";

export default function ProfilPage() {
  const [name, setName] = useState("Rudi Hartono, S.Tr.Kom.");
  const [email, setEmail] = useState("rudi.hartono@visireka.unair.ac.id");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <VisirekaAppShell
      title="Profil Pengguna & Pengaturan Akun"
      subtitle="Pengaturan informasi pribadi, kredensial keamanan, dan preferensi antarmuka"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <FiCheckCircle className="w-4 h-4" />
            <span>Profil dan preferensi akun berhasil diperbarui secara lokal.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri: Kartu Identitas */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-600/10 text-emerald-600 border-2 border-emerald-500 mx-auto flex items-center justify-center font-bold text-2xl">
              RH
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">{name}</h3>
              <p className="text-xs text-muted-foreground">{email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                Petugas Quality Control (QC)
              </span>
            </div>

            <div className="pt-4 border-t border-border text-left text-xs space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Unit Penugasan:</span>
                <span className="font-semibold text-foreground">Laboratorium QC Pascapanen</span>
              </div>
              <div className="flex justify-between">
                <span>Afiliasi:</span>
                <span className="font-semibold text-foreground">Universitas Airlangga</span>
              </div>
              <div className="flex justify-between">
                <span>Status Akun:</span>
                <span className="font-semibold text-emerald-600">Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Pengaturan */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-base text-foreground pb-2 border-b border-border">
              Perbarui Informasi Akun
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nama Lengkap & Gelar</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Alamat Email Kampus / Instansi</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Nomor Telepon / WhatsApp</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition flex items-center gap-2"
                >
                  <FiSave className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </VisirekaAppShell>
  );
}
