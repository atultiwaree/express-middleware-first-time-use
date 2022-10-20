const checkPoint = (req, res, next) => {
  if (req.body.name) {
    if (req.body.age) {
      if (req.body.married) {
        next();
      } else {
        res.status(400);
        res.json({
          error: "clientError",
          response: "Enter bool if married or not",
        });
      }
    } else {
      res.status(400);
      res.json({ error: "clientError", response: "Enter user age" });
    }
  } else {
    res.status(400);
    res.json({ error: "clientError", response: "Enter user name" });
  }
};

module.exports = { checkPoint };
