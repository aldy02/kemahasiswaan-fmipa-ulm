import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Settings, User, FileText, MessageSquare } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { getSuratById, createSurat, updateSurat } from "../../api/suratApi";
import { useAuth } from "../../contexts/AuthContext";
import SuccessModal from "../../components/SuccessModal";
import {
  FormField, FormGrid, FormLabel,
  FormTextInput, FormSelectInput, FormDateInput, FormTextarea,
  FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, FormOperatorSection, toFormDate, toApiDate,
} from "../../components/FormComponents";

const PRODI_OPTIONS = ["S1 Matematika", "S1 Statistika", "S1 Fisika", "S1 Kimia", "S1 Biologi", "S1 Ilmu Komputer", "S1 Farmasi"];
const ANGKATAN_OPTIONS = ["2021", "2022", "2023", "2024", "2025", "2026"];
const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
const TAHUN_AJARAN_OPTIONS = ["2021/2022", "2022/2023", "2023/2024", "2024/2025", "2025/2026"];

const INIT_F = { nim: "", namaMhs: "", prodi: "", angkatan: "", semester: "", tahunAjaran: "", keperluan: "", tanggalPengajuan: "", keterangan: "" };
const INIT_ERR = { nim: "", namaMhs: "", prodi: "", angkatan: "", semester: "", tahunAjaran: "", keperluan: "", tanggalPengajuan: "" };

