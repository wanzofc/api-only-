const express = require('express');
const axios = require('axios');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc'); // Dihapus

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(__dirname));

const formatParagraph = (text) => text ? text.replace(/\.\s+/g, ".\n\n") : "Tidak ada jawaban.";

// Swagger definition
const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'WANZOFC TECH API Documentation',
        version: '1.0.0',
        description: 'Dokumentasi API untuk berbagai endpoint yang disediakan oleh WANZOFC TECH.',
    },
    servers: [
        {
            url: `http://localhost:${PORT}`, // Gunakan template literal untuk PORT
            description: 'Development server',
        },
    ],
    paths: {
        '/kebijakan': {
            get: {
                summary: 'Menampilkan halaman kebijakan.',
                description: 'Endpoint ini menampilkan halaman kebijakan dari server.',
                responses: {
                    200: {
                        description: 'Halaman kebijakan berhasil ditampilkan.',
                    },
                },
            },
        },
         '/api/ai/deepseek-chat': {
            get: {
                summary: 'Mengakses Deepseek Chat AI.',
                description: 'Mengirimkan pertanyaan ke Deepseek Chat AI dan menerima jawabannya.',
                parameters: [
                    {
                        in: 'query',
                        name: 'content',
                        schema: {
                            type: 'string'
                        },
                        description: 'Pertanyaan yang ingin diajukan ke AI.'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Respons dari Deepseek Chat AI.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        creator: {
                                            type: 'string',
                                            description: 'Nama pembuat API.'
                                        },
                                        result: {
                                            type: 'boolean',
                                            description: 'Status permintaan.'
                                        },
                                        message: {
                                            type: 'string',
                                            description: 'Pesan respons.'
                                        },
                                        data: {
                                            type: 'string',
                                            description: 'Jawaban dari Deepseek Chat AI.'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Terjadi kesalahan pada Deepseek Chat.'
                    }
                }
            }
        },
    },
};

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * /kebijakan:
 *   get:
 *     summary: Menampilkan halaman kebijakan.
 *     description: Endpoint ini menampilkan halaman kebijakan dari server.
 *     responses:
 *       200:
 *         description: Halaman kebijakan berhasil ditampilkan.
 */
app.get("/kebijakan", (req, res) => {
    res.sendFile(path.join(__dirname, "kebijakan.html"));
});

/**
 * @swagger
 * /docs:
 *   get:
 *     summary: Menampilkan dokumentasi API.
 *     description: Endpoint ini menampilkan halaman dokumentasi API menggunakan Swagger UI.
 *     responses:
 *       200:
 *         description: Halaman dokumentasi API berhasil ditampilkan.
 */
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs.html'));
});

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Menampilkan halaman login.
 *     description: Endpoint ini menampilkan halaman login dari server.
 *     responses:
 *       200:
 *         description: Halaman login berhasil ditampilkan.
 */
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

/**
 * @swagger
 * /daftar:
 *   get:
 *     summary: Menampilkan halaman pendaftaran.
 *     description: Endpoint ini menampilkan halaman pendaftaran (saat ini menggunakan halaman login).
 *     responses:
 *       200:
 *         description: Halaman pendaftaran berhasil ditampilkan.
 */
app.get('/daftar', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

/**
 * @swagger
 * /api/ai/deepseek-chat:
 *   get:
 *     summary: Mengakses Deepseek Chat AI.
 *     description: Mengirimkan pertanyaan ke Deepseek Chat AI dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan yang ingin diajukan ke AI.
 *     responses:
 *       200:
 *         description: Respons dari Deepseek Chat AI.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Jawaban dari Deepseek Chat AI.
 *       500:
 *         description: Terjadi kesalahan pada Deepseek Chat.
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
 * @swagger
 * /api/ai/image2text:
 *   get:
 *     summary: Mengkonversi gambar menjadi teks.
 *     description: Menggunakan AI untuk mengkonversi gambar dari URL default menjadi teks.
 *     responses:
 *       200:
 *         description: Teks hasil konversi gambar.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Teks hasil konversi.
 *       500:
 *         description: Terjadi kesalahan pada Image to Text.
 */
app.get('/api/ai/image2text', async (req, res) => {
    try {
        const { data } = await axios.get("https://api.siputzx.my.id/api/ai/image2text?url=https://cataas.com/cat");
        res.json({ creator: "WANZOFC TECH", result: true, message: "Image to Text", data: formatParagraph(data?.data) });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Image to Text bermasalah." });
    }
});

/**
 * @swagger
 * /api/ai/gemini-pro:
 *   get:
 *     summary: Mengakses Gemini Pro AI.
 *     description: Mengirimkan pertanyaan ke Gemini Pro AI dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan yang ingin diajukan ke AI.
 *     responses:
 *       200:
 *         description: Respons dari Gemini Pro AI.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Jawaban dari Gemini Pro AI.
 *       500:
 *         description: Terjadi kesalahan pada Gemini Pro.
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
 * @swagger
 * /api/ai/meta-llama:
 *   get:
 *     summary: Mengakses Meta Llama AI.
 *     description: Mengirimkan pertanyaan ke Meta Llama AI dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan yang ingin diajukan ke AI.
 *     responses:
 *       200:
 *         description: Respons dari Meta Llama AI.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Jawaban dari Meta Llama AI.
 *       500:
 *         description: Terjadi kesalahan pada Meta Llama.
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
 * @swagger
 * /api/ai/dbrx-instruct:
 *   get:
 *     summary: Mengakses DBRX Instruct AI.
 *     description: Mengirimkan pertanyaan ke DBRX Instruct AI dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan yang ingin diajukan ke AI.
 *     responses:
 *       200:
 *         description: Respons dari DBRX Instruct AI.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Jawaban dari DBRX Instruct AI.
 *       500:
 *         description: Terjadi kesalahan pada DBRX Instruct.
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
 * @swagger
 * /api/ai/deepseek-r1:
 *   get:
 *     summary: Mengakses Deepseek R1 AI.
 *     description: Mengirimkan pertanyaan ke Deepseek R1 AI dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Pertanyaan yang ingin diajukan ke AI.
 *     responses:
 *       200:
 *         description: Respons dari Deepseek R1 AI.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Jawaban dari Deepseek R1 AI.
 *       500:
 *         description: Terjadi kesalahan pada Deepseek R1.
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
 * @swagger
 * /api/gita:
 *   get:
 *     summary: Mengakses Gita AI.
 *     description: Mengirimkan pertanyaan ke Gita AI dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Pertanyaan yang ingin diajukan ke AI.
 *     responses:
 *       200:
 *         description: Respons dari Gita AI.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Jawaban dari Gita AI.
 *       500:
 *         description: Terjadi kesalahan pada Gita AI.
 */
app.get('/api/gita', async (req, res) => {
    const query = req.query.q || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/gita?q=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Gita AI", data: formatParagraph(data?.data) });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gita AI bermasalah." });
    }
});

/**
 * @swagger
 * /api/anime/latest:
 *   get:
 *     summary: Mendapatkan daftar anime terbaru.
 *     description: Mengambil daftar anime terbaru dari sumber yang ditentukan.
 *     responses:
 *       200:
 *         description: Daftar anime terbaru berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Detail anime.
 *       500:
 *         description: Terjadi kesalahan saat mengambil daftar anime terbaru.
 */
app.get('/api/anime/latest', async (req, res) => {
    try {
        const { data } = await axios.get("https://api.siputzx.my.id/api/anime/latest");
        res.json({ creator: "WANZOFC TECH", result: true, message: "Anime Terbaru", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Anime Terbaru bermasalah." });
    }
});

/**
 * @swagger
 * /api/anime/anichin-episode:
 *   get:
 *     summary: Mendapatkan episode dari Anichin.
 *     description: Mengambil informasi episode anime dari Anichin berdasarkan URL yang diberikan.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL episode Anichin yang ingin diambil informasinya.
 *     responses:
 *       200:
 *         description: Informasi episode Anichin berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Detail episode Anichin.
 *       400:
 *         description: Parameter URL tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil episode Anichin.
 */
app.get('/api/anime/anichin-episode', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Tolong tambahkan parameter 'url'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-episode?url=${encodeURIComponent(url)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Anichin Episode", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Anichin Episode bermasalah." });
    }
});

/**
 * @swagger
 * /api/d/mediafire:
 *   get:
 *     summary: Mengunduh file dari MediaFire.
 *     description: Mengunduh file dari MediaFire berdasarkan URL yang diberikan.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL MediaFire yang ingin diunduh.
 *     responses:
 *       200:
 *         description: File dari MediaFire berhasil diunduh.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi unduhan MediaFire.
 *       400:
 *         description: Parameter URL tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengunduh dari MediaFire.
 */
