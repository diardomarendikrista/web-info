import { useState } from "react";

export default function App() {
  const [copiedKey, setCopiedKey] = useState("");

  const PROD_URL = "https://dayaboard.odyssey.co.id/";
  const DEV_URL = "https://dayaboard-dev.dlabstech.io/";

  const handleCopy = async (url, key) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-subtle-pattern flex flex-col justify-center items-center px-4 py-8 antialiased text-slate-800">
      <div className="w-full max-w-2xl flex flex-col gap-5">
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
            Layanan resmi Dayaboard telah aktif di alamat baru.
          </p>
        </div>

        {/* Notice Banner: Singkat & Padat */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-emerald-900 flex items-center gap-2.5 shadow-xs">
          <span className="text-base shrink-0 leading-none">✨</span>
          <p className="leading-snug">
            <strong>Disarankan:</strong> Gunakan <strong>Production</strong> untuk operasional harian. Development hanya untuk pengujian.
          </p>
        </div>

        {/* 2 Main Environments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Card 1: Production (Disorot / Highlighted) */}
          <div className="relative bg-white rounded-2xl border-2 border-[#821125] p-5 shadow-md shadow-[#821125]/10 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-[#821125]/15">
            {/* Recommendation Ribbon */}
            <div className="absolute -top-3 left-5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#821125] text-white shadow-xs">
                ★ Disarankan
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2.5 mt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#821125]">
                  Live
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aktif
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Production
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                Sistem utama untuk seluruh operasional harian.
              </p>

              {/* URL Box */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-lg p-2 flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono text-slate-900 truncate select-all font-semibold">
                  {PROD_URL}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(PROD_URL, "prod")}
                  className="shrink-0 px-2.5 py-1 text-[11px] font-medium text-[#821125] hover:text-white bg-white hover:bg-[#821125] border border-rose-200 rounded-md transition-colors"
                >
                  {copiedKey === "prod" ? "Tersalin!" : "Salin"}
                </button>
              </div>
            </div>

            {/* Action Button: Dayaboard Maroon Prominent Button */}
            <a
              href={PROD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#821125] hover:bg-[#6b0c1e] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-xs"
            >
              <span>Buka Production</span>
              <svg
                className="w-4 h-4"
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

          {/* Card 2: Development (Sekunder) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2.5 mt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Testing
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Uji Coba
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Development
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                Khusus pengujian dan evaluasi fitur baru.
              </p>

              {/* URL Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono text-slate-600 truncate select-all font-medium">
                  {DEV_URL}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(DEV_URL, "dev")}
                  className="shrink-0 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                >
                  {copiedKey === "dev" ? "Tersalin!" : "Salin"}
                </button>
              </div>
            </div>

            {/* Secondary Action Button */}
            <a
              href={DEV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-sm transition-colors"
            >
              <span>Buka Development</span>
              <svg
                className="w-3.5 h-3.5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Dayaboard
        </div>
      </div>
    </div>
  );
}
