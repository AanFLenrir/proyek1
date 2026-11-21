"use client";

import { useState } from "react";
import Link from "next/link";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialFarms,
  initialHistorical,
  Farm,
  HistoricalAgroclymate,
} from "@/lib/visireka-store";
import {
  FiMapPin,
  FiPlus,
  FiCamera,
  FiTrendingUp,
  FiX,
  FiCloudRain,
} from "react-icons/fi";

export default function KebunPage() {
  const [farms, setFarms] = useState<Farm[]>(initialFarms);
  const [historicalData, setHistoricalData] = useState<HistoricalAgroclymate[]>(initialHistorical);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0].id);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form Tambah Kebun Baru Modal
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");
  const [newBlockCode, setNewBlockCode] = useState("");
  const [newLocation] = useState("Kawasan Dataran Tinggi Jawa Timur");
  const [newElevation, setNewElevation] = useState(1350);
  const [newArea, setNewArea] = useState(4.5);
  const [newTrees, setNewTrees] = useState(9000);
  const [newVariety, setNewVariety] = useState("Arabica Kartika & Typica");
  const [newAge] = useState(7.0);

  // Form Tambah Catatan Agroklimat Modal
  const [showAddClimModal, setShowAddClimModal] = useState(false);
  const [recYear, setRecYear] = useState(2025);
  const [recMonth, setRecMonth] = useState(8);
  const [recTemp, setRecTemp] = useState(20.5);
  const [recRain, setRecRain] = useState(120);
  const [recHarvest, setRecHarvest] = useState(10500);

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const farmHistory = historicalData.filter((h) => h.farmId === selectedFarm.id);

  const filteredFarms = farms.filter((f) => {
    if (statusFilter === "all") return true;
    return f.status === statusFilter;
  });

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName.trim() || !newBlockCode.trim()) return;

    const newFarm: Farm = {
      id: "farm-" + Date.now(),
      name: newFarmName,
      blockCode: newBlockCode.toUpperCase(),
      location: newLocation,
      elevationMasl: Number(newElevation),
      areaHectares: Number(newArea),
      treeCount: Number(newTrees),
      variety: newVariety,
      treeAgeYears: Number(newAge),
      status: "Aktif",
    };

    setFarms([...farms, newFarm]);
    setShowAddFarmModal(false);
    setNewFarmName("");
    setNewBlockCode("");
  };

  const handleAddClimate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: HistoricalAgroclymate = {
      id: "hist-" + Date.now(),
      farmId: selectedFarm.id,
      year: Number(recYear),
      month: Number(recMonth),
      avgTempC: Number(recTemp),
      rainfallMm: Number(recRain),
      actualHarvestKg: Number(recHarvest),
    };

    setHistoricalData([...historicalData, newRecord]);
    setShowAddClimModal(false);
  };

  return (
    <VisirekaAppShell
      title="Manajemen Petak Kebun & Data Agroklimat"
      subtitle="Katalog petak kebun kopi Arabika, elevasi dataran tinggi, dan histori observasi iklim"
    >
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-full font-bold transition ${
                statusFilter === "all" ? "bg-emerald-600 text-white" : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              Semua Blok ({farms.length})
            </button>
            <button
              onClick={() => setStatusFilter("Aktif")}
              className={`px-3 py-1.5 rounded-full font-semibold transition ${
                statusFilter === "Aktif" ? "bg-emerald-600 text-white" : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setStatusFilter("Persiapan Panen")}
              className={`px-3 py-1.5 rounded-full font-semibold transition ${
                statusFilter === "Persiapan Panen" ? "bg-emerald-600 text-white" : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              Persiapan Panen
            </button>
          </div>

          <button
            onClick={() => setShowAddFarmModal(true)}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Tambah Petak Lahan Baru</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* FARM CARDS GRID (Matches Figma / Google Stitch) */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFarms.map((farm) => {
            const isSelected = selectedFarmId === farm.id;
            return (
              <div
                key={farm.id}
                onClick={() => setSelectedFarmId(farm.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                    : "border-border bg-card hover:border-emerald-500/50 hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {farm.blockCode}
                      </span>
                      <h3 className="text-base font-extrabold text-foreground">{farm.name}</h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        farm.status === "Aktif"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                      }`}
                    >
                      {farm.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{farm.location}</span>
                  </p>

                  {/* 4 Metrics in Card */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">Ketinggian Lahan</span>
                      <strong className="text-foreground">{farm.elevationMasl} mdpl</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">Luas Efektif</span>
                      <strong className="text-foreground">{farm.areaHectares} Hektar</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">Populasi Pohon</span>
                      <strong className="text-foreground">{farm.treeCount.toLocaleString()} Pohon</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">Varietas Kopi</span>
                      <strong className="text-foreground truncate block">{farm.variety}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Quick Actions */}
                <div className="pt-2 border-t border-border flex items-center gap-2">
                  <Link
                    href="/inspeksi"
                    className="flex-1 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FiCamera className="w-3.5 h-3.5" />
                    <span>Pindai QC</span>
                  </Link>
                  <Link
                    href="/estimasi"
                    className="flex-1 py-2 rounded-xl bg-amber-600/10 hover:bg-amber-600 hover:text-white text-amber-700 dark:text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FiTrendingUp className="w-3.5 h-3.5" />
                    <span>Estimasi</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* HISTORICAL AGROCLYMATE RECORDS FOR SELECTED FARM */}
        {/* ===================================================================== */}
        <div className="p-5 sm:p-7 rounded-3xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <FiCloudRain className="text-blue-500" />
                <span>Catatan Historis Agroklimat: {selectedFarm.name}</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Data deret waktu curah hujan, suhu mikro, dan hasil panen aktual sebagai basis pelatihan regresi OLS
              </p>
            </div>
            <button
              onClick={() => setShowAddClimModal(true)}
              className="px-3 py-1.5 rounded-xl border border-border bg-muted/50 hover:bg-muted text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Tambah Rekaman Bulan</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <th className="py-2.5 px-3">Periode</th>
                  <th className="py-2.5 px-3">Curah Hujan (mm)</th>
                  <th className="py-2.5 px-3">Suhu Rata-rata (°C)</th>
                  <th className="py-2.5 px-3">Panen Aktual (kg)</th>
                  <th className="py-2.5 px-3">Produktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {farmHistory.length > 0 ? (
                  farmHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition">
                      <td className="py-2.5 px-3 font-bold text-foreground">
                        {item.month === 5 ? "Mei" : item.month === 6 ? "Juni" : item.month === 7 ? "Juli" : `Bulan ${item.month}`}{" "}
                        {item.year}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-blue-600 dark:text-blue-400">
                        {item.rainfallMm} mm
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">
                        {item.avgTempC} °C
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-foreground">
                        {item.actualHarvestKg.toLocaleString()} kg
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {(item.actualHarvestKg / selectedFarm.areaHectares).toFixed(0)} kg/Ha
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      Belum ada data historis agroklimat tercatat untuk petak kebun ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MODAL TAMBAH PETAK LAHAN */}
        {/* ===================================================================== */}
        {showAddFarmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg p-6 rounded-3xl bg-card border border-border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-extrabold text-foreground">Daftarkan Petak Kebun Baru</h3>
                <button
                  onClick={() => setShowAddFarmModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddFarm} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Nama Petak Kebun</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Blok Raung Specialty"
                      value={newFarmName}
                      onChange={(e) => setNewFarmName(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Kode Blok</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: BLOK-RNG-04"
                      value={newBlockCode}
                      onChange={(e) => setNewBlockCode(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Elevasi (mdpl)</label>
                    <input
                      type="number"
                      value={newElevation}
                      onChange={(e) => setNewElevation(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Luas Lahan (Ha)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newArea}
                      onChange={(e) => setNewArea(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Populasi Pohon (Batang)</label>
                    <input
                      type="number"
                      value={newTrees}
                      onChange={(e) => setNewTrees(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Varietas Kopi</label>
                    <input
                      type="text"
                      value={newVariety}
                      onChange={(e) => setNewVariety(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddFarmModal(false)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
                  >
                    Simpan Petak
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL TAMBAH REKAMAN AGROKLIMAT */}
        {/* ===================================================================== */}
        {showAddClimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md p-6 rounded-3xl bg-card border border-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-sm font-extrabold text-foreground">Tambah Rekaman Agroklimat Bulanan</h3>
                <button
                  onClick={() => setShowAddClimModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddClimate} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Tahun</label>
                    <input
                      type="number"
                      value={recYear}
                      onChange={(e) => setRecYear(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Bulan (1-12)</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={recMonth}
                      onChange={(e) => setRecMonth(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Curah Hujan (mm)</label>
                    <input
                      type="number"
                      value={recRain}
                      onChange={(e) => setRecRain(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Suhu Rata-rata (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={recTemp}
                      onChange={(e) => setRecTemp(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Panen Aktual (kg)</label>
                  <input
                    type="number"
                    value={recHarvest}
                    onChange={(e) => setRecHarvest(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 font-bold"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddClimModal(false)}
                    className="px-3 py-1.5 rounded-xl border border-border hover:bg-muted font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </VisirekaAppShell>
  );
}
