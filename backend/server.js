const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const removeBgRoute = require('./routes/remove-bg.route');

const app = express();
const PORT = process.env.PORT || 3000;

// Security - Relaxed for cross-domain communication
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false, // Avoid blocking requests from other domains
}));
app.use(cors({
    origin: '*', // Explicitly allow all origins
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json());

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/remove-bg', removeBgRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
