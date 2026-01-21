const router = require('express').Router();
const admin  = require('../middleware/admin');
const runScraper = require('../services/scraper'); 

router.post('/', admin, async (_, res) => {
  const count = await runScraper();      
  res.json({ added: count });
});
module.exports = router;
