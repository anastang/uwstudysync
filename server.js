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

app.post('/api/getCourses', (req, res) => {
	let connection = mysql.createConnection(config);

	const sql = `SELECT courseCode, courseTitle FROM courses`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});


app.post('/api/uploadPost', upload.single('file'), (req, res) => {
    const { course, title, description } = req.body;
    const file = req.file;
    const sql = `INSERT INTO posts (course, title, description, file, date_posted) VALUES (?, ?, ?, ?, NOW())`;
    const fileURL = `/posts/${file.filename}`;
    const data = [course, title, description, fileURL];
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

app.post('/api/uploadPost', upload.single('file'), (req, res) => {
    const course = req.body.course;
	const title = req.body.title;
	const description = req.body.description;
    const file = req.file;
    const filePath = file.path;
    const fs = require('fs');
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Error processing file" });
        }
        let connection = mysql.createConnection(config);
        const sql = `INSERT INTO posts (course, title, description, file, date_posted) VALUES (?, ?, ?, ?, NOW())`;
        const data = [course, title, description, fileData];
        
        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                console.error("Error uploading post to DB:", error.message);
                connection.end();
                return res.status(500).json({ error: "Error uploading post to DB" });
            }
            connection.end();
            return res.status(200).json({ success: true, message: 'Post uploaded successfully to DB.' });
        });
    });
});

app.post('/api/fetchCourseContent', (req, res) => {
    const course = req.body.course;
    console.log(course);
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
        console.log(string);
		res.send({ express: string });
    });
});

app.get('/api/getPost/:post_id', (req, res) => {
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
        console.log(string);
		res.send({ express: string });
    });
});

app.post('/api/posts/:post_id/comments', (req, res) => {
    const { post_id } = req.params;
    const { comment } = req.body;

    const sql = 'INSERT INTO comments (post_id, comment) VALUES (?, ?)';
    const data = [post_id, comment];

    let connection = mysql.createConnection(config);
    connection.query(sql, data, (error, results) => {
        connection.end();
        if (error) {
            return res.status(500).json({ error: "Error posting comment" });
        }
        res.status(200).json({ success: true, message: 'Comment added successfully.' });
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

app.post('/api/posts/:post_id/ratings', (req, res) => {
    const { post_id } = req.params;
    const { rating } = req.body;

    if(rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const sql = 'INSERT INTO ratings (post_id, rating) VALUES (?, ?)';
    const data = [post_id, rating];

    let connection = mysql.createConnection(config);
    connection.query(sql, data, (error, results) => {
        connection.end();
        if (error) {
            return res.status(500).json({ error: "Error posting rating" });
        }
        res.status(200).json({ success: true, message: 'Rating added successfully.' });
    });
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
