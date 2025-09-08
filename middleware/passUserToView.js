const passUserToView = (req, res, next) => {
    res.locals.user = req.session.userId ? req.session.userId : null;
    next();
};

module.exports = passUserToView;
