const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    title: {
      type: String, 
      required: true
    },
    description: {
      type: String,
      required: true
    }, 
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
   }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);
