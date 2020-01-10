const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// MOVE THIS TO INDEX ROUTE LATER ALSO ACTS AS HOMEPAGE
router.get('/signup', userController.signup_get)

// Handle sign up form
router.post('/signup', userController.signup_post);

// moved to index route
// router.get('/login', userController.login_get);
// router.post('/login', userController.login_post);

router.get('/all', userController.all_users);

router.get('/:id/profile', userController.user_profile);

// router.get('/:id/add', userController.friend_request);

// router.get('/:id/accept', userController.friend_request_accept);

// router.get('/:id/decline', userController.friend_request_decline);


module.exports = router;
