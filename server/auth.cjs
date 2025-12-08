const express = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('./db.cjs');
const router = express.Router();

const SECRET_KEY = "super_secret_key_litens"; // Move to env in prod

const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
        if (err) return res.status(500).json({ message: "Internal server error" });

        if (row && await bcrypt.compare(password, row.password)) {
            const token = jwt.sign(
                { id: row.id, username: row.username, role: row.role },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            res.json({ token, role: row.role, username: row.username });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

module.exports = router;
