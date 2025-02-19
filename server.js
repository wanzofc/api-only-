const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://zanssxploit:pISqUYgJJDfnLW9b@cluster0.fgram.mongodb.net/?retryWrites=true&w=majority';
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Chat Message Schema and Model
const chatMessageSchema = new mongoose.Schema({
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// API Key Storage (Temporary - Use a proper database for production)
const apiKeys = new Map();
function generateApiKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
    for (let i = 0; i < 6; i++) {
        apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return apiKey;
}
// ** Statistik Schema dan Model **
const statisticsSchema = new mongoose.Schema({
    totalRequests: { type: Number, default: 0 },
    totalVisitors: { type: Number, default: 0 }
});

const Statistics = mongoose.model('Statistics', statisticsSchema);

// ** Global Variables (Diinisialisasi dari Database) **
let totalRequests = 0;
let totalVisitors = 0;
let batteryLevels = [];

// Middleware
app.use(cors({ origin: 'https://wanzofc-ai.biz.id' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Status Aplikasi
let appStatus = "Sedang Berjalan";

// Middleware to count total requests
app.use(async (req, res, next) => {
    totalRequests++;
    console.log(`Request to: ${req.url}, Total Requests: ${totalRequests}`);

    // Simpan totalRequests ke database
    try {
        await Statistics.updateOne({}, { totalRequests: totalRequests }, { upsert: true });
    } catch (error) {
        console.error('Error updating total requests:', error);
    }

    next();
});

// Middleware untuk validasi API key
const apiKeyValidator = (req, res, next) => {
    const username = req.query.username;
    const apiKey = req.query.apikey;

    if (!username) {
        return res.status(400).json({
            creator: "WANZOFC TECH",
            result: false,
            message: "Username dibutuhkan. Sertakan parameter 'username' pada request Anda.",
            status: appStatus
        });
    }

    if (!apiKey) {
        return res.status(401).json({
            creator: "WANZOFC TECH",
            result: false,
            message: "API key dibutuhkan. Sertakan parameter 'apikey' pada request Anda.",
            status: appStatus
        });
    }

    if (apiKeys.get(username) !== apiKey) {
        return res.status(403).json({
            creator: "WANZOFC TECH",
            result: false,
            message: "API key tidak valid.",
            status: appStatus
        });
    }

    next();
};

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve admin.html
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Declare clients array OUTSIDE all route handlers
const clients = [];

// SSE Endpoint for Chat
app.get('/chat-stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        const changeStream = ChatMessage.watch();

        changeStream.on('change', async (change) => {
            if (change.operationType === 'insert') {
                const message = await ChatMessage.findById(change.documentKey._id);
                res.write(`data: ${JSON.stringify({ message: message.message, timestamp: message.timestamp })} \n\n`);
            }
        });

        req.on('close', () => {
            console.log('Client disconnected from chat-stream');
            changeStream.close();
        });

    } catch (error) {
        console.error('Error streaming updates:', error);
        res.write(`data: ${JSON.stringify({ error: 'Error streaming updates.' })}\n\n`);
        res.end();
    }
});

// SSE Endpoint for Notifications
app.get('/notification-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res,
    };
    clients.push(newClient);

    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

// Protected Admin endpoint to send notifications
app.post('/admin/notify', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify({ notification: message })} \n\n`);
    });

    res.json({ message: 'Notification sent' });
});

// Endpoint to post a new chat message
app.post('/chat-message', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const chatMessage = new ChatMessage({ message: message });
        await chatMessage.save();
        res.status(201).json({ message: 'Message saved' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Error saving message' });
    }
});

// Endpoint to get chat history
app.get('/chat-history', async (req, res) => {
    try {
        const chatHistory = await ChatMessage.find().sort({ timestamp: 1 }).limit(50).exec();
        res.json(chatHistory.map(doc => ({ message: doc.message, timestamp: doc.timestamp })));
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Error fetching chat history' });
    }
});
// All the Other A P I
app.get('/api/stalk/github', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({
            creator: "WANZOFC TECH",
            result: false,
            message: "Username dibutuhkan. Sertakan parameter 'username' pada request Anda.",
            status: appStatus
        });
    }

    if (apiKeys.has(username)) {
        return res.status(200).json({
            creator: "WANZOFC TECH",
            result: true,
            message: "API key sudah ada.",
            status: appStatus,
            apikey: apiKeys.get(username)
        });
    }

    const newApiKey = generateApiKey();
    apiKeys.set(username, newApiKey);

    res.status(201).json({
        creator: "WANZOFC TECH",
        result: true,
        message: "API key berhasil dibuat.",
        status: appStatus,
        apikey: newApiKey
    });
});
app.get('/api/berita/cnn', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/cnn`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - CNN", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - CNN bermasalah." });
    }
});
app.get('/api/berita/cnbcindonesia', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/cnbcindonesia`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - CNBC Indonesia", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - CNBC Indonesia bermasalah." });
    }
});
app.get('/api/berita/antara', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/antara`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Antara", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Antara bermasalah." });
    }
});
app.get('/api/berita/tribunnews', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/tribunnews`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Tribunnews", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Tribunnews bermasalah." });
    }
});
app.get('/api/berita/suara', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/suara`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Suara", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Suara bermasalah." });
    }
});
app.get('/api/berita/merdeka', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/merdeka`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Merdeka", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Merdeka bermasalah." });
    }
});
app.get('/api/berita/sindonews', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/sindonews`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Sindonews", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Sindonews bermasalah." });
    }
});
app.get('/api/berita/liputan6', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/berita/liputan6`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Berita - Liputan6", data: data });
    } catch {
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Berita - Liputan6 bermasalah." });
    }
});
app.get('/api/stalk/github/stalk', apiKeyValidator, async (req, res) => {
    const user = req.query.user;
    const username = req.query.username;
    const apiKey = req.query.apikey;

    if (!user) {
        return res.status(400).json({
            creator: "WANZOFC TECH",
            result: false,
            message: "Tambahkan parameter 'user' (contoh: /api/stalk/github/stalk?user=github_username&username=wanzofc-tech&apikey=apikey).",
            status: appStatus
        });
    }

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/github?user=${encodeURIComponent(user)}`);
        res.json({
            creator: "WANZOFC TECH",
            result: true,
            message: "GitHub Stalker",
            status: appStatus,
            apikey: apiKey,
            data: data
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            creator: "WANZOFC TECH",
            result: false,
            message: "GitHub Stalker bermasalah. Periksa kembali username atau coba lagi nanti.",
            status: appStatus,
            apikey: apiKey,
            error: error.message
        });
    }
});

