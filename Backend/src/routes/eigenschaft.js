const router = require('express').Router();
const auth   = require('../middleware/auth');
const admin  = require('../middleware/admin');
const { Eigenschaft } = require('../models');

router.get('/',          async (_, res)   => res.json(await Eigenschaft.findAll()));
router.get('/:id',       async (r, s)    => {
  const e = await Eigenschaft.findByPk(r.params.id);
  if (!e) return s.sendStatus(404);
  s.json(e);
});

router.post('/',  auth, admin, async (r, s)=> s.status(201).json(await Eigenschaft.create(r.body)));
router.put('/:id',auth, admin, async (r,s)=> {
  const n = await Eigenschaft.update(r.body, { where:{eigenschaftID:r.params.id}});
  if(!n[0]) return s.sendStatus(404); s.sendStatus(204);
});
router.delete('/:id',auth, admin, async (r,s)=> {
  const n = await Eigenschaft.destroy({ where:{eigenschaftID:r.params.id}});
  if(!n) return s.sendStatus(404); s.sendStatus(204);
});

module.exports = router;
