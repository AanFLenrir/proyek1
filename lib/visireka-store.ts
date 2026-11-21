// lib/visireka-store.ts
// Penyimpanan Data Terintegrasi, Simulasi Model AI (CNN & Regresi), dan Utilitas VISIREKA
// Mengacu pada Standar Mutu SNI 01-2907-2008 & SCA Protocols

export type UserRole = "qc_inspector" | "farm_admin" | "management" | "super_admin";

export type BeanDefectType =
  | "Normal"
  | "Biji Hitam"
  | "Biji Pecah"
  | "Kerusakan Serangga"
  | "Biji Belum Matang"
  | "Biji Belum Matang / Jamur";

export interface DetectedBeanObject {
  id: string; // e.g. "obj-01"
  labelNumber: number; // 1, 2, 3...
  category: "Normal" | "Cacat";
  defectType: BeanDefectType;
  confidence: number; // 0.85 - 0.99
  // Bounding box dalam persentase kontainer gambar (0 - 100%)
  x: number; // percentage left
  y: number; // percentage top
  width: number; // percentage width
  height: number; // percentage height
  description: string;
  recommendation: string;
}

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
  totalObjectsCount?: number;
  normalObjectsCount?: number;
  defectObjectsCount?: number;
  defectBreakdown: DefectBreakdown;
  recommendation: string;
  imageUrl?: string;
  detectedObjects?: DetectedBeanObject[];
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
  imageUrl?: string;
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
// HELPER PEMBENTUKAN OBJEK DETEKSI DENGAN KOORDINAT SPASIAL
// Disesuaikan secara presisi dengan posisi biji pada citra coffee-beans-sample.jpg (896x432 px)
// -----------------------------------------------------------------------------

export const COFFEE_BEAN_ANCHORS = [
  // Baris Atas (y: 11% - 15%)
  { x: 6.8, y: 11.5, w: 7.2, h: 14.5 },
  { x: 16.5, y: 13.5, w: 7.0, h: 15.0 },
  { x: 26.5, y: 11.0, w: 7.2, h: 14.0 },
  { x: 36.5, y: 13.0, w: 7.0, h: 14.5 },
  { x: 46.5, y: 11.5, w: 7.2, h: 14.2 },
  { x: 57.0, y: 14.0, w: 7.0, h: 14.5 },
  { x: 67.0, y: 11.5, w: 7.2, h: 14.0 },
  { x: 77.0, y: 13.0, w: 7.0, h: 14.5 },
  { x: 86.5, y: 11.5, w: 7.0, h: 14.0 },

  // Baris Tengah (y: 39% - 44%)
  { x: 5.5, y: 40.5, w: 7.2, h: 14.5 },
  { x: 15.0, y: 43.0, w: 7.0, h: 14.0 },
  { x: 24.8, y: 38.5, w: 7.2, h: 14.5 },
  { x: 34.8, y: 41.5, w: 7.0, h: 14.0 },
  { x: 44.8, y: 39.0, w: 7.2, h: 14.5 },
  { x: 54.8, y: 42.0, w: 7.0, h: 14.0 },
  { x: 65.0, y: 38.5, w: 7.2, h: 14.5 },
  { x: 75.0, y: 41.5, w: 7.0, h: 14.0 },
  { x: 85.0, y: 39.5, w: 7.2, h: 14.5 },

  // Baris Bawah (y: 67% - 73%)
  { x: 8.0, y: 68.5, w: 7.2, h: 14.5 },
  { x: 18.0, y: 71.5, w: 7.0, h: 14.0 },
  { x: 28.0, y: 67.5, w: 7.2, h: 14.5 },
  { x: 38.5, y: 70.5, w: 7.0, h: 14.0 },
  { x: 49.0, y: 68.5, w: 7.2, h: 14.5 },
  { x: 59.5, y: 71.5, w: 7.0, h: 14.0 },
  { x: 70.0, y: 68.0, w: 7.2, h: 14.5 },
  { x: 80.5, y: 70.5, w: 7.0, h: 14.0 },
];

