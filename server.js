// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const formatParagraph = (text) => text ? text.replace(/\.\s+/g, ".\n\n") : "Tidak ada jawaban.";

const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'WANZOFC TECH API ðŸ”¥',
        version: '1.0.0',
        description: 'Dokumentasi API WANZOFC TECH.',
    },
    servers: [
        {
            url: process.env.SWAGGER_SERVER_URL || `https://only-awan.biz.id`,
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./server.js'],
};

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/kebijakan", (req, res) => {
    res.sendFile(path.join(__dirname, "kebijakan.html"));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * @openapi
 * /api/ai/gpt3:
 *   get:
 *     summary: Menggunakan GPT-3 AI
 *     description: Mengembalikan respon dari GPT-3 AI berdasarkan prompt dan content yang diberikan.
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
 *         description: Content untuk GPT-3 AI.
 *     responses:
 *       200:
 *         description: Respon sukses dari GPT-3 AI.
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
 *                   type: object
 *                   description: Hasil dari GPT-3 AI.
 *       400:
 *         description: Parameter prompt dan content harus diberikan.
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
 *       500:
 *         description: Terjadi kesalahan pada server atau GPT-3 AI bermasalah.
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
 * /api/gita:
 *   get:
 *     summary: Berinteraksi dengan khodam AI
 *     description: Mengembalikan respon dari khodam AI berdasarkan content yang diberikan.
 *     parameters:
 *       - in: content
 *         name: q
 *         schema:
 *           type: string
 *         description: Pertanyaan atau teks yang akan diproses oleh AI khodam.
 *     responses:
 *       200:
 *         description: Respon sukses dari khodam AI.
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
 *                   description: Hasil dari khodam AI.
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


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const mongoDBURL = process.env.MONGODB_URI || 'mongodb+srv://zanssxploit:pISqUYgJJDfnLW9b@cluster0.fgram.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const messageSchema = new mongoose.Schema({
    text: String,
    sender: { type: String, default: 'other' },
    timestamp: { type: Date, default: Date.now },
    file: {
        filename: String,
        path: String,
        originalname: String
    },
    reply_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null //Untuk pesan awal, reply_to nya null
    }
});

const Message = mongoose.model('Message', messageSchema);

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
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
 *     summary: Membuat pesan forum baru dengan dukungan upload file dan reply
 *     description: Membuat pesan baru di forum dan mengunggah file (opsional) dan fitur reply.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Isi pesan teks.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File yang akan diunggah (gambar, video, dll.).
 *               reply_to:
 *                 type: string
 *                 description: ID pesan yang dibalas.
 *     responses:
 *       201:
 *         description: Pesan berhasil dibuat.
 *       400:
 *         description: Isi pesan tidak valid atau terjadi kesalahan pada file upload.
 *       500:
 *         description: Terjadi kesalahan saat membuat pesan.
 */
app.post('/api/messages', upload.single('file'), async (req, res) => {
    try {
        const { text, sender, reply_to } = req.body;

        // Validation
        if (!text && !req.file) {
            return res.status(400).json({ error: 'Message text or file is required' });
        }

        let fileInfo = null;
        if (req.file) {
            fileInfo = {
                filename: req.file.filename,
                path: req.file.path,
                originalname: req.file.originalname
            };
        }

        // Buat message baru
        const newMessage = new Message({
            text: text,
            sender: sender,
            file: fileInfo,
            reply_to: reply_to || null //Set reply_to, kalau tidak ada isinya null
        });

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
