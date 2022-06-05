const mongoose = require('mongoose')
const FeedingSchema = new mongoose.Schema({
    // user: String,
    //{type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Baby'},
    milk: {
        type: String,
        enum: ["formula", "breast milk"],
        required: true
    },
    bottleAmount: String,
    
    BreastTime: String,
    baby: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Baby'
      }]
  
},{timestamps: true})

module.exports = mongoose.model("Feeding", FeedingSchema)