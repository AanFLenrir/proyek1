"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialFarms,
  runCNNInspection,
  QualityInspection,
} from "@/lib/visireka-store";
import {
  FiCamera,
  FiUploadCloud,
  FiAlertCircle,
  FiCheckCircle,
  FiCpu,
  FiRefreshCw,
  FiDownload,
  FiFileText,
  FiLayers,
} from "react-icons/fi";

export default function InspeksiPage() {
  const [farms] = useState(initialFarms);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0].id);
  const [batchCode, setBatchCode] = useState("BATCH-2026-ARB-009");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<QualityInspection | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection & validation (UC-02 & UC-03)
  const handleFileChange = (selectedFile: File) => {
    setErrorMsg(null);
    setInspectionResult(null);

    // Validasi MIME type: hanya menerima gambar JPG atau PNG
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMsg("Format berkas tidak didukung. Harap unggah gambar pindaian bertipe JPG atau PNG.");
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

  // Trigger CNN inference
  const handleStartAnalysis = async () => {
    if (!file) {
      setErrorMsg("Silakan pilih atau unggah berkas gambar biji kopi terlebih dahulu.");
      return;
    }

    const farm = farms.find((f) => f.id === selectedFarmId) || farms[0];
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const result = await runCNNInspection(file, farm, batchCode);
      setInspectionResult(result);
    } catch (err) {
      setErrorMsg("Terjadi kegagalan saat menjalankan model CNN. Silakan coba kembali.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setInspectionResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <VisirekaAppShell
      title="Pemeriksaan Mutu Citra Biji Kopi (AI CNN)"
      subtitle="Klasifikasi kecacatan fisik biji kopi mentah (green beans 224x224) berbasis Deep Learning"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Info Card Metodologi */}
        <div className="p-4 rounded-xl bg-muted/60 border border-border flex items-start gap-3 text-xs text-muted-foreground">
          <FiCpu className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            Modul ini menggunakan arsitektur <strong>Convolutional Neural Network (CNN)</strong> dengan input 
            standar $224 \times 224 \times 3$ untuk mendeteksi proporsi cacat fisik primer dan sekunder sesuai standar 
            SCA (*Specialty Coffee Association*) dan SNI 01-2907-2008.
          </p>
        </div>

        {/* Form Upload & Parameter Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri: Parameter Batch & Kebun */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FiLayers className="w-4 h-4 text-emerald-600" />
              <span>Parameter Pengujian Sampel</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Blok Kebun Asal</label>
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.elevationMasl} mdpl)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Kode Batch Sampel</label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="Contoh: BATCH-2026-ARB-001"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-muted/50 border border-border/80 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Ketentuan Citra Uji:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Format: JPG atau PNG</li>
                <li>Ukuran berkas maksimal 10 MB</li>
                <li>Pencahayaan difus tanpa bayangan tajam</li>
                <li>Sampel biji diratakan di atas cawan/kertas putih</li>
              </ul>
            </div>
          </div>

          {/* Kolom Tengah & Kanan: Area Dropzone & Pratinjau Citra */}
          <div className="md:col-span-2 p-5 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FiCamera className="w-4 h-4 text-emerald-600" />
              <span>Unggah Citra Pindaian Biji Kopi</span>
            </h3>

            {/* Error Message Alert (UC-03 / Validasi Gagal) */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Dropzone Container */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] ${
                previewUrl
                  ? "border-emerald-500 bg-emerald-500/5"
                  : "border-border hover:border-emerald-500/60 bg-muted/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden border border-border shadow-md">
                    <img
                      src={previewUrl}
                      alt="Pratinjau Biji Kopi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{file?.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB • Klik untuk mengganti gambar
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                    <FiUploadCloud className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Klik untuk memilih berkas atau seret ke sini
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mendukung format JPG, JPEG, PNG (Maks. 10 MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {file && (
                <button
                  onClick={handleReset}
                  disabled={isAnalyzing}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold transition"
                >
                  Batal / Reset
                </button>
              )}
              <button
                onClick={handleStartAnalysis}
                disabled={!file || isAnalyzing}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengekstraksi Fitur Citra CNN...</span>
                  </>
                ) : (
                  <>
                    <FiCpu className="w-4 h-4" />
                    <span>Mulai Klasifikasi Mutu AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hasil Evaluasi Model CNN (UC-05) */}
        {inspectionResult && (
          <div className="p-6 rounded-2xl border border-emerald-500/40 bg-card shadow-lg space-y-6 animate-in fade-in duration-300">
            {/* Header Hasil */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    Hasil Klasifikasi Citra CNN Selesai
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    DEMO SIMULASI ALGORITMIS (SIAP REST API)
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                    Tersimpan di Memori Riwayat
                  </span>
                </div>
                <h2 className="text-xl font-black text-foreground mt-1">
                  Batch: {inspectionResult.batchCode}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {inspectionResult.farmName} • Tanggal: {inspectionResult.inspectionDate}
                </p>
              </div>

              {/* Grade Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`px-4 py-2 rounded-xl font-black text-sm tracking-wide border shadow-sm ${
                    inspectionResult.assignedGrade.includes("Grade 1")
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/40"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/40"
                  }`}
                >
                  {inspectionResult.assignedGrade}
                </div>
              </div>
            </div>

            {/* Metrik Utama Kualitas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Tingkat Kecacatan (Defect Rate)</span>
                <div className="text-2xl font-black text-foreground">
                  {inspectionResult.overallDefectRate}%
                </div>
                <p className="text-[11px] text-muted-foreground">Berdasarkan rasio sampel visual 224x224</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Confidence Score Model</span>
                <div className="text-2xl font-black text-emerald-600">
                  {(inspectionResult.confidenceScore * 100).toFixed(1)}%
                </div>
                <p className="text-[11px] text-muted-foreground">Tingkat keyakinan inferensi Softmax</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Kesesuaian Standar SNI</span>
                <div className="text-lg font-bold text-foreground">
                  {inspectionResult.overallDefectRate <= 5 ? "Memenuhi Ekspor" : "Pasar Domestik"}
                </div>
                <p className="text-[11px] text-muted-foreground">Standar SNI 01-2907-2008</p>
              </div>
            </div>

            {/* Rincian Komposisi Cacat Fisik (Bar Breakdown) */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Rincian Analisis Partikel Biji Kopi
              </h4>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <FiCheckCircle className="w-3.5 h-3.5" /> Biji Sempurna / Utuh (Good Beans)
                    </span>
                    <span>{inspectionResult.defectBreakdown.goodBeans}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      style={{ width: `${inspectionResult.defectBreakdown.goodBeans}%` }}
                      className="bg-emerald-600 h-full rounded-full transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold">Black / Sour Beans</span>
                    <div className="text-base font-bold text-rose-600">
                      {inspectionResult.defectBreakdown.blackSour}%
                    </div>
                    <p className="text-[10px] text-muted-foreground">Fermentasi berlebih pohon</p>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold">Insect Damage (Borer)</span>
                    <div className="text-base font-bold text-amber-600">
                      {inspectionResult.defectBreakdown.insectDamage}%
                    </div>
                    <p className="text-[10px] text-muted-foreground">Lubang gerek serangga</p>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold">Broken / Chipped</span>
                    <div className="text-base font-bold text-orange-600">
                      {inspectionResult.defectBreakdown.brokenBeans}%
                    </div>
                    <p className="text-[10px] text-muted-foreground">Pecah mekanis mesin pulper</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rekomendasi Penanganan Pascapanen */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                Rekomendasi Pascapanen VISIREKA:
              </span>
              <p className="text-xs text-foreground leading-relaxed">
                {inspectionResult.recommendation}
              </p>
            </div>

            {/* Tombol Tindak Lanjut */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                ID Rekaman: <code className="font-mono">{inspectionResult.id}</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Cetak / Unduh Hasil PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  <FiCamera className="w-3.5 h-3.5" />
                  <span>Inspeksi Sampel Baru</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VisirekaAppShell>
  );
}
