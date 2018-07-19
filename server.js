const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()



const auth = require('./auth')
const userRoutes = require('./api/routes/users')


app.use(cors())
app.use(bodyParser.json())

// mongodb connection
mongoose.connect('mongodb://mahika:mahika123@ds215370.mlab.com:15370/survey_compass', (err)=>{
    if(!err){
        console.log('connected to mongo server')
    }
})


app.use('/auth', auth.router)
app.use('/users', userRoutes)
app.listen(process.env.PORT || 3000)