const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    next();
};

module.exports = { requireAuth };