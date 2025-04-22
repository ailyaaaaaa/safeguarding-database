const express = require("express");
const { check, validationResult } = require('express-validator');
const moment = require('moment');

module.exports = (db) => {
  const router = express.Router();

  // GET route: Retrieves all crime reports from the crime_reports table
  router.get('/', function (req, res, next) {
    const sqlquery = "SELECT * FROM crime_reports";
    db.query(sqlquery, (err, result) => {
      if (err) {
        next(err);
        return res.json(err);
      } else {
        res.json(result);
      }
    });
  });

  // Show nearby crimes
  router.get('/nearby', function (req, res) {
    const { lat, lng, size } = req.query;
  
    if (!lat || !lng || !size) {
      return res.status(400).json({ error: "Missing lat, lng or size" });
    }
  
    const R = 6378137; // Radius of Earth in meters
    const d = size / 2; // Half the square size
  
    const latRad = lat * Math.PI / 180;
    const dLat = d / R;
    const dLon = d / (R * Math.cos(latRad));
  
    const north = parseFloat(lat) + (dLat * 180 / Math.PI);
    const south = parseFloat(lat) - (dLat * 180 / Math.PI);
    const east = parseFloat(lng) + (dLon * 180 / Math.PI);
    const west = parseFloat(lng) - (dLon * 180 / Math.PI);
  
    const query = `
      SELECT * FROM crime_reports
      WHERE latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
    `;
  
    db.query(query, [south, north, west, east], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.json(results);
    });
  });  

  // POST route: Receives a new crime report submission with validation
  router.get('/report', [
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
  
    const { crime_type, latitude, longitude, description, date_time } = req.query;
    
    // Convert ISO 8601 date to MySQL DATETIME format
    const formattedDateTime = moment(date_time).format('YYYY-MM-DD HH:mm:ss');
  
    const query = 'INSERT INTO crime_reports (crime_type, latitude, longitude, description, report_time) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [crime_type, latitude, longitude, description, formattedDateTime], (err, result) => {
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