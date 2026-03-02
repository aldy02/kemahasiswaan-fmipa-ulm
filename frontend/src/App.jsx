import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import PeminjamanRuangan from "./pages/dataSurat/PeminjamanRuangan";
import PeminjamanAlatBahan from "./pages/dataSurat/PeminjamanAlatBahan";


function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/data-surat/peminjaman-ruangan" element={<PeminjamanRuangan />} />
      <Route path="/data-surat/peminjaman-alat-bahan" element={<PeminjamanAlatBahan />} />
    </Routes>
  )
}

export default App