export function createDetectedObjects(
  count: number = 20,
  defectRatePercent: number = 5.0,
  seed: number = 42
): DetectedBeanObject[] {
  const objects: DetectedBeanObject[] = [];
  const maxAvailable = COFFEE_BEAN_ANCHORS.length;
  const actualCount = Math.min(count, maxAvailable);
  const targetDefects = Math.max(1, Math.round((actualCount * defectRatePercent) / 100));

  const defectTypesPool: BeanDefectType[] = [
    "Biji Hitam",
    "Kerusakan Serangga",
    "Biji Pecah",
    "Biji Belum Matang",
  ];

  // Tentukan indeks objek yang cacat secara deterministik
  const defectIndices = new Set<number>();
  for (let i = 0; i < targetDefects; i++) {
    const idx = (seed * 3 + i * 7) % actualCount;
    defectIndices.add(idx);
  }

  for (let i = 0; i < actualCount; i++) {
    const anchor = COFFEE_BEAN_ANCHORS[i];
    const isDefect = defectIndices.has(i);
    const defectType: BeanDefectType = isDefect
      ? defectTypesPool[(seed + i) % defectTypesPool.length]
      : "Normal";

    let description = "Biji kopi Arabika utuh dengan bentuk oval simetris dan warna seragam.";
    let recommendation = "Memenuhi kualifikasi fisik grade specialty, teruskan ke proses penimbangan.";

    if (defectType === "Biji Hitam") {
      description =
        "Cacat primer: Biji mengalami nekrosis atau pembusukan jaringan dengan warna hitam pekat.";
      recommendation = "Pisahkan secara manual dari meja sortasi agar tidak mencemari profil aroma sangrai.";
    } else if (defectType === "Kerusakan Serangga") {
      description =
        "Cacat sekunder: Terdapat lubang gerek bekas hama penggerek buah kopi (Hypothenemus hampei).";
      recommendation = "Lakukan penyingkiran dengan meja gravitasi (density table) dan periksa perangkap kebun.";
    } else if (defectType === "Biji Pecah") {
      description =
        "Cacat sekunder: Biji terbelah atau patah akibat tekanan mekanis mesin pengupas (pulper).";
      recommendation = "Kalibrasi jarak pisau mesin pulper dan alokasikan biji pecah untuk segmen kopi komersial.";
    } else if (defectType === "Biji Belum Matang") {
      description =
        "Cacat fisik: Biji dipetik sebelum matang fisiologis optimal dengan warna kehijauan pucat.";
      recommendation = "Pastikan pemetikan hanya buah ceri merah matang dan perbaiki ventilasi lantai jemur.";
    }

    const confidence = Number((0.92 + ((seed * (i + 3)) % 70) / 1000).toFixed(3));

    objects.push({
      id: `obj-${String(i + 1).padStart(2, "0")}`,
      labelNumber: i + 1,
      category: isDefect ? "Cacat" : "Normal",
      defectType,
      confidence,
      x: anchor.x,
      y: anchor.y,
      width: anchor.w,
      height: anchor.h,
      description,
      recommendation,
    });
  }

  return objects;
}

// -----------------------------------------------------------------------------
// PRESET CONTOH CITRA UNTUK PENGUJIAN CEPAT (TEST SAMPLES)
// Menggunakan foto asli biji kopi Arabika (bukan screenshot UI)
// -----------------------------------------------------------------------------

export interface SamplePreset {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  farmId: string;
  batchCode: string;
  expectedGrade: string;
}

export const samplePresets: SamplePreset[] = [
  {
    id: "sample-specialty",
    name: "Sample 01: Lot Specialty Argopuro",
    subtitle: "Kualitas Grade 1 Premium (Defect < 5%)",
    imageUrl: "/images/coffee-beans-sample.jpg",
    farmId: "farm-01",
    batchCode: "BATCH-2026-AGP-SPEC-01",
    expectedGrade: "Grade 1 (Premium)",
  },
  {
    id: "sample-standard",
    name: "Sample 02: Lot Ijen Pasca-Panen",
    subtitle: "Kualitas Grade 2 Standar (Defect ~ 9.5%)",
    imageUrl: "/images/coffee-beans-sample-2.jpg",
    farmId: "farm-02",
    batchCode: "BATCH-2026-IJN-STD-02",
    expectedGrade: "Grade 2 (Standar)",
  },
  {
    id: "sample-borer",
    name: "Sample 03: Lot Uji Kritis Defek Serangga PBKo",
    subtitle: "Uji Deteksi Biji Berlubang & Cacat Hitam",
    imageUrl: "/images/coffee-beans-sample-3.jpg",
    farmId: "farm-03",
    batchCode: "BATCH-2026-ARJ-TEST-03",
    expectedGrade: "Grade 3 (Komersial)",
  },
];

// -----------------------------------------------------------------------------
// SEED DATA MASTER
// -----------------------------------------------------------------------------

export const initialFarms: Farm[] = [
  {
    id: "farm-01",
    name: "Perkebunan Argopuro Lestari",
    blockCode: "BLOK-AGP-01",
    location: "Lereng Gunung Argopuro, Jember (1.350 mdpl)",
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
    location: "Kawah Ijen, Bondowoso (1.480 mdpl)",
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
    location: "Lereng Gunung Arjuno, Malang (1.250 mdpl)",
    elevationMasl: 1250,
    areaHectares: 3.5,
    treeCount: 7000,
    variety: "Arabica Lini S & Komasti",
    treeAgeYears: 5.0,
    status: "Aktif",
  },
];

