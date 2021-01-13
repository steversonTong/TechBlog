const router = require('express').Router();
const userRoutes = require('./userRoutes');
const commentRoutes = require('./commentRoutes');
const postRoutes = require('./postRoutes');

router.use('/users', userRoutes);
router.use('/post', postRoutes);
router.use('/comment', commentRoutes);
router.use('/page', postRoutes);

module.exports = router;
