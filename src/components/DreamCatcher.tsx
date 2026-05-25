import React, { useState } from "react";
import { 
  Sparkles, Award, GraduationCap, RefreshCw, Send, CheckCircle, Heart, Shield, FileText, User, HelpCircle, Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DreamPledgeForm, DreamAdviceResponse } from "../types";

const DREAM_PROFESSIONS = [
  { id: "dokter", name: "Dokter", icon: "🩺", desc: "Menyembuhkan sesama dengan kesucian rasa kemanusiaan.", color: "border-teal-500/20 text-teal-400 bg-teal-500/10" },
  { id: "guru", name: "Guru Pengajar", icon: "📚", desc: "Menyinari akal budi luhur generasi emas Indonesia.", color: "border-blue-500/20 text-blue-400 bg-blue-500/10" },
  { id: "atlet", name: "Atlet Berprestasi", icon: "🏅", desc: "Mengharumkan bendera merah putih di kancah dunia.", color: "border-orange-500/20 text-orange-400 bg-orange-500/10" },
  { id: "polisi", name: "Polisi / TNI", icon: "👮", desc: "Mengayom masyarakat dengan adil, berani, dan disiplin.", color: "border-amber-500/20 text-amber-400 bg-amber-500/10" },
  { id: "ilmuwan", name: "Ilmuwan / Penemu", icon: "🧪", desc: "Menciptakan teknologi bermanfaat bagi martabat manusia.", color: "border-purple-500/20 text-purple-400 bg-purple-500/10" },
  { id: "pilot", name: "Pilot / Astronaut", icon: "✈️", desc: "Terbang membelah angkasa membawa kehormatan bangsa.", color: "border-cyan-500/20 text-cyan-400 bg-cyan-500/10" },
];

const VIRTUE_PLEDGES = [
  { id: "bakti", text: "Selalu berbakti, patuh, dan mendoakan kedua Orang Tua.", icon: <Heart className="w-4 h-4 text-red-400" /> },
  { id: "hormat", text: "Menghormati Guru, menghargai ilmu, dan tidak melupakan jasa-jasa mereka.", icon: <Award className="w-4 h-4 text-amber-400" /> },
  { id: "akhlak", text: "Menjaga kejujuran, sopan santun, rendah hati, dan berakhlak mulia di mana pun berada.", icon: <Shield className="w-4 h-4 text-emerald-400" /> },
];

