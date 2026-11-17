"use client";

import { useState } from "react";
import Link from "next/link";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialFarms,
  initialInspections,
  initialEstimates,
  initialEvents,
} from "@/lib/visireka-store";
import {
  FiCamera,
  FiTrendingUp,
  FiLayers,
  FiCheckCircle,
  FiAlertTriangle,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiActivity,
  FiShield,
} from "react-icons/fi";

export default function DashboardPage() {
  const [farms] = useState(initialFarms);
  const [inspections] = useState(initialInspections);
  const [estimates] = useState(initialEstimates);
  const [events] = useState(initialEvents);

  const totalArea = farms.reduce((acc, f) => acc + f.areaHectares, 0).toFixed(1);
  const totalTrees = farms.reduce((acc, f) => acc + f.treeCount, 0).toLocaleString();
  const totalPredictedYield = estimates.reduce((acc, e) => acc + e.predictedYieldKg, 0);
  const totalSacks = estimates.reduce((acc, e) => acc + e.requiredSacks60kg, 0);

  // Hitung distribusi Grade Mutu
  const grade1Count = inspections.filter((i) => i.assignedGrade.includes("Grade 1")).length;
  const grade1Percent = Math.round((grade1Count / inspections.length) * 100);

  return (
    <VisirekaAppShell
      title="Dashboard Eksekutif & Pemantauan Perkebunan"
      subtitle="Monitoring kualitas pascapanen berbasis citra CNN dan proyeksi panen multivariat"
    >
      <div className="space-y-6">
        {/* Banner Status Sistem Cerdas */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-emerald-500/5 to-amber-600/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <FiActivity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Sistem VISIREKA Beroperasi Normal
              </h3>
              <p className="text-xs text-muted-foreground">
                Inference Engine CNN (224x224 RGB) dan Regresi Linear OLS siap melayani analisis.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/inspeksi"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <FiCamera className="w-3.5 h-3.5" />
              <span>Unggah Citra QC</span>
            </Link>
            <Link
              href="/estimasi"
              className="px-3.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold transition flex items-center gap-1.5"
            >
              <FiTrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Kalkulasi Panen</span>
            </Link>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">Total Luas Lahan & Pohon</span>
              <FiMapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-foreground">{totalArea} Ha</div>
            <p className="text-[11px] text-muted-foreground">
              {totalTrees} batang pohon pada {farms.length} blok aktif
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">Mutu Grade 1 (Premium)</span>
              <FiCheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{grade1Percent}%</div>
            <p className="text-[11px] text-muted-foreground">
              {grade1Count} dari {inspections.length} batch lolos standar ekspor Specialty
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">Proyeksi Panen Mendatang</span>
              <FiTrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {totalPredictedYield.toLocaleString()} kg
            </div>
            <p className="text-[11px] text-muted-foreground">
              Estimasi berbasis regresi parameter iklim
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">Kebutuhan Karung Goni</span>
              <FiLayers className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-600">{totalSacks} Karung</div>
            <p className="text-[11px] text-muted-foreground">
              Standar 60 kg/karung kapasitas gudang
            </p>
          </div>
        </div>

        {/* Grid Tengah: Visualisasi Kurva Tren & Kartu Kebun Aktif */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Kurva Tren Panen Regresi (2 Kolom) */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Tren Produksi Historis vs Proyeksi Regresi Linear
                </h3>
                <p className="text-xs text-muted-foreground">
                  Perbandingan data panen aktual (kg) dan proyeksi saintifik berbasis suhu/curah hujan
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full self-start">
                R² = 0.842
              </span>
            </div>

            {/* Simulasi Grafik Visualisasi Interaktif */}
            <div className="py-4">
              <div className="h-60 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border">
                {/* Visual Bar / Chart Point */}
                {[
                  { label: "Mei 24", val: 9400, type: "riil" },
                  { label: "Jun 24", val: 10200, type: "riil" },
                  { label: "Jul 24", val: 11500, type: "riil" },
                  { label: "Mei 25", val: 9800, type: "riil" },
                  { label: "Jun 25", val: 10600, type: "riil" },
                  { label: "Jul 25", val: 11900, type: "riil" },
                  { label: "Jun 26 (P)", val: 11850, type: "prediksi" },
                  { label: "Jul 26 (P)", val: 16900, type: "prediksi" },
                ].map((item, idx) => {
                  const maxVal = 18000;
                  const heightPercent = Math.round((item.val / maxVal) * 100);
                  const isPred = item.type === "prediksi";

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                        {(item.val / 1000).toFixed(1)}t
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                          isPred
                            ? "bg-amber-500/80 border-2 border-dashed border-amber-600 shadow-sm"
                            : "bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                        }`}
                      />
                      <span className="text-[10px] text-muted-foreground text-center truncate max-w-[45px]">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-600" />
                  <span>Panen Riil (Historis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500 border border-dashed border-amber-600" />
                  <span>Estimasi AI (Regresi Linear)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Jadwal Kegiatan & Pemeliharaan Terdekat (1 Kolom) */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Agenda Perkebunan</h3>
              <Link href="/kalender" className="text-xs font-semibold text-emerald-600 hover:underline">
                Lihat Kalender
              </Link>
            </div>
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl border border-border bg-muted/40 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>{ev.title}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {ev.date}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{ev.farmName}</p>
                  <span className="inline-block text-[10px] font-semibold text-muted-foreground">
                    Tipe: {ev.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabel Ringkas Inspeksi Kualitas Terkini */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-bold text-base text-foreground">
                Hasil Inspeksi Mutu Biji Kopi Terkini (Model CNN)
              </h3>
              <p className="text-xs text-muted-foreground">
                Klasifikasi persentase cacat fisik biji kopi mentah (green beans 224x224)
              </p>
            </div>
            <Link href="/riwayat" className="text-xs font-semibold text-emerald-600 hover:underline">
              Lihat Seluruh Riwayat
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Kode Batch</th>
                  <th className="py-2.5 px-3">Blok Kebun</th>
                  <th className="py-2.5 px-3">Grade Mutu</th>
                  <th className="py-2.5 px-3">Defect Rate</th>
                  <th className="py-2.5 px-3">Confidence Score</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-muted/50 transition">
                    <td className="py-3 px-3 font-semibold text-foreground">{insp.batchCode}</td>
                    <td className="py-3 px-3 text-muted-foreground">{insp.farmName}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          insp.assignedGrade.includes("Grade 1")
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                        }`}
                      >
                        {insp.assignedGrade}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">
                      {insp.overallDefectRate}%
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {(insp.confidenceScore * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{insp.inspectionDate}</td>
                    <td className="py-3 px-3">
                      <Link
                        href="/riwayat"
                        className="text-emerald-600 hover:underline font-semibold"
                      >
                        Detail
                      </Link>
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
