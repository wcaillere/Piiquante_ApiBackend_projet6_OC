const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0, required: true},
    dislkes: {type: Number, default: 0, required: true},
    usersLiked: {type: Array, default: [], required: true},
    usersDisliked: {type: Array, default: [], required: true},
})

module.exports = mongoose.model('Sauce', sauceSchema);