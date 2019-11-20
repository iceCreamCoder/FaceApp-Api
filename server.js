const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require("cors");
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      host : process.env.DATABASE_URL,
      ssl: true,
    }
  });

 


// middleWare

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// end of middleWare


// get

app.get('/', (req,res) => {
    res.send("server is running")
})


app.get("/profile/:id", (req, res) => {profile.handleProfile(req, res, db)})

// signin
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

// new user
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})


// put
app.put('/image', (req, res) => { image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});


app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})
