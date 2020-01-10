const User = require("../models/User");
const Post = require("../models/Post"); // delete later?
const passport = require("passport");
const bcrypt = require("bcryptjs");
const multer = require("multer"); // might need 2B in routes
const cloudinary = require("cloudinary");
const { body, validationResult, sanitizeBody } = require("express-validator");


exports.signup_post = [
    body('email', 'Email must not be empty.').isLength({ min: 3 }).trim(),
    body('firstName', 'First name must not be empty.').isLength({ min: 1 }).trim(),
    body('lastName', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
    body('password', 'Password must be 6 characters or longer.')
        .not()
        .isEmpty()
        .exists()
        .isLength({ min: 6 }).trim(),

    sanitizeBody('*').escape(),

    (req, res, next) => {
        const { firstName, lastName, email, password } = req.body
        const errors = validationResult(req);
        const formErrors = []

        if (!errors.isEmpty()) {
            formErrors.push(errors.errors)

            return res.render('signup', {
                errors: formErrors, email, firstName, lastName
            })
        }

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    formErrors.push([{ msg: 'Email is already in use' }])
                    // hompage or register???
                    return res.render('signup', {
                        errors: formErrors, email, firstName, lastName 
                    })
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err

                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err

                            // capitalizes each name
                            let capitalize = str => {
                                return str.charAt(0).toUpperCase() + str.slice(1)
                            }
                            
                            const user = new User({
                                email,
                                firstName: capitalize(firstName.toLowerCase()),
                                lastName: capitalize(lastName.toLowerCase()),
                                password: hash
                            })

                            user.save(err => {
                                if (err) throw err

                                req.flash('success_msg', 'You are now registered! Proceed to login')
                                res.redirect('/users/login')
                            })
                        })
                    })
                }
            })
            .catch(err => {
                throw err
            })
    }
]

exports.login_get = (req, res) => {
    res.render('login');
}

exports.login_post = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
}

exports.signup_get = (req, res) => {
    res.render('signup');
}

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/login');
}

exports.all_users = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err)
            req.flash('error', 'There was a problem getting all users')
            // take them back to home feed if error
            res.redirect('/')
        } else {
            res.render('users', { users: users })
        }
    })
}

exports.user_profile = (req, res) => {
    User.findById(req.params.id)
        .populate("friends")
        .populate("friendRequests")
        .populate("posts")
        .exec((err, user) => {
            if (err) {
                console.log(err)
                req.flash("error_msg", "There has been an error")
                res.redirect("back")
            } else {
                console.log(user)
                res.render("user_profile", { userData: user })
            }
        })
}


// TODO where you see redirects "back" change it up later ok?
exports.friend_request = (req, res) => {
    // Find logged in user
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err)
            req.flash("error_msg", "There has been an error adding this person to your friends list")
            res.redirect("back")
        } else {
            // find user to be added
            User.findById(req.params.id, (err, foundUser) => {
                if (err) {
                    console.log(err)
                    req.flash("error_msg", "Person not found")
                    res.redirect("back")
                } else {
                    // FOUNDUSER IS THE USER THAT THE LOGGED IN USER WANTS TO ADD
                    // curr USER IS THE CURRENT LOGGED IN USER

                    // checking if the user is already in foundUsers friend requests or friends list
                    if (foundUser.friendRequests.find(o => o._id.equals(user._id))) {
                        req.flash("error_msg", `You already sent a friend request to ${user.firstName}`)
                        return res.redirect("back")
                    } else if (foundUser.friends.find(o => o._id.equals(user._id))) {
                        req.flash("error_msg", "The user is already in your friends list")
                        return res.redirect("back")
                    }

                    let currentUser = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }

                    foundUser.friendRequests.push(currentUser)
                    foundUser.save()
                    req.flash("success_msg", `You sent ${foundUser.firstName} a friend request!`)
                    res.redirect("back")
                }
            })
        }
        
    })
}

exports.friend_request_accept = (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err)
            req.flash("error_msg", "There has been an error finding your profile")
            res.redirect("back")
        } else {
            User.findById(req.params.id, (err, foundUser) => {
                let r = user.friendRequests.find(o => {
                    o._id.equals(req.params.id)
                })
                if (r) {
                    let index = user.friendRequests.indexOf(r)
                    user.friendRequests.splice(index, 1)
                    let friend = {
                        _id: foundUser._id,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName
                    }

                    user.friends.push(friend)
                    user.save()

                    let currentUser = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }

                    foundUser.friends.push(currentUser)
                    foundUser.save()
                    req.flash("success_msg", `You and ${foundUser.firstName} are now friends!`)
                    res.redirect("back")
                } else {
                    req.flash("error_msg", "There has been an error")
                    res.redirect("back")
                }
            })
        }
    })
}


