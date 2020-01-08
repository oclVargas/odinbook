module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.user) return next()

        req.flash('error_msg', 'Please log in to continue')
        res.redirect('/unauthorized')
    }
}