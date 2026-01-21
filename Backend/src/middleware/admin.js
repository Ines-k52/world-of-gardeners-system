module.exports = (req, res, next) => {
  if (!req.user?.isAdmin) return res.sendStatus(403);
  next();
};
