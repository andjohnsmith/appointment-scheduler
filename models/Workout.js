const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema(
  {
    type: { type: String, enum: ['Cardio', 'Weights', 'Yoga'], required: true },
    startDate: { type: Date, required: true },
    // endDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, default: false },
    athlete: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

module.exports = Workout = mongoose.model('Workout', WorkoutSchema);
