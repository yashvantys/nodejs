var mongoose = require('mongoose')

var contentSchema = new mongoose.Schema({
    title: {type: String, required: true },
    description: {type: String, required: true },
    active: {type:Number, default: 1 },
    created_by: String,
    created_time: { type: Date, default: Date.now }    
})

module.exports = mongoose.model('Content', contentSchema)