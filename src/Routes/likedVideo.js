const { secret, authVerify } = require("../utils/authVerify");
const express = require("express");
const router = express.Router();
const { PlayList } = require("../Models/playlis.model");
const { User } = require("../Models/user.model");
const { Videos } = require("../Models/videos.model");

router.route('')
.get(authVerify, async (req, res) => {
  try {
    const { userId } = req.user;
    const userPlaylist = await PlayList.findOne({ userId: userId }).populate({
      path: "likedVideos",
      model: "Videos",
    });
    console.log(userPlaylist)
    res.json({ status: "success", likedVideos: userPlaylist });
  } catch (error) {
    res.status(400).json({ status: "success", error: error.message });
  }
});

router.param("videoId", async (req, res, next, id) => {
  try {
    console.log(id);
    const videoId = await Videos.findOne({ _id: id });
    if (!videoId) {
      return res.status(400).json({ status: "invalid videoId" });
    }
    req.videoId = videoId._id;
    console.log(videoId._id);
    next();
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
});

router.route("/:videoId")
  .post(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      const videoId = req.videoId;
      const userPlaylist = await PlayList.findOne({ userId: userId });
      userPlaylist.likedVideos.push(videoId);
      userPlaylist.save();
      res.json({ status: "success, video added in liked videos", userPlaylist });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  })

  .delete(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      const  videoId  = req.videoId;
      const userPlaylist = await PlayList.findOne({ userId: userId });
      const news = await PlayList.updateOne({userId: userId}, 
        {"$pull": {'likedVideos': videoId}})
      res.json({
        status: "success, removed from playlist",
        likedVideos: userPlaylist.likedVideos,
        another: news
      });
    } catch (error) {
      res.status(400).json({ status: "failed", error: error.message });
    }
  });

module.exports = router;
