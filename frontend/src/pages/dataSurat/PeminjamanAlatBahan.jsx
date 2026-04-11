// src/pages/PeminjamanAlatBahan.jsx
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { peminjamanAlatBahanData } from "../../test/data";

const columns = [
  { key: "noSurat",          label: "No Surat" },
  { key: "kegiatan",         label: "Kegiatan" },
  { key: "tanggalPengajuan", label: "Tanggal Pengajuan" },
  { key: "tanggalPinjam",    label: "Tanggal Pinjam" },
  { key: "tanggalKembali",   label: "Tanggal Kembali" },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
];

export default function PeminjamanAlatBahan() {
  const navigate = useNavigate();

  return (
    <SuratPageLayout
      breadcrumb="Data Surat / Peminjaman Alat/Bahan"
      pageTitle="Data Surat Peminjaman Alat/Bahan"
      pageSubtitle="Informasi data surat peminjaman alat/bahan"
      cardTitle="Peminjaman Alat/Bahan"
      searchPlaceholder="Cari berdasarkan nama kegiatan..."
      data={peminjamanAlatBahanData}
      filterFn={(d, s) => d.kegiatan.toLowerCase().includes(s.toLowerCase())}
      columns={columns}
      getMobileCardProps={(item) => ({
        title: item.kegiatan,
        subtitle: item.noSurat,
        status: item.status,
        fields: [
          ["Tanggal Pengajuan", item.tanggalPengajuan],
          ["Tanggal Pinjam", item.tanggalPinjam],
          ["Tanggal Kembali", item.tanggalKembali],
        ],
      })}
      onTambah={() => navigate(`/pengajuan-surat/peminjaman-alat-bahan`)}
      onView={(item) => navigate(`/data-surat/peminjaman-alat-bahan/${item.id}`)}
      onEdit={(item) => navigate(`/pengajuan-surat/peminjaman-alat-bahan/edit/${item.id}`)}
      onDelete={(item) => console.log("Delete", item.id)}
    />
  );
}