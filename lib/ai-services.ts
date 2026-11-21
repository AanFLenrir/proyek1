// lib/ai-services.ts
// Service Layer Terpisah untuk Integrasi Model AI VISIREKA (CNN & Linear Regression)
// Arsitektur ini disiapkan untuk integrasi langsung ke REST API Microservice Python (FastAPI/PyTorch)
// Saat ini beroperasi dalam Mode Simulasi Terstandarisasi berbasis aturan ilmiah SNI 01-2907-2008 & OLS

import {
  QualityInspection,
  HarvestEstimate,
  Farm,
  createDetectedObjects,
} from "./visireka-store";

export interface CNNPredictionResponse {
  isSimulation: boolean;
  modelVersion: string;
  inferenceTimeMs: number;
  inspection: QualityInspection;
}

export interface RegressionPredictionResponse {
  isSimulation: boolean;
  algorithm: string;
  rSquared: number;
  estimate: HarvestEstimate;
}

/**
 * Service Pemanggilan Model CNN untuk Klasifikasi & Deteksi Citra Biji Kopi
 * Endpoint Produksi Target: POST /api/v1/predict/cnn
 */
export async function predictCoffeeBeansCNN(params: {
  file?: File;
  sampleImageUrl?: string;
  farm: Farm;
  batchCode: string;
}): Promise<CNNPredictionResponse> {
  const { file, sampleImageUrl, farm, batchCode } = params;

  // Simulasi latensi jaringan inferensi AI (1.0 - 1.4 detik)
  await new Promise((resolve) => setTimeout(resolve, 1100));

  // Tentukan seed deterministik berdasarkan nama/ukuran berkas
  const seed = file
    ? (file.size % 100) + file.name.length
    : sampleImageUrl
    ? sampleImageUrl.length * 7
    : 42;

  // Tentukan defect rate dasar (antara 3.2% hingga 11.5%)
  let defectRate = Number(((seed % 70) / 10 + 3.2).toFixed(2));
  if (farm.elevationMasl > 1400) {
    defectRate = Number((defectRate * 0.75).toFixed(2));
  }

  // Bangkitkan objek deteksi butir kopi dengan koordinat spasial bounding box
  const totalObjectsCount = 20 + (seed % 6);
  const detectedObjects = createDetectedObjects(totalObjectsCount, defectRate, seed);

  // Hitung jumlah normal vs cacat aktual dari objek yang terbentuk
  const normalCount = detectedObjects.filter((o) => o.category === "Normal").length;
  const defectCount = detectedObjects.filter((o) => o.category === "Cacat").length;
  const actualDefectRate = Number(((defectCount / totalObjectsCount) * 100).toFixed(2));
  const goodBeansRate = Number((100 - actualDefectRate).toFixed(2));

  // Rincian proporsi jenis cacat
  const blackSourCount = detectedObjects.filter((o) => o.defectType === "Biji Hitam").length;
  const insectCount = detectedObjects.filter((o) => o.defectType === "Kerusakan Serangga").length;
  const brokenCount = detectedObjects.filter((o) => o.defectType === "Biji Pecah").length;
  // Penetapan Grade Mutu berdasarkan standar SNI 01-2907-2008 & SCA
  let assignedGrade: QualityInspection["assignedGrade"] = "Grade 1 (Premium)";
  let recommendation = "";

  if (actualDefectRate <= 6.0) {
    assignedGrade = "Grade 1 (Premium)";
    recommendation =
      "Mutu biji sangat prima (Defect < 6%). Memenuhi kualifikasi ekspor Specialty Arabica (SNI Grade 1). Siap dikemas dengan karung kedap udara GrainPro.";
  } else if (actualDefectRate <= 12.0) {
    assignedGrade = "Grade 2 (Standar)";
    recommendation =
      "Kualitas berada pada Grade 2. Disarankan melakukan penyortiran meja getar gravitasi (gravity table) untuk memisahkan biji berlubang serangga.";
  } else if (actualDefectRate <= 20.0) {
    assignedGrade = "Grade 3 (Komersial)";
    recommendation =
      "Tingkat cacat moderat. Disarankan untuk pasar komersial domestik atau dilakukan sortasi manual ulang sebelum proses roasting.";
  } else {
    assignedGrade = "Reject";
    recommendation =
      "Tingkat cacat melampaui toleransi mutu ekspor. Lakukan evaluasi pascapanen pada mesin pulper dan bak fermentasi.";
  }

  const confidenceScore = Number((0.925 + (seed % 55) / 1000).toFixed(3));

  const inspection: QualityInspection = {
    id: "insp-" + Date.now(),
    farmId: farm.id,
    farmName: farm.name,
    batchCode:
      batchCode.trim() ||
      `BATCH-${new Date().getFullYear()}-${farm.blockCode.substring(0, 3)}-${Math.floor(Math.random() * 900 + 100)}`,
    inspectionDate: new Date().toISOString().replace("T", " ").substring(0, 16),
    inspectorName: "Rudi Hartono (Petugas QC Aktif)",
    assignedGrade,
    confidenceScore,
    overallDefectRate: actualDefectRate,
    totalObjectsCount,
    normalObjectsCount: normalCount,
    defectObjectsCount: defectCount,
    defectBreakdown: {
      goodBeans: goodBeansRate,
      blackSour: Number(((blackSourCount / totalObjectsCount) * 100).toFixed(1)),
      insectDamage: Number(((insectCount / totalObjectsCount) * 100).toFixed(1)),
      brokenBeans: Number(((brokenCount / totalObjectsCount) * 100).toFixed(1)),
    },
    recommendation,
    imageUrl: file ? URL.createObjectURL(file) : sampleImageUrl || "/images/coffee-beans-sample.jpg",
    detectedObjects,
  };

  return {
    isSimulation: true, // Label transparan akademik (Mode Demonstrasi)
    modelVersion: "Mode Demonstrasi (Simulasi Pemeriksaan Mutu Biji Kopi)",
    inferenceTimeMs: 1100,
    inspection,
  };
}

