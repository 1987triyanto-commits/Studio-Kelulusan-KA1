import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, 
  RotateCcw, Mic, CircleDot, Info, Sliders, ChevronRight, Music, BellRing
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CINEMATIC_SCENES } from "../data/scenes";
import { soundtrack } from "./AudioEngine";

interface CinemaPlayerProps {
  onSceneChange?: (sceneId: number) => void;
}

export default function CinemaPlayer({ onSceneChange }: CinemaPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1 = normal, 0.7 = dramatic, 1.3 = fast
  const [progress, setProgress] = useState(0); // 0 to 100 for current scene
  const [showSpecs, setShowSpecs] = useState(false);
  const [narrationOpen, setNarrationOpen] = useState(true);
  
  // Custom VOICE RECORDING feature
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const shadowVoiceRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Refs for auto play timers
  const playTimerRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeScene = CINEMATIC_SCENES[currentIdx];

  // Synthesis Voice
  const handleSpeech = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    
    // Find Indonesian Voice if possible
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.toLowerCase().includes("id") || v.lang.toLowerCase().includes("in"));
    if (idVoice) {
      utterance.voice = idVoice;
    }
    utterance.rate = 0.88 * playbackSpeed; // Slightly slower, majestic speaking rhythm
    utterance.volume = isMuted ? 0 : 1;
    
    window.speechSynthesis.speak(utterance);
  };

  // Sync Soundtrack and Playback state
  useEffect(() => {
    if (isPlaying) {
      soundtrack.start();
      soundtrack.setVolume(isMuted ? 0 : 0.4);
      handleSpeech(activeScene.narration);
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isPlaying, currentIdx]);

  useEffect(() => {
    soundtrack.setVolume(isMuted ? 0 : 0.4);
  }, [isMuted]);

  // Handle auto-playing to the next scene
  useEffect(() => {
    if (isPlaying) {
      const sceneDuration = 10000 / playbackSpeed; // 10 seconds per scene
      const startTime = Date.now();
      
      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / sceneDuration) * 100, 100);
        setProgress(currentProgress);
      }, 100);

      playTimerRef.current = setTimeout(() => {
        if (currentIdx < CINEMATIC_SCENES.length - 1) {
          const nextIdx = currentIdx + 1;
          setCurrentIdx(nextIdx);
          setProgress(0);
          onSceneChange?.(CINEMATIC_SCENES[nextIdx].id);
        } else {
          // Finished entire movie
          setIsPlaying(false);
          setProgress(100);
        }
      }, sceneDuration);
    } else {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, currentIdx, playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    if (currentIdx < CINEMATIC_SCENES.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setProgress(0);
      onSceneChange?.(CINEMATIC_SCENES[nextIdx].id);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setProgress(0);
      onSceneChange?.(CINEMATIC_SCENES[prevIdx].id);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setProgress(0);
    setIsPlaying(false);
    onSceneChange?.(CINEMATIC_SCENES[0].id);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Full screen function
  const handleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error("Could not activate fullscreen:", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Microphone recording functions
  const startRecording = async () => {
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsPlaying(false);
      setProgress(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      shadowVoiceRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      // Automatically play the video and slide progression
      setIsPlaying(true);
      soundtrack.start();
      soundtrack.setVolume(0.15); // background soundtrack soft while recording
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Gagal mengakses mikrofon. Pastikan Anda telah mengizinkan izin mikrofon di browser Anda.");
    }
  };

  const stopRecording = () => {
    if (shadowVoiceRef.current && isRecording) {
      shadowVoiceRef.current.stop();
      setIsRecording(false);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" id="player-section">
      {/* 16:9 Cinema Container */}
      <div 
        ref={containerRef}
        className="relative aspect-video w-full rounded-2xl bg-black border border-slate-800 shadow-2xl overflow-hidden film-grain group"
      >
        {/* Animated Slide Frame */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
            >
              {activeScene.image ? (
                <img
                  src={activeScene.image}
                  alt={activeScene.title}
                  className="w-full h-full object-cover kenburns-zoom brightness-[0.85] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
                  <div className="text-center font-serif text-xl">Cinema Still {activeScene.id}</div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ambient Darkened Edge Shading */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/20 to-black/60" />

        {/* School Logo & Cinematic Header Title */}
        <div className="absolute top-5 left-6 right-6 flex justify-between items-start pointer-events-none z-10 transition-transform duration-500 group-hover:translate-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-school-red/90 text-white backdrop-blur-md shadow-lg border border-red-500/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#FCD34D] drop-shadow-md">FILM WISUDA SINEMATIK</p>
              <h1 className="text-white font-serif font-bold text-lg drop-shadow-md">SDN Karang Anyar 01 Pagi</h1>
            </div>
          </div>
          
          <div className="flex gap-2">
            <span className="hidden sm:inline bg-black/60 px-3 py-1 text-[11px] rounded-full border border-slate-700 font-mono text-slate-300 backdrop-blur-md shadow-md">
              SCENE {activeScene.id} / 6
            </span>
            <span className="bg-school-red/90 text-[#FCD34D] px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase font-bold rounded-lg border border-red-500/30 backdrop-blur-md shadow-md">
              KAMI LULUS 2026
            </span>
          </div>
        </div>

        {/* Subtitles Overlay / Narration text */}
        {narrationOpen && (
          <div className="absolute bottom-[24%] left-6 right-6 sm:left-12 sm:right-12 text-center pointer-events-none z-10 transition-all duration-300">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScene.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="bg-black/75 px-6 py-4 rounded-xl border border-slate-800 inline-block max-w-2xl text-center shadow-lg backdrop-blur-sm"
              >
                <p className="text-[#FCD34D] text-[11px] font-serif font-semibold uppercase tracking-widest mb-1">Narasi Suara</p>
                <p className="text-white text-sm sm:text-base leading-relaxed tracking-wide font-sans text-center">
                  “{activeScene.narration}”
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Final Screen Text Overlay - Scene 6 special text */}
        {currentIdx === 5 && progress > 50 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-20 bg-black/80 flex flex-col justify-center items-center text-center p-6 border-2 border-[#D97706]/20 m-4 rounded-xl backdrop-blur-md"
          >
            <span className="text-[#FCD34D] uppercase font-serif tracking-[0.2em] font-bold text-xs sm:text-sm mb-4">
              Amanat Keluhuran Budi Pekerti
            </span>
            <h2 className="text-white font-serif font-bold text-2xl sm:text-4xl px-4 max-w-3xl leading-snug drop-shadow-xl text-center">
              “Selamat dan Sukses Siswa-Siswi SDN Karang Anyar 01 Pagi. Terus Melangkah Menuju Cita-Cita.”
            </h2>
            <div className="mt-8 flex gap-3 text-neutral-400 font-mono text-xs items-center">
              <span>Berbudi Luhur</span>
              <span>•</span>
              <span>Berakhlak Mulia</span>
              <span>•</span>
              <span>Berbakti Pada Negeri</span>
            </div>
          </motion.div>
        )}

        {/* Director's Technical Specs Tooltip Overlay */}
        <AnimatePresence>
          {showSpecs && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="absolute left-6 top-20 z-10 p-5 rounded-xl bg-slate-950/95 border border-slate-800 text-xs text-slate-300 w-72 backdrop-blur-md shadow-2xl font-mono"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3 text-white">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sliders className="w-3.5 h-3.5 text-[#FCD34D]" /> Spesifikasi Sutradara
                </span>
                <span className="text-[10px] text-zinc-500">FRAME #{activeScene.id}</span>
              </div>
              <div className="flex flex-col gap-2 leading-relaxed">
                <p><strong className="text-slate-400">Judul:</strong> {activeScene.title}</p>
                <p><strong className="text-slate-400">Kamera:</strong> {activeScene.technicalSpecs.camera}</p>
                <p><strong className="text-slate-400">Pencahayaan:</strong> {activeScene.technicalSpecs.lighting}</p>
                <p><strong className="text-slate-400">Desain Suara:</strong> {activeScene.technicalSpecs.audio}</p>
                <p><strong className="text-slate-400">Vibe:</strong> {activeScene.technicalSpecs.vibe}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player UI Dashboard - Bottom Dock Controls */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-col gap-3 transition-opacity duration-300">
          
          {/* Timeline Seekbar Progress */}
          <div className="relative w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = ((e.clientX - rect.left) / rect.width) * 100;
            setProgress(pos);
          }}>
            <div 
              style={{ width: `${progress}%` }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-school-red to-[#D97706] transition-all duration-100 ease-out" 
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Play, Back, Next Navigation Dashboard */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="p-2 text-white hover:text-school-red disabled:text-slate-600 disabled:hover:text-slate-600 cursor-pointer transition-colors"
                title="Scene Sebelumnya"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button 
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-white hover:bg-[#FCD34D] text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
                title={isPlaying ? "Jeda" : "Putar Film"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>

              <button 
                onClick={handleNext}
                disabled={currentIdx === CINEMATIC_SCENES.length - 1}
                className="p-2 text-white hover:text-school-red disabled:text-slate-600 disabled:hover:text-slate-600 cursor-pointer transition-colors"
                title="Scene Selanjutnya"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button 
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Ulangi dari awal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Middle text indicator: Active Storyboard Description */}
            <div className="hidden md:flex flex-col items-center">
              <span className="text-white text-xs font-serif font-semibold tracking-wide text-center uppercase text-zinc-300">
                Studio: {activeScene.title}
              </span>
            </div>

            {/* Sound, specs, mic controls */}
            <div className="flex items-center gap-3">
              {/* Speed Button toggle */}
              <button 
                onClick={() => setPlaybackSpeed(prev => prev === 1 ? 0.7 : prev === 0.7 ? 1.3 : 1)}
                className="px-2 py-0.5 rounded border border-slate-700 font-mono text-[9px] text-[#FCD34D] hover:bg-slate-800 transition-colors cursor-pointer"
                title="Kecepatan Sinkronisasi"
              >
                {playbackSpeed === 0.7 ? "DRAMIS (0.7x)" : playbackSpeed === 1.3 ? "CEPAT (1.3x)" : "NORMAL (1.0x)"}
              </button>

              <button 
                onClick={() => setShowSpecs(!showSpecs)}
                className={`p-2 transition-all cursor-pointer ${showSpecs ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}
                title="Detail Kamera & Cahaya"
              >
                <Info className="w-4.5 h-4.5" />
              </button>

              <button 
                onClick={() => setNarrationOpen(!narrationOpen)}
                className={`p-2 transition-all cursor-pointer ${narrationOpen ? 'text-[#FCD34D]' : 'text-slate-400 hover:text-white'}`}
                title="Tampilkan Teks Narasi"
              >
                <span className="text-xs font-bold leading-none font-sans">SUB</span>
              </button>

              <button 
                onClick={handleMute}
                className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Bunyikan" : "Bisukan"}
              >
                {isMuted ? <VolumeX className="w-4.5 h-4.5 text-red-500" /> : <Volume2 className="w-4.5 h-4.5" />}
              </button>

              <button 
                onClick={handleFullScreen}
                className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Layar Penuh"
              >
                <Maximize2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Over Studio Controller - Glassmorphic design */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3.5">
          <div className="p-3.5 bg-red-600/10 text-red-600 border border-white rounded-xl flex items-center justify-center shadow-sm">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-800 text-base">Studio Pengisi Suara Mandiri</h3>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed font-semibold">
              Jadilah pengisi suara (dubber) film kelulusanmu! Rekam suaramu saat video berputar, lalu dengarkan hasilnya menyatu dengan musik piano & orkestra.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-red-900/40 transition-all select-none border border-white/40"
            >
              <CircleDot className="w-4.5 h-4.5 fill-white text-white" />
              Mulai Rekam Narasi
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-500 text-white border-2 border-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse"
            >
              <div className="w-3 h-3 bg-white rounded-sm" />
              Hentikan & Simpan
            </button>
          )}

          {audioUrl && (
            <div className="flex gap-2 w-full sm:w-auto">
              <audio src={audioUrl} controls className="h-8 max-w-[160px] xs:max-w-[200px]" />
              <button 
                onClick={() => {
                  setAudioUrl(null);
                  alert("Rekaman suara dihapus.");
                }} 
                className="px-2.5 py-1 text-slate-600 hover:text-red-600 text-xs border border-white rounded-lg hover:bg-white/50 font-bold cursor-pointer"
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Storyboard Navigation Thumbnails - Glassmorphic design */}
      <div className="bg-white/30 backdrop-blur-md p-5 border border-white/60 rounded-2xl shadow-xl">
        <h4 className="font-serif font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
          <Music className="w-3.5 h-3.5 text-red-600" /> Peta Narasi & Storyboard Sinematik
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {CINEMATIC_SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => {
                setCurrentIdx(idx);
                setProgress(0);
                onSceneChange?.(scene.id);
                // Speak if active
                if (isPlaying) {
                  handleSpeech(scene.narration);
                }
              }}
              className={`group relative text-left rounded-xl overflow-hidden border transition-all duration-300 aspect-video flex flex-col justify-end p-2 cursor-pointer ${
                idx === currentIdx 
                  ? "border-[#D97706] ring-2 ring-amber-500/20 bg-white/80" 
                  : "border-white/60 hover:border-slate-300 bg-white/20"
              }`}
            >
              {scene.image && (
                <img 
                  src={scene.image} 
                  alt={scene.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-905/90 via-slate-905/30 to-slate-905/10" />
              <div className="relative z-10">
                <p className="text-[9px] font-mono text-[#FCD34D]">SCENE 0{scene.id}</p>
                <h5 className="text-white text-[10px] font-medium leading-tight line-clamp-1 group-hover:text-amber-300">
                  {scene.title.split("&")[0].split(" ")[0]} ...
                </h5>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
