const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../Models/user.model");
const { PlayList } = require("../Models/playlis.model");

const saltRounds = 10;
const secret =
  "gEf3gs2kMagd2CHDXpEjwGJlbVewlqE7ARhD2UIYUJsM8V9c71E4rYGI0AXIn5J2pAi2TrMQHD7FAJOTtLIYIShHDjZjTwvzHodjwutvbTcFCnksFiCBFpqpQqucxyairN4X3hQbmiuKqJQW9XSeblgU5v2BQrEZs86YhgrGxQtWujl3NMu9NRwa9x9noEY7OnuabuIAYNCmsnGC39iq32nBOPvtA4BP+sVuMKW6Qd6//lSr1pSzYHZ9KMYUDnTDvnXQ3q5uSpCGcRTS3//G/nfUdjxjcbz1z9B2hvL+Oh/RXNI1DeFdwphwP9pbJqICm81l1WUe0H7Vs/6irJEq6w==";

router
  .route("/")
  // Signup
  .post(async (req, res) => {
    try {
      const user = req.body;
      bcrypt.hash(user.password, saltRounds, async function (err, hash) {
        const NewUser = new User({ ...user, password: hash });
        await NewUser.save();
        const NewUserPlaylist = new PlayList({ userId: NewUser._id });
        await NewUserPlaylist.save();
        return res.json({
          status: "Signup successful",
          user: NewUser,
          playlist: NewUserPlaylist,
        });
      });
    } catch (error) {
      res
        .status(404)
        .json({ status: "failed to signup", message: error.message });
    }
  });

router.get("/", async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ name: userName });

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      const token = jwt.sign({ userId: user._id }, secret);
      res.json({ status: "login success", userId: user._id, token: token });
    } else {
      res.status(401).json({ message: "login failed invalid details entered" });
    }
  });
});

module.exports = router;
