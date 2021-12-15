const User = require("../models/user");

function TransformUser(user) {
  var newUser = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  return newUser;
}

const register = function (req, res, next) {
  try {
    var new_user = new User();

    console.log({ body: req.body });

    new_user.username = req.body.username;
    new_user.password = req.body.password;
    new_user.email = req.body.email;

    new_user.save(function (err, saved) {
      if (!err) {
        res.send({
          data: { success: true, message: "New User Created", user: saved },
        });
      } else {
        res.send({
          error: {
            type: "DBException",
            message: err,
          },
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

const authenticate = function (req, res, next) {
  try {
    const { name, password } = req.body;
    if (!name || !name.length) {
      return res.status(400).json({
        success: false,
        message: "No username provided",
      });
    }

    console.log(User);
    User.findOne(
      {
        username: name,
      },
      function (err, user) {
        if (err) {
          return res.status(500).json({
            success: false,
            err,
          });
        }

        if (!user) {
          return res.json({
            success: false,
            message: "Authentication failed. User not found.",
          });
        }

        user.checkPassword(password, function (err, check) {
          if (err)
            return res.status(403).json({
              success: false,
              message: err,
            });

          user.auth(function (err, token) {
            token.user = TransformUser(user);
            token.success = true;
            console.log("auth token: ", token);
            req.user = token.user;
            return res.json(token);
          });
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

const getUserInfo = async function (req, res, next) {
  try {
    try {
      const { id } = req.params;

      const user = await User.findById(id).populate(["friends", "games"]);

      res.json({ user });
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { register, authenticate, getUserInfo };
