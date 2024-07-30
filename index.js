const express = require("express")
const env = require("dotenv")
const connectDatabase = require("./database/db")
const cloudinary = require("cloudinary")
const acceptMultimedia = require("connect-multiparty")
const app = express()
app.use(express.json())


env.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(acceptMultimedia())

connectDatabase()

const PORT = process.env.PORT;

app.use("/api", require("./routes/userRoutes"))
app.use("/api", require("./routes/helmetRoutes"))

//To check whether the backend is running or not 
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`)
})

//to make get request in /test 
app.get('/test', (req, res) => {
    res.send(`Hello this is from the backend for guys`)
})