/**
 * Service Pemanggilan Model Regresi Linear untuk Estimasi Volume Panen Kopi
 * Endpoint Produksi Target: POST /api/v1/predict/regression
 */
export async function predictHarvestRegression(params: {
  farm: Farm;
  targetYear: number;
  targetMonth: number;
  areaHa: number;
  treeCount: number;
  treeAgeYears: number;
  rainfallMm: number;
  avgTempC: number;
  prevYieldKg: number;
}): Promise<RegressionPredictionResponse> {
  const { farm, targetYear, targetMonth, areaHa, treeCount, treeAgeYears, rainfallMm, avgTempC, prevYieldKg } = params;

  // Simulasi latensi komputasi regresi
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Formulasi regresi multivariat OLS terkalibrasi secara ilmiah
  const beta0 = -1200.0;
  const betaArea = 650.0;
  const betaTrees = 0.55;
  const ageFactor = treeAgeYears <= 10 ? treeAgeYears * 120 : (18 - treeAgeYears) * 80;
  const rainDev = Math.abs(rainfallMm - 140);
  const rainFactor = 1500 - rainDev * 8.5;
  const tempDev = Math.abs(avgTempC - 20.5);
  const tempFactor = 1200 - tempDev * 120;
  const prevFactor = prevYieldKg * 0.38;

  let predicted = beta0 + betaArea * areaHa + betaTrees * treeCount + ageFactor + rainFactor + tempFactor + prevFactor;

  // Batas minimum logis per hektar
  if (predicted < areaHa * 1200) {
    predicted = areaHa * 1500;
  }

  const predictedYieldKg = Math.round(predicted);
  const margin = Math.round(predictedYieldKg * 0.065);
  const lowerBoundKg = predictedYieldKg - margin;
  const upperBoundKg = predictedYieldKg + margin;
  const requiredSacks60kg = Math.ceil(predictedYieldKg / 60);
  const estimatedLaborers = Math.ceil(predictedYieldKg / (45 * 15));

  const estimate: HarvestEstimate = {
    id: "est-" + Date.now(),
    farmId: farm.id,
    farmName: farm.name,
    targetYear,
    targetMonth,
    inputArea: areaHa,
    inputTreeCount: treeCount,
    inputTreeAge: treeAgeYears,
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

  return {
    isSimulation: true, // Label transparan akademik (Mode Demonstrasi)
    algorithm: "Regresi Linear (Mode Demonstrasi)",
    rSquared: 0.842,
    estimate,
  };
}
