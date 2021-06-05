const mongoose  = require('mongoose')
// const PlayList = require('./playlis.model')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name to hoga na"]
    },
    email: {
        type: String,
        required: [true, "Mail banalo beta"]
    },
    password: {
        type: String,
        required: [true, "Password ke liye bhi bole kya ab"]
    },
    playlists: [{type: mongoose.Schema.Types.ObjectId, ref: 'PlayList'}]
})

const User = mongoose.model('User', UserSchema)

module.exports = {User}