"use client";

import { useState } from "react";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import {
  initialConsultations,
  Consultation,
} from "@/lib/visireka-store";
import {
  FiMessageSquare,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiShield,
} from "react-icons/fi";

export default function KonsultasiPage() {
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations);
  const [topic, setTopic] = useState("Pengendalian Hama & Penyakit");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState("Petani Mitra VISIREKA");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newCons: Consultation = {
      id: "cons-" + Date.now(),
      authorName: authorName.trim() || "Petani Kopi Arabika",
      topic,
      subject,
      message,
      status: "Menunggu Balasan",
      date: new Date().toISOString().substring(0, 10),
    };

    setConsultations([newCons, ...consultations]);
    setSubject("");
    setMessage("");
  };

  return (
    <VisirekaAppShell
      title="Pusat Konsultasi Agronomi Kopi Arabika"
      subtitle="Ruang dialog interaktif petani dan pengelola kebun dengan agronomis dan pakar mutu pascapanen"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Form Buat Pertanyaan Baru */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FiMessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Kirim Pertanyaan Agronomi</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nama Petani / Pengirim</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Topik Konsultasi</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                >
                  <option value="Pengendalian Hama & Penyakit">Pengendalian Hama & Penyakit</option>
                  <option value="Perlakuan Pascapanen & Fermentasi">Perlakuan Pascapanen & Fermentasi</option>
                  <option value="Kalibrasi Estimasi Panen & Iklim">Kalibrasi Estimasi Panen & Iklim</option>
                  <option value="Pemenuhan Standar Mutu SNI/SCA">Pemenuhan Standar Mutu SNI/SCA</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Judul / Subjek</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Gejala Daun Berkarat Oranye"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Rincian Pertanyaan / Kondisi Lapangan</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Deskripsikan kondisi tanaman, persentase cacat yang terdeteksi AI, atau anomali iklim..."
                  className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <FiSend className="w-3.5 h-3.5" />
                <span>Kirimkan Konsultasi</span>
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Daftar Thread Konsultasi */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-foreground">
              Daftar Diskusi & Jawaban Pakar ({consultations.length})
            </h3>

            <div className="space-y-4">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {c.topic}
                      </span>
                      <h4 className="font-bold text-base text-foreground mt-1.5">{c.subject}</h4>
                      <p className="text-xs text-muted-foreground">
                        Oleh: <strong>{c.authorName}</strong> • {c.date}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === "Dijawab"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/90 bg-muted/30 p-3 rounded-xl leading-relaxed">
                    "{c.message}"
                  </p>

                  {c.reply ? (
                    <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <FiShield className="w-3.5 h-3.5" />
                        <span>Jawaban Pakar Agronomis ({c.repliedBy}):</span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{c.reply}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      Pertanyaan sedang ditinjau oleh tim agronomis fakultas.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VisirekaAppShell>
  );
}
