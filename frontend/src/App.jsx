import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import PeminjamanRuangan from "./pages/dataSurat/PeminjamanRuangan";


function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/peminjaman" element={<PeminjamanRuangan />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
