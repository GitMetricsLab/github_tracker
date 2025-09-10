export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ msg: 'You must be logged in to access this route' });
}

export function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(403).json({ msg: 'You are already logged in' });
}
