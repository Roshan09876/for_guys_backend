const mongoose = require("mongoose")
const env = require("dotenv")

env.config();

const db = process.env.DB_URL

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log(`Database is Connected in ${db}`)
    })
}

module.exports = connectDatabase;