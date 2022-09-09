const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true, uniqueCaseInsensitive: true},
    password: {type: String, required: true}
})

//Plugin to improve the validation of the email (need to be unique and have case insensitivity)
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);