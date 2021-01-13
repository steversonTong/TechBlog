const router = require('express').Router();
const { Blog, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

router.get('/', withAuth, async (req, res) => {
  try {
    await Blog.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: Comment,
          attributes: ['id', 'blog', 'data_created', 'user_id'],
          include: {
            mmodel: User,
            attributes: ['name'],
          },
        },
      ],
    }).then((blogData) => {
      const blogs = blogData.map((blog) => blog.get({ plain: true }));
      res.render('dashboard', { blogs, logged_in: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    await Blog.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'title', 'created_at', 'content'],
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
    }).then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: 'No blog post found with this ID' });
        return;
      }
      const blog = dbBlogData.get({ plain: true });
      res.render('edit-blog', { blog, logged_in: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
