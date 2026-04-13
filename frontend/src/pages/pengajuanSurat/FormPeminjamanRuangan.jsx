// src/pages/pengajuanSurat/FormPeminjamanRuangan.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Users, Calendar, Info } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { getSuratById, createSurat, updateSurat } from "../../api/suratApi";
import { useAuth } from "../../contexts/AuthContext";
import SuccessModal from "../../components/SuccessModal";
import {
  FormField, FormGrid, FormLabel,
  FormTextInput, FormSelectInput, FormDateInput, FormTimeInput, FormTextarea,
  FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, KepemimpinanSection, PeopleGroupIcon,
  toFormDate, toFormTime,
} from "../../components/FormComponents";

const TEMPAT_OPTIONS = [
  "Ruang Kuliah I.1.1","Ruang Kuliah I.1.2","Ruang Kuliah I.1.3",
  "Ruang Kuliah I.2.1","Ruang Kuliah I.2.3","Ruang Kuliah I.2.4",
  "Ruang Kuliah I.2.6","Ruang Kuliah II.1.2",
];

const INIT = {
  noSurat:"", namaOrganisasi:"", namaKegiatan:"", tempatKegiatan:"",
  namaPJ:"", kontakPJ:"", namaKetPelaksana:"", nimKetPelaksana:"",
  namaKetOrg:"", nimKetOrg:"", tanggalPinjam:"", tanggalKembali:"",
  jamMulai:"", jamBerakhir:"", keterangan:"",
};
const INIT_ERR = {
  noSurat:"", namaOrganisasi:"", namaKegiatan:"", tempatKegiatan:"",
  namaPJ:"", kontakPJ:"", namaKetPelaksana:"", nimKetPelaksana:"",
  namaKetOrg:"", nimKetOrg:"", tanggalPinjam:"", tanggalKembali:"",
  jamMulai:"", jamBerakhir:"",
};

