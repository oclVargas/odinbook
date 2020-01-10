var express = require('express');
var router = express.Router();
const passport = require('passport')



router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', (req, res, next) => { 
  passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true
  })(req, res, next)
}) 


// router.get('/chat', (req, res) => {
  
// })

module.exports = router;
