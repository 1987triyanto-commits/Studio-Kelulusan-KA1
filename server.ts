import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Get personalized graduation story & career message from Gemini
  app.post("/api/dream-advice", async (req, res) => {
    try {
      const { studentName, dreamProfession, customPledge, customInterests } = req.body;

      if (!studentName || !dreamProfession) {
        return res.status(400).json({ error: "Nama siswa dan cita-cita wajib diisi." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback response when API key is missing, so it doesn't crash on startup
        return res.json({
          advice: `Halo ${studentName}! Selamat atas kelulusanmu dari SDN Karang Anyar 01 Pagi! Kamu bercita-cita menjadi seorang ${dreamProfession}. Sungguh mulia sekali mimpi itu. Teruslah belajar dengan tekun, hargai guru dan orang tuamu, serta jadilah anak yang jujur, disiplin, dan berakhlak mulia. Ingatlah bahwa kelulusan SD ini adalah awal petualangan hebatmu ke depan. Teruslah melangkah dengan bangga!`,
          verse: "Tuntutlah ilmu demi masa depan yang gemilang, tunjukkan akhlak mulia dalam setiap perbuatan."
        });
      }

      // Initialize Google Gen AI
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemPrompt = `Anda adalah Guru dan Kepala Sekolah yang bijaksana, penuh kasih di SDN Karang Anyar 01 Pagi, Jakarta Pusat, Indonesia.
Tuliskan surat pesan/amanat kelulusan yang sangat menyentuh hati, inspiratif, penuh nuansa emosional, kehangatan, dan memotivasi untuk siswa alumni bernama "${studentName}" yang bercita-cita menjadi "${dreamProfession}".
Gunakan Bahasa Indonesia yang sangat hangat, bersahabat, mendidik, dan memicu semangat tinggi.

Instruksi khusus:
1. Sapa siswa tersebut dengan nama "${studentName}" secara lembut di awal paragraf dan tunjukkan kebanggaan yang mendalam.
2. Apresiasi usahanya yang gigih selama 6 tahun bersekolah di SDN Karang Anyar 01 Pagi.
3. Berikan nasihat karir spesifik & inspiratif untuk meraih cita-citanya menjadi seorang "${dreamProfession}", disisipkan cara mengamalkannya dengan budi luhur, berakhlak mulia, disiplin, jujur, serta hormat dan taat pada guru serta orang tua.
4. Jika ada minat tambahan/hobi: "${customInterests || 'tidak ada'}" dan janji ikrar karakter: "${customPledge || 'tidak ada'}", kaitkan secara halus ke dalam surat tsb.
5. Tekankan bahwa berbakti kepada orang tua adalah kunci utama keberkahan ilmunya.
6. Buat tulisan dalam minimal 3-4 paragraf yang sangat apik dan mudah dibaca.

Format respon Anda harus strictly berupa objek JSON dengan struktur:
{
  "advice": "Teks lengkap dalam bentuk paragraf-paragraf indah (minimal 3 paragraf). Gunakan newline \\n untuk memisahkan paragraf.",
  "verse": "Satu baris kata-kata mutiara singkat, puitis, dan sangat berkarakter untuk masa depannya."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: systemPrompt },
          { text: `Siswa: ${studentName}, Karir: ${dreamProfession}, Hobi: ${customInterests || 'Tidak spesifik'}, Janji: ${customPledge || 'Budi pekerti luhur'}` }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No text returned from Gemini API");
      }

      try {
        const parsed = JSON.parse(responseText.trim());
        return res.json(parsed);
      } catch (e) {
        // Safe parsing fallback when the output isn't clean JSON
        return res.json({
          advice: responseText,
          verse: "Gantungkan cita-citamu setinggi langit! Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang."
        });
      }

    } catch (err: any) {
      console.error("Error generating advice:", err);
      res.status(500).json({ error: "Gagal memproses amanah kelulusan. Silakan coba beberapa saat lagi." });
    }
  });

  // Serve static files and handle routing based on environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
