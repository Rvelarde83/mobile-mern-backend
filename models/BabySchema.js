const mongoose = require('mongoose');

const BabySchema = new mongoose.Schema({
    babyName: String,
    birthday: String,
    image: String,
    parents: String,
    // username: { type: String, required: true, unique: true },
    // password: { type: String, required: true }
    diaper: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diaper'
    }],
    feeding: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feeding'
      }]
})

module.exports = mongoose.model('Baby', BabySchema)