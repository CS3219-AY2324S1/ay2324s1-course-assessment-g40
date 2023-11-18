const { authJwt } = require("../middlewares");

const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  var router = require("express").Router();

  router.post("/signin", controller.signin);
  router.post("/signout", controller.signout);
  router.get("/verify", authJwt.verifyToken);
  router.get("/verifyAdmin", authJwt.isAdmin);

  app.use('/auth', router);
};