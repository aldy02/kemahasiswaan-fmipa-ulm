// src/pages/KeteranganMahasiswaKuliah.jsx
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { keteranganMahasiswaKuliahData } from "../../test/data";

const columns = [
  { key: "noSurat",          label: "No Surat" },
  { key: "nama",             label: "Nama" },
  { key: "nim",              label: "NIM" },
  { key: "prodi",            label: "Prodi" },
  { key: "tanggalPengajuan", label: "Tanggal Pengajuan" },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
];

export default function KeteranganMahasiswaKuliah() {
  const navigate = useNavigate();

  return (
    <SuratPageLayout
      breadcrumb="Data Surat / Keterangan Mahasiswa Kuliah"
      pageTitle="Data Surat Keterangan Mahasiswa Kuliah"
      pageSubtitle="Informasi data surat keterangan mahasiswa kuliah"
      cardTitle="Keterangan Mahasiswa Kuliah"
      searchPlaceholder="Cari berdasarkan nama mahasiswa..."
      data={keteranganMahasiswaKuliahData}
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
      onTambah={() => navigate(`/pengajuan-surat/keterangan-mahasiswa-kuliah`)}
      onView={(item) => navigate(`/data-surat/keterangan-mahasiswa-kuliah/${item.id}`)}
      onEdit={(item)  => navigate(`/pengajuan-surat/keterangan-mahasiswa-kuliah/edit/${item.id}`)}
      onDelete={(item) => console.log("Delete", item.id)}
    />
  );
}