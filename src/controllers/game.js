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
    const { id, player, score } = req.body;
    console.log({ id, player, score });
    if (!id || !player || !score) {
      return next("Incomplete info");
    }

    let done;
    let winner = "";

    const { progress } = await Game.findById(id);

    const copy = { ...progress };

    if (player === "player1") {
      progress.player2 !== "null"
        ? (() => {
            done = true;
            copy[player] = score;
          })()
        : (done = false);
    } else {
      progress.player1 !== "null"
        ? (() => {
            done = true;
            copy[player] = score;
          })()
        : (done = false);
    }

    if (done) {
      switch (true) {
        case copy.player1 * 1 === copy.player2 * 1:
          winner = "draw";
          break;
        case copy.player1 * 1 > copy.player2 * 1:
          winner = "player1";
          break;
        case copy.player1 * 1 < copy.player2 * 1:
          winner = "player2";
          break;

        default:
          break;
      }
    }

    const updatedGame = await Game.findByIdAndUpdate(
      id,
      {
        progress: { ...progress, [player]: score },
        done,
        winner,
      },
      { new: true }
    );

    if (done) {
      if (winner === "player1") {
        await User.findByIdAndUpdate(updatedGame.player1, {
          $inc: { points: 500 },
        });
        await User.findByIdAndUpdate(updatedGame.player2, {
          $inc: { points: -200 },
        });
      } else if (winner === "player2") {
        await User.findByIdAndUpdate(updatedGame.player2, {
          $inc: { points: 500 },
        });
        await User.findByIdAndUpdate(updatedGame.player1, {
          $inc: { points: -200 },
        });
      } else {
        await User.findByIdAndUpdate(updatedGame.player2, {
          $inc: { points: 200 },
        });
        await User.findByIdAndUpdate(updatedGame.player1, {
          $inc: { points: 200 },
        });
      }
    }

    res.json(updatedGame);
  } catch (err) {
    next(err);
  }
};

const fetchGames = async (req, res, next) => {
  try {
    const games = await Game.find({
      $or: [{ player1: req.params.id }, { player2: req.params.id }],
    })
      .populate(["player1", "player2"])
      .sort({ cretedAt: -1 });
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
