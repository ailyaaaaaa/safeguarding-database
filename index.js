const express = require('express');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const expressSanitizer = require('express-sanitizer');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'safeguarding_app',
  password: process.env.DB_PASSWORD || 'qwertyuiop',
  database: process.env.DB_NAME || 'userreports',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Create an input sanitizer
app.use(expressSanitizer());

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'))

// Create a session
app.use(session({
  secret: 'somerandomstuff',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}))

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  connection.release();
});

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

const usersRoutes = require('./routes/api')
app.use('/api', apiRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});