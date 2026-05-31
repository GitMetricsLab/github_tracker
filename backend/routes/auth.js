const express = require("express");
const passport = require("passport");
const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { signupSchema, loginSchema } = require("../validators/authValidator");
const { validateRequest } = require("../validators/validationRequest");
const router = express.Router();

const getUseMongoAuth = () => typeof global.mongooseConnected !== "undefined" ? global.mongooseConnected : Boolean(process.env.MONGO_URI);
const dataDir = path.join(__dirname, "..", "data");
const usersFile = path.join(dataDir, "users.json");
const usersLockFile = `${usersFile}.lock`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const acquireUsersLock = async () => {
    const retries = 80;
    const delayMs = 25;

    for (let attempt = 0; attempt < retries; attempt += 1) {
        try {
            const handle = await fs.open(usersLockFile, "wx");
            return handle;
        } catch (error) {
            if (error.code !== "EEXIST") {
                throw error;
            }

            await sleep(delayMs);
        }
    }

    throw new Error("Could not acquire users file lock");
};

const withUsersLock = async (callback) => {
    const lockHandle = await acquireUsersLock();

    try {
        return await callback();
    } finally {
        await lockHandle.close();
        await fs.unlink(usersLockFile).catch(() => {});
    }
};

const ensureUsersFileUnlocked = async () => {
    await fs.mkdir(dataDir, { recursive: true });

    try {
        await fs.access(usersFile);
    } catch {
        await fs.writeFile(usersFile, JSON.stringify({ users: [] }, null, 2), "utf8");
    }
};

const readUsersUnlocked = async () => {
    await ensureUsersFileUnlocked();
    const raw = await fs.readFile(usersFile, "utf8");

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed.users) ? parsed.users : [];
    } catch (error) {
        throw new Error(`Failed to parse users file at ${usersFile}: ${error.message}`);
    }
};

const writeUsersUnlocked = async (users) => {
    await ensureUsersFileUnlocked();
    const tempFile = `${usersFile}.${process.pid}.${Date.now()}.tmp`;

    // Write to a temporary file first, then atomically replace the target file.
    await fs.writeFile(tempFile, JSON.stringify({ users }, null, 2), "utf8");
    await fs.rename(tempFile, usersFile);
};

const readUsersWithLock = async () => withUsersLock(readUsersUnlocked);

const createUserIfNotExistsWithLock = async (newUser) => withUsersLock(async () => {
    const users = await readUsersUnlocked();
    const existingUser = users.find((user) => user.email === newUser.email || user.username === newUser.username);

    if (existingUser) {
        return false;
    }

    users.push(newUser);
    await writeUsersUnlocked(users);
    return true;
});

const createSessionUser = (req, user) => {
    req.session.authUser = {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    req.user = req.session.authUser;
};

// Signup route
router.post("/signup", validateRequest(signupSchema), async (req, res) => {

    const { username,  email, password } = req.body;

    if (!getUseMongoAuth()) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = {
                id: crypto.randomUUID(),
                username,
                email,
                password: hashedPassword,
            };

            const created = await createUserIfNotExistsWithLock(newUser);

            if (!created) {
                return res.status(400).json({ message: 'User already exists' });
            }

            return res.status(201).json({ message: 'User created successfully' });
        } catch (err) {
            return res.status(500).json({ message: 'Error creating user', error: err.message });
        }
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(400).json({ message: 'User already exists' });
        }

        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Session status route
router.get("/me", (req, res) => {
    const isAuthenticated = typeof req.isAuthenticated === "function" && req.isAuthenticated();

    if (!isAuthenticated) {
        return res.status(200).json({ authenticated: false, user: null });
    }

    return res.status(200).json({ authenticated: true, user: req.user });
});

// Login route
router.post("/login", validateRequest(loginSchema), async (req, res, next) => {
    if (!getUseMongoAuth()) {
        try {
            const { email, password } = req.body;
            const users = await readUsersWithLock();
            const user = users.find((item) => item.email === email);

            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            req.session.regenerate((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Login failed', error: err.message });
                }

                createSessionUser(req, user);

                return res.status(200).json({
                    message: 'Login successful',
                    user: req.user,
                });
            });
        } catch (err) {
            return res.status(500).json({ message: 'Login failed', error: err.message });
        }
    }

    return passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({ message: info?.message || 'Invalid credentials' });
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }

            return res.status(200).json({ message: 'Login successful', user: req.user });
        });
    })(req, res, next);
});

// Logout route
router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err)
            return res.status(500).json({ message: 'Logout failed', error: err.message });
        req.session.destroy((destroyErr) => {
            if (destroyErr)
                return res.status(500).json({ message: 'Session cleanup failed', error: destroyErr.message });
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});

module.exports = router;
