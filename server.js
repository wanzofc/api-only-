const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Swagger UI
const swaggerUi = require('swagger-ui-express');

app.use(express.json());
app.use(express.static(__dirname));

const formatParagraph = (text) => text ? text.replace(/\.\s+/g, ".\n\n") : "Tidak ada jawaban.";

// Konfigurasi Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'WANZOFC TECH API 🔥',
        version: '1.0.0',
        description: 'Dokumentasi API  WANZOFC TECH.',
    },
    servers: [
        {
            url: `https://only-awan.biz.id`, // Sesuaikan dengan URL server Anda
            description: 'Development server',
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    apis: ['./server.js'], // Path ke file utama server Anda
};

// Initialize swagger-jsdoc
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /kebijakan:
 *   get:
 *     summary: Menampilkan halaman kebijakan
 *     description: Mengirimkan file kebijakan.html
 *     responses:
 *       200:
 *         description: Berhasil mengirimkan file HTML.
 */
app.get("/kebijakan", (req, res) => {
    res.sendFile(path.join(__dirname, "kebijakan.html"));
});

// Route untuk mengakses index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * @openapi
 * /api/ai/deepseek-chat:
 *   get:
 *     summary: Menggunakan Deepseek Chat AI
 *     description: Mengembalikan respon dari Deepseek Chat AI berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan atau teks yang akan diproses oleh AI.
 *     responses:
 *       200:
 *         description: Respon sukses dari Deepseek Chat AI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan deskriptif.
 *                 data:
 *                   type: string
 *                   description: Hasil dari Deepseek Chat AI.
 *       500:
 *         description: Terjadi kesalahan pada server atau Deepseek Chat bermasalah.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan kesalahan.
 */
app.get('/api/ai/deepseek-chat', async (req, res) => {
    const query = req.query.content || "halo";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/deepseek-llm-67b-chat?content=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Deepseek Chat", data: formatParagraph(data?.data) });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Deepseek Chat bermasalah." });
    }
});

/**
 * @openapi
 * /api/ai/gemini-pro:
 *   get:
 *     summary: Menggunakan Gemini Pro AI
 *     description: Mengembalikan respon dari Gemini Pro AI berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan atau teks yang akan diproses oleh AI.
 *     responses:
 *       200:
 *         description: Respon sukses dari Gemini Pro AI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan deskriptif.
 *                 data:
 *                   type: string
 *                   description: Hasil dari Gemini Pro AI.
 *       500:
 *         description: Terjadi kesalahan pada server atau Gemini Pro bermasalah.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan kesalahan.
 */
app.get('/api/ai/gemini-pro', async (req, res) => {
    const query = req.query.content || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`);
        res.json
           ({ creator: "WANZOFC TECH",
             result: true, message: "Gemini Pro AI",
             data: formatParagraph(data?.data) });
    } catch {
        res.status(500).json
            ({ creator: "WANZOFC TECH",
              result: false, 
              message: "Gemini Pro bermasalah." });
    }
});

/**
 * @openapi
 * /api/ai/meta-llama:
 *   get:
 *     summary: Menggunakan Meta Llama AI
 *     description: Mengembalikan respon dari Meta Llama AI berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan atau teks yang akan diproses oleh AI.
 *     responses:
 *       200:
 *         description: Respon sukses dari Meta Llama AI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan deskriptif.
 *                 data:
 *                   type: string
 *                   description: Hasil dari Meta Llama AI.
 *       500:
 *         description: Terjadi kesalahan pada server atau Meta Llama bermasalah.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan kesalahan.
 */
app.get('/api/ai/meta-llama', async (req, res) => {
    const query = req.query.content || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Meta Llama", data: formatParagraph(data?.data) });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Meta Llama bermasalah." });
    }
});

/**
 * @openapi
 * /api/ai/dbrx-instruct:
 *   get:
 *     summary: Menggunakan DBRX Instruct AI
 *     description: Mengembalikan respon dari DBRX Instruct AI berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan atau teks yang akan diproses oleh AI.
 *     responses:
 *       200:
 *         description: Respon sukses dari DBRX Instruct AI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan deskriptif.
 *                 data:
 *                   type: string
 *                   description: Hasil dari DBRX Instruct AI.
 *       500:
 *         description: Terjadi kesalahan pada server atau DBRX Instruct bermasalah.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan kesalahan.
 */
app.get('/api/ai/dbrx-instruct', async (req, res) => {
    const query = req.query.content || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/dbrx-instruct?content=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "DBRX Instruct", data: formatParagraph(data?.data) });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "DBRX Instruct bermasalah." });
    }
});

/**
 * @openapi
 * /api/ai/deepseek-r1:
 *   get:
 *     summary: Menggunakan Deepseek R1 AI
 *     description: Mengembalikan respon dari Deepseek R1 AI berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan atau teks yang akan diproses oleh AI.
 *     responses:
 *       200:
 *         description: Respon sukses dari Deepseek R1 AI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan deskriptif.
 *                 data:
 *                   type: string
 *                   description: Hasil dari Deepseek R1 AI.
 *       500:
 *         description: Terjadi kesalahan pada server atau Deepseek R1 bermasalah.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan kesalahan.
 */
app.get('/api/ai/deepseek-r1', async (req, res) => {
    const query = req.query.content || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/deepseek-r1?content=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Deepseek R1", data: formatParagraph(data?.data) });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Deepseek R1 bermasalah." });
    }
});

/**
 * @openapi
 * /api/gita:
 *   get:
 *     summary: Berinteraksi dengan Gita AI
 *     description: Mengembalikan respon dari Gita AI berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Pertanyaan atau teks yang akan diproses oleh AI Gita.
 *     responses:
 *       200:
 *         description: Respon sukses dari Gita AI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan deskriptif.
 *                 data:
 *                   type: string
 *                   description: Hasil dari Gita AI.
 *       500:
 *         description: Terjadi kesalahan pada server atau Gita AI bermasalah.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 result:
 *                   type: boolean
 *                   description: Status keberhasilan permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan kesalahan.
 */
app.get('/api/gita', async (req, res) => {
    const query = req.query.q || "apa itu dosa";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/gita?q=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Gita AI", data: formatParagraph(data?.data) });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gita AI bermasalah." });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Swagger UI tersedia di http://localhost:${PORT}/api-docs`);
});
