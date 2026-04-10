// src/pages/pengajuanSurat/FormPeminjamanAlatBahan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Users, Package, Calendar, Info, Plus, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { peminjamanAlatBahanData } from "../../test/data";
import {
  FormLabel, FormTextInput, FormNumberInput, FormDateInput, FormTextarea,
  FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, PeopleGroupIcon, toFormDate,
} from "../../components/FormComponents";

function parseAlatItem(raw) {
  if (!raw) return { nama: "", jumlah: "" };
  const lastDash = raw.lastIndexOf(" - ");
  if (lastDash === -1) return { nama: raw, jumlah: "" };
  return { nama: raw.slice(0, lastDash).trim(), jumlah: raw.slice(lastDash + 3).trim() };
}

// ── Alat/Bahan dynamic list ───────────────────────────────────────────────────
function AlatBahanSection({ items, setItems }) {
  const addItem = () => setItems([...items, { nama: "", jumlah: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i, field, val) => setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  return (
    <div className="flex flex-col gap-5">
      {items.map((it, i) => (
        <div key={i}>
          {/* Desktop label */}
          <p className="hidden lg:block text-sm font-semibold text-primary-1 mb-4">Item {i + 1}</p>
          {/* Mobile label + delete */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <p className="text-[13px] font-semibold text-primary-1">Item {i + 1}</p>
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="w-6 h-6 flex items-center justify-center rounded-full bg-error-2 text-white hover:bg-red-500 transition-colors shrink-0">
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>
          {/* Desktop row */}
          <div className="hidden lg:flex items-end gap-3">
            <div className="flex-1"><FormLabel required>Nama Alat/Bahan</FormLabel><FormTextInput placeholder="Masukkan nama alat/bahan" value={it.nama} onChange={(v) => update(i, "nama", v)} /></div>
            <div className="flex-1"><FormLabel required>Jumlah Alat/Bahan</FormLabel><FormNumberInput placeholder="Masukkan jumlah (contoh: 5, 10, 25)" value={it.jumlah} onChange={(v) => update(i, "jumlah", v)} /></div>
            {items.length > 1 ? (
              <button onClick={() => removeItem(i)} className="w-10.5 h-10.5 flex items-center justify-center rounded-xl border border-slate-200 bg-gray-50 text-slate-400 hover:border-error-1 hover:bg-error-1/5 hover:text-error-1 transition-colors shrink-0">
                <X size={16} strokeWidth={2} />
              </button>
            ) : <div className="w-10.5 shrink-0" />}
          </div>
          {i < items.length - 1 && <hr className="hidden lg:block border-slate-200 mt-7" />}
          {/* Mobile stacked */}
          <div className="lg:hidden flex flex-col gap-3">
            <div><FormLabel required>Nama Alat/Bahan</FormLabel><FormTextInput placeholder="Masukkan nama alat/bahan" value={it.nama} onChange={(v) => update(i, "nama", v)} /></div>
            <div><FormLabel required>Jumlah Alat/Bahan</FormLabel><FormNumberInput placeholder="Masukkan jumlah (contoh: 5, 10, 25)" value={it.jumlah} onChange={(v) => update(i, "jumlah", v)} /></div>
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

export default function FormPeminjamanAlatBahan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [noSurat, setNoSurat] = useState("");
  const [namaOrganisasi, setNamaOrganisasi] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [namaPJ, setNamaPJ] = useState("");
  const [kontakPJ, setKontakPJ] = useState("");
  const [namaKetPelaksana, setNamaKetPelaksana] = useState("");
  const [nimKetPelaksana, setNimKetPelaksana] = useState("");
  const [namaKetOrg, setNamaKetOrg] = useState("");
  const [nimKetOrg, setNimKetOrg] = useState("");
  const [alatItems, setAlatItems] = useState([{ nama: "", jumlah: "" }]);
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const item = peminjamanAlatBahanData.find((d) => d.id === Number(id));
    if (!item) return;
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
    if (item.daftarAlat?.length) setAlatItems(item.daftarAlat.map((a) => parseAlatItem(a.nama)));
  }, [id, isEdit]);

  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman alat/bahan";
  const title = isEdit ? "Ubah Surat Peminjaman Alat/Bahan" : "Pengajuan Surat Peminjaman Alat/Bahan";

  const kepemimpinanGroups = [
    { label: "Penanggung Jawab", fields: [{ l: "Nama Penanggung Jawab", p: "Masukkan nama penanggung jawab", v: namaPJ, s: setNamaPJ }, { l: "Kontak Penanggung Jawab", p: "Masukkan nomor telepon", v: kontakPJ, s: setKontakPJ, t: "tel" }] },
    { label: "Ketua Pelaksana", fields: [{ l: "Nama Ketua Pelaksana", p: "Masukkan nama ketua pelaksana", v: namaKetPelaksana, s: setNamaKetPelaksana }, { l: "NIM Ketua Pelaksana", p: "Masukkan NIM ketua pelaksana", v: nimKetPelaksana, s: setNimKetPelaksana }] },
    { label: "Ketua Organisasi", fields: [{ l: "Nama Ketua Organisasi", p: "Masukkan nama ketua organisasi", v: namaKetOrg, s: setNamaKetOrg }, { l: "NIM Ketua Organisasi", p: "Masukkan NIM Ketua Organisasi", v: nimKetOrg, s: setNimKetOrg }] },
  ];

  // ── Sections ─────────────────────────────────────────────────────────────
    const s1 = (
    <FormCard key="surat" icon={<FileText size={18} />} title="Informasi Surat" subtitle="Masukkan informasi terkait nomor surat pengajuan">
      <FormLabel>No Surat</FormLabel>
      <FormTextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} />
    </FormCard>
    )

    const s2 = (
    <FormCard key="org" icon={<PeopleGroupIcon size={18} />} title="Detail Organisasi & Kegiatan" subtitle="Informasi lengkap mengenai organisasi dan kegiatan yang akan dilaksanakan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div><FormLabel required>Nama Organisasi</FormLabel><FormTextInput placeholder="Masukkan nama organisasi" value={namaOrganisasi} onChange={setNamaOrganisasi} /></div>
        <div><FormLabel required>Nama Kegiatan</FormLabel><FormTextInput placeholder="Masukkan nama kegiatan" value={namaKegiatan} onChange={setNamaKegiatan} /></div>
      </div>
    </FormCard>
    )

    const s3 = (
    <FormCard key="kepemimpinan" icon={<Users size={18} />} title="Informasi Kepemimpinan" subtitle="Data penanggung jawab, ketua organisasi, dan ketua pelaksana kegiatan">
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {kepemimpinanGroups.map(({ label, fields }) => (
          <div key={label}>
            <p className="text-sm font-semibold text-primary-1 mb-3 pb-2 border-b border-slate-200">{label}</p>
            <div className="flex flex-col gap-3">
              {fields.map(({ l, p, v, s, t }) => <div key={l}><FormLabel required>{l}</FormLabel><FormTextInput placeholder={p} value={v} onChange={s} type={t} /></div>)}
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
              {fields.map(({ l, p, v, s, t }) => <div key={l}><FormLabel required>{l}</FormLabel><FormTextInput placeholder={p} value={v} onChange={s} type={t} /></div>)}
            </div>
          </div>
        ))}
      </div>
    </FormCard>
    )
    
    const s4 = (
    <FormCard key="alat" icon={<Package size={18} />} title="Detail Alat/Bahan" subtitle="Informasi alat atau bahan yang akan dipinjam">
      <AlatBahanSection items={alatItems} setItems={setAlatItems} />
    </FormCard>
    )

    const s5 = (
    <FormCard key="jadwal" icon={<Calendar size={18} />} title="Jadwal Peminjaman" subtitle="Tentukan tanggal peminjaman dan pengembalian alat/bahan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div><FormLabel required>Tanggal Pinjam</FormLabel><FormDateInput value={tanggalPinjam} onChange={setTanggalPinjam} /></div>
        <div><FormLabel required>Tanggal Kembali</FormLabel><FormDateInput value={tanggalKembali} onChange={setTanggalKembali} /></div>
      </div>
    </FormCard>
    )

    const s6 = (
    <FormCard key="tambahan" icon={<Info size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait peminjaman alat/bahan">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={keterangan} onChange={setKeterangan} />
    </FormCard>
    )

  const sections = [s1, s2, s3, s4, s5, s6];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Peminjaman Alat/Bahan" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Peminjaman Alat/Bahan" subtitle={subtitle} footer={<FormDesktopFooter />}>
          {sections}
        </FormDesktopPanel>
        <FormMobileCards>{sections}</FormMobileCards>
        <FormMobileFooter />
      </div>
    </MainLayout>
  );
}