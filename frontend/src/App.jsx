import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import PeminjamanRuangan from "./pages/dataSurat/PeminjamanRuangan";
import PeminjamanRuanganDetail from "./pages/dataSurat/PeminjamanRuanganDetail";
import PeminjamanAlatBahan from "./pages/dataSurat/PeminjamanAlatBahan";
import PeminjamanAlatBahanDetail from "./pages/dataSurat/PeminjamanAlatBahanDetail";
import IzinTidakMengikutiKuliah from "./pages/dataSurat/IzinTidakMengikutiKuliah";
import IzinTidakMengikutiKuliahDetail from "./pages/dataSurat/IzinTidakMengikutiKuliahDetail";
import IzinPraktikumUlang from "./pages/dataSurat/IzinPraktikumUlang";
import IzinPraktikumUlangDetail from "./pages/dataSurat/IzinPraktikumUlangDetail";
import Rekomendasi from "./pages/dataSurat/Rekomendasi";
import RekomendasiDetail from "./pages/dataSurat/RekomendasiDetail";
import Keterangan from "./pages/dataSurat/Keterangan";
import KeteranganDetail from "./pages/dataSurat/KeteranganDetail";
import KeteranganMahasiswaKuliah from "./pages/dataSurat/KeteranganMahasiswaKuliah";
import KeteranganMahasiswaKuliahDetail from "./pages/dataSurat/KeteranganMahasiswaKuliahDetail";
import FormPeminjamanRuangan from "./pages/pengajuanSurat/FormPeminjamanRuangan";
import FormPeminjamanAlatBahan from "./pages/pengajuanSurat/FormPeminjamanAlatBahan";
import FormIzinTidakMengikutiKuliah from "./pages/pengajuanSurat/FormIzinTidakMengikutiKuliah";
import FormIzinPraktikumUlang from "./pages/pengajuanSurat/FormIzinPraktikumUlang";
import FormRekomendasi from "./pages/pengajuanSurat/FormRekomendasi";
import FormKeterangan from "./pages/pengajuanSurat/FormKeterangan";
import FormKeteranganMahasiswaKuliah from "./pages/pengajuanSurat/FormKeteranganMahasiswaKuliah";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/data-surat/peminjaman-ruangan" element={<PeminjamanRuangan />} />
      <Route path="/data-surat/peminjaman-ruangan/:id" element={<PeminjamanRuanganDetail />} />
      <Route path="/data-surat/peminjaman-alat-bahan" element={<PeminjamanAlatBahan />} />
      <Route path="/data-surat/peminjaman-alat-bahan/:id" element={<PeminjamanAlatBahanDetail />} />
      <Route path="/data-surat/izin-tidak-mengikuti-kuliah" element={<IzinTidakMengikutiKuliah />} />
      <Route path="/data-surat/izin-tidak-mengikuti-kuliah/:id" element={<IzinTidakMengikutiKuliahDetail />} />
      <Route path="/data-surat/izin-praktikum-ulang" element={<IzinPraktikumUlang />} />
      <Route path="/data-surat/izin-praktikum-ulang/:id" element={<IzinPraktikumUlangDetail />} />
      <Route path="/data-surat/rekomendasi" element={<Rekomendasi />} />
      <Route path="/data-surat/rekomendasi/:id" element={<RekomendasiDetail />} />
      <Route path="/data-surat/keterangan" element={<Keterangan />} />
      <Route path="/data-surat/keterangan/:id" element={<KeteranganDetail />} />
      <Route path="/data-surat/keterangan-mahasiswa-kuliah" element={<KeteranganMahasiswaKuliah />} />
      <Route path="/data-surat/keterangan-mahasiswa-kuliah/:id" element={<KeteranganMahasiswaKuliahDetail />} />
      <Route path="/pengajuan-surat/peminjaman-ruangan" element={<FormPeminjamanRuangan />} />
      <Route path="/pengajuan-surat/peminjaman-ruangan/edit/:id" element={<FormPeminjamanRuangan />} />
      <Route path="/pengajuan-surat/peminjaman-alat-bahan" element={<FormPeminjamanAlatBahan />} />
      <Route path="/pengajuan-surat/peminjaman-alat-bahan/edit/:id" element={<FormPeminjamanAlatBahan />} />
      <Route path="/pengajuan-surat/izin-tidak-mengikuti-kuliah" element={<FormIzinTidakMengikutiKuliah />} />
      <Route path="/pengajuan-surat/izin-tidak-mengikuti-kuliah/edit/:id" element={<FormIzinTidakMengikutiKuliah />} />
      <Route path="/pengajuan-surat/izin-praktikum-ulang" element={<FormIzinPraktikumUlang />} />
      <Route path="/pengajuan-surat/izin-praktikum-ulang/edit/:id" element={<FormIzinPraktikumUlang />} />
      <Route path="/pengajuan-surat/rekomendasi" element={<FormRekomendasi />} />
      <Route path="/pengajuan-surat/rekomendasi/edit/:id" element={<FormRekomendasi />} />
      <Route path="/pengajuan-surat/keterangan" element={<FormKeterangan />} />
      <Route path="/pengajuan-surat/keterangan/edit/:id" element={<FormKeterangan />} />
      <Route path="/pengajuan-surat/keterangan-mahasiswa-kuliah" element={<FormKeteranganMahasiswaKuliah />} />
      <Route path="/pengajuan-surat/keterangan-mahasiswa-kuliah/edit/:id" element={<FormKeteranganMahasiswaKuliah />} />
    </Routes>
  )
}

export default App