const express = require('express');
const router = express.Router();
const { db } = require('./db.cjs');
const fs = require('fs');
const csv = require('csv-parse');
const path = require('path');

// Seed vehicles
router.post('/seed-vehicles', (req, res) => {
    const csvPath = path.join(__dirname, '..', 'Cadastro de Veículos - Planilha1.csv');
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
                // No transaction for debugging
                let insertErrors = [];

                db.run("DELETE FROM vehicles"); // Clear existing data

                try {
                    for (const row of records) {
                        db.run(`
                                INSERT INTO vehicles (
                                    product_code, vehicle_description, manufacturer, segment, fuel, 
                                    displacement, engine, engine_name, start_year, end_year, 
                                    alternator, alternator_code, complement, description_es, description_en
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `, [
                            cleanKey(row, 'Código do Produto'),
                            cleanKey(row, 'Descrição do Veículo'),
                            cleanKey(row, 'Descrição do Fabricante'),
                            cleanKey(row, 'Segmento'),
                            cleanKey(row, 'Combustível'),
                            cleanKey(row, 'Cilindrada'),
                            cleanKey(row, 'Motor'),
                            cleanKey(row, 'Nome do motor'),
                            cleanKey(row, 'Ano inicial'),
                            cleanKey(row, 'Ano final'),
                            cleanKey(row, 'Alternador'),
                            cleanKey(row, 'Código alternador'),
                            cleanKey(row, 'Complemento'),
                            cleanKey(row, 'Descrição do Veículo em Espanhol'),
                            cleanKey(row, 'Descrição do Veículo em Inglês')
                        ], function (err) {
                            if (err) insertErrors.push(err.message);
                        });
                    }

                    // Wait for completion
                    db.get("SELECT 1", (err) => {
                        res.json({ message: `Seeded ${records.length} vehicles` });
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

// List vehicles
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let countQuery = 'SELECT COUNT(*) as count FROM vehicles';
    let dataQuery = 'SELECT * FROM vehicles';
    const params = [];

    if (search) {
        const whereClause = ' WHERE vehicle_description LIKE ? OR product_code LIKE ? OR manufacturer LIKE ?';
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

// Get single vehicle
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM vehicles WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(row);
    });
});

// Create vehicle
router.post('/', (req, res) => {
    const {
        product_code, vehicle_description, manufacturer, segment, fuel,
        displacement, engine, engine_name, start_year, end_year,
        alternator, alternator_code, complement, description_es, description_en
    } = req.body;

    const stmt = db.prepare(`
        INSERT INTO vehicles (
            product_code, vehicle_description, manufacturer, segment, fuel, 
            displacement, engine, engine_name, start_year, end_year, 
            alternator, alternator_code, complement, description_es, description_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        product_code, vehicle_description, manufacturer, segment, fuel,
        displacement, engine, engine_name, start_year, end_year,
        alternator, alternator_code, complement, description_es, description_en,
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, ...req.body });
        }
    );
});

// Update vehicle
router.put('/:id', (req, res) => {
    const {
        product_code, vehicle_description, manufacturer, segment, fuel,
        displacement, engine, engine_name, start_year, end_year,
        alternator, alternator_code, complement, description_es, description_en
    } = req.body;

    const stmt = db.prepare(`
        UPDATE vehicles SET 
            product_code = ?, vehicle_description = ?, manufacturer = ?, segment = ?, fuel = ?, 
            displacement = ?, engine = ?, engine_name = ?, start_year = ?, end_year = ?, 
            alternator = ?, alternator_code = ?, complement = ?, description_es = ?, description_en = ?
        WHERE id = ?
    `);

    stmt.run(
        product_code, vehicle_description, manufacturer, segment, fuel,
        displacement, engine, engine_name, start_year, end_year,
        alternator, alternator_code, complement, description_es, description_en,
        req.params.id,
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Vehicle not found' });
            res.json({ id: req.params.id, ...req.body });
        }
    );
});

// Delete vehicle
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM vehicles WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted' });
    });
});

module.exports = router;