app.get('/api/d/mediafire', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Tambahkan parameter 'url'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "MediaFire Downloader", data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "MediaFire Downloader bermasalah." });
    }
});

/**
 * @swagger
 * /api/r/blue-archive:
 *   get:
 *     summary: Mendapatkan gambar acak dari Blue Archive.
 *     description: Mengambil gambar acak dari Blue Archive.
 *     responses:
 *       200:
 *         description: Gambar acak Blue Archive berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi gambar Blue Archive.
 *       500:
 *         description: Terjadi kesalahan saat mengambil gambar Blue Archive.
 */
app.get('/api/r/blue-archive', async (req, res) => {
    try {
        const { data } = await axios.get("https://api.siputzx.my.id/api/r/blue-archive");
        res.json({ creator: "WANZOFC TECH", result: true, message: "Random Blue Archive Image", data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil gambar Blue Archive." });
    }
});

/**
 * @swagger
 * /api/r/quotesanime:
 *   get:
 *     summary: Mendapatkan kutipan anime acak.
 *     description: Mengambil kutipan anime acak.
 *     responses:
 *       200:
 *         description: Kutipan anime acak berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Kutipan anime.
 *       500:
 *         description: Terjadi kesalahan saat mengambil kutipan anime.
 */
app.get('/api/r/quotesanime', async (req, res) => {
    try {
        const { data } = await axios.get("https://api.siputzx.my.id/api/r/quotesanime");
        res.json({ creator: "WANZOFC TECH", result: true, message: "Random Anime Quotes", data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil quote anime." });
    }
});

/**
 * @swagger
 * /api/d/tiktok:
 *   get:
 *     summary: Mengunduh video dari TikTok.
 *     description: Mengunduh video dari TikTok berdasarkan URL yang diberikan.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL video TikTok yang ingin diunduh.
 *     responses:
 *       200:
 *         description: Video TikTok berhasil diunduh.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi unduhan TikTok.
 *       400:
 *         description: Parameter URL tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengunduh dari TikTok.
 */
app.get('/api/d/tiktok', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ result: false, message: "Tambahkan parameter 'url'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/tiktok?url=${encodeURIComponent(url)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "TikTok Downloader", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "TikTok Downloader bermasalah." });
    }
});

/**
 * @swagger
 * /api/d/igdl:
 *   get:
 *     summary: Mengunduh media dari Instagram.
 *     description: Mengunduh media dari Instagram berdasarkan URL yang diberikan.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL Instagram yang ingin diunduh medianya.
 *     responses:
 *       200:
 *         description: Media Instagram berhasil diunduh.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi unduhan Instagram.
 *       400:
 *         description: Parameter URL tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengunduh dari Instagram.
 */
app.get('/api/d/igdl', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ result: false, message: "Tambahkan parameter 'url'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Instagram Downloader", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Instagram Downloader bermasalah." });
    }
});

/**
 * @swagger
 * /api/d/snackvideo:
 *   get:
 *     summary: Mengunduh video dari SnackVideo.
 *     description: Mengunduh video dari SnackVideo berdasarkan URL yang diberikan.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL video SnackVideo yang ingin diunduh.
 *     responses:
 *       200:
 *         description: Video SnackVideo berhasil diunduh.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi unduhan SnackVideo.
 *       400:
 *         description: Parameter URL tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengunduh dari SnackVideo.
 */
app.get('/api/d/snackvideo', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ result: false, message: "Tambahkan parameter 'url'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/d/snackvideo?url=${encodeURIComponent(url)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "SnackVideo Downloader", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "SnackVideo Downloader bermasalah." });
    }
});

/**
 * @swagger
 * /api/d/capcut:
 *   get:
 *     summary: Mengunduh template CapCut.
 *     description: Mengunduh template CapCut berdasarkan URL yang diberikan.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL template CapCut yang ingin diunduh.
 *     responses:
 *       200:
 *         description: Template CapCut berhasil diunduh.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi unduhan template CapCut.
 *       400:
 *         description: Parameter URL tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengunduh template CapCut.
 */
app.get('/api/d/capcut', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ result: false, message: "Tambahkan parameter 'url'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/d/capcut?url=${encodeURIComponent(url)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "CapCut Template Downloader", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "CapCut Template Downloader bermasalah." });
    }
});

/**
 * @swagger
 * /api/stalk/youtube:
 *   get:
 *     summary: Mendapatkan informasi profil YouTube.
 *     description: Mendapatkan informasi profil YouTube berdasarkan username yang diberikan.
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username YouTube yang ingin dicari informasinya.
 *     responses:
 *       200:
 *         description: Informasi profil YouTube berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi profil YouTube.
 *       400:
 *         description: Parameter username tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mencari informasi profil YouTube.
 */
app.get('/api/stalk/youtube', async (req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ result: false, message: "Tambahkan parameter 'username'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(username)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "YouTube Stalker", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "YouTube Stalker bermasalah." });
    }
});

/**
 * @swagger
 * /api/stalk/tiktok:
 *   get:
 *     summary: Mendapatkan informasi profil TikTok.
 *     description: Mendapatkan informasi profil TikTok berdasarkan username yang diberikan.
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username TikTok yang ingin dicari informasinya.
 *     responses:
 *       200:
 *         description: Informasi profil TikTok berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi profil TikTok.
 *       400:
 *         description: Parameter username tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mencari informasi profil TikTok.
 */
app.get('/api/stalk/tiktok', async (req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ result: false, message: "Tambahkan parameter 'username'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(username)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "TikTok Stalker", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "TikTok Stalker bermasalah." });
    }
});

/**
 * @swagger
 * /api/stalk/github:
 *   get:
 *     summary: Mendapatkan informasi profil GitHub.
 *     description: Mendapatkan informasi profil GitHub berdasarkan username yang diberikan.
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: Username GitHub yang ingin dicari informasinya.
 *     responses:
 *       200:
 *         description: Informasi profil GitHub berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi profil GitHub.
 *       400:
 *         description: Parameter user tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mencari informasi profil GitHub.
 */
app.get('/api/stalk/github', async (req, res) => {
    const user = req.query.user;
    if (!user) return res.status(400).json({ result: false, message: "Tambahkan parameter 'user'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/github?user=${encodeURIComponent(user)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "GitHub Stalker", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "GitHub Stalker bermasalah." });
    }
});

/**
 * @swagger
 * /api/s/tiktok:
 *   get:
 *     summary: Mencari video di TikTok.
 *     description: Mencari video di TikTok berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Query pencarian TikTok.
 *     responses:
 *       200:
 *         description: Hasil pencarian TikTok berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pencarian TikTok.
 *       400:
 *         description: Parameter query tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mencari video di TikTok.
 */
app.get('/api/s/tiktok', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ result: false, message: "Tambahkan parameter 'query'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/tiktok?query=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "TikTok Search", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "TikTok Search bermasalah." });
    }
});

/**
 * @swagger
 * /api/ai/uncovr:
 *   get:
 *     summary: Menggunakan AI Uncovr Chat.
 *     description: Mengirimkan konten ke AI Uncovr Chat dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         required: true
 *         description: Konten yang ingin dikirimkan ke AI.
 *     responses:
 *       200:
 *         description: Respons dari AI Uncovr Chat.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Jawaban dari AI Uncovr Chat.
 *       400:
 *         description: Parameter content tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan pada AI Uncovr Chat.
 */
app.get('/api/ai/uncovr', async (req, res) => {
    const content = req.query.content;
    if (!content) return res.status(400).json({ result: false, message: "Tambahkan parameter 'content'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/uncovr?content=${encodeURIComponent(content)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "AI - Uncovr Chat", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "AI - Uncovr Chat bermasalah." });
    }
});

/**
 * @swagger
 * /api/ai/wanzofc:
 *   get:
 *     summary: Menggunakan AI wanzofc.
 *     description: Mengirimkan teks ke AI wanzofc dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: Teks yang ingin dikirimkan ke AI.
 *     responses:
 *       200:
 *         description: Respons dari AI wanzofc.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Jawaban dari AI wanzofc.
 *       400:
 *         description: Parameter text tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan pada AI wanzofc.
 */
app.get('/api/ai/wanzofc', async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).json({ result: false, message: "Tambahkan parameter 'text'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/yousearch?text=${encodeURIComponent(text)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "AI - wanzofc", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "AI - wanzofc bermasalah." });
    }
});

