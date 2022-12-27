const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // profileImage: {
    //     type: String,
    //     default: "https://img.freepik.com/free-icon/user_318-804790.jpg?w=2000"     // required: true
    // },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('user', userSchema)