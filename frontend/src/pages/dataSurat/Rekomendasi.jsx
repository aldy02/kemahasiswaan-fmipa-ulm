import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { getSurats, deleteSurat } from "../../api/suratApi";

const columns = [
  { key: "noSurat", label: "No Surat" },
  { key: "nama", label: "Nama" },
  { key: "nim", label: "NIM" },
  { key: "prodi", label: "Prodi" },
  { key: "tanggalPengajuan", label: "Tanggal Pengajuan" },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
];

const sortByNewest = (arr) => {
  const parseDate = (str) => {
    if (!str) return 0;
    const [d, m, y] = str.split("-");
    return new Date(`${y}-${m}-${d}`).getTime();
  };
  return [...arr].sort((a, b) => parseDate(b.tanggalPengajuan) - parseDate(a.tanggalPengajuan));
};

export default function Rekomendasi() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    getSurats()
      .then((res) => {
        const filtered = res.data.filter((s) => s.jenisSurat === "Rekomendasi");
        setData(sortByNewest(filtered));
      })
      .catch(() => setError("Gagal memuat data. Periksa koneksi Anda."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (item) => {
    await deleteSurat(item.id);
    fetchData();
  };

  return (
    <SuratPageLayout
      breadcrumb="Data Surat / Rekomendasi"
      pageTitle="Data Surat Rekomendasi"
      pageSubtitle="Informasi data surat rekomendasi"
      cardTitle="Rekomendasi"
      searchPlaceholder="Cari berdasarkan nama mahasiswa..."
      data={data}
      loading={loading}
      error={error}
      filterFn={(d, s) => d.nama?.toLowerCase().includes(s.toLowerCase())}
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
      onDelete={handleDelete}
    />
  );
}