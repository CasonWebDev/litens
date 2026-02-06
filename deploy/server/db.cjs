const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const dbPath = path.resolve(__dirname, 'database.sqlite');
let dbInstance = null;
let SQL = null;

// Helper to save DB to disk
const saveDb = () => {
    if (dbInstance) {
        const data = dbInstance.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
};

// Wrapper adapting sql.js (sync) to sqlite3 (async callback-style) API
const dbWrapper = {
    serialize: (callback) => {
        // sql.js is already serialized/sync
        if (callback) callback();
    },
    run: function (sql, params, callback) {
        if (!dbInstance) {
            if (callback) callback(new Error("DB not initialized"));
            return this;
        }

        // Handle optional params argument
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        params = params || [];

        try {
            dbInstance.run(sql, params);
            // Save immediately on write operations
            // Simple heuristic: if SQL starts with INSERT, UPDATE, DELETE, CREATE, DROP, ALTER
            const upperSql = sql.trim().toUpperCase();
            if (upperSql.match(/^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|REPLACE)/)) {
                saveDb();
            }

            // Should return 'this' context, and calling callback with context containing lastID/changes
            // sql.js run() doesn't return changes info easily in v1, but we can try execution
            // For now, simpler mock context
            const context = { lastID: 0, changes: 0 };
            // Note: getting real lastID in sql.js usually requires 'SELECT last_insert_rowid()'

            if (upperSql.startsWith('INSERT')) {
                try {
                    const res = dbInstance.exec('SELECT last_insert_rowid() as id');
                    if (res[0] && res[0].values[0]) {
                        context.lastID = res[0].values[0][0];
                    }
                } catch (e) { /* ignore */ }
            }
            // For changes count, sql.js exec doesn't return it directly easily without modification

            if (callback) callback.call(context, null);
        } catch (err) {
            if (callback) callback(err);
            else console.error("DB Run Error:", err);
        }
        return this;
    },
    all: function (sql, params, callback) {
        if (!dbInstance) return callback(new Error("DB not initialized"));
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        params = params || [];

        try {
            // db.each or exec return format is different
            // sql.js .exec returns [{columns, values}]
            // we want array of objects
            const stmt = dbInstance.prepare(sql);
            stmt.bind(params);
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            if (callback) callback(null, rows);
        } catch (err) {
            if (callback) callback(err);
        }
        return this;
    },
    get: function (sql, params, callback) {
        this.all(sql, params, (err, rows) => {
            if (err) return callback(err);
            callback(null, rows && rows.length > 0 ? rows[0] : undefined);
        });
        return this;
    }
};

const initDb = async () => {
    SQL = await initSqlJs({
        locateFile: file => path.join(__dirname, 'sql-wasm.wasm')
    });

    if (fs.existsSync(dbPath)) {
        const filebuffer = fs.readFileSync(dbPath);
        dbInstance = new SQL.Database(filebuffer);
    } else {
        dbInstance = new SQL.Database();
        saveDb(); // Create initial file
    }

    // Initialize Schema
    dbWrapper.serialize(() => {
        // Create Products table
        dbWrapper.run(`CREATE TABLE IF NOT EXISTS products (
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
        dbWrapper.run(`CREATE TABLE IF NOT EXISTS product_relations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            main_product_code TEXT,
            related_product_code TEXT,
            UNIQUE(main_product_code, related_product_code)
        )`);

        dbWrapper.run(`CREATE TABLE IF NOT EXISTS vehicles (
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

        dbWrapper.run(`CREATE TABLE IF NOT EXISTS reference_numbers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_code TEXT,
            manufacturer TEXT,
            reference_number TEXT
        )`);

        // Create Users table
        dbWrapper.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user'
        )`, (err) => {
            if (err) return;

            // Check if column 'role' exists (migration emulation)
            try {
                const res = dbInstance.exec("PRAGMA table_info(users)");
                // res[0].values is array of arrays [cid, name, type, notnull, dflt_value, pk]
                if (res[0]) {
                    const columns = res[0].values.map(v => v[1]);
                    if (!columns.includes('role')) {
                        dbWrapper.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
                        dbWrapper.run("UPDATE users SET role = 'admin' WHERE username = 'admin'");
                    }
                }
            } catch (e) { console.error(e); }
        });

        // Create a default admin user if not exists
        dbWrapper.get("SELECT * FROM users WHERE username = 'admin'", async (err, row) => {
            if (!row) {
                const bcrypt = require('bcryptjs');
                const hashedPassword = await bcrypt.hash('admin123', 10);
                dbWrapper.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', hashedPassword, 'admin']);
                console.log("Default admin user created: admin / admin123");
            }
        });
    });
};

// Start init immediately but it waits for WASM, so commands might fail if called instantly at boot
// Ideally app should wait for initDb, but original code didn't export promise.
// We handle it by checking dbInstance in wrapper
initDb();

module.exports = { db: dbWrapper, initDb };
