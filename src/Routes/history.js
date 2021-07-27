const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { secret, authVerify } = require("../utils/authVerify");
const { User } = require("../Models/user.model");
const { PlayList } = require("../Models/playlis.model");


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