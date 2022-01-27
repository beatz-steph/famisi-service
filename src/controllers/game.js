const Game = require("../models/game");
const User = require("../models/user");

const startGame = async (req, res, next) => {
  try {
    if (!req.body.player1 || !req.body.player2) {
      return next("player id's must be provided");
    }
    const newGame = await Game.create(req.body);

    await User.findByIdAndUpdate(req.body.player1, {
      $push: { games: newGame.id },
    });

    await User.findByIdAndUpdate(req.body.player2, {
      $push: { games: newGame.id },
    });

    res.json({ newGame });
  } catch (err) {
    next(err);
  }
};

const updateGame = async (req, res, next) => {
  try {
    const { id, progress } = req.body;
    if (!progress.player1 || !progress.player2) {
      return next("Player progress must be included");
    }
    const done =
      progress.player1.length === progress.player2.length &&
      progress.player1.length === 6;

    const updatedGame = await Game.findByIdAndUpdate(
      id,
      {
        progress: req.body.progress,
        done,
      },
      { new: true }
    );

    res.json(updatedGame);
  } catch (err) {
    next(err);
  }
};

const fetchGames = async (req, res, next) => {
  try {
    const games = await Game.find({
      $or: [{ player1: req.params.id }, { player2: req.params.id }],
    }).populate(["player1", "player2"]);

    console.log({ games });

    res.json(games);
  } catch (err) {
    next(err);
  }
};

const fetchFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("friends");

    res.json(user.friends);
  } catch (err) {
    next(err);
  }
};

const addFriend = async (req, res, next) => {
  try {
    const { friend, id } = req.body;

    const friendInfo = await User.findOne({ username: friend });

    const user = await User.findByIdAndUpdate(
      id,
      {
        $push: { friends: friendInfo._id },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(friendInfo._id, {
      $push: { friends: id },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { startGame, updateGame, fetchGames, addFriend, fetchFriends };
