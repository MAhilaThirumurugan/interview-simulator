const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');  
const interviewRoutes = require('./routes/interviewRoutes');
const errorHandler       = require('./middleware/errorHandler');
const app = express();
const helmet = require('helmet');
app.use(helmet());

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));


app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/auth', authRoutes); 
app.use('/api/interviews', interviewRoutes); 
// 404 handler — add after all routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use(errorHandler);
module.exports = app;






// https://interview-simulator-uts9.onrender.com/