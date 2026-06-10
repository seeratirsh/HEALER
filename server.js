require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const assessRoute = require('./routes/assess');
const healthRoute = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/assess', assessRoute);
app.use('/api/health', healthRoute);

// Serve PWA for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`HEALER running on http://localhost:${PORT}`);
});
