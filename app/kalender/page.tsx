"use client";

import { useState } from "react";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialEvents,
  initialFarms,
  HarvestEvent,
} from "@/lib/visireka-store";
import {
  FiCalendar,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiTag,
} from "react-icons/fi";

export default function KalenderPage() {
  const [events, setEvents] = useState<HarvestEvent[]>(initialEvents);
  const [farms] = useState(initialFarms);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [farmId, setFarmId] = useState(farms[0].id);
  const [date, setDate] = useState("2026-12-05");
  const [type, setType] = useState<HarvestEvent["type"]>("Panen Petik Merah");

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const farm = farms.find((f) => f.id === farmId) || farms[0];
    const newEv: HarvestEvent = {
      id: "ev-" + Date.now(),
      farmId,
      farmName: farm.name,
      title,
      date,
      type,
      status: "Terjadwal",
    };

    setEvents([...events, newEv]);
    setShowModal(false);
    setTitle("");
  };

  return (
    <VisirekaAppShell
      title="Kalender Kegiatan & Jadwal Panen"
      subtitle="Perencanaan jadwal petik buah ceri kopi Arabika, pemupukan organik, dan perawatan lahan"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Agenda Operasional Kebun</h2>
            <p className="text-xs text-muted-foreground">
              Sinkronisasi jadwal petik ceri merah dengan kapasitas gudang pascapanen
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FiPlus className="w-4 h-4" />
            <span>Tambah Jadwal Agenda</span>
          </button>
        </div>

        {/* Timeline / Agenda Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3 hover:border-emerald-500/50 transition"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {ev.type}
                </span>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <FiClock className="w-3.5 h-3.5 text-emerald-600" />
                  {ev.date}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-foreground">{ev.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <FiMapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{ev.farmName}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Status Pelaksanaan:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" /> {ev.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Tambah Agenda */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-foreground">Tambah Agenda Baru</h3>
              <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Judul Kegiatan</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Petik Merah Gelombang II"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pilih Blok Kebun</label>
                  <select
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tipe Kegiatan</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as HarvestEvent["type"])}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="Panen Petik Merah">Panen Petik Merah</option>
                    <option value="Pemupukan Organik">Pemupukan Organik</option>
                    <option value="Pemangkasan Ranting">Pemangkasan Ranting</option>
                    <option value="Inspeksi Hama">Inspeksi Hama & Penyakit</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                  >
                    Simpan Agenda
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