/**
 * @swagger
 * /api/anime/otakudesu/search:
 *   get:
 *     summary: Mencari anime di Otakudesu.
 *     description: Mencari anime di Otakudesu berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: s
 *         schema:
 *           type: string
 *         required: true
 *         description: Query pencarian anime Otakudesu.
 *     responses:
 *       200:
 *         description: Hasil pencarian anime Otakudesu berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pencarian anime Otakudesu.
 *       400:
 *         description: Parameter s tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mencari anime di Otakudesu.
 */
app.get('/api/anime/otakudesu/search', async (req, res) => {
    const s = req.query.s;
    if (!s) return res.status(400).json({ result: false, message: "Tambahkan parameter 's'." });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/anime/otakudesu/search?s=${encodeURIComponent(s)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Anime - Otakudesu Search", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Anime - Otakudesu Search bermasalah." });
    }
});

/**
 * @swagger
 * /api/d/savefrom:
 *   get:
 *     summary: Mengunduh video dari SaveFrom.
 *     description: Mengunduh video dari SaveFrom berdasarkan URL yang diberikan.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL video SaveFrom yang ingin diunduh.
 *     responses:
 *       200:
 *         description: Video SaveFrom berhasil diunduh.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi unduhan SaveFrom.
 *       400:
 *         description: Parameter url tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengunduh dari SaveFrom.
 */
app.get('/api/d/savefrom', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ result: false, message: "Tambahkan parameter 'url'." });
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/d/savefrom?url=${encodeURIComponent(url)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Downloader - SaveFrom", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Downloader - SaveFrom bermasalah." });
    }
});

/**
 * @swagger
 * /api/d/github:
 *   get:
 *     summary: Mengunduh repositori dari GitHub.
 *     description: Mengunduh repositori dari GitHub berdasarkan URL yang diberikan.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL repositori GitHub yang ingin diunduh.
 *     responses:
 *       200:
 *         description: Repositori GitHub berhasil diunduh.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi unduhan repositori GitHub.
 *       400:
 *         description: Parameter url tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengunduh dari GitHub.
 */
app.get('/api/d/github', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ result: false, message: "Tambahkan parameter 'url'." });
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/d/github?url=${encodeURIComponent(url)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Downloader - GitHub Repository", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Downloader - GitHub Repository bermasalah." });
    }
});

/**
 * @swagger
 * /api/info/jadwaltv:
 *   get:
 *     summary: Mendapatkan jadwal TV.
 *     description: Mendapatkan jadwal TV dari sumber yang ditentukan.
 *     responses:
 *       200:
 *         description: Jadwal TV berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi jadwal TV.
 *       500:
 *         description: Terjadi kesalahan saat mengambil jadwal TV.
 */
app.get('/api/info/jadwaltv', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/info/jadwaltv`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Informasi - Jadwal TV", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Informasi - Jadwal TV bermasalah." });
    }
});

/**
 * @swagger
 * /api/info/liburnasional:
 *   get:
 *     summary: Mendapatkan daftar hari libur nasional.
 *     description: Mendapatkan daftar hari libur nasional dari sumber yang ditentukan.
 *     responses:
 *       200:
 *         description: Daftar hari libur nasional berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi hari libur nasional.
 *       500:
 *         description: Terjadi kesalahan saat mengambil daftar hari libur nasional.
 */
app.get('/api/info/liburnasional', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/info/liburnasional`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Informasi - Hari Libur Nasional", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Informasi - Hari Libur Nasional bermasalah." });
    }
});

/**
 * @swagger
 * /api/info/bmkg:
 *   get:
 *     summary: Mendapatkan informasi dari BMKG.
 *     description: Mendapatkan informasi dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika).
 *     responses:
 *       200:
 *         description: Informasi BMKG berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi dari BMKG.
 *       500:
 *         description: Terjadi kesalahan saat mengambil informasi dari BMKG.
 */
app.get('/api/info/bmkg', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/info/bmkg`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Informasi - BMKG", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Informasi - BMKG bermasalah." });
    }
});

/**
 * @swagger
 * /api/info/cuaca:
 *   get:
 *     summary: Mendapatkan informasi cuaca.
 *     description: Mendapatkan informasi cuaca dari sumber yang ditentukan.
 *     responses:
 *       200:
 *         description: Informasi cuaca berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi cuaca.
 *       500:
 *         description: Terjadi kesalahan saat mengambil informasi cuaca.
 */
app.get('/api/info/cuaca', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/info/cuaca`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Informasi - Cuaca", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Informasi - Cuaca bermasalah." });
    }
});

/**
 * @swagger
 * /api/s/gitagram:
 *   get:
 *     summary: Melakukan pencarian di Gitagram.
 *     description: Melakukan pencarian di Gitagram.
 *     responses:
 *       200:
 *         description: Hasil pencarian Gitagram berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pencarian dari Gitagram.
 *       500:
 *         description: Terjadi kesalahan saat melakukan pencarian di Gitagram.
 */
app.get('/api/s/gitagram', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/gitagram`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Search - Gitagram", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Search - Gitagram bermasalah." });
    }
});

/**
 * @swagger
 * /api/s/duckduckgo:
 *   get:
 *     summary: Melakukan pencarian di DuckDuckGo.
 *     description: Melakukan pencarian di DuckDuckGo.
 *     responses:
 *       200:
 *         description: Hasil pencarian DuckDuckGo berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pencarian dari DuckDuckGo.
 *       500:
 *         description: Terjadi kesalahan saat melakukan pencarian di DuckDuckGo.
 */
app.get('/api/s/duckduckgo', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/duckduckgo`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Search - DuckDuckGo", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Search - DuckDuckGo bermasalah." });
    }
});

/**
 * @swagger
 * /api/s/combot:
 *   get:
 *     summary: Melakukan pencarian di Combot.
 *     description: Melakukan pencarian di Combot.
 *     responses:
 *       200:
 *         description: Hasil pencarian Combot berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pencarian dari Combot.
 *       500:
 *         description: Terjadi kesalahan saat melakukan pencarian di Combot.
 */
app.get('/api/s/combot', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/combot`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Search - Combot", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Search - Combot bermasalah." });
    }
});

/**
 * @swagger
 * /api/s/bukalapak:
 *   get:
 *     summary: Melakukan pencarian di Bukalapak.
 *     description: Melakukan pencarian di Bukalapak.
 *     responses:
 *       200:
 *         description: Hasil pencarian Bukalapak berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pencarian dari Bukalapak.
 *       500:
 *         description: Terjadi kesalahan saat melakukan pencarian di Bukalapak.
 */
app.get('/api/s/bukalapak', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/bukalapak`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Search - Bukalapak", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Search - Bukalapak bermasalah." });
    }
});

/**
 * @swagger
 * /api/s/brave:
 *   get:
 *     summary: Melakukan pencarian di Brave.
 *     description: Melakukan pencarian di Brave.
 *     responses:
 *       200:
 *         description: Hasil pencarian Brave berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pencarian dari Brave.
 *       500:
 *         description: Terjadi kesalahan saat melakukan pencarian di Brave.
 */
