// https://expressjs.com/en/guide/using-middleware.html

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

// middleware to verify authentication
module.exports = (req, res, next) => {
  // auth === "bearer + token"
  // need both to successfully login
  const { authorization } = req.headers;

  // errors out if not logged in
  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }

  // extracts the token from the auth object
  const token = authorization.replace("Bearer ", "");

  // verifies the token with the database
  jwt.verify(token, "WebServerKey", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }

    // gets userId
    const { userId } = payload;

    // tells mongoose to find the ID in the mongodb database
    const user = await User.findById(userId);
    req.user = user;
    next();
  }); // verify
}; // middleware
