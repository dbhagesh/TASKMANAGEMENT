const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const validInfo = require('../middleware/validInfo');
const isMember = require('../middleware/isMember');
const isOwner = require('../middleware/isOwner');
const isRegisteredUser = require('../middleware/isRegisteredUser');

router.get('/', authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [res.locals.user_id]);
        res.json(user.rows[0]);
    } catch (err) {

        console.error(err.message);
        res.status(500).json('Sever error');

    }
})

router.post('/createProject', validInfo, authorization, async (req, res) => {
    try {
        const { project_name, project_description } = req.body;
        const new_project = await pool.query(
            "INSERT INTO project (project_name, project_description, user_id_FK) VALUES ($1, $2, $3) RETURNING *"
            , [project_name, project_description, res.locals.user_id]);

        res.json(new_project.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.get('/fetchProjects', authorization, async (req, res) => {
    try {
        const projects = await pool.query(
            "SELECT project_id_FK as project_id FROM member where user_id_FK = $1 UNION SELECT project_id from project WHERE user_id_FK = $1;"
            , [res.locals.user_id]);

        let projects_arr = [];
        for (let key in projects.rows) {
            projects_arr.push(projects.rows[key].project_id);
        }
        res.json(projects_arr);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.post('/invite', validInfo, authorization, isOwner, isRegisteredUser, async (req, res) => {
    try {
        const { user_email, project_id } = req.body;
        const user = await pool.query(
            "SELECT user_id FROM users WHERE user_email = $1"
            , [user_email]);
        let user_id = user.rows[0].user_id;

        if (user_id === res.locals.user_id) {
            return res.status(400).send('CANT INVITE YOURSELF');
        }

        const member = await pool.query(
            "SELECT exists (SELECT true FROM member WHERE user_id_FK = $1 AND project_id_FK = $2)"
            , [user_id, project_id]);

        if (member.rows[0].exists) {
            return res.status(400).send('USER ALREADY A MEMBER');
        }

        const invites = await pool.query(
            "SELECT exists (SELECT true FROM invitaion WHERE invitation_to_user_id_FK = $1 AND project_id_FK = $2)"
            , [user_id, project_id]);

        if (invites.rows[0].exists) {
            return res.status(400).send('USER ALREADY INVITED FOR THE PROJECT');
        }

        const invitation = await pool.query(
            "INSERT INTO invitation (invitation_by_user_id_FK, invitation_to_user_id_FK, project_id_FK) VALUES ($1, $2, $3) RETURNING *"
            , [res.locals.user_id, user_id, project_id]);

        res.json(invitation.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.get('/fetchInvites', authorization, async (req, res) => {
    try {
        const invitations = await pool.query(
            "SELECT * FROM invitation WHERE invitation_to_user_id_FK = $1;"
            , [res.locals.user_id]);

        let invitations_arr = [];

        for (let key in invitations.rows) {
            invitations_arr.push(invitations.rows[key]);
        }
        res.json(invitations_arr);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.post('/acceptInvite', authorization, validInfo, async (req, res) => {
    try {
        const { invitation_id } = req.body;
        const invitation = await pool.query(
            "SELECT * FROM invitation WHERE invitation_id = $1 AND invitation_to_user_id_FK = $2;"
            , [invitation_id, res.locals.user_id]);

        if (invitation.rows.length == 0) {
            return res.status(400).send("No such invitation.");
        }

        const invitation_completed = await pool.query(
            "DELETE FROM invitation WHERE invitation_id = $1 RETURNING *;"
            , [invitation_id]);

        console.log(invitation.rows[0]['project_id_fk']);
        const project_id = invitation.rows[0]['project_id_fk'];
        const member = await pool.query(
            "INSERT INTO member (user_id_FK, project_id_FK) VALUES ($1, $2) RETURNING *"
            , [res.locals.user_id, project_id]);

        res.json(member.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})


router.post('/rejectInvite', authorization, validInfo, async (req, res) => {
    try {
        const { invitation_id } = req.body;
        const invitation = await pool.query(
            "SELECT * FROM invitation WHERE invitation_id = $1 AND invitation_to_user_id_FK = $2;"
            , [invitation_id, res.locals.user_id]);

        if (invitation.rows.length == 0) {
            return res.status(400).send("No such invitation.");
        }

        const invitation_completed = await pool.query(
            "DELETE FROM invitation WHERE invitation_id = $1 RETURNING *;"
            , [invitation_id]);

        res.json(invitation_completed.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.get('/fetchMembers', validInfo, authorization, isMember, async (req, res) => {
    try {
        const { project_id } = req.body;
        const members = await pool.query(
            "SELECT user_id_FK, user_name, user_email FROM member INNER JOIN users ON user_id_Fk = user_id WHERE project_id_FK = $1;"
            , [project_id]);

        let members_arr = [];

        for (let key in members.rows) {
            members_arr.push(members.rows[key]);
        }
        res.json(members_arr);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.get('/owner', validInfo, authorization, isOwner, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;