app.get('/api/s/brave', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/brave`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Search - Brave", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Search - Brave bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/kompas:
 *   get:
 *     summary: Mendapatkan berita dari Kompas.
 *     description: Mendapatkan berita dari Kompas.
 *     responses:
 *       200:
 *         description: Berita dari Kompas berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari Kompas.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari Kompas.
 */
app.get('/api/berita/kompas', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/kompas`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Kompas", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Kompas bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/jkt48:
 *   get:
 *     summary: Mendapatkan berita tentang JKT48.
 *     description: Mendapatkan berita tentang JKT48.
 *     responses:
 *       200:
 *         description: Berita tentang JKT48 berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita tentang JKT48.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita tentang JKT48.
 */
app.get('/api/berita/jkt48', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/jkt48`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - JKT48", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - JKT48 bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/cnn:
 *   get:
 *     summary: Mendapatkan berita dari CNN.
 *     description: Mendapatkan berita dari CNN.
 *     responses:
 *       200:
 *         description: Berita dari CNN berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari CNN.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari CNN.
 */
app.get('/api/berita/cnn', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/cnn`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - CNN", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - CNN bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/cnbcindonesia:
 *   get:
 *     summary: Mendapatkan berita dari CNBC Indonesia.
 *     description: Mendapatkan berita dari CNBC Indonesia.
 *     responses:
 *       200:
 *         description: Berita dari CNBC Indonesia berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari CNBC Indonesia.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari CNBC Indonesia.
 */
app.get('/api/berita/cnbcindonesia', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/cnbcindonesia`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - CNBC Indonesia", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - CNBC Indonesia bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/antara:
 *   get:
 *     summary: Mendapatkan berita dari Antara.
 *     description: Mendapatkan berita dari Antara.
 *     responses:
 *       200:
 *         description: Berita dari Antara berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari Antara.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari Antara.
 */
app.get('/api/berita/antara', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/antara`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Antara", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Antara bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/tribunnews:
 *   get:
 *     summary: Mendapatkan berita dari Tribunnews.
 *     description: Mendapatkan berita dari Tribunnews.
 *     responses:
 *       200:
 *         description: Berita dari Tribunnews berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari Tribunnews.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari Tribunnews.
 */
app.get('/api/berita/tribunnews', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/tribunnews`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Tribunnews", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Tribunnews bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/suara:
 *   get:
 *     summary: Mendapatkan berita dari Suara.
 *     description: Mendapatkan berita dari Suara.
 *     responses:
 *       200:
 *         description: Berita dari Suara berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari Suara.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari Suara.
 */
app.get('/api/berita/suara', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/suara`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Suara", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Suara bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/merdeka:
 *   get:
 *     summary: Mendapatkan berita dari Merdeka.
 *     description: Mendapatkan berita dari Merdeka.
 *     responses:
 *       200:
 *         description: Berita dari Merdeka berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari Merdeka.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari Merdeka.
 */
app.get('/api/berita/merdeka', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/merdeka`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Merdeka", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Merdeka bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/sindonews:
 *   get:
 *     summary: Mendapatkan berita dari Sindonews.
 *     description: Mendapatkan berita dari Sindonews.
 *     responses:
 *       200:
 *         description: Berita dari Sindonews berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari Sindonews.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari Sindonews.
 */
app.get('/api/berita/sindonews', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/sindonews`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Sindonews", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Sindonews bermasalah." });
    }
});

/**
 * @swagger
 * /api/berita/liputan6:
 *   get:
 *     summary: Mendapatkan berita dari Liputan6.
 *     description: Mendapatkan berita dari Liputan6.
 *     responses:
 *       200:
 *         description: Berita dari Liputan6 berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Berita dari Liputan6.
 *       500:
 *         description: Terjadi kesalahan saat mengambil berita dari Liputan6.
 */
app.get('/api/berita/liputan6', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/liputan6`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Liputan6", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Liputan6 bermasalah." });
    }
});

/**
 * @swagger
 * /api/apk/playstore:
 *   get:
 *     summary: Mendapatkan aplikasi dari Play Store.
 *     description: Mendapatkan daftar aplikasi populer dari Play Store.
 *     responses:
 *       200:
 *         description: Aplikasi dari Play Store berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Aplikasi dari Play Store.
 *       500:
 *         description: Terjadi kesalahan saat mengambil aplikasi dari Play Store.
 */
app.get('/api/apk/playstore', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/playstore`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "APK - Play Store", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan data dari Play Store." });
    }
});

/**
 * @swagger
 * /api/apk/happymod:
 *   get:
 *     summary: Mendapatkan aplikasi dari HappyMod.
 *     description: Mendapatkan daftar aplikasi dari HappyMod.
 *     responses:
 *       200:
 *         description: Aplikasi dari HappyMod berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Aplikasi dari HappyMod.
 *       500:
 *         description: Terjadi kesalahan saat mengambil aplikasi dari HappyMod.
 */
app.get('/api/apk/happymod', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/happymod`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "APK - HappyMod", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan data dari HappyMod." });
    }
});

/**
 * @swagger
 * /api/apk/appstore:
 *   get:
 *     summary: Mendapatkan aplikasi dari App Store.
 *     description: Mendapatkan daftar aplikasi dari App Store.
 *     responses:
 *       200:
 *         description: Aplikasi dari App Store berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Aplikasi dari App Store.
 *       500:
 *         description: Terjadi kesalahan saat mengambil aplikasi dari App Store.
 */
app.get('/api/apk/appstore', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/appstore`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "APK - App Store", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan data dari App Store." });
    }
});

/**
 * @swagger
 * /api/apk/apkpure:
 *   get:
 *     summary: Mendapatkan aplikasi dari APKPure.
 *     description: Mendapatkan daftar aplikasi dari APKPure.
 *     responses:
 *       200:
 *         description: Aplikasi dari APKPure berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Aplikasi dari APKPure.
 *       500:
 *         description: Terjadi kesalahan saat mengambil aplikasi dari APKPure.
 */
app.get('/api/apk/apkpure', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/apkpure`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "APK - APKPure", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan data dari APKPure." });
    }
});

/**
 * @swagger
 * /api/apk/apkmody:
 *   get:
 *     summary: Mendapatkan aplikasi dari APKMody.
 *     description: Mendapatkan daftar aplikasi dari APKMody.
 *     responses:
 *       200:
 *         description: Aplikasi dari APKMody berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Aplikasi dari APKMody.
 *       500:
 *         description: Terjadi kesalahan saat mengambil aplikasi dari APKMody.
 */
app.get('/api/apk/apkmody', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/apkmody`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "APK - APKMody", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan data dari APKMody." });
    }
});

/**
 * @swagger
 * /api/tools/subdomains:
 *   get:
 *     summary: Mendapatkan daftar subdomain dari domain tertentu.
 *     description: Memindai dan mendapatkan daftar subdomain dari domain yang diberikan.
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         required: true
 *         description: Domain yang ingin dipindai subdomainnya.
 *     responses:
 *       200:
 *         description: Daftar subdomain berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Subdomain yang ditemukan.
 *       400:
 *         description: Parameter domain tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat memindai subdomain.
 */
app.get('/api/tools/subdomains', async (req, res) => {
    try {
        const domain = req.query.domain;
        if (!domain) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter domain!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains?domain=${encodeURIComponent(domain)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: `Subdomain Scanner untuk ${domain}`, data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan data subdomain." });
    }
});

/**
 * @swagger
 * /api/tools/text2base64:
 *   get:
 *     summary: Mengkonversi teks menjadi Base64.
 *     description: Mengkonversi teks yang diberikan menjadi format Base64.
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: Teks yang ingin dikonversi menjadi Base64.
 *     responses:
 *       200:
 *         description: Teks berhasil dikonversi menjadi Base64.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Hasil konversi Base64.
 *       400:
 *         description: Parameter text tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengkonversi teks menjadi Base64.
 */
app.get('/api/tools/text2base64', async (req, res) => {
    try {
        const text = req.query.text;
        if (!text) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan teks untuk dikonversi!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/tools/text2base64?text=${encodeURIComponent(text)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Text to Base64", data: data });
    } catch (error) {
        console.error("Error in /api/tools/text2base64:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengonversi teks ke Base64." });
    }
});

/**
 * @swagger
 * /api/tools/text2qr:
 *   get:
 *     summary: Mengkonversi teks menjadi kode QR.
 *     description: Mengkonversi teks yang diberikan menjadi gambar kode QR.
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: Teks yang ingin dikonversi menjadi kode QR.
 *     responses:
 *       200:
 *         description: Teks berhasil dikonversi menjadi kode QR.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: URL gambar kode QR.
 *       400:
 *         description: Parameter text tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengkonversi teks menjadi kode QR.
 */
app.get('/api/tools/text2qr', async (req, res) => {
    try {
        const text = req.query.text;
        if (!text) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan teks untuk dikonversi!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/tools/text2qr?text=${encodeURIComponent(text)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Text to QR Code", data: data });
    } catch (error) {
        console.error("Error in /api/tools/text2qr:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengonversi teks ke QR Code." });
    }
});

/**
 * @swagger
 * /api/tools/translate:
 *   get:
 *     summary: Menerjemahkan teks ke bahasa lain.
 *     description: Menerjemahkan teks yang diberikan ke bahasa yang ditentukan.
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: Teks yang ingin diterjemahkan.
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Kode bahasa tujuan (misalnya, 'en' untuk Inggris, 'es' untuk Spanyol). Jika tidak diberikan, defaultnya adalah 'en'.
 *     responses:
 *       200:
 *         description: Teks berhasil diterjemahkan.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   properties:
 *                     translatedText:
 *                       type: string
 *                       description: Teks yang sudah diterjemahkan.
 *       400:
 *         description: Parameter text tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat menerjemahkan teks.
 */
app.get('/api/tools/translate', async (req, res) => {
    try {
        const text = req.query.text;
        const lang = req.query.lang || "en"; // Default English jika tidak ada parameter lang
        if (!text) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan teks untuk diterjemahkan!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/tools/translate?text=${encodeURIComponent(text)}&lang=${lang}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Text Translation", data: data });
    } catch (error) {
        console.error("Error in /api/tools/translate:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal menerjemahkan teks." });
    }
});

