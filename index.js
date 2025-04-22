const express = require('express');
const mysql = require('mysql2');

const app = express();
//app.use(express.json());
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
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
      throw err
  }
  console.log('Connected to database')
})
global.db = db

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

const apiRoutes = require('./routes/api')(db);
app.use('/api', apiRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))