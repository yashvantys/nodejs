var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var jwt = require('jwt-simple')

var User = require('./models/User.js')
var Post = require('./models/Post.js')
var auth = require('./auth.js')

app.use(cors())
app.use(bodyParser.json())


app.get('/posts/:id', async(req, res)=>{
    var auther = req.params.id
    var posts = await Post.find({ auther })
    res.send(posts)
   
})

app.post('/post', auth.checkAuthenticated, (req, res) =>{
    
    var postData = req.body
    //console.log("inside: "+ postData)
    postData.auther = req.userId
   // console.log(postData.auther)
    var postVals = new Post( postData )
    console.log("post: "+ postVals)

    postVals.save((err, result) => {
        if(err){
            console.error('saving post error')
            return res.status(500).send({message: 'saving post error'})
        }
        res.sendStatus(200)
    })   
})

app.get('/users', async (req, res, next)=>{
    try {
        var users = await User.find({}, '-password -__v')
        res.send(users)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }    
})

app.get('/profile/:id', async (req, res, next)=>{    
    try {
        var user = await User.findById(req.params.id, '-password -__v')
        res.send(user)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }    
})


mongoose.connect('mongodb://mahika:mahika123@ds215370.mlab.com:15370/survey_compass', (err)=>{
    if(!err){
        console.log('connected to mongo server')
    }
})

app.use('/auth', auth.router)
app.listen(process.env.PORT || 3000)