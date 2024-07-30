const mongoose = require("mongoose");

const helmetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    helmetType: {
        type: String,
        required: true
    },
    helmetPrice: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Helmet = mongoose.model('Helmet', helmetSchema);
module.exports = Helmet;
