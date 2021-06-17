const mongoose  = require('mongoose')
// const PlayList = require('./playlis.model')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "mail is required"]
    },
    password: {
        type: String,
        required: [true, "Password ke liye bhi bole kya ab"]
    },
    playlists: [{type: mongoose.Schema.Types.ObjectId, ref: 'PlayList'}]
})

const User = mongoose.model('User', UserSchema)

module.exports = {User}