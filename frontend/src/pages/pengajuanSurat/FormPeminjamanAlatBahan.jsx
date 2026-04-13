// src/pages/pengajuanSurat/FormPeminjamanAlatBahan.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Package, Calendar, Info, Plus, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { getSuratById, createSurat, updateSurat } from "../../api/suratApi";
import { useAuth } from "../../contexts/AuthContext";
import SuccessModal from "../../components/SuccessModal";
import {
  FormField, FormGrid, FormLabel,
  FormTextInput, FormNumberInput, FormDateInput, FormTextarea,
  FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, KepemimpinanSection, PeopleGroupIcon,
  toFormDate,
} from "../../components/FormComponents";

const INIT_ERR = {
  noSurat:"", namaOrganisasi:"", namaKegiatan:"",
  namaPJ:"", kontakPJ:"", namaKetPelaksana:"", nimKetPelaksana:"",
  namaKetOrg:"", nimKetOrg:"", tanggalPinjam:"", tanggalKembali:"",
};

// ── Daftar Alat Section ───────────────────────────────────────────
function AlatBahanSection({ items, setItems, alatErrors, setAlatErrors }) {
  const add    = () => { setItems([...items,{nama:"",jumlah:""}]); setAlatErrors([...alatErrors,{nama:"",jumlah:""}]); };
  const remove = (i) => { setItems(items.filter((_,j)=>j!==i)); setAlatErrors(alatErrors.filter((_,j)=>j!==i)); };
  const upd    = (i,field,val) => {
    setItems(items.map((it,j)=>j===i?{...it,[field]:val}:it));
    setAlatErrors(alatErrors.map((e,j)=>j===i?{...e,[field]:""}:e));
  };

  return (
    <div className="flex flex-col gap-5">
      {items.map((it,i) => (
        <div key={i}>
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] lg:text-sm font-semibold text-primary-1">Item {i+1}</p>
            {items.length > 1 && (
              <button onClick={()=>remove(i)} className="w-7 h-7 flex items-center justify-center rounded-full bg-error-2 text-white hover:bg-red-500 transition-colors shrink-0">
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <FormGrid cols={2}>
            <FormField label="Nama Alat/Bahan" required error={alatErrors[i]?.nama}>
              <FormTextInput placeholder="Masukkan nama alat/bahan" value={it.nama} onChange={(v)=>upd(i,"nama",v)} error={alatErrors[i]?.nama} />
            </FormField>
            <FormField label="Jumlah" required error={alatErrors[i]?.jumlah}>
              <FormNumberInput placeholder="Masukkan jumlah" value={it.jumlah} onChange={(v)=>upd(i,"jumlah",v)} error={alatErrors[i]?.jumlah} />
            </FormField>
          </FormGrid>
          {i < items.length-1 && <hr className="border-slate-200 mt-5" />}
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-2 hover:bg-blue-600 text-white text-[13px] font-semibold rounded-xl transition-colors w-fit">
        <Plus size={14} /> Tambah
      </button>
    </div>
  );
}

export default function FormPeminjamanAlatBahan() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const { user } = useAuth();
  const isEdit   = Boolean(id);

  const [f, setF]               = useState({ noSurat:"", namaOrganisasi:"", namaKegiatan:"", namaPJ:"", kontakPJ:"", namaKetPelaksana:"", nimKetPelaksana:"", namaKetOrg:"", nimKetOrg:"", tanggalPinjam:"", tanggalKembali:"", keterangan:"" });
  const [errors, setErrors]     = useState(INIT_ERR);
  const [alatItems, setAlatItems]       = useState([{nama:"",jumlah:""}]);
  const [alatErrors, setAlatErrors]     = useState([{nama:"",jumlah:""}]);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [modal, setModal]       = useState(false);
  const [original, setOriginal] = useState(null);

  const set = (field) => (val) => {
    setF((p)=>({...p,[field]:val}));
    setErrors((p)=>({...p,[field]:""}));
  };

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getSuratById(id).then((res) => {
      const d = res.data; if (!d) return;
      setOriginal(d);
      setF({
        noSurat:          d.noSurat === "-" ? "" : d.noSurat || "",
        namaOrganisasi:   d.organisasi || "",
        namaKegiatan:     d.kegiatan || "",
        namaPJ:           d.penanggungJawab?.nama || "",
        kontakPJ:         d.penanggungJawab?.telp || "",
        namaKetPelaksana: d.ketuaPelaksana?.nama || "",
        nimKetPelaksana:  d.ketuaPelaksana?.nim || "",
        namaKetOrg:       d.ketuaOrganisasi?.nama || "",
        nimKetOrg:        d.ketuaOrganisasi?.nim || d.ketuaOrganisasi?.telp || "",
        tanggalPinjam:    toFormDate(d.tanggalPinjam),
        tanggalKembali:   toFormDate(d.tanggalKembali),
        keterangan:       d.keterangan || "",
      });
      if (d.daftarAlat?.length) {
        const parsed = d.daftarAlat.map((a) => {
          const last = (a.nama||"").lastIndexOf(" - ");
          return last === -1 ? {nama:a.nama||"",jumlah:""} : {nama:a.nama.slice(0,last).trim(),jumlah:a.nama.slice(last+3).trim()};
        });
        setAlatItems(parsed);
        setAlatErrors(parsed.map(()=>({nama:"",jumlah:""})));
      }
    }).finally(()=>setFetching(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = {...INIT_ERR}; let ok = true;
    const req = (key,label) => { if (!f[key]?.trim()) { e[key]=`${label} tidak boleh kosong.`; ok=false; } };
    req("noSurat","No surat"); req("namaOrganisasi","Nama organisasi"); req("namaKegiatan","Nama kegiatan");
    req("namaPJ","Nama penanggung jawab"); req("kontakPJ","Kontak penanggung jawab");
    req("namaKetPelaksana","Nama ketua pelaksana"); req("nimKetPelaksana","NIM ketua pelaksana");
    req("namaKetOrg","Nama ketua organisasi"); req("nimKetOrg","NIM ketua organisasi");
    if (!f.tanggalPinjam)  { e.tanggalPinjam  = "Tanggal pinjam tidak boleh kosong.";  ok=false; }
    if (!f.tanggalKembali) { e.tanggalKembali = "Tanggal kembali tidak boleh kosong."; ok=false; }
    setErrors(e);
    const ae = alatItems.map((a)=>({ nama:!a.nama?.trim()?"Nama alat/bahan tidak boleh kosong.":"", jumlah:!a.jumlah?.toString().trim()?"Jumlah tidak boleh kosong.":"" }));
    setAlatErrors(ae);
    if (ae.some((e)=>e.nama||e.jumlah)) ok=false;
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const daftarAlat = alatItems.map((a,i)=>({item:`Item ${i+1}`,nama:`${a.nama} - ${a.jumlah}`}));
      const payload = {
        noSurat: f.noSurat, organisasi: f.namaOrganisasi, kegiatan: f.namaKegiatan,
        penanggungJawab:{nama:f.namaPJ,telp:f.kontakPJ},
        ketuaPelaksana:{nama:f.namaKetPelaksana,nim:f.nimKetPelaksana},
        ketuaOrganisasi:{nama:f.namaKetOrg,telp:f.nimKetOrg},
        daftarAlat, tanggalPinjam:f.tanggalPinjam, tanggalKembali:f.tanggalKembali,
        keterangan:f.keterangan, updatedAt:new Date().toISOString(),
      };
      if (isEdit) await updateSurat(id,{...original,...payload});
      else await createSurat({...payload, jenisSurat:"Peminjaman Alat/Bahan", userId:user?.id, status:"Menunggu",
        tanggalPengajuan:new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"2-digit",year:"numeric"}).replace(/\//g,"-"),
        createdAt:new Date().toISOString()});
      setModal(true);
    } catch { alert("Terjadi kesalahan saat menyimpan data."); }
    finally { setLoading(false); }
  };

  const kepemimpinanGroups = [
    { label:"Penanggung Jawab", fields:[
      {label:"Nama Penanggung Jawab", placeholder:"Masukkan nama penanggung jawab", value:f.namaPJ, onChange:set("namaPJ"), error:errors.namaPJ},
      {label:"Kontak Penanggung Jawab", placeholder:"Masukkan nomor telepon", value:f.kontakPJ, onChange:set("kontakPJ"), error:errors.kontakPJ, type:"tel"},
    ]},
    { label:"Ketua Pelaksana", fields:[
      {label:"Nama Ketua Pelaksana", placeholder:"Masukkan nama ketua pelaksana", value:f.namaKetPelaksana, onChange:set("namaKetPelaksana"), error:errors.namaKetPelaksana},
      {label:"NIM Ketua Pelaksana", placeholder:"Masukkan NIM", value:f.nimKetPelaksana, onChange:set("nimKetPelaksana"), error:errors.nimKetPelaksana},
    ]},
    { label:"Ketua Organisasi", fields:[
      {label:"Nama Ketua Organisasi", placeholder:"Masukkan nama ketua organisasi", value:f.namaKetOrg, onChange:set("namaKetOrg"), error:errors.namaKetOrg},
      {label:"NIM Ketua Organisasi", placeholder:"Masukkan NIM", value:f.nimKetOrg, onChange:set("nimKetOrg"), error:errors.nimKetOrg},
    ]},
  ];

  const title    = isEdit ? "Ubah Surat Peminjaman Alat/Bahan" : "Pengajuan Surat Peminjaman Alat/Bahan";
  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman alat/bahan";

  if (fetching) return <MainLayout><div className="p-8 text-sm text-slate-400">Memuat data...</div></MainLayout>;

  const sections = [
    <FormCard key="surat" icon={<FileText size={18} />} title="Informasi Surat" subtitle="Masukkan informasi terkait nomor surat pengajuan">
      <FormField label="No Surat" required error={errors.noSurat}>
        <FormTextInput placeholder="Masukkan no surat" value={f.noSurat} onChange={set("noSurat")} error={errors.noSurat} />
      </FormField>
    </FormCard>,

    <FormCard key="org" icon={<PeopleGroupIcon size={18} />} title="Detail Organisasi & Kegiatan" subtitle="Informasi mengenai organisasi dan kegiatan yang akan dilaksanakan">
      <FormGrid cols={2}>
        <FormField label="Nama Organisasi" required error={errors.namaOrganisasi}>
          <FormTextInput placeholder="Masukkan nama organisasi" value={f.namaOrganisasi} onChange={set("namaOrganisasi")} error={errors.namaOrganisasi} />
        </FormField>
        <FormField label="Nama Kegiatan" required error={errors.namaKegiatan}>
          <FormTextInput placeholder="Masukkan nama kegiatan" value={f.namaKegiatan} onChange={set("namaKegiatan")} error={errors.namaKegiatan} />
        </FormField>
      </FormGrid>
    </FormCard>,

    <FormCard key="pimpin" icon={<Package size={18} />} title="Informasi Kepemimpinan" subtitle="Data penanggung jawab, ketua organisasi, dan ketua pelaksana">
      <KepemimpinanSection groups={kepemimpinanGroups} />
    </FormCard>,

    <FormCard key="alat" icon={<Package size={18} />} title="Detail Alat/Bahan" subtitle="Informasi alat atau bahan yang akan dipinjam">
      <AlatBahanSection items={alatItems} setItems={setAlatItems} alatErrors={alatErrors} setAlatErrors={setAlatErrors} />
    </FormCard>,

    <FormCard key="jadwal" icon={<Calendar size={18} />} title="Jadwal Peminjaman" subtitle="Tentukan tanggal peminjaman dan pengembalian alat/bahan">
      <FormGrid cols={2}>
        <FormField label="Tanggal Pinjam"  required error={errors.tanggalPinjam}>
          <FormDateInput value={f.tanggalPinjam}  onChange={set("tanggalPinjam")}  error={errors.tanggalPinjam} />
        </FormField>
        <FormField label="Tanggal Kembali" required error={errors.tanggalKembali}>
          <FormDateInput value={f.tanggalKembali} onChange={set("tanggalKembali")} error={errors.tanggalKembali} />
        </FormField>
      </FormGrid>
    </FormCard>,

    <FormCard key="info" icon={<Info size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait peminjaman">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={f.keterangan} onChange={set("keterangan")} />
    </FormCard>,
  ];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Peminjaman Alat/Bahan" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Peminjaman Alat/Bahan" subtitle={subtitle} footer={<FormDesktopFooter onSubmit={handleSubmit} loading={loading} />}>
          {sections}
        </FormDesktopPanel>
        <FormMobileCards>{sections}</FormMobileCards>
        <FormMobileFooter onSubmit={handleSubmit} loading={loading} />
      </div>
      <SuccessModal isOpen={modal} message={isEdit ? "Perubahan Berhasil Disimpan!" : "Surat Berhasil Dikirim!"}
        onOk={()=>navigate("/data-surat/peminjaman-alat-bahan")}
        onClose={()=>{setModal(false);setF({noSurat:"",namaOrganisasi:"",namaKegiatan:"",namaPJ:"",kontakPJ:"",namaKetPelaksana:"",nimKetPelaksana:"",namaKetOrg:"",nimKetOrg:"",tanggalPinjam:"",tanggalKembali:"",keterangan:""});setErrors(INIT_ERR);setAlatItems([{nama:"",jumlah:""}]);}} />
    </MainLayout>
  );
}