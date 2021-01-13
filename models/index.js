const User = require('./User');
const Comment = require('./Comment');
const Blog = require('./Post');

Blog.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Blog.hasMany(Comment, {
  foreignKey: 'blog_id',
  onDelete: 'CASCADE',
});

module.exports = { User, Comment, Blog };
