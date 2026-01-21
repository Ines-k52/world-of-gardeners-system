const router = require('express').Router();
const auth   = require('../middleware/auth');
const admin  = require('../middleware/admin');
const { Datenquelle } = require('../models');

router.get('/', async (_, res) => res.json(await externeDatenQuelle.findAll()));
router.get('/:id', async (r,s)=>{
  const d = await externeDatenQuelle.findByPk(r.params.id);
  if(!d) return s.sendStatus(404); s.json(d);
});

router.post('/',  auth, admin, async (r,s)=>s.status(201).json(await externeDatenQuelle.create(r.body)));
router.put('/:id',auth, admin, async (r,s)=>{
  const n=await externeDatenQuelle.update(r.body,{where:{datenquelleID:r.params.id}});
  if(!n[0])return s.sendStatus(404);s.sendStatus(204);
});
router.delete('/:id',auth, admin, async (r,s)=>{
  const n=await externeDatenQuelle.destroy({where:{datenquelleID:r.params.id}});
  if(!n)return s.sendStatus(404);s.sendStatus(204);
});

module.exports = router;
