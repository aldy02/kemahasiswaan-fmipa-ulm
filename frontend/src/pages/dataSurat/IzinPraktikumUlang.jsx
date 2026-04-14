import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { getSurats, deleteSurat } from "../../api/suratApi";

const columns = [
  { key: "noSurat", label: "No Surat" },
  { key: "nama", label: "Nama", render: (item) => item.mahasiswas?.[0]?.nama ?? "-" },
  { key: "nim", label: "NIM", render: (item) => item.mahasiswas?.[0]?.nim ?? "-" },
  { key: "prodi", label: "Prodi", render: (item) => item.mahasiswas?.[0]?.prodi ?? "-" },
  { key: "mataKuliah", label: "Mata Kuliah", render: (item) => item.mahasiswas?.[0]?.mataKuliah ?? "-" },
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

export default function IzinPraktikumUlang() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    getSurats()
      .then((res) => {
        const filtered = res.data.filter((s) => s.jenisSurat === "Izin Praktikum Ulang");
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
      breadcrumb="Data Surat / Izin Praktikum Ulang"
      pageTitle="Data Surat Izin Praktikum Ulang"
      pageSubtitle="Informasi data surat izin praktikum ulang"
      cardTitle="Izin Praktikum Ulang"
      searchPlaceholder="Cari berdasarkan nama mahasiswa..."
      data={data}
      loading={loading}
      error={error}
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
      onDelete={handleDelete}
    />
  );
}