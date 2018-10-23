const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')

const User = require('./models/User.js')

router.post('/login', async (req, res, next) => {
    let loginData = req.body
    //console.log("loginData:" + loginData.email + " " + loginData.password)
    let user = await User.findOne({ email: loginData.email })
    //console.log(user);
    /*bcrypt.hash(loginData.password, null, null, (err, hash) =>{
        console.log("hash: "+ hash)
    })*/
    if (!user)
        return res.status(401).send({ statusCode: 401, StatusText: 'Email or Password invalid', message: 'error' })

    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (!isMatch)
            return res.status(401).send({ statusCode: 401, StatusText: 'Email or Password invalid', message: 'error' })

        createSendToken(res, user)
    })
})

function createSendToken(res, user) {
    //var payload = { user_id: user._id,email: user.email, name:user.name }
    let payload = { sub: user._id, userRole: user.role }
    let token = jwt.encode(payload, '123')
    res.status(200).send({ statusCode: 200, message: 'success', token })
}

var auth = {
    router,
    checkAuthenticated: (req, res, next) => {
        if (!req.header('authorization'))
            return res.status(401).send({ statusCode: 401, StatusText: 'Unauthorized. Bad Request', message: 'error' })

        let token = req.header('authorization').split(' ')[1]
        let payload = jwt.decode(token, '123')
        if (!payload)
            return res.status(401).send({ statusCode: 401, StatusText: 'Unauthorized. Bad Request', message: 'error' })

        req.userId = payload.sub
        next()
    }
}

module.exports = auth
