const Quiz = require("../models/quiz");

const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.find();
    res.json({ quiz });
  } catch (err) {
    next(err);
  }
};

const addQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.json({ quiz });
  } catch (err) {
    next(err);
  }
};

const addQuizBatch = async (req, res, next) => {
  const { difficulty, quizes } = req.body;
  try {
    quizes?.map(async (item) => {
      await Quiz.create({ ...item, difficulty });
    });

    res.json({ message: "added succesfully" });
  } catch (err) {
    next(err);
  }
};

const editQuiz = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Quiz.findByIdAndUpdate(id, req.body);
    res.json({ message: "edit successful" });
  } catch (err) {
    next(err);
  }
};

const deleteQuiz = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Quiz.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuiz, addQuiz, editQuiz, deleteQuiz, addQuizBatch };
