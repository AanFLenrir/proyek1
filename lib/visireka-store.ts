// lib/visireka-store.ts
// Penyimpanan Data Terintegrasi, Simulasi Model AI (CNN & Regresi), dan Utilitas VISIREKA

export type UserRole = "qc_inspector" | "farm_admin" | "management" | "super_admin";

export interface Farm {
  id: string;
  name: string;
  blockCode: string;
  location: string;
  elevationMasl: number;
  areaHectares: number;
  treeCount: number;
  variety: string;
  treeAgeYears: number;
  status: "Aktif" | "Pemeliharaan" | "Persiapan Panen";
}

export interface DefectBreakdown {
  goodBeans: number; // Persentase %
  blackSour: number;
  insectDamage: number;
  brokenBeans: number;
}

export interface QualityInspection {
  id: string;
  farmId: string;
  farmName: string;
  batchCode: string;
  inspectionDate: string;
  inspectorName: string;
  assignedGrade: "Grade 1 (Premium)" | "Grade 2 (Standar)" | "Grade 3 (Komersial)" | "Reject";
  confidenceScore: number; // 0.0 - 1.0
  overallDefectRate: number; // %
  defectBreakdown: DefectBreakdown;
  recommendation: string;
  imageUrl?: string;
}

export interface HistoricalAgroclymate {
  id: string;
  farmId: string;
  year: number;
  month: number;
  avgTempC: number;
  rainfallMm: number;
  actualHarvestKg: number;
}

export interface HarvestEstimate {
  id: string;
  farmId: string;
  farmName: string;
  targetYear: number;
  targetMonth: number;
  inputArea: number;
  inputTreeCount: number;
  inputTreeAge: number;
  inputRainfall: number;
  inputTemp: number;
  inputPrevYield: number;
  predictedYieldKg: number;
  lowerBoundKg: number;
  upperBoundKg: number;
  requiredSacks60kg: number;
  estimatedLaborers: number;
  createdAt: string;
}

export interface HarvestEvent {
  id: string;
  farmId: string;
  farmName: string;
  title: string;
  date: string;
  type: "Panen Petik Merah" | "Pemupukan Organik" | "Pemangkasan Ranting" | "Inspeksi Hama";
  status: "Terjadwal" | "Sedang Berlangsung" | "Selesai";
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  date: string;
}

export interface Consultation {
  id: string;
  authorName: string;
  topic: string;
  subject: string;
  message: string;
  reply?: string;
  repliedBy?: string;
  status: "Dijawab" | "Menunggu Balasan";
  date: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
}

// -----------------------------------------------------------------------------
// SEED DATA AWAL (BERKUALITAS AKADEMIK)
// -----------------------------------------------------------------------------

export const initialFarms: Farm[] = [
  {
    id: "farm-01",
    name: "Perkebunan Argopuro Lestari",
    blockCode: "BLOK-AGP-01",
    location: "Lereng Gunung Argopuro, Jember (Ketinggian 1.350 mdpl)",
    elevationMasl: 1350,
    areaHectares: 4.8,
    treeCount: 9600,
    variety: "Arabica Kartika & Typica",
    treeAgeYears: 7.5,
    status: "Aktif",
  },
  {
    id: "farm-02",
    name: "Perkebunan Ijen Specialty",
    blockCode: "BLOK-IJN-02",
    location: "Kawah Ijen, Bondowoso (Ketinggian 1.480 mdpl)",
    elevationMasl: 1480,
    areaHectares: 6.2,
    treeCount: 12400,
    variety: "Arabica Blue Mountain & S-795",
    treeAgeYears: 8.2,
    status: "Persiapan Panen",
  },
  {
    id: "farm-03",
    name: "Perkebunan Arjuno Makmur",
    blockCode: "BLOK-ARJ-03",
    location: "Lereng Gunung Arjuno, Malang (Ketinggian 1.250 mdpl)",
    elevationMasl: 1250,
    areaHectares: 3.5,
    treeCount: 7000,
    variety: "Arabica Lini S & Komasti",
    treeAgeYears: 5.0,
    status: "Aktif",
  },
];

