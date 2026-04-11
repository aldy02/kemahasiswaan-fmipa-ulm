// src/pages/Rekomendasi.jsx
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { rekomendasiData } from "../../test/data";

const columns = [
  { key: "noSurat",          label: "No Surat" },
  { key: "nama",             label: "Nama" },
  { key: "nim",              label: "NIM" },
  { key: "prodi",            label: "Prodi" },
  { key: "tanggalPengajuan", label: "Tanggal Pengajuan" },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
];

export default function Rekomendasi() {
  const navigate = useNavigate();

  return (
    <SuratPageLayout
      breadcrumb="Data Surat / Rekomendasi"
      pageTitle="Data Surat Rekomendasi"
      pageSubtitle="Informasi data surat rekomendasi"
      cardTitle="Rekomendasi"
      searchPlaceholder="Cari berdasarkan nama mahasiswa..."
      data={rekomendasiData}
      filterFn={(d, s) => d.nama.toLowerCase().includes(s.toLowerCase())}
      columns={columns}
      getMobileCardProps={(item) => ({
        title: item.nama,
        subtitle: item.nim,
        status: item.status,
        fields: [
          ["No Surat", item.noSurat],
          ["Program Studi", item.prodi],
          ["Tanggal Pengajuan", item.tanggalPengajuan],
        ],
      })}
      onTambah={() => navigate(`/pengajuan-surat/rekomendasi`)}
      onView={(item) => navigate(`/data-surat/rekomendasi/${item.id}`)}
      onEdit={(item) => navigate(`/pengajuan-surat/rekomendasi/edit/${item.id}`)}
      onDelete={(item) => console.log("Delete", item.id)}
    />
  );
}