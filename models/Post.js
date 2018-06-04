var mongoose = require('mongoose')

module.exports = mongoose.model('Post', {
    msg: String,
    auther: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})


