const pool = require('../db');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        let { project_id } = req.body;
        if (!project_id)
            project_id = req.query.project_id;

        const exists =
            await
                pool.query
                    ("SELECT exists (SELECT true FROM member WHERE project_id_FK=$1 AND user_id_FK = $2 UNION SELECT true FROM project WHERE project_id=$1 AND user_id_FK = $2 );"
                        , [project_id, res.locals.user_id]);

        if (!exists.rows[0].exists)
            throw new Error('USER WHO INVITED IS NOT A MEMBER OF THE PROJECT')
        next();

    } catch (err) {
        console.error(err.message);
        return res.status(403).json("You are not part of the project.");
    }
}