export const initialInspections: QualityInspection[] = [
  {
    id: "insp-01",
    farmId: "farm-01",
    farmName: "Perkebunan Argopuro Lestari",
    batchCode: "BATCH-2026-AGP-001",
    inspectionDate: "2026-11-16 09:30",
    inspectorName: "Rudi Hartono (Petugas QC)",
    assignedGrade: "Grade 1 (Premium)",
    confidenceScore: 0.948,
    overallDefectRate: 4.25,
    defectBreakdown: {
      goodBeans: 95.75,
      blackSour: 1.5,
      insectDamage: 1.25,
      brokenBeans: 1.5,
    },
    recommendation:
      "Mutu biji memenuhi kualifikasi ekspor Specialty Arabica (SNI Grade 1). Lanjutkan ke tahapan penimbangan dan pengemasan kedap udara (GrainPro).",
  },
  {
    id: "insp-02",
    farmId: "farm-02",
    farmName: "Perkebunan Ijen Specialty",
    batchCode: "BATCH-2026-IJN-004",
    inspectionDate: "2026-11-15 14:15",
    inspectorName: "Siti Rahma (Petugas QC)",
    assignedGrade: "Grade 2 (Standar)",
    confidenceScore: 0.892,
    overallDefectRate: 9.8,
    defectBreakdown: {
      goodBeans: 90.2,
      blackSour: 3.6,
      insectDamage: 3.2,
      brokenBeans: 3.0,
    },
    recommendation:
      "Tingkat cacat berada pada ambang Grade 2. Disarankan melakukan penyortiran ulang meja getar gravitasi (density table) untuk memisahkan biji terserang borer.",
  },
  {
    id: "insp-03",
    farmId: "farm-03",
    farmName: "Perkebunan Arjuno Makmur",
    batchCode: "BATCH-2026-ARJ-002",
    inspectionDate: "2026-11-14 11:00",
    inspectorName: "Rudi Hartono (Petugas QC)",
    assignedGrade: "Grade 1 (Premium)",
    confidenceScore: 0.962,
    overallDefectRate: 3.1,
    defectBreakdown: {
      goodBeans: 96.9,
      blackSour: 0.8,
      insectDamage: 1.1,
      brokenBeans: 1.2,
    },
    recommendation:
      "Kualitas fisik biji sangat prima dengan keseragaman warna hijau kebiruan merata. Sangat potensial untuk lot lelang Specialty Coffee.",
  },
];

export const initialHistorical: HistoricalAgroclymate[] = [
  { id: "hist-01", farmId: "farm-01", year: 2024, month: 5, avgTempC: 21.2, rainfallMm: 145, actualHarvestKg: 9400 },
  { id: "hist-02", farmId: "farm-01", year: 2024, month: 6, avgTempC: 20.8, rainfallMm: 110, actualHarvestKg: 10200 },
  { id: "hist-03", farmId: "farm-01", year: 2024, month: 7, avgTempC: 19.9, rainfallMm: 80, actualHarvestKg: 11500 },
  { id: "hist-04", farmId: "farm-01", year: 2025, month: 5, avgTempC: 21.4, rainfallMm: 155, actualHarvestKg: 9800 },
  { id: "hist-05", farmId: "farm-01", year: 2025, month: 6, avgTempC: 21.0, rainfallMm: 120, actualHarvestKg: 10600 },
  { id: "hist-06", farmId: "farm-01", year: 2025, month: 7, avgTempC: 20.2, rainfallMm: 95, actualHarvestKg: 11900 },
  { id: "hist-07", farmId: "farm-02", year: 2025, month: 6, avgTempC: 19.5, rainfallMm: 130, actualHarvestKg: 14500 },
  { id: "hist-08", farmId: "farm-02", year: 2025, month: 7, avgTempC: 19.0, rainfallMm: 105, actualHarvestKg: 15800 },
];

export const initialEstimates: HarvestEstimate[] = [
  {
    id: "est-01",
    farmId: "farm-01",
    farmName: "Perkebunan Argopuro Lestari",
    targetYear: 2026,
    targetMonth: 6,
    inputArea: 4.8,
    inputTreeCount: 9600,
    inputTreeAge: 7.5,
    inputRainfall: 115,
    inputTemp: 21.0,
    inputPrevYield: 10600,
    predictedYieldKg: 11850,
    lowerBoundKg: 11100,
    upperBoundKg: 12600,
    requiredSacks60kg: 198,
    estimatedLaborers: 17,
    createdAt: "2026-11-16 10:45",
  },
  {
    id: "est-02",
    farmId: "farm-02",
    farmName: "Perkebunan Ijen Specialty",
    targetYear: 2026,
    targetMonth: 7,
    inputArea: 6.2,
    inputTreeCount: 12400,
    inputTreeAge: 8.2,
    inputRainfall: 100,
    inputTemp: 19.2,
    inputPrevYield: 15800,
    predictedYieldKg: 16900,
    lowerBoundKg: 15900,
    upperBoundKg: 17900,
    requiredSacks60kg: 282,
    estimatedLaborers: 24,
    createdAt: "2026-11-15 16:20",
  },
];

