const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { secret, authVerify } = require("../utils/authVerify");
const { User } = require("../Models/user.model");
const { PlayList } = require("../Models/playlis.model");


router.route("/")
  // Load playlist data of user after login
  .get(authVerify, async (req, res) => {
    const {userId} = req.user
    const userPlaylist = await PlayList.findOne({ userId: userId }).populate({ 
       path: 'playlists',
       populate: {
         path: 'videos',
         model: 'Videos'
       } 
    })
    
    res.json({ status: "success", playlistData: userPlaylist });
  });

router
  .route(  "/:playlistName")
  // To create a playlist
  .post(authVerify, async (req, res) => {
    try {
      const { playlistName } = req.params;
      const {userId} = req.user
      const userPlaylist = await PlayList.findOne({ userId: userId });
      userPlaylist.playlists.push({ playlistName: playlistName });
      await userPlaylist.save();
      res.json({ status: "Playlist Created", data: userPlaylist });
    } catch (error) {
      res.json({ status: "failed to add playlist", message: error.stack });
    }
  })
  // To delete a playlist
  .delete(authVerify, async (req, res) => {
    try {
      const { playlistName } = req.params;
      const {userId} = req.user
      const userPlaylist = await PlayList.updateOne(
        { userId: userId },
        { $pull: { playlists: { playlistName: playlistName } } }
      );
      const userPlaylistNow = await PlayList.findOne({ userId: userId });
      res.json({ status: "Playlist Deleted", data: userPlaylistNow });
    } catch (error) {
      res.json({ status: "failed to delete playlist", message: error.stack });
    }
  });

router
  .route("/:playlistName/:videoId")
  //   To add a video to playlist
  .post(authVerify, async (req, res) => {
    const { playlistName, videoId } = req.params;
    const {userId} = req.user
    // const { videoId } = req.body;
    const userPlaylist = await PlayList.findOne({ userId: userId });
    userPlaylist.playlists.map((item) => {
      if (item.playlistName === playlistName) {
        return { ...item, videos: item.videos.push(videoId) };
      }
      return item;
    });
    await userPlaylist.save();
    res.json({ status: "video added successfully", data: userPlaylist });
  })
  // To delet a video from playlist
  .delete(authVerify, async (req, res) => {
    try {
      const { playlistName, videoId } = req.params;
      const {userId} = req.user
      // const { videoId } = req.body;
      const userPlaylist = await PlayList.findOne({ userId: userId });
      userPlaylist.playlists.map((item) => {
        if (item.playlistName === playlistName) {
          item.videos.pull(videoId);
        }
      });
      await userPlaylist.save();
      res.json({ status: "successfuly deleted video", data: userPlaylist });
    } catch (error) {
      res.json({ message: error.message });
    }
  });

module.exports = router;
