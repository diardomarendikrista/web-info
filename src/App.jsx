import { useState } from "react";

export default function App() {
  const [copied, setCopied] = useState(false);

  const DEV_URL = "https://dayaboard-dev.dlabstech.io/";
  const PROD_DOMAIN = "dayaboard.odyssey.co.id";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DEV_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = DEV_URL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-subtle-pattern flex flex-col justify-center items-center px-4 py-6 sm:py-8 antialiased text-slate-800">
      <div className="w-full max-w-3xl flex flex-col gap-5">
        {/* Top Branding & Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <img
              src="/DT.png"
              alt="Dayaboard Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Dayaboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pemberitahuan Perpindahan Sistem
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Layanan Dayaboard resmi dipindahkan ke alamat dan infrastruktur
            baru.
          </p>
        </div>

        {/* Notice Banner (Style terinspirasi dari banner pengumuman Dayaboard) */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-[#78350f] flex items-start gap-3 shadow-xs">
          <span className="text-base sm:text-lg shrink-0 leading-none">⚠️</span>
          <div>
            <span className="font-bold">Informasi Akses: </span>
            <ul>
              <li>
                - Untuk saat ini, silakan akses seluruh kebutuhan sistem melalui{" "}
                <strong>Development</strong>.
              </li>
              <li>
                - <strong>Production</strong> sedang dipersiapkan dan belum dibuka
                untuk umum.
              </li>
            </ul>
          </div>
        </div>

        {/* 2 Main Environments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Development */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Environment
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Aktif (Testing)
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Development
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                Siap digunakan untuk keperluan testing, evaluasi, dan pengujian
                fitur.
              </p>

              {/* URL Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono text-slate-800 truncate select-all font-medium">
                  {DEV_URL}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                >
                  {copied ? "Tersalin!" : "Salin"}
                </button>
              </div>
            </div>

            {/* Action Button: Dayaboard Maroon */}
            <a
              href={DEV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#821125] hover:bg-[#6b0c1e] text-white font-medium text-sm transition-colors shadow-xs"
            >
              <span>Buka Development</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Card 2: Production */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Environment
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <span>🚀</span>
                  Release Soon
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Production
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                Lingkungan produksi utama untuk operasional live.
              </p>

              {/* URL / Domain Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-slate-500 truncate font-medium">
                  {PROD_DOMAIN}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded font-mono">
                  Domain Baru
                </span>
              </div>

              {/* Notice Message */}
              <div className="bg-slate-50 rounded-lg p-2.5 border border-dashed border-slate-300 text-xs text-slate-600 leading-relaxed mb-4">
                <strong>Status:</strong> Sedang dalam tahap persiapan & migrasi
                akhir. Saat ini <em>belum dapat digunakan</em> dan akan segera
                dirilis.
              </div>
            </div>

            {/* Disabled Action Button */}
            <button
              disabled
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 font-medium text-sm cursor-not-allowed"
            >
              <span>🔒 Belum Bisa Dipakai</span>
            </button>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="text-center text-xs text-slate-400 pt-1">
          © {new Date().getFullYear()} Dayaboard • Hubungi admin jika butuh
          bantuan akses.
        </div>
      </div>
    </div>
  );
}
