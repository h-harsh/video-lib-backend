const mongoose = require("mongoose");

const PlayListSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  playlists: [
    {
      playlistName: String,
      videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    },
  ],
  likedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

const PlayList = mongoose.model("PlayList", PlayListSchema);

module.exports = { PlayList };
