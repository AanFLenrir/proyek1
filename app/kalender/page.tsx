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
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function KalenderPage() {
  const [events, setEvents] = useState<HarvestEvent[]>(initialEvents);
  const [farms] = useState(initialFarms);
  const [showModal, setShowModal] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // November 2026 (0-indexed: 10 = Nov)

  const [title, setTitle] = useState("");
  const [farmId, setFarmId] = useState(farms[0].id);
  const [date, setDate] = useState("2026-11-25");
  const [type, setType] = useState<HarvestEvent["type"]>("Panen Petik Merah");

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

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

  // Generate 30 days for visual calendar grid
  const daysInMonth = 30; // November
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <VisirekaAppShell
      title="Kalender Kegiatan & Penjadwalan Panen"
      subtitle="Perencanaan jadwal petik buah ceri kopi Arabika, pemupukan organik, dan alokasi tenaga pemetik"
    >
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-foreground">Agenda Operasional Perkebunan</h2>
            <p className="text-xs text-muted-foreground">
              Sinkronisasi jadwal petik ceri merah dengan kapasitas gudang dan lantai jemur pascapanen
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Tambah Jadwal Agenda</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* INTERACTIVE MONTHLY CALENDAR GRID (Matches Figma / Google Stitch) */}
        {/* ===================================================================== */}
        <div className="p-5 sm:p-7 rounded-3xl border border-border bg-card shadow-sm space-y-4">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
                <FiCalendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">
                  {monthNames[currentMonthIndex]} 2026
                </h3>
                <p className="text-[11px] text-muted-foreground">Musim Panen Raya Tahap Akhir</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-xl border border-border hover:bg-muted text-foreground transition"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonthIndex((prev) => Math.min(11, prev + 1))}
                className="p-2 rounded-xl border border-border hover:bg-muted text-foreground transition"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[11px] font-bold text-muted-foreground uppercase py-1">
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span className="text-amber-600">Sab</span>
            <span className="text-rose-500">Min</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs">
            {calendarDays.map((day) => {
              const dateStr = `2026-11-${String(day).padStart(2, "0")}`;
              const dayEvents = events.filter((e) => e.date === dateStr);
              const isToday = day === 21;

              return (
                <div
                  key={day}
                  className={`min-h-[64px] sm:min-h-[85px] p-1.5 sm:p-2 rounded-2xl border transition flex flex-col justify-between ${
                    dayEvents.length > 0
                      ? "border-emerald-500/50 bg-emerald-500/5 shadow-xs"
                      : isToday
                      ? "border-amber-500 bg-amber-500/5 font-bold"
                      : "border-border/60 bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? "bg-amber-600 text-white" : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>

                  {dayEvents.length > 0 && (
                    <div className="space-y-0.5 mt-1">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="px-1.5 py-0.5 rounded-lg text-[9px] font-bold truncate bg-emerald-600 text-white shadow-2xs"
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Panen Petik Merah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Inspeksi Hama & Penyakit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Pemupukan Organik</span>
            </div>
          </div>
        </div>

        {/* Timeline Event Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-foreground">Daftar Agenda Kegiatan Terdekat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-3xl border border-border bg-card shadow-sm space-y-3 hover:border-emerald-500/50 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {ev.type}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5 text-emerald-600" />
                      {ev.date}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{ev.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <FiMapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{ev.farmName}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Status Agenda:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <FiCheckCircle className="w-3.5 h-3.5" /> {ev.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Tambah Agenda */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-base font-extrabold text-foreground">Tambah Agenda Baru</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold block">Judul Kegiatan</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Petik Merah Gelombang II"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Pilih Petak Kebun</label>
                  <select
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Tipe Kegiatan</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as HarvestEvent["type"])}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Panen Petik Merah">Panen Petik Merah</option>
                    <option value="Pemupukan Organik">Pemupukan Organik</option>
                    <option value="Pemangkasan Ranting">Pemangkasan Ranting</option>
                    <option value="Inspeksi Hama">Inspeksi Hama & Penyakit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
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
