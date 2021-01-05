const router = require('express').Router();
const userRoutes = require('./userRoutes');
const blogRoutes = require('./blogRoutes');
const commentRoutes = require('./commentRoutes');
const postRoutes = require('./postRoutes');

router.use('/users', userRoutes);
router.use('/blog', blogRoutes);
router.use('/comment', commentRoutes);
router.use('/page', postRoutes);

module.exports = router;
