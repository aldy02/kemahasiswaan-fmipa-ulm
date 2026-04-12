export { default as api } from "./axios";

export {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  login,
} from "./userApi";

export {
  JENIS,
  getSurats,
  getSuratsByUser,
  getSuratsByUserAndJenis,
  getSuratById,
  createSurat,
  updateSurat,
  deleteSurat,
  getRecentSurats,
  getSuratStats,
  // Peminjaman Ruangan
  getPeminjamanRuangan,
  createPeminjamanRuangan,
  // Peminjaman Alat/Bahan
  getPeminjamanAlatBahan,
  createPeminjamanAlatBahan,
  // Izin Tidak Mengikuti Kuliah
  getIzinTidakMengikutiKuliah,
  createIzinTidakMengikutiKuliah,
  // Izin Praktikum Ulang
  getIzinPraktikumUlang,
  createIzinPraktikumUlang,
  // Rekomendasi
  getRekomendasi,
  createRekomendasi,
  // Keterangan
  getKeterangan,
  createKeterangan,
  // Keterangan Mahasiswa Kuliah
  getKeteranganMahasiswaKuliah,
  createKeteranganMahasiswaKuliah,
} from "./suratApi";