/**
 * @swagger
 * /api/ai/lepton:
 *   get:
 *     summary: Mendapatkan respons dari Lepton AI.
 *     description: Mengirimkan teks ke Lepton AI dan mendapatkan responsnya.
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: Teks yang ingin dikirimkan ke Lepton AI.
 *     responses:
 *       200:
 *         description: Respons dari Lepton AI berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Respons dari Lepton AI.
 *       400:
 *         description: Parameter text tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan respons dari Lepton AI.
 */
app.get('/api/ai/lepton', async (req, res) => {
    try {
        const text = req.query.text;
        if (!text) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter text!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/lepton?text=${encodeURIComponent(text)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Lepton AI Response", data: data });
    } catch (error) {
        console.error("Error in /api/ai/lepton:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan respons dari Lepton AI." });
    }
});

/**
 * @swagger
 * /api/ai/gpt3:
 *   get:
 *     summary: Mendapatkan respons dari GPT-3 AI.
 *     description: Mengirimkan prompt dan konten ke GPT-3 AI dan mendapatkan responsnya.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         schema:
 *           type: string
 *         required: true
 *         description: Prompt untuk GPT-3 AI.
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         required: true
 *         description: Konten yang ingin diproses oleh GPT-3 AI.
 *     responses:
 *       200:
 *         description: Respons dari GPT-3 AI berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Respons dari GPT-3 AI.
 *       400:
 *         description: Parameter prompt atau content tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan respons dari GPT-3 AI.
 */
app.get('/api/ai/gpt3', async (req, res) => {
    try {
        const prompt = req.query.prompt;
        const content = req.query.content;
        if (!prompt || !content) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter prompt dan content!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(prompt)}&content=${encodeURIComponent(content)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "GPT-3 AI Response", data: data });
    } catch (error) {
        console.error("Error in /api/ai/gpt3:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan respons dari GPT-3 AI." });
    }
});

/**
 * @swagger
 * /api/r/waifu:
 *   get:
 *     summary: Mendapatkan gambar waifu acak.
 *     description: Menampilkan gambar waifu acak.
 *     responses:
 *       200:
 *         description: Gambar waifu berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: URL gambar waifu.
 *       500:
 *         description: Terjadi kesalahan saat mengambil gambar waifu.
 */
app.get('/api/r/waifu', async (req, res) => {
    try {
        const { data } = await axios.get("https://api.siputzx.my.id/api/r/waifu");
        res.json({ creator: "WANZOFC TECH", result: true, message: "Random Waifu Image", data: data });
    } catch (error) {
        console.error("Error in /api/r/waifu:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan waifu random." });
    }
});

/**
 * @swagger
 * /api/cf/sentiment:
 *   get:
 *     summary: Melakukan analisis sentimen pada teks.
 *     description: Mengirimkan teks dan mendapatkan hasil analisis sentimen dari Cloudflare.
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: Teks yang ingin dianalisis sentimennya.
 *     responses:
 *       200:
 *         description: Hasil analisis sentimen berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil analisis sentimen.
 *       400:
 *         description: Parameter text tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat melakukan analisis sentimen.
 */
app.get('/api/cf/sentiment', async (req, res) => {
    try {
        const text = req.query.text;
        if (!text) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter text!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/cf/sentiment?text=${encodeURIComponent(text)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Sentiment Analysis Result", data: data });
    } catch (error) {
        console.error("Error in /api/cf/sentiment:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan hasil analisis sentimen." });
    }
});

/**
 * @swagger
 * /api/cf/image-classification:
 *   get:
 *     summary: Melakukan klasifikasi gambar.
 *     description: Mengirimkan URL gambar dan mendapatkan hasil klasifikasi dari Cloudflare.
 *     parameters:
 *       - in: query
 *         name: imageUrl
 *         schema:
 *           type: string
 *         required: true
 *         description: URL gambar yang ingin diklasifikasikan.
 *     responses:
 *       200:
 *         description: Hasil klasifikasi gambar berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil klasifikasi gambar.
 *       400:
 *         description: Parameter imageUrl tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat melakukan klasifikasi gambar.
 */
app.get('/api/cf/image-classification', async (req, res) => {
    try {
        const imageUrl = req.query.imageUrl;
        if (!imageUrl) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter imageUrl!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/cf/image-classification?imageUrl=${encodeURIComponent(imageUrl)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Image Classification Result", data: data });
    } catch (error) {
        console.error("Error in /api/cf/image-classification:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengklasifikasikan gambar." });
    }
});

/**
 * @swagger
 * /api/cf/embedding:
 *   get:
 *     summary: Mendapatkan embedding teks.
 *     description: Mengirimkan teks dan mendapatkan vektor embedding dari Cloudflare.
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: Teks yang ingin diubah menjadi embedding.
 *     responses:
 *       200:
 *         description: Embedding teks berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: number
 *                     format: float
 *                   description: Vektor embedding dari teks.
 *       400:
 *         description: Parameter text tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan embedding teks.
 */
app.get('/api/cf/embedding', async (req, res) => {
    try {
        const text = req.query.text;
        if (!text) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter text!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/cf/embedding?text=${encodeURIComponent(text)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Text Embedding Result", data: data });
    } catch (error) {
        console.error("Error in /api/cf/embedding:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan embedding teks." });
    }
});

/**
 * @swagger
 * /api/cf/chat:
 *   get:
 *     summary: Melakukan percakapan dengan chatbot AI (Cloudflare).
 *     description: Mengirimkan prompt dan sistem message ke chatbot AI Cloudflare dan mendapatkan responsnya.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         schema:
 *           type: string
 *         required: true
 *         description: Pertanyaan atau prompt yang ingin diajukan ke chatbot.
 *       - in: query
 *         name: system
 *         schema:
 *           type: string
 *         required: true
 *         description: Sistem message untuk memberikan konteks atau identitas pada chatbot.
 *     responses:
 *       200:
 *         description: Respons dari chatbot AI berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Respons dari chatbot AI.
 *       400:
 *         description: Parameter prompt atau system tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan respons dari chatbot AI.
 */
app.get('/api/cf/chat', async (req, res) => {
    try {
        const prompt = req.query.prompt;
        const system = req.query.system;
        if (!prompt || !system) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter prompt dan system!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/cf/chat?prompt=${encodeURIComponent(prompt)}&system=${encodeURIComponent(system)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Cloudflare AI Chat Response", data: data });
    } catch (error) {
        console.error("Error in /api/cf/chat:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan respons dari chatbot AI." });
    }
});

/**
 * @swagger
 * /api/ai/qwen257b:
 *   get:
 *     summary: Mendapatkan respons dari AI Qwen 257B.
 *     description: Mengirimkan prompt dan teks ke AI Qwen 257B dan mendapatkan responsnya.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         schema:
 *           type: string
 *         required: true
 *         description: Prompt untuk AI Qwen 257B.
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: Teks yang ingin diproses oleh AI Qwen 257B.
 *     responses:
 *       200:
 *         description: Respons dari AI Qwen 257B berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Respons dari AI Qwen 257B.
 *       400:
 *         description: Parameter prompt atau text tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan respons dari AI Qwen 257B.
 */
app.get('/api/ai/qwen257b', async (req, res) => {
    try {
        const prompt = req.query.prompt;
        const text = req.query.text;
        if (!prompt || !text) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter prompt dan text!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/qwen257b?prompt=${encodeURIComponent(prompt)}&text=${encodeURIComponent(text)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Qwen 257B AI Response", data: data });
    } catch (error) {
        console.error("Error in /api/ai/qwen257b:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan respons dari AI Qwen 257B." });
    }
});

/**
 * @swagger
 * /api/ai/qwq-32b-preview:
 *   get:
 *     summary: Mendapatkan respons dari AI QWQ 32B (Preview).
 *     description: Mengirimkan konten ke AI QWQ 32B dan mendapatkan responsnya.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         required: true
 *         description: Konten yang ingin diproses oleh AI QWQ 32B.
 *     responses:
 *       200:
 *         description: Respons dari AI QWQ 32B berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Respons dari AI QWQ 32B.
 *       400:
 *         description: Parameter content tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan respons dari AI QWQ 32B.
 */