export default function FormKeterangan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [opSurat, setOpSurat] = useState("");
  const [opDosen, setOpDosen] = useState("");
  const [opNip, setOpNip] = useState("");
  const [opPangkat, setOpPangkat] = useState("");
  const [opJabatan, setOpJabatan] = useState("");

  const [f, setF] = useState(INIT_F);
  const [errors, setErrors] = useState(INIT_ERR);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [modal, setModal] = useState(false);
  const [original, setOriginal] = useState(null);

  const set = (field) => (val) => { setF((p) => ({ ...p, [field]: val })); setErrors((p) => ({ ...p, [field]: "" })); };

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getSuratById(id).then((res) => {
      const d = res.data; if (!d) return;
      setOriginal(d);
      setOpSurat(d.noSurat === "-" ? "" : d.noSurat || "");
      setOpDosen(d.disetujuiOleh === "-" ? "" : d.disetujuiOleh || "");
      setOpNip(d.nip === "-" ? "" : d.nip || "");
      setOpPangkat(d.pangkat === "-" ? "" : d.pangkat || "");
      setOpJabatan(d.jabatan === "-" ? "" : d.jabatan || "");
      setF({
        nim: d.nim || "", namaMhs: d.nama || "", prodi: d.prodi || "", angkatan: d.angkatan || "",
        semester: d.semester || "", tahunAjaran: d.tahunAjaran || "", keperluan: d.keperluan || "",
        tanggalPengajuan: toFormDate(d.tanggalPengajuan), keterangan: d.keterangan || "",
      });
    }).finally(() => setFetching(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = { ...INIT_ERR }; let ok = true;
    const req = (key, label) => { if (!f[key]?.trim()) { e[key] = `${label} tidak boleh kosong.`; ok = false; } };
    req("nim", "NIM"); req("namaMhs", "Nama mahasiswa"); req("keperluan", "Keperluan");
    if (!f.prodi) { e.prodi = "Program studi tidak boleh kosong."; ok = false; }
    if (!f.angkatan) { e.angkatan = "Angkatan tidak boleh kosong."; ok = false; }
    if (!f.semester) { e.semester = "Semester tidak boleh kosong."; ok = false; }
    if (!f.tahunAjaran) { e.tahunAjaran = "Tahun ajaran tidak boleh kosong."; ok = false; }
    if (!f.tanggalPengajuan) { e.tanggalPengajuan = "Tanggal pengajuan tidak boleh kosong."; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        nim: f.nim, nama: f.namaMhs, prodi: f.prodi, angkatan: f.angkatan,
        semester: f.semester, tahunAjaran: f.tahunAjaran, keperluan: f.keperluan,
        tanggalPengajuan: toApiDate(f.tanggalPengajuan),
        keterangan: f.keterangan, updatedAt: new Date().toISOString(),
      };
      if (isEdit) {
        await updateSurat(id, { ...original, ...payload });
      } else {
        await createSurat({
          ...payload, jenisSurat: "Keterangan", userId: user?.id,
          noSurat: "-", status: "Menunggu",
          disetujuiOleh: "", jabatan: "", nip: "", pangkat: "",
          createdAt: new Date().toISOString(),
        });
      }
      setModal(true);
    } catch { alert("Terjadi kesalahan saat menyimpan data."); }
    finally { setLoading(false); }
  };

  const title = isEdit ? "Ubah Surat Keterangan" : "Pengajuan Surat Keterangan";
  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan surat keterangan";

  if (fetching) return <MainLayout><div className="p-8 text-sm text-slate-400">Memuat data...</div></MainLayout>;

  const sections = [
    <FormCard key="op" icon={<Settings size={18} />} title="Informasi Operator" subtitle="Data administratif yang diisi oleh operator sistem" dimmed>
      <FormOperatorSection noSurat={opSurat} setNoSurat={setOpSurat} namaDosen={opDosen} setNamaDosen={setOpDosen}
        nip={opNip} setNip={setOpNip} pangkat={opPangkat} setPangkat={setOpPangkat} jabatan={opJabatan} setJabatan={setOpJabatan} />
    </FormCard>,

    <FormCard key="mhs" icon={<User size={18} />} title="Informasi Mahasiswa" subtitle="Informasi lengkap mahasiswa yang mengajukan surat keterangan">
      <FormGrid cols={2}>
        <FormField label="NIM" required error={errors.nim}>
          <FormTextInput placeholder="Masukkan NIM" value={f.nim} onChange={set("nim")} error={errors.nim} />
        </FormField>
        <FormField label="Nama Mahasiswa" required error={errors.namaMhs}>
          <FormTextInput placeholder="Masukkan nama lengkap" value={f.namaMhs} onChange={set("namaMhs")} error={errors.namaMhs} />
        </FormField>
        <FormField label="Program Studi" required error={errors.prodi}>
          <FormSelectInput placeholder="Pilih program studi" value={f.prodi} onChange={set("prodi")} options={PRODI_OPTIONS} error={errors.prodi} />
        </FormField>
        <FormField label="Angkatan" required error={errors.angkatan}>
          <FormSelectInput placeholder="Pilih angkatan" value={f.angkatan} onChange={set("angkatan")} options={ANGKATAN_OPTIONS} error={errors.angkatan} />
        </FormField>
        <FormField label="Semester" required error={errors.semester}>
          <FormSelectInput placeholder="Pilih semester" value={f.semester} onChange={set("semester")} options={SEMESTER_OPTIONS} error={errors.semester} />
        </FormField>
        <FormField label="Tahun Ajaran" required error={errors.tahunAjaran}>
          <FormSelectInput placeholder="Pilih tahun ajaran" value={f.tahunAjaran} onChange={set("tahunAjaran")} options={TAHUN_AJARAN_OPTIONS} error={errors.tahunAjaran} />
        </FormField>
      </FormGrid>
    </FormCard>,

    <FormCard key="permohonan" icon={<FileText size={18} />} title="Detail Permohonan" subtitle="Informasi terkait keperluan dan tanggal pengajuan surat keterangan">
      <FormGrid cols={2}>
        <FormField label="Keperluan" required error={errors.keperluan}>
          <FormTextInput placeholder="Masukkan keperluan surat keterangan" value={f.keperluan} onChange={set("keperluan")} error={errors.keperluan} />
        </FormField>
        <FormField label="Tanggal Pengajuan" required error={errors.tanggalPengajuan}>
          <FormDateInput value={f.tanggalPengajuan} onChange={set("tanggalPengajuan")} error={errors.tanggalPengajuan} />
        </FormField>
      </FormGrid>
    </FormCard>,

    <FormCard key="ket" icon={<MessageSquare size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={f.keterangan} onChange={set("keterangan")} />
    </FormCard>,
  ];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Keterangan" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Surat Keterangan" subtitle={subtitle} footer={<FormDesktopFooter onSubmit={handleSubmit} loading={loading} />}>
          {sections}
        </FormDesktopPanel>
        <FormMobileCards>{sections}</FormMobileCards>
        <FormMobileFooter onSubmit={handleSubmit} loading={loading} />
      </div>
      <SuccessModal isOpen={modal} message={isEdit ? "Perubahan Berhasil Disimpan!" : "Surat Berhasil Dikirim!"}
        onOk={() => navigate("/data-surat/keterangan")}
        onClose={() => { setModal(false); setF(INIT_F); setErrors(INIT_ERR); }} />
    </MainLayout>
  );
}