var mongoose = require("mongoose");

var GameSchema = mongoose.Schema({
  player1: { type: mongoose.Types.ObjectId, ref: "User" },
  player2: { type: mongoose.Types.ObjectId, ref: "User" },
  quiz: [],
  progress: {
    player1: {
      type: String || Number,
      enum: ["null", 0, 1, 2, 3, 4, 5, 6],
      default: "null",
    },
    player2: {
      type: String || Number,
      enum: ["null", 0, 1, 2, 3, 4, 5, 6],
      default: "null",
    },
  },
  winner: { type: String },
  done: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Game", GameSchema, "games");
