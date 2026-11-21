"use client";

import { useState } from "react";
import Link from "next/link";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialInspections,
  initialEstimates,
  QualityInspection,
  HarvestEstimate,
} from "@/lib/visireka-store";
import {
  FiClock,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCamera,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiEye,
  FiPackage,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";

export default function RiwayatPage() {
  const [activeTab, setActiveTab] = useState<"semua" | "cnn" | "regresi">("semua");
  const [inspections] = useState<QualityInspection[]>(initialInspections);
  const [estimates] = useState<HarvestEstimate[]>(initialEstimates);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  // Selected item modal states
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null);
  const [selectedEstimate, setSelectedEstimate] = useState<HarvestEstimate | null>(null);

  // Filter CNN inspections
  const filteredInspections = inspections.filter((i) => {
    const matchesSearch =
      i.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.farmName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === "all" || i.assignedGrade.includes(gradeFilter);
    return matchesSearch && matchesGrade;
  });

  // Filter Regression estimates
  const filteredEstimates = estimates.filter((e) => {
    return (
      e.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.targetYear.toString().includes(searchTerm)
    );
  });

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = "";
    if (activeTab === "cnn" || activeTab === "semua") {
      csvContent += "=== RIWAYAT INSPEKSI MUTU CNN (SNI 01-2907-2008) ===\n";
      csvContent += "ID,Kode Batch,Blok Kebun,Grade Mutu,Total Objek,Normal,Cacat,Defect Rate (%),Confidence,Tanggal\n";
      csvContent += filteredInspections
        .map(
          (i) =>
            `"${i.id}","${i.batchCode}","${i.farmName}","${i.assignedGrade}",${i.totalObjectsCount || 20},${i.normalObjectsCount || 19},${i.defectObjectsCount || 1},${i.overallDefectRate},${i.confidenceScore},"${i.inspectionDate}"`
        )
        .join("\n");
      csvContent += "\n\n";
    }

    if (activeTab === "regresi" || activeTab === "semua") {
      csvContent += "=== RIWAYAT ESTIMASI PANEN REGRESI LINEAR ===\n";
      csvContent += "ID,Blok Kebun,Periode Target,Estimasi Panen (kg),Rentang Bawah (kg),Rentang Atas (kg),Karung 60kg,Tenaga Pemetik,Tanggal\n";
      csvContent += filteredEstimates
        .map(
          (e) =>
            `"${e.id}","${e.farmName}","${e.targetMonth}/${e.targetYear}",${e.predictedYieldKg},${e.lowerBoundKg},${e.upperBoundKg},${e.requiredSacks60kg},${e.estimatedLaborers},"${e.createdAt}"`
        )
        .join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `visireka_riwayat_terpadu_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VisirekaAppShell
      title="Riwayat Terpadu Hasil Analisis AI"
      subtitle="Arsip data pemeriksaan kualitas citra CNN dan proyeksi volume panen regresi linear"
    >
      <div className="space-y-6">
        {/* Top Filter and Controls Bar */}
        <div className="p-4 sm:p-5 rounded-3xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter Tabs (Matches Figma) */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border text-xs font-bold">
              <button
                onClick={() => setActiveTab("semua")}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === "semua" ? "bg-emerald-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua Riwayat
              </button>
              <button
                onClick={() => setActiveTab("cnn")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === "cnn" ? "bg-emerald-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FiCamera className="w-3.5 h-3.5" />
                <span>Inspeksi CNN ({filteredInspections.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("regresi")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === "regresi" ? "bg-amber-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FiTrendingUp className="w-3.5 h-3.5" />
                <span>Estimasi Regresi ({filteredEstimates.length})</span>
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <FiDownload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor Data CSV</span>
            </button>
          </div>

          {/* Search & Sub-Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <div className="relative flex-1 w-full">
              <FiSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari kode batch, nama petak kebun, atau tahun..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {(activeTab === "cnn" || activeTab === "semua") && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <FiFilter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-auto"
                >
                  <option value="all">Semua Grade Mutu</option>
                  <option value="Grade 1">Grade 1 (Premium)</option>
                  <option value="Grade 2">Grade 2 (Standar)</option>
                  <option value="Grade 3">Grade 3 (Komersial)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CARDS LIST SECTION */}
        {/* ===================================================================== */}
        <div className="space-y-6">
          {/* SECTION A: RIWAYAT CNN */}
          {(activeTab === "semua" || activeTab === "cnn") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <FiCamera className="text-emerald-600" />
                  <span>Riwayat Pemeriksaan Kualitas Citra (CNN)</span>
                </h3>
                <span className="text-xs text-muted-foreground">{filteredInspections.length} Rekaman</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInspections.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-3xl border border-border bg-card hover:border-emerald-500/50 hover:shadow-md transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {item.batchCode}
                          </span>
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.farmName}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
                          {item.assignedGrade}
                        </span>
                      </div>

                      {/* Image Thumbnail & Stats */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border bg-muted shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl || "/images/coffee-beans-sample.jpg"}
                            alt={item.batchCode}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span>Total Objek:</span>
                            <strong className="text-foreground">{item.totalObjectsCount || 20} Butir</strong>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <FiCheckCircle className="w-3 h-3" />
                            <span>Normal: {item.normalObjectsCount || 19} Butir</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-rose-500">
                            <FiAlertTriangle className="w-3 h-3" />
                            <span>Cacat: {item.defectObjectsCount || 1} Butir ({item.overallDefectRate}%)</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-muted-foreground" />
                        <span>{item.inspectionDate}</span> • <span>{item.inspectorName}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedInspection(item)}
                      className="w-full py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>Lihat Detail & Bounding Box</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION B: RIWAYAT LINEAR REGRESSION */}
          {(activeTab === "semua" || activeTab === "regresi") && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <FiTrendingUp className="text-amber-600" />
                  <span>Riwayat Estimasi Produksi Panen (Linear Regression)</span>
                </h3>
                <span className="text-xs text-muted-foreground">{filteredEstimates.length} Rekaman</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEstimates.map((est) => (
                  <div
                    key={est.id}
                    className="p-4 sm:p-5 rounded-3xl border border-border bg-card hover:border-amber-500/50 hover:shadow-md transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                            Target: {est.targetMonth === 6 ? "Juni" : "Juli"} {est.targetYear}
                          </span>
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">{est.farmName}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shrink-0">
                          Regresi Linear
                        </span>
                      </div>

                      {/* Yield Metric */}
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">
                          Hasil Estimasi Panen:
                        </p>
                        <p className="text-2xl font-black text-foreground">
                          {est.predictedYieldKg.toLocaleString()}{" "}
                          <span className="text-sm font-bold text-amber-600">kg</span>
                          <span className="text-[11px] font-normal text-muted-foreground ml-2">
                            ({(est.predictedYieldKg / 1000).toFixed(2)} Ton)
                          </span>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          95% CI: {est.lowerBoundKg.toLocaleString()} - {est.upperBoundKg.toLocaleString()} kg
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <FiPackage className="w-3.5 h-3.5 text-amber-600" />
                          <span>{est.requiredSacks60kg} Karung</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <FiUsers className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{est.estimatedLaborers} Pemetik</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <FiCalendar className="w-3 h-3 text-muted-foreground" />
                        <span>Dihitung: {est.createdAt}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedEstimate(est)}
                      className="w-full py-2 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>Rincian Variabel Prediksi</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* MODAL DETAIL INSPEKSI CNN */}
        {/* ===================================================================== */}
        {selectedInspection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-card border border-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Detail Pemeriksaan CNN
                  </span>
                  <h3 className="text-base font-extrabold text-foreground">{selectedInspection.batchCode}</h3>
                </div>
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Image Preview & Defect Overlay info */}
              <div className="relative rounded-2xl overflow-hidden border border-border bg-black max-h-60 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedInspection.imageUrl || "/images/coffee-beans-sample.jpg"}
                  alt={selectedInspection.batchCode}
                  className="max-h-60 w-auto object-cover"
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Grade Mutu</span>
                  <strong className="text-foreground">{selectedInspection.assignedGrade}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Defect Rate</span>
                  <strong className="text-foreground">{selectedInspection.overallDefectRate}%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Total Objek</span>
                  <strong className="text-foreground">{selectedInspection.totalObjectsCount || 20} Butir</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Confidence</span>
                  <strong className="text-foreground">{(selectedInspection.confidenceScore * 100).toFixed(1)}%</strong>
                </div>
              </div>

              {/* Defect breakdown & recommendation */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-xs space-y-1.5">
                <p className="font-bold text-foreground">Rekomendasi Sortasi Pasca-Panen:</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{selectedInspection.recommendation}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Link
                  href="/inspeksi"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <FiCamera className="w-3.5 h-3.5" />
                  <span>Buka di Scanner Interaktif</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL DETAIL ESTIMASI REGRESI */}
        {/* ===================================================================== */}
        {selectedEstimate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg p-6 rounded-3xl bg-card border border-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    Rincian Estimasi Regresi Linear
                  </span>
                  <h3 className="text-base font-extrabold text-foreground">{selectedEstimate.farmName}</h3>
                </div>
                <button
                  onClick={() => setSelectedEstimate(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Total Proyeksi Tonase Panen:</p>
                <p className="text-3xl font-black text-foreground">
                  {selectedEstimate.predictedYieldKg.toLocaleString()} kg
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Batas Bawah: {selectedEstimate.lowerBoundKg.toLocaleString()} kg • Batas Atas: {selectedEstimate.upperBoundKg.toLocaleString()} kg
                </p>
              </div>

              {/* Variables List */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-foreground">Variabel Masukan Prediktor:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground block">Luas Lahan:</span>
                    <strong>{selectedEstimate.inputArea} Ha</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground block">Populasi Pohon:</span>
                    <strong>{selectedEstimate.inputTreeCount.toLocaleString()} Pohon</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground block">Curah Hujan Proyeksi:</span>
                    <strong>{selectedEstimate.inputRainfall} mm/bulan</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground block">Suhu Rata-rata:</span>
                    <strong>{selectedEstimate.inputTemp} °C</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Link
                  href="/estimasi"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <FiTrendingUp className="w-3.5 h-3.5" />
                  <span>Buka Modul Estimasi</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </VisirekaAppShell>
  );
}