// Additional API Endpoints
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

// ** Statistik Endpoint **
app.get('/api/statistics', async (req, res) => {
    totalVisitors++; // Setiap kali endpoint ini diakses, anggap sebagai pengunjung baru

    // Simpan totalVisitors ke database
    try {
        await Statistics.updateOne({}, { totalVisitors: totalVisitors }, { upsert: true });
    } catch (error) {
        console.error('Error updating total visitors:', error);
    }

    res.json({
        totalRequests: totalRequests,
        totalVisitors: totalVisitors,
    });
});

// ** Battery Level Endpoint **
app.post('/api/battery-level', (req, res) => {
    const batteryLevel = req.body.batteryLevel;
    if (batteryLevel !== undefined) {
        batteryLevels.push(batteryLevel);
        console.log(`Received battery level: ${batteryLevel}`);
        res.status(200).send('Battery level received successfully');
    } else {
        res.status(400).send('Battery level is required');
    }
});

// SSE Endpoint for Chat
app.get('/chat-stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        const changeStream = ChatMessage.watch();

        changeStream.on('change', async (change) => {
            if (change.operationType === 'insert') {
                const message = await ChatMessage.findById(change.documentKey._id);
                res.write(`data: ${JSON.stringify({ message: message.message, timestamp: message.timestamp })} \n\n`);
            }
        });

        req.on('close', () => {
            console.log('Client disconnected from chat-stream');
            changeStream.close();
        });

    } catch (error) {
        console.error('Error streaming updates:', error);
        res.write(`data: ${JSON.stringify({ error: 'Error streaming updates.' })}\n\n`);
        res.end();
    }
});

// SSE Endpoint for Notifications
app.get('/notification-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res,
    };
    clients.push(newClient);

    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

// Protected Admin endpoint to send notifications
app.post('/admin/notify', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify({ notification: message })} \n\n`);
    });

    res.json({ message: 'Notification sent' });
});
// Fallback route
app.use((req, res, next) => {
    res.status(404).json({
        creator: "WANZOFC TECH",
        result: false,
        message: "Endpoint tidak ditemukan.",
        status: appStatus
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        creator: "WANZOFC TECH",
        result: false,
        message: "Terjadi kesalahan server.",
        status: appStatus,
        error: err.message
    });
});

// ** Inisialisasi Data Statistik dari Database **
async function initializeStatistics() {
    try {
        const stats = await Statistics.findOne({});
        if (stats) {
            totalRequests = stats.totalRequests;
            totalVisitors = stats.totalVisitors;
            console.log('Statistics initialized from database:', { totalRequests, totalVisitors });
        } else {
            console.log('No statistics found in database, initializing with default values.');
            const newStats = new Statistics({ totalRequests: 0, totalVisitors: 0 });
            await newStats.save();
        }
    } catch (error) {
        console.error('Error initializing statistics:', error);
    }
}

// Panggil fungsi inisialisasi saat server dimulai
initializeStatistics().then(() => {
    // Start the server
    server.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
});
