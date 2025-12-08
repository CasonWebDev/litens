const express = require('express');
const cors = require('cors');
const { initDb } = require('./db.cjs');
const authRoutes = require('./auth.cjs');

const app = express();
const PORT = 3000;

const productRoutes = require('./products.cjs');
const vehicleRoutes = require('./vehicles.cjs');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize DB
initDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/references', require('./references.cjs'));
app.use('/api/users', require('./users.cjs'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
