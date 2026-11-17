"use client";

import { useState } from "react";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import { initialLogs, ActivityLog } from "@/lib/visireka-store";
import {
  FiShield,
  FiActivity,
  FiServer,
  FiUsers,
  FiDatabase,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";

export default function AdminPage() {
  const [logs] = useState<ActivityLog[]>(initialLogs);

  const users = [
    { name: "Rudi Hartono", email: "rudi.qc@visireka.unair.ac.id", role: "Petugas QC", status: "Aktif" },
    { name: "Siti Rahma", email: "siti.rahma@visireka.unair.ac.id", role: "Pihak Manajemen", status: "Aktif" },
    { name: "Budi Santoso", email: "budi.admin@visireka.unair.ac.id", role: "Admin Perkebunan", status: "Aktif" },
    { name: "Administrator Utama", email: "admin@visireka.unair.ac.id", role: "Super Administrator", status: "Aktif" },
  ];

  return (
    <VisirekaAppShell
      title="Panel Administrator & Pemantauan Sistem"
      subtitle="Pengawasan infrastruktur server, audit trail rekam jejak sistem cerdas, dan tata kelola akun"
    >
      <div className="space-y-6">
        {/* Top 3 Monitoring Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">Infrastruktur AI Engine</span>
              <FiServer className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">Online 99.9%</div>
            <p className="text-[11px] text-muted-foreground">
              CNN Model Latency: ~0.85s • Regresi OLS: ~0.04s
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">Basis Data Relasional</span>
              <FiDatabase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-foreground">PostgreSQL / Supabase</div>
            <p className="text-[11px] text-muted-foreground">
              Integritas foreign key & check constraints aktif
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">Pengguna Terverifikasi</span>
              <FiUsers className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-600">{users.length} Akun</div>
            <p className="text-[11px] text-muted-foreground">
              4 Peran sesuai spesifikasi kebutuhan (SRS)
            </p>
          </div>
        </div>

        {/* Tabel Manajemen Pengguna */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-bold text-base text-foreground">Daftar Pengguna & Hak Akses (RBAC)</h3>
              <p className="text-xs text-muted-foreground">
                Pengaturan hak akses sesuai wewenang operasional sistem VISIREKA
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Nama Lengkap</th>
                  <th className="py-2.5 px-3">Alamat Email</th>
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Status Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u, idx) => (
                  <tr key={idx} className="hover:bg-muted/50 transition">
                    <td className="py-3 px-3 font-semibold text-foreground">{u.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <FiCheckCircle className="w-3.5 h-3.5" /> {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabel Audit Logs & Rekam Jejak Sistem */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-bold text-base text-foreground">Audit Trail & Log Aktivitas Sistem</h3>
              <p className="text-xs text-muted-foreground">
                Pencatatan kronologis setiap aksi pengguna dan eksekusi komputasi cerdas
              </p>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <FiClock className="w-3.5 h-3.5" /> Real-time Logging
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Waktu Kejadian</th>
                  <th className="py-2.5 px-3">Pengguna & Peran</th>
                  <th className="py-2.5 px-3">Aktivitas (Action)</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Rincian Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/50 transition">
                    <td className="py-3 px-3 text-muted-foreground font-mono text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 text-foreground font-medium">
                      {log.actor} <span className="text-[10px] text-muted-foreground">({log.role})</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-[11px] leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </VisirekaAppShell>
  );
}
