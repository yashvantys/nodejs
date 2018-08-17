const express = require('express')
const router = express.Router()
const auth = require('../../auth')

const ContentsController = require('../controllers/contents')
// get All contents
router.post('/', auth.checkAuthenticated, ContentsController.contents_get_all)

// add new content
router.post('/addContent',auth.checkAuthenticated, ContentsController.create_content)
// update content
router.post('/updateContent/:id',auth.checkAuthenticated, ContentsController.update_content)

// delete content
router.delete('/deleteContent/:id/:status', auth.checkAuthenticated, ContentsController.delete_content)

module.exports = router