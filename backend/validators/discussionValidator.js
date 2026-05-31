const { z } = require('zod');

const discussionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, 'Title must be at least 4 characters long')
    .max(140, 'Title must be at most 140 characters long'),
  body: z
    .string()
    .trim()
    .min(20, 'Post body must be at least 20 characters long')
    .max(4000, 'Post body must be at most 4000 characters long'),
  category: z
    .string()
    .trim()
    .min(2, 'Category is required')
    .max(60, 'Category must be at most 60 characters long'),
  tags: z.array(z.string().trim().min(1).max(30)).max(6).default([]),
});

const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(2, 'Comment must be at least 2 characters long')
    .max(1000, 'Comment must be at most 1000 characters long'),
});

module.exports = { discussionSchema, commentSchema };