const express = require('express')
const router = express.Router()
const auth = require('../../auth')

const UsersController = require('../controllers/users')
// get All users
router.post('/', auth.checkAuthenticated, UsersController.users_get_all)
// add new user
router.post('/addUser',auth.checkAuthenticated, UsersController.create_user)
// update user
router.post('/updateUser/:id',auth.checkAuthenticated, UsersController.update_user)
// delete user
router.delete('/deleteUser/:id', auth.checkAuthenticated, UsersController.delete_user)

module.exports = router





