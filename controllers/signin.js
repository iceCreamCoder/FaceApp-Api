const handleSignin = (req, res, db, bcrypt) => {
    const {password, email} = req.body;
    if(!email || ! password) {
        res.status(400).json('Incorrect form Submission')
    }
    db.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if(isValid) {
        db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          }) 
          .catch(err => res.status(400).json('Unable to get users'))
      } else {
        res.status(400).json('wrong credentials')
      }
      })
      .catch(err => res.status(400).json("Wrong signin credentials"))
  }

module.exports = {
      handleSignin: handleSignin
  }
  