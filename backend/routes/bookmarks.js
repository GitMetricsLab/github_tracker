const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple auth check middleware (session-based via passport)
function ensureAuth(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    return res.status(401).json({ message: 'Authentication required' });
}

// GET /api/bookmarks - returns current user's bookmarks
router.get('/', ensureAuth, async (req, res) => {
    try {
        console.log('GET /api/bookmarks req.isAuthenticated=', req.isAuthenticated && req.isAuthenticated(), 'user=', req.user && req.user.id);
        const user = await User.findById(req.user._id).select('bookmarks');
        return res.json({ bookmarks: user?.bookmarks || [] });
    } catch (err) {
        console.error('Error fetching bookmarks', err);
        return res.status(500).json({ message: 'Failed to fetch bookmarks', error: err.message });
    }
});

// POST /api/bookmarks - add a bookmark
router.post('/', ensureAuth, async (req, res) => {
    try {
        console.log('POST /api/bookmarks req.isAuthenticated=', req.isAuthenticated && req.isAuthenticated(), 'user=', req.user && req.user.id, 'body=', req.body);
        const { githubUsername, avatarUrl } = req.body;
        if (!githubUsername || !githubUsername.trim()) {
            return res.status(400).json({ message: 'githubUsername is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const exists = user.bookmarks?.some(
            (b) => b.githubUsername.toLowerCase() === githubUsername.toLowerCase()
        );
        if (exists) return res.status(409).json({ message: 'Bookmark already exists' });

        user.bookmarks = user.bookmarks || [];
        user.bookmarks.unshift({ githubUsername, avatarUrl });
        await user.save();

        return res.status(201).json({ message: 'Bookmark saved', bookmark: user.bookmarks[0] });
    } catch (err) {
        console.error('Error saving bookmark', err);
        return res.status(500).json({ message: 'Failed to save bookmark', error: err.message });
    }
});

// DELETE /api/bookmarks/:username - remove bookmark
router.delete('/:username', ensureAuth, async (req, res) => {
    try {
        console.log('DELETE /api/bookmarks/:username req.isAuthenticated=', req.isAuthenticated && req.isAuthenticated(), 'user=', req.user && req.user.id, 'params=', req.params);
        const username = req.params.username;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const before = (user.bookmarks || []).length;
        user.bookmarks = (user.bookmarks || []).filter(
            (b) => b.githubUsername.toLowerCase() !== username.toLowerCase()
        );

        if (user.bookmarks.length === before) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        await user.save();
        return res.json({ message: 'Bookmark removed' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to remove bookmark', error: err.message });
    }
});

module.exports = router;
