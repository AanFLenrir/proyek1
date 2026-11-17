"use client";

import { useState } from "react";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialFarms,
  runRegressionEstimate,
  HarvestEstimate,
} from "@/lib/visireka-store";
import {
  FiTrendingUp,
  FiCpu,
  FiAlertCircle,
  FiLayers,
  FiCheckCircle,
  FiDownload,
  FiUsers,
  FiPackage,
  FiInfo,
} from "react-icons/fi";

export default function EstimasiPage() {
  const [farms] = useState(initialFarms);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0].id);
  const [targetYear, setTargetYear] = useState(2026);
  const [targetMonth, setTargetMonth] = useState(6);

  // Form parameter agroklimat
  const [rainfallMm, setRainfallMm] = useState<number | string>(125);
  const [avgTempC, setAvgTempC] = useState<number | string>(20.8);
  const [prevYieldKg, setPrevYieldKg] = useState<number | string>(10600);

  // Validasi & Status
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimateResult, setEstimateResult] = useState<HarvestEstimate | null>(null);

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];

  // Validasi Input Numerik (UC-09 & UC-10)
  const validateInputs = () => {
    const errs: { [key: string]: string } = {};

    const rain = Number(rainfallMm);
    const temp = Number(avgTempC);
    const prev = Number(prevYieldKg);

    if (isNaN(rain) || rainfallMm === "") {
      errs.rainfall = "Curah hujan harus berupa angka valid.";
    } else if (rain < 0 || rain > 800) {
      errs.rainfall = "Curah hujan rasional berkisar antara 0 - 800 mm/bulan.";
    }

    if (isNaN(temp) || avgTempC === "") {
      errs.temp = "Suhu harus berupa angka numerik valid.";
    } else if (temp < 10 || temp > 35) {
      errs.temp = "Suhu dataran tinggi Arabika rasional antara 10 - 35 °C.";
    }

    if (isNaN(prev) || prevYieldKg === "") {
      errs.prevYield = "Data panen sebelumnya harus diisi angka.";
    } else if (prev < 0) {
      errs.prevYield = "Volume panen tidak boleh bernilai negatif.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;

    setIsCalculating(true);
    setTimeout(() => {
      const res = runRegressionEstimate({
        farm: selectedFarm,
        targetYear: Number(targetYear),
        targetMonth: Number(targetMonth),
        rainfallMm: Number(rainfallMm),
        avgTempC: Number(avgTempC),
        prevYieldKg: Number(prevYieldKg),
      });

      setEstimateResult(res);
      setIsCalculating(false);
    }, 600);
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <VisirekaAppShell
      title="Estimasi Volume Produksi Panen (Regresi Linear)"
      subtitle="Peramalan hasil panen multivariat berdasarkan luas lahan, umur pohon, dan variabel agroklimat"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Banner Metodologi Formulasi */}
        <div className="p-4 rounded-xl bg-muted/60 border border-border flex items-start gap-3 text-xs text-muted-foreground">
          <FiCpu className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              Formulasi Model: Multivariate Ordinary Least Squares (OLS)
            </p>
            <p>
              Y = &beta;<sub>0</sub> + &beta;<sub>1</sub>(Luas Lahan) + &beta;<sub>2</sub>(Populasi Pohon) + &beta;<sub>3</sub>(Umur Tanaman) + &beta;<sub>4</sub>(Curah Hujan) + &beta;<sub>5</sub>(Suhu) + &beta;<sub>6</sub>(Panen t-1)
            </p>
            <p>
              Persamaan ini memodelkan korelasi saintifik variabel agroklimat dengan kapasitas panen aktual untuk memitigasi risiko defisit logistik gudang.
            </p>
          </div>
        </div>

        {/* Grid Input Form & Detail Kebun */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri: Profil Kebun Terpilih */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FiLayers className="w-4 h-4 text-emerald-600" />
              <span>Target Blok Perkebunan</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pilih Kebun</label>
              <select
                value={selectedFarmId}
                onChange={(e) => {
                  setSelectedFarmId(e.target.value);
                  setEstimateResult(null);
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.blockCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Spesifikasi Kebun Terpilih */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Luas Lahan:</span>
                <span className="font-bold text-foreground">{selectedFarm.areaHectares} Ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Pohon:</span>
                <span className="font-bold text-foreground">{selectedFarm.treeCount.toLocaleString()} Pohon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ketinggian:</span>
                <span className="font-bold text-foreground">{selectedFarm.elevationMasl} mdpl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Umur Tanaman:</span>
                <span className="font-bold text-foreground">{selectedFarm.treeAgeYears} Tahun</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Varietas Kopi:</span>
                <span className="font-bold text-foreground truncate max-w-[120px]">{selectedFarm.variety}</span>
              </div>
            </div>
          </div>

          {/* Kolom Tengah & Kanan: Formulir Parameter Agroklimat & Validasi */}
          <div className="md:col-span-2 p-5 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-amber-600" />
              <span>Input Parameter Musim Panen & Agroklimat</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tahun Target Proyeksi</label>
                <input
                  type="number"
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  min={2026}
                  max={2030}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Bulan Target Panen</label>
                <select
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {monthNames.map((m, idx) => (
                    <option key={idx} value={idx + 1}>
                      Bulan {idx + 1} — {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Proyeksi Curah Hujan (mm/bulan)
                </label>
                <input
                  type="number"
                  step="any"
                  value={rainfallMm}
                  onChange={(e) => setRainfallMm(e.target.value)}
                  placeholder="Misal: 125"
                  className={`w-full bg-background border rounded-lg px-3 py-2 text-xs font-medium outline-none transition ${
                    errors.rainfall ? "border-rose-500 ring-1 ring-rose-500" : "border-border focus:ring-2 focus:ring-emerald-500"
                  }`}
                />
                {errors.rainfall && (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.rainfall}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Suhu Rerata Dataran Tinggi (°C)
                </label>
                <input
                  type="number"
                  step="any"
                  value={avgTempC}
                  onChange={(e) => setAvgTempC(e.target.value)}
                  placeholder="Misal: 20.8"
                  className={`w-full bg-background border rounded-lg px-3 py-2 text-xs font-medium outline-none transition ${
                    errors.temp ? "border-rose-500 ring-1 ring-rose-500" : "border-border focus:ring-2 focus:ring-emerald-500"
                  }`}
                />
                {errors.temp && (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.temp}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Volume Hasil Panen Periode Sebelumnya (kg)
                </label>
                <input
                  type="number"
                  step="any"
                  value={prevYieldKg}
                  onChange={(e) => setPrevYieldKg(e.target.value)}
                  placeholder="Misal: 10600"
                  className={`w-full bg-background border rounded-lg px-3 py-2 text-xs font-medium outline-none transition ${
                    errors.prevYield ? "border-rose-500 ring-1 ring-rose-500" : "border-border focus:ring-2 focus:ring-emerald-500"
                  }`}
                />
                {errors.prevYield && (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.prevYield}
                  </p>
                )}
              </div>
            </div>

            {/* Tombol Eksekusi Regresi */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition flex items-center gap-2"
              >
                <FiTrendingUp className="w-4 h-4" />
                <span>{isCalculating ? "Menghitung Matriks Regresi OLS..." : "Jalankan Estimasi Regresi"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hasil Peramalan Regresi Linear (UC-12 & UC-13) */}
        {estimateResult && (
          <div className="p-6 rounded-2xl border border-amber-500/40 bg-card shadow-lg space-y-6 animate-in fade-in duration-300">
            {/* Header Hasil Proyeksi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                    Estimasi Panen Berhasil Dihitung
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    DEMO SIMULASI REGRESI OLS (SIAP REST API)
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                    Tersimpan di Memori Riwayat
                  </span>
                </div>
                <h2 className="text-xl font-black text-foreground mt-1">
                  Proyeksi: {monthNames[estimateResult.targetMonth - 1]} {estimateResult.targetYear}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {estimateResult.farmName} • Tanggal Analisis: {estimateResult.createdAt}
                </p>
              </div>

              {/* Tonase Card */}
              <div className="text-right">
                <span className="text-xs text-muted-foreground font-semibold">Estimasi Total Panen:</span>
                <div className="text-3xl font-black text-amber-600">
                  {estimateResult.predictedYieldKg.toLocaleString()} kg
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  ≈ {(estimateResult.predictedYieldKg / 1000).toFixed(2)} Ton
                </span>
              </div>
            </div>

            {/* Grid Metrik & Perencanaan Logistik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Rentang Nilai (95% CI)</span>
                  <FiInfo className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-base font-bold text-foreground">
                  {estimateResult.lowerBoundKg.toLocaleString()} - {estimateResult.upperBoundKg.toLocaleString()} kg
                </div>
                <p className="text-[11px] text-muted-foreground">Margin error estimasi $\pm 6.5\%$</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Kebutuhan Karung Goni</span>
                  <FiPackage className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-black text-purple-600">
                  {estimateResult.requiredSacks60kg} Karung
                </div>
                <p className="text-[11px] text-muted-foreground">Kapasitas standar 60 kg/karung gudang</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Kebutuhan Pemetik Panen</span>
                  <FiUsers className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-600">
                  {estimateResult.estimatedLaborers} Orang
                </div>
                <p className="text-[11px] text-muted-foreground">Siklus 15 hari petik ceri merah</p>
              </div>
            </div>

            {/* Visualisasi Kurva Proyeksi Interaktif (UC-13) */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Visualisasi Kurva Panen Riil vs Proyeksi Masa Depan
              </h4>
              <div className="h-44 w-full flex items-end gap-4 pt-4 border-b border-border pb-2 px-2">
                {[
                  { label: "Hist 1", val: 9800, isPred: false },
                  { label: "Hist 2", val: 10600, isPred: false },
                  { label: "Hist 3", val: 11900, isPred: false },
                  { label: "Target (P)", val: estimateResult.predictedYieldKg, isPred: true },
                ].map((item, idx) => {
                  const maxH = 15000;
                  const pct = Math.min(100, Math.round((item.val / maxH) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-bold text-foreground">
                        {(item.val / 1000).toFixed(1)}t
                      </span>
                      <div
                        style={{ height: `${pct}%` }}
                        className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                          item.isPred
                            ? "bg-amber-500 border-2 border-dashed border-amber-600 shadow-md animate-pulse"
                            : "bg-emerald-600"
                        }`}
                      />
                      <span className="text-[11px] text-muted-foreground">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Ekspor */}
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FiDownload className="w-3.5 h-3.5" />
                <span>Unduh Laporan Logistik PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </VisirekaAppShell>
  );
}
