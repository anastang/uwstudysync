import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'client/public/posts/')
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = uuidv4();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

const connection = mysql.createConnection(config);
connection.connect();

// Function to validate email format
function isValidEmail(email) {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

app.post('/api/register', (req, res) => {
	const { email, password, firstName, lastName } = req.body;
  
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

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
  }
  
	  // If the email is unique, proceed with user registration
	  const sql = 'INSERT INTO user (email, password, firstName, lastName) VALUES (?, ?, ?, ?)';
	  const values = [email, password, firstName, lastName];
	
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


app.post('/api/uploadPost', upload.single('file'), (req, res) => {
    const { course, title, description, fileType } = req.body;
    const file = req.file;
    const sql = `INSERT INTO posts (course, title, description, file, file_type, date_posted) VALUES (?, ?, ?, ?, ?, NOW())`;
    const fileURL = `/posts/${file.filename}`;
    const data = [course, title, description, fileURL, fileType];
    let connection = mysql.createConnection(config);
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error uploading post:", error.message);
            connection.end();
            return res.status(500).json({ error: "Error uploading post" });
        }
        connection.end();
        return res.status(200).json({ success: true, filePath: file.path });
    });
});

app.post('/api/getPosts', (req, res) => {
    const course = req.body.course;
    let connection = mysql.createConnection(config);
    const sql = `SELECT * FROM a86syed.posts WHERE course = ?`;
    const data = [course];
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error uploading post:", error.message);
            connection.end();
            return res.status(500).json({ error: "Error uploading post" });
        }
        connection.end();
        let string = JSON.stringify(results);
		res.send({ express: string });
    });
});

app.post('/api/getCourses', (req, res) => {
	let connection = mysql.createConnection(config);

	const sql = `SELECT courseCode, courseTitle FROM a86syed.courses`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/getPost/:post_id', (req, res) => {
    const post_id = req.params.post_id;
    let connection = mysql.createConnection(config);
    const sql = `SELECT * FROM a86syed.posts WHERE id = ?`;
    const data = [post_id];
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error uploading post:", error.message);
            connection.end();
            return res.status(500).json({ error: "Error uploading post" });
        }
        connection.end();
        let string = JSON.stringify(results);
		res.send({ express: string });
    });
});

app.get('/api/posts/:post_id/comments', (req, res) => {
    const { post_id } = req.params;
    const sql = 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC';
    let connection = mysql.createConnection(config);
    connection.query(sql, [post_id], (error, results) => {
        connection.end();
        if (error) {
            return res.status(500).json({ error: "Error fetching comments" });
        }
        res.status(200).json({ comments: results });
    });
});

app.post('/api/posts/:post_id/review', (req, res) => {
    const { post_id } = req.params;
    const { rating, comment } = req.body;
    if(rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    if (rating) { 
        const sql = 'INSERT INTO ratings (post_id, rating) VALUES (?, ?)';
        const data = [post_id, rating];

        let connection = mysql.createConnection(config);
        connection.query(sql, data, (error, results) => {
            connection.end();
            if (error) {
                return res.status(500).json({ error: "Error posting rating" });
            }
        });
    }
    if (comment) { 
        const sql = 'INSERT INTO comments (post_id, comment) VALUES (?, ?)';
        const data = [post_id, comment];

        let connection = mysql.createConnection(config);
        connection.query(sql, data, (error, results) => {
            connection.end();
            if (error) {
                return res.status(500).json({ error: "Error posting comment" });
            }
        });
    }
    res.status(200).json({ success: true, message: 'Review added successfully.' });
});

app.get('/api/posts/:post_id/averageRating', (req, res) => {
    const { post_id } = req.params;
    
    const sql = 'SELECT AVG(rating) AS averageRating FROM ratings WHERE post_id = ?';
    let connection = mysql.createConnection(config);
    connection.query(sql, [post_id], (error, results) => {
        connection.end();
        if (error) {
            return res.status(500).json({ error: "Error calculating average rating" });
        }
        res.status(200).json({average: results[0].averageRating});
    });
});


app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
