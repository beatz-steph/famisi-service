var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var config = require("../config/config");

var UserSchema = mongoose.Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  points: {
    type: String,
    default: 0,
  },
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  games: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Game",
    },
  ],
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password);
  }
  next();
});

UserSchema.methods.checkPassword = function (hash, done) {
  const { username, password } = this;
  bcrypt.compare(hash, password, function (err, res) {
    if (res) return done(null, true);
    return done("Wrong Password!");
  });
};

UserSchema.methods.auth = function (done) {
  const usr = this;
  const token = jwt.sign(
    {
      name: usr.username,
      _id: usr._id,
    },
    config.secret,
    { expiresIn: 86400 }
  );
  done(null, {
    expire: Date.now() + 86400,
    message: "Authorization token",
    token: token,
  });
};

module.exports = mongoose.model("User", UserSchema, "users");
