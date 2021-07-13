const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../Models/user.model");
const { PlayList } = require("../Models/playlis.model");

const secret = "gEf3gs2kMagd2CHDXpEjwGJlbVewlqE7ARhD2UIYUJsM8V9c71E4rYGI0AXIn5J2pAi2TrMQHD7FAJOTtLIYIShHDjZjTwvzHodjwutvbTcFCnksFiCBFpqpQqucxyairN4X3hQbmiuKqJQW9XSeblgU5v2BQrEZs86YhgrGxQtWujl3NMu9NRwa9x9noEY7OnuabuIAYNCmsnGC39iq32nBOPvtA4BP+sVuMKW6Qd6//lSr1pSzYHZ9KMYUDnTDvnXQ3q5uSpCGcRTS3//G/nfUdjxjcbz1z9B2hvL+Oh/RXNI1DeFdwphwP9pbJqICm81l1WUe0H7Vs/6irJEq6w==";

function authVerify(req, res, next) {
  const token = req.headers.authorization
  try{
    // console.log(token, "token")
    const decoded = jwt.verify(token, secret)
    req.user = { userId: decoded.userId };
     next()
  } catch(error){
    console.log("Error me aye hai")
    console.log(error)
    return res.status(401).json({ message: "Unauthorised access, please add the token"})
  }
}

router.route('/')
.get(authVerify, async(req,res) => {
    try{
        const {userId} = req.user
        const userPlaylist = await PlayList.findOne({ userId: userId }).populate({
            path: 'history',
            model: 'Videos'
        })
        res.json({status: "success", history: userPlaylist.history})
    }catch(error){
        res.json({status: "failed", error: error.message})
    }
})

.post(authVerify, async(req, res) => {
    try{
        const {userId} = req.user
        const {videoId} = req.body
        const userPlaylist = await PlayList.findOne({ userId: userId })
        userPlaylist.history.push(videoId)
        await userPlaylist.save()
        res.json({PlayList: userPlaylist})
    } catch(error){
        res.json({error: error.message})
    }
})

.delete(authVerify, async(req, res) => {
    try{
        const {userId} = req.user
        const userPlaylist = await PlayList.findOne({ userId: userId })
        userPlaylist.history.splice(0,userPlaylist.history.length)
        await userPlaylist.save()
        res.json({PlayList: userPlaylist})
    } catch(error){
        res.json({error: error.message})
    }
})

module.exports = router