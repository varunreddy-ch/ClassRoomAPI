const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    url : String,
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        immutable: true,
        default: ()=> new Date(Date.now())
    },
    uploadedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Tutor',
        required: true
    },
    type: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("File", fileSchema)