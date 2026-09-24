import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

// Body parser with high limit for audio payloads
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize GoogleGenAI with server-side API key if available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

// Audio transcription endpoint
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'audioData is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'ระบบถอดความบนเซิร์ฟเวอร์ไม่ได้เปิดใช้งาน (ไม่มี GEMINI_API_KEY) กรุณาใช้ระบบแปลงเสียงพูดสดในเบราว์เซอร์',
      });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioData, // base64 encoded string
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'ถอดความบันทึกเสียงนี้เป็นข้อความภาษาไทยอย่างถูกต้อง ชัดเจน และคงศัพท์ทางการแพทย์/จิตเวชอย่างแม่นยำ (Transcribe this clinical psychiatric audio accurately in Thai)',
          },
        ],
      },
    });

    const transcribedText = response.text || '';
    res.json({ text: transcribedText });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to transcribe audio with gemini-3.5-transcribe',
    });
  }
});

// Health check endpoint for Cloud Run
app.get('/api/health', (_req, res) => {
  res.status(200).send('OK');
});

// Mount Vite in dev or serve static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('.', 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
