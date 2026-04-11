// src/pages/PeminjamanRuangan.jsx
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { peminjamanRuanganData } from "../../test/data";

const columns = [
  { key: "noSurat",        label: "No Surat" },
  { key: "organisasi",     label: "Organisasi" },
  { key: "tempatKegiatan", label: "Tempat Kegiatan" },
  { key: "tanggalPinjam",  label: "Tanggal Pinjam" },
  { key: "tanggalKembali", label: "Tanggal Kembali" },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
];

export default function PeminjamanRuangan() {
  const navigate = useNavigate();

  return (
    <SuratPageLayout
      breadcrumb="Data Surat / Peminjaman Ruangan"
      pageTitle="Data Surat Peminjaman Ruangan"
      pageSubtitle="Informasi data surat peminjaman ruangan"
      cardTitle="Peminjaman Ruangan"
      searchPlaceholder="Cari berdasarkan nama organisasi..."
      data={peminjamanRuanganData}
      filterFn={(d, s) => d.organisasi.toLowerCase().includes(s.toLowerCase())}
      columns={columns}
      getMobileCardProps={(item) => ({
        title: item.organisasi,
        subtitle: item.tempatKegiatan,
        status: item.status,
        fields: [
          ["No Surat", item.noSurat],
          ["Tanggal Pinjam", item.tanggalPinjam],
          ["Tanggal Kembali", item.tanggalKembali],
        ],
      })}
      onTambah={() => navigate(`/pengajuan-surat/peminjaman-ruangan`)}
      onView={(item) => navigate(`/data-surat/peminjaman-ruangan/${item.id}`)}
      onEdit={(item) => navigate(`/pengajuan-surat/peminjaman-ruangan/edit/${item.id}`)}
      onDelete={(item) => console.log("Delete", item.id)}
    />
  );
}