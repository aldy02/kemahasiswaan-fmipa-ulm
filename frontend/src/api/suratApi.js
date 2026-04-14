import api from "./axios";

// GET semua surat
export const getSurats = () => api.get("/surats");

// GET surat by id
export const getSuratById = (id) => api.get(`/surats/${id}`);

// POST create surat
export const createSurat = (data) => api.post("/surats", data);

// PUT update surat
export const updateSurat = (id, data) => api.put(`/surats/${id}`, data);

// DELETE surat
export const deleteSurat = (id) => api.delete(`/surats/${id}`);

// GET surat by userId — filter di client karena MockAPI tidak support query params
export const getSuratsByUser = async (userId) => {
  const res = await getSurats();
  return { ...res, data: res.data.filter((s) => s.userId === userId) };
};

// GET surats by userId + jenisSurat
export const getSuratsByUserAndJenis = async (userId, jenisSurat) => {
  const res = await getSurats();
  return {
    ...res,
    data: res.data.filter(
      (s) => s.userId === userId && s.jenisSurat === jenisSurat
    ),
  };
};

// Const jenis surat
export const JENIS = {
  PEMINJAMAN_RUANGAN: "Peminjaman Ruangan",
  PEMINJAMAN_ALAT_BAHAN: "Peminjaman Alat/Bahan",
  IZIN_TIDAK_MENGIKUTI_KULIAH: "Izin Tidak Mengikuti Kuliah",
  IZIN_PRAKTIKUM_ULANG: "Izin Praktikum Ulang",
  REKOMENDASI: "Rekomendasi",
  KETERANGAN: "Keterangan",
  KETERANGAN_MAHASISWA_KULIAH: "Keterangan Mahasiswa Kuliah",
};

// GET by jenis + userId
const getByJenis = async (jenisSurat, userId) => {
  const res = await getSurats();
  return {
    ...res,
    data: res.data.filter(
      (s) => s.jenisSurat === jenisSurat && (!userId || s.userId === userId)
    ),
  };
};

// POST dengan jenisSurat
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