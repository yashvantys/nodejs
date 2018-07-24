var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    role: ['Admin','User']
})

userSchema.pre('save', function(next) {
    var user = this

    if(!user.isModified('password'))
        return next()

    bcrypt.hash(user.password, null, null, (err, hash) =>{
       if(err) return next(err)

       user.password = hash
       next()
    })
})




module.exports = mongoose.model('User', userSchema)