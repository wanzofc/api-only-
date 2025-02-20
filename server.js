const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://zanssxploit:pISqUYgJJDfnLW9b@cluster0.fgram.mongodb.net/?retryWrites=true&w=majority';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7816642406:AAG0s14OnY3Msv7oRa9YO-lvEgamMt--lgc';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7096521481';
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID || '7096521481';
const JWT_SECRET = process.env.JWT_SECRET || 'abcdegf';
const APP_URL = process.env.APP_URL || 'https://wanzofc.xyz';

// Konfigurasi nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'berlianawan498@gmail.com',
        pass: 'olre djtq lzyu oaxg'
    }
});

const verificationTokens = {};

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

// API Key Storage
let apiKeys = loadApiKeys();

function loadApiKeys() {
    try {
        const data = fs.readFileSync('database.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Gagal membaca database.json:', err);
        return {};
    }
}

function saveApiKeys() {
    fs.writeFileSync('database.json', JSON.stringify(apiKeys), 'utf8');
}

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

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    apiKey: { type: String },
    isActive: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
// ** Global Variables (Diinisialisasi dari Database) **
let totalRequests = 0;
let totalVisitors = 0;
let batteryLevels = [];

// ** Telegram Bot Initialization **
let bot; // Deklarasikan bot di luar blok try
try {
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true }); // Aktifkan polling
    console.log('Telegram Bot terhubung!');
} catch (error) {
    console.error('Gagal terhubung ke Telegram Bot:', error);
    // Anda mungkin ingin keluar dari aplikasi atau mencoba lagi nanti
}
// ** Fungsi untuk membuat token JWT **
function generateToken(user) {
    return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}

// ** Telegram Bot Commands (Contoh) **
if (bot) {
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Halo! Saya adalah bot notifikasi untuk WANZOFC TECH.");
    });

    bot.onText(/\/stats/, async (msg) => {
        try {
            const stats = await Statistics.findOne({});
            const message = `Total Requests: ${stats.totalRequests}\nTotal Visitors: ${stats.totalVisitors}`;
            bot.sendMessage(msg.chat.id, message);
        } catch (error) {
            console.error('Error fetching stats:', error);
            bot.sendMessage(msg.chat.id, "Gagal mendapatkan statistik.");
        }
    });

    bot.onText(/\/listuser/, async (msg) => {
        try {
            const users = await User.find({});
            const userList = users.map(user => user.username).join('\n');
            bot.sendMessage(msg.chat.id, `Daftar Pengguna:\n${userList || 'Tidak ada pengguna terdaftar.'}`);
        } catch (error) {
            console.error('Gagal mendapatkan daftar pengguna:', error);
            bot.sendMessage(msg.chat.id, "Gagal mendapatkan daftar pengguna.");
        }
    });

   // Delete User command
    bot.onText(/\/deleteuser (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;

        if (msg.from.id.toString() !== ADMIN_TELEGRAM_ID) {
            return bot.sendMessage(chatId, "Hanya admin yang dapat menggunakan perintah ini.");
        }

        const usernameToDelete = match[1];

        try {
            const deletedUser = await User.findOneAndDelete({ username: usernameToDelete });
            if (deletedUser) {
                // Update API keys and save
                 apiKeys = loadApiKeys();
                delete apiKeys[usernameToDelete];
                saveApiKeys();
                bot.sendMessage(chatId, `Pengguna dengan username ${usernameToDelete} berhasil dihapus.`);
            } else {
                bot.sendMessage(chatId, `Tidak dapat menemukan pengguna dengan username ${usernameToDelete}.`);
            }
        } catch (error) {
            console.error('Gagal menghapus pengguna:', error);
            bot.sendMessage(chatId, "Gagal menghapus pengguna.");
        }
    });

    // Delete All Users command
    bot.onText(/\/deleteallusers/, async (msg) => {
        const chatId = msg.chat.id;

        if (msg.from.id.toString() !== ADMIN_TELEGRAM_ID) {
            return bot.sendMessage(chatId, "Hanya admin yang dapat menggunakan perintah ini.");
        }

        try {
            await User.deleteMany({});

            apiKeys = {};
            saveApiKeys();
            bot.sendMessage(chatId, "Semua pengguna telah dihapus!");
        } catch (error) {
            console.error('Gagal menghapus semua pengguna:', error);
            bot.sendMessage(chatId, "Gagal menghapus semua pengguna.");
        }
    });
       // Custom API Key command
    bot.onText(/\/customapikey (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
                if (msg.from.id.toString() !== ADMIN_TELEGRAM_ID) {
            return bot.sendMessage(chatId, "Hanya admin yang dapat menggunakan perintah ini.");
        }
        const message = match[1];
        const args = message.split(' ');



        if (args.length !== 2) {
            return bot.sendMessage(chatId, "Format perintah salah. Gunakan: /customapikey username newapikey");
        }

        const username = args[0];
        const newApiKey = args[1];

        if (apiKeys.has(username)) {
            apiKeys.set(username, newApiKey);
             saveApiKeys();
            bot.sendMessage(chatId, `API key untuk username ${username} berhasil diubah menjadi ${newApiKey}.`);
        } else {
            apiKeys.set(username, newApiKey);
            saveApiKeys();
            bot.sendMessage(chatId, `API key baru untuk username ${username} berhasil dibuat: ${newApiKey}.`);
        }
    });
}
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

