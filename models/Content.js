var mongoose = require('mongoose')

var contentSchema = new mongoose.Schema({
    title: String,
    content: String,
    active: Number    
})

module.exports = mongoose.model('Content', contentSchema)