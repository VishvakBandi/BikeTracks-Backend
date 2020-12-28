// https://expressjs.com/en/guide/routing.html

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User"); // import user schema

// start router
const router = express.Router();

// process a signup request
router.post("/signup", async (req, res) => {
  // extract email and password
  const { email, password } = req.body;

  // create a new user schema and extract a webtoken
  try {
    // create new user schema
    // wait until it's saved
    const user = new User({ email, password });
    await user.save();

    // sign the userId into a web token
    // send the token back
    const token = jwt.sign({ userId: user._id }, "WebServerKey");
    res.send({ token: token });
  } catch (err) {
    return res.status(422).send(err.message);
  } // error
}); // signup

// process a signin request
router.post("/signin", async (req, res) => {
  // extract email and password
  const { email, password } = req.body;

  // if missing either an email or password, error out
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  // check the database for the email
  const user = await User.findOne({ email });

  // if the email does not exist, throw an error
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  // check for valid password
  try {
    // wait for the password to be compared
    // if it returns an error, returh the invalid message
    await user.comparePassword(password);

    // create a web token
    // send back
    const token = jwt.sign({ userId: user._id }, "WebServerKey");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

// export router
module.exports = router;
