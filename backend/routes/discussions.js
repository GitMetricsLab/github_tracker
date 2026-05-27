const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'discussions.json');

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
  } catch {
    return [];
  }
};

const writeStore = async (discussions) => {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify({ discussions }, null, 2), 'utf8');
};

const normalizeTags = (tags = []) =>
  tags
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .map((tag) => tag.replace(/^#?/, '').toLowerCase());

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

const validatePayload = (payload) => {
  const errors = [];

  if (!payload.title || String(payload.title).trim().length < 4) {
    errors.push({ field: 'title', message: 'Title must be at least 4 characters long' });
  }

  if (!payload.body || String(payload.body).trim().length < 20) {
    errors.push({ field: 'body', message: 'Post body must be at least 20 characters long' });
  }

  if (!payload.category || String(payload.category).trim().length < 2) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  if (payload.tags && !Array.isArray(payload.tags)) {
    errors.push({ field: 'tags', message: 'Tags must be an array of strings' });
  }

  return errors;
};

router.get('/', async (req, res) => {
  try {
    const discussions = await readStore();
    const { search = '', category = '', tag = '', sort = 'recent' } = req.query;
    const currentUserId = getCommunityIdentity(req).id;

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
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load discussions', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const errors = validatePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const discussions = await readStore();
    const identity = getCommunityIdentity(req);
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

    discussions.unshift(discussion);
    await writeStore(discussions);

    return res.status(201).json({
      message: 'Discussion created successfully',
      discussion: toPublicDiscussion(discussion, identity.id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create discussion', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const errors = validatePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const discussions = await readStore();
    const identity = getCommunityIdentity(req);
    const discussion = discussions.find((item) => item.id === req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (String(discussion.authorId) !== String(identity.id)) {
      return res.status(403).json({ message: 'You can only edit your own discussion' });
    }

    discussion.title = String(req.body.title).trim();
    discussion.body = String(req.body.body).trim();
    discussion.category = String(req.body.category).trim();
    discussion.tags = normalizeTags(req.body.tags || []);
    discussion.updatedAt = new Date().toISOString();

    await writeStore(discussions);

    return res.status(200).json({
      message: 'Discussion updated successfully',
      discussion: toPublicDiscussion(discussion, identity.id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update discussion', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const discussions = await readStore();
    const identity = getCommunityIdentity(req);
    const discussionIndex = discussions.findIndex((item) => item.id === req.params.id);

    if (discussionIndex === -1) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (String(discussions[discussionIndex].authorId) !== String(identity.id)) {
      return res.status(403).json({ message: 'You can only delete your own discussion' });
    }

    discussions.splice(discussionIndex, 1);
    await writeStore(discussions);

    return res.status(200).json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete discussion', error: error.message });
  }
});

router.post('/:id/likes', async (req, res) => {
  try {
    const discussions = await readStore();
    const identity = getCommunityIdentity(req);
    const discussion = discussions.find((item) => item.id === req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const alreadyLiked = discussion.likes.includes(identity.id);
    discussion.likes = alreadyLiked
      ? discussion.likes.filter((likeId) => String(likeId) !== String(identity.id))
      : [...discussion.likes, identity.id];
    discussion.updatedAt = new Date().toISOString();

    await writeStore(discussions);

    return res.status(200).json({
      message: alreadyLiked ? 'Discussion unliked' : 'Discussion liked',
      discussion: toPublicDiscussion(discussion, identity.id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update like state', error: error.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const commentText = String(req.body?.text || '').trim();
    if (commentText.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'text', message: 'Comment must be at least 2 characters long' }],
      });
    }

    const discussions = await readStore();
    const identity = getCommunityIdentity(req);
    const discussion = discussions.find((item) => item.id === req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.comments.push({
      id: crypto.randomUUID(),
      text: commentText,
      authorId: identity.id,
      authorName: identity.name,
      createdAt: new Date().toISOString(),
    });
    discussion.updatedAt = new Date().toISOString();

    await writeStore(discussions);

    return res.status(201).json({
      message: 'Comment added successfully',
      discussion: toPublicDiscussion(discussion, identity.id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to add comment', error: error.message });
  }
});

module.exports = router;