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
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};

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

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const checkAuth = (req, res, next) => {
    const idToken = req.headers.authorization;
    if (!idToken) {
        return res.status(403).send('Unauthorized');
    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        next();
    }).catch(error => {
        res.status(403).send('Unauthorized');
    });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

const connection = mysql.createConnection(config);
connection.connect();

app.post('/api/registerUser', (req, res) => {
	const { id, email, password, username } = req.body;
	connection.query('SELECT * FROM a86syed.users WHERE email = ?', email, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error registering user' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Account with this email already exists' });
        }
	});

    const sql = 'INSERT INTO a86syed.users (id, email, password, username) VALUES (?, ?, ?, ?)';
    const data = [id, email, password, username];
    connection.query(sql, data, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error registering user' });
        }
        res.status(200).json({ message: 'Successfully registered user' });
    });
});


app.post('/api/getUserDetails/:id', (req, res) => {
	const id = req.params.id;
	connection.query('SELECT email, username FROM a86syed.users WHERE id = ?', id, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching user' });
        }
        let string = JSON.stringify(results[0]);
		res.send({ express: string });
	});
});

app.post('/api/updateUsername', (req, res) => {
	const { id, username } = req.body;
    const sql = 'UPDATE a86syed.users SET username = ? WHERE id = ?;';
    const data = [username, id];
    connection.query(sql, data, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating username' });
        }
        res.status(200).json({ message: 'Successfully updated username' });
    });
});

app.post('/api/uploadPost', upload.single('file'), (req, res) => {
    const { course, fileType, title, description, user_id } = req.body;
    const file = req.file;
    const sql = `INSERT INTO posts (course, title, description, file, file_type, date_posted, user_id) VALUES (?, ?, ?, ?, ?, NOW(), ?)`;
    const fileURL = `/posts/${file.filename}`;
    const data = [course, title, description, fileURL, fileType, user_id];
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error uploading post:", error.message);
            return res.status(500).json({ error: "Error uploading post" });
        }
        return res.status(200).json({ success: true, filePath: file.path });
    });
});

app.post('/api/uploadLink', (req, res) => {
    const { course, title, description, user_id } = req.body;
    console.log(course, title, description, user_id);
    const sql = `INSERT INTO posts (course, title, description, file_type, date_posted, user_id) VALUES (?, ?, ?, "Link", NOW(), ?)`;
    const data = [course, title, description, user_id];
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error uploading post:", error.message);
            return res.status(500).json({ error: "Error uploading post" });
        }
        return res.status(200).json({ success: true });
    });
});

app.post('/api/getCourses', (req, res) => {
	const sql = `SELECT courseCode, courseTitle FROM a86syed.courses`;
	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
});

