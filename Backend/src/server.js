// -------------------------------------------------------------
// src/server.js
// -------------------------------------------------------------
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const app = express();

/* ───────────── 1.  Middleware ───────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  if (req.method === 'OPTIONS') return res.sendStatus(204); 
  next();
});

/* ───────────── 2.  API-Routen ───────────── */
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/bestand',       require('./routes/pflanzenbestand'));
app.use('/api/pflanzen',      require('./routes/pflanze'));
app.use('/api/eigenschaften', require('./routes/eigenschaft')); 
app.use('/api/standort',      require('./routes/standort'));
app.use('/api/datenquellen',  require('./routes/datenquellen'));
app.use('/api/mitglied',      require('./routes/mitglied'));

/* Health-Check */
app.get('/health', (_, res) => res.json({ status: 'OK', message: 'Server läuft' }));

/* 404-Fallback */
app.use('*', (_, res) => res.status(404).json({ message: 'Route nicht gefunden' }));

/* Error-Handler (zuletzt) */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Interner Serverfehler' });
});

/* ───────────── 3.  Server & DB-Start ──────── */
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Datenbankverbindung erfolgreich');
    await sequelize.sync({ alter: true });
    console.log('Datenbank synchronisiert');

    app.listen(PORT, () =>
      console.log(`Server läuft auf Port ${PORT}`)
    );
  } catch (err) {
    console.error('Fehler beim Starten des Servers:', err);
    process.exit(1);
  }
})();
