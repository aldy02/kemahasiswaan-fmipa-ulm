// src/pages/RekomendasiDetail.jsx
import { useParams } from "react-router-dom";
import { User, CheckCircle, FileText, MessageSquare } from "lucide-react";
import { DetailPageLayout, SectionCard, Field, NotFound } from "../../components/DataSuratDetailComponents";
import { rekomendasiData } from "../../test/data";

export default function RekomendasiDetail() {
  const { id } = useParams();
  const item = rekomendasiData.find((d) => d.id === Number(id));

  if (!item) return <NotFound />;

  const cardMahasiswa = (
    <SectionCard key="mhs" icon={<User size={20} />} title="Informasi Mahasiswa">
      <div className="grid grid-cols-2 gap-x-6">
        <Field label="NIM" value={item.nim} />
        <Field label="Nama" value={item.nama} />
        <Field label="Program Studi" value={item.prodi} />
        <Field label="Angkatan" value={item.angkatan} />
        <Field label="Semester" value={item.semester} />
        <Field label="Tahun Ajaran" value={item.tahunAjaran} />
      </div>
    </SectionCard>
  );

  const cardPermohonan = (
    <SectionCard key="permohonan" icon={<FileText size={20} />} title="Detail Permohonan">
      <Field label="Keperluan" value={item.keperluan} />
      <Field label="Tanggal Pengajuan" value={item.tanggalPengajuan} />
    </SectionCard>
  );

  const cardPersetujuan = (
    <SectionCard key="persetujuan" icon={<CheckCircle size={20} />} title="Informasi Persetujuan">
      <div className="grid grid-cols-2 gap-x-6">
        <Field label="Disetujui Oleh" value={item.disetujuiOleh} />
        <Field label="Jabatan" value={item.jabatan} />
        <Field label="NIP" value={item.nip} />
        <Field label="Pangkat/Golongan" value={item.pangkat} />
      </div>
    </SectionCard>
  );

  const cardKeterangan = (
    <SectionCard key="ket" icon={<MessageSquare size={20} />} title="Keterangan">
      <p className="text-sm text-neutral-2 leading-relaxed">{item.keterangan || "-"}</p>
    </SectionCard>
  );

  return (
    <DetailPageLayout
      breadcrumb="Data Surat / Rekomendasi / Detail"
      pageTitle="Data Surat Rekomendasi"
      detailTitle="Detail Surat Rekomendasi"
      noSurat={item.noSurat}
      status={item.status}
      editPath={`/pengajuan-surat/rekomendasi/edit/${item.id}`}
      leftCards={[cardMahasiswa, cardPermohonan]}
      rightCards={[cardPersetujuan, cardKeterangan]}
      mobileCards={[cardPersetujuan, cardMahasiswa, cardPermohonan, cardKeterangan]}
    />
  );
}