app.post('/api/getFavCourses/:id', (req, res) => {
    const id = req.params.id;
	const sql = `SELECT courseCode FROM a86syed.saved_courses where user_id = ?`;
	connection.query(sql, id, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
});

app.post('/api/addFavCourse', (req, res) => {
    const { courseCode, id } = req.body;
	const sql = `INSERT INTO saved_courses (courseCode, user_id) VALUES (?, ?)`;
	connection.query(sql, [courseCode, id], (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
});

app.post('/api/removeFavCourse', (req, res) => {
    const { courseCode, id } = req.body;
	const sql = `DELETE FROM a86syed.saved_courses WHERE courseCode = ? AND user_id = ?`;
	connection.query(sql, [courseCode, id], (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
});

app.post('/api/getPosts', (req, res) => {
    const course = req.body.course;
    const sql = `SELECT posts.*, AVG(reviews.rating) AS rating
    FROM a86syed.posts AS posts
    LEFT JOIN a86syed.reviews AS reviews ON posts.id = reviews.post_id
    WHERE posts.course = ?
    GROUP BY posts.id`;
    const data = [course];
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error uploading post:", error.message);
            return res.status(500).json({ error: "Error uploading post" });
        }
        let string = JSON.stringify(results);
		res.send({ express: string });
    });
});

app.post('/api/getPost/:post_id', (req, res) => {
    const post_id = req.params.post_id;
    const sql = `SELECT posts.*, users.username, 
    (SELECT AVG(rating) FROM a86syed.reviews WHERE post_id = posts.id) AS rating
    FROM a86syed.posts AS posts
    INNER JOIN a86syed.users AS users ON posts.user_id = users.id 
    WHERE posts.id = ?`;
    connection.query(sql, post_id, (error, results, fields) => {
        if (error) {
            console.error("Error uploading post:", error.message);
            return res.status(500).json({ error: "Error uploading post" });
        }
        let string = JSON.stringify(results);
		res.send({ express: string });
    });
});

app.post('/api/getComments/:post_id', (req, res) => {
    const post_id = req.params.post_id;
    const sql = `SELECT reviews.*, users.username 
    FROM a86syed.reviews AS reviews
    INNER JOIN a86syed.users AS users ON reviews.user_id = users.id 
    WHERE post_id = ? 
    ORDER BY date_posted DESC`;
    connection.query(sql, post_id, (error, results, fields) => {
        if (error) {
            console.error("Error retrieving comments:", error.message);
            return res.status(500).json({ error: "Error retrieving comments" });
        }
        let string = JSON.stringify(results);
		res.send({ express: string });
    });
});

app.post('/api/postReview', (req, res) => {
    const { post_id, user_id, rating, comment } = req.body;
    const sql = 'INSERT INTO reviews (post_id,  user_id, rating, comment) VALUES (?, ?, ?, ?)';
    const data = [post_id, user_id, rating, comment];

    connection.query(sql, data, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error posting review" });
        }
    });
    res.status(200).json({ success: true, message: 'Review added successfully.' });
});

app.post('/api/deleteReview', (req, res) => {
    const { id, user_id } = req.body;
    const sql = 'DELETE FROM a86syed.reviews WHERE id = ? AND user_id = ?';
    const data = [id, user_id];
    connection.query(sql, data, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error posting review" });
        }
    });
    res.status(200).json({ success: true, message: 'Review deleted successfully.' });
});

app.post('/api/getMyPosts/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT posts.*, AVG(reviews.rating) AS rating
    FROM a86syed.posts AS posts
    LEFT JOIN a86syed.reviews AS reviews ON posts.id = reviews.post_id
    WHERE posts.user_id = ?
    GROUP BY posts.id`;
    connection.query(sql, id, (error, results, fields) => {
        if (error) {
            console.error("Error retrieving my posts:", error.message);
            return res.status(500).json({ error: "Error retrieving my posts" });
        }
        let string = JSON.stringify(results);
		res.send({ express: string });
    });
});

app.post('/api/deletePost/:user_id/:post_id', (req, res) => {
    const { user_id, post_id } = req.params;
    connection.query('DELETE FROM a86syed.reviews WHERE post_id = ?', [post_id]);
    const sql = `DELETE FROM a86syed.posts WHERE user_id = ? AND id = ?`;
    connection.query(sql, [user_id, post_id], (error, results, fields) => {
        if (error) {
            console.error("Error deleting post:", error.message);
            return res.status(500).json({ error: "Error deleting post" });
        }
        let string = JSON.stringify(results);
		res.send({ express: string });
    });
});

app.post('/api/deleteAccount/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await connection.beginTransaction();
        await connection.query('DELETE FROM a86syed.reviews WHERE user_id = ?', [id]);
        await connection.query('DELETE FROM a86syed.posts WHERE user_id = ?', [id]);
        await connection.query('DELETE FROM a86syed.users WHERE id = ?', [id]);
        await connection.commit();
        res.status(200).json({ success: true, message: 'Account deleted successfully.' });
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting account:", error.message);
        res.status(500).json({ success: false, message: 'Error deleting account' });
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
