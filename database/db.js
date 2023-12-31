const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskTitle: {
        type: String,
    }
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [taskSchema]
});


const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Task,
  User
};