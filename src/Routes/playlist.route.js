const express = require("express");
const router = express.Router();
const { User } = require("../Models/user.model");
const { PlayList } = require("../Models/playlis.model");

// Find user by id and store that user in req
router.param("userId", async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!id) {
      return res.status(404).json({ status: "failed", message: "no user found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.route("/:userId")
// Load playlist data of user after login
  .get((req, res) => {
    const currUser = req.user
    res.json({status: "success", data: user.playlists})
  })

router.route("/:userId/:playlistName")
  // To create a playlist
  .post(async (req, res) => {
    try{
      const {playlistName} = req.params
      const currUser = req.user
      const currUserPlaylist = new PlayList({name: playlistName})
      await currUserPlaylist.save()
      currUser.playlists.push(currUserPlaylist._id)
      await currUser.save();
      
      res.json({statuc: "success", message: "playlist added"})
    }catch(error){
      res.status(404).json({message: "Failure"})
    }
  })
  // To delete a playlist
  .delete();

// router.route("/:userId/:playlistName/video");
// // Video id will come in body
//   //To add a video to playlist 
//   .post()
//   // To delet a video from playlist
//   .delete()

module.exports = router;
