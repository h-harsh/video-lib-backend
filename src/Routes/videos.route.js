const express = require("express");
const router = express.Router();
const { Videos } = require("../Models/videos.model");

router.route("/").get(async (req, res) => {
    const allVideos = await Videos.find({});
    res.json({ status: "success", data: allVideos });
});

module.exports = router;
