// src/pages/IzinPraktikumUlangDetail.jsx
import { useParams } from "react-router-dom";
import { FileText, Users, CalendarDays, Info, MessageSquare } from "lucide-react";
import { DetailPageLayout, SectionCard, Field, MahasiswaItem, NotFound } from "../../components/DataSuratDetailComponents";
import { izinPraktikumUlangData } from "../../test/data";

export default function IzinPraktikumUlangDetail() {
  const { id } = useParams();
  const item = izinPraktikumUlangData.find((d) => d.id === Number(id));

  if (!item) return <NotFound />;

  const mahasiswas = item.mahasiswas ?? [];
  const isMulti = mahasiswas.length > 1;

  const cardSurat = (
    <SectionCard key="surat" icon={<FileText size={20} />} title="Informasi Surat">
      <Field label="No Surat" value={item.noSurat} />
      <Field label="Jenis Surat" value={item.jenisSurat} />
      <Field label="Tanggal Pengajuan" value={item.tanggalPengajuan} />
    </SectionCard>
  );

  const cardMahasiswa = (
    <SectionCard key="mhs" icon={<Users size={20} />} title="Data Mahasiswa">
      {isMulti ? (
        mahasiswas.map((mhs, i) => <MahasiswaItem key={i} index={i} mhs={mhs} showIndex />)
      ) : (
        <>
          <Field label="NIM" value={mahasiswas[0]?.nim} />
          <Field label="Nama" value={mahasiswas[0]?.nama} />
          <Field label="Mata Kuliah" value={mahasiswas[0]?.mataKuliah} />
          <Field label="Program Studi" value={mahasiswas[0]?.prodi} />
        </>
      )}
    </SectionCard>
  );

  const cardJadwal = (
    <SectionCard key="jadwal" icon={<CalendarDays size={20} />} title="Jadwal Izin">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Field label="Tanggal Mulai" value={item.tanggalMulai} />
        <Field label="Tanggal Akhir" value={item.tanggalAkhir} />
      </div>
    </SectionCard>
  );

  const cardAlasan = (
    <SectionCard key="alasan" icon={<Info size={20} />} title="Alasan & Tempat Izin">
      <Field label="Sebab" value={item.sebab} />
      <Field label="Tempat" value={item.tempat} />
    </SectionCard>
  );

  const cardKeterangan = (
    <SectionCard key="ket" icon={<MessageSquare size={20} />} title="Keterangan">
      <p className="text-sm text-neutral-2 leading-relaxed">{item.keterangan || "-"}</p>
    </SectionCard>
  );

  return (
    <DetailPageLayout
      breadcrumb="Data Surat / Izin Praktikum Ulang / Detail"
      pageTitle="Data Surat Izin Praktikum Ulang"
      detailTitle="Detail Izin Praktikum Ulang"
      noSurat={item.noSurat}
      status={item.status}
      editPath={`/pengajuan-surat/izin-praktikum-ulang/edit/${item.id}`}
      leftCards={[cardSurat, cardMahasiswa]}
      rightCards={[cardJadwal, cardAlasan, cardKeterangan]}
      mobileCards={[cardSurat, cardMahasiswa, cardJadwal, cardAlasan, cardKeterangan]}
    />
  );
}