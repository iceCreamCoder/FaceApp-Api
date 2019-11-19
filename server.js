const express = require('express');
const port = '3000';
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require("cors");
const knex = require('knex')

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


app.get("/profile/:id", (req,res) => {
    const { id } = req.params;
    db.select('*').from('users')
      .where({
        id: id
      })
      .then(user => {
        if(user.length) {
          res.json(user[0])
        } else {
          res.status(400).json("User is not Found")
        }
    })
    .catch(err => res.status(404).json('error getting user data'))
})




// signin
app.post('/signin', (req,res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
    if(isValid) {
      db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
          res.json(user[0])
        }) 
        .catch(err => res.status(400).json('Unable to get users'))
    } else {
      res.status(400).json('wrong credentials')
    }
    })
    .catch(err => res.status(400).json("Wrong signin credentials"))
})

// new user
app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return db('users')
        .returning('*')
        .insert({
        email: loginEmail[0],
        name: name,
        joined: new Date()
      })
        .then(user => {
        res.json(user[0]);
      })
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
    .catch(err => res.status(400).json("unable to register"))
})


// put
app.put('/image', (req,res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to put entries'))
});


app.listen(3000, () => {
    console.log(`App listening on port ${port}`)
})


var hash = bcrypt.hashSync("bacon");

// bcrypt.compareSync("bacon", hash); // true
// bcrypt.compareSync("veggies", hash); // false