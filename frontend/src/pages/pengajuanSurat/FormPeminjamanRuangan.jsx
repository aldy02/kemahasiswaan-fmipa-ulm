// src/pages/pengajuanSurat/FormPeminjamanRuangan.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Users, Calendar, Info } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { peminjamanRuanganData } from "../../test/data";
import {
  FormLabel, FormTextInput, FormSelectInput, FormDateInput, FormTimeInput,
  FormTextarea, FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, PeopleGroupIcon, toFormDate, toFormTime,
} from "../../components/FormComponents";

const TEMPAT_OPTIONS = [
  "Ruang Kuliah I.1.1", "Ruang Kuliah I.1.2", "Ruang Kuliah I.1.3",
  "Ruang Kuliah I.2.1", "Ruang Kuliah I.2.3", "Ruang Kuliah I.2.4",
  "Ruang Kuliah I.2.6", "Ruang Kuliah II.1.2",
];

export default function FormPeminjamanRuangan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [noSurat, setNoSurat] = useState("");
  const [namaOrganisasi, setNamaOrganisasi] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tempatKegiatan, setTempatKegiatan] = useState("");
  const [namaPJ, setNamaPJ] = useState("");
  const [kontakPJ, setKontakPJ] = useState("");
  const [namaKetPelaksana, setNamaKetPelaksana] = useState("");
  const [nimKetPelaksana, setNimKetPelaksana] = useState("");
  const [namaKetOrg, setNamaKetOrg] = useState("");
  const [nimKetOrg, setNimKetOrg] = useState("");
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamBerakhir, setJamBerakhir] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const item = peminjamanRuanganData.find((d) => d.id === Number(id));
    if (!item) return;
    setNoSurat(item.noSurat === "-" ? "" : item.noSurat || "");
    setNamaOrganisasi(item.organisasi || "");
    setNamaKegiatan(item.namaKegiatan || "");
    setTempatKegiatan(item.tempatKegiatan || "");
    setNamaPJ(item.penanggungJawab?.nama || "");
    setKontakPJ(item.penanggungJawab?.telp || "");
    setNamaKetPelaksana(item.ketuaPelaksana?.nama || "");
    setNimKetPelaksana(item.ketuaPelaksana?.nim || "");
    setNamaKetOrg(item.ketuaOrganisasi?.nama || "");
    setNimKetOrg(item.ketuaOrganisasi?.nim || "");
    setTanggalPinjam(toFormDate(item.tanggalPinjam));
    setTanggalKembali(toFormDate(item.tanggalKembali));
    setJamMulai(toFormTime(item.jamMulai));
    setJamBerakhir(toFormTime(item.jamBerakhir));
    setKeterangan(item.keterangan || "");
  }, [id, isEdit]);

  const title = isEdit ? "Ubah Surat Peminjaman Ruangan" : "Pengajuan Surat Peminjaman Ruangan";
  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman ruangan";

  // ── Sections ─────────────────────────────────────────────────────────────
  const s1 = (
    <FormCard icon={<FileText size={20} />} title="Informasi Surat" subtitle="Masukkan informasi terkait nomor surat pengajuan">
      <FormLabel>No Surat</FormLabel>
      <FormTextInput placeholder="Masukkan no surat" value={noSurat} onChange={setNoSurat} />
    </FormCard>
  );

  const s2 = (
    <FormCard icon={<PeopleGroupIcon size={20} />} title="Detail Organisasi & Kegiatan" subtitle="Informasi lengkap mengenai organisasi dan kegiatan yang akan dilaksanakan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div><FormLabel required>Nama Organisasi</FormLabel><FormTextInput placeholder="Masukkan nama organisasi" value={namaOrganisasi} onChange={setNamaOrganisasi} /></div>
        <div><FormLabel required>Nama Kegiatan</FormLabel><FormTextInput placeholder="Masukkan nama kegiatan" value={namaKegiatan} onChange={setNamaKegiatan} /></div>
      </div>
      <FormLabel required>Tempat Kegiatan</FormLabel>
      <FormSelectInput placeholder="Pilih tempat kegiatan" value={tempatKegiatan} onChange={setTempatKegiatan} options={TEMPAT_OPTIONS} />
    </FormCard>
  );

  const s3 = (
    <FormCard icon={<Users size={20} />} title="Informasi Kepemimpinan" subtitle="Data penanggung jawab, ketua organisasi, dan ketua pelaksana kegiatan">
      {/* Desktop: 3 columns */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {[
          { label: "Penanggung Jawab", fields: [{ l: "Nama Penanggung Jawab", p: "Masukkan nama penanggung jawab", v: namaPJ, s: setNamaPJ }, { l: "Kontak Penanggung Jawab", p: "Masukkan nomor telepon", v: kontakPJ, s: setKontakPJ, t: "tel" }] },
          { label: "Ketua Pelaksana", fields: [{ l: "Nama Ketua Pelaksana", p: "Masukkan nama ketua pelaksana", v: namaKetPelaksana, s: setNamaKetPelaksana }, { l: "NIM Ketua Pelaksana", p: "Masukkan NIM ketua pelaksana", v: nimKetPelaksana, s: setNimKetPelaksana }] },
          { label: "Ketua Organisasi", fields: [{ l: "Nama Ketua Organisasi", p: "Masukkan nama ketua organisasi", v: namaKetOrg, s: setNamaKetOrg }, { l: "NIM Ketua Organisasi", p: "Masukkan NIM Ketua Organisasi", v: nimKetOrg, s: setNimKetOrg }] },
        ].map(({ label, fields }) => (
          <div key={label}>
            <p className="text-sm font-semibold text-primary-1 mb-3 pb-2 border-b border-slate-200">{label}</p>
            <div className="flex flex-col gap-3">
              {fields.map(({ l, p, v, s, t }) => (
                <div key={l}><FormLabel required>{l}</FormLabel><FormTextInput placeholder={p} value={v} onChange={s} type={t} /></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Mobile: stacked with separators */}
      <div className="lg:hidden flex flex-col gap-0">
        {[
          { label: "Penanggung Jawab", fields: [{ l: "Nama Penanggung Jawab", p: "Masukkan nama penanggung jawab", v: namaPJ, s: setNamaPJ }, { l: "Kontak Penanggung Jawab", p: "Masukkan nomor telepon", v: kontakPJ, s: setKontakPJ, t: "tel" }] },
          { label: "Ketua Pelaksana", fields: [{ l: "Nama Ketua Pelaksana", p: "Masukkan nama ketua pelaksana", v: namaKetPelaksana, s: setNamaKetPelaksana }, { l: "NIM Ketua Pelaksana", p: "Masukkan NIM ketua pelaksana", v: nimKetPelaksana, s: setNimKetPelaksana }] },
          { label: "Ketua Organisasi", fields: [{ l: "Nama Ketua Organisasi", p: "Masukkan nama ketua organisasi", v: namaKetOrg, s: setNamaKetOrg }, { l: "NIM Ketua Organisasi", p: "Masukkan NIM Ketua Organisasi", v: nimKetOrg, s: setNimKetOrg }] },
        ].map(({ label, fields }, gi, arr) => (
          <div key={label}>
            <p className="text-[13px] font-semibold text-primary-1 mb-2">{label}</p>
            <hr className="border-slate-200 mb-3" />
            <div className={`flex flex-col gap-3 ${gi < arr.length - 1 ? "mb-5" : ""}`}>
              {fields.map(({ l, p, v, s, t }) => (
                <div key={l}><FormLabel required>{l}</FormLabel><FormTextInput placeholder={p} value={v} onChange={s} type={t} /></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );

  const s4 = (
    <FormCard icon={<Calendar size={20} />} title="Jadwal Peminjaman" subtitle="Tentukan tanggal dan waktu peminjaman ruangan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div><FormLabel required>Tanggal Pinjam</FormLabel><FormDateInput value={tanggalPinjam} onChange={setTanggalPinjam} /></div>
        <div><FormLabel required>Tanggal Kembali</FormLabel><FormDateInput value={tanggalKembali} onChange={setTanggalKembali} /></div>
        <div><FormLabel required>Jam Mulai</FormLabel><FormTimeInput value={jamMulai} onChange={setJamMulai} /></div>
        <div><FormLabel required>Jam Berakhir</FormLabel><FormTimeInput value={jamBerakhir} onChange={setJamBerakhir} /></div>
      </div>
    </FormCard>
  );

  const s5 = (
    <FormCard icon={<Info size={20} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait peminjaman ruangan">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={keterangan} onChange={setKeterangan} />
    </FormCard>
  );

  const sections = [s1, s2, s3, s4, s5];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Peminjaman Ruangan" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Peminjaman Ruangan" subtitle={subtitle} footer={<FormDesktopFooter />}>
          {sections}
        </FormDesktopPanel>
        <FormMobileCards>{sections}</FormMobileCards>
        <FormMobileFooter />
      </div>
    </MainLayout>
  );
}