export default function DreamCatcher() {
  const [form, setForm] = useState<DreamPledgeForm>({
    studentName: "",
    dreamProfession: "Dokter",
    customPledge: "Belajar dengan sungguh-sungguh demi membahagiakan orang tua.",
    customInterests: "",
  });

  const [selectedPledges, setSelectedPledges] = useState<string[]>(["bakti", "hormat", "akhlak"]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<DreamAdviceResponse | null>(null);

  const loadingMessages = [
    "Menghubungkan impianmu dengan masa depan...",
    "Mempersiapkan amanah bijak kepala sekolah SDN Karang Anyar 01 Pagi...",
    "Merajut nilai-nilai budi luhur dan akhlak mulia...",
    "Merangkai kata-kata motivasi dari lubuk hati para pendidik...",
  ];

  const handleProfessionSelect = (name: string) => {
    setForm(prev => ({ ...prev, dreamProfession: name }));
  };

  const handlePledgeToggle = (id: string) => {
    setSelectedPledges(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim()) {
      alert("Masukkan namamu terlebih dahulu ya!");
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    // Simulated staggered loading steps for smooth UX
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch("/api/dream-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: form.studentName,
          dreamProfession: form.dreamProfession,
          customPledge: form.customPledge + " (Janji ikrar tumpat: " + selectedPledges.map(id => VIRTUE_PLEDGES.find(vp => vp.id === id)?.text).join(" | ") + ")",
          customInterests: form.customInterests,
        }),
      });

      const data = await response.json();
      clearInterval(interval);
      setResult(data);
    } catch (err) {
      console.error("Failed fetching dream details", err);
      // Fallback
      setResult({
        advice: `Amanah untuk alumni bernama ${form.studentName}: Gantungkan mimpimu setinggi langit, wahai siswa tangguh SDN Karang Anyar 01 Pagi. Karirmu sebagai ${form.dreamProfession} akan terwujud melalui kesetiaan belajar, bakti pada bapak ibu guru, dan kepatuhan mutlak pada doa mulia orang tuamu.`,
        verse: "Pikiran cerdas menjamin keberhasilan, namun budi luhur menempatkanmu di singgasana kemuliaan abadi."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setResult(null);
    setForm({
      studentName: "",
      dreamProfession: "Dokter",
      customPledge: "Belajar dengan sungguh-sungguh demi membahagiakan orang tua.",
      customInterests: "",
    });
  };

  const handleDownloadOfflineCard = () => {
    window.print();
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-6 sm:p-8 shadow-xl" id="dreams-section">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-700 font-mono text-[11px] uppercase tracking-wider font-extrabold">
            Sinergi Karakter & Masa Depan
          </span>
          <h2 className="font-serif font-black text-slate-800 text-2xl sm:text-3xl mt-2">
            Perancang Cita-Cita & Amanah Guru
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto leading-relaxed font-semibold">
            Tuliskan masa depan impianmu, ikat dalam janji budi pekerti luhur, dan dapatkan bimbingan nasehat khusus (pesan kelulusan) yang dirancang personal oleh AI Guru SDN Karang Anyar 01 Pagi.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result && !loading && (
            <motion.form 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name Input */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-750 text-xs font-mono font-bold uppercase mb-2">Nama Lengkap Siswa</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Masukkan nama wisudawan..." 
                      value={form.studentName}
                      onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/60 focus:bg-white border border-white/80 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-sans placeholder-slate-400 font-medium"
                      required
                      id="input-student-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-750 text-xs font-mono font-bold uppercase mb-2">Hobi / Minat Khusus</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Bermusik, melukis, bermain sepak bola..." 
                    value={form.customInterests}
                    onChange={(e) => setForm({ ...form, customInterests: e.target.value })}
                    className="w-full px-4 py-3 bg-white/60 focus:bg-white border border-white/80 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-sans placeholder-slate-400 font-medium"
                    id="input-interests"
                  />
                </div>
              </div>

              {/* Profession Grid selection */}
              <div>
                <label className="block text-slate-750 text-xs font-mono font-bold uppercase mb-3 text-slate-650">
                  Pilih Cita-Cita Impianmu (Scene 5)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DREAM_PROFESSIONS.map((p) => {
                    const isSelected = form.dreamProfession === p.name;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProfessionSelect(p.name)}
                        className={`p-3.5 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-between h-28 select-none ${
                          isSelected 
                            ? "bg-white border-[#D97706] ring-2 ring-amber-500/20 shadow-md" 
                            : "bg-white/40 border-white/60 hover:border-slate-350 hover:bg-white/70"
                        }`}
                        id={`prof-button-${p.id}`}
                      >
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <h4 className="text-slate-800 font-serif font-black text-xs">{p.name}</h4>
                          <p className="text-slate-500 text-[9px] line-clamp-1 mt-0.5 leading-tight font-semibold">{p.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Virtue Pledges Checkbox */}
              <div className="p-5 rounded-2xl bg-white/50 border border-white/80 space-y-3.5 shadow-sm">
                <span className="block text-red-700 text-xs font-serif font-black uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4.5 h-4.5 text-red-600" /> Komitmen Karakter SDN Karang Anyar 01 Pagi
                </span>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                  Agar ilmu yang didapat berkah dan menghantarkan kesuksesan sejati, centang ikrar pilar karakter muliamu di bawah ini:
                </p>

                <div className="space-y-2.5 pt-1.5">
                  {VIRTUE_PLEDGES.map((pledge) => {
                    const isChecked = selectedPledges.includes(pledge.id);
                    return (
                      <div 
                        key={pledge.id}
                        onClick={() => handlePledgeToggle(pledge.id)}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                          isChecked 
                            ? "bg-red-50/80 border-red-500/30 shadow-sm" 
                            : "bg-white/40 border-white/60 hover:bg-white/60"
                        }`}
                        id={`pledge-${pledge.id}`}
                      >
                        <div className="mt-0.5">{pledge.icon}</div>
                        <p className="text-slate-800 text-xs leading-tight font-sans flex-1 font-semibold">
                          {pledge.text}
                        </p>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isChecked ? "bg-red-600 border-red-500" : "border-slate-350"
                        }`}>
                          {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Pledge Statement Input */}
              <div>
                <label className="block text-slate-750 text-xs font-mono font-bold uppercase mb-2">Ikrar Kelulusan Pribadi</label>
                <textarea 
                  rows={2}
                  placeholder="Contoh: Ingin terus giat belajar agar dapat berbakti mengharumkan bangsa Indonesia..."
                  value={form.customPledge}
                  onChange={(e) => setForm({ ...form, customPledge: e.target.value })}
                  className="w-full px-4 py-3 bg-white/60 focus:bg-white border border-white/80 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-sans leading-relaxed resize-none placeholder-slate-400 font-medium"
                  id="input-pledge"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-serif font-black tracking-wide rounded-xl shadow-lg hover:shadow-red-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/40"
                  id="submit-dream-button"
                >
                  <Sparkles className="w-4 h-4 text-[#FCD34D]" />
                  Kirim Impian & Ambil Nasehat
                </button>
              </div>
            </motion.form>
          )}

          {/* Staggered Loading Animations */}
          {loading && (
            <motion.div
              key="loading-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center text-center space-y-6"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-red-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-red-600 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <p className="text-slate-800 font-serif font-black text-sm animate-pulse">
                  {loadingMessages[loadingStep]}
                </p>
                <p className="text-slate-500 font-mono text-[10px] uppercase font-bold">
                  Mendayagunakan Gemini AI • SDN Karang Anyar 01
                </p>
              </div>
            </motion.div>
          )}

          {/* Golden Letter of Inspiration Card Result */}
          {result && !loading && (
            <motion.div
              key="result-advice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="space-y-6"
            >
              {/* Certificate Template Layout */}
              <div className="bg-[#FAF9F6] text-[#1A1A1A] rounded-2xl border-4 border-[#D97706]/50 p-6 sm:p-10 shadow-2xl relative overflow-hidden print:p-0 print:bg-white print:text-black">
                {/* Vintage Vignette border */}
                <div className="absolute inset-2 border-2 border-[#D97706]/20 pointer-events-none rounded-lg" />
                <div className="absolute inset-4 border border-dashed border-[#D97706]/35 pointer-events-none rounded-lg" />

                {/* Indonesian School Header Stamp */}
                <div className="text-center pb-6 border-b-2 border-double border-[#881337]/30 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-[#B91C1C] text-white flex items-center justify-center rounded-full p-2.5 shadow-md">
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-serif font-black text-xs uppercase tracking-[0.2em] text-[#B91C1C]">PEMERINTAH PROVINSI DKI JAKARTA</h3>
                    <h4 className="font-serif font-bold text-base tracking-wide text-[#1A1A1A]">SDN KARANG ANYAR 01 PAGI</h4>
                    <p className="text-[10px] font-mono tracking-widest text-[#5E503F] mt-0.5 uppercase">KECAMATAN SAWAH BESAR • KOTA JAKARTA PUSAT</p>
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="text-center py-6">
                  <span className="font-serif italic font-medium text-xs text-[#881337] uppercase tracking-wide">
                    Piagam Komitmen Karakter Masa Depan
                  </span>
                  <h1 className="font-serif font-extrabold text-[#D97706] text-xl sm:text-2xl tracking-wider mt-1">
                    AMANAH LUHUR KELULUSAN
                  </h1>
                </div>

                {/* Certificate Content text */}
                <div className="space-y-4 max-w-2xl mx-auto font-sans leading-relaxed text-sm text-slate-800 text-justify">
                  {result.advice.split("\n\n").map((para, i) => (
                    <p key={i} className="first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:text-school-red first-letter:float-left first-letter:mr-1.5 first-letter:mt-0.5">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Splendid motivational quotation */}
                <div className="my-8 py-4 px-6 bg-amber-50 rounded-xl border-l-4 border-amber-500 font-serif italic text-center text-sm text-amber-900 max-w-xl mx-auto leading-relaxed shadow-sm">
                  “{result.verse}”
                </div>

                {/* Signature stamping elements */}
                <div className="flex justify-between items-end pt-8 border-t border-slate-200/80 font-serif max-w-2xl mx-auto text-xs text-[#1A1A1A]">
                  <div className="text-center space-y-12">
                    <p className="font-medium">Mengetahui,<br /><span className="text-[11px] text-zinc-500">Orang Tua/Wali Siswa</span></p>
                    <p className="border-t border-slate-300 w-28 mx-auto pt-1 font-bold">......................</p>
                  </div>

                  <div className="text-center space-y-12">
                    <p className="font-medium">Jakarta, 25 Mei 2026<br /><span className="text-[#B91C1C] font-semibold">AI Kepala Sekolah & Guru</span></p>
                    <div className="relative">
                      {/* Certified gold stamp decoration */}
                      <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-16 h-16 bg-amber-400/10 border-2 border-dashed border-amber-500/30 rounded-full flex items-center justify-center scale-90 pointer-events-none rotate-12">
                        <span className="font-mono text-[9px] uppercase text-amber-700 font-extrabold tracking-tighter">SDN KA 01</span>
                      </div>
                      <p className="border-t border-slate-300 w-36 mx-auto pt-1 font-bold text-center text-red-800 tracking-wide font-serif">Dewan Guru KA 01</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-end mt-4">
                <button
                  onClick={handleResetForm}
                  className="px-5 py-3 rounded-xl border-2 border-white/80 bg-white/40 text-slate-700 hover:text-slate-900 hover:bg-white/80 text-xs font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                  id="reset-form-button"
                >
                  <RefreshCw className="w-4 h-4 text-red-650" />
                  Ulangi Rangkai Mimpi
                </button>

                <button
                  onClick={handleDownloadOfflineCard}
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-750 text-white font-serif font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all border border-white/40"
                  id="download-pdf-button"
                >
                  <Download className="w-4 h-4 text-[#FCD34D]" />
                  Simpan & Cetak Piagam
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
