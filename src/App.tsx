import React, { useState } from "react";
import { 
  Award, GraduationCap, Heart, HelpCircle, BookOpen, Music, Play, ExternalLink, Calendar, Users, Star, ArrowRight, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CinemaPlayer from "./components/CinemaPlayer";
import DreamCatcher from "./components/DreamCatcher";
import { CINEMATIC_SCENES } from "./data/scenes";

export default function App() {
  const [activeSceneId, setActiveSceneId] = useState(1);

  // Traditional Indonesian Education motto by Ki Hajar Dewantara
  const dewantaraMotto = {
    motto: "Ing Ngarsa Sung Tulada, Ing Madya Mangun Karsa, Tut Wuri Handayani.",
    translation: "Di depan memberi teladan, di tengah membangun semangat, di belakang memberi dorongan."
  };

  const schoolVirtues = [
    { title: "Semangat Belajar", desc: "Gigih, tekun membaca dan mempelajari hal baru tanpa lelah demi menembus batas keahlian.", icon: "🔥" },
    { title: "Meraih Cita-Cita", desc: "Melangitkan impian setinggi angkasa, berani gagal, teguh bangkit menuju profesi dambaan.", icon: "🚀" },
    { title: "Berbudi Luhur", desc: "Sopan santun dalam perilaku, jujur memegang amanat, disiplin mengelola waktu, santun bertutur.", icon: "💎" },
    { title: "Berakhlak Mulia", desc: "Menghormati guru penuh ta'dzim, berbakti kepada orang tua yang melahirkan, menyayangi sesama.", icon: "🕊️" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 text-slate-800 font-sans relative overflow-x-hidden selection:bg-school-red/20 selection:text-slate-900">
      {/* Background Atmosphere: Warm Sunrise Mesh / Bokeh blurred orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-orange-300 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-rose-300 rounded-full blur-[100px] opacity-25 pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[450px] h-[450px] bg-amber-200 rounded-full blur-[130px] opacity-20 pointer-events-none" />

      {/* Embedded Grain Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.10] film-grain" />

      {/* Floating Audio Soundtrack Hint banner - Frosted Red accent */}
      <div className="bg-red-700/80 border-b border-white/20 text-center py-2.5 px-4 shadow-lg backdrop-blur-md relative z-50 flex items-center justify-center gap-2">
        <Music className="w-3.5 h-3.5 text-[#FCD34D] animate-bounce" />
        <p className="text-[11px] sm:text-xs font-semibold text-white leading-tight">
          Saran Pengalaman: <span className="text-[#FCD34D] font-bold">Aktifkan Suara & Klik Play</span> pada pemutar film untuk mendengarkan lagu orkestra & piano emosional!
        </p>
      </div>

      {/* School Pride Header Banner: Beautiful Glassmorphic layout */}
      <header className="py-8 px-6 sm:px-12 border-b border-white/40 bg-white/20 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D97706] font-bold">Alumni Angkatan 2026</p>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-800 tracking-wide mt-0.5">
                SDN Karang Anyar 01 Pagi
              </h1>
              <p className="text-slate-600 text-xs mt-1 max-w-lg leading-relaxed font-sans font-medium">
                Sawah Besar, Jakarta Pusat • Mewujudkan Generasi Cerdas Mandiri yang Berbudi Luhur dan Berakhlak Mulia.
              </p>
            </div>
          </div>

          {/* Core Values Summary Ticker */}
          <div className="flex gap-2 flex-wrap justify-center">
            {["BUDI LUHUR", "AKHLAK MULIA", "BERPRESTASI", "HARAPAN BANGSA"].map((val) => (
              <span key={val} className="px-3.5 py-1 bg-white/50 backdrop-blur-md border border-white/60 text-[9px] font-mono font-black tracking-widest text-[#B91C1C] rounded-full shadow-sm">
                ★ {val}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container Layer */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-10 space-y-12 relative z-10">
        
        {/* Cinematic introduction quote (Dewantara) - Glass card */}
        <div className="relative overflow-hidden bg-white/30 backdrop-blur-md border border-white/60 p-6 sm:p-8 rounded-3xl max-w-4xl mx-auto text-center shadow-xl">
          <div className="absolute top-1/2 left-12 -translate-y-1/2 w-48 h-48 bg-orange-200/20 rounded-full blur-[50px] pointer-events-none" />
          <p className="font-serif italic text-lg sm:text-xl text-[#B91C1C] font-extrabold leading-relaxed relative z-10">
            “{dewantaraMotto.motto}”
          </p>
          <p className="text-xs font-mono uppercase text-slate-600 tracking-wider mt-2.5 relative z-10 font-bold">
            — {dewantaraMotto.translation} (<span className="text-red-700">Ki Hajar Dewantara</span>)
          </p>
        </div>

        {/* 2 Column Layout: Left centerpiece Player + dreams / Right Storyboard Screenplay Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column (SPAN 2): Primary Cinema Video Stage and Custom Interactive Form */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Stage Title */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h2 className="font-serif font-bold text-lg text-slate-800 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-600 fill-red-600/20" /> Pemutar Film Sinematik Kelulusan
              </h2>
              <span className="text-xs font-mono text-red-700 font-bold tracking-[0.1em] uppercase">SDN KA 01 PAGI</span>
            </div>

            {/* Cinema Player component wrapper */}
            <CinemaPlayer onSceneChange={(sceneId) => setActiveSceneId(sceneId)} />

            {/* Custom Interactive Dreams Catcher and letter maker */}
            <DreamCatcher />

          </div>

          {/* Right Column (SPAN 1): Director's Screenplay, Virtues Manual and School Chronicles */}
          <div className="space-y-8">
            
            {/* Section: SDN Karang Anyar 4 Pilar Virtues (Glass Card) */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-6 relative shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-2 items-center mb-5.5">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <h3 className="font-serif font-bold text-slate-800 text-base">4 Pilar Karakter Wisudawan</h3>
              </div>
              
              <div className="space-y-4">
                {schoolVirtues.map((v) => (
                  <div key={v.title} className="p-4 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/75 transition-all shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{v.icon}</span>
                      <h4 className="font-serif font-bold text-slate-800 text-xs">{v.title}</h4>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed font-medium">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Interactive Director Screenplay Notebook (Glass Card) */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-xl">
              <div className="flex gap-2 items-center mb-4">
                <BookOpen className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-serif font-bold text-slate-800 text-base">Log & Skenario Sutradara</h3>
              </div>
              
              <p className="text-slate-600 text-[11px] leading-relaxed mb-5 font-medium">
                Berikut rincian skenario film sinematik kelulusan yang sedang diputar. Setiap scene dirancang untuk menumbuhkan rasa syukur, cinta tanah air, dan tekad baja siswa.
              </p>

              {/* Staggered Screenplay scene cards */}
              <div className="space-y-3.5">
                {CINEMATIC_SCENES.map((scene) => {
                  const isActive = activeSceneId === scene.id;
                  return (
                    <motion.div 
                      key={scene.id}
                      animate={{ 
                        borderColor: isActive ? "#B91C1C" : "rgba(255,255,255,0.6)",
                        backgroundColor: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)"
                      }}
                      className="p-3.5 rounded-xl border text-left transition-all relative overflow-hidden shadow-sm hover:bg-white/50"
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600 rounded-l" />
                      )}
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono tracking-widest text-[#B91C1C] uppercase font-bold">
                          SCENE {scene.id} {isActive && "• AKTIF"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {scene.technicalSpecs.vibe.split(",")[0]}
                        </span>
                      </div>
                      <h4 className="text-slate-800 font-serif font-bold text-xs">{scene.title}</h4>
                      <p className="text-slate-600 text-[10px] leading-relaxed line-clamp-2 mt-1.5 font-sans font-medium">
                        {scene.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Section: Academic Milestone timeline (Glass design red accent) */}
            <div className="bg-gradient-to-br from-red-600/10 to-amber-500/10 border-2 border-white/80 rounded-3xl p-6 text-center shadow-xl space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black text-slate-800 text-sm">Target & Agenda Angkatan</h4>
                <p className="text-red-700 text-[10px] font-mono uppercase tracking-[0.1em] font-bold">SDN KARANG ANYAR 01 PAGI 2026</p>
              </div>
              <div className="text-left bg-white/40 border border-white rounded-2xl p-3.5 space-y-2.5 font-sans text-[11px] text-slate-700 font-medium">
                <div className="flex justify-between items-center">
                  <span>★ Kelulusan Siswa Kelas 6</span>
                  <span className="text-[#B91C1C] font-mono font-bold">100% Lulus</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>★ Komitmen Akhlak Mulia</span>
                  <span className="text-emerald-700 font-mono font-bold">Terakreditasi A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>★ Keberlanjutan ke SMP/MTs</span>
                  <span className="text-[#D97706] font-mono font-black animate-pulse">Siap Melangkah</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Section: About the school culture & philosophy */}
        <div className="bg-white/30 backdrop-blur-md border border-white/60 rounded-3xl p-8 max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="p-4 bg-red-600 text-white rounded-2xl shadow-md border-2 border-white">
            <GraduationCap className="w-10 h-10" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-serif font-bold text-slate-800 text-base">Impian Kita, Kebanggaan SDN Karang Anyar 01 Pagi</h3>
            <p className="text-slate-600 text-xs leading-relaxed font-sans font-medium">
              Setiap goresan tinta, setiap butir keringat bapak ibu guru, dan setiap ratapan doa suci ayah dan bunda kalian telah menyatu di rahim pendidikan SDN Karang Anyar 01 Pagi. Kelulusan ini bukanlah garis akhir dari perjuangan, melainkan bendera start yang dilepas megah. Jadilah lilin-lilin kecil yang menerangi setiap sudut tanah air Indonesia dengan akhlak yang luhur, akal yang cerdas, dan jiwa yang penuh pengabdian.
            </p>
          </div>
        </div>

      </main>

      {/* Footer Area */}
      <footer className="border-t border-white/40 bg-white/20 backdrop-blur-md py-10 px-6 sm:px-12 text-center text-slate-500 text-xs font-mono tracking-wider space-y-2">
        <p className="text-[#B91C1C] font-serif tracking-widest font-extrabold uppercase text-[10px]">TUNTUTLAH ILMU SAMPAI PILAR CAKRAWALA • SDN KARANG ANYAR 01 PAGI</p>
        <p className="text-slate-600 font-medium">© 2026 SDN Karang Anyar 01 Pagi. All Rights Reserved. Sawah Besar, Jakarta Pusat, Indonesia.</p>
        <p className="text-[9px] text-[#D97706] font-bold uppercase mt-2 select-none">Berbudi Luhur • Berakhlak Mulia • Cerdas Berprestasi</p>
      </footer>
    </div>
  );
}
