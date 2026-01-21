const express = require('express');
const router  = express.Router();

const {
  Pflanze,
  Eigenschaft,          
  externedatenquelle    
} = require('../models');

router.get('/', async (_req, res) => {
  try {
    const pflanzen = await Pflanze.findAll({
      attributes: ['pflanzenID', 'name', 'wissenschaftlicherName'],
      distinct: true,         
      order: [['name', 'ASC']]
    });

    res.json(pflanzen);
  } catch (err) {
    console.error(err);        
    res.status(500).json({ message: 'Serverfehler', detail: err.message });
  }
});


/* ──────────────────────────────────────────────
   GET /api/pflanzen/:id
   ────────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  const pflanze = await Pflanze.findByPk(req.params.id);
  if (!pflanze) return res.sendStatus(404);
  res.json(pflanze);
});

/* ──────────────────────────────────────────────
   POST /api/pflanzen
   body: { name, wissenschaftlicherName?, eigenschaftID?, datenquelleID? }
   ────────────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const neu = await Pflanze.create(req.body);
    res.status(201).json(neu);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Eingabefehler', details: err.message });
  }
});

/* ──────────────────────────────────────────────
   PUT /api/pflanzen/:id
   ────────────────────────────────────────────── */
router.put('/:id', async (req, res) => {
  const pflanze = await Pflanze.findByPk(req.params.id);
  if (!pflanze) return res.sendStatus(404);

  await pflanze.update(req.body);
  res.json(pflanze);
});

/* ──────────────────────────────────────────────
   POST /api/pflanzen
   body: { name, wissenschaftlicherName?, eigenschaftID?, datenquelleID? }
   → legt nur an, wenn es nicht schon einen Datensatz mit
     exakt diesem Namen & wissenschaftlichen Namen gibt
   ────────────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const { name, wissenschaftlicherName, eigenschaftID, datenquelleID } = req.body;

    const [pflanze, created] = await Pflanze.findOrCreate({
      where: {
        name,
        wissenschaftlicherName: wissenschaftlicherName || null
      },
      defaults: { eigenschaftID, datenquelleID }
    });

    if (created) {
      return res.status(201).json(pflanze);         
    } else {
      return res.status(200).json(pflanze);        
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Eingabefehler', detail: err.message });
  }
});


/* ──────────────────────────────────────────────
   DELETE /api/pflanzen/:id
   ────────────────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  const rows = await Pflanze.destroy({ where: { pflanzenID: req.params.id } });
  if (!rows) return res.sendStatus(404);
  res.sendStatus(204);
});

module.exports = router;
