var mongoose = require("mongoose");

var GameSchema = mongoose.Schema({
  player1: { type: mongoose.Types.ObjectId, ref: "User" },
  player2: { type: mongoose.Types.ObjectId, ref: "User" },
  quiz: [],
  progress: {
    player1: [],
    player2: [],
  },
  done: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Game", GameSchema, "games");
