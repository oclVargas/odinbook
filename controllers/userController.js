const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const multer = require("multer"); // might need 2B in routes
const cloudinary = require("cloudinary");
const validator = require("express-validator");
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

}

exports.signup_get = (req, res) => {
    res.render('signup');
}

exports.logout = (req, res) => {
    req.logout();
    res.redirect('back');
}

exports.all_users = (req, res, next) => {

}

exports.user_profile = (req, res) => {

}





