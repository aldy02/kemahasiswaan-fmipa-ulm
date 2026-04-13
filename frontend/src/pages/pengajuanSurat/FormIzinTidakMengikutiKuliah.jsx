// src/pages/pengajuanSurat/FormIzinTidakMengikutiKuliah.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, GraduationCap, CalendarDays, Info, MessageSquare, Plus, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { getSuratById, createSurat, updateSurat } from "../../api/suratApi";
import { useAuth } from "../../contexts/AuthContext";
import SuccessModal from "../../components/SuccessModal";
import {
  FormField, FormGrid, FormLabel,
  FormTextInput, FormSelectInput, FormDateInput, FormTextarea,
  FormCard, FormPageHeader, FormDesktopPanel, FormMobileCards,
  FormDesktopFooter, FormMobileFooter, toFormDate,
} from "../../components/FormComponents";

const PRODI_OPTIONS = ["S1 Matematika","S1 Statistika","S1 Fisika","S1 Kimia","S1 Biologi","S1 Ilmu Komputer","S1 Farmasi"];
const EMPTY_MHS     = [{nim:"",nama:"",mataKuliah:"",prodi:""}];
const INIT_ERR      = {namaDosen:"",mataKuliah:"",prodiDosen:"",tanggalMulai:"",tanggalAkhir:"",sebab:"",tempat:""};

