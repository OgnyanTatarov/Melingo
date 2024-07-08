const {MongoClient} = require('mongodb')
const dotenv = require('dotenv')
const { init } = require('express/lib/application')

dotenv.config()

class MongoCli{
    constructor(){
        let uri = process.env.MONGO_URI
        this.client = new MongoClient(uri)

    }

    async init(){
        if(this.client){
            await this.client.connect()
            this.db = this.client.db('entriesnodu')
        } else [
            console.log("Client is not initialized properly")
        ]
    }
}

module.exports = new MongoCli();