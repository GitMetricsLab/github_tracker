router.get("/logout", (req, res) => {
  req.logout(err => {
    if(err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

// Get logged-in user
router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: { username: req.user.username } });
  } else {
    res.status(401).json({ user: null });
  }
});
