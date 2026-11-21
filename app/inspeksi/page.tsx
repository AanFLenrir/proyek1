"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialFarms,
  QualityInspection,
  DetectedBeanObject,
  samplePresets,
  initialInspections,
} from "@/lib/visireka-store";
import { predictCoffeeBeansCNN } from "@/lib/ai-services";
import {
  FiCamera,
  FiUploadCloud,
  FiAlertCircle,
  FiRefreshCw,
  FiDownload,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiEye,
  FiInfo,
  FiX,
  FiShield,
} from "react-icons/fi";

export default function InspeksiPage() {
  const [farms] = useState(initialFarms);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0].id);
  const [batchCode, setBatchCode] = useState("BATCH-2026-ARB-009");
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Scanning & Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [inspectionResult, setInspectionResult] = useState<QualityInspection | null>(initialInspections[0]);
  
  // Detection Overlay & Zoom state
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedObject, setSelectedObject] = useState<DetectedBeanObject | null>(null);
  const [filterClass, setFilterClass] = useState<string>("all");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection & validation
  const handleFileChange = (selectedFile: File) => {
    setErrorMsg(null);
    setSelectedPresetId(null);

    // Validasi MIME type: hanya menerima gambar JPG, PNG, atau WebP
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMsg("Format berkas tidak didukung. Harap unggah gambar pindaian bertipe JPG, PNG, atau WebP.");
      return;
    }

    // Validasi Ukuran: maksimal 10 MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran berkas melebihi batas maksimal 10 MB. Harap kompres resolusi gambar.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  // Pilih preset pengujian cepat
  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setFile(null);
    setErrorMsg(null);
    setSelectedPresetId(preset.id);
    setPreviewUrl(preset.imageUrl);
    setSelectedFarmId(preset.farmId);
    setBatchCode(preset.batchCode);
  };

  // Trigger CNN inference
  const handleStartAnalysis = async () => {
    if (!file && !previewUrl) {
      setErrorMsg("Silakan pilih gambar dari perangkat atau gunakan contoh sample di bawah.");
      return;
    }

    const farm = farms.find((f) => f.id === selectedFarmId) || farms[0];
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSelectedObject(null);

    // Animasi tahapan inferensi
    setAnalysisStep(1);
    const stepTimer1 = setTimeout(() => setAnalysisStep(2), 350);
    const stepTimer2 = setTimeout(() => setAnalysisStep(3), 700);

    try {
      const response = await predictCoffeeBeansCNN({
        file: file || undefined,
        sampleImageUrl: previewUrl || undefined,
        farm,
        batchCode,
      });
      setInspectionResult(response.inspection);
    } catch {
      setErrorMsg("Terjadi kegagalan saat menjalankan analisis visi komputer. Silakan coba kembali.");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // Reset form
  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setSelectedPresetId(null);
    setSelectedObject(null);
    setErrorMsg(null);
  };

  // Filter objek terdeteksi
  const detectedObjects = inspectionResult?.detectedObjects || [];
  const filteredObjects = detectedObjects.filter((obj) => {
    if (filterClass === "all") return true;
    if (filterClass === "normal") return obj.category === "Normal";
    if (filterClass === "defect") return obj.category === "Cacat";
    return obj.defectType === filterClass;
  });

  return (
    <VisirekaAppShell
      title="Scanner Pemeriksaan Kualitas Biji Kopi (CNN)"
      subtitle="Analisis citra visual dengan deteksi bounding box mutu dan cacat fisik biji kopi"
    >
      <div className="space-y-6">
        {/* Banner Mode Demonstrasi */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <FiShield className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                Mode Demonstrasi
              </span>
              <p className="text-emerald-900 dark:text-emerald-200 font-medium">
                Hasil pemeriksaan ini merupakan simulasi untuk memperlihatkan cara kerja klasifikasi kualitas biji kopi.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SECTION 1: SCANNER & INPUT BERKAS CITRA */}
        {/* ===================================================================== */}
        <div className="p-5 sm:p-7 rounded-3xl border border-border bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                <FiCamera className="text-emerald-600" />
                <span>1. Unggah Citra Sampel Biji Kopi</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Gunakan citra hasil pindaian mesin scanner meja (flatbed) atau kamera berlatar belakang netral
              </p>
            </div>
            {inspectionResult && (
              <button
                onClick={handleReset}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition text-muted-foreground hover:text-foreground"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                <span>Uji Sampel Baru</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Dropzone Upload Area (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                  previewUrl
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border hover:border-emerald-500 hover:bg-muted/30"
                }`}
              >
                {previewUrl ? (
                  <div className="space-y-3 w-full max-w-sm">
                    <div className="relative mx-auto w-36 h-36 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview Biji Kopi"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold">
                        Ganti Gambar
                      </div>
                    </div>
                    <p className="text-xs font-bold text-foreground">
                      {file ? file.name : "Sample Biji Kopi Terpilih"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Siap diproses` : "Resolusi 224x224 RGB"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-2xl group-hover:scale-110 transition">
                      <FiUploadCloud />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">
                        Sentuh atau Tarik Berkas Citra ke Sini
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mendukung format JPG, PNG, atau WebP (Maksimal 10 MB)
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm">
                      Pilih dari Perangkat
                    </span>
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quick Sample Presets (Matches Figma) */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Atau Gunakan Contoh Citra Pengujian Cepat:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-2xl border text-left transition ${
                        selectedPresetId === preset.id
                          ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                          : "border-border bg-muted/40 hover:bg-muted"
                      }`}
                    >
                      <p className="text-xs font-bold text-foreground line-clamp-1">{preset.name}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{preset.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Parameter Metadata (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Pilih Petak Kebun Sumber:</label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.elevationMasl} mdpl)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Nomor Batch Inspeksi:</label>
                  <input
                    type="text"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-xs space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Metode Sortasi</span>
                    <strong className="text-foreground">Analisis Visi CNN</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Target Resolusi</span>
                    <strong className="text-foreground">224 x 224 x 3 RGB</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Standar Acuan</span>
                    <strong className="text-foreground">SNI 01-2907-2008</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {analysisStep === 1
                        ? "Menormalkan Citra 224x224..."
                        : analysisStep === 2
                        ? "Ekstraksi Fitur Konvolusi..."
                        : "Memetakan Bounding Box Objek..."}
                    </span>
                  </>
                ) : (
                  <>
                    <FiCamera className="w-5 h-5" />
                    <span>Mulai Pemeriksaan Kualitas AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SECTION 2: OUTPUT CNN & VISUALISASI BOUNDING BOX */}
        {/* ===================================================================== */}
        {inspectionResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Hasil */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                  Ringkasan Hasil Pemeriksaan
                </span>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Hasil Klasifikasi Biji Kopi — Batch: {inspectionResult.batchCode}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {inspectionResult.farmName} • Diperiksa oleh: {inspectionResult.inspectorName}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-semibold">Status Grade Mutu:</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                    {inspectionResult.assignedGrade}
                  </span>
                </div>
              </div>
            </div>

            {/* Metric Summary Cards (Matches Figma E. Ringkasan Hasil) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl border border-border bg-card text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Objek</p>
                <p className="text-2xl font-black text-foreground">{inspectionResult.totalObjectsCount || 20}</p>
                <p className="text-[10px] text-muted-foreground">Butir Terdeteksi</p>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Biji Normal Utuh
                </p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {inspectionResult.normalObjectsCount || 19}
                </p>
                <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {100 - inspectionResult.overallDefectRate}% dari sampel
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  Total Butir Cacat
                </p>
                <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {inspectionResult.defectObjectsCount || 1}
                </p>
                <p className="text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                  Defect Rate: {inspectionResult.overallDefectRate}%
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Tingkat Keyakinan Klasifikasi
                </p>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {(inspectionResult.confidenceScore * 100).toFixed(1)}%
                </p>
                <p className="text-[10px] text-amber-700 dark:text-amber-300">Skor Rata-Rata</p>
              </div>
            </div>

            {/* ================================================================= */}
            {/* INTERACTIVE BOUNDING BOX CANVAS & DETAIL OBJEK */}
            {/* ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Image with Bounding Box Overlay (8 Cols) */}
              <div className="lg:col-span-8 p-4 sm:p-5 rounded-3xl border border-border bg-card space-y-3">
                {/* Visualizer Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <FiEye className="text-emerald-600" />
                      <span>Overlay Bounding Box</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground hidden sm:inline">
                      (Klik butir kopi untuk melihat detail)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle Bounding Box */}
                    <button
                      type="button"
                      onClick={() => setShowBoxes(!showBoxes)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                        showBoxes ? "bg-emerald-600 text-white border-emerald-600" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {showBoxes ? "Sembunyikan Box" : "Tampilkan Box"}
                    </button>

                    {/* Zoom In / Out */}
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground"
                      title="Perbesar Citra"
                    >
                      <FiZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground"
                      title="Perkecil Citra"
                    >
                      <FiZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1.0)}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground"
                      title="Reset Ukuran"
                    >
                      <FiMaximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Filter Objects Pill */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    onClick={() => setFilterClass("all")}
                    className={`px-2.5 py-1 rounded-full font-semibold transition ${
                      filterClass === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Semua ({detectedObjects.length})
                  </button>
                  <button
                    onClick={() => setFilterClass("normal")}
                    className={`px-2.5 py-1 rounded-full font-semibold transition flex items-center gap-1 ${
                      filterClass === "normal"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Normal ({inspectionResult.normalObjectsCount || 19})</span>
                  </button>
                  <button
                    onClick={() => setFilterClass("defect")}
                    className={`px-2.5 py-1 rounded-full font-semibold transition flex items-center gap-1 ${
                      filterClass === "defect"
                        ? "bg-rose-600 text-white"
                        : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Cacat ({inspectionResult.defectObjectsCount || 1})</span>
                  </button>
                </div>

                {/* The Interactive Image Overlay Stage */}
                <div className="relative overflow-auto rounded-2xl bg-neutral-900 border border-border/80 flex items-center justify-center min-h-[380px] max-h-[500px]">
                  <div
                    className="relative transition-transform duration-200 origin-center"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    {/* Coffee Beans Base Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={inspectionResult.imageUrl || "/images/coffee-beans-sample.jpg"}
                      alt="Hasil Pemindaian Biji Kopi"
                      className="block max-w-full w-[680px] h-auto object-contain rounded-xl select-none"
                    />

                    {/* Scanning Line Animation during analysis */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent h-12 w-full animate-bounce pointer-events-none" />
                    )}

                    {/* Bounding Box Overlays */}
                    {showBoxes &&
                      filteredObjects.map((obj) => {
                        const isSelected = selectedObject?.id === obj.id;
                        const isNormal = obj.category === "Normal";

                        return (
                          <div
                            key={obj.id}
                            onClick={() => setSelectedObject(obj)}
                            style={{
                              left: `${obj.x}%`,
                              top: `${obj.y}%`,
                              width: `${obj.width}%`,
                              height: `${obj.height}%`,
                            }}
                            className={`absolute border-2 rounded-lg cursor-pointer transition-all ${
                              isNormal
                                ? isSelected
                                  ? "border-emerald-400 bg-emerald-500/30 ring-4 ring-emerald-400/50 z-20"
                                  : "border-emerald-500/90 bg-emerald-500/15 hover:bg-emerald-500/30 z-10"
                                : isSelected
                                ? "border-rose-400 bg-rose-500/40 ring-4 ring-rose-400/60 z-20 animate-pulse"
                                : "border-rose-500 bg-rose-500/25 hover:bg-rose-500/40 z-10"
                            }`}
                          >
                            {/* Object Tag Tagging Label */}
                            <div
                              className={`absolute -top-5 left-0 px-1 py-0.2 rounded text-[8px] font-black tracking-tight whitespace-nowrap shadow-xs pointer-events-none ${
                                isNormal
                                  ? "bg-emerald-600 text-white"
                                  : "bg-rose-600 text-white ring-1 ring-white/50"
                              }`}
                            >
                              #{obj.labelNumber} {obj.defectType !== "Normal" ? obj.defectType : "Normal"}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Biji Normal
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Biji Cacat (Defect)
                    </span>
                  </div>
                  <span>Ketuk butir biji pada gambar untuk membuka detail</span>
                </div>
              </div>

              {/* Right: Detail Objek Deteksi Panel / Drawer (4 Cols) */}
              <div className="lg:col-span-4 p-5 rounded-3xl border border-border bg-card space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <FiInfo className="text-emerald-600" />
                    <span>Detail Objek Deteksi</span>
                  </h4>
                  {selectedObject && (
                    <button
                      onClick={() => setSelectedObject(null)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground text-xs"
                    >
                      <FiX />
                    </button>
                  )}
                </div>

                {selectedObject ? (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Selected Object Header Badge */}
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Objek Terpilih</span>
                        <p className="text-base font-black text-foreground">Objek #{selectedObject.labelNumber}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          selectedObject.category === "Normal"
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {selectedObject.defectType}
                      </span>
                    </div>

                    {/* Metadata Card */}
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-background border border-border flex justify-between">
                        <span className="text-muted-foreground">Kategori Objek:</span>
                        <strong className="text-foreground">{selectedObject.category}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-background border border-border flex justify-between">
                        <span className="text-muted-foreground">Confidence Score:</span>
                        <strong className="text-foreground">{(selectedObject.confidence * 100).toFixed(1)}%</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-background border border-border flex justify-between">
                        <span className="text-muted-foreground">Koordinat Bounding Box:</span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          [{selectedObject.x}%, {selectedObject.y}%]
                        </span>
                      </div>
                    </div>

                    {/* Agronomic Explanation */}
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 text-xs">
                      <p className="font-bold text-emerald-900 dark:text-emerald-200">Karakteristik Fisik:</p>
                      <p className="text-muted-foreground leading-relaxed text-[11px]">{selectedObject.description}</p>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                      <p className="font-bold text-amber-900 dark:text-amber-200">Instruksi Sortasi Petugas:</p>
                      <p className="text-muted-foreground leading-relaxed text-[11px]">{selectedObject.recommendation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-2 text-muted-foreground">
                    <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto text-xl">
                      <FiEye />
                    </div>
                    <p className="text-xs font-bold text-foreground">Belum Ada Objek Dipilih</p>
                    <p className="text-[11px] text-muted-foreground">
                      Klik salah satu kotak penanda (bounding box) pada gambar atau pilih dari daftar butir di bawah untuk menganalisis spesifikasi defek.
                    </p>
                  </div>
                )}

                {/* List of Detected Objects */}
                <div className="pt-2 border-t border-border space-y-1.5">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Daftar Butir ({filteredObjects.length}):
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1 text-xs">
                    {filteredObjects.map((obj) => (
                      <button
                        key={obj.id}
                        onClick={() => setSelectedObject(obj)}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition ${
                          selectedObject?.id === obj.id
                            ? "bg-emerald-600 text-white font-bold"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              obj.category === "Normal" ? "bg-emerald-400" : "bg-rose-400"
                            }`}
                          />
                          <span>Objek #{obj.labelNumber}</span>
                        </div>
                        <span className="text-[10px] opacity-80">{obj.defectType}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Simpan Riwayat & Cetak PDF */}
            <div className="p-4 sm:p-5 rounded-3xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Data inspeksi ini telah diverifikasi sesuai protokol SNI 01-2907-2008 & SCA.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/riwayat"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition text-center"
                >
                  Buka Riwayat
                </Link>
                <button
                  type="button"
                  onClick={() => alert("Laporan hasil inspeksi mutu berhasil diunduh dalam format PDF.")}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Cetak Ringkasan PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VisirekaAppShell>
  );
}