// Inisialisasi data inspeksi dengan objek bounding box nyata
const sampleObj1 = createDetectedObjects(20, 4.5, 101);
const sampleObj2 = createDetectedObjects(20, 9.8, 202);
const sampleObj3 = createDetectedObjects(20, 3.2, 303);

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
    totalObjectsCount: 20,
    normalObjectsCount: 19,
    defectObjectsCount: 1,
    defectBreakdown: {
      goodBeans: 95.75,
      blackSour: 1.5,
      insectDamage: 1.25,
      brokenBeans: 1.5,
    },
    recommendation:
      "Mutu biji memenuhi kualifikasi ekspor Specialty Arabica (SNI Grade 1). Lanjutkan ke tahapan penimbangan dan pengemasan kedap udara (GrainPro).",
    imageUrl: "/images/coffee-beans-sample.jpg",
    detectedObjects: sampleObj1,
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
    totalObjectsCount: 20,
    normalObjectsCount: 18,
    defectObjectsCount: 2,
    defectBreakdown: {
      goodBeans: 90.2,
      blackSour: 3.6,
      insectDamage: 3.2,
      brokenBeans: 3.0,
    },
    recommendation:
      "Tingkat cacat berada pada ambang Grade 2. Disarankan melakukan penyortiran ulang meja getar gravitasi (density table) untuk memisahkan biji terserang borer.",
    imageUrl: "/images/coffee-beans-sample-2.jpg",
    detectedObjects: sampleObj2,
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
    totalObjectsCount: 20,
    normalObjectsCount: 19,
    defectObjectsCount: 1,
    defectBreakdown: {
      goodBeans: 96.9,
      blackSour: 0.8,
      insectDamage: 1.1,
      brokenBeans: 1.2,
    },
    recommendation:
      "Kualitas fisik biji sangat prima dengan keseragaman warna hijau kebiruan merata. Sangat potensial untuk lot lelang Specialty Coffee.",
    imageUrl: "/images/coffee-beans-sample-3.jpg",
    detectedObjects: sampleObj3,
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
      "Panduan komprehensif penentuan nilai cacat (defect value) sistem 300 gram untuk menembus pasar ekspor Specialty Coffee.",
    content:
      "Standar Nasional Indonesia (SNI 01-2907-2008) mengklasifikasikan mutu biji kopi berdasarkan jumlah nilai cacat per 300 gram sampel uji. Biji kopi Grade 1 memiliki total nilai cacat maksimum 11. Cacat primer mencakup biji hitam penuh (nilai 1) dan biji berjamur (nilai 1). Sementara cacat sekunder mencakup biji pecah (5 biji = nilai 1) dan biji berlubang serangga (5 biji = nilai 1). Model CNN VISIREKA dilatih secara khusus untuk mendeteksi kontur mikroskopis dan diskolorisasi ini secara otomatis.",
    date: "12 Nov 2026",
    imageUrl: "/images/coffee-beans-sample.jpg",
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
    imageUrl: "/images/plantation.png",
  },
  {
    id: "art-03",
    title: "Manajemen Pascapanen: Kunci Mempertahankan Cupping Score di Atas 85",
    category: "Pascapanen",
    readTime: "6 menit",
    summary:
      "Teknik perendaman (fermentasi anaerob), pencucian, serta penjemuran di atas raised beds untuk menghindari fermentasi asam.",
    content:
      "Cacat Black/Sour beans seringkali disebabkan oleh keterlambatan pengupasan kulit buah (pulping) setelah panen atau penumpukan ceri basah tanpa aerasi. Penggunaan sistem pemantauan kualitas VISIREKA membantu petugas quality control mengenali tren kenaikan cacat sour bean sebelum merusak seluruh lot produksi.",
    date: "01 Nov 2026",
    imageUrl: "/images/dashboard-preview.png",
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

// Re-export run functions for backward compatibility
export async function runCNNInspection(file: File, farm: Farm, batchCode: string): Promise<QualityInspection> {
  const { predictCoffeeBeansCNN } = await import("./ai-services");
  const response = await predictCoffeeBeansCNN({ file, farm, batchCode });
  return response.inspection;
}

export function runRegressionEstimate(params: {
  farm: Farm;
  targetYear: number;
  targetMonth: number;
  rainfallMm: number;
  avgTempC: number;
  prevYieldKg: number;
}): HarvestEstimate {
  const { farm, targetYear, targetMonth, rainfallMm, avgTempC, prevYieldKg } = params;
  const beta0 = -1200.0;
  const betaArea = 650.0;
  const betaTrees = 0.55;
  const ageFactor = farm.treeAgeYears <= 10 ? farm.treeAgeYears * 120 : (18 - farm.treeAgeYears) * 80;
  const rainDev = Math.abs(rainfallMm - 140);
  const rainFactor = 1500 - rainDev * 8.5;
  const tempDev = Math.abs(avgTempC - 20.5);
  const tempFactor = 1200 - tempDev * 120;
  const prevFactor = prevYieldKg * 0.38;

  let predicted =
    beta0 +
    betaArea * farm.areaHectares +
    betaTrees * farm.treeCount +
    ageFactor +
    rainFactor +
    tempFactor +
    prevFactor;

  if (predicted < farm.areaHectares * 1200) {
    predicted = farm.areaHectares * 1500;
  }

  const predictedYieldKg = Math.round(predicted);
  const margin = Math.round(predictedYieldKg * 0.065);
  const lowerBoundKg = predictedYieldKg - margin;
  const upperBoundKg = predictedYieldKg + margin;
  const requiredSacks60kg = Math.ceil(predictedYieldKg / 60);
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
