const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../Models/user.model");
const { PlayList } = require("../Models/playlis.model");

const secret =
  "gEf3gs2kMagd2CHDXpEjwGJlbVewlqE7ARhD2UIYUJsM8V9c71E4rYGI0AXIn5J2pAi2TrMQHD7FAJOTtLIYIShHDjZjTwvzHodjwutvbTcFCnksFiCBFpqpQqucxyairN4X3hQbmiuKqJQW9XSeblgU5v2BQrEZs86YhgrGxQtWujl3NMu9NRwa9x9noEY7OnuabuIAYNCmsnGC39iq32nBOPvtA4BP+sVuMKW6Qd6//lSr1pSzYHZ9KMYUDnTDvnXQ3q5uSpCGcRTS3//G/nfUdjxjcbz1z9B2hvL+Oh/RXNI1DeFdwphwP9pbJqICm81l1WUe0H7Vs/6irJEq6w==";


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
