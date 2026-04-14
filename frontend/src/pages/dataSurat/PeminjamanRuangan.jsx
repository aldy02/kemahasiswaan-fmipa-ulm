import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuratPageLayout, StatusBadge } from "../../components/DataSuratComponents";
import { getSurats, deleteSurat } from "../../api/suratApi";

const columns = [
  { key: "noSurat", label: "No Surat" },
  { key: "organisasi", label: "Organisasi" },
  { key: "tempatKegiatan", label: "Tempat Kegiatan" },
  { key: "tanggalPinjam", label: "Tanggal Pinjam" },
  { key: "tanggalKembali", label: "Tanggal Kembali" },
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

export default function PeminjamanRuangan() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    getSurats()
      .then((res) => {
        const filtered = res.data.filter((s) => s.jenisSurat === "Peminjaman Ruangan");
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
      breadcrumb="Data Surat / Peminjaman Ruangan"
      pageTitle="Data Surat Peminjaman Ruangan"
      pageSubtitle="Informasi data surat peminjaman ruangan"
      cardTitle="Peminjaman Ruangan"
      searchPlaceholder="Cari berdasarkan nama organisasi..."
      data={data}
      loading={loading}
      error={error}
      filterFn={(d, s) => d.organisasi?.toLowerCase().includes(s.toLowerCase())}
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
      onDelete={handleDelete}
    />
  );
}