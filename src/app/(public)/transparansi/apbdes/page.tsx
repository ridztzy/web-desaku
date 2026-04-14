import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getApbdes } from "@/lib/sheets";

export const metadata: Metadata = {
  title: "Transparansi APBDes Wringinanom - Wringinanom",
  description:
    "Laporan Realisasi Anggaran Pendapatan dan Belanja Desa (APBDes) Wringinanom yang transparan dan akuntabel.",
};

// Data statis telah dihapus sesuai permintaan.

function formatRupiah(number: number | any) {
  try {
    const num = typeof number === "number" ? number : Number(number) || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    return "Rp 0,00";
  }
}

export default async function ApbdesPage({
  searchParams,
}: {
  searchParams: Promise<{ tahun?: string }>;
}) {
  try {
    const fetchedData = await getApbdes();

    if (!fetchedData || fetchedData.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-32 pb-32 text-center">
          <span className="material-symbols-outlined text-7xl text-stone-300 mb-6 block">
            folder_off
          </span>
          <h1 className="text-3xl font-extrabold text-stone-400 font-headline">
            Laporan Belum Tersedia.
          </h1>
          <p className="mt-4 text-stone-500">
            Pemerintah Desa belum mengunggah dokumen APBDes.
          </p>
        </div>
      );
    }

    // Mengurutkan data berdasarkan tahun terbaru (Z-A)
    // Membuat copy dari data untuk menghindari error "Cannot assign to read only property" jika object di-freeze oleh cache Next.js
    const sortedData = [...fetchedData].sort(
      (a, b) => Number(b.tahun_anggaran) - Number(a.tahun_anggaran),
    );

    const params = await searchParams; // Wait safely for searchParams in Next.js 15
    const selectedYear = params?.tahun || sortedData[0]?.tahun_anggaran;
    const data =
      sortedData.find((d) => d.tahun_anggaran === selectedYear) ||
      sortedData[0];

    if (!data) throw new Error("Data APBDes setelah diurutkan kosong");

    const availableYears = sortedData.map((d) => d.tahun_anggaran);

    // Kalkulasi persentase untuk progress bar/chart dengan aman
    const pendTotal = data.total_pendapatan || 1; // hindari pembagian dengan nol
    const pendDanaDesaPct = (data.pend_dana_desa / pendTotal) * 100 || 0;
    const pendAddPct = (data.pend_add / pendTotal) * 100 || 0;
    const pendBantuanKabPct = (data.pend_bantuan_kab / pendTotal) * 100 || 0;
    const pendBagiHasilPct = (data.pend_bagi_hasil / pendTotal) * 100 || 0;
    const pendPadesPct = (data.pend_pades / pendTotal) * 100 || 0;
    const pendLainPct = (data.pend_lain_lain / pendTotal) * 100 || 0;

    const belTotal = data.total_belanja || 1; // hindari pembagian dengan nol
    const belPembangunanPct = (data.bel_pembangunan / belTotal) * 100 || 0;
    const belPemerintahanPct = (data.bel_pemerintahan / belTotal) * 100 || 0;
    const belPembinaanPct = (data.bel_pembinaan / belTotal) * 100 || 0;
    const belBencanaPct = (data.bel_bencana / belTotal) * 100 || 0;
    const belPemberdayaanPct = (data.bel_pemberdayaan / belTotal) * 100 || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-16 pb-20 md:pb-32">
      {/* Page Header */}
      <header className="mb-12 md:mb-16 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-tertiary-container text-on-tertiary-container px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 md:mb-6 font-label">
          Transparansi Publik
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tighter leading-tight font-headline mb-4 md:mb-6">
          Transparansi APBDes Wringinanom{" "}
          <span className="text-on-surface">{data.tahun_anggaran}.</span>
        </h1>
        <p className="text-sm md:text-lg text-on-surface-variant leading-relaxed mb-6">
          Pemerintah Desa Wringinanom, Kecamatan Tongas berkomitmen penuh untuk
          mewujudkan tata kelola keuangan desa yang transparan, akuntabel, dan
          partisipatif. Berikut adalah Laporan Realisasi Anggaran Pendapatan dan
          Belanja Desa (APBDes) Wringinanom untuk Tahun Anggaran{" "}
          {data.tahun_anggaran}.
        </p>

        {/* Dropdown Pemilihan Tahun */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-sm font-bold text-on-surface-variant">
            Pilih Tahun Anggaran:
          </span>
          <div className="relative">
            {/* Kita menggunakan form method GET agar UI tetap Server Component Friendly */}
            <form
              action="/transparansi/apbdes"
              method="GET"
              className="flex items-center gap-2"
            >
              <select
                name="tahun"
                defaultValue={data.tahun_anggaran}
                className="bg-surface-container border border-outline-variant/30 text-on-surface text-sm rounded-xl focus:ring-primary focus:border-primary block w-32 p-2 font-bold cursor-pointer"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                Lihat
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="space-y-12 md:space-y-20">
        {/* Section 1: Ringkasan Realisasi APBDes */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-600 p-6 md:p-8 rounded-3xl relative overflow-hidden text-white shadow-lg">
              <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[8rem] text-white/10 select-none pointer-events-none">
                account_balance_wallet
              </span>
              <p className="text-sm font-bold text-emerald-100 tracking-widest uppercase mb-2 font-label">
                Total Pendapatan
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black font-headline tracking-tighter break-words">
                {formatRupiah(data.total_pendapatan)}
              </h3>
              <div className="w-12 h-1 bg-white/30 rounded-full mt-6"></div>
            </div>

            <div className="bg-rose-600 p-6 md:p-8 rounded-3xl relative overflow-hidden text-white shadow-lg">
              <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[8rem] text-white/10 select-none pointer-events-none">
                shopping_cart
              </span>
              <p className="text-sm font-bold text-rose-100 tracking-widest uppercase mb-2 font-label">
                Total Belanja
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black font-headline tracking-tighter break-words">
                {formatRupiah(data.total_belanja)}
              </h3>
              <div className="w-12 h-1 bg-white/30 rounded-full mt-6"></div>
            </div>

            <div className="bg-blue-600 p-6 md:p-8 rounded-3xl relative overflow-hidden text-white shadow-lg">
              <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[8rem] text-white/10 select-none pointer-events-none">
                savings
              </span>
              <p className="text-sm font-bold text-blue-100 tracking-widest uppercase mb-2 font-label">
                SiLPA
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black font-headline tracking-tighter break-words">
                {formatRupiah(data.silpa)}
              </h3>
              <p className="text-xs text-blue-100 mt-2">
                Sisa Lebih Perhitungan Anggaran
              </p>
              <div className="w-12 h-1 bg-white/30 rounded-full mt-2"></div>
            </div>
          </div>
        </section>

        {/* Section 2: Rincian Pendapatan Desa */}
        <section className="bg-surface-container-low p-6 md:p-10 rounded-3xl border border-outline-variant/30">
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-primary">
              payments
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-headline">
              Rincian Pendapatan Desa
            </h2>
          </div>
          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
            Dari total realisasi pendapatan sebesar{" "}
            {formatRupiah(data.total_pendapatan)}, dana desa ditopang oleh
            beberapa sumber utama penghasilan. Proporsi terbesar berasal dari
            pembiayaan Pemerintah Pusat.
          </p>

          <div className="space-y-6">
            {/* Item Pendapatan */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/3 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Dana Desa (Pusat)
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pend_dana_desa)}
                </span>
              </div>
              <div className="w-full md:w-2/3 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${pendDanaDesaPct}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold w-12 text-right">
                  {pendDanaDesaPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/3 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Alokasi Dana Desa (ADD)
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pend_add)}
                </span>
              </div>
              <div className="w-full md:w-2/3 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-teal-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${pendAddPct}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold w-12 text-right">
                  {pendAddPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/3 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Bantuan Keuangan Kabupaten/Kota
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pend_bantuan_kab)}
                </span>
              </div>
              <div className="w-full md:w-2/3 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${pendBantuanKabPct}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold w-12 text-right">
                  {pendBantuanKabPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/3 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Bagi Hasil Pajak & Retribusi
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pend_bagi_hasil)}
                </span>
              </div>
              <div className="w-full md:w-2/3 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-orange-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${pendBagiHasilPct}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold w-12 text-right">
                  {pendBagiHasilPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/3 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Pendapatan Asli Desa (PADes)
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pend_pades)}
                </span>
              </div>
              <div className="w-full md:w-2/3 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-pink-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${pendPadesPct}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold w-12 text-right">
                  {pendPadesPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/3 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Pendapatan Lain-lain
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pend_lain_lain)}
                </span>
              </div>
              <div className="w-full md:w-2/3 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-stone-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${pendLainPct}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold w-12 text-right">
                  {pendLainPct.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Rincian Belanja Desa */}
        <section className="bg-surface-container-low p-6 md:p-10 rounded-3xl border border-outline-variant/30">
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-rose-600">
              receipt_long
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-headline">
              Rincian Belanja Desa
            </h2>
          </div>
          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
            Pemanfaatan dana desa Wringinanom sebesar{" "}
            {formatRupiah(data.total_belanja)} direalisasikan secara tepat
            sasaran ke dalam 5 bidang utama. Porsi terbesar digunakan untuk
            pembangunan desa guna mendukung kesejahteraan dan infrastruktur
            masyarakat.
          </p>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-5/12 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Pembangunan Desa{" "}
                  <span className="text-rose-600 text-xs ml-1">
                    (Fokus Infrastruktur)
                  </span>
                </span>
                <span className="font-black text-lg text-rose-700">
                  {formatRupiah(data.bel_pembangunan)}
                </span>
              </div>
              <div className="w-full md:w-7/12 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-8 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-500 h-full flex items-center justify-end px-3 transition-all duration-1000 ease-out"
                    style={{ width: `${belPembangunanPct}%` }}
                  >
                    <span className="text-xs font-bold text-white tracking-widest">
                      {belPembangunanPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-5/12 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Penyelenggaraan Pemerintahan Desa
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.bel_pemerintahan)}
                </span>
              </div>
              <div className="w-full md:w-7/12 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-8 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-400 h-full flex items-center justify-end px-3 transition-all duration-1000 ease-out"
                    style={{ width: `${belPemerintahanPct}%` }}
                  >
                    <span className="text-xs font-bold text-white tracking-widest">
                      {belPemerintahanPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-5/12 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Pembinaan Kemasyarakatan
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.bel_pembinaan)}
                </span>
              </div>
              <div className="w-full md:w-7/12 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-8 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-300 h-full flex items-center justify-end px-3 transition-all duration-1000 ease-out"
                    style={{ width: `${belPembinaanPct}%` }}
                  >
                    <span className="text-xs font-bold text-rose-900 tracking-widest">
                      {belPembinaanPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-5/12 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Penanggulangan Bencana & Mendesak
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.bel_bencana)}
                </span>
              </div>
              <div className="w-full md:w-7/12 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-8 rounded-full overflow-hidden flex">
                  <div
                    className="bg-orange-400 h-full flex items-center justify-end px-3 transition-all duration-1000 ease-out"
                    style={{ width: `${belBencanaPct}%` }}
                  >
                    <span className="text-xs font-bold text-white tracking-widest">
                      {belBencanaPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-5/12 flex flex-col">
                <span className="text-sm font-bold text-on-surface-variant">
                  Pemberdayaan Masyarakat
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.bel_pemberdayaan)}
                </span>
              </div>
              <div className="w-full md:w-7/12 flex items-center gap-3">
                <div className="flex-1 bg-surface-container-highest h-8 rounded-full overflow-hidden flex">
                  <div
                    className="bg-purple-400 h-full flex items-center justify-end px-3 transition-all duration-1000 ease-out"
                    style={{ width: `${belPemberdayaanPct}%` }}
                  >
                    <span className="text-xs font-bold text-white tracking-widest">
                      {belPemberdayaanPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 4: Pembiayaan Desa */}
          <div className="bg-secondary-container text-on-secondary-container p-6 md:p-8 rounded-3xl">
            <h3 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">data_usage</span>
              Pembiayaan Desa (Akuntansi)
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-on-secondary-container/5 px-4 py-3 rounded-xl border border-on-secondary-container/10">
                <span className="text-sm font-bold opacity-80 uppercase tracking-wider">
                  Penerimaan
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pembiayaan_penerimaan)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-rose-500/10 text-rose-700 px-4 py-3 rounded-xl border border-rose-500/20">
                <span className="text-sm font-bold uppercase tracking-wider">
                  Pengeluaran
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pembiayaan_pengeluaran)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-on-secondary-container text-secondary-container px-4 py-3 rounded-xl border">
                <span className="text-sm font-bold uppercase tracking-wider">
                  Netto
                </span>
                <span className="font-black text-lg">
                  {formatRupiah(data.pembiayaan_netto)}
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-surface-container p-6 md:p-8 rounded-3xl border border-outline-variant/30 flex flex-col justify-center items-center text-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-4">
              verified
            </span>
            <h3 className="text-xl font-bold font-headline mb-2">
              Dokumen Resmi Laporan
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Data disahkan pada {data.tanggal_disahkan} oleh Kepala Desa,{" "}
              {data.nama_pengesah}.
            </p>
            {data.file_pdf !== "#" ? (
              <a
                href={data.file_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-on-primary w-full py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">
                  picture_as_pdf
                </span>
                Download APBDes Asli (PDF)
              </a>
            ) : (
              <div className="bg-surface-container-high text-on-surface-variant w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80 border border-outline-variant/30">
                <span className="material-symbols-outlined">
                  picture_as_pdf
                </span>
                Dokumen Belum Tersedia
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
  } catch (error: any) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-32 pb-32 text-center">
        <span className="material-symbols-outlined text-7xl text-rose-500 mb-6 block">
          error
        </span>
        <h1 className="text-3xl font-extrabold text-stone-700 font-headline">
          Terjadi Kesalahan Server
        </h1>
        <p className="mt-4 text-stone-500 max-w-2xl mx-auto border p-4 bg-rose-50 rounded-lg text-left overflow-auto text-sm">
          {error?.message || "Unknown error occurred"}
          <br/>
          {error?.stack}
        </p>
      </div>
    );
  }
}
