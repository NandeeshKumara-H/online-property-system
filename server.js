const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-management')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes (to be imported)
const authRoutes = require('./server/routes/authRoutes');
const propertyRoutes = require('./server/routes/propertyRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const userRoutes = require('./server/routes/userRoutes');

app.use('/api', authRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
