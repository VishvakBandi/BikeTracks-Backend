const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// user schema to store email/password
// email is unique to the account
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// pre-function that runs before user is saved on db
// generates a salt for the password
userSchema.pre("save", function (next) {
  const user = this;

  // if the password hasn't been modified, return
  if (!user.isModified("password")) {
    return next();
  }

  // otherwise, generate the salt
  // return any errors
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // generate a hash using the salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash; // set the password field to the hash
      next();
    }); // hash
  }); // genSalt
}); // pre-function

// helper method to verify password
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;

  // compares the 2 passwords using bcrypt and returns a promise
  // rejects if they do not match, resolves fi they do
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      return resolve(true);
    }); // bcrypt compare
  }); // Promise
}; // comparePassword

// defind the user model
mongoose.model("User", userSchema);
