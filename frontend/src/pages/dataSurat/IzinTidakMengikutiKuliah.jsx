import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { getSurats, deleteSurat } from "../../api/suratApi";

const columns = [
  { key: "noSurat", label: "No Surat" },
  { key: "nama", label: "Nama", render: (item) => item.mahasiswas?.[0]?.nama ?? "-" },
  { key: "nim", label: "NIM", render: (item) => item.mahasiswas?.[0]?.nim ?? "-" },
  { key: "prodi", label: "Prodi", render: (item) => item.mahasiswas?.[0]?.prodi ?? "-" },
  { key: "mataKuliah", label: "Mata Kuliah" },
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

export default function IzinTidakMengikutiKuliah() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    getSurats()
      .then((res) => {
        const filtered = res.data.filter((s) => s.jenisSurat === "Izin Tidak Mengikuti Kuliah");
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
      breadcrumb="Data Surat / Izin Tidak Mengikuti Kuliah"
      pageTitle="Data Surat Izin Tidak Mengikuti Kuliah"
      pageSubtitle="Informasi data surat izin tidak mengikuti kuliah"
      cardTitle="Izin Tidak Mengikuti Kuliah"
      searchPlaceholder="Cari berdasarkan nama mahasiswa..."
      data={data}
      loading={loading}
      error={error}
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
      onDelete={handleDelete}
    />
  );
}