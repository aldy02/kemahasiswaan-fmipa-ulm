import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pengaturan from "./pages/Pengaturan";
import UnderConstruction from "./pages/UnderConstruction";

// Data Surat
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

// Pengajuan Surat
import FormPeminjamanRuangan from "./pages/pengajuanSurat/FormPeminjamanRuangan";
import FormPeminjamanAlatBahan from "./pages/pengajuanSurat/FormPeminjamanAlatBahan";
import FormIzinTidakMengikutiKuliah from "./pages/pengajuanSurat/FormIzinTidakMengikutiKuliah";
import FormIzinPraktikumUlang from "./pages/pengajuanSurat/FormIzinPraktikumUlang";
import FormRekomendasi from "./pages/pengajuanSurat/FormRekomendasi";
import FormKeterangan from "./pages/pengajuanSurat/FormKeterangan";
import FormKeteranganMahasiswaKuliah from "./pages/pengajuanSurat/FormKeteranganMahasiswaKuliah";

function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lupa-password" element={<UnderConstruction />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/pengaturan" element={<ProtectedRoute><Pengaturan /></ProtectedRoute>} />

        {/* Data Surat */}
        <Route path="/data-surat/peminjaman-ruangan" element={<ProtectedRoute><PeminjamanRuangan /></ProtectedRoute>} />
        <Route path="/data-surat/peminjaman-ruangan/:id" element={<ProtectedRoute><PeminjamanRuanganDetail /></ProtectedRoute>} />
        <Route path="/data-surat/peminjaman-alat-bahan" element={<ProtectedRoute><PeminjamanAlatBahan /></ProtectedRoute>} />
        <Route path="/data-surat/peminjaman-alat-bahan/:id" element={<ProtectedRoute><PeminjamanAlatBahanDetail /></ProtectedRoute>} />
        <Route path="/data-surat/izin-tidak-mengikuti-kuliah" element={<ProtectedRoute><IzinTidakMengikutiKuliah /></ProtectedRoute>} />
        <Route path="/data-surat/izin-tidak-mengikuti-kuliah/:id" element={<ProtectedRoute><IzinTidakMengikutiKuliahDetail /></ProtectedRoute>} />
        <Route path="/data-surat/izin-praktikum-ulang" element={<ProtectedRoute><IzinPraktikumUlang /></ProtectedRoute>} />
        <Route path="/data-surat/izin-praktikum-ulang/:id" element={<ProtectedRoute><IzinPraktikumUlangDetail /></ProtectedRoute>} />
        <Route path="/data-surat/rekomendasi" element={<ProtectedRoute><Rekomendasi /></ProtectedRoute>} />
        <Route path="/data-surat/rekomendasi/:id" element={<ProtectedRoute><RekomendasiDetail /></ProtectedRoute>} />
        <Route path="/data-surat/keterangan" element={<ProtectedRoute><Keterangan /></ProtectedRoute>} />
        <Route path="/data-surat/keterangan/:id" element={<ProtectedRoute><KeteranganDetail /></ProtectedRoute>} />
        <Route path="/data-surat/keterangan-mahasiswa-kuliah" element={<ProtectedRoute><KeteranganMahasiswaKuliah /></ProtectedRoute>} />
        <Route path="/data-surat/keterangan-mahasiswa-kuliah/:id" element={<ProtectedRoute><KeteranganMahasiswaKuliahDetail /></ProtectedRoute>} />

        {/* Pengajuan Surat */}
        <Route path="/pengajuan-surat/peminjaman-ruangan" element={<ProtectedRoute><FormPeminjamanRuangan /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/peminjaman-ruangan/edit/:id" element={<ProtectedRoute><FormPeminjamanRuangan /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/peminjaman-alat-bahan" element={<ProtectedRoute><FormPeminjamanAlatBahan /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/peminjaman-alat-bahan/edit/:id" element={<ProtectedRoute><FormPeminjamanAlatBahan /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/izin-tidak-mengikuti-kuliah" element={<ProtectedRoute><FormIzinTidakMengikutiKuliah /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/izin-tidak-mengikuti-kuliah/edit/:id" element={<ProtectedRoute><FormIzinTidakMengikutiKuliah /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/izin-praktikum-ulang" element={<ProtectedRoute><FormIzinPraktikumUlang /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/izin-praktikum-ulang/edit/:id" element={<ProtectedRoute><FormIzinPraktikumUlang /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/rekomendasi" element={<ProtectedRoute><FormRekomendasi /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/rekomendasi/edit/:id" element={<ProtectedRoute><FormRekomendasi /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/keterangan" element={<ProtectedRoute><FormKeterangan /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/keterangan/edit/:id" element={<ProtectedRoute><FormKeterangan /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/keterangan-mahasiswa-kuliah" element={<ProtectedRoute><FormKeteranganMahasiswaKuliah /></ProtectedRoute>} />
        <Route path="/pengajuan-surat/keterangan-mahasiswa-kuliah/edit/:id" element={<ProtectedRoute><FormKeteranganMahasiswaKuliah /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
