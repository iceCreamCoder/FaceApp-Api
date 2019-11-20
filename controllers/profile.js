const handleProfile = (req,res, db) => {
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
}

module.exports = {
    handleProfile: handleProfile
}