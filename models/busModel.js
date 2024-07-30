const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
    title: {
        type: String
    },
    decsription: {
        type: String
    },
    busType: {
        type: String
    },
    ticketPrice: {
        type: String
    },
    image: {
        type: String,
        required: false
    }
}, {timeStamps: true})

const Bus = mongoose.model('Bus', bookSchema)
module.exports = Bus;