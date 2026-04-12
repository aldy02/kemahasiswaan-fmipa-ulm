import api from "./axios";

// GET semua surats
export const getSurats = (params = {}) =>
  api.get("/surats", { params });

// GET surats by userId
export const getSuratsByUser = (userId) =>
  api.get("/surats", { params: { userId } });

// GET surats by userId + jenisSurat
export const getSuratsByUserAndJenis = (userId, jenisSurat) =>
  api.get("/surats", { params: { userId, jenisSurat } });

// GET single surat by id
export const getSuratById = (id) => api.get(`/surats/${id}`);

// POST create surat
export const createSurat = (data) => api.post("/surats", data);

// PUT update surat
export const updateSurat = (id, data) => api.put(`/surats/${id}`, data);

// DELETE surat
export const deleteSurat = (id) => api.delete(`/surats/${id}`);

// PER JENIS — shortcut getter & creator untuk tiap jenis surat
// Semua menggunakan tabel yang sama (/surats) dengan filter jenisSurat

const JENIS = {
  PEMINJAMAN_RUANGAN: "Peminjaman Ruangan",
  PEMINJAMAN_ALAT_BAHAN: "Peminjaman Alat/Bahan",
  IZIN_TIDAK_MENGIKUTI_KULIAH: "Izin Tidak Mengikuti Kuliah",
  IZIN_PRAKTIKUM_ULANG: "Izin Praktikum Ulang",
  REKOMENDASI: "Rekomendasi",
  KETERANGAN: "Keterangan",
  KETERANGAN_MAHASISWA_KULIAH: "Keterangan Mahasiswa Kuliah",
};

export { JENIS };

// Helper: GET by jenis (optional userId)
const getByJenis = (jenisSurat, userId) =>
  api.get("/surats", {
    params: userId ? { jenisSurat, userId } : { jenisSurat },
  });

// Helper: POST dengan jenisSurat injected
const createByJenis = (jenisSurat, data) =>
  api.post("/surats", { ...data, jenisSurat });

// Peminjaman Ruangan
export const getPeminjamanRuangan = (userId) => getByJenis(JENIS.PEMINJAMAN_RUANGAN, userId);
export const createPeminjamanRuangan = (data) => createByJenis(JENIS.PEMINJAMAN_RUANGAN, data);

// Peminjaman Alat/Bahan
export const getPeminjamanAlatBahan = (userId) => getByJenis(JENIS.PEMINJAMAN_ALAT_BAHAN, userId);
export const createPeminjamanAlatBahan = (data) => createByJenis(JENIS.PEMINJAMAN_ALAT_BAHAN, data);

// Izin Tidak Mengikuti Kuliah
export const getIzinTidakMengikutiKuliah = (userId) => getByJenis(JENIS.IZIN_TIDAK_MENGIKUTI_KULIAH, userId);
export const createIzinTidakMengikutiKuliah = (data) => createByJenis(JENIS.IZIN_TIDAK_MENGIKUTI_KULIAH, data);

// Izin Praktikum Ulang
export const getIzinPraktikumUlang = (userId) => getByJenis(JENIS.IZIN_PRAKTIKUM_ULANG, userId);
export const createIzinPraktikumUlang = (data) => createByJenis(JENIS.IZIN_PRAKTIKUM_ULANG, data);

// Rekomendasi
export const getRekomendasi = (userId) => getByJenis(JENIS.REKOMENDASI, userId);
export const createRekomendasi = (data) => createByJenis(JENIS.REKOMENDASI, data);

// Keterangan
export const getKeterangan = (userId) => getByJenis(JENIS.KETERANGAN, userId);
export const createKeterangan = (data) => createByJenis(JENIS.KETERANGAN, data);

// Keterangan Mahasiswa Kuliah
export const getKeteranganMahasiswaKuliah = (userId) => getByJenis(JENIS.KETERANGAN_MAHASISWA_KULIAH, userId);
export const createKeteranganMahasiswaKuliah = (data) => createByJenis(JENIS.KETERANGAN_MAHASISWA_KULIAH, data);

// DASHBOARD — 3 surat terbaru milik user
// MockAPI tidak support sorting, jadi sort di client
export const getRecentSurats = async (userId, limit = 3) => {
  const res = await getSuratsByUser(userId);
  const sorted = [...res.data].sort((a, b) => {
    // Parse DD-MM-YYYY
    const parseDate = (str) => {
      if (!str) return 0;
      const [d, m, y] = str.split("-");
      return new Date(`${y}-${m}-${d}`).getTime();
    };
    return parseDate(b.tanggalPengajuan) - parseDate(a.tanggalPengajuan);
  });
  return { ...res, data: sorted.slice(0, limit) };
};

// STATS — ringkasan status surat milik user (untuk dashboard)
export const getSuratStats = async (userId) => {
  const res = await getSuratsByUser(userId);
  const surats = res.data;
  return {
    total: surats.length,
    diterima: surats.filter((s) => s.status === "Diterima").length,
    revisi: surats.filter((s) => s.status === "Revisi").length,
    ditolak: surats.filter((s) => s.status === "Ditolak").length,
  };
};