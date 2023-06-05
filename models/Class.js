const mongoose = require('mongoose')

File = require("./File")

const newSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true
    },
    students : [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Student'
    }],

    files: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'File'
    }],

    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Tutor',
        required: true
    },
    CreatedOn: {
        type: Date,
        default: ()=> {new Date()}
    }
})

module.exports = mongoose.model('Class', newSchema)