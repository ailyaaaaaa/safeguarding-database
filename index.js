const express = require('express');
const mysql = require('mysql2');

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
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and static js)
app.use(express.static(__dirname + '/public'));

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

const apiRoutes = require('./routes/api')(pool); // Pass the pool to the routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});