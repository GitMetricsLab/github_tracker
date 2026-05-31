const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { discussionSchema, commentSchema } = require('../validators/discussionValidator');
const { validateRequest } = require('../validators/validationRequest');

const router = express.Router();

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'discussions.json');
let storeMutex = Promise.resolve();

const ensureDataFile = async () => {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify({ discussions: [] }, null, 2), 'utf8');
  }
};

const readStore = async () => {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, 'utf8');

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.discussions) ? parsed.discussions : [];
  } catch (error) {
    throw new Error(`Invalid discussions store JSON in ${dataFile}: ${error.message}`);
  }
};

const writeStore = async (discussions) => {
  await ensureDataFile();
  const tempFile = `${dataFile}.${process.pid}.${Date.now()}.tmp`;

  // Write to a temporary file first, then atomically replace the target file.
  await fs.writeFile(tempFile, JSON.stringify({ discussions }, null, 2), 'utf8');
  await fs.rename(tempFile, dataFile);
};

const updateStore = async (updater) => {
  let releaseLock;
  const waitForTurn = storeMutex;
  storeMutex = new Promise((resolve) => {
    releaseLock = resolve;
  });

  await waitForTurn;

  try {
    const discussions = await readStore();
    const result = await updater(discussions);
    const nextDiscussions = Array.isArray(result?.discussions) ? result.discussions : discussions;

    if (result?.persist !== false) {
      await writeStore(nextDiscussions);
    }

    return { ...result, discussions: nextDiscussions };
  } finally {
    releaseLock();
  }
};

