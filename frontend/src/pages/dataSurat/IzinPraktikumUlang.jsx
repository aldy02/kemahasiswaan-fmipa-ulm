// src/pages/IzinPraktikumUlang.jsx
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { izinPraktikumUlangData } from "../../test/data";

const columns = [
  { key: "noSurat",    label: "No Surat" },
  { key: "nama",       label: "Nama",       render: (item) => item.mahasiswas?.[0]?.nama       ?? "-" },
  { key: "nim",        label: "NIM",        render: (item) => item.mahasiswas?.[0]?.nim        ?? "-" },
  { key: "prodi",      label: "Prodi",      render: (item) => item.mahasiswas?.[0]?.prodi      ?? "-" },
  { key: "mataKuliah", label: "Mata Kuliah",render: (item) => item.mahasiswas?.[0]?.mataKuliah ?? "-" },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
];

export default function IzinPraktikumUlang() {
  const navigate = useNavigate();

  return (
    <SuratPageLayout
      breadcrumb="Data Surat / Izin Praktikum Ulang"
      pageTitle="Data Surat Izin Praktikum Ulang"
      pageSubtitle="Informasi data surat izin praktikum ulang"
      cardTitle="Izin Praktikum Ulang"
      searchPlaceholder="Cari berdasarkan nama mahasiswa..."
      data={izinPraktikumUlangData}
      filterFn={(d, s) => d.mahasiswas?.some((m) => m.nama?.toLowerCase().includes(s.toLowerCase()))}
      columns={columns}
      getMobileCardProps={(item) => ({
        title: item.mahasiswas?.[0]?.nama ?? "-",
        subtitle: item.mahasiswas?.[0]?.nim ?? "-",
        status: item.status,
        fields: [
          ["No Surat", item.noSurat],
          ["Prodi", item.mahasiswas?.[0]?.prodi ?? "-"],
          ["Mata Kuliah", item.mahasiswas?.[0]?.mataKuliah ?? "-"],
        ],
      })}
      onTambah={() => navigate(`/pengajuan-surat/izin-praktikum-ulang`)}
      onView={(item) => navigate(`/data-surat/izin-praktikum-ulang/${item.id}`)}
      onEdit={(item) => navigate(`/pengajuan-surat/izin-praktikum-ulang/edit/${item.id}`)}
      onDelete={(item) => console.log("Delete", item.id)}
    />
  );
}