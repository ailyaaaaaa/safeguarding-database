CREATE DATABASE IF NOT EXISTS userreports;
USE userreports;

DROP TABLE IF EXISTS crime_reports;

CREATE TABLE IF NOT EXISTS crime_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crime_type VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    description TEXT,
    report_time DATETIME NOT NULL
);

# Create the app user
CREATE USER IF NOT EXISTS 'safeguarding_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON userreports.* TO 'safeguarding_app'@'localhost';
FLUSH PRIVILEGES;