const express=require('express');
const router=express.Router();

const {createUser,login }= require('../controller/user.controller.js');
const User = require("../model/user.model.js");

const auth = require("../middleware/auth");

router.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// Register
router.post("/register",createUser )

// Login
router.post("/login", login)

module.exports=router;