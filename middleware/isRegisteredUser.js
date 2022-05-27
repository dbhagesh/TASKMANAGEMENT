const pool = require('../db');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const { user_email } = req.body;
        const exists =
            await
                pool.query
                    ("SELECT exists (SELECT true FROM users WHERE user_email=$1);"
                        , [user_email]);
        console.log(exists.rows)
        if (!exists.rows[0].exists)
            throw new Error('INVITED USER NOT REGISTERED')
        next();

    } catch (err) {
        console.error(err.message);
        return res.status(404).json("No user found with the given mail.");
    }
}