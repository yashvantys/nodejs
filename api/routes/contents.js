const express = require('express')
const router = express.Router()
const auth = require('../../auth')

const ContentsController = require('../controllers/contents')
// get All contents
router.post('/', auth.checkAuthenticated, ContentsController.contents_get_all)



module.exports = router