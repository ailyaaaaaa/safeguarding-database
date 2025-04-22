const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 8000;

// Use cors middleware to enable CORS
app.use(cors());

// Use express.json() to parse JSON bodies
app.use(express.json());

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser for URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and static js)
app.use(express.static(__dirname + '/public'));

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'safeguarding_app',
  password: 'qwertyuiop',
  database: 'userreports'
});

// Connect to the database
db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Connected to database');
});
global.db = db;

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

const apiRoutes = require('./routes/api')(db);
app.use('/api', apiRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`));