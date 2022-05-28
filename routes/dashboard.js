const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const validInfo = require('../middleware/validInfo');
const isMember = require('../middleware/isMember');
const isOwner = require('../middleware/isOwner');
const isRegisteredUser = require('../middleware/isRegisteredUser');

router.get('/', authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT user_name, user_email FROM users WHERE user_id = $1", [res.locals.user_id]);
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
            "SELECT exists (SELECT true FROM invitation WHERE invitation_to_user_id_FK = $1 AND project_id_FK = $2)"
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

router.post('/createTask', validInfo, authorization, isOwner, async (req, res) => {
    try {
        const { task_name, task_description, project_id } = req.body;
        const task = await pool.query(
            "INSERT INTO task (task_name, task_description, project_id_FK) VALUES ($1, $2, $3) RETURNING *"
            , [task_name, task_description, project_id]);

        res.json(task.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.put('/modifyTask', validInfo, authorization, async (req, res) => {
    try {
        const { task_id, task_name, task_description, task_priority, task_type, project_id } = req.body;

        const exists = await pool.query(
            "SELECT EXISTS (SELECT true FROM project WHERE project_id = $1 AND user_id_FK = $2 UNION SELECT true FROM taskAlloted WHERE task_id_FK = $3 AND user_id_FK = $2);"
            , [project_id, res.locals.user_id, task_id]);

        if (!exists.rows[0].exists) {
            return res.status(401).send('You are not authorized for the task');
        }

        const old_task = await pool.query(
            "SELECT * FROM task WHERE task_id = $1"
            , [task_id]);

        if (old_task.rows.length == 0) {
            return res.status(404).send('No such task exists');
        }
        if (task_type < 1 || task_type > 3) {
            return res.status(404).send('No such task type exists');
        }

        if (old_task.rows[0]['task_name'] === task_name
            && old_task.rows[0]['task_description'] === task_description
            && old_task.rows[0]['task_priority'] === task_priority
            && old_task.rows[0]['task_type'] === task_type
        ) {
            return res.status(409).send('The modified and already existed task matched. Please modify the task');
        }
        const task = await pool.query(
            "UPDATE task SET task_name = $1, task_description = $2, task_priority = $3, task_type = $4  WHERE task_id = $5  RETURNING *"
            , [task_name, task_description, task_priority, task_type, task_id]);

        res.json(task.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})


router.post('/allocate', validInfo, authorization, isOwner, async (req, res) => {
    try {
        const { project_id, task_id, user_id } = req.body;

        const exists =
            await
                pool.query
                    ("SELECT exists (SELECT true FROM member WHERE project_id_FK = $1 AND user_id_FK = $2 UNION SELECT true FROM project WHERE project_id = $1 AND user_id_FK = $2 );"
                        , [project_id, user_id]);

        if (!exists.rows[0].exists)
            return res.status(401).send('User is not the member of the project')

        const old_task = await pool.query(
            "SELECT EXISTS (SELECT true FROM taskAlloted WHERE task_id_FK = $1 AND user_id_FK = $2);"
            , [task_id, user_id]);

        if (old_task.rows[0].exists) {
            return res.status(409).send('Task Already Alloted to the user');
        }

        const task = await pool.query(
            "INSERT INTO taskAlloted (task_id_FK, user_id_FK) VALUES ($1, $2) RETURNING *"
            , [task_id, user_id]);

        res.json(task.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})


router.get('/fetchTasks', validInfo, authorization, isMember, async (req, res) => {
    try {
        const { project_id } = req.body;
        const tasks = await pool.query(
            "SELECT * FROM task WHERE project_id_FK = $1;"
            , [project_id]);

        let tasks_A = [],
            tasks_B = [],
            tasks_C = [];

        let tasks_arr = [];

        for (let key in tasks.rows) {
            if (tasks.rows[key]['task_type'] === 1) {
                tasks_A.push(tasks.rows[key]);
            }
            if (tasks.rows[key]['task_type'] === 2) {
                tasks_B.push(tasks.rows[key]);
            }
            if (tasks.rows[key]['task_type'] === 3) {
                tasks_C.push(tasks.rows[key]);
            }
        }

        tasks_arr.push(tasks_A);
        tasks_arr.push(tasks_B);
        tasks_arr.push(tasks_C);

        res.json(tasks_arr);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})


router.get('/fetchOwnTasks', validInfo, authorization, isMember, async (req, res) => {
    try {
        const { project_id } = req.body;
        const tasks = await pool.query(
            "SELECT * FROM task WHERE project_id_FK = $1 AND task_id IN (SELECT task_id_FK FROM taskAlloted WHERE user_id_FK = $2);"
            , [project_id, res.locals.user_id]);

        let tasks_A = [],
            tasks_B = [],
            tasks_C = [];

        let tasks_arr = [];

        for (let key in tasks.rows) {
            if (tasks.rows[key]['task_type'] === 1) {
                tasks_A.push(tasks.rows[key]);
            }
            if (tasks.rows[key]['task_type'] === 2) {
                tasks_B.push(tasks.rows[key]);
            }
            if (tasks.rows[key]['task_type'] === 3) {
                tasks_C.push(tasks.rows[key]);
            }
        }

        tasks_arr.push(tasks_A);
        tasks_arr.push(tasks_B);
        tasks_arr.push(tasks_C);

        res.json(tasks_arr);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.get('/fetchTaskUsers', validInfo, authorization, isMember, async (req, res) => {
    try {
        const { task_id } = req.body;
        const users = await pool.query(
            "SELECT * FROM taskAlloted WHERE task_id_FK = $1;"
            , [task_id]);

        let users_arr = [];

        for (let key in users.rows) {
            users_arr.push(users.rows[key]);
        }

        res.json(users_arr);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

router.get('/userDetails', validInfo, authorization, async (req, res) => {
    try {
        const { user_id } = req.body;
        const users = await pool.query(
            "SELECT user_name, user_email FROM users WHERE user_id = $1;"
            , [user_id]);

        if (users.rows.length == 0) {
            return res.status(404).send("No user found with this ID")
        }

        res.json(users.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})


module.exports = router;