// ── Mahasiswa Section ─────────────────────────────────────────────
function MahasiswaSection({ items, setItems, mhsErrors, setMhsErrors }) {
  const add    = () => { setItems([...items,{nim:"",nama:"",mataKuliah:"",prodi:""}]); setMhsErrors([...mhsErrors,{nim:"",nama:"",mataKuliah:"",prodi:""}]); };
  const remove = (i) => { setItems(items.filter((_,j)=>j!==i)); setMhsErrors(mhsErrors.filter((_,j)=>j!==i)); };
  const upd    = (i,field,val) => {
    setItems(items.map((it,j)=>j===i?{...it,[field]:val}:it));
    setMhsErrors(mhsErrors.map((e,j)=>j===i?{...e,[field]:""}:e));
  };

  return (
    <div className="flex flex-col gap-5">
      {items.map((it,i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] lg:text-sm font-semibold text-primary-1">Mahasiswa {i+1}</p>
            {items.length > 1 && (
              <button onClick={()=>remove(i)} className="w-7 h-7 flex items-center justify-center rounded-full bg-error-2 text-white hover:bg-red-500 transition-colors shrink-0">
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>
          {/* Desktop: 4 kolom */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-3">
            {[{l:"NIM Mahasiswa",p:"Masukkan NIM",fk:"nim"},{l:"Nama Mahasiswa",p:"Masukkan nama",fk:"nama"},{l:"Mata Kuliah",p:"Masukkan mata kuliah",fk:"mataKuliah"}].map(({l,p,fk})=>(
              <FormField key={fk} label={l} required error={mhsErrors[i]?.[fk]}>
                <FormTextInput placeholder={p} value={it[fk]} onChange={(v)=>upd(i,fk,v)} error={mhsErrors[i]?.[fk]} />
              </FormField>
            ))}
            <FormField label="Program Studi" required error={mhsErrors[i]?.prodi}>
              <FormSelectInput placeholder="Pilih prodi" value={it.prodi} onChange={(v)=>upd(i,"prodi",v)} options={PRODI_OPTIONS} error={mhsErrors[i]?.prodi} />
            </FormField>
          </div>
          {/* Mobile: stacked */}
          <div className="lg:hidden flex flex-col gap-3">
            {[{l:"NIM Mahasiswa",p:"Masukkan NIM",fk:"nim"},{l:"Nama Mahasiswa",p:"Masukkan nama",fk:"nama"},{l:"Mata Kuliah",p:"Masukkan mata kuliah",fk:"mataKuliah"}].map(({l,p,fk})=>(
              <FormField key={fk} label={l} required error={mhsErrors[i]?.[fk]}>
                <FormTextInput placeholder={p} value={it[fk]} onChange={(v)=>upd(i,fk,v)} error={mhsErrors[i]?.[fk]} />
              </FormField>
            ))}
            <FormField label="Program Studi" required error={mhsErrors[i]?.prodi}>
              <FormSelectInput placeholder="Pilih prodi" value={it.prodi} onChange={(v)=>upd(i,"prodi",v)} options={PRODI_OPTIONS} error={mhsErrors[i]?.prodi} />
            </FormField>
          </div>
          {i < items.length-1 && <hr className="border-slate-200 mt-5" />}
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-2 hover:bg-blue-600 text-white text-[13px] font-semibold rounded-xl transition-colors w-fit">
        <Plus size={14} /> Tambah
      </button>
    </div>
  );
}

export default function FormIzinTidakMengikutiKuliah() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const { user } = useAuth();
  const isEdit   = Boolean(id);

  const [mhsItems, setMhsItems]     = useState(EMPTY_MHS);
  const [mhsErrors, setMhsErrors]   = useState([{nim:"",nama:"",mataKuliah:"",prodi:""}]);
  const [f, setF]                   = useState({namaDosen:"",mataKuliah:"",prodiDosen:"",tanggalMulai:"",tanggalAkhir:"",sebab:"",tempat:"",keterangan:""});
  const [errors, setErrors]         = useState(INIT_ERR);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(isEdit);
  const [modal, setModal]           = useState(false);
  const [original, setOriginal]     = useState(null);

  const set = (field) => (val) => { setF((p)=>({...p,[field]:val})); setErrors((p)=>({...p,[field]:""})); };

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getSuratById(id).then((res) => {
      const d = res.data; if (!d) return;
      setOriginal(d);
      const mhs = d.mahasiswas?.length ? d.mahasiswas.map((m)=>({nim:m.nim||"",nama:m.nama||"",mataKuliah:m.mataKuliah||"",prodi:m.prodi||""})) : EMPTY_MHS;
      setMhsItems(mhs); setMhsErrors(mhs.map(()=>({nim:"",nama:"",mataKuliah:"",prodi:""})));
      setF({ namaDosen:d.namaDosen||"", mataKuliah:d.mataKuliah||"", prodiDosen:d.prodiDosen||"",
             tanggalMulai:toFormDate(d.tanggalMulai), tanggalAkhir:toFormDate(d.tanggalAkhir),
             sebab:d.sebab||"", tempat:d.tempat||"", keterangan:d.keterangan||"" });
    }).finally(()=>setFetching(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = {...INIT_ERR}; let ok = true;
    const req = (key,label) => { if (!f[key]?.trim()) { e[key]=`${label} tidak boleh kosong.`; ok=false; } };
    req("namaDosen","Nama dosen"); req("mataKuliah","Mata kuliah");
    req("sebab","Sebab"); req("tempat","Tempat");
    if (!f.prodiDosen)   { e.prodiDosen="Program studi tidak boleh kosong."; ok=false; }
    if (!f.tanggalMulai) { e.tanggalMulai="Tanggal mulai tidak boleh kosong."; ok=false; }
    if (!f.tanggalAkhir) { e.tanggalAkhir="Tanggal akhir tidak boleh kosong."; ok=false; }
    setErrors(e);
    const ae = mhsItems.map((m)=>({
      nim:       !m.nim?.trim()?"NIM tidak boleh kosong.":"",
      nama:      !m.nama?.trim()?"Nama tidak boleh kosong.":"",
      mataKuliah:!m.mataKuliah?.trim()?"Mata kuliah tidak boleh kosong.":"",
      prodi:     !m.prodi?"Program studi tidak boleh kosong.":"",
    }));
    setMhsErrors(ae);
    if (ae.some((e)=>e.nim||e.nama||e.mataKuliah||e.prodi)) ok=false;
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { mahasiswas:mhsItems, namaDosen:f.namaDosen, mataKuliah:f.mataKuliah, prodiDosen:f.prodiDosen,
        tanggalMulai:f.tanggalMulai, tanggalAkhir:f.tanggalAkhir, sebab:f.sebab, tempat:f.tempat,
        keterangan:f.keterangan, updatedAt:new Date().toISOString() };
      if (isEdit) await updateSurat(id,{...original,...payload});
      else await createSurat({...payload, jenisSurat:"Izin Tidak Mengikuti Kuliah", userId:user?.id, status:"Menunggu",
        tanggalPengajuan:new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"2-digit",year:"numeric"}).replace(/\//g,"-"),
        createdAt:new Date().toISOString()});
      setModal(true);
    } catch { alert("Terjadi kesalahan saat menyimpan data."); }
    finally { setLoading(false); }
  };

  const reset = () => { setMhsItems(EMPTY_MHS); setMhsErrors([{nim:"",nama:"",mataKuliah:"",prodi:""}]); setF({namaDosen:"",mataKuliah:"",prodiDosen:"",tanggalMulai:"",tanggalAkhir:"",sebab:"",tempat:"",keterangan:""}); setErrors(INIT_ERR); };

  const title    = isEdit ? "Ubah Surat Izin Tidak Mengikuti Kuliah" : "Pengajuan Surat Izin Tidak Mengikuti Kuliah";
  const subtitle = "Silakan lengkapi formulir di bawah ini untuk mengajukan izin tidak mengikuti kuliah";

  if (fetching) return <MainLayout><div className="p-8 text-sm text-slate-400">Memuat data...</div></MainLayout>;

  const sections = [
    <FormCard key="mhs" icon={<Users size={18} />} title="Data Mahasiswa" subtitle="Informasi lengkap mahasiswa yang mengajukan izin tidak mengikuti kuliah">
      <MahasiswaSection items={mhsItems} setItems={setMhsItems} mhsErrors={mhsErrors} setMhsErrors={setMhsErrors} />
    </FormCard>,

    <FormCard key="mk" icon={<GraduationCap size={18} />} title="Informasi Mata Kuliah" subtitle="Data mata kuliah dan dosen pengampu yang akan ditinggalkan">
      <FormGrid cols={3}>
        <FormField label="Nama Dosen" required error={errors.namaDosen}>
          <FormTextInput placeholder="Masukkan nama dosen" value={f.namaDosen} onChange={set("namaDosen")} error={errors.namaDosen} />
        </FormField>
        <FormField label="Mata Kuliah" required error={errors.mataKuliah}>
          <FormTextInput placeholder="Masukkan mata kuliah" value={f.mataKuliah} onChange={set("mataKuliah")} error={errors.mataKuliah} />
        </FormField>
        <FormField label="Program Studi" required error={errors.prodiDosen}>
          <FormSelectInput placeholder="Pilih program studi" value={f.prodiDosen} onChange={set("prodiDosen")} options={PRODI_OPTIONS} error={errors.prodiDosen} />
        </FormField>
      </FormGrid>
    </FormCard>,

    <FormCard key="jadwal" icon={<CalendarDays size={18} />} title="Jadwal Izin" subtitle="Tentukan periode waktu izin tidak mengikuti kuliah">
      <FormGrid cols={2}>
        <FormField label="Tanggal Mulai" required error={errors.tanggalMulai}>
          <FormDateInput value={f.tanggalMulai} onChange={set("tanggalMulai")} error={errors.tanggalMulai} />
        </FormField>
        <FormField label="Tanggal Akhir" required error={errors.tanggalAkhir}>
          <FormDateInput value={f.tanggalAkhir} onChange={set("tanggalAkhir")} error={errors.tanggalAkhir} />
        </FormField>
      </FormGrid>
    </FormCard>,

    <FormCard key="alasan" icon={<Info size={18} />} title="Alasan & Tempat Izin" subtitle="Sebab dan lokasi terkait izin tidak mengikuti kuliah">
      <FormGrid cols={2}>
        <FormField label="Sebab" required error={errors.sebab}>
          <FormTextarea placeholder="Masukkan alasan tidak mengikuti kuliah" value={f.sebab} onChange={(v)=>{set("sebab")(v);}} rows={3} error={errors.sebab} />
        </FormField>
        <FormField label="Tempat" required error={errors.tempat}>
          <FormTextarea placeholder="Masukkan lokasi/tempat tujuan" value={f.tempat} onChange={(v)=>{set("tempat")(v);}} rows={3} error={errors.tempat} />
        </FormField>
      </FormGrid>
    </FormCard>,

    <FormCard key="ket" icon={<MessageSquare size={18} />} title="Informasi Tambahan" subtitle="Catatan atau keterangan tambahan terkait izin tidak mengikuti kuliah">
      <FormLabel>Keterangan</FormLabel>
      <FormTextarea placeholder="Masukkan keterangan tambahan jika diperlukan" value={f.keterangan} onChange={set("keterangan")} />
    </FormCard>,
  ];

  return (
    <MainLayout>
      <FormPageHeader breadcrumb="Pengajuan Surat / Izin Tidak Mengikuti Kuliah" title={title} subtitle={subtitle} />
      <div className="hidden lg:block h-6" />
      <div className="mx-0 lg:mx-8 pb-10">
        <FormDesktopPanel title="Form Izin Tidak Mengikuti Kuliah" subtitle={subtitle} footer={<FormDesktopFooter onSubmit={handleSubmit} loading={loading} />}>
          {sections}
        </FormDesktopPanel>
        <FormMobileCards>{sections}</FormMobileCards>
        <FormMobileFooter onSubmit={handleSubmit} loading={loading} />
      </div>
      <SuccessModal isOpen={modal} message={isEdit ? "Perubahan Berhasil Disimpan!" : "Surat Berhasil Dikirim!"}
        onOk={()=>navigate("/data-surat/izin-tidak-mengikuti-kuliah")}
        onClose={()=>{setModal(false);reset();}} />
    </MainLayout>
  );
}