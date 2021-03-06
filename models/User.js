const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Athlete', 'Trainer', 'Admin'],
      default: 'Athlete',
    },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = User = mongoose.model('User', UserSchema);
