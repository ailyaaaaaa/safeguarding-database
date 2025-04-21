const express = require("express");
const { check, validationResult } = require('express-validator');

module.exports = (pool) => {
  const router = express.Router();

  // GET route: Retrieves all crime reports from the crime_reports table
  router.get('/', function (req, res, next) {
    const sqlquery = "SELECT * FROM crime_reports";
    pool.query(sqlquery, (err, result) => {
      if (err) {
        next(err);
        return res.json(err);
      } else {
        res.json(result);
      }
    });
  });

  // POST route: Receives a new crime report submission with validation
  router.post('/report', [
    check('crime_type').trim().notEmpty().withMessage('crime_type is required'),
    check('latitude').isFloat({ min: -90, max: 90 }).withMessage('latitude must be between -90 and 90'),
    check('longitude').isFloat({ min: -180, max: 180 }).withMessage('longitude must be between -180 and 180'),
    check('description').optional().isString().trim(),
    check('date_time').isISO8601().withMessage('date_time must be a valid ISO8601 date')
  ], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { crime_type, latitude, longitude, description, date_time } = req.body;
    const query = 'INSERT INTO crime_reports (crime_type, latitude, longitude, description, report_time) VALUES (?, ?, ?, ?, ?)';
    
    pool.query(query, [crime_type, latitude, longitude, description, date_time], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error saving report');
        return;
      }
      res.status(200).send('Report saved successfully');
    });
  });

  return router;
};