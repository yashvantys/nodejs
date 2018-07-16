var User = require('./models/User.js')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()    

    router.post('/login', async (req, res, next)=>{
        var loginData = req.body;
        var user = await User.findOne({email: loginData.email})
        if(!user)
            return res.status(401).send({statusCode: 401, StatusText: 'Email or Password invalid', message: 'error'})  
        
        bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
            if(!isMatch)
                return res.status(401).send({statusCode: 401, StatusText: 'Email or Password invalid', message: 'error'})    
            
            createSendToken(res, user)
        })        
    })

    function createSendToken(res, user){
        //var payload = { user_id: user._id,email: user.email, name:user.name }
        var payload = { sub: user._id }
        var token = jwt.encode(payload, '123')
        res.status(200).send({statusCode: 200, message: 'success', token})
    }

    var auth = {
        router,
        checkAuthenticated: (req, res, next) => {
            if(!req.header('authorization'))
                return res.status(401).send({ message: 'Unauthorized. Missing Auth Header'})
        
            var token = req.header('authorization').split(' ')[1]
            var payload = jwt.decode(token, '123')
            if(!payload)
                return res.status(401).send({ message: 'Unauthorized. Auth Header Invalid!'})
        
            req.userId = payload.sub
            next()
        }
    }

    module.exports = auth
