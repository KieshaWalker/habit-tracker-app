const isSignedIn = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/users/login');
    }
};

module.exports = isSignedIn;
