const express = require("express");
const router = express.Router();
const { User } = require("../Models/user.model");
const { PlayList } = require("../Models/playlis.model");

router.route("/:userId")
// Load playlist data of user after login
  .get(async (req, res) => {
    const {userId} = req.params
    const userPlaylist = await PlayList.findOne({userId: userId})
    res.json({status: "successk", data: userPlaylist})
  })

router.route("/:userId/:playlistName")
  // To create a playlist
  .post(async (req, res) => {
    try{
      const {userId, playlistName} = req.params
      const userPlaylist = await PlayList.findOne({userId: userId})
      userPlaylist.playlists.push({playlistName: playlistName})
      await userPlaylist.save()
      res.json({ status: "Playlist Created", data: userPlaylist})
    } catch(error){
      res.json({status: "failed to add playlist", message: error.stack})
    }
  })
  // To delete a playlist
  .delete(async(req, res) => {
    try{
      const {userId, playlistName} = req.params
      const userPlaylist = await PlayList.updateOne({userId: userId}, 
        {"$pull" : {"playlists": {"playlistName": playlistName}}})
        const userPlaylistNow = await PlayList.findOne({userId: userId})
      res.json({ status: "Playlist Deleted", data: userPlaylistNow})
    } catch(error){
      res.json({status: "failed to del playlist", message: error.stack})
    }
  });

router.route("/:userId/:playlistName/video")
// Video id will come in body
//   To add a video to playlist 
  .post(async(req, res) => {
    const {userId, playlistName} = req.params
    const {videoId} = req.body
    const userPlaylist = await PlayList.findOne({userId: userId})
    userPlaylist.playlists.map(item => {
      if(item.playlistName === playlistName){
       return {...item, videos: item.videos.push(videoId)}
      }
      return item
    })
    await userPlaylist.save();
    res.json({status: "success", data: userPlaylist})
  })
  // To delet a video from playlist
  .delete(async(req, res) => {
    try{
      const {userId, playlistName} = req.params
      const {videoId} = req.body
      
      const userPlaylist = await PlayList.findOne({userId: userId})
      console.log(userPlaylist)
      userPlaylist.playlists.map(item => {
        if(item.playlistName === playlistName){
          item.videos.pull(videoId)
        }
      })
      await userPlaylist.save()
      res.json({status: "success", data: userPlaylist})
    }catch(error){
      res.json({message: error.message})
    }
  })

module.exports = router;

// userPlaylist.updateOne({"playlists.playlistName": playlistName},
//           {$pull : {"playlists": {"videos": {$in: [ videoId ]}}}})