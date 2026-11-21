import type { Metadata } from "next";
import Link from "next/link";
import {
  FiCamera,
  FiTrendingUp,
  FiLayers,
  FiBarChart2,
  FiArrowRight,
  FiCpu,
  FiLogIn,
} from "react-icons/fi";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "VISIREKA | Smart Agriculture & AI Coffee Quality Assessment",
  description:
    "Sistem Prediksi Kualitas Biji Kopi & Waktu Panen Optimal Perkebunan Arabika berbasis Next.js dengan CNN & Regresi Linear.",
};

export default function HomePage() {
  const features = [
    {
      title: "Klasifikasi Citra Biji Kopi (CNN)",
      desc: "Deteksi kecacatan fisik biji kopi mentah (green beans 224x224 RGB) secara visual untuk mengidentifikasi Black/Sour, Insect Damage (PBKo), dan Broken Beans dengan akurasi terstandarisasi 91,40% (SNI 01-2907-2008 & SCA).",
      icon: FiCamera,
      href: "/inspeksi",
      badge: "Deep Learning",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-600",
    },
    {
      title: "Estimasi Volume Produksi (Regresi Linear)",
      desc: "Estimasi produksi berbasis metode Regresi Linear menggunakan parameter agroklimat (suhu, curah hujan, umur tanaman, dan riwayat panen) untuk optimalisasi perencanaan logistik dan tenaga pemetik.",
      icon: FiTrendingUp,
      href: "/estimasi",
      badge: "Machine Learning",
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600",
    },
    {
      title: "Dashboard & Manajemen Kebun Terpadu",
      desc: "Pemantauan komprehensif blok lahan Arabika dataran tinggi (Argopuro, Ijen, Arjuno), rekam jejak agroklimat bulanan, dan jadwal panen petik ceri merah.",
      icon: FiLayers,
      href: "/kebun",
      badge: "Smart Farm",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600",
    },
    {
      title: "Riwayat & Analisis Mutu Standar SCA/SNI",
      desc: "Pelacakan rekam jejak batch mutu komersial (Grade 1 Premium s/d Grade 3), kalkulasi defect rate otomatis, dan ekspor pelaporan operasional format CSV.",
      icon: FiBarChart2,
      href: "/riwayat",
      badge: "Quality Control",
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-700">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-emerald-600/30">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                VISIREKA
              </span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                AI Smart Agribisnis
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Vision & Regression Analytics for Arabica Coffee
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle labels={{ toLight: "Mode Terang", toDark: "Mode Gelap" }} />
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition flex items-center gap-1.5"
          >
            <FiLogIn className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Masuk</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <span>Buka Dashboard</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 sm:space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <FiCpu className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Dual-Engine AI: Convolutional Neural Network + Ordinary Least Squares</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            Presisi Visi AI untuk Kualitas Kopi & Kepastian Hasil Panen
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Sistem informasi cerdas perkebunan kopi Arabika dataran tinggi yang mentransformasikan proses sortasi manual menjadi inspeksi digital otomatis dan memodelkan estimasi volume produksi berbasis data agroklimat.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/inspeksi"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 active:scale-95"
            >
              <FiCamera className="w-4 h-4" />
              <span>Coba Scanner Kualitas AI</span>
            </Link>
            <Link
              href="/estimasi"
              className="px-5 py-3 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-bold text-sm transition flex items-center gap-2 active:scale-95"
            >
              <FiTrendingUp className="w-4 h-4 text-amber-600" />
              <span>Simulasi Estimasi Panen</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm transition flex items-center gap-2"
            >
              <FiLayers className="w-4 h-4" />
              <span>Dashboard Lengkap</span>
            </Link>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.title}
                href={feat.href}
                className="group p-6 rounded-3xl border border-border bg-card hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-emerald-600 transition">
                    {feat.title}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-2 group-hover:translate-x-1 transition">
                  <span>Eksplorasi Fitur</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Academic Standard Banner */}
        <div className="p-6 rounded-3xl border border-border bg-muted/30 text-center space-y-2">
          <p className="text-xs font-bold text-foreground">
            Standar Akademik & Penelitian Terapan
          </p>
          <p className="text-[11px] text-muted-foreground max-w-xl mx-auto">
            Dikembangkan oleh Tim Mahasiswa D4 Teknik Informatika, Fakultas Vokasi, Universitas Airlangga (2026).
            Mengacu pada Standar Nasional Indonesia (SNI 01-2907-2008 Biji Kopi) dan protokol Specialty Coffee Association (SCA).
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-6 px-4 text-center text-xs text-muted-foreground space-y-1">
        <p className="font-bold text-foreground">VISIREKA — Vision and Regression Analytics for Arabica Coffee</p>
        <p className="text-[11px]">D4 Teknik Informatika • Fakultas Vokasi • Universitas Airlangga © 2026</p>
      </footer>
    </div>
  );
}
