const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { Mitglied } = require('../models');
require('dotenv').config();

/* ---------- REGISTER ---------- */
router.post('/register', async (req, res) => {
  const { vorname, nachname, email, passwort } = req.body;
  if (!vorname || !nachname || !email || !passwort) {
    return res.status(400).json({ msg: 'Pflichtfelder fehlen' });
  }

  try {
    const exist = await Mitglied.findOne({ where: { email } });
    if (exist) return res.status(409).json({ msg: 'E-Mail schon vergeben' });

    const passwortHash = await bcrypt.hash(passwort, 12);
    const mitglied = await Mitglied.create({ vorname, nachname, email, passwortHash });

    const token = jwt.sign(
      { benutzerID: mitglied.benutzerID, email, isAdmin: mitglied.isAdmin },
      process.env.JWT_SECRET
    );
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err });
  }
});

/* ---------- LOGIN ---------- */
router.post('/login', async (req, res) => {
  const { email, passwort } = req.body;
  try {
    const mitglied = await Mitglied.findOne({ where: { email } });
    if (!mitglied) return res.status(401).json({ msg: 'Login fehlgeschlagen' });

    const ok = await bcrypt.compare(passwort, mitglied.passwortHash);
    if (!ok) return res.status(401).json({ msg: 'Login fehlgeschlagen' });

    const token = jwt.sign(
      { benutzerID: mitglied.benutzerID, email, isAdmin: mitglied.isAdmin },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;       
