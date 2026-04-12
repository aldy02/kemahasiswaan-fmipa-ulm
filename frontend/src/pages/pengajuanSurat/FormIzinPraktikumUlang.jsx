// src/pages/pengajuanSurat/FormIzinPraktikumUlang.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, CalendarDays, Info, MessageSquare, Plus, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { izinPraktikumUlangData } from "../../test/data";
import {
  FormLabel, FormTextInput, FormSelectInput, FormDateInput, FormTextarea,
  FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, toFormDate,
} from "../../components/FormComponents";

const PRODI_OPTIONS = [
  "S1 Matematika", "S1 Statistika", "S1 Fisika", "S1 Kimia",
  "S1 Biologi", "S1 Ilmu Komputer", "S1 Farmasi",
];

function MahasiswaSection({ items, setItems }) {
  const addItem = () => setItems([...items, { nim: "", nama: "", mataKuliah: "", prodi: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i, f, v) => setItems(items.map((it, idx) => idx === i ? { ...it, [f]: v } : it));

  return (
    <div className="flex flex-col gap-5">
      {items.map((it, i) => (
        <div key={i}>
          <p className="hidden lg:block text-sm font-semibold text-primary-1 mb-4">Mahasiswa {i + 1}</p>
          <div className="lg:hidden flex items-center justify-between mb-4">
            <p className="text-[13px] font-semibold text-primary-1">Mahasiswa {i + 1}</p>
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="w-6 h-6 flex items-center justify-center rounded-full bg-error-2 text-white hover:bg-red-500 transition-colors shrink-0">
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="hidden lg:flex items-end gap-3">
            <div className="flex-1"><FormLabel required>NIM Mahasiswa</FormLabel><FormTextInput placeholder="Masukkan NIM mahasiswa" value={it.nim} onChange={(v) => update(i, "nim", v)} /></div>
            <div className="flex-1"><FormLabel required>Nama Mahasiswa</FormLabel><FormTextInput placeholder="Masukkan nama mahasiswa" value={it.nama} onChange={(v) => update(i, "nama", v)} /></div>
            <div className="flex-1"><FormLabel required>Mata Kuliah</FormLabel><FormTextInput placeholder="Masukkan mata kuliah" value={it.mataKuliah} onChange={(v) => update(i, "mataKuliah", v)} /></div>
            <div className="flex-1"><FormLabel required>Program Studi Mahasiswa</FormLabel><FormSelectInput placeholder="Pilih program studi mahasiswa" value={it.prodi} onChange={(v) => update(i, "prodi", v)} options={PRODI_OPTIONS} /></div>
            {items.length > 1 ? (
              <button onClick={() => removeItem(i)} className="w-10.5 h-10.5 flex items-center justify-center rounded-xl border border-slate-200 bg-gray-50 text-slate-400 hover:border-error-1 hover:bg-error-1/5 hover:text-error-1 transition-colors shrink-0">
                <X size={16} strokeWidth={2} />
              </button>
            ) : <div className="w-10.5 shrink-0" />}
          </div>
          {i < items.length - 1 && <hr className="hidden lg:block border-slate-200 mt-7" />}
          <div className="lg:hidden flex flex-col gap-3">
            <div><FormLabel required>NIM Mahasiswa</FormLabel><FormTextInput placeholder="Masukkan NIM mahasiswa" value={it.nim} onChange={(v) => update(i, "nim", v)} /></div>
            <div><FormLabel required>Nama Mahasiswa</FormLabel><FormTextInput placeholder="Masukkan nama mahasiswa" value={it.nama} onChange={(v) => update(i, "nama", v)} /></div>
            <div><FormLabel required>Mata Kuliah</FormLabel><FormTextInput placeholder="Masukkan mata kuliah" value={it.mataKuliah} onChange={(v) => update(i, "mataKuliah", v)} /></div>
            <div><FormLabel required>Program Studi Mahasiswa</FormLabel><FormSelectInput placeholder="Pilih program studi mahasiswa" value={it.prodi} onChange={(v) => update(i, "prodi", v)} options={PRODI_OPTIONS} /></div>
          </div>
          {i < items.length - 1 && <hr className="lg:hidden border-slate-200 mt-5" />}
        </div>
      ))}
      <div>
        <button onClick={addItem} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-2 hover:bg-blue-600 text-white text-[13px] font-semibold rounded-xl transition-colors">
          <Plus size={14} /> Tambah
        </button>
      </div>
    </div>
  );
}

export default function FormIzinPraktikumUlang() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [mahasiswaItems, setMahasiswaItems] = useState([{ nim: "", nama: "", mataKuliah: "", prodi: "" }]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [sebab, setSebab] = useState("");
  const [tempat, setTempat] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const item = izinPraktikumUlangData.find((d) => d.id === Number(id));
    if (!item) return;
    setMahasiswaItems(
      item.mahasiswas?.length
        ? item.mahasiswas.map((m) => ({ nim: m.nim || "", nama: m.nama || "", mataKuliah: m.mataKuliah || "", prodi: m.prodi || "" }))
        : [{ nim: "", nama: "", mataKuliah: "", prodi: "" }]
    );
    setTanggalMulai(toFormDate(item.tanggalMulai));
    setTanggalAkhir(toFormDate(item.tanggalAkhir));
    setSebab(item.sebab || "");
    setTempat(item.tempat || "");
    setKeterangan(item.keterangan|| "");
  }, [id, isEdit]);

  const title = isEdit ? "Ubah Surat Izin Praktikum Ulang" : "Pengajuan Surat Izin Praktikum Ulang";
  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan izin praktikum ulang";

  const s1 = (
    <FormCard icon={<Users size={18} />} title="Data Mahasiswa" subtitle="Informasi lengkap mahasiswa yang mengajukan izin praktikum ulang">
      <MahasiswaSection items={mahasiswaItems} setItems={setMahasiswaItems} />
    </FormCard>
  );

  const s2 = (
    <FormCard icon={<CalendarDays size={18} />} title="Jadwal Izin" subtitle="Tentukan periode waktu izin tidak mengikuti kuliah">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div><FormLabel required>Tanggal Mulai</FormLabel><FormDateInput value={tanggalMulai} onChange={setTanggalMulai} /></div>
        <div><FormLabel required>Tanggal Akhir</FormLabel><FormDateInput value={tanggalAkhir} onChange={setTanggalAkhir} /></div>
      </div>
    </FormCard>
  );

  const s3 = (
    <FormCard icon={<Info size={18} />} title="Alasan & Tempat Izin" subtitle="Sebab dan lokasi terkait izin tidak mengikuti kuliah">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div><FormLabel required>Sebab</FormLabel><FormTextarea placeholder="Masukkan alasan tidak mengikuti kuliah" value={sebab} onChange={setSebab} rows={3} /></div>
        <div><FormLabel required>Tempat</FormLabel><FormTextarea placeholder="Masukkan lokasi/tempat tujuan" value={tempat} onChange={setTempat} rows={3} /></div>
      </div>
    </FormCard>
  );

  const s4 = (
    <FormCard icon={<MessageSquare size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait izin praktikum ulang">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={keterangan} onChange={setKeterangan} />
    </FormCard>
  );

  const sections = [s1, s2, s3, s4];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Izin Praktikum Ulang" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Izin Praktikum Ulang" subtitle={subtitle} footer={<FormDesktopFooter />}>
          {sections}
        </FormDesktopPanel>
        <FormMobileCards>{sections}</FormMobileCards>
        <FormMobileFooter />
      </div>
    </MainLayout>
  );
}