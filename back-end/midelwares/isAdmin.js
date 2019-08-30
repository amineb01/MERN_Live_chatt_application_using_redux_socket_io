var jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  if (!req.payload.kind=="Admin") return res.status(401).send({ message: "you have to be super Admin !" })
    next();
}
