const mongoose = require("mongoose");
// const {Video} = require('./videos.model')

const PlayListSchema = mongoose.Schema({
  playlists: [
    {
      name: String,
      videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    },
  ],
});
const PlayListSchema = mongoose.Schema({
    name: String,
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

const PlayList = mongoose.model("PlayList", PlayListSchema);

module.exports = { PlayList };
