const express = require('express');
const router = express.Router();
const { db } = require('./db.cjs');
const fs = require('fs');
const csv = require('csv-parse');
const path = require('path');

// Seed references
router.post('/seed-references', (req, res) => {
    const csvPath = path.join(__dirname, '..', 'Cadastro de Números de Refêrencias - Planilha1.csv');
    const records = [];

    fs.createReadStream(csvPath)
        .pipe(csv.parse({ columns: true, trim: true, delimiter: ',' }))
        .on('data', (row) => {
            records.push(row);
        })
        .on('end', () => {
            const cleanKey = (obj, keyPart) => {
                const key = Object.keys(obj).find(k => k.includes(keyPart));
                return key ? obj[key] : '';
            };

            db.serialize(() => {
                db.run("DELETE FROM reference_numbers"); // Clear existing data

                try {
                    for (const row of records) {
                        db.run(`
                            INSERT INTO reference_numbers (product_code, manufacturer, reference_number)
                            VALUES (?, ?, ?)
                        `, [
                            cleanKey(row, 'Código do Produto'),
                            cleanKey(row, 'Descrição do Fabricante'),
                            cleanKey(row, 'Número Referência')
                        ], function (err) {
                            if (err) console.error("Insert Error:", err.message);
                        });
                    }

                    // Wait for completion
                    db.get("SELECT 1", (err) => {
                        res.json({ message: `Seeded ${records.length} references` });
                    });

                } catch (err) {
                    console.error(err);
                    res.status(500).json({ error: err.message });
                }
            });
        })
        .on('error', (err) => {
            res.status(500).json({ error: err.message });
        });
});

// List references
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let countQuery = 'SELECT COUNT(*) as count FROM reference_numbers';
    let dataQuery = 'SELECT * FROM reference_numbers';
    const params = [];

    if (search) {
        const whereClause = ' WHERE product_code LIKE ? OR manufacturer LIKE ? OR reference_number LIKE ?';
        countQuery += whereClause;
        dataQuery += whereClause;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    dataQuery += ' ORDER BY id DESC LIMIT ? OFFSET ?';

    db.get(countQuery, params, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        const total = row.count;

        db.all(dataQuery, [...params, limit, offset], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                data: rows,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        });
    });
});

// Get single reference
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM reference_numbers WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Reference not found' });
        res.json(row);
    });
});

// Create reference
router.post('/', (req, res) => {
    const { product_code, manufacturer, reference_number } = req.body;

    const stmt = db.prepare('INSERT INTO reference_numbers (product_code, manufacturer, reference_number) VALUES (?, ?, ?)');
    stmt.run(product_code, manufacturer, reference_number, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, product_code, manufacturer, reference_number });
    });
    stmt.finalize();
});

// Update reference
router.put('/:id', (req, res) => {
    const { product_code, manufacturer, reference_number } = req.body;

    const stmt = db.prepare('UPDATE reference_numbers SET product_code = ?, manufacturer = ?, reference_number = ? WHERE id = ?');
    stmt.run(product_code, manufacturer, reference_number, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Reference not found' });
        res.json({ id: req.params.id, product_code, manufacturer, reference_number });
    });
    stmt.finalize();
});

// Delete reference
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM reference_numbers WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Reference not found' });
        res.json({ message: 'Reference deleted' });
    });
});

module.exports = router;