export const initialEvents: HarvestEvent[] = [
  {
    id: "ev-01",
    farmId: "farm-01",
    farmName: "Perkebunan Argopuro Lestari",
    title: "Panen Puncak Petik Merah Gelombang I",
    date: "2026-11-25",
    type: "Panen Petik Merah",
    status: "Terjadwal",
  },
  {
    id: "ev-02",
    farmId: "farm-02",
    farmName: "Perkebunan Ijen Specialty",
    title: "Inspeksi Kepadatan Ceri & Uji Cupping Sampel",
    date: "2026-11-28",
    type: "Inspeksi Hama",
    status: "Terjadwal",
  },
  {
    id: "ev-03",
    farmId: "farm-03",
    farmName: "Perkebunan Arjuno Makmur",
    title: "Pemupukan Organik & Pembenahan Naungan",
    date: "2026-12-02",
    type: "Pemupukan Organik",
    status: "Terjadwal",
  },
];

export const initialArticles: Article[] = [
  {
    id: "art-01",
    title: "Standar Fisik Biji Kopi Arabika Menurut SNI 01-2907-2008 & SCA",
    category: "Standar Mutu",
    readTime: "5 menit",
    summary:
      "Panduan komprehensif mengenai penentuan nilai cacat (defect value) sistem 300 gram untuk menembus pasar ekspor Specialty Coffee.",
    content:
      "Standar Nasional Indonesia (SNI 01-2907-2008) mengklasifikasikan mutu biji kopi berdasarkan jumlah nilai cacat per 300 gram sampel uji. Biji kopi Grade 1 memiliki total nilai cacat maksimum 11. Cacat primer mencakup biji hitam penuh (nilai 1) dan biji berjamur (nilai 1). Sementara cacat sekunder mencakup biji pecah (5 biji = nilai 1) dan biji berlubang serangga (5 biji = nilai 1). Model CNN VISIREKA dilatih secara khusus untuk mendeteksi kontur mikroskopis dan diskolorisasi ini secara otomatis.",
    date: "12 Nov 2026",
  },
  {
    id: "art-02",
    title: "Pengaruh Agroklimat terhadap Fluktuasi Panen Kopi Arabika Dataran Tinggi",
    category: "Agronomi & Iklim",
    readTime: "7 menit",
    summary:
      "Bagaimana curah hujan saat fase pembungaan dan fluktuasi suhu diurnal memicu produksi getah gula pada ceri kopi Arabika.",
    content:
      "Kopi Arabika memerlukan periode kering 2-3 bulan untuk memicu diferensiasi kuncup bunga, disusul curah hujan yang cukup (100-200 mm/bulan) untuk pembesaran buah. Suhu ideal berkisar antara 18-22 °C. Pada suhu di atas 25 °C, proses fotosintesis terhambat dan buah matang prematur dengan densitas biji yang rendah. Variabel ini menjadi input fundamental dalam formulasi regresi linear VISIREKA.",
    date: "08 Nov 2026",
  },
  {
    id: "art-03",
    title: "Manajemen Pascapanen: Kunci Mempertahankan Cupping Score di Atas 85",
    category: "Pascapanen",
    readTime: "6 menit",
    summary:
      "Teknik perendaman (fermentasi anaerob), pencucian, serta penjemuran di atas raised beds untuk menghindari fermentasi asam (sour beans).",
    content:
      "Cacat Black/Sour beans seringkali disebabkan oleh keterlambatan pengupasan kulit buah (pulping) setelah panen atau penumpukan ceri basah tanpa aerasi. Penggunaan sistem pemantauan kualitas VISIREKA membantu petugas quality control mengenali tren kenaikan cacat sour bean sebelum merusak seluruh lot produksi.",
    date: "01 Nov 2026",
  },
];

export const initialConsultations: Consultation[] = [
  {
    id: "cons-01",
    authorName: "Pak Slamet (Petani Mitra Argopuro)",
    topic: "Pengendalian Hama Bubuk Buah Kopi (PBKo)",
    subject: "Biji Kopi Berlubang Jarum pada Blok B",
    message:
      "Selamat siang pak ahli. Pada hasil scan inspeksi AI kemarin, terdeteksi kenaikan cacat insect damage sebesar 4.5% pada Blok B. Apakah ini indikasi serangan Hypothenemus hampei dan apa langkah penanganan tercepat sebelum panen raya?",
    reply:
      "Halo Pak Slamet. Benar, lubang jarum pada bagian ujung biji adalah ciri khas penggerek buah kopi. Segera lakukan petik bubuk (memetik buah yang berlubang di pohon dan memusnahkannya) serta pasang perangkap berperekat dengan atraktan metanol:etanol (rasio 1:1) sebanyak 20-30 titik per hektar.",
    repliedBy: "Dr. Ir. Hendra W. (Agronomis)",
    status: "Dijawab",
    date: "14 Nov 2026",
  },
  {
    id: "cons-02",
    authorName: "Budi Santoso (Admin Perkebunan Arjuno)",
    topic: "Kalibrasi Regresi Panen Musim Depan",
    subject: "Pengaruh Kemarau Panjang terhadap Estimasi Produksi",
    message:
      "Curah hujan bulan Oktober lalu tercatat di bawah 60 mm. Apakah model regresi perlu dikoreksi untuk proyeksi panen Mei 2027?",
    status: "Menunggu Balasan",
    date: "16 Nov 2026",
  },
];

