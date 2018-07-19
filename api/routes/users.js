const express = require('express')
const app = express()
const router = express.Router()
var bcrypt = require('bcrypt-nodejs')
const auth = require('../../auth')
const User = require('../../models/User.js')  

router.post('/', auth.checkAuthenticated, async (req, res, next)=>{
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
router.post('/addUser',auth.checkAuthenticated, (req, res)=>{
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
router.post('/updateUser/:id',auth.checkAuthenticated, (req, res)=>{
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
router.delete('/deleteUser/:id', auth.checkAuthenticated, (req, res) => {
    User.findByIdAndRemove({_id: req.params.id}, function (err, deleteUser) {
        if(err){
            return res.status(500).send({message: 'Error deleting User'})
        }
        return res.status(200).send({statusCode: 200, message:'User deleted successfully'})
    })
})


module.exports = router





