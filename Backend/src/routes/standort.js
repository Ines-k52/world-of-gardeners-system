const router  = require('express').Router();
const auth    = require('../middleware/auth');
const { Standort } = require('../models');

/* -------- alle eigenen Standorte ---------- */
router.get('/', auth, async (req, res) => {
  const daten = await Standort.findAll({
    where: { benutzerID: req.user.benutzerID }
  });
  res.json(daten);
});

/* -------- neuen Standort anlegen ---------- */
// src/routes/standort.js  (Auszug)

router.post('/', auth, async (req, res) => {
  try {
    const { bezeichnung, beschreibung } = req.body;
    if (!bezeichnung) return res.status(400).json({ message: 'Bezeichnung fehlt' });

    const neu = await Standort.create({
      bezeichnung,
      beschreibung,
      benutzerID: req.user.benutzerID
    });

    res.status(201).json(neu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverfehler', detail: err.message });
  }
});


/* -------- einzelnen Standort holen -------- */
router.get('/:id', auth, async (req, res) => {
  const s = await Standort.findByPk(req.params.id);
  if (!s) return res.sendStatus(404);
  if (s.benutzerID !== req.user.benutzerID) return res.sendStatus(403);
  res.json(s);
});

/* -------- Standort ändern ----------------- */
router.put('/:id', auth, async (req, res) => {
  const s = await Standort.findByPk(req.params.id);
  if (!s) return res.sendStatus(404);
  if (s.benutzerID !== req.user.benutzerID) return res.sendStatus(403);

  await s.update(req.body);
  res.sendStatus(204);
});

/* -------- Standort löschen ---------------- */
router.delete('/:id', auth, async (req, res) => {
  const s = await Standort.findByPk(req.params.id);
  if (!s) return res.sendStatus(404);
  if (s.benutzerID !== req.user.benutzerID) return res.sendStatus(403);

  await s.destroy();
  res.sendStatus(204);
});

module.exports = router;
