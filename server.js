const express = require('express');
// const PORT = process.env.PORT;
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require("cors");
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
// const imageurl = require('./controllers/imageurl')


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'funbadger',
      password : '',
      database : 'smart-brain-db'
    }
  });

 


// middleWare

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// end of middleWare


// get

app.get('/', (req,res) => {
    res.send(database.users)
})


app.get("/profile/:id", (req, res) => {profile.handleProfile(req, res, db)})

// signin
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

// new user
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})


// put
app.put('/image', (req, res) => { image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});


app.listen(3000, () => {
    console.log(`App listening on port 3000`)
})
