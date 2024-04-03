const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Method to retrieve posts of a specific user
blogSchema.statics.getPostsByUser = async function(userId) {
  return this.find({ user: userId });
};

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
