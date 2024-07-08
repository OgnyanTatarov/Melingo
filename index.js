const express = require('express');  
var bodyParser = require('body-parser');
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const dictionaryRouter = require("./routers/dictionaryRouter") 
const MongoCli = require('./mongo_client')


const app = express()

const server = async () =>{

    app.use(express.json())
    app.use(express.static("public"))
    dotenv.config()
    const PORT = process.env.PORT
    const URL = process.env.MONGO_URI

    //middleware
    app.use(bodyParser.urlencoded({extended: false}))

    // creating client for the MongoDB
    await MongoCli.init()

    app.listen(PORT, () =>
    console.log(`You are running on port ${PORT}`))
    
}

server()


app.get('/', (req, res) => 
    res.send(`Node and express server is running on port ${PORT}`)
);
// routers
app.use("/dictionary",dictionaryRouter)

