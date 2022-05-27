const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const jwtToken = req.header('Authorization').split(" ");

        if (!jwtToken[1]) {
            return res.status(403).json("You are not authorized");
        }

        const payload = jwt.verify(jwtToken[1], process.env.JWT_SECRET);
        res.locals.user_id = payload.user;
        next();

    } catch (err) {
        console.error(err.message);
        return res.status(403).json("You are not authorized");
    }
}