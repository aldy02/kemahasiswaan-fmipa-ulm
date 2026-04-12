// src/pages/PeminjamanAlatBahanDetail.jsx
import { useParams } from "react-router-dom";
import { FileText, Users, Building2, CalendarDays, MessageSquare, Package } from "lucide-react";
import { DetailPageLayout, SectionCard, Field, FieldWithSub, NotFound } from "../../components/DataSuratDetailComponents";
import { peminjamanAlatBahanData } from "../../test/data";

export default function PeminjamanAlatBahanDetail() {
  const { id } = useParams();
  const item = peminjamanAlatBahanData.find((d) => d.id === Number(id));

  if (!item) return <NotFound />;

  const cardSurat = (
    <SectionCard key="surat" icon={<FileText size={20} />} title="Informasi Surat">
      <Field label="No Surat" value={item.noSurat} />
      <Field label="Jenis Surat" value={item.jenisSurat} />
      <Field label="Tanggal Pengajuan" value={item.tanggalPengajuan} />
    </SectionCard>
  );

  const cardOrganisasi = (
    <SectionCard key="org" icon={<Building2 size={20} />} title="Detail Organisasi & Kegiatan">
      <Field label="Nama Organisasi" value={item.organisasi} />
      <Field label="Nama Kegiatan" value={item.kegiatan} />
    </SectionCard>
  );

  const cardAlat = (
    <SectionCard key="alat" icon={<Package size={20} />} title="Detail Alat/Bahan">
      {item.daftarAlat?.map((alat) => (
        <Field key={alat.item} label={alat.item} value={alat.nama} />
      ))}
    </SectionCard>
  );

  const cardKepemimpinan = (
    <SectionCard key="pimpin" icon={<Users size={20} />} title="Informasi Kepemimpinan">
      <FieldWithSub label="Penanggung Jawab" main={item.penanggungJawab?.nama} sub={`Telp: ${item.penanggungJawab?.telp}`} />
      <FieldWithSub label="Ketua Pelaksana" main={item.ketuaPelaksana?.nama} sub={`NIM: ${item.ketuaPelaksana?.nim}`} />
      <FieldWithSub label="Ketua Organisasi" main={item.ketuaOrganisasi?.nama} sub={`Telp: ${item.ketuaOrganisasi?.telp}`} />
    </SectionCard>
  );

  const cardJadwal = (
    <SectionCard key="jadwal" icon={<CalendarDays size={20} />} title="Jadwal Peminjaman">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Field label="Tanggal Pinjam" value={item.tanggalPinjam} />
        <Field label="Tanggal Kembali" value={item.tanggalKembali} />
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
      breadcrumb="Data Surat / Peminjaman Alat/Bahan / Detail"
      pageTitle="Data Surat Peminjaman Alat/Bahan"
      detailTitle="Detail Peminjaman Alat/Bahan"
      noSurat={item.noSurat}
      status={item.status}
      editPath={`/pengajuan-surat/peminjaman-alat-bahan/edit/${item.id}`}
      leftCards={[cardSurat, cardOrganisasi, cardAlat]}
      rightCards={[cardKepemimpinan, cardJadwal, cardKeterangan]}
      mobileCards={[cardSurat, cardOrganisasi, cardKepemimpinan, cardAlat, cardJadwal, cardKeterangan]}
    />
  );
}