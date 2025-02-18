const express = require('express');
const http = require('http');
const axios = require('axios');
const cors = require('cors');
const requestIp = require('request-ip');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static('public'));
app.use(requestIp.mw());

// MongoDB Connection
mongoose.connect('YOUR_MONGODB_CONNECTION_STRING', {
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

let totalRequests = 0; // Keep track of total requests

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
app.get('/stats', async (req, res) => {
    try {
        const totalVisits = await Visit.countDocuments();
        res.json({
            totalVisits: totalVisits,
            totalRequests: totalRequests
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).send("Error fetching stats");
    }
});

app.get('/get-ip', (req, res) => {
    const clientIp = requestIp.getClientIp(req);
    res.json({
        ip: clientIp
    });
});

// Your AI Endpoint
app.get('/ai/metaai', (req, res) => {
    const query = req.query.query || 'tahun berapa sekarang';
    const apiKey = 'ET386PIT';
    const apiUrl = `https://wanzofc.us.kg/api/ai/metaai?query=${encodeURIComponent(query)}&apikey=${apiKey}`;
    totalRequests++;

    // Respond with the full API URL
    res.json({
        "API URL": apiUrl
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
