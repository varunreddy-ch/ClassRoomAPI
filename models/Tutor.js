const mongoose = require('mongoose')

const newSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    classes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Class"
    }]
})

module.exports = mongoose.model('Tutor', newSchema)