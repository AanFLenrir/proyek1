"use client";

import { useState } from "react";
import { VisirekaAppShell } from "@/components/visireka/app-shell";
import { initialArticles, Article } from "@/lib/visireka-store";
import {
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

export default function EdukasiPage() {
  const [articles] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(articles[0]);

  return (
    <VisirekaAppShell
      title="Pusat Edukasi Standar Mutu SNI & SCA"
      subtitle="Pedoman klasifikasi cacat fisik biji kopi mentah dan mitigasi kegagalan pascapanen"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Daftar Artikel */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Daftar Modul Pembelajaran ({articles.length})
            </h3>

            <div className="space-y-2">
              {articles.map((art) => {
                const isSelected = selectedArticle?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/5 shadow-sm ring-1 ring-emerald-500/20"
                        : "border-border bg-card hover:border-emerald-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {art.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" /> {art.readTime}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-foreground leading-snug line-clamp-2">
                      {art.title}
                    </h4>

                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {art.summary}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Standar SNI 01-2907-2008 Quick Reference */}
            <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2 text-xs">
              <span className="font-bold text-foreground block">Klasifikasi Mutu SNI Kopi Biji:</span>
              <ul className="space-y-1 text-muted-foreground text-[11px]">
                <li>• <strong>Mutu 1 (Grade 1)</strong>: Total nilai cacat &le; 11</li>
                <li>• <strong>Mutu 2 (Grade 2)</strong>: Total nilai cacat 12 – 25</li>
                <li>• <strong>Mutu 3 (Grade 3)</strong>: Total nilai cacat 26 – 44</li>
                <li>• <strong>Mutu 4 (Grade 4)</strong>: Total nilai cacat 45 – 80</li>
              </ul>
            </div>
          </div>

          {/* Kolom Kanan: Pembaca Konten Artikel */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            {selectedArticle ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5 pb-4 border-b border-border">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-xl font-black text-foreground pt-1">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Dipublikasikan pada {selectedArticle.date} • Durasi baca: {selectedArticle.readTime}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border/80 text-xs italic text-foreground/90 leading-relaxed">
                  &ldquo;{selectedArticle.summary}&rdquo;
                </div>

                <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-3 pt-2">
                  <p>{selectedArticle.content}</p>
                  <p>
                    Dalam ekosistem sistem VISIREKA, pemahaman mengenai karakteristik kecacatan primer 
                    (*primary defects*) dan sekunder (*secondary defects*) diintegrasikan langsung ke dalam 
                    arsitektur Convolutional Neural Network (CNN). Model dilatih untuk mengenali ciri kontur, 
                    perubahan warna pigmen (*discoloration*), dan fragmentasi permukaan biji sehingga 
                    memberikan hasil penjaminan mutu yang objektif dan terstandarisasi.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-foreground flex items-center gap-2 font-medium">
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Materi ini diverifikasi oleh Laboratorium Pengolahan Pascapanen & Sistem Cerdas D4 Teknik Informatika, Fakultas Vokasi, Universitas Airlangga.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs">
                Silakan pilih salah satu modul pembelajaran di sebelah kiri.
              </div>
            )}
          </div>
        </div>
      </div>
    </VisirekaAppShell>
  );
}
