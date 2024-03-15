import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

const connection = mysql.createConnection(config);
connection.connect();

app.post('/api/register', (req, res) => {
	const { email, password } = req.body;
  
	// Check if the email already exists in the database
	connection.query('SELECT * FROM user WHERE email = ?', email, (error, results) => {
	  if (error) {
		console.error(error);
		return res.status(500).json({ message: 'Failed to register user' });
	  }
  
	  if (results.length > 0) {
		// If the email already exists, return an error response
		return res.status(400).json({ message: 'Email already exists' });
	  }
  
	  // If the email is unique, proceed with user registration
	  const sql = 'INSERT INTO user (email, password) VALUES (?, ?)';
	  const values = [email, password];
	
	  // Execute the query to insert data into the "user" table
	  connection.query(sql, values, (insertError) => {
		if (insertError) {
		  console.error(insertError);
		  return res.status(500).json({ message: 'Failed to register user' });
		}
		
		res.status(201).json({ message: 'User registered successfully' });
	  });
	});
  });

// app.post('/api/getCourses', (req, res) => {
// 	let connection = mysql.createConnection(config);

// 	const sql = `SELECT courseCode, courseTitle FROM courses`;

// 	connection.query(sql, (error, results, fields) => {
// 		if (error) {
// 			return console.error(error.message);
// 		}
// 		let string = JSON.stringify(results);
// 		res.send({ express: string });
// 	});
// 	connection.end();
// });

// // API to add a review to the database
// app.post('/api/addReview', (req, res) => {
// 	const { userID, movieID, reviewTitle, reviewContent, reviewScore } = req.body;

// 	let connection = mysql.createConnection(config);

// 	const sql = `INSERT INTO Review (userID, movieID, reviewTitle, reviewContent, reviewScore) 
// 				 VALUES (?, ?, ?, ?, ?)`;

// 	const data = [userID, movieID, reviewTitle, reviewContent, reviewScore];

// 	connection.query(sql, data, (error, results, fields) => {
// 		if (error) {
// 			console.error("Error adding review:", error.message);
// 			return res.status(500).json({ error: "Error adding review to the database" });
// 		}

// 		return res.status(200).json({ success: true });
// 	});
// 	connection.end();
// });


app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
