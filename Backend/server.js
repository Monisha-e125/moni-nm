require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db');

const bookRoutes = require('./routes/bookRoutes');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/books', bookRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Library Backend API - Port 5000' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend on http://localhost:${PORT}`);
  console.log(`📚 Test: http://localhost:${PORT}/books`);
});
