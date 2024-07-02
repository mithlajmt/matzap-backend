const mongoose = require('mongoose');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: [true, 'User with this username already exists'],
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [20, 'Username must be at most 20 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, 'User with this email already exists'],
        validate: {
            validator: isEmail,
            message: 'Please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long']
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User