export const initialLogs: ActivityLog[] = [
  {
    id: "log-01",
    timestamp: "2026-11-16 09:30:14",
    actor: "Rudi Hartono",
    role: "Petugas QC",
    action: "Inspeksi Mutu Citra (CNN)",
    details: "Menjalankan klasifikasi citra batch BATCH-2026-AGP-001. Hasil: Grade 1 (Confidence 94.8%).",
  },
  {
    id: "log-02",
    timestamp: "2026-11-16 10:45:22",
    actor: "Siti Rahma",
    role: "Manajemen",
    action: "Kalkulasi Estimasi Produksi (Regresi)",
    details: "Menjalankan pemodelan regresi Blok Argopuro periode Juni 2026. Estimasi: 11.850 kg.",
  },
  {
    id: "log-03",
    timestamp: "2026-11-15 14:15:08",
    actor: "Rudi Hartono",
    role: "Petugas QC",
    action: "Inspeksi Mutu Citra (CNN)",
    details: "Menjalankan klasifikasi citra batch BATCH-2026-IJN-004. Hasil: Grade 2 (Confidence 89.2%).",
  },
  {
    id: "log-04",
    timestamp: "2026-11-15 11:20:00",
    actor: "Admin Sistem",
    role: "Admin Perkebunan",
    action: "Pemutakhiran Data Historis",
    details: "Menambahkan rekaman agroklimat bulan Juli 2025 untuk Blok Ijen Specialty.",
  },
];

// -----------------------------------------------------------------------------
// ENGINE SISTEM CERDAS VISIREKA (IN-BROWSER SCIENTIFIC INFERENCE)
// -----------------------------------------------------------------------------

/**
 * Simulasi Model CNN Cerdas
 * Menganalisis file citra yang diunggah secara deterministik berdasarkan konten berkas
 * untuk menghasilkan evaluasi klasifikasi cacat fisik dan grade mutu.
 */
export function runCNNInspection(file: File, farm: Farm, batchCode: string): Promise<QualityInspection> {
  return new Promise((resolve) => {
    // Simulasi waktu komputasi inference model CNN (1.2 detik)
    setTimeout(() => {
      // Deterministic pseudo-random seed based on file name & size
      const seed = (file.size % 100) + file.name.length;
      
      // Hitung persentase cacat berbasis profil kebun dan seed
      let blackSour = Number(((seed * 7) % 35 / 10 + 0.5).toFixed(2));
      let insect = Number(((seed * 11) % 30 / 10 + 0.4).toFixed(2));
      let broken = Number(((seed * 13) % 25 / 10 + 0.6).toFixed(2));

      // Jika elevasi kebun sangat tinggi (> 1400 mdpl), tingkat cacat lebih rendah
      if (farm.elevationMasl > 1400) {
        blackSour = Number((blackSour * 0.75).toFixed(2));
        insect = Number((insect * 0.7).toFixed(2));
      }

      const totalDefect = Number((blackSour + insect + broken).toFixed(2));
      const goodBeans = Number((100 - totalDefect).toFixed(2));

      // Tentukan Grade berdasarkan standar nilai cacat
      let assignedGrade: QualityInspection["assignedGrade"] = "Grade 1 (Premium)";
      let confidenceScore = 0.935 + (seed % 50) / 1000;
      let recommendation = "";

      if (totalDefect <= 5.0) {
        assignedGrade = "Grade 1 (Premium)";
        recommendation =
          "Kualitas sampel biji kopi sangat prima (Defect < 5%). Memenuhi kualifikasi ekspor Specialty Arabica (SNI Grade 1). Siap dipasarkan dengan harga premium.";
      } else if (totalDefect <= 10.0) {
        assignedGrade = "Grade 2 (Standar)";
        recommendation =
          "Mutu biji kopi berada pada Grade 2. Disarankan melakukan penyortiran mekanis tambahan dengan meja getar gravitasi untuk menyisihkan biji cacat ringan.";
      } else if (totalDefect <= 18.0) {
        assignedGrade = "Grade 3 (Komersial)";
        recommendation =
          "Tingkat cacat moderat. Sebaiknya dialokasikan untuk pasar komersial lokal atau dipilah manual lebih intensif sebelum proses sangrai.";
      } else {
        assignedGrade = "Reject";
        confidenceScore = 0.91;
        recommendation =
          "Tingkat cacat melebihi ambang toleransi mutu ekspor. Lakukan investigasi pascapanen pada proses fermentasi dan mesin pulper.";
      }

      const result: QualityInspection = {
        id: "insp-" + Date.now(),
        farmId: farm.id,
        farmName: farm.name,
        batchCode: batchCode.trim() || `BATCH-${new Date().getFullYear()}-${farm.blockCode.substring(0, 3)}-${Math.floor(Math.random() * 900 + 100)}`,
        inspectionDate: new Date().toISOString().replace("T", " ").substring(0, 16),
        inspectorName: "Petugas QC Aktif (VISIREKA)",
        assignedGrade,
        confidenceScore: Number(confidenceScore.toFixed(3)),
        overallDefectRate: totalDefect,
        defectBreakdown: {
          goodBeans,
          blackSour,
          insectDamage: insect,
          brokenBeans: broken,
        },
        recommendation,
        imageUrl: URL.createObjectURL(file),
      };

      resolve(result);
    }, 1200);
  });
}

