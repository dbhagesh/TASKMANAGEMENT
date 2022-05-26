const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware

// For treating the incoming data to server as json object
app.use(express.json());
app.use(cors());


// Routes and their middlewares

// Register and login routes

app.use('/auth', require('./routes/jwtAuth'));

// Dashboard route

app.use('/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


