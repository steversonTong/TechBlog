const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    await Post.findAll({ include: [{ all: true, nested: true }] }).then(
      (dbPostData) => {
        const posts = dbPostData.map((post) => post.get({ plain: true }));
        res.render('homepage', {
          posts,
          logged_in: req.session.logged_in,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: ['id', 'content', 'post_id', 'user_id', 'date_created'],
          include: {
            model: User,
            attributes: ['name'],
          },
        },
        {
          model: User,
          attributes: ['name'],
        },
      ],
    }).then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this ID' });
        return;
      }
      // serialize data
      const post = dbPostData.get({ plain: true });

      // pass data to views
      res.render('post', {
        post,
        logged_in: req.session.logged_in,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);

    const postData = await Post.findAll(
      { where: { user_id: req.session.user_id } },
      {
        include: [{ model: User }],
      }
    );

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard', {
      posts,
      ...user.dataValues,
      logged_in: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
