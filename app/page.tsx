import type { Metadata } from "next";
import Link from "next/link";
import {
  FiCamera,
  FiTrendingUp,
  FiLayers,
  FiShield,
  FiCheckCircle,
  FiBarChart2,
  FiArrowRight,
  FiCpu,
  FiMapPin,
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
      desc: "Deteksi kecacatan fisik biji kopi mentah (green beans 224x224) secara visual untuk mengidentifikasi Black/Sour, Insect Damage, dan Broken Beans dengan akurasi terstandarisasi.",
      icon: FiCamera,
      href: "/inspeksi",
      badge: "Deep Learning",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-600",
    },
    {
      title: "Estimasi Volume Produksi (Regresi Linear)",
      desc: "Pemodelan prediktif multivariat berdasarkan parameter agroklimat (suhu harian, curah hujan, umur tanaman, dan riwayat panen) untuk optimalisasi perencanaan logistik gudang.",
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
      desc: "Pelacakan rekam jejak batch mutu komersial (Grade 1 Premium s/d Grade 3), kalkulasi defect rate otomatis, dan ekspor pelaporan operasional.",
      icon: FiBarChart2,
      href: "/riwayat",
      badge: "Quality Control",
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600",
    },
  ];

  const quickRoles = [
    {
      role: "Petugas Quality Control (QC)",
      action: "Inspeksi Kualitas Citra Biji Kopi",
      href: "/inspeksi",
      icon: FiCamera,
    },
    {
      role: "Pihak Manajemen / Eksekutif",
      action: "Dashboard & Prediksi Produksi",
      href: "/dashboard",
      icon: FiTrendingUp,
    },
    {
      role: "Admin Perkebunan",
      action: "Kelola Blok Lahan & Agroklimat",
      href: "/kebun",
      icon: FiMapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col">
      {/* Top Navigation */}
      <nav className="w-full border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20">
            V
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              VISIREKA
            </span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Universitas Airlangga
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle labels={{ toLight: "Ganti ke Mode Terang", toDark: "Ganti ke Mode Gelap" }} />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md transition"
          >
            <span>Buka Dashboard</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <FiCpu className="w-3.5 h-3.5" />
            <span>Kecerdasan Buatan Terintegrasi: CNN & Regresi Linear</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none text-foreground">
            Sistem Prediksi Kualitas Biji Kopi & Estimasi Panen Perkebunan Arabika
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Platform berbasis web cerdas untuk mempercepat penjaminan mutu pascapanen (*quality control*) 
            menggunakan citra digital biji kopi mentah dan meramalkan volume panen masa depan berbasis parameter agroklimat.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center gap-2"
            >
              <span>Akses Panel Sistem</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/inspeksi"
              className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted font-semibold text-sm transition flex items-center gap-2"
            >
              <FiCamera className="w-4 h-4 text-emerald-600" />
              <span>Coba Deteksi Citra CNN</span>
            </Link>
            <Link
              href="/estimasi"
              className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted font-semibold text-sm transition flex items-center gap-2"
            >
              <FiTrendingUp className="w-4 h-4 text-amber-600" />
              <span>Simulasi Regresi Panen</span>
            </Link>
          </div>
        </div>

        {/* Akses Cepat Berdasarkan Aktor SRS */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="text-center mb-8">
            <h2 className="text-sm uppercase tracking-widest font-bold text-muted-foreground">
              Akses Berdasarkan Aktor Spesifikasi Kebutuhan (SRS)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {quickRoles.map((r, i) => {
              const Icon = r.icon;
              return (
                <Link
                  key={i}
                  href={r.href}
                  className="p-4 rounded-xl border border-border bg-card hover:border-emerald-500/50 hover:shadow-md transition group text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{r.role}</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>{r.action}</span>
                    <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${f.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-border bg-muted text-foreground/80">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
                <div>
                  <Link
                    href={f.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Pelajari & Jalankan Fitur</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 bg-card text-center text-xs text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground">
          VISIREKA — Sistem Prediksi Kualitas Biji Kopi & Estimasi Produksi Panen Arabika
        </p>
        <p>
          Proyek Terpadu Mahasiswa D4 Teknik Informatika, Fakultas Vokasi, Universitas Airlangga
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/inspeksi" className="hover:underline">Inspeksi Citra (CNN)</Link>
          <Link href="/estimasi" className="hover:underline">Estimasi Panen (Regresi)</Link>
          <Link href="/kebun" className="hover:underline">Data Kebun</Link>
          <Link href="/edukasi" className="hover:underline">Pedoman SNI & SCA</Link>
        </div>
      </footer>
    </div>
  );
}
