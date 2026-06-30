const mongoose = require('mongoose');

const turnSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, default: '' },
  feedback: { type: String, default: '' },
  score:    { type: Number, default: 0 },
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: true,
    enum: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'System Design', 'DSA'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
  },
  turns:        { type: [turnSchema], default: [] },
  overallScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);