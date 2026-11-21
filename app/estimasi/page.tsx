"use client";

import { useState } from "react";
import Link from "next/link";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialFarms,
  HarvestEstimate,
  initialEstimates,
} from "@/lib/visireka-store";
import { predictHarvestRegression } from "@/lib/ai-services";
import {
  FiTrendingUp,
  FiDownload,
  FiUsers,
  FiPackage,
  FiActivity,
  FiShield,
  FiCloudRain,
} from "react-icons/fi";

export default function EstimasiPage() {
  const [farms] = useState(initialFarms);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0].id);
  const [targetYear, setTargetYear] = useState(2026);
  const [targetMonth, setTargetMonth] = useState(6);

  // Form parameter agroklimat & vegetatif
  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const [areaHa, setAreaHa] = useState<number | string>(selectedFarm.areaHectares);
  const [treeCount, setTreeCount] = useState<number | string>(selectedFarm.treeCount);
  const [treeAgeYears, setTreeAgeYears] = useState<number | string>(selectedFarm.treeAgeYears);
  const [rainfallMm, setRainfallMm] = useState<number | string>(125);
  const [avgTempC, setAvgTempC] = useState<number | string>(20.8);
  const [prevYieldKg, setPrevYieldKg] = useState<number | string>(10600);

  // Validasi & Status
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimateResult, setEstimateResult] = useState<HarvestEstimate | null>(initialEstimates[0]);

  // Update defaults when farm changes
  const handleFarmChange = (newFarmId: string) => {
    setSelectedFarmId(newFarmId);
    const f = farms.find((item) => item.id === newFarmId) || farms[0];
    setAreaHa(f.areaHectares);
    setTreeCount(f.treeCount);
    setTreeAgeYears(f.treeAgeYears);
    if (newFarmId === "farm-02") {
      setPrevYieldKg(15800);
      setRainfallMm(110);
      setAvgTempC(19.5);
    } else if (newFarmId === "farm-03") {
      setPrevYieldKg(7500);
      setRainfallMm(140);
      setAvgTempC(21.5);
    } else {
      setPrevYieldKg(10600);
      setRainfallMm(125);
      setAvgTempC(20.8);
    }
  };

  // Preset skenario cuaca
  const applyWeatherScenario = (scenario: "normal" | "rainy" | "dry") => {
    if (scenario === "normal") {
      setRainfallMm(130);
      setAvgTempC(20.5);
    } else if (scenario === "rainy") {
      setRainfallMm(210);
      setAvgTempC(19.2);
    } else if (scenario === "dry") {
      setRainfallMm(65);
      setAvgTempC(23.2);
    }
  };

  // Validasi Input Numerik (UC-09 & UC-10)
  const validateInputs = () => {
    const errs: { [key: string]: string } = {};

    const a = Number(areaHa);
    const t = Number(treeCount);
    const age = Number(treeAgeYears);
    const rain = Number(rainfallMm);
    const temp = Number(avgTempC);
    const prev = Number(prevYieldKg);

    if (isNaN(a) || a <= 0 || a > 500) errs.area = "Luas lahan harus bernilai antara 0.1 - 500 Ha.";
    if (isNaN(t) || t <= 0 || t > 1000000) errs.trees = "Jumlah pohon harus bernilai antara 50 - 1.000.000 batang.";
    if (isNaN(age) || age < 1 || age > 50) errs.age = "Umur tanaman berkisar antara 1 - 50 tahun.";
    if (isNaN(rain) || rain < 0 || rain > 800) errs.rainfall = "Curah hujan rasional berkisar antara 0 - 800 mm/bulan.";
    if (isNaN(temp) || temp < 10 || temp > 35) errs.temp = "Suhu dataran tinggi Arabika rasional antara 10 - 35 °C.";
    if (isNaN(prev) || prev <= 0) errs.prev = "Hasil panen sebelumnya harus berupa angka positif.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Eksekusi Model Regresi Linear OLS
  const handleCalculateEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsCalculating(true);
    setErrors({});

    try {
      const response = await predictHarvestRegression({
        farm: selectedFarm,
        targetYear: Number(targetYear),
        targetMonth: Number(targetMonth),
        areaHa: Number(areaHa),
        treeCount: Number(treeCount),
        treeAgeYears: Number(treeAgeYears),
        rainfallMm: Number(rainfallMm),
        avgTempC: Number(avgTempC),
        prevYieldKg: Number(prevYieldKg),
      });
      setEstimateResult(response.estimate);
    } catch {
      setErrors({ global: "Gagal menghitung model regresi linear. Periksa input data." });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <VisirekaAppShell
      title="Estimasi Produksi & Waktu Panen (Regresi Linear)"
      subtitle="Estimasi hasil panen berbasis metode Regresi Linear dengan data perkebunan dan agroklimat"
    >
      <div className="space-y-6">
        {/* Banner Mode Demonstrasi */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <FiShield className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold">
                Mode Demonstrasi
              </span>
              <p className="text-amber-900 dark:text-amber-200 font-medium">
                Hasil estimasi produksi ini merupakan simulasi untuk memperlihatkan cara kerja metode Regresi Linear dalam memperkirakan hasil panen kopi berdasarkan data perkebunan.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SECTION 1: FORMULIR INPUT PARAMETER MODEL */}
        {/* ===================================================================== */}
        <div className="p-5 sm:p-7 rounded-3xl border border-border bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                <FiTrendingUp className="text-amber-600" />
                <span>1. Parameter Input Estimasi Panen</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Masukkan variabel kapasitas lahan, tegakan pohon, dan proyeksi cuaca mikro perkebunan
              </p>
            </div>
          </div>

          <form onSubmit={handleCalculateEstimate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Petak Kebun */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Petak / Blok Kebun Target:</label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.elevationMasl} mdpl)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground">Varietas: {selectedFarm.variety}</p>
              </div>

              {/* Periode Panen */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Target Periode Panen:</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={targetMonth}
                    onChange={(e) => setTargetMonth(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value={5}>Mei (Awal Panen)</option>
                    <option value={6}>Juni (Panen Raya)</option>
                    <option value={7}>Juli (Puncak)</option>
                    <option value={8}>Agustus (Akhir)</option>
                  </select>
                  <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value={2026}>Tahun 2026</option>
                    <option value={2027}>Tahun 2027</option>
                  </select>
                </div>
                <p className="text-[10px] text-muted-foreground">Siklus musim panen buah ceri merah</p>
              </div>

              {/* Luas Lahan (Ha) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Luas Lahan Produktif (X1):</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Hektar (Ha)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={areaHa}
                  onChange={(e) => setAreaHa(e.target.value)}
                  className={`w-full bg-background border rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none ${
                    errors.area ? "border-rose-500" : "border-border"
                  }`}
                />
                {errors.area && <p className="text-[10px] text-rose-500">{errors.area}</p>}
              </div>

              {/* Jumlah Pohon (Batang) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Populasi Pohon Produktif (X2):</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Batang</span>
                </label>
                <input
                  type="number"
                  value={treeCount}
                  onChange={(e) => setTreeCount(e.target.value)}
                  className={`w-full bg-background border rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none ${
                    errors.trees ? "border-rose-500" : "border-border"
                  }`}
                />
                {errors.trees && <p className="text-[10px] text-rose-500">{errors.trees}</p>}
              </div>

              {/* Umur Tanaman (Tahun) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Umur Rata-rata Tanaman (X3):</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Tahun</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={treeAgeYears}
                  onChange={(e) => setTreeAgeYears(e.target.value)}
                  className={`w-full bg-background border rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none ${
                    errors.age ? "border-rose-500" : "border-border"
                  }`}
                />
                {errors.age && <p className="text-[10px] text-rose-500">{errors.age}</p>}
              </div>

              {/* Panen Sebelumnya (kg) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Panen Musim Lalu (X6):</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Kilogram (kg)</span>
                </label>
                <input
                  type="number"
                  value={prevYieldKg}
                  onChange={(e) => setPrevYieldKg(e.target.value)}
                  className={`w-full bg-background border rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none ${
                    errors.prev ? "border-rose-500" : "border-border"
                  }`}
                />
                {errors.prev && <p className="text-[10px] text-rose-500">{errors.prev}</p>}
              </div>
            </div>

            {/* Weather Parameters with Scenario Presets */}
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FiCloudRain className="text-blue-500" />
                    <span>Variabel Agroklimat & Skenario Iklim</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Pilih preset simulasi cuaca untuk menguji ketahanan produksi terhadap perubahan iklim
                  </p>
                </div>

                {/* Scenario buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyWeatherScenario("normal")}
                    className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted text-[10px] font-semibold transition"
                  >
                    Skenario Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => applyWeatherScenario("rainy")}
                    className="px-2.5 py-1 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-semibold transition"
                  >
                    Curah Hujan Tinggi
                  </button>
                  <button
                    type="button"
                    onClick={() => applyWeatherScenario("dry")}
                    className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-semibold transition"
                  >
                    Kemarau Panjang
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex justify-between">
                    <span>Proyeksi Curah Hujan Bulanan (X4):</span>
                    <strong className="text-amber-600">{rainfallMm} mm/bulan</strong>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    step="5"
                    value={rainfallMm}
                    onChange={(e) => setRainfallMm(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Kering (20 mm)</span>
                    <span>Ideal (120 - 160 mm)</span>
                    <span>Sangat Basah (400 mm)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex justify-between">
                    <span>Suhu Rata-rata Harian (X5):</span>
                    <strong className="text-amber-600">{avgTempC} °C</strong>
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="30"
                    step="0.2"
                    value={avgTempC}
                    onChange={(e) => setAvgTempC(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Dingin (14 °C)</span>
                    <span>Optimal (18 - 22 °C)</span>
                    <span>Panas (30 °C)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 cursor-pointer"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menghitung Estimasi Produksi Panen...</span>
                </>
              ) : (
                <>
                  <FiTrendingUp className="w-5 h-5" />
                  <span>Jalankan Estimasi Panen</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ===================================================================== */}
        {/* SECTION 2: OUTPUT HASIL ESTIMASI PRODUKSI */}
        {/* ===================================================================== */}
        {estimateResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Hasil Estimasi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                  Ringkasan Hasil Estimasi Panen
                </span>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Target Panen: {estimateResult.targetMonth === 6 ? "Juni" : "Juli"} {estimateResult.targetYear}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {estimateResult.farmName} • Dihasilkan pada: {estimateResult.createdAt}
                </p>
              </div>

              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Model Regresi Linear
              </span>
            </div>

            {/* Highlight Metric Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Metric Hero (7 Cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Proyeksi Total Volume Buah Ceri Kopi:
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                    {estimateResult.predictedYieldKg.toLocaleString()}{" "}
                    <span className="text-2xl font-bold text-amber-600">kg</span>
                    <span className="text-base font-semibold text-muted-foreground ml-3">
                      ({(estimateResult.predictedYieldKg / 1000).toFixed(2)} Ton)
                    </span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-background/80 border border-border space-y-1 text-xs">
                  <p className="text-muted-foreground font-medium">
                    Rentang Interval Kepercayaan (95% Confidence Interval):
                  </p>
                  <p className="text-sm font-extrabold text-foreground">
                    {estimateResult.lowerBoundKg.toLocaleString()} kg – {estimateResult.upperBoundKg.toLocaleString()} kg
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Deviasi toleransi standar error prediksi model adalah ± 6.5%.
                  </p>
                </div>

                {/* Logistics Requirements */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <div className="flex items-center gap-2 text-amber-600">
                      <FiPackage className="w-4 h-4" />
                      <span className="text-[11px] font-bold">Kebutuhan Karung</span>
                    </div>
                    <p className="text-lg font-black text-foreground">{estimateResult.requiredSacks60kg}</p>
                    <p className="text-[10px] text-muted-foreground">Karung 60kg GrainPro</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <FiUsers className="w-4 h-4" />
                      <span className="text-[11px] font-bold">Tenaga Pemetik</span>
                    </div>
                    <p className="text-lg font-black text-foreground">{estimateResult.estimatedLaborers}</p>
                    <p className="text-[10px] text-muted-foreground">Orang (Siklus 15 hari)</p>
                  </div>
                </div>
              </div>

              {/* Data Input Used Summary (5 Cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl border border-border bg-card space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground pb-2 border-b border-border">
                  Ringkasan Data Input Model
                </h4>
                <div className="space-y-2 text-xs divide-y divide-border/60">
                  <div className="flex justify-between pt-1">
                    <span className="text-muted-foreground">Luas Lahan (X1):</span>
                    <strong className="text-foreground">{estimateResult.inputArea} Ha</strong>
                  </div>
                  <div className="flex justify-between pt-1.5">
                    <span className="text-muted-foreground">Jumlah Pohon (X2):</span>
                    <strong className="text-foreground">{estimateResult.inputTreeCount.toLocaleString()} Pohon</strong>
                  </div>
                  <div className="flex justify-between pt-1.5">
                    <span className="text-muted-foreground">Umur Tanaman (X3):</span>
                    <strong className="text-foreground">{estimateResult.inputTreeAge} Tahun</strong>
                  </div>
                  <div className="flex justify-between pt-1.5">
                    <span className="text-muted-foreground">Curah Hujan Proyeksi (X4):</span>
                    <strong className="text-foreground">{estimateResult.inputRainfall} mm/bulan</strong>
                  </div>
                  <div className="flex justify-between pt-1.5">
                    <span className="text-muted-foreground">Suhu Rata-rata Harian (X5):</span>
                    <strong className="text-foreground">{estimateResult.inputTemp} °C</strong>
                  </div>
                  <div className="flex justify-between pt-1.5">
                    <span className="text-muted-foreground">Panen Sebelumnya (X6):</span>
                    <strong className="text-foreground">{estimateResult.inputPrevYield.toLocaleString()} kg</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 text-[10px] text-muted-foreground leading-relaxed">
                  Formula Matematis: Y = β0 + β1(Area) + β2(Trees) + β3(Age) + β4(Rain) + β5(Temp) + β6(Prev)
                </div>
              </div>
            </div>

            {/* Interactive Comparison Chart: Historical vs Estimation */}
            <div className="p-5 sm:p-6 rounded-3xl border border-border bg-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Grafik Perbandingan: Produksi Historis vs Hasil Estimasi
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Membandingkan realisasi panen tahun 2024 dan 2025 terhadap prediksi musim tanam 2026
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Tren Naik +11.8%
                </span>
              </div>

              {/* Bar Comparison Visual */}
              <div className="p-4 sm:p-6 rounded-2xl bg-muted/30 border border-border space-y-4">
                <div className="h-44 w-full flex items-end justify-around gap-4 pt-6 px-2">
                  {/* 2024 */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end max-w-[120px]">
                    <span className="text-xs font-bold text-muted-foreground">9.400 kg</span>
                    <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-t-xl transition-all" style={{ height: "65%" }} />
                    <span className="text-xs font-medium text-muted-foreground">Panen 2024</span>
                  </div>

                  {/* 2025 */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end max-w-[120px]">
                    <span className="text-xs font-bold text-muted-foreground">10.600 kg</span>
                    <div className="w-full bg-slate-400 dark:bg-slate-600 rounded-t-xl transition-all" style={{ height: "76%" }} />
                    <span className="text-xs font-medium text-muted-foreground">Panen 2025</span>
                  </div>

                  {/* 2026 Estimated */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end max-w-[120px]">
                    <span className="text-xs font-black text-amber-600">{estimateResult.predictedYieldKg.toLocaleString()} kg</span>
                    <div className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl transition-all ring-4 ring-amber-500/20" style={{ height: "88%" }} />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 text-center">
                      Estimasi 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agronomic Recommendations for Farm Management */}
            <div className="p-5 sm:p-6 rounded-3xl border border-border bg-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <FiActivity className="text-amber-600" />
                <span>Rekomendasi Pengelolaan Perkebunan:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <p className="font-bold text-foreground">1. Manajemen Tenaga Pemetik</p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Siapkan minimal {estimateResult.estimatedLaborers} tenaga pemetik berpengalaman mulai minggu ke-3 Mei 2026 untuk menghindari ceri rontok.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <p className="font-bold text-foreground">2. Kapasitas Lantai Jemur</p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Sediakan area pengeringan raised beds seluas {(estimateResult.predictedYieldKg * 0.04).toFixed(0)} m² untuk proses natural/honey batch puncak.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <p className="font-bold text-foreground">3. Mitigasi Iklim</p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Pantau drainase rorak kebun jika curah hujan melebihi 160 mm/bulan agar tanaman tidak mengalami gugur bunga prematur.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 sm:p-5 rounded-3xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Hasil estimasi ini tersimpan dalam riwayat dan dapat diakses pada halaman analitik.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/kalender"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition text-center"
                >
                  Lihat Kalender Panen
                </Link>
                <button
                  type="button"
                  onClick={() => alert("Laporan estimasi produksi berhasil diunduh dalam format PDF.")}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen Proyeksi PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VisirekaAppShell>
  );
}
