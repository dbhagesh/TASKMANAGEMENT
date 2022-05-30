const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');

// Registering

router.post('/register', validInfo, async (req, res) => {
    try {

        // destructure req.body

        const { name, email, password } = req.body;
        console.log(email)
        // check if user exists

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists");
        }

        // bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        // enter the new user into the database

        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);

        // res.json(newUser.rows[0]);

        // generate our jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
);

// Login route

router.post('/login', validInfo, async (req, res) => {
    try {

        // destructure the req.body

        const { email, password } = req.body;


        // check if user doesn't exist

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json('Email or password are incorrect');
        }

        // check if incoming password matches database password

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json('Email or password are incorrect');
        }

        // give jwt token

        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Update User Setting

router.put('/updateUser', validInfo, async (req, res) => {
    try {

        // destructure req.body

        const { user_id, user_name, user_email } = req.body;

        // check if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);

        if (user.rows.length == 0) {
            return res.status(404).json("No user with this user id");
        }

        // check if user exists
        const exists = await pool.query("SELECT * FROM users WHERE user_email = $1 AND user_id != $2", [user_email, user_id]);

        if (exists.rows.length != 0) {
            return res.status(400).json("User with this email already exists. Try another email.");
        }

        // enter the new user into the database

        const newUser = await pool.query(
            "UPDATE users SET user_name = $1, user_email = $2 where user_id = $3 RETURNING user_name, user_email, user_id",
            [user_name, user_email, user_id]);

        res.json(newUser.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
);
router.get('/verify', authorization, async (req, res) => {
    try {
        await res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;