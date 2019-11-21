const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'Inactive'
    },
    email_varify: {
      type: Boolean,
      default: false
    },
    reset_password_token: {
      type: String
    },
    reset_password_expires: {
      type: Date
    },
    login_ip: {
      type: String
    },
    login_date: {
      type: Date
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
