const express = require('express');
const http = require('http');
const axios = require('axios');
const cors = require('cors');
const requestIp = require('request-ip');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs'); // File system module
const app = express();
const server = http.createServer(app);

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb+srv://zanssxploit:pISqUYgJJDfnLW9b@cluster0.fgram.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Visit Schema and Model
const visitSchema = new mongoose.Schema({
    ip: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Visit = mongoose.model('Visit', visitSchema);

// Load totalRequests from file (if it exists)
const statsFilePath = path.join(__dirname, 'stats.json'); // Adjust path as needed
let totalRequests = 0;

try {
    if (fs.existsSync(statsFilePath)) {
        const statsData = fs.readFileSync(statsFilePath, 'utf8');
        const stats = JSON.parse(statsData);
        totalRequests = stats.totalRequests || 0; //Use default if property not found or undefined
        console.log(`Loaded totalRequests from ${statsFilePath}: ${totalRequests}`);
    } else {
        console.log(`Stats file not found, starting with totalRequests = 0`);
    }
} catch (error) {
    console.error("Error loading totalRequests from file:", error);
}

// Function to save totalRequests to file
const saveStatsToFile = () => {
    try {
        const stats = { totalRequests: totalRequests };
        fs.writeFileSync(statsFilePath, JSON.stringify(stats));
        console.log(`Saved totalRequests to ${statsFilePath}: ${totalRequests}`);
    } catch (error) {
        console.error("Error saving totalRequests to file:", error);
    }
};

// Middleware to track unique visits
app.use(async (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingVisit = await Visit.findOne({
        ip: clientIp,
        timestamp: {
            $gte: twentyFourHoursAgo
        }
    });

    if (!existingVisit) {
        const newVisit = new Visit({
            ip: clientIp
        });
        await newVisit.save();
    }
    next();
});

// Route to get total visits and requests
app.get('/api/stats', async (req, res) => {
    try {
        const totalVisits = await Visit.countDocuments();
        res.json({
            success: true,
            data: {
                totalVisits: totalVisits,
                totalRequests: totalRequests
            }
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ success: false, message: "Error fetching stats", error: error.message });
    }
});

// Route to get client's IP address
app.get('/api/ip', (req, res) => {
    const clientIp = requestIp.getClientIp(req);
    res.json({
        success: true,
        data: {
            ip: clientIp
        }
    });
});

// Route to interact with the AI API
app.get('/api/ai/metaai', async (req, res) => {
    const query = req.query.query || 'tahun berapa sekarang';
    const apiKey = 'ET386PIT';
    const apiUrl = `https://wanzofc.us.kg/api/ai/metaai?query=${encodeURIComponent(query)}&apikey=${apiKey}`;
    totalRequests++;
    saveStatsToFile(); // Save totalRequests after each AI request

    try {
        const response = await axios.get(apiUrl);
        res.json({
            success: true,
            data: response.data,
            apiUrl: apiUrl
        });
    } catch (error) {
        console.error("Error calling AI API:", error);
        res.status(500).json({ success: false, message: "Error calling AI API", error: error.message });
    }
});

// Serve static files (if you still need to serve index.html)
app.use(express.static(path.join(__dirname)));  // Serve from the root directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Assuming index.html is in the same directory
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
