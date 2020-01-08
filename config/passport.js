const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = passport => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      // match user
      User.findOne({ email: username })
        .then(user => {
          // username not matched
          if (!user) {
            return done(null, false, { message: 'No matching username found. Signup instead!' })
          }

          // compare password
          bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        
            if (isMatch) {
                            // password matched, proceed to login
              return done(null, user)
            } else {
              return done(null, false, { message: 'Password incorrect' })
            }
          })
        })
        .catch(err => { throw err })
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}