app.get('/api/ai/qwq-32b-preview', async (req, res) => {
    try {
        const content = req.query.content;
        if (!content) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter content!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/qwq-32b-preview?content=${encodeURIComponent(content)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "QWQ 32B AI Response", data: data });
    } catch (error) {
        console.error("Error in /api/ai/qwq-32b-preview:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan respons dari AI QWQ 32B." });
    }
});

/**
 * @swagger
 * /api/s/pinterest:
 *   get:
 *     summary: Melakukan pencarian di Pinterest.
 *     description: Mencari gambar di Pinterest berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Kata kunci pencarian di Pinterest.
 *     responses:
 *       200:
 *         description: Hasil pencarian Pinterest berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: Judul gambar Pinterest.
 *                       imageUrl:
 *                         type: string
 *                         description: URL gambar Pinterest.
 *       400:
 *         description: Parameter query tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat melakukan pencarian di Pinterest.
 */
app.get('/api/s/pinterest', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter query!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Hasil pencarian Pinterest", data: data });
    } catch (error) {
        console.error("Error in /api/s/pinterest:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan hasil dari Pinterest." });
    }
});

/**
 * @swagger
 * /api/s/soundcloud:
 *   get:
 *     summary: Melakukan pencarian di SoundCloud.
 *     description: Mencari musik di SoundCloud berdasarkan query yang diberikan.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Kata kunci pencarian di SoundCloud.
 *     responses:
 *       200:
 *         description: Hasil pencarian SoundCloud berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: Judul lagu SoundCloud.
 *                       artist:
 *                         type: string
 *                         description: Nama artis SoundCloud.
 *                       url:
 *                         type: string
 *                         description: URL lagu SoundCloud.
 *       400:
 *         description: Parameter query tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat melakukan pencarian di SoundCloud.
 */
app.get('/api/s/soundcloud', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter query!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/soundcloud?query=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Hasil pencarian SoundCloud", data: data });
    } catch (error) {
        console.error("Error in /api/s/soundcloud:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan hasil dari SoundCloud." });
    }
});

/**
 * @swagger
 * /api/stalk/npm:
 *   get:
 *     summary: Mendapatkan informasi package NPM.
 *     description: Mengambil informasi tentang package NPM berdasarkan nama package.
 *     parameters:
 *       - in: query
 *         name: packageName
 *         schema:
 *           type: string
 *         required: true
 *         description: Nama package NPM yang ingin dicari informasinya.
 *     responses:
 *       200:
 *         description: Informasi package NPM berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi package NPM.
 *       400:
 *         description: Parameter packageName tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil informasi dari NPM.
 */
app.get('/api/stalk/npm', async (req, res) => {
    try {
        const packageName = req.query.packageName;
        if (!packageName) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter packageName!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/npm?packageName=${encodeURIComponent(packageName)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Informasi NPM Package", data: data });
    } catch (error) {
        console.error("Error in /api/stalk/npm:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan informasi dari NPM." });
    }
});

/**
 * @swagger
 * /api/ai/stabilityai:
 *   get:
 *     summary: Menghasilkan gambar menggunakan Stability AI.
 *     description: Mengirimkan prompt dan mendapatkan gambar yang dihasilkan oleh Stability AI.
 *     parameters:
 *       - in: query
 *         name: prompt
 *         schema:
 *           type: string
 *         required: true
 *         description: Deskripsi atau prompt untuk menghasilkan gambar.
 *     responses:
 *       200:
 *         description: Gambar yang dihasilkan oleh Stability AI berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: URL gambar yang dihasilkan.
 *       400:
 *         description: Parameter prompt tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan gambar dari Stability AI.
 */
app.get('/api/ai/stabilityai', async (req, res) => {
    try {
        const prompt = req.query.prompt;
        if (!prompt) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter prompt!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(prompt)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Gambar dari Stability AI", data: data });
    } catch (error) {
        console.error("Error in /api/ai/stabilityai:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mendapatkan gambar dari Stability AI." });
    }
});

/**
 * @swagger
 * /api/s/wikipedia:
 *   get:
 *     summary: Melakukan pencarian di Wikipedia.
 *     description: Melakukan pencarian artikel di Wikipedia berdasarkan query.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Kata kunci pencarian di Wikipedia.
 *     responses:
 *       200:
 *         description: Hasil pencarian Wikipedia berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: Judul artikel Wikipedia.
 *                       snippet:
 *                         type: string
 *                         description: Cuplikan dari artikel Wikipedia.
 *                       url:
 *                         type: string
 *                         description: URL artikel Wikipedia.
 *       400:
 *         description: Parameter query tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Wikipedia.
 */
app.get('/api/s/wikipedia', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter query!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/wikipedia?query=${encodeURIComponent(query)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/s/wikipedia:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Wikipedia." });
    }
});

/**
 * @swagger
 * /api/s/spotify:
 *   get:
 *     summary: Melakukan pencarian di Spotify.
 *     description: Melakukan pencarian lagu, artis, atau album di Spotify berdasarkan query.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Kata kunci pencarian di Spotify.
 *     responses:
 *       200:
 *         description: Hasil pencarian Spotify berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: Judul lagu, artis, atau album.
 *                       artist:
 *                         type: string
 *                         description: Nama artis.
 *                       url:
 *                         type: string
 *                         description: URL ke konten di Spotify.
 *                       type:
 *                         type: string
 *                         description: Tipe konten (lagu, artis, album).
 *       400:
 *         description: Parameter query tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Spotify.
 */
app.get('/api/s/spotify', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter query!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/s/spotify?query=${encodeURIComponent(query)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/s/spotify:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Spotify." });
    }
});

/**
 * @swagger
 * /api/tools/fake-data:
 *   get:
 *     summary: Menghasilkan data palsu.
 *     description: Menghasilkan data palsu seperti nama, alamat, dll.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Tipe data yang ingin dihasilkan (default: person).
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         description: Jumlah data yang ingin dihasilkan (default: 5).
 *     responses:
 *       200:
 *         description: Data palsu berhasil dihasilkan.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Data palsu yang dihasilkan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil fake data.
 */
