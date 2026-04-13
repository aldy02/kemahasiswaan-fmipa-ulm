// src/pages/pengajuanSurat/FormPeminjamanAlatBahan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Users, Package, Calendar, Info, Plus, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { getSuratById, createSurat, updateSurat } from "../../api/suratApi";
import { useAuth } from "../../contexts/AuthContext";
import SuccessModal from "../../components/SuccessModal";
import {
  FormLabel, FormFieldError, FormTextInput, FormNumberInput, FormDateInput,
  FormTextarea, FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, PeopleGroupIcon, toFormDate,
} from "../../components/FormComponents";

const EMPTY_ALAT = [{ nama: "", jumlah: "" }];

function AlatBahanSection({ items, setItems, alatErrors, setAlatErrors }) {
  const addItem    = () => { setItems([...items, { nama: "", jumlah: "" }]); setAlatErrors([...alatErrors, { nama: "", jumlah: "" }]); };
  const removeItem = (i) => { setItems(items.filter((_, idx) => idx !== i)); setAlatErrors(alatErrors.filter((_, idx) => idx !== i)); };
  const update     = (i, field, val) => {
    setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
    setAlatErrors(alatErrors.map((e, idx) => idx === i ? { ...e, [field]: "" } : e));
  };

  return (
    <div className="flex flex-col gap-5">
      {items.map((it, i) => (
        <div key={i}>
          <p className="hidden lg:block text-sm font-semibold text-primary-1 mb-4">Item {i + 1}</p>
          <div className="lg:hidden flex items-center justify-between mb-4">
            <p className="text-[13px] font-semibold text-primary-1">Item {i + 1}</p>
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="w-6 h-6 flex items-center justify-center rounded-full bg-error-2 text-white hover:bg-red-500 transition-colors shrink-0">
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>
          {/* Desktop */}
          <div className="hidden lg:flex items-start gap-3">
            <div className="flex-1">
              <FormLabel required error={alatErrors[i]?.nama}>Nama Alat/Bahan</FormLabel>
              <FormTextInput placeholder="Masukkan nama alat/bahan" value={it.nama} onChange={(v) => update(i, "nama", v)} error={alatErrors[i]?.nama} />
              <FormFieldError message={alatErrors[i]?.nama} />
            </div>
            <div className="flex-1">
              <FormLabel required error={alatErrors[i]?.jumlah}>Jumlah Alat/Bahan</FormLabel>
              <FormNumberInput placeholder="Masukkan jumlah" value={it.jumlah} onChange={(v) => update(i, "jumlah", v)} error={alatErrors[i]?.jumlah} />
              <FormFieldError message={alatErrors[i]?.jumlah} />
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
            <div>
              <FormLabel required error={alatErrors[i]?.nama}>Nama Alat/Bahan</FormLabel>
              <FormTextInput placeholder="Masukkan nama alat/bahan" value={it.nama} onChange={(v) => update(i, "nama", v)} error={alatErrors[i]?.nama} />
              <FormFieldError message={alatErrors[i]?.nama} />
            </div>
            <div>
              <FormLabel required error={alatErrors[i]?.jumlah}>Jumlah Alat/Bahan</FormLabel>
              <FormNumberInput placeholder="Masukkan jumlah" value={it.jumlah} onChange={(v) => update(i, "jumlah", v)} error={alatErrors[i]?.jumlah} />
              <FormFieldError message={alatErrors[i]?.jumlah} />
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

const EMPTY_ERRORS = {
  namaOrganisasi: "", namaKegiatan: "",
  namaPJ: "", kontakPJ: "", namaKetPelaksana: "", nimKetPelaksana: "",
  namaKetOrg: "", nimKetOrg: "", tanggalPinjam: "", tanggalKembali: "",
};

export default function FormPeminjamanAlatBahan() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const { user } = useAuth();
  const isEdit   = Boolean(id);

  const [noSurat,          setNoSurat]          = useState("");
  const [namaOrganisasi,   setNamaOrganisasi]   = useState("");
  const [namaKegiatan,     setNamaKegiatan]     = useState("");
  const [namaPJ,           setNamaPJ]           = useState("");
  const [kontakPJ,         setKontakPJ]         = useState("");
  const [namaKetPelaksana, setNamaKetPelaksana] = useState("");
  const [nimKetPelaksana,  setNimKetPelaksana]  = useState("");
  const [namaKetOrg,       setNamaKetOrg]       = useState("");
  const [nimKetOrg,        setNimKetOrg]        = useState("");
  const [alatItems,        setAlatItems]        = useState(EMPTY_ALAT);
  const [alatErrors,       setAlatErrors]       = useState([{ nama: "", jumlah: "" }]);
  const [tanggalPinjam,    setTanggalPinjam]    = useState("");
  const [tanggalKembali,   setTanggalKembali]   = useState("");
  const [keterangan,       setKeterangan]       = useState("");
  const [errors,           setErrors]           = useState(EMPTY_ERRORS);
  const [loading,          setLoading]          = useState(false);
  const [fetchLoading,     setFetchLoading]     = useState(isEdit);
  const [modal,            setModal]            = useState(false);
  const [originalData,     setOriginalData]     = useState(null);

  const clearErr = (field) => setErrors((p) => ({ ...p, [field]: "" }));

  useEffect(() => {
    if (!isEdit) return;
    setFetchLoading(true);
    getSuratById(id)
      .then((res) => {
        const item = res.data;
        if (!item) return;
        setOriginalData(item);
        setNoSurat(item.noSurat === "-" ? "" : item.noSurat || "");
        setNamaOrganisasi(item.organisasi || "");
        setNamaKegiatan(item.kegiatan || "");
        setNamaPJ(item.penanggungJawab?.nama || "");
        setKontakPJ(item.penanggungJawab?.telp || "");
        setNamaKetPelaksana(item.ketuaPelaksana?.nama || "");
        setNimKetPelaksana(item.ketuaPelaksana?.nim || "");
        setNamaKetOrg(item.ketuaOrganisasi?.nama || "");
        setNimKetOrg(item.ketuaOrganisasi?.nim || item.ketuaOrganisasi?.telp || "");
        setTanggalPinjam(toFormDate(item.tanggalPinjam));
        setTanggalKembali(toFormDate(item.tanggalKembali));
        setKeterangan(item.keterangan || "");
        if (item.daftarAlat?.length) {
          const parsed = item.daftarAlat.map((a) => {
            const lastDash = (a.nama || "").lastIndexOf(" - ");
            if (lastDash === -1) return { nama: a.nama || "", jumlah: "" };
            return { nama: a.nama.slice(0, lastDash).trim(), jumlah: a.nama.slice(lastDash + 3).trim() };
          });
          setAlatItems(parsed);
          setAlatErrors(parsed.map(() => ({ nama: "", jumlah: "" })));
        }
      })
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = { ...EMPTY_ERRORS };
    let valid = true;
    const req = (val, key, label) => { if (!val?.trim()) { e[key] = `${label} tidak boleh kosong.`; valid = false; } };

    req(namaOrganisasi,   "namaOrganisasi",   "Nama organisasi");
    req(namaKegiatan,     "namaKegiatan",     "Nama kegiatan");
    req(namaPJ,           "namaPJ",           "Nama penanggung jawab");
    req(kontakPJ,         "kontakPJ",         "Kontak penanggung jawab");
    req(namaKetPelaksana, "namaKetPelaksana", "Nama ketua pelaksana");
    req(nimKetPelaksana,  "nimKetPelaksana",  "NIM ketua pelaksana");
    req(namaKetOrg,       "namaKetOrg",       "Nama ketua organisasi");
    req(nimKetOrg,        "nimKetOrg",        "NIM ketua organisasi");
    if (!tanggalPinjam)  { e.tanggalPinjam  = "Tanggal pinjam tidak boleh kosong.";  valid = false; }
    if (!tanggalKembali) { e.tanggalKembali = "Tanggal kembali tidak boleh kosong."; valid = false; }
    setErrors(e);

    const newAlatErrors = alatItems.map((a) => ({
      nama:   !a.nama?.trim()              ? "Nama alat/bahan tidak boleh kosong." : "",
      jumlah: !a.jumlah?.toString().trim() ? "Jumlah tidak boleh kosong."          : "",
    }));
    setAlatErrors(newAlatErrors);
    if (newAlatErrors.some((e) => e.nama || e.jumlah)) valid = false;

    return valid;
  };

  const resetForm = () => {
    setNoSurat(""); setNamaOrganisasi(""); setNamaKegiatan("");
    setNamaPJ(""); setKontakPJ(""); setNamaKetPelaksana(""); setNimKetPelaksana("");
    setNamaKetOrg(""); setNimKetOrg(""); setAlatItems(EMPTY_ALAT);
    setAlatErrors([{ nama: "", jumlah: "" }]);
    setTanggalPinjam(""); setTanggalKembali(""); setKeterangan("");
    setErrors(EMPTY_ERRORS);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const daftarAlat = alatItems.map((a, i) => ({ item: `Item ${i + 1}`, nama: `${a.nama} - ${a.jumlah}` }));
      if (isEdit) {
        await updateSurat(id, {
          ...originalData,
          noSurat: noSurat || "-", organisasi: namaOrganisasi, kegiatan: namaKegiatan,
          penanggungJawab: { nama: namaPJ, telp: kontakPJ },
          ketuaPelaksana:  { nama: namaKetPelaksana, nim: nimKetPelaksana },
          ketuaOrganisasi: { nama: namaKetOrg, telp: nimKetOrg },
          daftarAlat, tanggalPinjam, tanggalKembali, keterangan,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await createSurat({
          jenisSurat: "Peminjaman Alat/Bahan", userId: user?.id,
          noSurat: noSurat || "-", organisasi: namaOrganisasi, kegiatan: namaKegiatan,
          penanggungJawab: { nama: namaPJ, telp: kontakPJ },
          ketuaPelaksana:  { nama: namaKetPelaksana, nim: nimKetPelaksana },
          ketuaOrganisasi: { nama: namaKetOrg, telp: nimKetOrg },
          daftarAlat, tanggalPinjam, tanggalKembali, keterangan,
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

  const handleModalOk    = () => navigate("/data-surat/peminjaman-alat-bahan");
  const handleModalClose = () => { setModal(false); resetForm(); };

  const title    = isEdit ? "Ubah Surat Peminjaman Alat/Bahan" : "Pengajuan Surat Peminjaman Alat/Bahan";
  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman alat/bahan";

  const kepemimpinanGroups = [
    { label: "Penanggung Jawab", fields: [
      { l: "Nama Penanggung Jawab", p: "Masukkan nama penanggung jawab", v: namaPJ, s: (v) => { setNamaPJ(v); clearErr("namaPJ"); }, ek: "namaPJ" },
      { l: "Kontak Penanggung Jawab", p: "Masukkan nomor telepon", v: kontakPJ, s: (v) => { setKontakPJ(v); clearErr("kontakPJ"); }, t: "tel", ek: "kontakPJ" },
    ]},
    { label: "Ketua Pelaksana", fields: [
      { l: "Nama Ketua Pelaksana", p: "Masukkan nama ketua pelaksana", v: namaKetPelaksana, s: (v) => { setNamaKetPelaksana(v); clearErr("namaKetPelaksana"); }, ek: "namaKetPelaksana" },
      { l: "NIM Ketua Pelaksana", p: "Masukkan NIM ketua pelaksana", v: nimKetPelaksana, s: (v) => { setNimKetPelaksana(v); clearErr("nimKetPelaksana"); }, ek: "nimKetPelaksana" },
    ]},
    { label: "Ketua Organisasi", fields: [
      { l: "Nama Ketua Organisasi", p: "Masukkan nama ketua organisasi", v: namaKetOrg, s: (v) => { setNamaKetOrg(v); clearErr("namaKetOrg"); }, ek: "namaKetOrg" },
      { l: "NIM Ketua Organisasi", p: "Masukkan NIM ketua organisasi", v: nimKetOrg, s: (v) => { setNimKetOrg(v); clearErr("nimKetOrg"); }, ek: "nimKetOrg" },
    ]},
  ];

  if (fetchLoading) return <MainLayout><div className="p-8 text-sm text-slate-400">Memuat data...</div></MainLayout>;

  const s1 = (
    <FormCard key="surat" icon={<FileText size={18} />} title="Informasi Surat" subtitle="Masukkan informasi terkait nomor surat pengajuan">
      <FormLabel >No Surat</FormLabel>
      <FormTextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} />
    </FormCard>
  );

  const s2 = (
    <FormCard key="org" icon={<PeopleGroupIcon size={18} />} title="Detail Organisasi & Kegiatan" subtitle="Informasi lengkap mengenai organisasi dan kegiatan yang akan dilaksanakan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <FormLabel required error={errors.namaOrganisasi}>Nama Organisasi</FormLabel>
          <FormTextInput placeholder="Masukkan nama organisasi" value={namaOrganisasi} onChange={(v) => { setNamaOrganisasi(v); clearErr("namaOrganisasi"); }} error={errors.namaOrganisasi} />
          <FormFieldError message={errors.namaOrganisasi} />
        </div>
        <div>
          <FormLabel required error={errors.namaKegiatan}>Nama Kegiatan</FormLabel>
          <FormTextInput placeholder="Masukkan nama kegiatan" value={namaKegiatan} onChange={(v) => { setNamaKegiatan(v); clearErr("namaKegiatan"); }} error={errors.namaKegiatan} />
          <FormFieldError message={errors.namaKegiatan} />
        </div>
      </div>
    </FormCard>
  );

  const s3 = (
    <FormCard key="kepemimpinan" icon={<Users size={18} />} title="Informasi Kepemimpinan" subtitle="Data penanggung jawab, ketua organisasi, dan ketua pelaksana kegiatan">
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {kepemimpinanGroups.map(({ label, fields }) => (
          <div key={label}>
            <p className="text-sm font-semibold text-primary-1 mb-3 pb-2 border-b border-slate-200">{label}</p>
            <div className="flex flex-col gap-3">
              {fields.map(({ l, p, v, s, t, ek }) => (
                <div key={ek}>
                  <FormLabel required error={errors[ek]}>{l}</FormLabel>
                  <FormTextInput placeholder={p} value={v} onChange={s} type={t} error={errors[ek]} />
                  <FormFieldError message={errors[ek]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="lg:hidden flex flex-col gap-0">
        {kepemimpinanGroups.map(({ label, fields }, gi, arr) => (
          <div key={label}>
            <p className="text-[13px] font-semibold text-primary-1 mb-2">{label}</p>
            <hr className="border-slate-200 mb-3" />
            <div className={`flex flex-col gap-3 ${gi < arr.length - 1 ? "mb-5" : ""}`}>
              {fields.map(({ l, p, v, s, t, ek }) => (
                <div key={ek}>
                  <FormLabel required error={errors[ek]}>{l}</FormLabel>
                  <FormTextInput placeholder={p} value={v} onChange={s} type={t} error={errors[ek]} />
                  <FormFieldError message={errors[ek]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );

  const s4 = (
    <FormCard key="alat" icon={<Package size={18} />} title="Detail Alat/Bahan" subtitle="Informasi alat atau bahan yang akan dipinjam">
      <AlatBahanSection items={alatItems} setItems={setAlatItems} alatErrors={alatErrors} setAlatErrors={setAlatErrors} />
    </FormCard>
  );

  const s5 = (
    <FormCard key="jadwal" icon={<Calendar size={18} />} title="Jadwal Peminjaman" subtitle="Tentukan tanggal peminjaman dan pengembalian alat/bahan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <FormLabel required error={errors.tanggalPinjam}>Tanggal Pinjam</FormLabel>
          <FormDateInput value={tanggalPinjam} onChange={(v) => { setTanggalPinjam(v); clearErr("tanggalPinjam"); }} error={errors.tanggalPinjam} />
          <FormFieldError message={errors.tanggalPinjam} />
        </div>
        <div>
          <FormLabel required error={errors.tanggalKembali}>Tanggal Kembali</FormLabel>
          <FormDateInput value={tanggalKembali} onChange={(v) => { setTanggalKembali(v); clearErr("tanggalKembali"); }} error={errors.tanggalKembali} />
          <FormFieldError message={errors.tanggalKembali} />
        </div>
      </div>
    </FormCard>
  );

  const s6 = (
    <FormCard key="tambahan" icon={<Info size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait peminjaman alat/bahan">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={keterangan} onChange={setKeterangan} />
    </FormCard>
  );

  const sections = [s1, s2, s3, s4, s5, s6];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Peminjaman Alat/Bahan" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Peminjaman Alat/Bahan" subtitle={subtitle} footer={<FormDesktopFooter onSubmit={handleSubmit} loading={loading} />}>
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