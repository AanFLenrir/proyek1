"use client";

import { useState } from "react";
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
  FiCalendar,
  FiCheckCircle,
  FiLayers,
  FiActivity,
  FiFilter,
} from "react-icons/fi";

export default function KebunPage() {
  const [farms, setFarms] = useState<Farm[]>(initialFarms);
  const [historicalData, setHistoricalData] = useState<HistoricalAgroclymate[]>(initialHistorical);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0].id);

  // Form Tambah Kebun Baru
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");
  const [newBlockCode, setNewBlockCode] = useState("");
  const [newElevation, setNewElevation] = useState(1300);
  const [newArea, setNewArea] = useState(4.0);
  const [newTrees, setNewTrees] = useState(8000);
  const [newVariety, setNewVariety] = useState("Arabica Kartika");
  const [newAge, setNewAge] = useState(6.0);

  // Form Tambah Data Historis Agroklimat
  const [showAddClimModal, setShowAddClimModal] = useState(false);
  const [recYear, setRecYear] = useState(2025);
  const [recMonth, setRecMonth] = useState(8);
  const [recTemp, setRecTemp] = useState(20.5);
  const [recRain, setRecRain] = useState(115);
  const [recHarvest, setRecHarvest] = useState(10400);

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName.trim() || !newBlockCode.trim()) return;

    const farm: Farm = {
      id: "farm-" + Date.now(),
      name: newFarmName,
      blockCode: newBlockCode.toUpperCase(),
      location: "Dataran Tinggi Jawa Timur",
      elevationMasl: Number(newElevation),
      areaHectares: Number(newArea),
      treeCount: Number(newTrees),
      variety: newVariety,
      treeAgeYears: Number(newAge),
      status: "Aktif",
    };

    setFarms([...farms, farm]);
    setShowAddFarmModal(false);
    setNewFarmName("");
    setNewBlockCode("");
  };

  const handleAddClim = (e: React.FormEvent) => {
    e.preventDefault();
    const clim: HistoricalAgroclymate = {
      id: "hist-" + Date.now(),
      farmId: selectedFarmId,
      year: Number(recYear),
      month: Number(recMonth),
      avgTempC: Number(recTemp),
      rainfallMm: Number(recRain),
      actualHarvestKg: Number(recHarvest),
    };

    setHistoricalData([clim, ...historicalData]);
    setShowAddClimModal(false);
  };

  const filteredHistory = historicalData.filter((h) => h.farmId === selectedFarmId);

  return (
    <VisirekaAppShell
      title="Manajemen Kebun & Data Historis Agroklimat"
      subtitle="Pengelolaan blok lahan perkebunan kopi Arabika dan rekam jejak iklim bulanan"
    >
      <div className="space-y-6">
        {/* Tombol Header & Statistik */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Daftar Blok Perkebunan Aktif</h2>
            <p className="text-xs text-muted-foreground">
              {farms.length} blok perkebunan kopi Arabika terdaftar dalam basis data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddClimModal(true)}
              className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FiCalendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Entri Agroklimat</span>
            </button>
            <button
              onClick={() => setShowAddFarmModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <FiPlus className="w-4 h-4" />
              <span>Tambah Blok Kebun</span>
            </button>
          </div>
        </div>

        {/* Grid Kartu Kebun */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farms.map((farm) => {
            const isSelected = farm.id === selectedFarmId;
            return (
              <div
                key={farm.id}
                onClick={() => setSelectedFarmId(farm.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer space-y-4 ${
                  isSelected
                    ? "border-emerald-500 bg-card shadow-md ring-2 ring-emerald-500/20"
                    : "border-border bg-card/60 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                      {farm.blockCode}
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-1">{farm.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span className="line-clamp-1">{farm.location}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                    {farm.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                  <div className="p-2 rounded-lg bg-muted/40">
                    <span className="text-[10px] text-muted-foreground">Ketinggian:</span>
                    <p className="font-bold text-foreground">{farm.elevationMasl} mdpl</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/40">
                    <span className="text-[10px] text-muted-foreground">Luas Lahan:</span>
                    <p className="font-bold text-foreground">{farm.areaHectares} Ha</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/40">
                    <span className="text-[10px] text-muted-foreground">Populasi:</span>
                    <p className="font-bold text-foreground">{farm.treeCount.toLocaleString()} Pohon</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/40">
                    <span className="text-[10px] text-muted-foreground">Umur Pohon:</span>
                    <p className="font-bold text-foreground">{farm.treeAgeYears} Tahun</p>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                  <span>Varietas: <strong>{farm.variety}</strong></span>
                  <span className="text-emerald-600 font-bold">{isSelected ? "Dipilih" : "Pilih"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabel Rekam Jejak Agroklimat Bulanan Terkait */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
            <div>
              <h3 className="font-bold text-base text-foreground">
                Rekam Jejak Historis: {farms.find((f) => f.id === selectedFarmId)?.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Data runtun waktu variabel cuaca dan hasil panen aktual sebagai basis pelatihan model regresi
              </p>
            </div>
            <button
              onClick={() => setShowAddClimModal(true)}
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Tambah Rekaman Periode</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Tahun & Bulan</th>
                  <th className="py-2.5 px-3">Suhu Rerata (°C)</th>
                  <th className="py-2.5 px-3">Curah Hujan (mm)</th>
                  <th className="py-2.5 px-3">Hasil Panen Riil (kg)</th>
                  <th className="py-2.5 px-3">Produktivitas (kg/ha)</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Status Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => {
                    const farm = farms.find((f) => f.id === item.farmId);
                    const prodPerHa = farm ? Math.round(item.actualHarvestKg / farm.areaHectares) : 0;
                    return (
                      <tr key={item.id} className="hover:bg-muted/50 transition">
                        <td className="py-3 px-3 font-semibold text-foreground">
                          Tahun {item.year} — Bulan {item.month}
                        </td>
                        <td className="py-3 px-3 text-foreground">{item.avgTempC} °C</td>
                        <td className="py-3 px-3 text-foreground">{item.rainfallMm} mm</td>
                        <td className="py-3 px-3 font-bold text-foreground">
                          {item.actualHarvestKg.toLocaleString()} kg
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">
                          {prodPerHa.toLocaleString()} kg/ha
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Terverifikasi OLS
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      Belum ada data historis agroklimat untuk blok ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Kebun Baru */}
        {showAddFarmModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-foreground">Tambah Blok Kebun Kopi Arabika</h3>
              <form onSubmit={handleAddFarm} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Nama Perkebunan</label>
                  <input
                    type="text"
                    required
                    value={newFarmName}
                    onChange={(e) => setNewFarmName(e.target.value)}
                    placeholder="Contoh: Perkebunan Raung Makmur"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kode Blok</label>
                  <input
                    type="text"
                    required
                    value={newBlockCode}
                    onChange={(e) => setNewBlockCode(e.target.value)}
                    placeholder="Contoh: BLOK-RNG-04"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Elevasi (mdpl)</label>
                    <input
                      type="number"
                      required
                      value={newElevation}
                      onChange={(e) => setNewElevation(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Luas Lahan (Ha)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newArea}
                      onChange={(e) => setNewArea(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Jumlah Pohon</label>
                    <input
                      type="number"
                      required
                      value={newTrees}
                      onChange={(e) => setNewTrees(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Umur Pohon (Thn)</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newAge}
                      onChange={(e) => setNewAge(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Varietas Kopi</label>
                  <input
                    type="text"
                    required
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddFarmModal(false)}
                    className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                  >
                    Simpan Kebun
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Tambah Data Historis Agroklimat */}
        {showAddClimModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-foreground">Entri Data Historis Agroklimat</h3>
              <form onSubmit={handleAddClim} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Pilih Blok Kebun</label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Tahun</label>
                    <input
                      type="number"
                      required
                      value={recYear}
                      onChange={(e) => setRecYear(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Bulan (1-12)</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      required
                      value={recMonth}
                      onChange={(e) => setRecMonth(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Suhu Rerata (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={recTemp}
                      onChange={(e) => setRecTemp(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Curah Hujan (mm)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={recRain}
                      onChange={(e) => setRecRain(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Hasil Panen Aktual (kg)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={recHarvest}
                    onChange={(e) => setRecHarvest(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddClimModal(false)}
                    className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm"
                  >
                    Simpan Rekaman
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