const normalizeTags = (tags = []) =>
  tags
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .map((tag) => tag.replace(/^#?/, '').toLowerCase());

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  return next();
};

const getAuthenticatedIdentity = (req) => ({
  id: req.user._id?.toString?.() || req.user.id || req.user.email || 'user',
  name: req.user.username || req.user.email || 'Member',
});

const getCommunityIdentity = (req) => {
  if (req.user) {
    return {
      id: req.user._id?.toString?.() || req.user.id || req.user.email || 'user',
      name: req.user.username || req.user.email || 'Member',
    };
  }

  if (!req.session.communityUserId) {
    req.session.communityUserId = crypto.randomUUID();
  }

  if (!req.session.communityUserName) {
    req.session.communityUserName = 'Guest';
  }

  return {
    id: req.session.communityUserId,
    name: req.session.communityUserName,
  };
};

const toPublicDiscussion = (discussion, currentUserId) => ({
  id: discussion.id,
  title: discussion.title,
  body: discussion.body,
  category: discussion.category,
  tags: discussion.tags,
  author: {
    id: discussion.authorId,
    name: discussion.authorName,
  },
  likesCount: discussion.likes.length,
  commentsCount: discussion.comments.length,
  likedByCurrentUser: currentUserId ? discussion.likes.includes(currentUserId) : false,
  canEdit: currentUserId ? String(discussion.authorId) === String(currentUserId) : false,
  comments: discussion.comments.map((comment) => ({
    id: comment.id,
    text: comment.text,
    author: {
      id: comment.authorId,
      name: comment.authorName,
    },
    createdAt: comment.createdAt,
  })),
  createdAt: discussion.createdAt,
  updatedAt: discussion.updatedAt,
});

router.get('/', async (req, res) => {
  try {
    const discussions = await readStore();
    const { search = '', category = '', tag = '', sort = 'recent' } = req.query;
    const currentUserId = req.user ? getCommunityIdentity(req).id : (req.session?.communityUserId || null);

    let filtered = discussions;

    if (category) {
      filtered = filtered.filter((discussion) => discussion.category === category);
    }

    if (tag) {
      const searchTag = String(tag).toLowerCase();
      filtered = filtered.filter((discussion) => discussion.tags.includes(searchTag));
    }

    if (search) {
      const term = String(search).toLowerCase();
      filtered = filtered.filter((discussion) => {
        const haystack = [discussion.title, discussion.body, discussion.category, discussion.tags.join(' ')].join(' ').toLowerCase();
        return haystack.includes(term);
      });
    }

    filtered = filtered.sort((left, right) => {
      if (sort === 'trending') {
        const leftScore = left.likes.length * 2 + left.comments.length;
        const rightScore = right.likes.length * 2 + right.comments.length;

        if (rightScore !== leftScore) {
          return rightScore - leftScore;
        }
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

    return res.status(200).json({
      items: filtered.map((discussion) => toPublicDiscussion(discussion, currentUserId)),
      categories: Array.from(new Set(filtered.map((discussion) => discussion.category))).sort(),
      isAuthenticated: !!req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load discussions', error: error.message });
  }
});

router.post('/', requireAuth, validateRequest(discussionSchema), async (req, res) => {
  try {
    const identity = getAuthenticatedIdentity(req);
    const now = new Date().toISOString();

    const discussion = {
      id: crypto.randomUUID(),
      title: String(req.body.title).trim(),
      body: String(req.body.body).trim(),
      category: String(req.body.category).trim(),
      tags: normalizeTags(req.body.tags || []),
      authorId: identity.id,
      authorName: identity.name,
      likes: [],
      comments: [],
      createdAt: now,
      updatedAt: now,
    };

    await updateStore((discussions) => {
      discussions.unshift(discussion);
      return { discussions };
    });

    return res.status(201).json({
      message: 'Discussion created successfully',
      discussion: toPublicDiscussion(discussion, identity.id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create discussion', error: error.message });
  }
});

router.put('/:id', requireAuth, validateRequest(discussionSchema), async (req, res) => {
  try {
    const identity = getAuthenticatedIdentity(req);
    const result = await updateStore((discussions) => {
      const discussion = discussions.find((item) => item.id === req.params.id);

      if (!discussion) {
        return { status: 404, message: 'Discussion not found', persist: false };
      }

      if (String(discussion.authorId) !== String(identity.id)) {
        return { status: 403, message: 'You can only edit your own discussion', persist: false };
      }

      discussion.title = String(req.body.title).trim();
      discussion.body = String(req.body.body).trim();
      discussion.category = String(req.body.category).trim();
      discussion.tags = normalizeTags(req.body.tags || []);
      discussion.updatedAt = new Date().toISOString();

      return { discussions, discussion };
    });

    if (result.status) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: 'Discussion updated successfully',
      discussion: toPublicDiscussion(result.discussion, identity.id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update discussion', error: error.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const identity = getAuthenticatedIdentity(req);
    const result = await updateStore((discussions) => {
      const discussionIndex = discussions.findIndex((item) => item.id === req.params.id);

      if (discussionIndex === -1) {
        return { status: 404, message: 'Discussion not found', persist: false };
      }

      if (String(discussions[discussionIndex].authorId) !== String(identity.id)) {
        return { status: 403, message: 'You can only delete your own discussion', persist: false };
      }

      discussions.splice(discussionIndex, 1);
      return { discussions };
    });

    if (result.status) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete discussion', error: error.message });
  }
});

router.post('/:id/likes', requireAuth, async (req, res) => {
  try {
    const identity = getAuthenticatedIdentity(req);
    const result = await updateStore((discussions) => {
      const discussion = discussions.find((item) => item.id === req.params.id);

      if (!discussion) {
        return { status: 404, message: 'Discussion not found', persist: false };
      }

      const alreadyLiked = discussion.likes.includes(identity.id);
      discussion.likes = alreadyLiked
        ? discussion.likes.filter((likeId) => String(likeId) !== String(identity.id))
        : [...discussion.likes, identity.id];
      discussion.updatedAt = new Date().toISOString();

      return { discussions, discussion, alreadyLiked };
    });

    if (result.status) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: result.alreadyLiked ? 'Discussion unliked' : 'Discussion liked',
      discussion: toPublicDiscussion(result.discussion, identity.id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update like state', error: error.message });
  }
});

router.post('/:id/comments', requireAuth, validateRequest(commentSchema), async (req, res) => {
  try {
    const commentText = req.body.text;

    const identity = getAuthenticatedIdentity(req);
    const result = await updateStore((discussions) => {
      const discussion = discussions.find((item) => item.id === req.params.id);

      if (!discussion) {
        return { status: 404, message: 'Discussion not found', persist: false };
      }

      discussion.comments.push({
        id: crypto.randomUUID(),
        text: commentText,
        authorId: identity.id,
        authorName: identity.name,
        createdAt: new Date().toISOString(),
      });
      discussion.updatedAt = new Date().toISOString();

      return { discussions, discussion };
    });

    if (result.status) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(201).json({
      message: 'Comment added successfully',
      discussion: toPublicDiscussion(result.discussion, identity.id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to add comment', error: error.message });
  }
});

module.exports = router;