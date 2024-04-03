const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Method to retrieve a user by username and password
userSchema.statics.getUserByUsernameAndPassword = async function(username, password) {
  return this.findOne({ username, password });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
