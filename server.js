const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const path = require('path');
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://avishek:perseverance@database.qbio8qc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = "Aces_techfest";

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

let db;
(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
})();

function getDb() {
  if (!db) {
    throw new Error('MongoDB is not connected');
  }
  return db;
}

module.exports = { getDb };


app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/blog1', (req, res) => {
    res.render('blog1');
});

app.get('/blog2', (req, res) => {
    res.render('blog2');
});

app.get('/blogs', (req, res) => {
    res.render('blogs');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/hints', (req, res) => {
    res.render('hints');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/reset-password', (req, res) => {
    res.render('reset-password');
});

app.post('/reset-password', async (req, res) => {
    res.render('reset-password');
});

app.get('/scoreboard', (req, res) => {
    res.render('scoreboard');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/logout', (req, res) => {
    res.render('logout');
});


// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const users = db.collection('idor');
        const user = await users.findOne({ email, password });

        if (user) {
        res.redirect(`/profileidor?userID=${user.userID}`);
        } else {
        res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});
  
  // Profile route with IDOR vulnerability
app.get('/profileidor', async (req, res) => {
    const userID = parseInt(req.query.userID, 10);

    try {
        const users = db.collection('idor');
        const user = await users.findOne({ userID });

        if (user) {
        // Display user information and flag
        res.send(`
            <h1>${user.email}'s Profile</h1>
            <p><strong>User ID:</strong> ${user.userID}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Flag:</strong> ${user.flag}</p>
            <br>
            <a href="/logout">Logout</a>
        `);
        } else {
        res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});
  
app.listen(port, () => {
    console.log('Server running on http://localhost:3000');
});
