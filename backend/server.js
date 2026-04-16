const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware sprawdzające czy klient dostarczył Client-ID
function requireClientId(req, res, next) {
    const clientId = req.headers['client-id'];
    if (!clientId) return res.status(400).json({ error: 'Brak nagłówka Client-ID' });
    req.clientId = clientId;
    next();
}

// Pobieranie ulubionych
app.get('/api/favorites', requireClientId, (req, res) => {
    db.all(`SELECT * FROM favorites WHERE client_id = ?`, [req.clientId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Dodawanie do ulubionych
app.post('/api/favorites', requireClientId, (req, res) => {
    const { city, lat, lon } = req.body;
    db.run(`INSERT INTO favorites (client_id, city, lat, lon) VALUES (?, ?, ?, ?)`, 
    [req.clientId, city, lat, lon], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, city, lat, lon });
    });
});

// Usuwanie z ulubionych
app.delete('/api/favorites/:id', requireClientId, (req, res) => {
    db.run(`DELETE FROM favorites WHERE id = ? AND client_id = ?`, [req.params.id, req.clientId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(this.changes > 0 ? 204 : 404);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer backendowy działa na porcie ${PORT} (Bez warstwy autoryzacyjnej)`);
});
