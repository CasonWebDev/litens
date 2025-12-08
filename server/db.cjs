const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
    db.serialize(() => {
        // Create Products table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_produto TEXT UNIQUE,
            descricao_produto TEXT,
            descricao_produto_es TEXT,
            descricao_produto_en TEXT,
            descricao_grupo_produto TEXT,
            descricao_grupo_produto_es TEXT,
            descricao_grupo_produto_en TEXT,
            foto_produto TEXT,
            produto_lancamento TEXT,
            data_inicio_lancamento TEXT,
            validade_lancamento TEXT,
            produto_novas_aplicacoes TEXT,
            data_inicio_novas_aplicacoes TEXT,
            validade_novas_aplicacoes TEXT,
            observacao_produto TEXT,
            observacao_produto_es TEXT,
            observacao_produto_en TEXT,
            codigo_produto_similar TEXT,
            produto_queima_total TEXT,
            data_inicio_queima_total TEXT,
            validade_queima_total TEXT,
            codigo_produto_grid TEXT,
            ocultar_produto TEXT,
            palavra_chave TEXT,
            tampa TEXT,
            diametro_tampa TEXT,
            numero_filetes TEXT,
            diametro_topo_filete TEXT,
            diametro_rebaixo_eixo TEXT,
            rosca TEXT,
            comprimento TEXT,
            distancia_primeiro_filete TEXT,
            altura_rebaixo_ate_rosca TEXT,
            sentido_rotacao TEXT,
            dimensao_comprimento TEXT,
            dimensao_largura TEXT,
            dimensao_altura TEXT,
            dimensao_diametro TEXT,
            ncm TEXT,
            ipi TEXT,
            codigo_barras TEXT,
            foto_produto_2 TEXT,
            foto_produto_3 TEXT
        )`);

        // Create Product Relations table
        db.run(`CREATE TABLE IF NOT EXISTS product_relations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            main_product_code TEXT,
            related_product_code TEXT,
            UNIQUE(main_product_code, related_product_code)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_code TEXT,
            vehicle_description TEXT,
            manufacturer TEXT,
            segment TEXT,
            fuel TEXT,
            displacement TEXT,
            engine TEXT,
            engine_name TEXT,
            start_year TEXT,
            end_year TEXT,
            alternator TEXT,
            alternator_code TEXT,
            complement TEXT,
            description_es TEXT,
            description_en TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS reference_numbers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_code TEXT,
            manufacturer TEXT,
            reference_number TEXT
        )`);

        // Create Users table
        // Create Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user'
        )`, (err) => {
            if (err) return;

            // Check if column 'role' exists (migration for existing db)
            db.all("PRAGMA table_info(users)", (err, rows) => {
                if (err) return;
                const hasRole = rows.some(r => r.name === 'role');
                if (!hasRole) {
                    db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
                    // Update admin to have admin role
                    db.run("UPDATE users SET role = 'admin' WHERE username = 'admin'");
                }
            });
        });

        // Create a default admin user if not exists
        db.get("SELECT * FROM users WHERE username = 'admin'", async (err, row) => {
            if (!row) {
                const bcrypt = require('bcrypt');
                const hashedPassword = await bcrypt.hash('admin123', 10);
                db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', hashedPassword, 'admin']);
                console.log("Default admin user created: admin / admin123");
            }
        });
    });
};

module.exports = { db, initDb };