app.get('/api/tools/fake-data', async (req, res) => {
    try {
        const type = req.query.type || "person";
        const count = req.query.count || 5;

        const { data } = await axios.get(`https://api.siputzx.my.id/api/tools/fake-data?type=${type}&count=${count}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/tools/fake-data:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil fake data." });
    }
});

/**
 * @swagger
 * /api/primbon/cek_potensi_penyakit:
 *   get:
 *     summary: Mengecek potensi penyakit berdasarkan tanggal lahir (Primbon).
 *     description: Mengecek potensi penyakit berdasarkan tanggal, bulan, dan tahun lahir menggunakan perhitungan Primbon.
 *     parameters:
 *       - in: query
 *         name: tgl
 *         schema:
 *           type: string
 *         required: true
 *         description: Tanggal lahir (format: DD).
 *       - in: query
 *         name: bln
 *         schema:
 *           type: string
 *         required: true
 *         description: Bulan lahir (format: MM).
 *       - in: query
 *         name: thn
 *         schema:
 *           type: string
 *         required: true
 *         description: Tahun lahir (format: YYYY).
 *     responses:
 *       200:
 *         description: Potensi penyakit berdasarkan tanggal lahir berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pengecekan potensi penyakit.
 *       400:
 *         description: Parameter tgl, bln, atau thn tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Primbon Penyakit.
 */
app.get('/api/primbon/cek_potensi_penyakit', async (req, res) => {
    try {
        const { tgl, bln, thn } = req.query;
        if (!tgl || !bln || !thn) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter tgl, bln, dan thn!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/cek_potensi_penyakit?tgl=${tgl}&bln=${bln}&thn=${thn}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/cek_potensi_penyakit:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Primbon Penyakit." });
    }
});

/**
 * @swagger
 * /api/primbon/ramalanjodoh:
 *   get:
 *     summary: Meramal jodoh berdasarkan nama dan tanggal lahir (Primbon).
 *     description: Meramal kecocokan jodoh berdasarkan nama, tanggal, bulan, dan tahun lahir kedua pasangan menggunakan perhitungan Primbon.
 *     parameters:
 *       - in: query
 *         name: nama1
 *         schema:
 *           type: string
 *         required: true
 *         description: Nama pasangan pertama.
 *       - in: query
 *         name: tgl1
 *         schema:
 *           type: string
 *         required: true
 *         description: Tanggal lahir pasangan pertama (format: DD).
 *       - in: query
 *         name: bln1
 *         schema:
 *           type: string
 *         required: true
 *         description: Bulan lahir pasangan pertama (format: MM).
 *       - in: query
 *         name: thn1
 *         schema:
 *           type: string
 *         required: true
 *         description: Tahun lahir pasangan pertama (format: YYYY).
 *       - in: query
 *         name: nama2
 *         schema:
 *           type: string
 *         required: true
 *         description: Nama pasangan kedua.
 *       - in: query
 *         name: tgl2
 *         schema:
 *           type: string
 *         required: true
 *         description: Tanggal lahir pasangan kedua (format: DD).
 *       - in: query
 *         name: bln2
 *         schema:
 *           type: string
 *         required: true
 *         description: Bulan lahir pasangan kedua (format: MM).
 *       - in: query
 *         name: thn2
 *         schema:
 *           type: string
 *         required: true
 *         description: Tahun lahir pasangan kedua (format: YYYY).
 *     responses:
 *       200:
 *         description: Ramalan jodoh berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil ramalan jodoh.
 *       400:
 *         description: Parameter nama atau tanggal lahir tidak lengkap.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Ramalan Jodoh.
 */
app.get('/api/primbon/ramalanjodoh', async (req, res) => {
    try {
        const { nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2 } = req.query;
        if (!nama1 || !tgl1 || !bln1 || !thn1 || !nama2 || !tgl2 || !bln2 || !thn2)
            return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan semua parameter yang diperlukan!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/ramalanjodoh?nama1=${encodeURIComponent(nama1)}&tgl1=${tgl1}&bln1=${bln1}&thn1=${thn1}&nama2=${encodeURIComponent(nama2)}&tgl2=${tgl2}&bln2=${bln2}&thn2=${thn2}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/ramalanjodoh:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Ramalan Jodoh." });
    }
});

/**
 * @swagger
 * /api/primbon/rejeki_hoki_weton:
 *   get:
 *     summary: Meramal rejeki dan hoki berdasarkan weton (Primbon).
 *     description: Meramal potensi rejeki dan hoki berdasarkan tanggal, bulan, dan tahun lahir menggunakan perhitungan weton Primbon.
 *     parameters:
 *       - in: query
 *         name: tgl
 *         schema:
 *           type: string
 *         required: true
 *         description: Tanggal lahir (format: DD).
 *       - in: query
 *         name: bln
 *         schema:
 *           type: string
 *         required: true
 *         description: Bulan lahir (format: MM).
 *       - in: query
 *         name: thn
 *         schema:
 *           type: string
 *         required: true
 *         description: Tahun lahir (format: YYYY).
 *     responses:
 *       200:
 *         description: Ramalan rejeki dan hoki berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil ramalan rejeki dan hoki berdasarkan weton.
 *       400:
 *         description: Parameter tgl, bln, atau thn tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Rejeki Weton.
 */
app.get('/api/primbon/rejeki_hoki_weton', async (req, res) => {
    try {
        const { tgl, bln, thn } = req.query;
        if (!tgl || !bln || !thn) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter tgl, bln, dan thn!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/rejeki_hoki_weton?tgl=${tgl}&bln=${bln}&thn=${thn}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/rejeki_hoki_weton:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Rejeki Weton." });
    }
});

/**
 * @swagger
 * /api/primbon/sifat_usaha_bisnis:
 *   get:
 *     summary: Menentukan sifat usaha atau bisnis yang cocok berdasarkan tanggal lahir (Primbon).
 *     description: Menganalisis sifat usaha atau bisnis yang paling cocok berdasarkan tanggal, bulan, dan tahun lahir menggunakan perhitungan Primbon.
 *     parameters:
 *       - in: query
 *         name: tgl
 *         schema:
 *           type: string
 *         required: true
 *         description: Tanggal lahir (format: DD).
 *       - in: query
 *         name: bln
 *         schema:
 *           type: string
 *         required: true
 *         description: Bulan lahir (format: MM).
 *       - in: query
 *         name: thn
 *         schema:
 *           type: string
 *         required: true
 *         description: Tahun lahir (format: YYYY).
 *     responses:
 *       200:
 *         description: Sifat usaha atau bisnis yang cocok berhasil ditentukan.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil analisis sifat usaha atau bisnis yang cocok.
 *       400:
 *         description: Parameter tgl, bln, atau thn tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Sifat Usaha.
 */
app.get('/api/primbon/sifat_usaha_bisnis', async (req, res) => {
    try {
        const { tgl, bln, thn } = req.query;
        if (!tgl || !bln || !thn) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter tgl, bln, dan thn!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/sifat_usaha_bisnis?tgl=${tgl}&bln=${bln}&thn=${thn}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/sifat_usaha_bisnis:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Sifat Usaha." });
    }
});

/**
 * @swagger
 * /api/primbon/tafsirmimpi:
 *   get:
 *     summary: Menafsirkan mimpi (Primbon).
 *     description: Memberikan tafsiran mimpi berdasarkan kata kunci mimpi yang diberikan menggunakan perhitungan Primbon.
 *     parameters:
 *       - in: query
 *         name: mimpi
 *         schema:
 *           type: string
 *         required: true
 *         description: Kata kunci atau deskripsi mimpi yang ingin ditafsirkan.
 *     responses:
 *       200:
 *         description: Tafsiran mimpi berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil tafsiran mimpi.
 *       400:
 *         description: Parameter mimpi tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Tafsir Mimpi.
 */
app.get('/api/primbon/tafsirmimpi', async (req, res) => {
    try {
        const mimpi = req.query.mimpi;
        if (!mimpi) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter mimpi!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/tafsirmimpi?mimpi=${encodeURIComponent(mimpi)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/tafsirmimpi:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Tafsir Mimpi." });
    }
});

/**
 * @swagger
 * /api/primbon/artinama:
 *   get:
 *     summary: Mencari arti nama (Primbon).
 *     description: Memberikan arti atau makna dari suatu nama berdasarkan perhitungan Primbon.
 *     parameters:
 *       - in: query
 *         name: nama
 *         schema:
 *           type: string
 *         required: true
 *         description: Nama yang ingin dicari artinya.
 *     responses:
 *       200:
 *         description: Arti nama berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil pencarian arti nama.
 *       400:
 *         description: Parameter nama tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Arti Nama.
 */
app.get('/api/primbon/artinama', async (req, res) => {
    try {
        const nama = req.query.nama;
        if (!nama) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter nama!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/artinama?nama=${encodeURIComponent(nama)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/artinama:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Arti Nama." });
    }
});

/**
 * @swagger
 * /api/primbon/kecocokan_nama_pasangan:
 *   get:
 *     summary: Mengecek kecocokan nama pasangan (Primbon).
 *     description: Menganalisis kecocokan antara dua nama pasangan menggunakan perhitungan Primbon.
 *     parameters:
 *       - in: query
 *         name: nama1
 *         schema:
 *           type: string
 *         required: true
 *         description: Nama pasangan pertama.
 *       - in: query
 *         name: nama2
 *         schema:
 *           type: string
 *         required: true
 *         description: Nama pasangan kedua.
 *     responses:
 *       200:
 *         description: Hasil analisis kecocokan nama berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil analisis kecocokan nama pasangan.
 *       400:
 *         description: Parameter nama1 atau nama2 tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Kecocokan Nama Pasangan.
 */
app.get('/api/primbon/kecocokan_nama_pasangan', async (req, res) => {
    try {
        const { nama1, nama2 } = req.query;
        if (!nama1 || !nama2) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter nama1 dan nama2!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/kecocokan_nama_pasangan?nama1=${encodeURIComponent(nama1)}&nama2=${encodeURIComponent(nama2)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/kecocokan_nama_pasangan:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Kecocokan Nama Pasangan." });
    }
});

/**
 * @swagger
 * /api/primbon/nomorhoki:
 *   get:
 *     summary: Mencari nomor hoki berdasarkan nomor telepon (Primbon).
 *     description: Menganalisis nomor telepon untuk menentukan nomor hoki menggunakan perhitungan Primbon.
 *     parameters:
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: Nomor telepon yang ingin dianalisis.
 *     responses:
 *       200:
 *         description: Hasil analisis nomor hoki berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Hasil analisis nomor hoki berdasarkan nomor telepon.
 *       400:
 *         description: Parameter phoneNumber tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Nomor Hoki.
 */
app.get('/api/primbon/nomorhoki', async (req, res) => {
    try {
        const phoneNumber = req.query.phoneNumber;
        if (!phoneNumber) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter phoneNumber!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/nomorhoki?phoneNumber=${phoneNumber}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/nomorhoki:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Nomor Hoki." });
    }
});

/**
 * @swagger
 * /api/primbon/zodiak:
 *   get:
 *     summary: Mencari tahu informasi zodiak.
 *     description: Memberikan informasi tentang zodiak berdasarkan nama zodiak yang diberikan.
 *     parameters:
 *       - in: query
 *         name: zodiak
 *         schema:
 *           type: string
 *         required: true
 *         description: Nama zodiak yang ingin dicari informasinya.
 *     responses:
 *       200:
 *         description: Informasi zodiak berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Informasi tentang zodiak yang diberikan.
 *       400:
 *         description: Parameter zodiak tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Zodiak.
 */
app.get('/api/primbon/zodiak', async (req, res) => {
    try {
        const zodiak = req.query.zodiak;
        if (!zodiak) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter zodiak!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/zodiak?zodiak=${encodeURIComponent(zodiak)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/primbon/zodiak:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Zodiak." });
    }
});
/**
 * @swagger
 * /api/ai/metaai:
 *   get:
 *     summary: Menggunakan AI Meta.
 *     description: Mengirimkan query ke AI Meta dan menerima jawabannya.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Pertanyaan atau permintaan yang ingin diajukan ke AI Meta.
 *     responses:
 *       200:
 *         description: Respons dari AI Meta berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Jawaban atau respons dari AI Meta.
 *       400:
 *         description: Parameter query tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Meta AI.
 */
app.get('/api/ai/metaai', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter query!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/metaai?query=${encodeURIComponent(query)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/ai/metaai:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Meta AI." });
    }
});

/**
 * @swagger
 * /api/ai/ustadz:
 *   get:
 *     summary: Menggunakan AI Ustadz.
 *     description: Mengirimkan query dan menerima jawaban yang bernuansa Islami.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Pertanyaan atau topik yang ingin ditanyakan dengan sudut pandang Islami.
 *     responses:
 *       200:
 *         description: Respons dari AI Ustadz berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Jawaban atau nasihat dari AI Ustadz.
 *       400:
 *         description: Parameter query tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Ustadz AI.
 */
app.get('/api/ai/ustadz', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter query!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/muslimai?query=${encodeURIComponent(query)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/ai/ustadz:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data USTADZ AI." });
    }
});

/**
 * @swagger
 * /api/ai/khodam:
 *   get:
 *     summary: Berinteraksi dengan AI Khodam (Dukun).
 *     description: Mengirimkan content dan menerima jawaban yang bernuansa mistis atau paranormal.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         required: true
 *         description: Pertanyaan atau topik yang ingin ditanyakan kepada AI Khodam (Dukun).
 *     responses:
 *       200:
 *         description: Respons dari AI Khodam berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: object
 *                   description: Jawaban atau ramalan dari AI Khodam (Dukun).
 *       400:
 *         description: Parameter content tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data Khodam AI.
 */
app.get('/api/ai/khodam', async (req, res) => {
    try {
        const content = req.query.content;
        if (!content) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter content!" });

        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/dukun?content=${encodeURIComponent(content)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/ai/khodam:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data Khodam AI." });
    }
});
/**
 * @swagger
 * /api/ai/wanzofc-you:
 *   get:
 *     summary: Mengakses Layanan AI dari wanzofc You.
 *     description: Mengirimkan query ke layanan AI wanzofc You dan menerima responsnya.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Pertanyaan atau perintah yang ingin diajukan ke layanan AI.
 *     responses:
 *       200:
 *         description: Respons dari layanan AI wanzofc You berhasil diterima.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 status:
 *                   type: string
 *                   description: Status dari permintaan API.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 result:
 *                   type: string
 *                   description: Hasil jawaban dari layanan AI.
 *       400:
 *         description: Parameter query (q) tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data dari wanzofc You.
 */
app.get('/api/ai/wanzofc-you', async (req, res) => {
    try {
        const q = req.query.q;
        if (!q) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter q!" });
        const { data } = await axios.get(`https://api.neoxr.eu/api/you?q=${encodeURIComponent(q)}&apikey=PJaLJu`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/ai/wanzofc-you:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data dari wanzofc You." });
    }
});

/**
 * @swagger
 * /api/ai/wanzofc-llama:
 *   get:
 *     summary: Mengakses Layanan AI Llama dari wanzofc.
 *     description: Mengirimkan query ke layanan AI Llama dari wanzofc dan menerima responsnya.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Pertanyaan atau perintah yang ingin diajukan ke layanan AI.
 *     responses:
 *       200:
 *         description: Respons dari layanan AI wanzofc Llama berhasil diterima.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   description: Nama pembuat API.
 *                 status:
 *                   type: string
 *                   description: Status dari permintaan API.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 result:
 *                   type: string
 *                   description: Hasil jawaban dari layanan AI Llama.
 *       400:
 *         description: Parameter query (q) tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data dari wanzofc Llama.
 */
app.get('/api/ai/wanzofc-llama', async (req, res) => {
    try {
        const q = req.query.q;
        if (!q) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter q!" });
        const { data } = await axios.get(`https://api.neoxr.eu/api/llama?q=${encodeURIComponent(q)}&apikey=PJaLJu`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/ai/wanzofc-llama:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data dari wanzofc Llama." });
    }
});
/**
 * @swagger
 * /api/search/xnxx:
 *   get:
 *     summary: Melakukan pencarian di XNXX.
 *     description: Melakukan pencarian video di XNXX berdasarkan query. Endpoint ini memerlukan kebijaksanaan dan hanya boleh digunakan oleh pengguna dewasa.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Kata kunci pencarian di XNXX.
 *     responses:
 *       200:
 *         description: Hasil pencarian di XNXX berhasil diambil.
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
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: Judul video.
 *                       url:
 *                         type: string
 *                         description: URL video.
 *                       thumb:
 *                         type: string
 *                         description: URL thumbnail video.
 *                       duration:
 *                         type: string
 *                         description: Durasi video.
 *       400:
 *         description: Parameter query tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data dari XNXX.
 */
app.get('/api/search/xnxx', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ creator: "WANZOFC TECH", result: false, message: "Harap masukkan parameter q!" });

        const { data } = await axios.get(`https://archive-ui.tanakadomp.biz.id/search/xnxx?q=${encodeURIComponent(query)}`);
        res.json(data);
    } catch (error) {
        console.error("Error in /api/search/xnxx:", error); // Log error
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gagal mengambil data dari XNXX." });
    }
});

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Endpoint untuk Chat Widget.
 *     description: Menerima pesan dari pengguna dan mengirimkannya ke GPT-3 untuk mendapatkan respons.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Pesan yang dikirimkan oleh pengguna.
 *             example:
 *               message: "Halo, siapa kamu?"
 *     responses:
 *       200:
 *         description: Respons dari GPT-3 berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   description: Status permintaan.
 *                 message:
 *                   type: string
 *                   description: Pesan respons.
 *                 data:
 *                   type: string
 *                   description: Respons dari GPT-3.
 *       400:
 *         description: Parameter pesan tidak diberikan.
 *       500:
 *         description: Terjadi kesalahan saat memproses permintaan.
 */
// New Endpoint for Chat Widget
app.post('/api/chat', async (req, res) => {
    try {
        const message = req.body.message;
        if (!message) {
            return res.status(400).json({ result: false, message: "Harap masukkan pesan!" });
        }

        const prompt = "Kamu adalah wanzofc asisten website rest api wanzofc"; // Define the prompt
        const apiKey = "ET386PIT"; // Replace with your actual API key

        const apiUrl = `https://wanzofc.us.kg/api/ai/gpt3?prompt=${encodeURIComponent(prompt)}&content=${encodeURIComponent(message)}&apikey=${apiKey}`;

        const { data } = await axios.get(apiUrl);

        if (data.status === 'Success') {
            res.json({ result: true, message: "GPT-3 Response", data: data.result });
        } else {
            console.error("GPT-3 API Error:", data);
            res.status(500).json({ result: false, message: "Gagal mendapatkan respons dari GPT-3 AI.", error: data });
        }
    } catch (error) {
        console.error("Error in /api/chat:", error);
        res.status(500).json({ result: false, message: "Terjadi kesalahan saat memproses permintaan.", error: error.message });
    }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});
app.use((req, res) => {
  res.status(500).json(path.join(__dirname, '404.html'));
});
        
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
