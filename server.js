var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var jwt = require('jwt-simple')

var User = require('./models/User.js')
var Post = require('./models/Post.js')
var auth = require('./auth.js')
var bcrypt = require('bcrypt-nodejs')
var Content = require('./models/Content.js')

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
        //console.error(error)
        res.sendStatus(500)
    }  
//})
})

app.post('/users', async (req, res, next)=>{
    try {
            var result = []
            // get values from req
    	    //var sort_column = null
	    	var start = req.body.start
	    	var limit = req.body.length
	    	var sort_column_index = req.body.order[0]['column']
	    	var sort_column = req.body.columns[sort_column_index]['data']
	    	var direction = req.body.order[0]['dir']
            var search = req.body.search['value']
            var orderbyasc = 1
             
            result['draw'] = req.body.draw
            if(direction == 'desc')
                orderbyasc = -1
            var query = {}             
             
	    	if(search !='')
                query  = {  $or: [{ first_name: new RegExp(search, 'i')}, { last_name: new RegExp(search, 'i')}, { email: new RegExp(search, 'i')}] } 
                            
            var sortColumn = {}
            sortColumn[sort_column] = orderbyasc
            //console.log(sortColumn)
            var users = await User.find(query, '-password -__v').sort(sortColumn).limit(limit).skip(start)
            var TotalUsers = await User.find(query).count({})                   
            res.send({statusCode: 200, message: 'success', users, recordsTotal:TotalUsers})
               
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }    
})

// add new user
app.post('/addUser',(req, res)=>{
    var userData = req.body;
    var user = new User(userData)               
    user.save((err, newUser) => {
        if(err){
            return res.status(500).send({message: 'Error saving User'})
        }
    return res.status(200).send({statusCode: 200, message:'User added successfully'})
    })       
})

// update user
app.post('/updateUser/:id',(req, res)=>{
        var password = req.body.password
        bcrypt.hash(password, null, null, (err, hash) =>{
            if(err) return next(err)     
            req.body.password = hash
            // then update
            User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, updateUser) {
                if(err){
                    return res.status(500).send({message: 'Error updating User'})
                }
                return res.status(200).send({statusCode: 200, message:'User updated successfully'})
            })
         })   
})
// delete user
app.delete('/deleteUser/:id', (req, res) => {
    User.findByIdAndRemove({_id: req.params.id}, function (err, deleteUser) {
        if(err){
            return res.status(500).send({message: 'Error deleting User'})
        }
        return res.status(200).send({statusCode: 200, message:'User deleted successfully'})
    })
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