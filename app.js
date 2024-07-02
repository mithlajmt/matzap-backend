const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/auth/auth');
const morgan = require('morgan');

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
}).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.log('Error connecting to MongoDB:', err);
});

// Routes
app.use('/auth', authRoutes);

// Example root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
