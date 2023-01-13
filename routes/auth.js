var express = require("express");
var router = express.Router();
var pool = require("./pool");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.SECRET;
const saltRounds = process.env.SALT_ROUNDS;

/*
console.log(secretKey);
console.log(saltRounds);
console.log(pool);
console.log(jwt);
console.log(bcrypt);
*/

router.post("/register", function (req, res) {
  const mobileno = req.body.mobileno;
  const emailid = req.body.emailid;
  const username = req.body.username;
  const password = req.body.password;
});

module.exports = router;
