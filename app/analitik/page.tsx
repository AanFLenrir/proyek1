"use client";

import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  FiCpu,
  FiTrendingUp,
  FiDownload,
} from "react-icons/fi";

export default function AnalitikPage() {
  const cnnMetrics = [
    { label: "Akurasi Pengujian (Test Accuracy)", value: "91.40%", desc: "500 citra uji independen 224x224" },
    { label: "Macro-Averaged F1-Score", value: "90.02%", desc: "Rata-rata harmonik multi-kelas mutu" },
    { label: "Presisi Rata-Rata (Precision)", value: "90.25%", desc: "Ketepatan prediksi terhadap cacat aktual" },
    { label: "Sensitivitas (Recall)", value: "89.80%", desc: "Kemampuan deteksi cacat tanpa terlewat" },
  ];

  const regMetrics = [
    { label: "Koefisien Determinasi (R²)", value: "0.842", desc: "84.2% variabilitas panen dapat dimodelkan" },
    { label: "Mean Absolute Error (MAE)", value: "185.4 kg", desc: "Rata-rata selisih absolut proyeksi" },
    { label: "Root Mean Squared Error (RMSE)", value: "242.1 kg", desc: "Penalti kuadrat terhadap deviasi ekstrim" },
    { label: "Normalized RMSE (nRMSE)", value: "11.2%", desc: "Toleransi galat sangat baik untuk logistik" },
  ];

  return (
    <VisirekaAppShell
      title="Analitik Kinerja Model AI & Evaluasi Mutu"
      subtitle="Evaluasi metrik saintifik model Convolutional Neural Network dan Regresi Linear Multivariat"
    >
      <div className="space-y-6">
        {/* Tombol Cetak Laporan Evaluasi */}
        <div className="flex justify-end">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <FiDownload className="w-3.5 h-3.5" />
            <span>Cetak / Unduh Laporan Analitik PDF</span>
          </button>
        </div>

        {/* Section 1: Kinerja Model CNN (Klasifikasi Citra) */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-600">
                <FiCpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Metrik Pengujian Model CNN (Klasifikasi Mutu Citra Biji Kopi)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Berdasarkan dataset terstandardisasi *Coffee Bean Dataset 224x224* (Gerald Piosenka, Kaggle)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Benchmark Riset Terstandarisasi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cnnMetrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                <span className="text-xs text-muted-foreground font-semibold">{m.label}</span>
                <div className="text-2xl font-black text-emerald-600">{m.value}</div>
                <p className="text-[11px] text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Confusion Matrix Mini Representation */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Distribusi Hasil Klasifikasi per Kategori Cacat
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">Good Beans (Utuh):</span>
                <span className="text-base font-bold text-emerald-600">95.2% Akurasi</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">Black / Sour:</span>
                <span className="text-base font-bold text-rose-600">89.6% Akurasi</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">Insect Damage:</span>
                <span className="text-base font-bold text-amber-600">88.4% Akurasi</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">Broken Beans:</span>
                <span className="text-base font-bold text-orange-600">92.4% Akurasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Kinerja Model Regresi Linear (Estimasi Panen) */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-600/10 text-amber-600">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Metrik Evaluasi Model Regresi Linear (Estimasi Panen)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pengujian *5-Fold Cross Validation* deret waktu agroklimat dan histori panen
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">
              Status: Layak Pakai
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {regMetrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                <span className="text-xs text-muted-foreground font-semibold">{m.label}</span>
                <div className="text-2xl font-black text-amber-600">{m.value}</div>
                <p className="text-[11px] text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Bobot Kontribusi Variabel Bebas (Feature Importance) */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Koefisien Parsial & Bobot Pengaruh Variabel Independen
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Populasi Pohon Produktif (Tree Count)</span>
                  <span className="font-bold">32% Kontribusi</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: "32%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Panen Siklus Sebelumnya (t-1 Yield)</span>
                  <span className="font-bold">28% Kontribusi</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "28%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Curah Hujan Fase Pembungaan (Rainfall mm)</span>
                  <span className="font-bold">22% Kontribusi</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "22%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Luas Lahan Produktif (Farm Area Ha)</span>
                  <span className="font-bold">18% Kontribusi</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "18%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VisirekaAppShell>
  );
}
