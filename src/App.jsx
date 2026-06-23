import { useState, useEffect, useRef } from "react";

// Funny quotes to rotate every 5 seconds
const FUNNY_STATUSES = [
  "Lagi niup-niup arang biar servernya panas...",
  "Menunggu 20 juta ton batu bara dikirim ke PLTU terdekat...",
  "Sabar ya, tim lagi nge-charge server pakai genset cadangan...",
  "Sedang membujuk Pak Bahlil untuk pinjam genset portable...",
  "Mencoba memutar dinamo server pakai sepeda statis...",
  "Kabel server lagi digigit tikus gardu PLN...",
  "Lagi nego cicilan listrik server sama admin PLN...",
  "Staf IT sedang mencoba menghidupkan server pakai korek api...",
];

// Helper to format countdown numbers with leading zeros
const formatTime = (timeMs) => {
  if (timeMs <= 0) return "00 : 00 : 00";
  const hours = Math.floor((timeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeMs % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
};

function App() {
  // --- STATE ---
  const [now, setNow] = useState(new Date());
  const [statusIndex, setStatusIndex] = useState(0);
  const [crankProgress, setCrankProgress] = useState(0); // 0 to 100%
  const [emergencyPowerActive, setEmergencyPowerActive] = useState(false);
  const [emergencyCharge, setEmergencyCharge] = useState(0); // Charge remaining when active
  const [isShaking, setIsShaking] = useState(false);
  const [particles, setParticles] = useState([]);
  const [realWebsiteUrl] = useState("https://dev-dayaboard.diardo.my.id/");

  const shakeTimeoutRef = useRef(null);

  // --- TARGET TIME ---
  // Target is 15:00 WIB (3:00 PM) today
  const getTargetTime = () => {
    const target = new Date();
    target.setHours(15, 0, 0, 0);
    return target;
  };

  const targetTime = getTargetTime();
  const timeDifference = targetTime - now;
  const isTargetReached = timeDifference <= 0;

  // --- EFFECT: COUNTDOWN & SYSTEM CLOCK ---
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- EFFECT: ROTATE STATUS MESSAGES ---
  useEffect(() => {
    if (isTargetReached || emergencyPowerActive) return;

    // Rotate every 5 seconds
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % FUNNY_STATUSES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isTargetReached, emergencyPowerActive]);

  // --- EFFECT: GENERATE BACKGROUND PARTICLES ---
  useEffect(() => {
    // Generate 20 floating particles with random sizes/positions/delays
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
    setParticles(newParticles);
  }, []);

  // --- EFFECT: GENERATOR DECAY & EMERGENCY DRAINING ---
  useEffect(() => {
    const decayInterval = setInterval(() => {
      if (emergencyPowerActive) {
        // Drain emergency power
        setEmergencyCharge((prev) => {
          if (prev <= 1) {
            setEmergencyPowerActive(false);
            return 0;
          }
          return prev - 1; // Decay rate when active
        });
      } else {
        // Decay normal crank build up
        setCrankProgress((prev) => {
          if (prev <= 0.5) return 0;
          return prev - 0.8; // Decay rate of build-up
        });
      }
    }, 100);

    return () => clearInterval(decayInterval);
  }, [emergencyPowerActive]);

  // --- HANDLER: CRANK BUTTON ---
  const handleCrank = () => {
    if (emergencyPowerActive) return;

    // Trigger shake animation
    setIsShaking(true);
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => setIsShaking(false), 200);

    setCrankProgress((prev) => {
      const next = prev + 12; // Boost per click
      if (next >= 100) {
        setEmergencyPowerActive(true);
        setEmergencyCharge(100);
        return 0;
      }
      return next;
    });
  };

  // --- ACTION: REDIRECT TO REAL WEBSITE ---
  const handleReload = () => {
    window.location.href = realWebsiteUrl;
  };

  // --- RENDER HELPERS ---
  const getStatusText = () => {
    if (emergencyPowerActive) {
      return "GENSET DARURAT MENYALA! Server beroperasi dengan tenaga dinamo engkol...";
    }
    if (isTargetReached) {
      return "Silakan klik tombol Cek Nyala Apa Belum di bawah.";
    }
    return FUNNY_STATUSES[statusIndex];
  };

  return (
    <div
      className={`relative flex items-center justify-center min-h-screen p-4 transition-all duration-1000 ${
        emergencyPowerActive ? "bg-[#1a202c]" : "bg-[#0b0c10]"
      }`}
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              backgroundColor: emergencyPowerActive
                ? "rgba(250, 204, 21, 0.25)"
                : "rgba(255, 255, 255, 0.05)",
            }}
          />
        ))}
        {/* Dotted pattern - active (20% opacity) when emergency power is active, hidden when off */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            emergencyPowerActive ? "opacity-20" : "opacity-0"
          }`}
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Main Container */}
      <div
        className={`max-w-2xl w-full rounded-3xl overflow-hidden glass-panel glass-panel-glow border relative z-10 transition-all duration-500 ${
          emergencyPowerActive
            ? "border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.25)] scale-105"
            : "border-slate-800 shadow-2xl hover:border-slate-700/80"
        } ${isShaking ? "shake-active" : ""}`}
      >
        {/* Header Section */}
        <div className="bg-slate-950/60 p-8 border-b border-slate-800/80 relative overflow-hidden">
          {/* Decorative Sparks for Emergency Mode */}
          {emergencyPowerActive && (
            <div className="absolute inset-0 pointer-events-none flex justify-around items-center opacity-30">
              <svg
                className="w-6 h-6 text-yellow-400 animate-bounce"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.5 2L3 14h9l-1.5 8 8.5-12h-9l1.5-8z" />
              </svg>
              <svg
                className="w-8 h-8 text-yellow-300 animate-pulse delay-75"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.5 2L3 14h9l-1.5 8 8.5-12h-9l1.5-8z" />
              </svg>
              <svg
                className="w-5 h-5 text-yellow-500 animate-bounce delay-150"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.5 2L3 14h9l-1.5 8 8.5-12h-9l1.5-8z" />
              </svg>
            </div>
          )}

          {/* Lightbulb Box */}
          <div className="flex justify-center mb-6">
            <div
              className={`relative p-6 rounded-full transition-all duration-500 ${
                emergencyPowerActive
                  ? "bg-yellow-500/30 text-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.7)] scale-110"
                  : "bg-slate-900/60 text-slate-500 border border-slate-800"
              }`}
            >
              {/* Flickering bulb icon */}
              <svg
                className={`w-16 h-16 ${emergencyPowerActive ? "" : "flicker text-yellow-500/80"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>

              {/* Red Cross (fades out when emergency power turns on) */}
              <div
                className={`absolute top-0 right-0 bg-red-600 text-white rounded-full p-1.5 border-2 border-slate-900 transition-all duration-500 ${
                  emergencyPowerActive
                    ? "scale-0 opacity-0"
                    : "scale-100 opacity-100"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 uppercase tracking-wide comic-font">
            <span
              className={
                emergencyPowerActive ? "gradient-green" : "gradient-yellow"
              }
            >
              {emergencyPowerActive ? "Hore! " : "Oops! "}
            </span>
            {emergencyPowerActive
              ? "Listrik Darurat Nyala"
              : "Website Kena Pemadaman"}
          </h1>
          <p className="text-slate-400 font-sans italic text-sm max-w-lg mx-auto">
            &ldquo;Kata Pak Bahlil PLN defisit 20 juta ton batu bara. Server pun
            ikut berduka.&rdquo;
          </p>
        </div>

        {/* Body Section */}
        <div className="p-8">
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed font-sans max-w-xl mx-auto">
            {emergencyPowerActive ? (
              <span>
                Berkat engkol tangan Anda yang penuh semangat, server sekarang
                berjalan menggunakan <strong>daya genset darurat</strong>! Meski
                tetap belum bisa diakses, minimal lampu disini nyala!
              </span>
            ) : (
              <span>
                Halo! Maaf website terpaksa <strong>gelap gulita</strong>.
                Server resmi jadi korban pemadaman bergilir hari ini karena PLN
                kabarnya lagi pusing nyari kekurangan pasokan 20 juta ton batu
                bara.
              </span>
            )}
          </p>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-slate-700/50 transition-colors">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">⛏️</span> Masalahnya Apa?
              </h3>
              <p className="text-slate-400 text-sm font-sans leading-relaxed">
                Bukan murni dari sistem, tapi server ikut padam karena PLN
                defisit 20 juta ton batu bara. Listrik pun kembang kempis!
              </p>
            </div>

            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-slate-700/50 transition-colors">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">⏳</span> Kapan Nyala?
              </h3>
              <p className="text-slate-400 text-sm font-sans leading-relaxed">
                Tenang, tidak perlu nunggu audit BPKP. Estimasi pemadaman
                selesai dan server normal kembali pukul{" "}
                <strong>15:00 WIB</strong> hari ini.{" "}
                <strong>(kalau ga molor)</strong>
              </p>
            </div>
          </div>

          {/* Countdown & Status Panel */}
          <div
            className={`border rounded-2xl p-6 mb-8 transform transition-all duration-300 ${
              emergencyPowerActive
                ? "bg-yellow-500/10 border-yellow-500/30"
                : isTargetReached
                  ? "bg-green-950/20 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                  : "bg-yellow-950/20 border-yellow-700/30"
            }`}
          >
            <p
              className={`text-xs font-bold mb-3 tracking-widest uppercase font-sans ${
                emergencyPowerActive
                  ? "text-yellow-400"
                  : isTargetReached
                    ? "text-green-400"
                    : "text-yellow-500"
              }`}
            >
              {emergencyPowerActive
                ? "Daya Genset Cadangan Tersisa:"
                : "Menunggu Listrik Server Nyala:"}
            </p>

            <div
              className={`text-3xl sm:text-5xl font-extrabold tracking-wider font-mono drop-shadow-[0_0_10px_rgba(250,204,21,0.3)] transition-all ${
                emergencyPowerActive
                  ? "text-yellow-300 scale-105"
                  : isTargetReached
                    ? "gradient-green"
                    : "text-yellow-400"
              }`}
            >
              {emergencyPowerActive
                ? `${emergencyCharge}%`
                : isTargetReached
                  ? "ALHAMDULILLAH NYALA!"
                  : formatTime(timeDifference)}
            </div>

            <p
              className={`text-xs mt-3 font-sans transition-colors duration-500 ${
                emergencyPowerActive
                  ? "text-yellow-400 font-medium"
                  : isTargetReached
                    ? "text-green-500 font-semibold"
                    : "text-slate-500"
              }`}
            >
              {getStatusText()}
            </p>

            {/* Emergency Draining Bar */}
            {emergencyPowerActive && (
              <div className="w-full bg-slate-900 rounded-full h-2.5 mt-4 overflow-hidden border border-yellow-500/20">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                  style={{ width: `${emergencyCharge}%` }}
                />
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-4">
            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleReload}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-3.5 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_4px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none font-sans"
              >
                <svg
                  className="w-5 h-5 font-bold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Cek Nyala Apa Belum
              </button>

              <button
                onClick={handleCrank}
                disabled={emergencyPowerActive}
                className={`w-full sm:w-auto font-bold py-3.5 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_4px_0_rgba(255,255,255,0.05)] active:translate-y-1 active:shadow-none font-sans ${
                  emergencyPowerActive
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/30"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                }`}
              >
                <span>⚡</span>
                {emergencyPowerActive
                  ? "Genset Sedang Nyala!"
                  : "Engkol Genset Darurat"}
              </button>
            </div>

            {/* Crank Build Up Progress Bar */}
            {!emergencyPowerActive && crankProgress > 0 && (
              <div className="max-w-md w-full mx-auto mt-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-left">
                <div className="flex justify-between text-xs text-slate-400 font-sans mb-1.5">
                  <span>🔋 Mengumpulkan Daya Putaran...</span>
                  <span className="font-mono text-yellow-500 font-bold">
                    {Math.round(crankProgress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full transition-all duration-100"
                    style={{ width: `${crankProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 italic font-sans">
                  *Klik cepat terus-menerus sampai 100% untuk menyalakan genset
                  darurat!
                </p>
              </div>
            )}
          </div>

          {/* Footer Warning */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500 font-sans leading-relaxed max-w-md mx-auto">
            <p>
              ⚠️ Peringatan: Halaman ini hanya candaan semata untuk mengurangi
              stres menunggu PLN nyala. Terima kasih atas kesabaran Anda!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
