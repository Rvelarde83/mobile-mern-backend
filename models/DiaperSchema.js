const mongoose = require('mongoose');


const DiaperSchema = new mongoose.Schema({
    typeofWaste: {
        type: String,
        enum: ["solid", "liquid", "both"],
        required: true
    },
    amountOfNo1: {
       type: String,
        enum: ["barely", "little", "medium", "soaked"],
        
    },
    amountOfNo2: {
       type: String,
        enum: ["barely", "little", "medium", "huge","poopzilla"],
        
    },
    baby: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Baby'
      }]
 
   


},{timestamps: true})

module.exports = mongoose.model('Diaper', DiaperSchema)