var mongoose = require("mongoose");

var QuizSchema = mongoose.Schema({
  word: { type: String },
  meaning: { type: String },
  options: [],
  correctIndex: { type: Number },
  difficulty: {
    type: String,
    enum: ["easy", "intermediate", "hard"],
  },
});

module.exports = mongoose.model("Quiz", QuizSchema, "quizes");
