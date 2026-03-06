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
    </Routes>
  )
}

export default App