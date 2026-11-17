"use client";

import { useState } from "react";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialInspections,
  initialEstimates,
  QualityInspection,
} from "@/lib/visireka-store";
import {
  FiClock,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCamera,
  FiTrendingUp,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

export default function RiwayatPage() {
  const [activeTab, setActiveTab] = useState<"inspeksi" | "estimasi">("inspeksi");
  const [inspections] = useState(initialInspections);
  const [estimates] = useState(initialEstimates);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null);

  const filteredInspections = inspections.filter((i) => {
    const matchesSearch =
      i.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.farmName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === "all" || i.assignedGrade.includes(gradeFilter);
    return matchesSearch && matchesGrade;
  });

  const filteredEstimates = estimates.filter((e) => {
    return (
      e.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.targetYear.toString().includes(searchTerm)
    );
  });

  // Export to CSV function
  const handleExportCSV = () => {
    if (activeTab === "inspeksi") {
      const header = "ID,Kode Batch,Blok Kebun,Grade,Defect Rate,Confidence,Tanggal\n";
      const rows = filteredInspections
        .map((i) => `"${i.id}","${i.batchCode}","${i.farmName}","${i.assignedGrade}",${i.overallDefectRate},${i.confidenceScore},"${i.inspectionDate}"`)
        .join("\n");
      const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `visireka_riwayat_inspeksi_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const header = "ID,Kebun,Tahun,Bulan,Estimasi (kg),Kebutuhan Karung,Estimasi Pekerja,Tanggal Analisis\n";
      const rows = filteredEstimates
        .map((e) => `"${e.id}","${e.farmName}",${e.targetYear},${e.targetMonth},${e.predictedYieldKg},${e.requiredSacks60kg},${e.estimatedLaborers},"${e.createdAt}"`)
        .join("\n");
      const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `visireka_riwayat_estimasi_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <VisirekaAppShell
      title="Riwayat Terpadu Pemeriksaan & Estimasi"
      subtitle="Arsip data audit kualitas biji kopi dan peramalan panen terintegrasi basis data"
    >
      <div className="space-y-6">
        {/* Tab Navigasi & Kontrol Ekspor */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("inspeksi")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "inspeksi"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <FiCamera className="w-3.5 h-3.5" />
              <span>Inspeksi Citra (CNN)</span>
            </button>
            <button
              onClick={() => setActiveTab("estimasi")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "estimasi"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <FiTrendingUp className="w-3.5 h-3.5" />
              <span>Estimasi Panen (Regresi)</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <FiDownload className="w-3.5 h-3.5" />
            <span>Ekspor Format CSV</span>
          </button>
        </div>

        {/* Filter & Pencarian Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan kode batch, blok kebun, atau tahun..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {activeTab === "inspeksi" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FiFilter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full sm:w-auto bg-card border border-border rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Semua Grade Mutu</option>
                <option value="Grade 1">Grade 1 (Premium)</option>
                <option value="Grade 2">Grade 2 (Standar)</option>
                <option value="Grade 3">Grade 3 (Komersial)</option>
              </select>
            </div>
          )}
        </div>

        {/* Tampilan Tabel Riwayat Inspeksi */}
        {activeTab === "inspeksi" && (
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">Kode Batch</th>
                    <th className="py-2.5 px-3">Blok Kebun</th>
                    <th className="py-2.5 px-3">Grade Mutu</th>
                    <th className="py-2.5 px-3">Defect Rate</th>
                    <th className="py-2.5 px-3">Confidence Score</th>
                    <th className="py-2.5 px-3">Petugas QC</th>
                    <th className="py-2.5 px-3">Waktu Inspeksi</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInspections.map((i) => (
                    <tr key={i.id} className="hover:bg-muted/50 transition">
                      <td className="py-3 px-3 font-semibold text-foreground">{i.batchCode}</td>
                      <td className="py-3 px-3 text-muted-foreground">{i.farmName}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            i.assignedGrade.includes("Grade 1")
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                          }`}
                        >
                          {i.assignedGrade}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-foreground">{i.overallDefectRate}%</td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {(i.confidenceScore * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{i.inspectorName}</td>
                      <td className="py-3 px-3 text-muted-foreground">{i.inspectionDate}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setSelectedInspection(i)}
                          className="text-xs font-semibold text-emerald-600 hover:underline"
                        >
                          Rincian Cacat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tampilan Tabel Riwayat Estimasi */}
        {activeTab === "estimasi" && (
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">Target Periode</th>
                    <th className="py-2.5 px-3">Blok Kebun</th>
                    <th className="py-2.5 px-3">Estimasi Hasil (kg)</th>
                    <th className="py-2.5 px-3">Rentang 95% CI</th>
                    <th className="py-2.5 px-3">Kebutuhan Karung</th>
                    <th className="py-2.5 px-3">Tenaga Kerja</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Tanggal Eksekusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEstimates.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/50 transition">
                      <td className="py-3 px-3 font-semibold text-foreground">
                        Bulan {e.targetMonth} / {e.targetYear}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{e.farmName}</td>
                      <td className="py-3 px-3 font-black text-amber-600">
                        {e.predictedYieldKg.toLocaleString()} kg
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {e.lowerBoundKg.toLocaleString()} - {e.upperBoundKg.toLocaleString()} kg
                      </td>
                      <td className="py-3 px-3 text-foreground font-semibold">
                        {e.requiredSacks60kg} Karung (60kg)
                      </td>
                      <td className="py-3 px-3 text-foreground font-semibold">
                        {e.estimatedLaborers} Orang
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{e.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Rincian Cacat Inspeksi */}
        {selectedInspection && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Rincian Cacat: {selectedInspection.batchCode}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedInspection.farmName} • {selectedInspection.inspectionDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 space-y-1">
                  <span className="font-semibold text-foreground">Status Grade:</span>
                  <div className="text-lg font-black text-emerald-600">
                    {selectedInspection.assignedGrade}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Tingkat kecacatan total: <strong>{selectedInspection.overallDefectRate}%</strong> (Confidence: {(selectedInspection.confidenceScore * 100).toFixed(1)}%)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-emerald-600">Biji Sempurna (Good Beans):</span>
                    <span className="font-bold">{selectedInspection.defectBreakdown.goodBeans}%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-rose-600">Black / Sour Beans (Cacat Fermentasi):</span>
                    <span className="font-bold">{selectedInspection.defectBreakdown.blackSour}%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-amber-600">Insect Damage (Hama PBKo):</span>
                    <span className="font-bold">{selectedInspection.defectBreakdown.insectDamage}%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-orange-600">Broken / Chipped (Pecah Mesin):</span>
                    <span className="font-bold">{selectedInspection.defectBreakdown.brokenBeans}%</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-foreground">
                  <span className="font-bold text-emerald-600 block mb-1">Rekomendasi:</span>
                  <p className="leading-relaxed">{selectedInspection.recommendation}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-border">
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VisirekaAppShell>
  );
}
