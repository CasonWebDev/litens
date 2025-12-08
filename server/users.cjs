const express = require('express');
const router = express.Router();
const { db } = require('./db.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "super_secret_key_litens"; // Should match auth.cjs

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware to authorize admin only
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

// List users (Admin only)
router.get('/', authenticateToken, authorizeAdmin, (req, res) => {
    db.all("SELECT id, username, role FROM users", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get single user (Admin or Self)
router.get('/:id', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.id);
    if (req.user.role !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
    }

    db.get("SELECT id, username, role FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "User not found" });
        res.json(row);
    });
});

// Create user (Admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
    const { username, password, role } = req.body;
    const finalRole = role || 'user';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, hashedPassword, finalRole],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: "Username already exists" });
                    }
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID, username, role: finalRole });
            }
        );
    } catch (err) {
        res.status(500).json({ error: "Error creating user" });
    }
});

// Update user (Admin or Self)
router.put('/:id', authenticateToken, async (req, res) => {
    const userId = parseInt(req.params.id);
    const { password, role } = req.body;

    // Only Admin can change roles
    if (role && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Cannot change role" });
    }

    // Only Admin or Self can update
    if (req.user.role !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        let query = "UPDATE users SET ";
        const params = [];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += "password = ?, ";
            params.push(hashedPassword);
        }

        if (role && req.user.role === 'admin') {
            query += "role = ?, ";
            params.push(role);
        }

        // Remove trailing comma
        query = query.slice(0, -2);
        query += " WHERE id = ?";
        params.push(userId);

        if (params.length === 1) { // No fields to update
            return res.json({ message: "Nothing to update" });
        }

        db.run(query, params, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "User not found" });
            res.json({ message: "User updated" });
        });

    } catch (err) {
        res.status(500).json({ error: "Error updating user" });
    }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const userId = parseInt(req.params.id);

    // Prevent deleting self (simple safety check)
    if (req.user.id === userId) {
        return res.status(400).json({ error: "Cannot delete yourself" });
    }

    db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted" });
    });
});

module.exports = router;
