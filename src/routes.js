const errorHandler = require("./erroHandler");

module.exports = function (express, app) {
  const Auth = require("./controllers/auth");
  const Game = require("./controllers/game");
  const Quiz = require("./controllers/quiz");

  var apiRoutes = express.Router();

  app.use("/api", apiRoutes);
  apiRoutes.get("/", (req, res, next) => {
    res.json({ message: "Welcome" });
  });

  apiRoutes.post("/auth/signup", Auth.register);
  apiRoutes.post("/auth/signin", Auth.authenticate);
  apiRoutes.get("/auth/info/:id", Auth.getUserInfo);
  apiRoutes.post("/game/start", Game.startGame);
  apiRoutes.post("/game/update", Game.updateGame);
  apiRoutes.get("/game/:id", Game.fetchGames);
  apiRoutes.get("/friends/:id", Game.fetchFriends);
  apiRoutes.post("/friends/add", Game.addFriend);
  apiRoutes.get("/quiz", Quiz.getQuiz);
  apiRoutes.post("/quiz/new", Quiz.addQuiz);
  apiRoutes.post("/quiz/:id", Quiz.editQuiz);
  apiRoutes.delete("/quiz/:id", Quiz.deleteQuiz);

  app.use(errorHandler);
};
