const mongoose = require('mongoose');
const Roles = require('../../api/_common/roles');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true, unique: true },
    name: { type: String },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.STUDENT,
      required: true,
    },
    isSuperAdmin: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
