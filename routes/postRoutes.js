const express = require('express');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify'); // Correggi l'importazione della libreria
const router = express.Router();
const prisma = new PrismaClient();

// Endpoint per creare un nuovo post
router.post('/posts', async (req, res) => {
  const { title, content } = req.body;

  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      slug,
    },
  });

  res.json(newPost);
});


// Endpoint per recuperare un post utilizzando lo slug
router.get('/posts/:slug', async (req, res) => {
  const { slug } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });

  res.json(post);
});

// Endpoint per recuperare tutti i post con opzioni di filtro
router.get('/posts', async (req, res) => {
  const { published, keyword } = req.query;

  const posts = await prisma.post.findMany({
    where: {
      published: published === 'true',
      OR: [
        {
          title: {
            contains: keyword || '',
          },
        },
        {
          content: {
            contains: keyword || '',
          },
        },
      ],
    },
  });

  res.json(posts);
});

// Endpoint per aggiornare un post
router.put('/posts/:slug', async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;

  const updatedPost = await prisma.post.update({
    where: {
      slug,
    },
    data: {
      title,
      content,
    },
  });

  res.json(updatedPost);
});

// Endpoint per eliminare un post
router.delete('/posts/:slug', async (req, res) => {
  const { slug } = req.params;

  const deletedPost = await prisma.post.delete({
    where: {
      slug,
    },
  });

  res.json(deletedPost);
});

module.exports = router;
