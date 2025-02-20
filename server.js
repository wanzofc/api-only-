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
        title: 'WANZOFC TECH API 🔥',
        version: '1.0.0',
        description: 'Dokumentasi API WANZOFC TECH.',
    },
    servers: [
        {
            url: process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`,
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
 *     summary: Membuat pesan forum baru dengan dukungan upload file
 *     description: Membuat pesan baru di forum dan mengunggah file (opsional).
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
        const { text, sender } = req.body;

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

         const newMessage = new Message({
            text: text,
             sender: sender,
             file: fileInfo
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
