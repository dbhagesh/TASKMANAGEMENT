const pool = require('../db');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const { project_id } = req.body;
        const exists =
            await
                pool.query
                    ("SELECT exists (SELECT true FROM project WHERE project_id=$1 AND user_id_FK = $2);"
                        , [project_id, res.locals.user_id]);

        if (!exists.rows[0].exists)
            throw new Error('USER IS NOT THE OWNER OF THE PROJECT')
        next();

    } catch (err) {
        console.error(err.message);
        return res.status(403).json("You are not the owner of the project.");
    }
}