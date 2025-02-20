// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const formatParagraph = (text) => text ? text.replace(/\.\s+/g, ".\n\n") : "Tidak ada jawaban.";

// Swagger UI
const swaggerUi = require('swagger-ui-express');

// Konfigurasi Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'WANZOFC TECH API 🔥',
        version: '1.0.0',
        description: 'Dokumentasi API WANZOFC TECH.',
    },
    servers: [
        {
            url: process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`, // Sesuaikan dengan URL server Anda atau gunakan variabel lingkungan
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
    } catch (error) {
        console.error('Error calling Deepseek Chat API:', error);
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
    } catch (error) {
        console.error('Error calling Gemini Pro API:', error);
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
    } catch (error) {
        console.error('Error calling Meta Llama API:', error);
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
    } catch (error) {
         console.error('Error calling DBRX Instruct API:', error);
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
    } catch (error) {
        console.error('Error calling Deepseek R1 API:', error);
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
    } catch (error) {
        console.error('Error calling Gita AI API:', error);
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gita AI bermasalah." });
    }
});

// Mongoose Connection
const mongoDBURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/wanzofc-tech'; // Default local MongoDB
mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on fatal error
});

// Skema Pesan (Mongoose)
const messageSchema = new mongoose.Schema({
    text: String,
    timestamp: { type: Date, default: Date.now } // Add timestamp
});

const Message = mongoose.model('Message', messageSchema);

/**
 * @openapi
 * /api/messages:
 *   get:
 *     summary: Mendapatkan semua pesan forum
 *     description: Mengembalikan daftar semua pesan yang tersimpan di database.
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar pesan.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                     description: Isi pesan.
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: Waktu pesan dikirim.
 *       500:
 *         description: Terjadi kesalahan saat mengambil pesan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Pesan kesalahan.
 */
// Endpoint untuk mendapatkan semua pesan forum
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 }); // Sort by timestamp ascending
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

/**
 * @openapi
 * /api/messages:
 *   post:
 *     summary: Membuat pesan forum baru
 *     description: Membuat pesan baru dan menyimpannya ke database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Isi pesan.
 *     responses:
 *       201:
 *         description: Pesan berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Pesan sukses.
 *       400:
 *         description: Isi pesan tidak valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Pesan kesalahan.
 *       500:
 *         description: Terjadi kesalahan saat membuat pesan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Pesan kesalahan.
 */
// Endpoint untuk membuat pesan forum baru
app.post('/api/messages', async (req, res) => {
    try {
        const { text } = req.body;

        // Validation
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Message text is required' });
        }

        const newMessage = new Message({ text });
        await newMessage.save();
        res.status(201).json({ message: 'Message created successfully' });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Swagger UI tersedia di http://localhost:${PORT}/api-docs`);
});