export default function FormPeminjamanRuangan() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const { user } = useAuth();
  const isEdit   = Boolean(id);

  const [f, setF]               = useState(INIT);
  const [errors, setErrors]     = useState(INIT_ERR);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [modal, setModal]       = useState(false);
  const [original, setOriginal] = useState(null);

  const set = (field) => (val) => {
    setF((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getSuratById(id).then((res) => {
      const d = res.data;
      if (!d) return;
      setOriginal(d);
      setF({
        noSurat:          d.noSurat === "-" ? "" : d.noSurat || "",
        namaOrganisasi:   d.organisasi || "",
        namaKegiatan:     d.namaKegiatan || "",
        tempatKegiatan:   d.tempatKegiatan || "",
        namaPJ:           d.penanggungJawab?.nama || "",
        kontakPJ:         d.penanggungJawab?.telp || "",
        namaKetPelaksana: d.ketuaPelaksana?.nama || "",
        nimKetPelaksana:  d.ketuaPelaksana?.nim || "",
        namaKetOrg:       d.ketuaOrganisasi?.nama || "",
        nimKetOrg:        d.ketuaOrganisasi?.nim || "",
        tanggalPinjam:    toFormDate(d.tanggalPinjam),
        tanggalKembali:   toFormDate(d.tanggalKembali),
        jamMulai:         toFormTime(d.jamMulai),
        jamBerakhir:      toFormTime(d.jamBerakhir),
        keterangan:       d.keterangan || "",
      });
    }).finally(() => setFetching(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = { ...INIT_ERR };
    let ok = true;
    const req = (key, label) => { if (!f[key]?.trim()) { e[key] = `${label} tidak boleh kosong.`; ok = false; } };

    req("noSurat",          "No surat");
    req("namaOrganisasi",   "Nama organisasi");
    req("namaKegiatan",     "Nama kegiatan");
    req("namaPJ",           "Nama penanggung jawab");
    req("kontakPJ",         "Kontak penanggung jawab");
    req("namaKetPelaksana", "Nama ketua pelaksana");
    req("nimKetPelaksana",  "NIM ketua pelaksana");
    req("namaKetOrg",       "Nama ketua organisasi");
    req("nimKetOrg",        "NIM ketua organisasi");
    if (!f.tempatKegiatan) { e.tempatKegiatan = "Tempat kegiatan tidak boleh kosong."; ok = false; }
    if (!f.tanggalPinjam)  { e.tanggalPinjam  = "Tanggal pinjam tidak boleh kosong."; ok = false; }
    if (!f.tanggalKembali) { e.tanggalKembali = "Tanggal kembali tidak boleh kosong."; ok = false; }
    if (!f.jamMulai)       { e.jamMulai       = "Jam mulai tidak boleh kosong.";       ok = false; }
    if (!f.jamBerakhir)    { e.jamBerakhir    = "Jam berakhir tidak boleh kosong.";    ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        noSurat: f.noSurat, organisasi: f.namaOrganisasi,
        namaKegiatan: f.namaKegiatan, tempatKegiatan: f.tempatKegiatan,
        penanggungJawab: { nama: f.namaPJ, telp: f.kontakPJ },
        ketuaPelaksana:  { nama: f.namaKetPelaksana, nim: f.nimKetPelaksana },
        ketuaOrganisasi: { nama: f.namaKetOrg, nim: f.nimKetOrg },
        tanggalPinjam: f.tanggalPinjam, tanggalKembali: f.tanggalKembali,
        jamMulai: f.jamMulai, jamBerakhir: f.jamBerakhir,
        keterangan: f.keterangan, updatedAt: new Date().toISOString(),
      };
      if (isEdit) {
        await updateSurat(id, { ...original, ...payload });
      } else {
        await createSurat({
          ...payload, jenisSurat: "Peminjaman Ruangan", userId: user?.id,
          status: "Menunggu",
          tanggalPengajuan: new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"2-digit",year:"numeric"}).replace(/\//g,"-"),
          createdAt: new Date().toISOString(),
        });
      }
      setModal(true);
    } catch { alert("Terjadi kesalahan saat menyimpan data."); }
    finally   { setLoading(false); }
  };

  const kepemimpinanGroups = [
    { label: "Penanggung Jawab", fields: [
      { label:"Nama Penanggung Jawab",  placeholder:"Masukkan nama penanggung jawab", value:f.namaPJ,           onChange:set("namaPJ"),           error:errors.namaPJ },
      { label:"Kontak Penanggung Jawab",placeholder:"Masukkan nomor telepon",         value:f.kontakPJ,         onChange:set("kontakPJ"),         error:errors.kontakPJ, type:"tel" },
    ]},
    { label: "Ketua Pelaksana", fields: [
      { label:"Nama Ketua Pelaksana", placeholder:"Masukkan nama ketua pelaksana", value:f.namaKetPelaksana, onChange:set("namaKetPelaksana"), error:errors.namaKetPelaksana },
      { label:"NIM Ketua Pelaksana",  placeholder:"Masukkan NIM ketua pelaksana",  value:f.nimKetPelaksana,  onChange:set("nimKetPelaksana"),  error:errors.nimKetPelaksana },
    ]},
    { label: "Ketua Organisasi", fields: [
      { label:"Nama Ketua Organisasi", placeholder:"Masukkan nama ketua organisasi", value:f.namaKetOrg, onChange:set("namaKetOrg"), error:errors.namaKetOrg },
      { label:"NIM Ketua Organisasi",  placeholder:"Masukkan NIM ketua organisasi",  value:f.nimKetOrg,  onChange:set("nimKetOrg"),  error:errors.nimKetOrg },
    ]},
  ];

  const title    = isEdit ? "Ubah Surat Peminjaman Ruangan" : "Pengajuan Surat Peminjaman Ruangan";
  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman ruangan";

  if (fetching) return <MainLayout><div className="p-8 text-sm text-slate-400">Memuat data...</div></MainLayout>;

  const sections = [
    <FormCard key="surat" icon={<FileText size={20} />} title="Informasi Surat" subtitle="Masukkan informasi terkait nomor surat pengajuan">
      <FormField label="No Surat" required error={errors.noSurat}>
        <FormTextInput placeholder="Masukkan no surat" value={f.noSurat} onChange={set("noSurat")} error={errors.noSurat} />
      </FormField>
    </FormCard>,

    <FormCard key="org" icon={<PeopleGroupIcon size={20} />} title="Detail Organisasi & Kegiatan" subtitle="Informasi mengenai organisasi dan kegiatan yang akan dilaksanakan">
      <FormGrid cols={2}>
        <FormField label="Nama Organisasi" required error={errors.namaOrganisasi}>
          <FormTextInput placeholder="Masukkan nama organisasi" value={f.namaOrganisasi} onChange={set("namaOrganisasi")} error={errors.namaOrganisasi} />
        </FormField>
        <FormField label="Nama Kegiatan" required error={errors.namaKegiatan}>
          <FormTextInput placeholder="Masukkan nama kegiatan" value={f.namaKegiatan} onChange={set("namaKegiatan")} error={errors.namaKegiatan} />
        </FormField>
      </FormGrid>
      <div className="mt-4">
        <FormField label="Tempat Kegiatan" required error={errors.tempatKegiatan}>
          <FormSelectInput placeholder="Pilih tempat kegiatan" value={f.tempatKegiatan} onChange={set("tempatKegiatan")} options={TEMPAT_OPTIONS} error={errors.tempatKegiatan} />
        </FormField>
      </div>
    </FormCard>,

    <FormCard key="pimpin" icon={<Users size={20} />} title="Informasi Kepemimpinan" subtitle="Data penanggung jawab, ketua organisasi, dan ketua pelaksana kegiatan">
      <KepemimpinanSection groups={kepemimpinanGroups} />
    </FormCard>,

    <FormCard key="jadwal" icon={<Calendar size={20} />} title="Jadwal Peminjaman" subtitle="Tentukan tanggal dan waktu peminjaman ruangan">
      <FormGrid cols={2}>
        <FormField label="Tanggal Pinjam"  required error={errors.tanggalPinjam}>
          <FormDateInput value={f.tanggalPinjam}  onChange={set("tanggalPinjam")}  error={errors.tanggalPinjam} />
        </FormField>
        <FormField label="Tanggal Kembali" required error={errors.tanggalKembali}>
          <FormDateInput value={f.tanggalKembali} onChange={set("tanggalKembali")} error={errors.tanggalKembali} />
        </FormField>
        <FormField label="Jam Mulai"    required error={errors.jamMulai}>
          <FormTimeInput value={f.jamMulai}    onChange={set("jamMulai")}    error={errors.jamMulai} />
        </FormField>
        <FormField label="Jam Berakhir" required error={errors.jamBerakhir}>
          <FormTimeInput value={f.jamBerakhir} onChange={set("jamBerakhir")} error={errors.jamBerakhir} />
        </FormField>
      </FormGrid>
    </FormCard>,

    <FormCard key="info" icon={<Info size={20} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait peminjaman ruangan">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={f.keterangan} onChange={set("keterangan")} />
    </FormCard>,
  ];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Peminjaman Ruangan" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Peminjaman Ruangan" subtitle={subtitle} footer={<FormDesktopFooter onSubmit={handleSubmit} loading={loading} />}>
          {sections}
        </FormDesktopPanel>
        <FormMobileCards>{sections}</FormMobileCards>
        <FormMobileFooter onSubmit={handleSubmit} loading={loading} />
      </div>
      <SuccessModal isOpen={modal} message={isEdit ? "Perubahan Berhasil Disimpan!" : "Surat Berhasil Dikirim!"}
        onOk={() => navigate("/data-surat/peminjaman-ruangan")}
        onClose={() => { setModal(false); setF(INIT); setErrors(INIT_ERR); }} />
    </MainLayout>
  );
}