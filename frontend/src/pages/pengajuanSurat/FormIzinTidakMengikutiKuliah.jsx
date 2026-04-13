// src/pages/pengajuanSurat/FormIzinTidakMengikutiKuliah.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, GraduationCap, CalendarDays, Info, MessageSquare, Plus, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { getSuratById, createSurat, updateSurat } from "../../api/suratApi";
import { useAuth } from "../../contexts/AuthContext";
import SuccessModal from "../../components/SuccessModal";
import {
  FormLabel, FormFieldError, FormTextInput, FormSelectInput, FormDateInput,
  FormTextarea, FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, toFormDate,
} from "../../components/FormComponents";

const PRODI_OPTIONS = [
  "S1 Matematika", "S1 Statistika", "S1 Fisika", "S1 Kimia",
  "S1 Biologi", "S1 Ilmu Komputer", "S1 Farmasi",
];

const EMPTY_MHS    = [{ nim: "", nama: "", mataKuliah: "", prodi: "" }];
const EMPTY_ERRORS = { namaDosen: "", mataKuliah: "", prodiDosen: "", tanggalMulai: "", tanggalAkhir: "", sebab: "", tempat: "" };

function MahasiswaSection({ items, setItems, mhsErrors, setMhsErrors }) {
  const addItem    = () => { setItems([...items, { nim: "", nama: "", mataKuliah: "", prodi: "" }]); setMhsErrors([...mhsErrors, { nim: "", nama: "", mataKuliah: "", prodi: "" }]); };
  const removeItem = (i) => { setItems(items.filter((_, idx) => idx !== i)); setMhsErrors(mhsErrors.filter((_, idx) => idx !== i)); };
  const update     = (i, f, v) => {
    setItems(items.map((it, idx) => idx === i ? { ...it, [f]: v } : it));
    setMhsErrors(mhsErrors.map((e, idx) => idx === i ? { ...e, [f]: "" } : e));
  };

  const textFields = [
    { l: "NIM Mahasiswa",  p: "Masukkan NIM mahasiswa",  fk: "nim" },
    { l: "Nama Mahasiswa", p: "Masukkan nama mahasiswa", fk: "nama" },
    { l: "Mata Kuliah",    p: "Masukkan mata kuliah",    fk: "mataKuliah" },
  ];

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
          {/* Desktop */}
          <div className="hidden lg:flex items-start gap-3">
            {textFields.map(({ l, p, fk }) => (
              <div key={fk} className="flex-1">
                <FormLabel required error={mhsErrors[i]?.[fk]}>{l}</FormLabel>
                <FormTextInput placeholder={p} value={it[fk]} onChange={(v) => update(i, fk, v)} error={mhsErrors[i]?.[fk]} />
                <FormFieldError message={mhsErrors[i]?.[fk]} />
              </div>
            ))}
            <div className="flex-1">
              <FormLabel required error={mhsErrors[i]?.prodi}>Program Studi</FormLabel>
              <FormSelectInput placeholder="Pilih program studi" value={it.prodi} onChange={(v) => update(i, "prodi", v)} options={PRODI_OPTIONS} error={mhsErrors[i]?.prodi} />
              <FormFieldError message={mhsErrors[i]?.prodi} />
            </div>
            {items.length > 1 ? (
              <button onClick={() => removeItem(i)} className="mt-7 w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-gray-50 text-slate-400 hover:border-error-1 hover:bg-error-1/5 hover:text-error-1 transition-colors shrink-0">
                <X size={16} strokeWidth={2} />
              </button>
            ) : <div className="w-10 shrink-0" />}
          </div>
          {i < items.length - 1 && <hr className="hidden lg:block border-slate-200 mt-5" />}
          {/* Mobile */}
          <div className="lg:hidden flex flex-col gap-3">
            {textFields.map(({ l, p, fk }) => (
              <div key={fk}>
                <FormLabel required error={mhsErrors[i]?.[fk]}>{l}</FormLabel>
                <FormTextInput placeholder={p} value={it[fk]} onChange={(v) => update(i, fk, v)} error={mhsErrors[i]?.[fk]} />
                <FormFieldError message={mhsErrors[i]?.[fk]} />
              </div>
            ))}
            <div>
              <FormLabel required error={mhsErrors[i]?.prodi}>Program Studi</FormLabel>
              <FormSelectInput placeholder="Pilih program studi" value={it.prodi} onChange={(v) => update(i, "prodi", v)} options={PRODI_OPTIONS} error={mhsErrors[i]?.prodi} />
              <FormFieldError message={mhsErrors[i]?.prodi} />
            </div>
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

export default function FormIzinTidakMengikutiKuliah() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const { user } = useAuth();
  const isEdit   = Boolean(id);

  const [mahasiswaItems, setMahasiswaItems] = useState(EMPTY_MHS);
  const [mhsErrors,      setMhsErrors]      = useState([{ nim: "", nama: "", mataKuliah: "", prodi: "" }]);
  const [namaDosen,      setNamaDosen]      = useState("");
  const [mataKuliah,     setMataKuliah]     = useState("");
  const [prodiDosen,     setProdiDosen]     = useState("");
  const [tanggalMulai,   setTanggalMulai]   = useState("");
  const [tanggalAkhir,   setTanggalAkhir]   = useState("");
  const [sebab,          setSebab]          = useState("");
  const [tempat,         setTempat]         = useState("");
  const [keterangan,     setKeterangan]     = useState("");
  const [errors,         setErrors]         = useState(EMPTY_ERRORS);
  const [loading,        setLoading]        = useState(false);
  const [fetchLoading,   setFetchLoading]   = useState(isEdit);
  const [modal,          setModal]          = useState(false);
  const [originalData,   setOriginalData]   = useState(null);

  const clearErr = (field) => setErrors((p) => ({ ...p, [field]: "" }));

  useEffect(() => {
    if (!isEdit) return;
    setFetchLoading(true);
    getSuratById(id)
      .then((res) => {
        const item = res.data;
        if (!item) return;
        setOriginalData(item);
        const mhs = item.mahasiswas?.length
          ? item.mahasiswas.map((m) => ({ nim: m.nim || "", nama: m.nama || "", mataKuliah: m.mataKuliah || "", prodi: m.prodi || "" }))
          : EMPTY_MHS;
        setMahasiswaItems(mhs);
        setMhsErrors(mhs.map(() => ({ nim: "", nama: "", mataKuliah: "", prodi: "" })));
        setNamaDosen(item.namaDosen || "");
        setMataKuliah(item.mataKuliah || "");
        setProdiDosen(item.prodiDosen || "");
        setTanggalMulai(toFormDate(item.tanggalMulai));
        setTanggalAkhir(toFormDate(item.tanggalAkhir));
        setSebab(item.sebab || "");
        setTempat(item.tempat || "");
        setKeterangan(item.keterangan || "");
      })
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = { ...EMPTY_ERRORS };
    let valid = true;
    const req = (val, key, label) => { if (!val?.trim()) { e[key] = `${label} tidak boleh kosong.`; valid = false; } };

    req(namaDosen,  "namaDosen",  "Nama dosen");
    req(mataKuliah, "mataKuliah", "Mata kuliah");
    req(sebab,      "sebab",      "Sebab");
    req(tempat,     "tempat",     "Tempat");
    if (!prodiDosen)   { e.prodiDosen   = "Program studi tidak boleh kosong."; valid = false; }
    if (!tanggalMulai) { e.tanggalMulai = "Tanggal mulai tidak boleh kosong."; valid = false; }
    if (!tanggalAkhir) { e.tanggalAkhir = "Tanggal akhir tidak boleh kosong."; valid = false; }
    setErrors(e);

    const newMhsErrors = mahasiswaItems.map((m) => ({
      nim:        !m.nim?.trim()        ? "NIM tidak boleh kosong."           : "",
      nama:       !m.nama?.trim()       ? "Nama tidak boleh kosong."          : "",
      mataKuliah: !m.mataKuliah?.trim() ? "Mata kuliah tidak boleh kosong."   : "",
      prodi:      !m.prodi              ? "Program studi tidak boleh kosong." : "",
    }));
    setMhsErrors(newMhsErrors);
    if (newMhsErrors.some((e) => e.nim || e.nama || e.mataKuliah || e.prodi)) valid = false;

    return valid;
  };

  const resetForm = () => {
    setMahasiswaItems(EMPTY_MHS); setMhsErrors([{ nim: "", nama: "", mataKuliah: "", prodi: "" }]);
    setNamaDosen(""); setMataKuliah(""); setProdiDosen("");
    setTanggalMulai(""); setTanggalAkhir(""); setSebab(""); setTempat(""); setKeterangan("");
    setErrors(EMPTY_ERRORS);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await updateSurat(id, {
          ...originalData,
          mahasiswas: mahasiswaItems, namaDosen, mataKuliah, prodiDosen,
          tanggalMulai, tanggalAkhir, sebab, tempat, keterangan,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await createSurat({
          jenisSurat: "Izin Tidak Mengikuti Kuliah", userId: user?.id,
          mahasiswas: mahasiswaItems, namaDosen, mataKuliah, prodiDosen,
          tanggalMulai, tanggalAkhir, sebab, tempat, keterangan,
          status: "Menunggu",
          tanggalPengajuan: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-"),
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        });
      }
      setModal(true);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk    = () => navigate("/data-surat/izin-tidak-mengikuti-kuliah");
  const handleModalClose = () => { setModal(false); resetForm(); };

  const title    = isEdit ? "Ubah Surat Izin Tidak Mengikuti Kuliah" : "Pengajuan Surat Izin Tidak Mengikuti Kuliah";
  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan izin tidak mengikuti kuliah";

  if (fetchLoading) return <MainLayout><div className="p-8 text-sm text-slate-400">Memuat data...</div></MainLayout>;

  const s1 = (
    <FormCard icon={<Users size={18} />} title="Data Mahasiswa" subtitle="Informasi lengkap mahasiswa yang mengajukan izin tidak mengikuti kuliah">
      <MahasiswaSection items={mahasiswaItems} setItems={setMahasiswaItems} mhsErrors={mhsErrors} setMhsErrors={setMhsErrors} />
    </FormCard>
  );

  const s2 = (
    <FormCard icon={<GraduationCap size={18} />} title="Informasi Mata Kuliah" subtitle="Data mata kuliah dan dosen pengampu yang akan ditinggalkan">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <FormLabel required error={errors.namaDosen}>Nama Dosen</FormLabel>
          <FormTextInput placeholder="Masukkan nama dosen pengampu" value={namaDosen} onChange={(v) => { setNamaDosen(v); clearErr("namaDosen"); }} error={errors.namaDosen} />
          <FormFieldError message={errors.namaDosen} />
        </div>
        <div>
          <FormLabel required error={errors.mataKuliah}>Mata Kuliah</FormLabel>
          <FormTextInput placeholder="Masukkan nama mata kuliah" value={mataKuliah} onChange={(v) => { setMataKuliah(v); clearErr("mataKuliah"); }} error={errors.mataKuliah} />
          <FormFieldError message={errors.mataKuliah} />
        </div>
        <div>
          <FormLabel required error={errors.prodiDosen}>Program Studi</FormLabel>
          <FormSelectInput placeholder="Pilih program studi dosen" value={prodiDosen} onChange={(v) => { setProdiDosen(v); clearErr("prodiDosen"); }} options={PRODI_OPTIONS} error={errors.prodiDosen} />
          <FormFieldError message={errors.prodiDosen} />
        </div>
      </div>
    </FormCard>
  );

  const s3 = (
    <FormCard icon={<CalendarDays size={18} />} title="Jadwal Izin" subtitle="Tentukan periode waktu izin tidak mengikuti kuliah">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <FormLabel required error={errors.tanggalMulai}>Tanggal Mulai</FormLabel>
          <FormDateInput value={tanggalMulai} onChange={(v) => { setTanggalMulai(v); clearErr("tanggalMulai"); }} error={errors.tanggalMulai} />
          <FormFieldError message={errors.tanggalMulai} />
        </div>
        <div>
          <FormLabel required error={errors.tanggalAkhir}>Tanggal Akhir</FormLabel>
          <FormDateInput value={tanggalAkhir} onChange={(v) => { setTanggalAkhir(v); clearErr("tanggalAkhir"); }} error={errors.tanggalAkhir} />
          <FormFieldError message={errors.tanggalAkhir} />
        </div>
      </div>
    </FormCard>
  );

  const s4 = (
    <FormCard icon={<Info size={18} />} title="Alasan & Tempat Izin" subtitle="Sebab dan lokasi terkait izin tidak mengikuti kuliah">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <FormLabel required error={errors.sebab}>Sebab</FormLabel>
          <FormTextarea placeholder="Masukkan alasan tidak mengikuti kuliah" value={sebab} onChange={(v) => { setSebab(v); clearErr("sebab"); }} rows={3} error={errors.sebab} />
          <FormFieldError message={errors.sebab} />
        </div>
        <div>
          <FormLabel required error={errors.tempat}>Tempat</FormLabel>
          <FormTextarea placeholder="Masukkan lokasi/tempat tujuan" value={tempat} onChange={(v) => { setTempat(v); clearErr("tempat"); }} rows={3} error={errors.tempat} />
          <FormFieldError message={errors.tempat} />
        </div>
      </div>
    </FormCard>
  );

  const s5 = (
    <FormCard icon={<MessageSquare size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait izin tidak mengikuti kuliah">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={keterangan} onChange={setKeterangan} />
    </FormCard>
  );

  const sections = [s1, s2, s3, s4, s5];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Izin Tidak Mengikuti Kuliah" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Izin Tidak Mengikuti Kuliah" subtitle={subtitle} footer={<FormDesktopFooter onSubmit={handleSubmit} loading={loading} />}>
          {sections}
        </FormDesktopPanel>
        <FormMobileCards>{sections}</FormMobileCards>
        <FormMobileFooter onSubmit={handleSubmit} loading={loading} />
      </div>
      <SuccessModal
        isOpen={modal}
        message={isEdit ? "Perubahan Berhasil Disimpan!" : "Surat Berhasil Dikirim!"}
        onOk={handleModalOk}
        onClose={handleModalClose}
      />
    </MainLayout>
  );
}