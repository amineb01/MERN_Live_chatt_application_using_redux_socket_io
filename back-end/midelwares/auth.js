var jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    const token = req.header('x-token');
    if (!token) return res.status(401).send({ message: "token is required" })
    try {
        const payload = await jwt.verify(token,'secretkey');
        if ( !payload ) return res.status(403).send({ message: "forbidden acces" })
        req.payload=payload;
          next();
        }
    catch (err) {
        return res.status(401).send({ message: err.message })
    }

}
