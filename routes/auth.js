const express = require("express");
const router = express.Router();
const pool = require("./pool");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.SECRET;
const saltRounds = 10;

/*
console.log(secretKey);
console.log(saltRounds);
console.log(pool);
console.log(jwt);
console.log(bcrypt);
*/

router.post("/register", (req, res) => {
  const mobileno = req.body.mobileno;
  const emailid = req.body.emailid;
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (error, hashedPassword) => {
    if (error) {
      //console.log(error);
      res.status(500).json({ status: false, message: "Bcrypt Error!" });
    } else {
      pool.query(
        "insert into users (mobileno, emailid, username, userpassword) values(?, ?, ?, ?)",
        [mobileno, emailid, username, hashedPassword],
        function (error, result) {
          if (error) {
            //console.log(error);
            res
              .status(500)
              .json({ status: false, message: "Registration Failed!" });
          } else {
            //console.log(result);
            res
              .status(200)
              .json({ status: true, message: "Registration Successful!" });
          }
        }
      );
    }
  });
});

router.post("/login", (req, res) => {
  //console.log(req.body);

  const emailid = req.body.emailid;
  const password = req.body.password;

  pool.query(
    "select * from users where emailid = ?",
    [emailid],
    function (error, result) {
      if (error) {
        res.status(500).send({ error: error });
      } else {
        if (result.length == 1) {
          bcrypt.compare(
            password,
            result[0].userpassword,
            (error, response) => {
              if (response) {
                const id = result[0].userid;

                const token = jwt.sign({ id }, secretKey, {
                  expiresIn: "1d",
                });

                res
                  .status(200)
                  .json({ auth: true, token: token, data: result });
              } else {
                res.status(404).json({
                  auth: false,
                  message: "Wrong Username or Password!",
                });
              }
            }
          );
        } else {
          res.status(404).json({
            auth: false,
            message: "No User Exists",
          });
        }
      }
    }
  );
});

const verifyJWT = (req, res, next) => {
  //console.log(req.headers);

  const token = req.headers.authorization;
  //console.log("Token : ", token);

  if (!token) {
    req
      .status(404)
      .send("You are not authenticated, Generate a token and, Try Again!");
  } else {
    jwt.verify(token, secretKey, (error, decoded) => {
      //console.log(decoded);

      if (error) {
        //console.log(error);
        res.status(500).send("Invalid Token!");
      } else {
        req.userid = decoded.id;
        next();
      }
    });
  }
};

router.get("/isUserAuth", verifyJWT, (req, res) => {
  res.send("You are authenticated!");
});

module.exports = router;