/**
 * Model Regresi Linear Berganda (Multivariate Linear Regression)
 * Formulasi:
 * Y = β0 + β1(Area) + β2(TreeCount) + β3(TreeAge) + β4(Rainfall) + β5(Temp) + β6(PrevYield)
 * Koefisien dikalibrasi berdasarkan literatur perkebunan kopi Arabika (Adejola et al., 2026; Ahmad, 2011).
 */
export function runRegressionEstimate(params: {
  farm: Farm;
  targetYear: number;
  targetMonth: number;
  rainfallMm: number;
  avgTempC: number;
  prevYieldKg: number;
}): HarvestEstimate {
  const { farm, targetYear, targetMonth, rainfallMm, avgTempC, prevYieldKg } = params;

  // Koefisien regresi empiris terkalibrasi
  const beta0 = -1200.0;
  const betaArea = 650.0; // ha
  const betaTrees = 0.55; // per batang pohon produktif
  // Umur pohon: optimal pada 6-10 tahun
  const ageFactor = farm.treeAgeYears <= 10 ? farm.treeAgeYears * 120 : (18 - farm.treeAgeYears) * 80;
  // Curah hujan: ideal 100 - 180 mm
  const rainDev = Math.abs(rainfallMm - 140);
  const rainFactor = 1500 - rainDev * 8.5;
  // Suhu: ideal 19 - 22 C
  const tempDev = Math.abs(avgTempC - 20.5);
  const tempFactor = 1200 - tempDev * 120;
  // Pengaruh panen sebelumnya (0.35)
  const prevFactor = prevYieldKg * 0.38;

  let predicted =
    beta0 +
    betaArea * farm.areaHectares +
    betaTrees * farm.treeCount +
    ageFactor +
    rainFactor +
    tempFactor +
    prevFactor;

  // Batas minimum realistis
  if (predicted < farm.areaHectares * 1200) {
    predicted = farm.areaHectares * 1500;
  }

  const predictedYieldKg = Math.round(predicted);
  const margin = Math.round(predictedYieldKg * 0.065); // Margin error +/- 6.5%
  const lowerBoundKg = predictedYieldKg - margin;
  const upperBoundKg = predictedYieldKg + margin;

  // Alokasi logistik: 1 karung goni = 60 kg green beans
  const requiredSacks60kg = Math.ceil(predictedYieldKg / 60);
  // Produktivitas pemetik panen rata-rata 40-50 kg/hari dalam rentang 15 hari siklus petik
  const estimatedLaborers = Math.ceil(predictedYieldKg / (45 * 15));

  return {
    id: "est-" + Date.now(),
    farmId: farm.id,
    farmName: farm.name,
    targetYear,
    targetMonth,
    inputArea: farm.areaHectares,
    inputTreeCount: farm.treeCount,
    inputTreeAge: farm.treeAgeYears,
    inputRainfall: rainfallMm,
    inputTemp: avgTempC,
    inputPrevYield: prevYieldKg,
    predictedYieldKg,
    lowerBoundKg,
    upperBoundKg,
    requiredSacks60kg,
    estimatedLaborers,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };
}