// Endpoint Pendaftaran
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Cek apakah username atau email sudah ada
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username atau email sudah terdaftar.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate token verifikasi
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Buat pengguna baru
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            apiKey: generateApiKey(), // Generate API key saat pendaftaran
            isActive: false // Akun belum aktif
        });

        await newUser.save();

        // Simpan token verifikasi
        verificationTokens[verificationToken] = newUser._id;

        // Buat tautan verifikasi
        const verificationLink = `${APP_URL}/api/verify-email?token=${verificationToken}`;

        // Konfigurasi email
        const mailOptions = {
            from: 'berlianawan498@gmail.com', // Alamat email aplikasi Anda
            to: email,
            subject: 'Verifikasi Pendaftaran Akun',
            html: `<p>Silakan klik tautan berikut untuk mengaktifkan akun Anda: <a href="${verificationLink}">${verificationLink}</a></p>`
        };

        // Kirim email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Gagal mengirim email:', error);
                return res.status(500).json({ success: false, message: 'Gagal mengirim email verifikasi. Silakan coba lagi.' });
            }
            console.log('Email terkirim:', info.response);
            res.json({ success: true, message: 'Pendaftaran berhasil! Silakan periksa email Anda untuk tautan verifikasi.' });
        });

    } catch (error) {
        console.error('Gagal mendaftar:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mendaftar.' });
    }
});

// Endpoint Verifikasi Email
app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        // Dapatkan ID pengguna dari token
        const userId = verificationTokens[token];

        if (!userId) {
            return res.status(400).send('Tautan verifikasi tidak valid atau sudah kadaluarsa.');
        }

        // Cari dan aktifkan pengguna
        const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });

        if (!user) {
            return res.status(404).send('Pengguna tidak ditemukan.');
        }

        // Hapus token verifikasi
        delete verificationTokens[token];

        res.send('Akun Anda telah berhasil diaktifkan! Silakan login.');
    } catch (error) {
        console.error('Gagal memverifikasi email:', error);
        res.status(500).send('Terjadi kesalahan saat memverifikasi email.');
    }
});

// Endpoint Login
app.post('/api/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari pengguna berdasarkan username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Kredensial tidak valid.', result: false });
        }

        // Verifikasi password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Kredensial tidak valid.', result: false });
        }

        // Periksa apakah akun aktif
        if (!user.isActive) {
            return res.status(403).json({ message: 'Akun Anda belum diaktifkan. Silakan periksa email Anda untuk tautan verifikasi.', result: false });
        }

        // Generate JWT token
        const token = generateToken(user);
		// Buat atau perbarui API Keys di database.json
        apiKeys[username] = user.apiKey; // Gunakan apiKey yang sudah ada
        saveApiKeys();

        res.json({ message: 'Login berhasil.', apiKey: user.apiKey, token: token, result: true });

    } catch (error) {
        console.error('Gagal login:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat login.', result: false });
    }
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
      // Load API keys dari database.json
     apiKeys = loadApiKeys();

    if (apiKeys[username] !== apiKey) {
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
            console.log(`${clientId} Connection closed`);
            clients = clients.filter(client => client.id !== clientId);
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
// ** Inisialisasi Telegram Bot **
if (bot) {
    // Kirim notifikasi saat server dimulai
    bot.sendMessage(TELEGRAM_CHAT_ID, 'Server telah dimulai!');
}
// Panggil fungsi inisialisasi saat server dimulai
initializeStatistics().then(() => {
    // Start the server
    server.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
        // Kirim notifikasi saat server dimulai (setelah statistik diinisialisasi)
        if (bot) {
             bot.sendMessage(TELEGRAM_CHAT_ID, 'Server telah berhasil dijalankan, statistic berhasil di inisialisasi!');
        }
    });
}).catch((error) => {
    console.error("Gagal inisialisasi statistik:", error);
    // Handle jika inisialisasi statistik gagal
    if (bot) {
        bot.sendMessage(TELEGRAM_CHAT_ID, 'Server Gagal dijalankan, statistic gagal di inisialisasi!');
    }
});
