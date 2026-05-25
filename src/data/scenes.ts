import { CinematicScene } from "../types";

export const CINEMATIC_SCENES: CinematicScene[] = [
  {
    id: 1,
    title: "Sinar Pagi di SDN Karang Anyar 01 Pagi",
    description: "Matahari pagi menyinari sekolah dasar Indonesia. Siswa berjalan ke sekolah membawa tas dengan semangat tinggi. Guru menyambut hangat di gerbang depan sekolah.",
    narration: "Mentari pagi telah terbit menyertai senyuman para guru yang menanti penuh kasih di depan gerbang SDN Karang Anyar 01 Pagi. Di sinilah langkah pertama cita-cita luhur kita dimulai.",
    image: "/src/assets/images/scene1_sunrise_1779711960271.png",
    technicalSpecs: {
      camera: "Wide Shot, Slow Pan Left, Ken Burns Zoom",
      lighting: "Golden Hour, Warm morning sun rays (lens flare effect)",
      audio: "Suasana pagi ceria, kicau burung lembut, synth pad chord A Minor",
      vibe: "Warm, Optimistic, Nostalgic"
    }
  },
  {
    id: 2,
    title: "Ruang Kelas & Kebersamaan",
    description: "Suasana belajar mengajar interaktif di kelas: membaca buku, menulis, berdiskusi kelompok, olahraga di lapangan, kerja sama, saling membantu teman.",
    narration: "Bukan sekadar ilmu dari lembaran buku, namun kebersamaan dalam canda tawa, kegigihan berdiskusi kelompok, dan kepedulian tulus membantu sesama teman di kala sulit.",
    image: "/src/assets/images/scene2_classroom_1779711982971.png",
    technicalSpecs: {
      camera: "Medium Close Up focusing on laughing child, tracking movement",
      lighting: "Soft Interior Light diffused through window",
      audio: "Suara riuh tawa anak-anak samar, orkestrasi piano & string chord F Mayor",
      vibe: "Intimate, Friendly, Educational"
    }
  },
  {
    id: 3,
    title: "Pilar Karakter & Budi Pekerti Mulia",
    description: "Pendidikan budi pekerti luhur: bersalaman takzim dengan bapak/ibu guru dan orang tua, berdoa khusyuk, membersihkan kelas bersama, menunjukkan kejujuran.",
    narration: "Belajar untuk berbakti dan berakhlak mulia. Berjabat tangan takzim mencium jemari bapak ibu guru serta orang tua kita. Bersatulah dalam kebersihan, jujur bersikap, dan bertanggung jawab.",
    image: "/src/assets/images/scene3_respect_1779712004066.png",
    technicalSpecs: {
      camera: "Over-the-shoulder shot, shallow depth of field, slow dolly in",
      lighting: "Warm sunset backlight creating halo glow around gestures",
      audio: "Orkestra hening, lonceng angin berdentang lembut, pad chord C Mayor",
      vibe: "Serene, Deeply Emotional, Respectful"
    }
  },
  {
    id: 4,
    title: "Hari Kemenangan & Kelulusan",
    description: "Momen kelulusan wisuda penuh kebanggaan dan air mata haru. Kepala sekolah dan guru bertepuk tangan gembira, orang tua tersenyum, siswa saling merangkul erat.",
    narration: "Satu babak telah usai dengan kebanggaan yang mengalir bersama air mata keharuan orang tua kita. Terima kasih Bapak Ibu Guru yang telah membimbing kami selama enam tahun penuh cinta.",
    image: "/src/assets/images/scene4_graduation_1779712022276.png",
    technicalSpecs: {
      camera: "Extreme High Angle establishing shot panning down to hugs, teary close ups",
      lighting: "Festive interior lights, warm and glowing",
      audio: "Tepuk tangan gembira riuh rendah, harmoni crescendos pada violins chord G Mayor",
      vibe: "Celebratory, Triumphant, Deeply Touching"
    }
  },
  {
    id: 5,
    title: "Melangitkan Cita-Cita Setinggi Angkasa",
    description: "Visualisasi mimpi masa depan dari para siswa: membayangkan diri mereka menjadi dokter, guru pendidik, atlet berprestasi, polisi pengayom, ilmuwan penemu, dan pilot penerbang.",
    narration: "Tantangan masa depan terbentang luas mendamba pengabdianmu. Menjadi dokter penyembuh lara, guru pengukir jiwa, polisi penegak keadilan, atau penerbang yang menembus cakrawala.",
    image: "/src/assets/images/scene5_dreams_1779712040654.png",
    technicalSpecs: {
      camera: "Dutch Angle split screen fantasy collage with light leaks and particle sparkles",
      lighting: "Vibrant fantasy blue and golden light highlights, ethereal stars",
      audio: "Wind-chimes, strings lifting to crescendo, piano melody high pitch octaves",
      vibe: "Inspirational, Fantasy, Cosmic, Heroic"
    }
  },
  {
    id: 6,
    title: "Awal Pengabdian Bagi Bangsa Indonesia",
    description: "Seluruh siswa kelas 6 berdiri tegak penuh rasa khidmat di halaman tengah sekolah. Bendera Sang Merah Putih berkibar megah ditiup angin sore di bawah langit cerah nan biru.",
    narration: "Kelulusan bukan akhir perjalanan, tetapi awal menuju cita-cita besar. Teruslah belajar, hormati orang tua dan guru, jadilah anak yang berbudi luhur dan berakhlak mulia. Kalian adalah harapan bangsa Indonesia.",
    image: "/src/assets/images/scene6_ending_1779712062526.png",
    technicalSpecs: {
      camera: "Static majestically low angle epic shot looking up to waving flag & children",
      lighting: "Brilliant daylight, hyper-real blue and saturated red colors",
      audio: "Suara kibaran bendera bergemuruh, orchestra penuh melodi klimaks Am/C/G/F",
      vibe: "Patriotic, Heroic, Eternal Hope"
    }
  }
];
