// -------------------------------------------------------------
// src/routes/pflanzenbestand.js
// -------------------------------------------------------------
const express = require('express');
const router  = express.Router();

const auth = require('../middleware/auth');
const sequelize  = require('../config/db');          
const { Pflanzenbestand, Pflanze, Standort } = require('../models');

/* ───────── GET /api/bestand ───────── */
router.get('/', auth, async (req, res) => {
  const daten = await Pflanzenbestand.findAll({
    where: { benutzerID: req.user.benutzerID },
    order: [['bestandID', 'DESC']],
    include: [
      { model: Pflanze,  attributes: ['name', 'wissenschaftlicherName'] },
      { model: Standort, attributes: ['bezeichnung'] }
    ]
  });
  res.json(daten);
});

/* ───────── POST /api/bestand ───────── */
router.post('/', auth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let {
      pflanzenID,
      standortID,
      bezeichnung = '',
      pflegehinweis,
      pflanzdatum,
      erntedatum,
      jahr
    } = req.body;

    if (!pflanzenID || (!standortID && !bezeichnung.trim()))
      return res.status(400).json({ message: 'pflanzenID **und** standortID (oder bezeichnung) nötig' });

    let standort;
    if (standortID) {
      standort = await Standort.findByPk(standortID, { transaction: t });
      if (!standort) throw new Error('Ungültige standortID');
    } else {
      bezeichnung = bezeichnung.trim();
      standort = await Standort.findOne({ where: { bezeichnung }, transaction: t });
      if (!standort) {
        standort = await Standort.create(
          { bezeichnung, benutzerID: req.user.benutzerID },
          { transaction: t }
        );
      }
    }

    const neu = await Pflanzenbestand.create({
      pflanzenID,
      benutzerID : req.user.benutzerID,
      standortID : standort.standortID,
      jahr       : jahr || new Date().getFullYear(),
      pflegehinweis,
      pflanzdatum,
      erntedatum
    }, { transaction: t });

    await t.commit();
    res.status(201).json(neu);

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Serverfehler', detail: err.message });
  }
});

module.exports = router;
