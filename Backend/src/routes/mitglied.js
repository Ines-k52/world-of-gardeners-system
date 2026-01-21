const express  = require('express');
const bcrypt   = require('bcrypt');
const router   = express.Router();

const auth   = require('../middleware/auth');  
const admin  = require('../middleware/admin'); 

const { Mitglied, Pflanzenbestand } = require('../models');

router.get('/me', auth, async (req, res) => {
  const me = await Mitglied.findByPk(req.user.benutzerID, {
    attributes: { exclude: ['passwortHash'] },
    include: {
      model: Pflanzenbestand,
      attributes: ['bestandID']      
    }
  });
  res.json(me);
});

router.put('/me', auth, async (req, res) => {
  const { vorname, nachname, email, passwort } = req.body;
  const target = await Mitglied.findByPk(req.user.benutzerID);
  if (!target) return res.sendStatus(404);

  if (vorname)  target.vorname  = vorname;
  if (nachname) target.nachname = nachname;
  if (email)    target.email    = email;
  if (passwort) target.passwortHash = await bcrypt.hash(passwort, 12);

  await target.save();
  res.sendStatus(204);
});

router.delete('/me', auth, async (req, res) => {
  await Mitglied.destroy({ where: { benutzerID: req.user.benutzerID } });
  res.sendStatus(204);
});

router.get('/', auth, admin, async (_, res) => {
  const alle = await Mitglied.findAll({
    attributes: { exclude: ['passwortHash'] }
  });
  res.json(alle);
});

router.get('/:id', auth, admin, async (req, res) => {
  const m = await Mitglied.findByPk(req.params.id, {
    attributes: { exclude: ['passwortHash'] }
  });
  if (!m) return res.sendStatus(404);
  res.json(m);
});

router.put('/:id', auth, admin, async (req, res) => {
  const target = await Mitglied.findByPk(req.params.id);
  if (!target) return res.sendStatus(404);

  const { vorname, nachname, email, passwort, isAdmin } = req.body;
  if (vorname)  target.vorname  = vorname;
  if (nachname) target.nachname = nachname;
  if (email)    target.email    = email;
  if (isAdmin !== undefined) target.isAdmin = !!isAdmin;
  if (passwort) target.passwortHash = await bcrypt.hash(passwort, 12);

  await target.save();
  res.sendStatus(204);
});

router.delete('/:id', auth, async (req, res) => {
  const zielId = Number(req.params.id);


  if (!req.user.isAdmin && req.user.benutzerID !== zielId) {
    return res.sendStatus(403);
  }

  const rows = await Mitglied.destroy({ where: { benutzerID: zielId } });
  if (!rows) return res.sendStatus(404);
  res.sendStatus(204);
});

module.exports = router;
