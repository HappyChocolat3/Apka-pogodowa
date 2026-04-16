const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'weather.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Błąd otwarcia bazy danych', err.message);
    } else {
        console.log('Połączono z bazą SQLite (Non-Auth mode).');
        
        db.run(`CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id TEXT,
            city TEXT,
            lat REAL,
            lon REAL
        )`);
    }
});

module.exports = db;
