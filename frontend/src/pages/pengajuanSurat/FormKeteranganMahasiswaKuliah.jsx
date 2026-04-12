// src/pages/pengajuanSurat/FormKeteranganMahasiswaKuliah.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Settings, User, Users, MessageSquare } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { keteranganMahasiswaKuliahData } from "../../test/data";
import {
    FormLabel, FormTextInput, FormSelectInput, FormDateInput, FormTextarea,
    FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
    FormDesktopFooter, FormMobileFooter, FormOperatorSection, toFormDate,
} from "../../components/FormComponents";

const PRODI_OPTIONS = ["S1 Matematika", "S1 Statistika", "S1 Fisika", "S1 Kimia", "S1 Biologi", "S1 Ilmu Komputer", "S1 Farmasi"];
const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const TAHUN_AJARAN_OPTIONS = ["2021/2022", "2022/2023", "2023/2024", "2024/2025", "2025/2026"];

export default function FormKeteranganMahasiswaKuliah() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [noSurat, setNoSurat] = useState("");
    const [namaDosen, setNamaDosen] = useState("");
    const [nip, setNip] = useState("");
    const [pangkat, setPangkat] = useState("");
    const [jabatan, setJabatan] = useState("");
    const [nim, setNim] = useState("");
    const [nama, setNama] = useState("");
    const [tempatLahir, setTempatLahir] = useState("");
    const [tanggalLahir, setTanggalLahir] = useState("");
    const [prodi, setProdi] = useState("");
    const [semester, setSemester] = useState("");
    const [tahunAjaran, setTahunAjaran] = useState("");
    const [namaOrtu, setNamaOrtu] = useState("");
    const [nipOrtu, setNipOrtu] = useState("");
    const [instansiOrtu, setInstansiOrtu] = useState("");
    const [pangkatOrtu, setPangkatOrtu] = useState("");
    const [jabatanOrtu, setJabatanOrtu] = useState("");
    const [keterangan, setKeterangan] = useState("");

    useEffect(() => {
        if (!isEdit) return;
        const item = keteranganMahasiswaKuliahData.find((d) => d.id === Number(id));
        if (!item) return;
        setNoSurat(item.noSurat === "-" ? "" : item.noSurat || "");
        setNamaDosen(item.disetujuiOleh === "-" ? "" : item.disetujuiOleh || "");
        setNip(item.nip === "-" ? "" : item.nip || "");
        setPangkat(item.pangkat === "-" ? "" : item.pangkat || "");
        setJabatan(item.jabatan === "-" ? "" : item.jabatan || "");
        setNim(item.nim || "");
        setNama(item.nama || "");
        setTempatLahir(item.tempatLahir || "");
        // tanggalLahir: "dd-mm-yyyy" format
        setTanggalLahir(toFormDate(item.tanggalLahir));
        setProdi(item.prodi || "");
        setSemester(item.semester || "");
        setTahunAjaran(item.tahunAjaran || "");
        setNamaOrtu(item.namaOrtu || "");
        setNipOrtu(item.nipOrtu || "");
        setInstansiOrtu(item.instansiOrtu || "");
        setPangkatOrtu(item.pangkatOrtu || "");
        setJabatanOrtu(item.jabatanOrtu || "");
        setKeterangan(item.keterangan || "");
    }, [id, isEdit]);

    const title = isEdit ? "Ubah Surat Keterangan Mahasiswa Kuliah" : "Pengajuan Surat Keterangan Mahasiswa Kuliah";
    const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan surat keterangan mahasiswa kuliah";

    // ── Sections ─────────────────────────────────────────────────────────────
    const s1 = (
        <FormCard key="operator" icon={<Settings size={18} />} title="Informasi Operator" subtitle="Data administratif yang diisi oleh operator sistem" dimmed>
            <FormOperatorSection {...{ noSurat, setNoSurat, namaDosen, setNamaDosen, nip, setNip, pangkat, setPangkat, jabatan, setJabatan }} />
        </FormCard>
    )

    const s2 = (
        <FormCard key="mhs" icon={<User size={18} />} title="Informasi Mahasiswa" subtitle="Informasi lengkap mahasiswa yang mengajukan surat keterangan mahasiswa kuliah">
            {/* Desktop: 2 cols, Tahun Ajaran full width */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-4">
                <div><FormLabel required>NIM</FormLabel><FormTextInput placeholder="Masukkan NIM" value={nim} onChange={setNim} /></div>
                <div><FormLabel required>Nama Mahasiswa</FormLabel><FormTextInput placeholder="Masukkan nama lengkap" value={nama} onChange={setNama} /></div>
                <div><FormLabel required>Tempat Lahir</FormLabel><FormTextInput placeholder="Masukkan tempat lahir" value={tempatLahir} onChange={setTempatLahir} /></div>
                <div><FormLabel required>Tanggal Lahir</FormLabel><FormDateInput value={tanggalLahir} onChange={setTanggalLahir} /></div>
                <div><FormLabel required>Program Studi</FormLabel><FormSelectInput placeholder="Pilih program studi" value={prodi} onChange={setProdi} options={PRODI_OPTIONS} /></div>
                <div><FormLabel required>Semester</FormLabel><FormSelectInput placeholder="Pilih semester" value={semester} onChange={setSemester} options={SEMESTER_OPTIONS} /></div>
                <div className="lg:col-span-2"><FormLabel required>Tahun Ajaran</FormLabel><FormSelectInput placeholder="Pilih tahun ajaran" value={tahunAjaran} onChange={setTahunAjaran} options={TAHUN_AJARAN_OPTIONS} /></div>
            </div>
            {/* Mobile: stacked */}
            <div className="lg:hidden flex flex-col gap-3">
                <div><FormLabel required>NIM</FormLabel><FormTextInput placeholder="Masukkan NIM" value={nim} onChange={setNim} /></div>
                <div><FormLabel required>Nama Mahasiswa</FormLabel><FormTextInput placeholder="Masukkan nama lengkap" value={nama} onChange={setNama} /></div>
                <div><FormLabel required>Tempat Lahir</FormLabel><FormTextInput placeholder="Masukkan tempat lahir" value={tempatLahir} onChange={setTempatLahir} /></div>
                <div><FormLabel required>Tanggal Lahir</FormLabel><FormDateInput value={tanggalLahir} onChange={setTanggalLahir} /></div>
                <div><FormLabel required>Program Studi</FormLabel><FormSelectInput placeholder="Pilih program studi" value={prodi} onChange={setProdi} options={PRODI_OPTIONS} /></div>
                <div><FormLabel required>Semester</FormLabel><FormSelectInput placeholder="Pilih semester" value={semester} onChange={setSemester} options={SEMESTER_OPTIONS} /></div>
                <div><FormLabel required>Tahun Ajaran</FormLabel><FormSelectInput placeholder="Pilih tahun ajaran" value={tahunAjaran} onChange={setTahunAjaran} options={TAHUN_AJARAN_OPTIONS} /></div>
            </div>
        </FormCard>
    )

    const s3 = (
        <FormCard key="ortu" icon={<Users size={18} />} title="Informasi Orang Tua/Wali" subtitle="Informasi lengkap orang tua/wali mahasiswa">
            {/* Desktop: 2 cols, Jabatan full */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-4">
                <div><FormLabel required>Nama Orang Tua/Wali</FormLabel><FormTextInput placeholder="Masukkan nama orang tua/wali" value={namaOrtu} onChange={setNamaOrtu} /></div>
                <div><FormLabel>NIP Orang Tua/Wali</FormLabel><FormTextInput placeholder="Masukkan NIP orang tua/wali" value={nipOrtu} onChange={setNipOrtu} /></div>
                <div><FormLabel required>Instansi</FormLabel><FormTextInput placeholder="Masukkan nama instansi tempat bekerja" value={instansiOrtu} onChange={setInstansiOrtu} /></div>
                <div><FormLabel>Pangkat/Golongan</FormLabel><FormTextInput placeholder="Masukkan pangkat/golongan" value={pangkatOrtu} onChange={setPangkatOrtu} /></div>
                <div className="lg:col-span-2"><FormLabel required>Jabatan</FormLabel><FormTextInput placeholder="Masukkan jabatan orang tua/wali" value={jabatanOrtu} onChange={setJabatanOrtu} /></div>
            </div>
            {/* Mobile: stacked */}
            <div className="lg:hidden flex flex-col gap-3">
                <div><FormLabel required>Nama Orang Tua/Wali</FormLabel><FormTextInput placeholder="Masukkan nama orang tua/wali" value={namaOrtu} onChange={setNamaOrtu} /></div>
                <div><FormLabel>NIP Orang Tua/Wali</FormLabel><FormTextInput placeholder="Masukkan NIP orang tua/wali" value={nipOrtu} onChange={setNipOrtu} /></div>
                <div><FormLabel required>Instansi</FormLabel><FormTextInput placeholder="Masukkan nama instansi tempat bekerja" value={instansiOrtu} onChange={setInstansiOrtu} /></div>
                <div><FormLabel>Pangkat/Golongan</FormLabel><FormTextInput placeholder="Masukkan pangkat/golongan" value={pangkatOrtu} onChange={setPangkatOrtu} /></div>
                <div><FormLabel required>Jabatan</FormLabel><FormTextInput placeholder="Masukkan jabatan orang tua/wali" value={jabatanOrtu} onChange={setJabatanOrtu} /></div>
            </div>
        </FormCard>
    )

    const s4 = (
        <FormCard key="tambahan" icon={<MessageSquare size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait surat keterangan mahasiswa kuliah">
            <FormLabel>Keterangan</FormLabel>
            <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={keterangan} onChange={setKeterangan} />
        </FormCard>
    )

    const sections = [s1, s2, s3, s4];

    return (
        <MainLayout>
            <FormPageHeader breadcrumb="Pengajuan Surat / Keterangan Mahasiswa Kuliah" title={title} subtitle={subtitle} />
            <div className="hidden lg:block h-6" />
            <div className="mx-0 lg:mx-8 pb-10">
                <FormDesktopPanel title="Form Surat Keterangan Mahasiswa Kuliah" subtitle={subtitle} footer={<FormDesktopFooter />}>{sections}</FormDesktopPanel>
                <FormMobileCards>{sections}</FormMobileCards>
                <FormMobileFooter />
            </div>
        </MainLayout>
    );
}