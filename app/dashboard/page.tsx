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
  FiCheckCircle,
  FiAlertTriangle,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiActivity,
  FiCpu,
  FiPackage,
  FiUsers,
  FiClock,
} from "react-icons/fi";

export default function DashboardPage() {
  const [farms] = useState(initialFarms);
  const [inspections] = useState(initialInspections);
  const [estimates] = useState(initialEstimates);
  const [events] = useState(initialEvents);

  // Ambil inspeksi dan estimasi terbaru
  const latestInspection = inspections[0];
  const latestEstimate = estimates[0];
  const currentFarm = farms[0];

  const totalArea = farms.reduce((acc, f) => acc + f.areaHectares, 0).toFixed(1);
  const totalTrees = farms.reduce((acc, f) => acc + f.treeCount, 0).toLocaleString();
  const totalPredictedYield = estimates.reduce((acc, e) => acc + e.predictedYieldKg, 0);

  // Rincian CNN
  const totalBeansChecked = inspections.reduce((acc, i) => acc + (i.totalObjectsCount || 20), 0);
  const totalNormalBeans = inspections.reduce((acc, i) => acc + (i.normalObjectsCount || 18), 0);
  const totalDefectBeans = inspections.reduce((acc, i) => acc + (i.defectObjectsCount || 2), 0);
  const overallQualityPercent = Math.round((totalNormalBeans / totalBeansChecked) * 100);

  return (
    <VisirekaAppShell
      title="Dashboard Utama & Monitoring Cerdas"
      subtitle="Ringkasan inspeksi kualitas citra CNN dan proyeksi estimasi panen kopi Arabika"
    >
      <div className="space-y-6">
        {/* User Greeting Banner (Matches Figma/Google Stitch) */}
        <div className="relative overflow-hidden p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white shadow-xl shadow-emerald-900/20">
          {/* Subtle background decoration */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-emerald-100">
                <FiMapPin className="w-3.5 h-3.5" />
                <span>{currentFarm.name} • {currentFarm.elevationMasl} mdpl</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
                Halo, Rudi Hartono 👋
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
                Sistem VISIREKA memantau 3 blok kebun Arabika aktif dengan mesin AI siap pakai untuk sortasi pascapanen dan estimasi logistik.
              </p>
            </div>

            {/* Quick Farm Metric Pill on Greeting */}
            <div className="flex items-center gap-3 pt-2 md:pt-0">
              <div className="bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center">
                <p className="text-[10px] text-emerald-200 uppercase font-semibold">Total Area</p>
                <p className="text-sm font-extrabold">{totalArea} Ha</p>
              </div>
              <div className="bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center">
                <p className="text-[10px] text-emerald-200 uppercase font-semibold">Pohon Kopi</p>
                <p className="text-sm font-extrabold">{totalTrees}</p>
              </div>
              <div className="bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center">
                <p className="text-[10px] text-emerald-200 uppercase font-semibold">Target Panen</p>
                <p className="text-sm font-extrabold">{(totalPredictedYield / 1000).toFixed(1)} Ton</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Cards (Matches Figma Prominent Scanner & Estimasi Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Scanner Kualitas AI */}
          <Link
            href="/inspeksi"
            className="group relative overflow-hidden p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <FiCpu className="w-3.5 h-3.5" /> Modul Visi Komputer CNN
              </span>
              <h3 className="text-base font-extrabold text-foreground group-hover:text-emerald-600 transition">
                Scanner Pemeriksaan Kualitas
              </h3>
              <p className="text-xs text-muted-foreground">
                Unggah atau ambil foto sampel biji kopi untuk deteksi cacat fisik otomatis & penentuan grade SNI.
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Buka Scanner Kamera</span>
                <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/30 shrink-0 ml-4 group-hover:scale-110 transition">
              <FiCamera />
            </div>
          </Link>

          {/* Card 2: Estimasi Panen AI */}
          <Link
            href="/estimasi"
            className="group relative overflow-hidden p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <FiActivity className="w-3.5 h-3.5" /> Modul Regresi Linear
              </span>
              <h3 className="text-base font-extrabold text-foreground group-hover:text-amber-600 transition">
                Estimasi Produksi & Panen
              </h3>
              <p className="text-xs text-muted-foreground">
                Kalkulasi proyeksi tonase panen buah ceri kopi berbasis variabel agroklimat & kebutuhan logistik.
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Hitung Estimasi Panen</span>
                <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-600/30 shrink-0 ml-4 group-hover:scale-110 transition">
              <FiTrendingUp />
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* DUA BAGIAN UTAMA: HASIL CNN & HASIL LINEAR REGRESSION */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ----------------------------------------------------------------------- */}
          {/* BAGIAN A: HASIL CNN (KLASIFIKASI KUALITAS BIJI KOPI) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl border border-border bg-card shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FiCamera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-foreground">
                    A. HASIL CNN — Kualitas Biji Kopi
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Analisis morfologi citra pascapanen standar SNI 01-2907-2008 & SCA
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {latestInspection.assignedGrade}
              </span>
            </div>

            {/* Circular Gauge & Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Circular Gauge Visual */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-3">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-muted/40 stroke-current"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-emerald-600 stroke-current transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - overallQualityPercent / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-foreground">{overallQualityPercent}%</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">Kualitas Baik</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 text-center font-medium">
                  Confidence Score: <strong className="text-foreground">{(latestInspection.confidenceScore * 100).toFixed(1)}%</strong>
                </p>
              </div>

              {/* 3 Metrics Counter */}
              <div className="sm:col-span-7 space-y-2.5">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Biji Diperiksa</span>
                  <span className="text-sm font-extrabold text-foreground">{totalBeansChecked} Butir</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Biji Normal Utuh
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                    {totalNormalBeans} Butir ({overallQualityPercent}%)
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <FiAlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Total Biji Cacat (Defect)
                  </span>
                  <span className="text-sm font-extrabold text-rose-700 dark:text-rose-400">
                    {totalDefectBeans} Butir ({100 - overallQualityPercent}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Defect Distribution Progress Bars */}
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-bold text-foreground">Sebaran Klasifikasi Jenis Cacat (Defect):</p>
              <div className="space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Biji Hitam / Busuk (Black Sour)</span>
                    <span className="font-semibold text-foreground">{latestInspection.defectBreakdown.blackSour}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${latestInspection.defectBreakdown.blackSour * 5}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Kerusakan Serangga Bubuk (PBKo)</span>
                    <span className="font-semibold text-foreground">{latestInspection.defectBreakdown.insectDamage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${latestInspection.defectBreakdown.insectDamage * 5}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Biji Pecah Mekanis (Broken Beans)</span>
                    <span className="font-semibold text-foreground">{latestInspection.defectBreakdown.brokenBeans}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${latestInspection.defectBreakdown.brokenBeans * 5}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation & Action Button */}
            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1.5">
              <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">Rekomendasi Sortasi Fisik:</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{latestInspection.recommendation}</p>
            </div>

            <Link
              href="/inspeksi"
              className="w-full py-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Buka Visualisasi Deteksi & Bounding Box</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* BAGIAN B: HASIL LINEAR REGRESSION (ESTIMASI PRODUKSI KOPI) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl border border-border bg-card shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-foreground">
                    B. HASIL LINEAR REGRESSION — Estimasi Panen
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Metode Regresi Linear berdasarkan data perkebunan dan cuaca
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Target: {latestEstimate.targetMonth === 6 ? "Juni" : "Juli"} {latestEstimate.targetYear}
              </span>
            </div>

            {/* Big Hero Metric Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Proyeksi Volume Panen ({latestEstimate.farmName})
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mt-0.5">
                    {latestEstimate.predictedYieldKg.toLocaleString()}{" "}
                    <span className="text-lg font-bold text-amber-600">kg</span>
                    <span className="text-xs font-semibold text-muted-foreground ml-2">
                      ({(latestEstimate.predictedYieldKg / 1000).toFixed(2)} Ton)
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Rentang Interval Kepercayaan (95% CI):{" "}
                <strong className="text-foreground">
                  {latestEstimate.lowerBoundKg.toLocaleString()} kg – {latestEstimate.upperBoundKg.toLocaleString()} kg
                </strong>
              </p>
            </div>

            {/* Logistic & Manpower Needs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                  <FiPackage className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold">Kebutuhan Karung (60kg)</p>
                  <p className="text-sm font-extrabold text-foreground">{latestEstimate.requiredSacks60kg} Karung</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                  <FiUsers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold">Tenaga Kerja Pemetik</p>
                  <p className="text-sm font-extrabold text-foreground">{latestEstimate.estimatedLaborers} Orang</p>
                </div>
              </div>
            </div>

            {/* Production Growth Visual Trend (Interactive SVG Chart) */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <p className="font-bold text-foreground">Grafik Perkembangan Produksi Historis vs Estimasi:</p>
                <span className="text-[10px] text-muted-foreground">Panen 2024 s/d 2026</span>
              </div>

              {/* Simplified SVG Chart */}
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/80 space-y-2">
                <div className="h-28 w-full flex items-end justify-between gap-3 pt-4 px-2">
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-bold text-muted-foreground">9.4 Ton</span>
                    <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-t-lg transition-all" style={{ height: "65%" }} />
                    <span className="text-[10px] text-muted-foreground">Mei 2024</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-bold text-muted-foreground">10.6 Ton</span>
                    <div className="w-full bg-slate-400 dark:bg-slate-600 rounded-t-lg transition-all" style={{ height: "76%" }} />
                    <span className="text-[10px] text-muted-foreground">Juni 2025</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-extrabold text-amber-600">11.85 Ton</span>
                    <div className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg transition-all ring-2 ring-amber-500/30" style={{ height: "88%" }} />
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">Juni 2026 (Prediksi)</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/estimasi"
              className="w-full py-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Jalankan Simulasi Parameter Panen Baru</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Section: Recent Inspections & Harvest Agenda */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Inspection Activity (2 Cols) */}
          <div className="lg:col-span-2 p-5 rounded-3xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Aktivitas Pemeriksaan Kualitas Terakhir</h3>
              </div>
              <Link href="/riwayat" className="text-xs text-emerald-600 font-semibold hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              {inspections.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                      <FiCamera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{item.batchCode}</p>
                      <p className="text-[11px] text-muted-foreground">{item.farmName} • {item.inspectionDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {item.assignedGrade}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Defect: {item.overallDefectRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Harvest Schedule / Events (1 Col) */}
          <div className="p-5 rounded-3xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-foreground">Jadwal Panen & Agenda</h3>
              </div>
              <Link href="/kalender" className="text-xs text-amber-600 font-semibold hover:underline">
                Kalender
              </Link>
            </div>

            <div className="space-y-2.5">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground line-clamp-1">{ev.title}</span>
                    <span className="text-[10px] font-bold text-emerald-600 shrink-0">{ev.status}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <FiCalendar className="w-3 h-3" />
                    <span>{ev.date}</span> • <span>{ev.farmName}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VisirekaAppShell>
  );
}
