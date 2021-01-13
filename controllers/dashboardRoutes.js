const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },

      include: [
        {
          model: Comment,
          attributes: ['id', 'content', 'date_created', 'user_id'],
          include: {
            model: User,
            attributes: ['name'],
          },
        },
      ],
    }).then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render('dashboard', { posts, logged_in: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'title', 'date_created', 'content'],

      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'date_created', 'user_id'],
          include: {
            model: User,
            attributes: ['name'],
          },
        },
      ],
    }).then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this ID' });
        return;
      }

      const post = dbPostData.get({ plain: true });
      res.render('edit-post', { post, logged_in: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
