const express = require('express');
const router = express.Router();


const ContactController = require('../controllers/contact');

// send Email
router.post('/sendEmail', ContactController.contact_sendEmail);


module.exports = router;