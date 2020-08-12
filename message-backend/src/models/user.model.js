const mongoose = require('mongoose');

const UserSchema =  mongoose.Schema({
  user_info: Object,
  address_attributes: Object
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);