// src/pages/Keterangan.jsx
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { keteranganData } from "../../test/data";

const columns = [
  { key: "noSurat",   label: "No Surat" },
  { key: "nama",      label: "Nama" },
  { key: "nim",       label: "NIM" },
  { key: "prodi",     label: "Prodi" },
  { key: "keperluan", label: "Keperluan", render: (item) => <span className="block max-w-50 truncate">{item.keperluan}</span> },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
];

export default function Keterangan() {
  const navigate = useNavigate();

  return (
    <SuratPageLayout
      breadcrumb="Data Surat / Keterangan"
      pageTitle="Data Surat Keterangan"
      pageSubtitle="Informasi data surat keterangan"
      cardTitle="Keterangan"
      searchPlaceholder="Cari berdasarkan nama mahasiswa..."
      data={keteranganData}
      filterFn={(d, s) => d.nama.toLowerCase().includes(s.toLowerCase())}
      columns={columns}
      getMobileCardProps={(item) => ({
        title: item.nama,
        subtitle: item.nim,
        status: item.status,
        fields: [
          ["No Surat", item.noSurat],
          ["Program Studi", item.prodi],
          ["Keperluan", item.keperluan],
        ],
      })}
      onTambah={() => navigate(`/pengajuan-surat/keterangan`)}
      onView={(item) => navigate(`/data-surat/keterangan/${item.id}`)}
      onEdit={(item) => navigate(`/pengajuan-surat/keterangan/edit/${item.id}`)}
      onDelete={(item) => console.log("Delete", item.id)}
    />
  );
}