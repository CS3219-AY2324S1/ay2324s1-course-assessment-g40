const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");

const controller = require("../controllers/user.controller");

module.exports = function(app) {
  var router = require("express").Router();

  router.post(  
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup
  );

  router.get("/all", controller.allAccess);
  router.get("/user", authJwt.verifyToken, controller.userBoard);
  router.get("/admin", authJwt.isAdmin, controller.adminBoard);
  router.post("/updateUser", authJwt.verifyToken, controller.updateUser);
  router.post("/deleteUser", authJwt.verifyToken, controller.deleteUser);
  router.get("/allUsers", authJwt.isAdmin, controller.findAll);

  app.use('/user', router);
};