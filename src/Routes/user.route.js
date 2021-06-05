const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model");

router.route("/")
// Signup
  .post(async (req, res) => {
    try {
      const user = req.body;
      let NewUser = new User(user);
      await NewUser.save();
      res.json({ status: "success", user: NewUser });
    } catch (error) {
      res.status(404).json({ status: "failed", message: error.message });
    }
  });

// Login
router.param("userName", async(req, res, next, id) => {
  try{
    const user = await  User.findOne({name: id})
  if(!id){
    return res.status(404).json({status: "failed", message: "no user found"})
  }
  req.user = user
  next();
  } catch(error){
    res.status(404).json({message: "Invalid Credentials, Please Recheck"})
  }
} )

// Sent userid after login for further things
router.route("/:userName")
.get((req, res) => {
  const user = req.user
  res.json({status: "success", userId: user._id })
})
module.exports = router;
