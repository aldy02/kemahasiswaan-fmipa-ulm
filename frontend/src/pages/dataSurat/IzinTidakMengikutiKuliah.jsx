// src/pages/IzinTidakMengikutiKuliah.jsx
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { izinTidakMengikutiKuliahData } from "../../test/data";

const columns = [
  { key: "noSurat",    label: "No Surat" },
  { key: "nama",       label: "Nama",  render: (item) => item.mahasiswas?.[0]?.nama  ?? "-" },
  { key: "nim",        label: "NIM",   render: (item) => item.mahasiswas?.[0]?.nim   ?? "-" },
  { key: "prodi",      label: "Prodi", render: (item) => item.mahasiswas?.[0]?.prodi ?? "-" },
  { key: "mataKuliah", label: "Mata Kuliah" },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
];

export default function IzinTidakMengikutiKuliah() {
  const navigate = useNavigate();

  return (
    <SuratPageLayout
      breadcrumb="Data Surat / Izin Tidak Mengikuti Kuliah"
      pageTitle="Data Surat Izin Tidak Mengikuti Kuliah"
      pageSubtitle="Informasi data surat izin tidak mengikuti kuliah"
      cardTitle="Izin Tidak Mengikuti Kuliah"
      searchPlaceholder="Cari berdasarkan nama mahasiswa..."
      data={izinTidakMengikutiKuliahData}
      filterFn={(d, s) => d.mahasiswas?.[0]?.nama?.toLowerCase().includes(s.toLowerCase())}
      columns={columns}
      getMobileCardProps={(item) => ({
        title: item.mahasiswas?.[0]?.nama ?? "-",
        subtitle: item.mahasiswas?.[0]?.nim ?? "-",
        status: item.status,
        fields: [
          ["No Surat", item.noSurat],
          ["Program Studi", item.mahasiswas?.[0]?.prodi ?? "-"],
          ["Mata Kuliah", item.mataKuliah],
        ],
      })}
      onTambah={() => navigate(`/pengajuan-surat/izin-tidak-mengikuti-kuliah`)}
      onView={(item) => navigate(`/data-surat/izin-tidak-mengikuti-kuliah/${item.id}`)}
      onEdit={(item) => navigate(`/pengajuan-surat/izin-tidak-mengikuti-kuliah/edit/${item.id}`)}
      onDelete={(item) => console.log("Delete", item.id)}
    />
  );
}