// src/pages/pengajuanSurat/FormRekomendasi.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Settings, User, FileText, MessageSquare } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { rekomendasiData } from "../../test/data";
import {
    FormLabel, FormTextInput, FormSelectInput, FormDateInput, FormTextarea,
    FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
    FormDesktopFooter, FormMobileFooter, FormOperatorSection, toFormDate,
} from "../../components/FormComponents";

const PRODI_OPTIONS = ["S1 Matematika", "S1 Statistika", "S1 Fisika", "S1 Kimia", "S1 Biologi", "S1 Ilmu Komputer", "S1 Farmasi"];
const ANGKATAN_OPTIONS = ["2021", "2022", "2023", "2024", "2025"];
const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const TAHUN_AJARAN_OPTIONS = ["2021/2022", "2022/2023", "2023/2024", "2024/2025", "2025/2026"];

export default function FormRekomendasi() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [noSurat, setNoSurat] = useState("");
    const [namaDosen, setNamaDosen] = useState("");
    const [nip, setNip] = useState("");
    const [pangkat, setPangkat] = useState("");
    const [jabatan, setJabatan] = useState("");
    const [nim, setNim] = useState("");
    const [namaMhs, setNamaMhs] = useState("");
    const [prodi, setProdi] = useState("");
    const [angkatan, setAngkatan] = useState("");
    const [semester, setSemester] = useState("");
    const [tahunAjaran, setTahunAjaran] = useState("");
    const [keperluan, setKeperluan] = useState("");
    const [tanggalPengajuan, setTanggalPengajuan] = useState("");
    const [keterangan, setKeterangan] = useState("");

    useEffect(() => {
        if (!isEdit) return;
        const item = rekomendasiData.find((d) => d.id === Number(id));
        if (!item) return;
        setNoSurat(item.noSurat === "-" ? "" : item.noSurat || "");
        setNamaDosen(item.disetujuiOleh === "-" ? "" : item.disetujuiOleh || "");
        setNip(item.nip === "-" ? "" : item.nip || "");
        setPangkat(item.pangkat === "-" ? "" : item.pangkat || "");
        setJabatan(item.jabatan === "-" ? "" : item.jabatan || "");
        setNim(item.nim || "");
        setNamaMhs(item.nama || "");
        setProdi(item.prodi || "");
        setAngkatan(item.angkatan || "");
        setSemester(item.semester || "");
        setTahunAjaran(item.tahunAjaran || "");
        setKeperluan(item.keperluan || "");
        setTanggalPengajuan(toFormDate(item.tanggalPengajuan));
        setKeterangan(item.keterangan === "Surat bisa diambil di bagian kemahasiswaan" ? "" : item.keterangan || "");
    }, [id, isEdit]);

    const title = isEdit ? "Ubah Surat Rekomendasi" : "Pengajuan Surat Rekomendasi";
    const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan surat rekomendasi";

    // Shared 2-col mahasiswa fields
    const mhsFields = [
        { label: "NIM", placeholder: "Masukkan NIM", value: nim, set: setNim },
        { label: "Nama Mahasiswa", placeholder: "Masukkan nama lengkap", value: namaMhs, set: setNamaMhs },
    ];
    const mhsSelects = [
        { label: "Program Studi", placeholder: "Pilih program studi", value: prodi, set: setProdi, options: PRODI_OPTIONS },
        { label: "Angkatan", placeholder: "Pilih angkatan", value: angkatan, set: setAngkatan, options: ANGKATAN_OPTIONS },
        { label: "Semester", placeholder: "Pilih semester", value: semester, set: setSemester, options: SEMESTER_OPTIONS },
        { label: "Tahun Ajaran", placeholder: "Pilih tahun ajaran", value: tahunAjaran, set: setTahunAjaran, options: TAHUN_AJARAN_OPTIONS },
    ];

    // ── Sections ─────────────────────────────────────────────────────────────
    const s1 = (
        <FormCard key="operator" icon={<Settings size={18} />} title="Informasi Operator" subtitle="Data administratif yang diisi oleh operator sistem" dimmed>
            <FormOperatorSection {...{ noSurat, setNoSurat, namaDosen, setNamaDosen, nip, setNip, pangkat, setPangkat, jabatan, setJabatan }} />
        </FormCard>
    )

    const s2 = (
        <FormCard key="mhs" icon={<User size={18} />} title="Informasi Mahasiswa" subtitle="Informasi lengkap mahasiswa yang mengajukan surat rekomendasi">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mhsFields.map(({ label, placeholder, value, set }) => (
                    <div key={label}><FormLabel required>{label}</FormLabel><FormTextInput placeholder={placeholder} value={value} onChange={set} /></div>
                ))}
                {mhsSelects.map(({ label, placeholder, value, set, options }) => (
                    <div key={label}><FormLabel required>{label}</FormLabel><FormSelectInput placeholder={placeholder} value={value} onChange={set} options={options} /></div>
                ))}
            </div>
        </FormCard>
    )

    const s3 = (
        <FormCard key="permohonan" icon={<FileText size={18} />} title="Detail Permohonan" subtitle="Informasi terkait keperluan dan tanggal pengajuan surat rekomendasi">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div><FormLabel required>Keperluan</FormLabel><FormTextInput placeholder="Masukkan keperluan surat rekomendasi" value={keperluan} onChange={setKeperluan} /></div>
                <div><FormLabel required>Tanggal Pengajuan</FormLabel><FormDateInput value={tanggalPengajuan} onChange={setTanggalPengajuan} /></div>
            </div>
        </FormCard>
    )

    const s4 = (
        <FormCard key="tambahan" icon={<MessageSquare size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait surat rekomendasi">
            <FormLabel>Keterangan</FormLabel>
            <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={keterangan} onChange={setKeterangan} />
        </FormCard>
    )

    const sections = [s1, s2, s3, s4];

    return (
        <MainLayout>
            <FormPageHeader breadcrumb="Pengajuan Surat / Rekomendasi" title={title} subtitle={subtitle} />
            <div className="hidden lg:block h-6" />
            <div className="mx-0 lg:mx-8 pb-10">
                <FormDesktopPanel title="Form Surat Rekomendasi" subtitle={subtitle} footer={<FormDesktopFooter />}>{sections}</FormDesktopPanel>
                <FormMobileCards>{sections}</FormMobileCards>
                <FormMobileFooter />
            </div>
        </MainLayout>
    );
}