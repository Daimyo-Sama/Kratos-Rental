const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
