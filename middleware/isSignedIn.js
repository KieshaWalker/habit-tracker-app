const isSignedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        console.log('User is signed in:', req.session.userId);
        next();
    } else {
        console.log('User is not signed in. Redirecting to sign-in page.');
        res.redirect('/');
    }
};

module.exports = isSignedIn;
